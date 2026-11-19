import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';
import { PracticeAiService } from '../services/practiceAiService';
import { CodeRunnerService } from '../services/codeRunnerService';
import { GeminiApiError } from '../services/geminiService';

/**
 * POST /api/practice/attempts
 * Saves or updates a practice session attempt.
 */
export const savePracticeAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId || req.body.userId || null;
    const {
      mode,
      difficulty,
      score = 0,
      accuracy = 0,
      completionTime = 0,
      totalQuestions = 1,
      correctAnswers = 0,
      topics,
      sessionDetails,
    } = req.body;

    if (!mode || !difficulty) {
      return res.status(400).json({ error: 'Mode and difficulty are required' });
    }

    const topicsString = Array.isArray(topics)
      ? JSON.stringify(topics)
      : typeof topics === 'string'
      ? topics
      : null;

    const detailsString =
      typeof sessionDetails === 'object' && sessionDetails !== null
        ? JSON.stringify(sessionDetails)
        : typeof sessionDetails === 'string'
        ? sessionDetails
        : null;

    const attempt = await prisma.practiceAttempt.create({
      data: {
        userId,
        mode,
        difficulty,
        score: Math.round(score),
        accuracy: Number(accuracy) || 0,
        completionTime: Math.round(completionTime),
        totalQuestions: Number(totalQuestions) || 1,
        correctAnswers: Number(correctAnswers) || 0,
        topics: topicsString,
        sessionDetails: detailsString,
      },
    });

    // Record UserActivity and UserEvent if user is authenticated
    if (userId) {
      try {
        await prisma.userActivity.create({
          data: {
            userId,
            action: 'PRACTICE_COMPLETED',
            description: `Completed ${mode} practice on ${difficulty} difficulty with ${Math.round(accuracy)}% accuracy.`,
            duration: Math.round(completionTime),
          },
        });

        await prisma.userEvent.create({
          data: {
            userId,
            eventType: 'PROBLEM_COMPLETED',
            topic: topicsString || mode,
            details: JSON.stringify({ mode, score, accuracy }),
          },
        });
      } catch (logErr) {
        console.warn('[PracticeController] Failed to record user activity:', logErr);
      }
    }

    return res.status(201).json({ success: true, attempt });
  } catch (error: any) {
    console.error('[PracticeController] savePracticeAttempt failed:', error);
    return res.status(500).json({ error: 'Failed to save practice attempt' });
  }
};

/**
 * GET /api/practice/history
 * Retrieves practice attempt history and aggregates by mode.
 */
export const getPracticeHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.json({ attempts: [], modeSummaries: {} });
    }

    const attempts = await prisma.practiceAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const modeSummaries: Record<
      string,
      {
        totalAttempts: number;
        avgAccuracy: number;
        highestScore: number;
        totalTimeSpent: number;
        recentAttempts: any[];
      }
    > = {};

    attempts.forEach((att) => {
      if (!modeSummaries[att.mode]) {
        modeSummaries[att.mode] = {
          totalAttempts: 0,
          avgAccuracy: 0,
          highestScore: 0,
          totalTimeSpent: 0,
          recentAttempts: [],
        };
      }

      const summary = modeSummaries[att.mode];
      summary.totalAttempts++;
      summary.totalTimeSpent += att.completionTime;
      if (att.score > summary.highestScore) summary.highestScore = att.score;

      if (summary.recentAttempts.length < 5) {
        summary.recentAttempts.push({
          id: att.id,
          difficulty: att.difficulty,
          score: att.score,
          accuracy: att.accuracy,
          completionTime: att.completionTime,
          createdAt: att.createdAt,
          topics: att.topics ? JSON.parse(att.topics) : [],
        });
      }
    });

    Object.keys(modeSummaries).forEach((mode) => {
      const modeAtts = attempts.filter((a) => a.mode === mode);
      const sumAcc = modeAtts.reduce((acc, cur) => acc + cur.accuracy, 0);
      modeSummaries[mode].avgAccuracy = Math.round(sumAcc / modeAtts.length);
    });

    return res.json({ attempts, modeSummaries });
  } catch (error) {
    console.error('[PracticeController] getPracticeHistory failed:', error);
    return res.status(500).json({ error: 'Failed to retrieve practice history' });
  }
};

// ==========================================
// DEBUG THE ALGORITHM CONTROLLERS
// ==========================================

export const generateDebugChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const { topic = 'Arrays', difficulty = 'Intermediate', language = 'javascript' } = req.body;
    console.log(`[PracticeController] Generating debug challenge for ${topic} (${difficulty}, ${language})...`);

    const challenge = await PracticeAiService.generateDebugChallenge({
      topic,
      difficulty,
      language,
    });

    return res.json({ success: true, challenge });
  } catch (error: any) {
    console.error('[PracticeController] generateDebugChallenge failed:', error.message);
    const statusCode = error instanceof GeminiApiError ? error.statusCode : 502;
    return res.status(statusCode).json({
      error: error.message || 'Failed to generate debugging challenge. Please try again.',
      canRetry: true,
    });
  }
};

