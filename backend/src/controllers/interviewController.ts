import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';
import { z } from 'zod';
import { AiInterviewService, SessionConfig } from '../services/aiInterviewService';

const CreateInterviewSchema = z.object({
  role: z.string().default('SDE 1'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  topics: z.array(z.string()).default(['Arrays', 'Trees']),
  style: z.string().default('mock-company'),
  features: z.array(z.string()).default(['Follow-up Questions', 'Technical Accuracy', 'AI Feedback Report']),
});

const SubmitAnswerSchema = z.object({
  answer: z.string().min(1, 'Answer cannot be empty'),
  modality: z.enum(['text', 'voice']).default('text'),
});

function getParamId(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
}

// Helper to determine maximum turns based on interview style
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
 * Create a new interview session and generate the opening question.
 */
export const createInterview = async (req: AuthRequest, res: Response) => {
  try {
    const parseResult = CreateInterviewSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid configuration parameters', details: parseResult.error.format() });
    }

    const { role, difficulty, topics, style, features } = parseResult.data;
    const userId = req.userId || null;
    const maxTurns = getMaxTurnsForStyle(style);

    const sessionConfig: SessionConfig = {
      role,
      difficulty,
      topics,
      style,
      features,
    };

    // 1. Generate opening question from AI service
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

    // Notice if voice interview was checked
    const voiceNotice = features.includes('Voice Interview')
      ? 'Voice Interview mode is currently in preview. Proceeding with seamless text input.'
      : undefined;

    return res.status(201).json({
      session: {
        ...session,
        selectedTopics: topics,
        enabledFeatures: features,
      },
      firstMessage: session.messages[0],
      aiProvider: openingResult.aiProvider,
      missingConfigNotice: openingResult.missingConfigNotice,
      voiceNotice,
    });
  } catch (error: any) {
    console.error('Error creating interview session:', error);
    return res.status(500).json({ error: 'Failed to create interview session' });
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

    // Ownership verification for authenticated sessions
    if (session.userId && req.userId && session.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this session' });
    }

    // Safe parse JSON fields
    let topics: string[] = [];
    let features: string[] = [];
    try {
      topics = JSON.parse(session.selectedTopics);
      features = JSON.parse(session.enabledFeatures);
    } catch {
      topics = [session.selectedTopics];
      features = [session.enabledFeatures];
    }

    return res.json({
      session: {
        ...session,
        selectedTopics: topics,
        enabledFeatures: features,
      },
    });
  } catch (error: any) {
    console.error('Error fetching interview session:', error);
    return res.status(500).json({ error: 'Failed to retrieve interview session' });
  }
};

