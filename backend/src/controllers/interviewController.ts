import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';
import { z } from 'zod';
import { AiInterviewService, SessionConfig, FinalReportData } from '../services/aiInterviewService';
import { GeminiApiError } from '../services/geminiService';

const CreateInterviewSchema = z.object({
  role: z.string().default('Software Engineer'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  topics: z.array(z.string()).default(['Data Structures and Algorithms']),
  style: z.string().default('mock-company'),
  features: z.array(z.string()).default(['Follow-up Questions', 'Technical Accuracy', 'AI Feedback Report']),
  timeLimitPerQuestion: z.number().min(0).max(300).default(0), // 0 = untimed
});

const SubmitAnswerSchema = z.object({
  answer: z.string().default(''),
  modality: z.enum(['text', 'voice']).default('text'),
  timeSpentSeconds: z.number().optional(),
  timedOut: z.boolean().default(false),
});

function getParamId(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
}

function getMaxTurnsForStyle(style: string): number {
  switch (style) {
    case 'rapid-fire':
      return 6;
    case 'system-design':
      return 6;
    case 'behavioral-round':
      return 6;
    case 'deep-dive':
    case 'mock-company':
    default:
      return 8;
  }
}

/**
 * POST /api/interviews
 * Create a new interview session and generate the opening question live using Gemini API.
 */
export const createInterview = async (req: AuthRequest, res: Response) => {
  try {
    const parseResult = CreateInterviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid configuration parameters',
        details: parseResult.error.format(),
      });
    }

    const { role, difficulty, topics, style, features, timeLimitPerQuestion } = parseResult.data;
    const userId = req.userId || null;
    const maxTurns = getMaxTurnsForStyle(style);

    const sessionConfig: SessionConfig = {
      role,
      difficulty,
      topics,
      style,
      features,
      timeLimitPerQuestion,
    };

    // 1. Generate opening question live using Gemini API
    const openingResult = await AiInterviewService.generateOpeningQuestion(sessionConfig);

    // 2. Persist session and first message in database
    const session = await prisma.interviewSession.create({
      data: {
        userId,
        role,
        difficulty,
        interviewStyle: style,
        selectedTopics: JSON.stringify(topics),
        enabledFeatures: JSON.stringify(features),
        status: 'IN_PROGRESS',
        turnCount: 0,
        maxTurns,
        timeLimitPerQuestion,
        messages: {
          create: {
            sequenceNumber: 1,
            sender: 'interviewer',
            content: openingResult.interviewerMessage,
            questionTopic: openingResult.questionTopic,
            questionType: openingResult.questionType,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return res.status(201).json({
      session: {
        ...session,
        selectedTopics: topics,
        enabledFeatures: features,
      },
      firstMessage: session.messages[0],
      aiProvider: 'gemini',
    });
  } catch (error: any) {
    console.error('Error creating interview session:', error);
    const statusCode = error instanceof GeminiApiError ? error.statusCode : 500;
    const message = error.message || 'Failed to create interview session using AI';
    const canRetry = error instanceof GeminiApiError ? error.canRetry : true;

    return res.status(statusCode).json({
      error: message,
      canRetry,
      code: 'AI_QUESTION_GENERATION_FAILED',
    });
  }
};

/**
 * GET /api/interviews/:id
 * Retrieve session state, conversation history, and evaluation records.
 */
export const getInterview = async (req: AuthRequest, res: Response) => {
  try {
    const id: string = getParamId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Missing session ID' });
    }

    const session = await prisma.interviewSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { sequenceNumber: 'asc' },
        },
        evaluations: true,
        report: true,
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    if (session.userId && req.userId && session.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this session' });
    }

    let topics: string[] = [];
    let features: string[] = [];
    try {
      topics = JSON.parse(session.selectedTopics);
      features = JSON.parse(session.enabledFeatures);
    } catch {
      topics = [session.selectedTopics];
      features = [session.enabledFeatures];
    }

    let parsedReport = null;
    if (session.report) {
      try {
        parsedReport = {
          ...session.report,
          strengths: JSON.parse(session.report.strengths),
          improvementAreas: JSON.parse(session.report.improvementAreas),
          dimensionScores: JSON.parse(session.report.dimensionScores),
          topicScores: session.report.topicScores ? JSON.parse(session.report.topicScores) : {},
          questionReviews: JSON.parse(session.report.questionReviews),
          recommendations: JSON.parse(session.report.recommendations),
          actionablePlan: session.report.actionablePlan ? JSON.parse(session.report.actionablePlan) : [],
        };
      } catch (e) {
        console.error('Failed to parse report fields:', e);
      }
    }

    return res.json({
      session: {
        ...session,
        selectedTopics: topics,
        enabledFeatures: features,
        report: parsedReport,
      },
    });
  } catch (error: any) {
    console.error('Error fetching interview session:', error);
    return res.status(500).json({ error: 'Failed to retrieve interview session' });
  }
};

/**
 * POST /api/interviews/:id/answers
 * Submit candidate answer, evaluate semantically with Gemini, generate next question or follow-up, and persist.
 */
export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const id: string = getParamId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Missing session ID' });
    }

    const parseResult = SubmitAnswerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid answer payload', details: parseResult.error.format() });
    }

    const { answer, timeSpentSeconds, timedOut } = parseResult.data;

    // 1. Verify session exists and is active
    const session = await prisma.interviewSession.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { sequenceNumber: 'asc' } },
        evaluations: true,
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    if (session.userId && req.userId && session.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this session' });
    }

    if (session.status !== 'IN_PROGRESS') {
      return res.status(400).json({
        error: `Session is already ${session.status.toLowerCase()}. Further answers cannot be submitted.`,
      });
    }

    let topics: string[] = [];
    let features: string[] = [];
    try {
      topics = JSON.parse(session.selectedTopics);
      features = JSON.parse(session.enabledFeatures);
    } catch {
      topics = [session.selectedTopics];
      features = [session.enabledFeatures];
    }

    const sessionConfig: SessionConfig = {
      role: session.role,
      difficulty: session.difficulty as any,
      topics,
      style: session.interviewStyle,
      features,
      timeLimitPerQuestion: session.timeLimitPerQuestion,
    };

    const nextTurnCount = session.turnCount + 1;
    const lastSeq = session.messages.length > 0 ? session.messages[session.messages.length - 1].sequenceNumber : 0;

    const finalAnswerText =
      answer.trim() || (timedOut ? '[Time Expired - No response submitted]' : '[No response submitted]');

    // Find the question being answered
    const questionMsg = [...session.messages].reverse().find((m) => m.sender === 'interviewer');
    const currentQuestionText = questionMsg?.content || 'Interview Question';
    const currentQuestionTopic = questionMsg?.questionTopic || sessionConfig.topics[0] || 'Technical';

    // 2. Persist Candidate Response with time metrics
    const candidateMsg = await prisma.interviewMessage.create({
      data: {
        sessionId: id,
        sequenceNumber: lastSeq + 1,
        sender: 'candidate',
        content: finalAnswerText,
        timeSpentSeconds: timeSpentSeconds || null,
        timedOut: timedOut || false,
      },
    });

    // 3. Invoke Live Gemini AI for Semantic Answer Evaluation & Next Turn
    const previousMessagesForAi = [
      ...session.messages.map((m) => ({
        sender: m.sender,
        content: m.content,
        questionTopic: m.questionTopic,
        questionType: m.questionType,
      })),
      { sender: 'candidate', content: finalAnswerText },
    ];

    let turnResult;
    try {
      turnResult = await AiInterviewService.evaluateAndAdvance({
        sessionConfig,
        currentQuestion: currentQuestionText,
        questionTopic: currentQuestionTopic,
        candidateAnswer: finalAnswerText,
        previousMessages: previousMessagesForAi,
        turnCount: nextTurnCount,
        maxTurns: session.maxTurns,
        timeSpentSeconds,
        timedOut,
      });
    } catch (aiErr: any) {
      console.error('Gemini answer evaluation failed:', aiErr);
      const statusCode = aiErr instanceof GeminiApiError ? aiErr.statusCode : 502;
      return res.status(statusCode).json({
        error: aiErr.message || 'Gemini AI answer evaluation failed. Please click retry.',
        canRetry: true,
        code: 'AI_EVALUATION_FAILED',
        candidateMessage: candidateMsg,
      });
    }

    // 4. Persist 10-point Evaluation records in database
    if (turnResult.evaluation) {
      const evalData = turnResult.evaluation;
      const evaluationEntries: Array<{ dimension: string; score: number }> = [
        { dimension: 'technicalAccuracy', score: evalData.technicalAccuracy },
        { dimension: 'conceptualUnderstanding', score: evalData.conceptualUnderstanding },
        { dimension: 'completeness', score: evalData.completeness },
        { dimension: 'communicationClarity', score: evalData.communicationClarity },
        { dimension: 'problemSolving', score: evalData.problemSolving },
        { dimension: 'practicalApplication', score: evalData.practicalApplication },
      ];

      if (evalData.confidence !== undefined) {
        evaluationEntries.push({ dimension: 'confidence', score: evalData.confidence });
      }
      if (evalData.timeManagement !== undefined) {
        evaluationEntries.push({ dimension: 'timeManagement', score: evalData.timeManagement });
      }

      for (const entry of evaluationEntries) {
        await prisma.interviewEvaluation.create({
          data: {
            sessionId: id,
            messageId: candidateMsg.id,
            questionText: currentQuestionText,
            candidateAnswer: finalAnswerText,
            dimension: entry.dimension,
            score: entry.score,
            rationale: evalData.evaluationExplanation,
            evidence: evalData.evidenceFromAnswer,
          },
        });
      }
    }

    // 5. Persist Next Interviewer Message
    const interviewerMsg = await prisma.interviewMessage.create({
      data: {
        sessionId: id,
        sequenceNumber: lastSeq + 2,
        sender: 'interviewer',
        content: turnResult.nextInterviewerMessage,
        questionTopic: turnResult.nextQuestionTopic,
        questionType: turnResult.nextQuestionType,
      },
    });

    // 6. Handle Completion if indicated or turn budget reached
    let reportData: FinalReportData | null = null;
    const isCompleted = turnResult.isComplete || nextTurnCount >= session.maxTurns;

    if (isCompleted) {
      const allMessages = await prisma.interviewMessage.findMany({
        where: { sessionId: id },
        orderBy: { sequenceNumber: 'asc' },
      });
      const allEvals = await prisma.interviewEvaluation.findMany({
        where: { sessionId: id },
      });

      try {
        console.log(`[InterviewController] Auto-generating final report on interview completion for session ${id}...`);
        reportData = await AiInterviewService.generateFinalReport({
          sessionConfig,
          messages: allMessages,
          evaluations: allEvals,
        });

        await prisma.$transaction([
          prisma.interviewReport.upsert({
            where: { sessionId: id },
            create: {
              sessionId: id,
              overallScore: reportData.overallScore,
              performanceGrade: reportData.performanceGrade,
              summary: reportData.summary,
              strengths: JSON.stringify(reportData.strengths),
              improvementAreas: JSON.stringify(reportData.improvementAreas),
              dimensionScores: JSON.stringify(reportData.dimensionScores),
              topicScores: JSON.stringify(reportData.topicScores),
              questionReviews: JSON.stringify(reportData.questionReviews),
              recommendations: JSON.stringify(reportData.recommendations),
              actionablePlan: JSON.stringify(reportData.actionablePlan),
              interviewerFeedback: reportData.interviewerFeedback,
            },
            update: {
              overallScore: reportData.overallScore,
              performanceGrade: reportData.performanceGrade,
              summary: reportData.summary,
              strengths: JSON.stringify(reportData.strengths),
              improvementAreas: JSON.stringify(reportData.improvementAreas),
              dimensionScores: JSON.stringify(reportData.dimensionScores),
              topicScores: JSON.stringify(reportData.topicScores),
              questionReviews: JSON.stringify(reportData.questionReviews),
              recommendations: JSON.stringify(reportData.recommendations),
              actionablePlan: JSON.stringify(reportData.actionablePlan),
              interviewerFeedback: reportData.interviewerFeedback,
            },
          }),
          prisma.interviewSession.update({
            where: { id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date(),
              turnCount: nextTurnCount,
            },
          }),
        ]);
        console.log(`[InterviewController] Report successfully auto-generated and saved for session ${id}`);
      } catch (repErr: any) {
        console.warn(`[InterviewController] Final report generation deferred for session ${id}: ${repErr.message}. Marking session completed for manual retry.`);
        await prisma.interviewSession.update({
          where: { id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            turnCount: nextTurnCount,
          },
        });
      }
    } else {
      await prisma.interviewSession.update({
        where: { id },
        data: { turnCount: nextTurnCount },
      });
    }

    return res.json({
      candidateMessage: candidateMsg,
      interviewerMessage: interviewerMsg,
      evaluation: turnResult.evaluation,
      isComplete: isCompleted,
      turnCount: nextTurnCount,
      maxTurns: session.maxTurns,
      report: reportData,
      aiProvider: 'gemini',
    });
  } catch (error: any) {
    console.error('Error submitting answer to interview:', error);
    const statusCode = error instanceof GeminiApiError ? error.statusCode : 500;
    return res.status(statusCode).json({
      error: error.message || 'Failed to process answer submission',
      canRetry: true,
      code: 'SUBMIT_ANSWER_FAILED',
    });
  }
};