export const runDebugCode = async (req: AuthRequest, res: Response) => {
  try {
    const { code, language = 'javascript', functionName, testCases } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Source code is required' });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ error: 'Test cases array is required' });
    }

    const executionResult = await CodeRunnerService.executeCode({
      code,
      language,
      functionName,
      testCases,
      timeoutMs: 4000,
    });

    return res.json(executionResult);
  } catch (error: any) {
    console.error('[PracticeController] runDebugCode error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Execution failed',
      testResults: [],
    });
  }
};

export const evaluateDebugSolution = async (req: AuthRequest, res: Response) => {
  try {
    const { challenge, userCode, testResults, language = 'javascript' } = req.body;

    if (!challenge || !userCode) {
      return res.status(400).json({ error: 'Challenge and user code are required' });
    }

    const evaluation = await PracticeAiService.evaluateDebugSolution({
      challenge,
      userCode,
      testResults: testResults || [],
      language,
    });

    return res.json({ success: true, evaluation });
  } catch (error: any) {
    console.error('[PracticeController] evaluateDebugSolution failed:', error.message);
    return res.status(500).json({
      error: error.message || 'Evaluation failed. Please try again.',
      canRetry: true,
    });
  }
};

// ==========================================
// SPEED RUN CONTROLLERS
// ==========================================

export const generateSpeedRun = async (req: AuthRequest, res: Response) => {
  try {
    const { difficulty = 'Intermediate', topics = ['Arrays', 'Strings'], count = 10, category = 'mixed' } = req.body;

    console.log(`[PracticeController] Generating speed run (${difficulty}, count: ${count}, topics: ${topics.join(',')})...`);

    const questions = await PracticeAiService.generateSpeedRunSet({
      difficulty,
      topics,
      count: Math.min(20, Math.max(3, Number(count) || 10)),
      category,
    });

    return res.json({ success: true, questions });
  } catch (error: any) {
    console.error('[PracticeController] generateSpeedRun failed:', error.message);
    const statusCode = error instanceof GeminiApiError ? error.statusCode : 502;
    return res.status(statusCode).json({
      error: error.message || 'Failed to generate Speed Run assessment. Please try again.',
      canRetry: true,
    });
  }
};

export const evaluateSpeedRun = async (req: AuthRequest, res: Response) => {
  try {
    const { questions, userAnswers = {}, timeTakenSeconds = 0 } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Questions array is required' });
    }

    const report = PracticeAiService.evaluateSpeedRun({
      questions,
      userAnswers,
      timeTakenSeconds,
    });

    return res.json({ success: true, report });
  } catch (error: any) {
    console.error('[PracticeController] evaluateSpeedRun failed:', error.message);
    return res.status(500).json({ error: 'Failed to calculate Speed Run assessment report.' });
  }
};

// ==========================================
// COMPLEXITY CHALLENGES CONTROLLERS
// ==========================================

export const generateComplexityChallenges = async (req: AuthRequest, res: Response) => {
  try {
    const { difficulty = 'Intermediate', category = 'all', count = 5 } = req.body;

    console.log(`[PracticeController] Generating complexity challenges (${difficulty}, category: ${category})...`);

    const challenges = await PracticeAiService.generateComplexityChallenges({
      difficulty,
      category,
      count: Math.min(15, Math.max(1, Number(count) || 5)),
    });

    return res.json({ success: true, challenges });
  } catch (error: any) {
    console.error('[PracticeController] generateComplexityChallenges failed:', error.message);
    const statusCode = error instanceof GeminiApiError ? error.statusCode : 502;
    return res.status(statusCode).json({
      error: error.message || 'Failed to generate Complexity Challenges. Please try again.',
      canRetry: true,
    });
  }
};

export const evaluateComplexityAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { challenge, userTimeComplexity, userSpaceComplexity, userReasoning } = req.body;

    if (!challenge || !userTimeComplexity || !userSpaceComplexity) {
      return res.status(400).json({ error: 'Challenge, time complexity, and space complexity are required' });
    }

    const evaluation = await PracticeAiService.evaluateComplexityAnswer({
      challenge,
      userTimeComplexity,
      userSpaceComplexity,
      userReasoning,
    });

    return res.json({ success: true, evaluation });
  } catch (error: any) {
    console.error('[PracticeController] evaluateComplexityAnswer failed:', error.message);
    return res.status(500).json({ error: 'Failed to evaluate complexity analysis.' });
  }
};