/**
 * POST /api/interviews/:id/answers
 * Submit candidate answer, evaluate, generate next question or follow-up, and persist.
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

    const { answer } = parseResult.data;

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

    // Parse topics and features
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
    };

    const nextTurnCount = session.turnCount + 1;
    const lastSeq = session.messages.length > 0 ? session.messages[session.messages.length - 1].sequenceNumber : 0;

    // 2. Persist Candidate Response
    const candidateMsg = await prisma.interviewMessage.create({
      data: {
        sessionId: id,
        sequenceNumber: lastSeq + 1,
        sender: 'candidate',
        content: answer,
      },
    });

    // 3. Invoke AI Interviewer for Evaluation and Next Turn
    const previousMessagesForAi = [
      ...session.messages.map((m) => ({
        sender: m.sender,
        content: m.content,
        questionTopic: m.questionTopic,
        questionType: m.questionType,
      })),
      { sender: 'candidate', content: answer },
    ];

    const turnResult = await AiInterviewService.evaluateAndAdvance({
      sessionConfig,
      candidateAnswer: answer,
      previousMessages: previousMessagesForAi,
      turnCount: nextTurnCount,
      maxTurns: session.maxTurns,
    });

    // 4. Persist Evaluation records if provided
    if (turnResult.evaluation) {
      const dims = turnResult.evaluation.dimensions;
      const questionMsg = [...session.messages].reverse().find((m) => m.sender === 'interviewer');

      const evaluationEntries: Array<{ dimension: string; score: number }> = [];
      if (dims.technicalAccuracy !== undefined) {
        evaluationEntries.push({ dimension: 'technicalAccuracy', score: dims.technicalAccuracy });
      }
      if (dims.problemSolving !== undefined) {
        evaluationEntries.push({ dimension: 'problemSolving', score: dims.problemSolving });
      }
      if (dims.complexityAnalysis !== undefined) {
        evaluationEntries.push({ dimension: 'complexityAnalysis', score: dims.complexityAnalysis });
      }
      if (dims.communication !== undefined) {
        evaluationEntries.push({ dimension: 'communication', score: dims.communication });
      }
      if (dims.confidence !== undefined) {
        evaluationEntries.push({ dimension: 'confidence', score: dims.confidence });
      }
      if (dims.behavioral !== undefined) {
        evaluationEntries.push({ dimension: 'behavioral', score: dims.behavioral });
      }

      for (const entry of evaluationEntries) {
        await prisma.interviewEvaluation.create({
          data: {
            sessionId: id,
            messageId: candidateMsg.id,
            questionText: questionMsg?.content || null,
            candidateAnswer: answer,
            dimension: entry.dimension,
            score: entry.score,
            rationale: turnResult.evaluation.feedback,
            evidence: turnResult.evaluation.evidence,
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
        content: turnResult.interviewerMessage,
        questionTopic: turnResult.questionTopic,
        questionType: turnResult.questionType,
      },
    });

    // 6. Handle Completion if indicated or turn budget reached
    let reportData = null;
    if (turnResult.isComplete || nextTurnCount >= session.maxTurns) {
      await prisma.interviewSession.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          turnCount: nextTurnCount,
        },
      });

      // Generate Final Report
      const allMessages = await prisma.interviewMessage.findMany({
        where: { sessionId: id },
        orderBy: { sequenceNumber: 'asc' },
      });
      const allEvals = await prisma.interviewEvaluation.findMany({
        where: { sessionId: id },
      });

      reportData = await AiInterviewService.generateFinalReport({
        sessionConfig,
        messages: allMessages,
        evaluations: allEvals,
      });

      await prisma.interviewReport.upsert({
        where: { sessionId: id },
        create: {
          sessionId: id,
          overallScore: reportData.overallScore,
          summary: reportData.summary,
          strengths: JSON.stringify(reportData.strengths),
          improvementAreas: JSON.stringify(reportData.improvementAreas),
          dimensionScores: JSON.stringify(reportData.dimensionScores),
          questionReviews: JSON.stringify(reportData.questionReviews),
          recommendations: JSON.stringify(reportData.recommendations),
        },
        update: {
          overallScore: reportData.overallScore,
          summary: reportData.summary,
          strengths: JSON.stringify(reportData.strengths),
          improvementAreas: JSON.stringify(reportData.improvementAreas),
          dimensionScores: JSON.stringify(reportData.dimensionScores),
          questionReviews: JSON.stringify(reportData.questionReviews),
          recommendations: JSON.stringify(reportData.recommendations),
        },
      });
    } else {
      // Just update turn count
      await prisma.interviewSession.update({
        where: { id },
        data: { turnCount: nextTurnCount },
      });
    }

    return res.json({
      candidateMessage: candidateMsg,
      interviewerMessage: interviewerMsg,
      evaluation: turnResult.evaluation,
      isComplete: turnResult.isComplete || nextTurnCount >= session.maxTurns,
      turnCount: nextTurnCount,
      maxTurns: session.maxTurns,
      report: reportData,
      aiProvider: turnResult.aiProvider,
      missingConfigNotice: turnResult.missingConfigNotice,
    });
  } catch (error: any) {
    console.error('Error submitting answer to interview:', error);
    return res.status(500).json({ error: 'Failed to process answer submission' });
  }
};

/**
 * POST /api/interviews/:id/end
 * Conclude an active interview session early and generate the final diagnostic report.
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
          questionReviews: JSON.parse(session.report.questionReviews),
          recommendations: JSON.parse(session.report.recommendations),
        },
      });
    }

    // Mark session as completed
    await prisma.interviewSession.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Parse configuration
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
    };

    const messages = await prisma.interviewMessage.findMany({
      where: { sessionId: id },
      orderBy: { sequenceNumber: 'asc' },
    });

    const evaluations = await prisma.interviewEvaluation.findMany({
      where: { sessionId: id },
    });

    const reportData = await AiInterviewService.generateFinalReport({
      sessionConfig,
      messages,
      evaluations,
    });

    const createdReport = await prisma.interviewReport.create({
      data: {
        sessionId: id,
        overallScore: reportData.overallScore,
        summary: reportData.summary,
        strengths: JSON.stringify(reportData.strengths),
        improvementAreas: JSON.stringify(reportData.improvementAreas),
        dimensionScores: JSON.stringify(reportData.dimensionScores),
        questionReviews: JSON.stringify(reportData.questionReviews),
        recommendations: JSON.stringify(reportData.recommendations),
      },
    });

    return res.json({
      success: true,
      report: {
        ...createdReport,
        strengths: reportData.strengths,
        improvementAreas: reportData.improvementAreas,
        dimensionScores: reportData.dimensionScores,
        questionReviews: reportData.questionReviews,
        recommendations: reportData.recommendations,
      },
    });
  } catch (error: any) {
    console.error('Error ending interview:', error);
    return res.status(500).json({ error: 'Failed to conclude interview session' });
  }
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
        questionReviews: JSON.parse(report.questionReviews),
        recommendations: JSON.parse(report.recommendations),
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
      take: 20,
      include: {
        report: {
          select: {
            overallScore: true,
            summary: true,
            createdAt: true,
          },
        },
      },
    });

    const formatted = sessions.map((s) => ({
      id: s.id,
      role: s.role,
      difficulty: s.difficulty,
      interviewStyle: s.interviewStyle,
      status: s.status,
      turnCount: s.turnCount,
      maxTurns: s.maxTurns,
      startedAt: s.startedAt,
      completedAt: s.completedAt,
      overallScore: s.report?.overallScore || null,
      summary: s.report?.summary || null,
    }));

    return res.json({ sessions: formatted });
  } catch (error: any) {
    console.error('Error listing user interviews:', error);
    return res.status(500).json({ error: 'Failed to retrieve interview history' });
  }
};