/**
 * POST /api/interviews/:id/end
 * Conclude an active interview session and generate the final report live using Gemini API.
 */
export const endInterview = async (req: AuthRequest, res: Response) => {
  try {
    const id: string = getParamId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Missing session ID' });
    }

    const session = await prisma.interviewSession.findUnique({
      where: { id },
      include: {
        report: true,
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    if (session.userId && req.userId && session.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this session' });
    }

    // If report already exists, return it directly
    if (session.report) {
      return res.json({
        success: true,
        report: {
          ...session.report,
          strengths: JSON.parse(session.report.strengths),
          improvementAreas: JSON.parse(session.report.improvementAreas),
          dimensionScores: JSON.parse(session.report.dimensionScores),
          topicScores: session.report.topicScores ? JSON.parse(session.report.topicScores) : {},
          questionReviews: JSON.parse(session.report.questionReviews),
          recommendations: JSON.parse(session.report.recommendations),
          actionablePlan: session.report.actionablePlan ? JSON.parse(session.report.actionablePlan) : [],
        },
      });
    }

    let topics: string[] = [];
    let features: string[] = [];
    try {
      topics = JSON.parse(session.selectedTopics);
      features = JSON.parse(session.enabledFeatures);
    } catch {
      topics = [session.selectedTopics];
      features = [session.enabledFeatures];
    }

    const sessionConfig: SessionConfig = {
      role: session.role,
      difficulty: session.difficulty as any,
      topics,
      style: session.interviewStyle,
      features,
      timeLimitPerQuestion: session.timeLimitPerQuestion,
    };

    const messages = await prisma.interviewMessage.findMany({
      where: { sessionId: id },
      orderBy: { sequenceNumber: 'asc' },
    });

    const evaluations = await prisma.interviewEvaluation.findMany({
      where: { sessionId: id },
    });

    // 1. Generate Final Report LIVE using Gemini API from actual evaluations BEFORE marking completed
    let reportData: FinalReportData;
    try {
      console.log(`[InterviewController] Generating final report for session ${id} (Role: ${session.role}, Difficulty: ${session.difficulty}, Turns: ${messages.length})...`);
      reportData = await AiInterviewService.generateFinalReport({
        sessionConfig,
        messages,
        evaluations,
      });
    } catch (genErr: any) {
      console.error(`[InterviewController] Gemini report generation failed for session ${id}:`, genErr.message);
      const statusCode = genErr instanceof GeminiApiError ? genErr.statusCode : 502;
      return res.status(statusCode).json({
        error: genErr.message || 'Failed to generate AI assessment report. Your interview responses are saved. Please click Retry Report.',
        canRetry: true,
        code: 'REPORT_GENERATION_FAILED',
      });
    }

    // 2. Atomic persistence: Upsert report and mark session COMPLETED together
    const [savedReport] = await prisma.$transaction([
      prisma.interviewReport.upsert({
        where: { sessionId: id },
        create: {
          sessionId: id,
          overallScore: reportData.overallScore,
          performanceGrade: reportData.performanceGrade,
          summary: reportData.summary,
          strengths: JSON.stringify(reportData.strengths),
          improvementAreas: JSON.stringify(reportData.improvementAreas),
          dimensionScores: JSON.stringify(reportData.dimensionScores),
          topicScores: JSON.stringify(reportData.topicScores),
          questionReviews: JSON.stringify(reportData.questionReviews),
          recommendations: JSON.stringify(reportData.recommendations),
          actionablePlan: JSON.stringify(reportData.actionablePlan),
          interviewerFeedback: reportData.interviewerFeedback,
        },
        update: {
          overallScore: reportData.overallScore,
          performanceGrade: reportData.performanceGrade,
          summary: reportData.summary,
          strengths: JSON.stringify(reportData.strengths),
          improvementAreas: JSON.stringify(reportData.improvementAreas),
          dimensionScores: JSON.stringify(reportData.dimensionScores),
          topicScores: JSON.stringify(reportData.topicScores),
          questionReviews: JSON.stringify(reportData.questionReviews),
          recommendations: JSON.stringify(reportData.recommendations),
          actionablePlan: JSON.stringify(reportData.actionablePlan),
          interviewerFeedback: reportData.interviewerFeedback,
        },
      }),
      prisma.interviewSession.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      }),
    ]);

    console.log(`[InterviewController] Successfully generated and persisted report for session ${id}: Score ${reportData.overallScore}/100 (${reportData.performanceGrade})`);

    return res.json({
      success: true,
      report: {
        ...savedReport,
        strengths: reportData.strengths,
        improvementAreas: reportData.improvementAreas,
        dimensionScores: reportData.dimensionScores,
        topicScores: reportData.topicScores,
        questionReviews: reportData.questionReviews,
        recommendations: reportData.recommendations,
        actionablePlan: reportData.actionablePlan,
        interviewerFeedback: reportData.interviewerFeedback,
      },
    });
  } catch (error: any) {
    console.error('Error ending interview:', error);
    const statusCode = error instanceof GeminiApiError ? error.statusCode : 502;
    return res.status(statusCode).json({
      error: error.message || 'Failed to generate AI assessment report. Please click retry.',
      canRetry: true,
      code: 'REPORT_GENERATION_FAILED',
    });
  }
};

