"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserInterviews = exports.getInterviewReport = exports.retryReport = exports.transcribeAudio = exports.endInterview = exports.submitAnswer = exports.getInterview = exports.createInterview = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const zod_1 = require("zod");
const aiInterviewService_1 = require("../services/aiInterviewService");
const geminiService_1 = require("../services/geminiService");
const CreateInterviewSchema = zod_1.z.object({
    role: zod_1.z.string().default('Software Engineer'),
    difficulty: zod_1.z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
    topics: zod_1.z.array(zod_1.z.string()).default(['Data Structures and Algorithms']),
    style: zod_1.z.string().default('mock-company'),
    features: zod_1.z.array(zod_1.z.string()).default(['Follow-up Questions', 'Technical Accuracy', 'AI Feedback Report']),
    timeLimitPerQuestion: zod_1.z.number().min(0).max(300).default(0), // 0 = untimed
});
const SubmitAnswerSchema = zod_1.z.object({
    answer: zod_1.z.string().default(''),
    audioBase64: zod_1.z.string().optional(),
    mimeType: zod_1.z.string().optional(),
    modality: zod_1.z.enum(['text', 'voice']).default('text'),
    timeSpentSeconds: zod_1.z.number().optional(),
    timedOut: zod_1.z.boolean().default(false),
});
function getParamId(param) {
    if (Array.isArray(param))
        return param[0] || '';
    return param || '';
}
function getMaxTurnsForStyle(style) {
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
const createInterview = async (req, res) => {
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
        const sessionConfig = {
            role,
            difficulty,
            topics,
            style,
            features,
            timeLimitPerQuestion,
        };
        // 1. Generate opening question live using Gemini API
        const openingResult = await aiInterviewService_1.AiInterviewService.generateOpeningQuestion(sessionConfig);
        // 2. Persist session and first message in database
        const session = await prisma_1.default.interviewSession.create({
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
    }
    catch (error) {
        console.error('Error creating interview session:', error);
        const statusCode = error instanceof geminiService_1.GeminiApiError ? error.statusCode : 500;
        const message = error.message || 'Failed to create interview session using AI';
        const canRetry = error instanceof geminiService_1.GeminiApiError ? error.canRetry : true;
        return res.status(statusCode).json({
            error: message,
            canRetry,
            code: 'AI_QUESTION_GENERATION_FAILED',
        });
    }
};
exports.createInterview = createInterview;
/**
 * GET /api/interviews/:id
 * Retrieve session state, conversation history, and evaluation records.
 */
const getInterview = async (req, res) => {
    try {
        const id = getParamId(req.params.id);
        if (!id) {
            return res.status(400).json({ error: 'Missing session ID' });
        }
        const session = await prisma_1.default.interviewSession.findUnique({
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
        let topics = [];
        let features = [];
        try {
            topics = JSON.parse(session.selectedTopics);
            features = JSON.parse(session.enabledFeatures);
        }
        catch {
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
            }
            catch (e) {
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
    }
    catch (error) {
        console.error('Error fetching interview session:', error);
        return res.status(500).json({ error: 'Failed to retrieve interview session' });
    }
};
exports.getInterview = getInterview;
/**
 * POST /api/interviews/:id/answers
 * Submit candidate answer, evaluate semantically with Gemini, generate next question or follow-up, and persist.
 */
const submitAnswer = async (req, res) => {
    try {
        const id = getParamId(req.params.id);
        if (!id) {
            return res.status(400).json({ error: 'Missing session ID' });
        }
        const parseResult = SubmitAnswerSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Invalid answer payload', details: parseResult.error.format() });
        }
        const { answer, timeSpentSeconds, timedOut } = parseResult.data;
        // 1. Verify session exists and is active
        const session = await prisma_1.default.interviewSession.findUnique({
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
        let topics = [];
        let features = [];
        try {
            topics = JSON.parse(session.selectedTopics);
            features = JSON.parse(session.enabledFeatures);
        }
        catch {
            topics = [session.selectedTopics];
            features = [session.enabledFeatures];
        }
        const sessionConfig = {
            role: session.role,
            difficulty: session.difficulty,
            topics,
            style: session.interviewStyle,
            features,
            timeLimitPerQuestion: session.timeLimitPerQuestion,
        };
        const nextTurnCount = session.turnCount + 1;
        const lastSeq = session.messages.length > 0 ? session.messages[session.messages.length - 1].sequenceNumber : 0;
        let finalAnswerText = answer.trim();
        // If audioBase64 provided without text, transcribe it with Gemini first
        if (!finalAnswerText && parseResult.data.audioBase64) {
            const qMsg = [...session.messages].reverse().find((m) => m.sender === 'interviewer');
            try {
                console.log(`[InterviewController] Auto-transcribing audio response for session ${id}...`);
                const transcribed = await geminiService_1.GeminiService.transcribeAudio(parseResult.data.audioBase64, parseResult.data.mimeType || 'audio/webm', {
                    questionText: qMsg?.content,
                    topic: qMsg?.questionTopic || session.role,
                    role: session.role,
                });
                finalAnswerText = transcribed.trim();
            }
            catch (audioErr) {
                console.warn('[InterviewController] Audio auto-transcription failed:', audioErr.message);
            }
        }
        if (!finalAnswerText) {
            finalAnswerText = timedOut ? '[Time Expired - No response submitted]' : '[No response submitted]';
        }
        // Find the question being answered
        const questionMsg = [...session.messages].reverse().find((m) => m.sender === 'interviewer');
        const currentQuestionText = questionMsg?.content || 'Interview Question';
        const currentQuestionTopic = questionMsg?.questionTopic || sessionConfig.topics[0] || 'Technical';
        // 2. Persist Candidate Response with time metrics
        const candidateMsg = await prisma_1.default.interviewMessage.create({
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
            turnResult = await aiInterviewService_1.AiInterviewService.evaluateAndAdvance({
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
        }
        catch (aiErr) {
            console.error('Gemini answer evaluation failed:', aiErr);
            const statusCode = aiErr instanceof geminiService_1.GeminiApiError ? aiErr.statusCode : 502;
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
            const evaluationEntries = [
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
                await prisma_1.default.interviewEvaluation.create({
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
        const interviewerMsg = await prisma_1.default.interviewMessage.create({
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
        let reportData = null;
        const isCompleted = turnResult.isComplete || nextTurnCount >= session.maxTurns;
        if (isCompleted) {
            const allMessages = await prisma_1.default.interviewMessage.findMany({
                where: { sessionId: id },
                orderBy: { sequenceNumber: 'asc' },
            });
            const allEvals = await prisma_1.default.interviewEvaluation.findMany({
                where: { sessionId: id },
            });
            try {
                console.log(`[InterviewController] Auto-generating final report on interview completion for session ${id}...`);
                reportData = await aiInterviewService_1.AiInterviewService.generateFinalReport({
                    sessionConfig,
                    messages: allMessages,
                    evaluations: allEvals,
                });
                await prisma_1.default.$transaction([
                    prisma_1.default.interviewReport.upsert({
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
                    prisma_1.default.interviewSession.update({
                        where: { id },
                        data: {
                            status: 'COMPLETED',
                            completedAt: new Date(),
                            turnCount: nextTurnCount,
                        },
                    }),
                ]);
                console.log(`[InterviewController] Report successfully auto-generated and saved for session ${id}`);
            }
            catch (repErr) {
                console.warn(`[InterviewController] Final report generation deferred for session ${id}: ${repErr.message}. Marking session completed for manual retry.`);
                await prisma_1.default.interviewSession.update({
                    where: { id },
                    data: {
                        status: 'COMPLETED',
                        completedAt: new Date(),
                        turnCount: nextTurnCount,
                    },
                });
            }
        }
        else {
            await prisma_1.default.interviewSession.update({
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
    }
    catch (error) {
        console.error('Error submitting answer to interview:', error);
        const statusCode = error instanceof geminiService_1.GeminiApiError ? error.statusCode : 500;
        return res.status(statusCode).json({
            error: error.message || 'Failed to process answer submission',
            canRetry: true,
            code: 'SUBMIT_ANSWER_FAILED',
        });
    }
};
exports.submitAnswer = submitAnswer;
/**
 * POST /api/interviews/:id/end
 * Conclude an active interview session and generate the final report live using Gemini API.
 */
const endInterview = async (req, res) => {
    try {
        const id = getParamId(req.params.id);
        if (!id) {
            return res.status(400).json({ error: 'Missing session ID' });
        }
        const session = await prisma_1.default.interviewSession.findUnique({
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
        let topics = [];
        let features = [];
        try {
            topics = JSON.parse(session.selectedTopics);
            features = JSON.parse(session.enabledFeatures);
        }
        catch {
            topics = [session.selectedTopics];
            features = [session.enabledFeatures];
        }
        const sessionConfig = {
            role: session.role,
            difficulty: session.difficulty,
            topics,
            style: session.interviewStyle,
            features,
            timeLimitPerQuestion: session.timeLimitPerQuestion,
        };
        const messages = await prisma_1.default.interviewMessage.findMany({
            where: { sessionId: id },
            orderBy: { sequenceNumber: 'asc' },
        });
        const evaluations = await prisma_1.default.interviewEvaluation.findMany({
            where: { sessionId: id },
        });
        // 1. Generate Final Report LIVE using Gemini API from actual evaluations BEFORE marking completed
        let reportData;
        try {
            console.log(`[InterviewController] Generating final report for session ${id} (Role: ${session.role}, Difficulty: ${session.difficulty}, Turns: ${messages.length})...`);
            reportData = await aiInterviewService_1.AiInterviewService.generateFinalReport({
                sessionConfig,
                messages,
                evaluations,
            });
        }
        catch (genErr) {
            console.error(`[InterviewController] Gemini report generation failed for session ${id}:`, genErr.message);
            const statusCode = genErr instanceof geminiService_1.GeminiApiError ? genErr.statusCode : 502;
            return res.status(statusCode).json({
                error: genErr.message || 'Failed to generate AI assessment report. Your interview responses are saved. Please click Retry Report.',
                canRetry: true,
                code: 'REPORT_GENERATION_FAILED',
            });
        }
        // 2. Atomic persistence: Upsert report and mark session COMPLETED together
        const [savedReport] = await prisma_1.default.$transaction([
            prisma_1.default.interviewReport.upsert({
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
            prisma_1.default.interviewSession.update({
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
    }
    catch (error) {
        console.error('Error ending interview:', error);
        const statusCode = error instanceof geminiService_1.GeminiApiError ? error.statusCode : 502;
        return res.status(statusCode).json({
            error: error.message || 'Failed to generate AI assessment report. Please click retry.',
            canRetry: true,
            code: 'REPORT_GENERATION_FAILED',
        });
    }
};
exports.endInterview = endInterview;
/**
 * POST /api/interviews/:id/transcribe-audio
 * Transcribe candidate voice recording using Gemini Multimodal Audio API
 */
const transcribeAudio = async (req, res) => {
    try {
        const id = getParamId(req.params.id);
        if (!id) {
            return res.status(400).json({ error: 'Missing session ID' });
        }
        const { audioBase64, mimeType, durationSeconds } = req.body;
        // 1. Validate audio presence
        if (!audioBase64 || typeof audioBase64 !== 'string' || audioBase64.trim().length === 0) {
            return res.status(400).json({
                error: 'Missing or empty audio data (audioBase64 is required)',
                code: 'MISSING_AUDIO_PAYLOAD',
            });
        }
        // 2. Validate base64 buffer and size
        let audioBuffer;
        try {
            audioBuffer = Buffer.from(audioBase64, 'base64');
        }
        catch {
            return res.status(400).json({
                error: 'Invalid audio encoding: failed to decode base64 buffer',
                code: 'INVALID_BASE64_ENCODING',
            });
        }
        if (audioBuffer.length === 0) {
            return res.status(400).json({
                error: 'Audio buffer is 0 bytes. Please ensure your microphone is capturing sound.',
                code: 'EMPTY_AUDIO_BUFFER',
            });
        }
        // Maximum 25MB check
        if (audioBuffer.length > 25 * 1024 * 1024) {
            return res.status(413).json({
                error: 'Audio recording exceeds the 25MB limit. Please provide a more concise answer.',
                code: 'AUDIO_TOO_LARGE',
            });
        }
        // 3. Validate supported audio MIME types
        const rawMime = (mimeType || 'audio/webm').trim();
        const cleanMime = rawMime.split(';')[0].trim().toLowerCase();
        const supportedMimes = [
            'audio/webm',
            'audio/mp4',
            'audio/m4a',
            'audio/wav',
            'audio/wave',
            'audio/x-wav',
            'audio/ogg',
            'audio/opus',
            'audio/mpeg',
            'audio/mp3',
            'audio/aac',
            'audio/flac',
        ];
        if (!supportedMimes.includes(cleanMime)) {
            return res.status(400).json({
                error: `Unsupported audio format "${cleanMime}". Please use webm, mp4, wav, or ogg.`,
                code: 'UNSUPPORTED_MIME_TYPE',
            });
        }
        const session = await prisma_1.default.interviewSession.findUnique({
            where: { id },
            include: {
                messages: { orderBy: { sequenceNumber: 'desc' }, take: 2 },
            },
        });
        if (!session) {
            return res.status(404).json({ error: 'Interview session not found', code: 'SESSION_NOT_FOUND' });
        }
        if (session.userId && req.userId && session.userId !== req.userId) {
            return res.status(403).json({ error: 'Forbidden: You do not own this session', code: 'FORBIDDEN' });
        }
        const lastInterviewerMsg = session.messages.find((m) => m.sender === 'interviewer');
        console.log(`[InterviewController] Transcribing audio for session ${id}:`);
        console.log(`  - Raw MIME: "${rawMime}", Normalized MIME: "${cleanMime}"`);
        console.log(`  - Audio Size: ${audioBuffer.length} bytes (${(audioBuffer.length / 1024).toFixed(1)} KB)`);
        if (durationSeconds) {
            console.log(`  - Estimated Duration: ${durationSeconds}s`);
        }
        console.log(`  - Target Model: ${geminiService_1.GeminiService.getModel()}`);
        const transcript = await geminiService_1.GeminiService.transcribeAudio(audioBase64, cleanMime, {
            questionText: lastInterviewerMsg?.content,
            topic: lastInterviewerMsg?.questionTopic || session.role,
            role: session.role,
        });
        const hasSpeech = typeof transcript === 'string' && transcript.trim().length > 0;
        return res.json({
            success: true,
            transcript: transcript || '',
            emptySpeech: !hasSpeech,
            audioMime: cleanMime,
            audioBytes: audioBuffer.length,
        });
    }
    catch (error) {
        console.error('[InterviewController] Audio transcription error:', error?.message);
        const statusCode = error instanceof geminiService_1.GeminiApiError ? error.statusCode : 500;
        return res.status(statusCode).json({
            error: error?.message || 'Failed to process voice response with Gemini AI',
            canRetry: true,
            code: 'AUDIO_TRANSCRIPTION_FAILED',
            details: error?.details || undefined,
        });
    }
};
exports.transcribeAudio = transcribeAudio;
/**
 * POST /api/interviews/:id/retry-report
 * Dedicated retry mechanism if report generation previously failed
 */
const retryReport = async (req, res) => {
    return (0, exports.endInterview)(req, res);
};
exports.retryReport = retryReport;
/**
 * GET /api/interviews/:id/report
 * Retrieve the final report for a completed session.
 */
const getInterviewReport = async (req, res) => {
    try {
        const id = getParamId(req.params.id);
        if (!id) {
            return res.status(400).json({ error: 'Missing session ID' });
        }
        const report = await prisma_1.default.interviewReport.findUnique({
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
    }
    catch (error) {
        console.error('Error fetching interview report:', error);
        return res.status(500).json({ error: 'Failed to retrieve report' });
    }
};
exports.getInterviewReport = getInterviewReport;
/**
 * GET /api/interviews
 * List previous interview sessions for the current authenticated user.
 */
const listUserInterviews = async (req, res) => {
    try {
        const userId = req.userId;
        const whereClause = userId ? { userId } : {};
        const sessions = await prisma_1.default.interviewSession.findMany({
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
            let topics = [];
            try {
                topics = JSON.parse(s.selectedTopics);
            }
            catch {
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
    }
    catch (error) {
        console.error('Error listing user interviews:', error);
        return res.status(500).json({ error: 'Failed to retrieve interview history' });
    }
};
exports.listUserInterviews = listUserInterviews;