/**
 * POST /api/interviews/:id/retry-report
 * Dedicated retry mechanism if report generation previously failed
 */
export const retryReport = async (req: AuthRequest, res: Response) => {
  return endInterview(req, res);
};

/**
 * GET /api/interviews/:id/report
 * Retrieve the final report for a completed session.
 */
export const getInterviewReport = async (req: AuthRequest, res: Response) => {
  try {
    const id: string = getParamId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Missing session ID' });
    }

    const report = await prisma.interviewReport.findUnique({
      where: { sessionId: id },
      include: {
        session: true,
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found for this interview session' });
    }

    if (report.session.userId && req.userId && report.session.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this report' });
    }

    return res.json({
      report: {
        ...report,
        strengths: JSON.parse(report.strengths),
        improvementAreas: JSON.parse(report.improvementAreas),
        dimensionScores: JSON.parse(report.dimensionScores),
        topicScores: report.topicScores ? JSON.parse(report.topicScores) : {},
        questionReviews: JSON.parse(report.questionReviews),
        recommendations: JSON.parse(report.recommendations),
        actionablePlan: report.actionablePlan ? JSON.parse(report.actionablePlan) : [],
      },
    });
  } catch (error: any) {
    console.error('Error fetching interview report:', error);
    return res.status(500).json({ error: 'Failed to retrieve report' });
  }
};

/**
 * GET /api/interviews
 * List previous interview sessions for the current authenticated user.
 */
export const listUserInterviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const whereClause = userId ? { userId } : {};

    const sessions = await prisma.interviewSession.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 25,
      include: {
        report: {
          select: {
            overallScore: true,
            performanceGrade: true,
            summary: true,
            createdAt: true,
          },
        },
      },
    });

    const formatted = sessions.map((s) => {
      let topics: string[] = [];
      try {
        topics = JSON.parse(s.selectedTopics);
      } catch {
        topics = [s.selectedTopics];
      }

      return {
        id: s.id,
        role: s.role,
        difficulty: s.difficulty,
        interviewStyle: s.interviewStyle,
        topics,
        status: s.status,
        turnCount: s.turnCount,
        maxTurns: s.maxTurns,
        timeLimitPerQuestion: s.timeLimitPerQuestion,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
        overallScore: s.report?.overallScore || null,
        performanceGrade: s.report?.performanceGrade || null,
        summary: s.report?.summary || null,
      };
    });

    return res.json({ sessions: formatted });
  } catch (error: any) {
    console.error('Error listing user interviews:', error);
    return res.status(500).json({ error: 'Failed to retrieve interview history' });
  }
};
