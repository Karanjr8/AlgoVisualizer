"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiInterviewService = void 0;
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
// Zod schema for validating Gemini JSON responses
const AiResponseZodSchema = zod_1.z.object({
    interviewerMessage: zod_1.z.string().min(1),
    questionTopic: zod_1.z.string().default('General'),
    questionType: zod_1.z.enum(['conceptual', 'problem_solving', 'follow_up', 'behavioral']).default('conceptual'),
    evaluation: zod_1.z.object({
        technicalAccuracy: zod_1.z.number().min(0).max(5).optional(),
        problemSolving: zod_1.z.number().min(0).max(5).optional(),
        complexityAnalysis: zod_1.z.number().min(0).max(5).optional(),
        communication: zod_1.z.number().min(0).max(5).optional(),
        confidence: zod_1.z.number().min(0).max(5).optional(),
        behavioral: zod_1.z.number().min(0).max(5).optional(),
        adaptability: zod_1.z.number().min(0).max(5).optional(),
        overallScore: zod_1.z.number().min(0).max(5).default(3),
        feedback: zod_1.z.string().default('Evaluation recorded.'),
        evidence: zod_1.z.string().default('Based on candidate explanation.'),
    }).optional(),
    nextAction: zod_1.z.enum(['ask_follow_up', 'next_question', 'conclude']).default('next_question'),
    isComplete: zod_1.z.boolean().default(false),
});
const QUESTION_BANK = [
    // Arrays & Two Pointers
    {
        id: 'arr-1',
        topic: 'Arrays',
        roles: ['sde-intern', 'sde-1', 'frontend-engineer', 'backend-engineer', 'fullstack-engineer', 'ds-specialist'],
        difficulty: 'Easy',
        type: 'problem_solving',
        question: "Given an integer array nums and an integer target, how would you find the indices of the two numbers such that they add up to target? Explain your optimal approach and its time and space complexity.",
        keyConcepts: ['hash map', 'hashmap', 'dictionary', 'complement', 'o(n)', 'single pass'],
        followUp: "If the input array were already sorted in ascending order, how would you solve this with O(1) auxiliary space?",
    },
    {
        id: 'arr-2',
        topic: 'Arrays',
        roles: ['sde-1', 'backend-engineer', 'fullstack-engineer', 'ds-specialist'],
        difficulty: 'Medium',
        type: 'problem_solving',
        question: "Suppose you are given an array of intervals [start, end]. How would you merge all overlapping intervals? Walk me through your algorithm and handling of edge cases.",
        keyConcepts: ['sort', 'sorting', 'start time', 'max end', 'overlap', 'o(n log n)'],
        followUp: "What happens if intervals are already sorted by start time? How would your solution handle empty intervals or single points?",
    },
    // Trees & BST
    {
        id: 'tree-1',
        topic: 'Trees',
        roles: ['sde-intern', 'sde-1', 'fullstack-engineer', 'ds-specialist'],
        difficulty: 'Easy',
        type: 'conceptual',
        question: "Explain the difference between Breadth-First Search (BFS) and Depth-First Search (DFS) in a binary tree. When would you prefer BFS over DFS?",
        keyConcepts: ['queue', 'stack', 'recursion', 'level order', 'shortest path', 'memory'],
        followUp: "If a tree has depth 10,000 but only a few nodes per level, what is the risk of recursive DFS and how would you safeguard against it?",
    },
    {
        id: 'tree-2',
        topic: 'Trees',
        roles: ['sde-1', 'ds-specialist', 'backend-engineer'],
        difficulty: 'Medium',
        type: 'problem_solving',
        question: "How would you find the Lowest Common Ancestor (LCA) of two given nodes in a standard Binary Tree (not a BST)? Explain the recursive logic and its complexity.",
        keyConcepts: ['postorder', 'left', 'right', 'null', 'base case', 'o(n) time', 'recursion'],
        followUp: "How would your approach change if each node had a parent pointer?",
    },
    // Graphs
    {
        id: 'graph-1',
        topic: 'Graphs',
        roles: ['sde-1', 'backend-engineer', 'ds-specialist'],
        difficulty: 'Medium',
        type: 'problem_solving',
        question: "You are given a list of course prerequisites represented as pairs [course, prerequisite]. How would you detect whether it is possible for a student to finish all courses without cyclic dependencies?",
        keyConcepts: ['topological sort', 'cycle detection', 'indegree', 'kahn', 'dfs', 'visited', 'recstack'],
        followUp: "How would you output the exact valid course ordering rather than just checking if one exists?",
    },
    // Dynamic Programming
    {
        id: 'dp-1',
        topic: 'DP',
        roles: ['sde-intern', 'sde-1', 'ds-specialist'],
        difficulty: 'Medium',
        type: 'problem_solving',
        question: "Given an array of coin denominations and an integer amount, explain how to compute the fewest number of coins needed to make up that amount. What are the subproblems?",
        keyConcepts: ['subproblem', 'memoization', 'bottom-up', 'tabulation', 'dp array', 'infinity', 'o(amount * n)'],
        followUp: "Why does a greedy approach (always taking the largest denomination first) fail for denominations like [1, 3, 4] with amount 6?",
    },
    // System Design
    {
        id: 'sys-1',
        topic: 'System Design',
        roles: ['backend-engineer', 'fullstack-engineer', 'sde-1'],
        difficulty: 'Medium',
        type: 'conceptual',
        question: "Walk me through how you would design a URL shortener service (like Bitly). What are the key components for write and read paths, and how would you handle high concurrency?",
        keyConcepts: ['base62', 'hashing', 'cache', 'redis', 'database', 'load balancer', 'redirect 301 vs 302'],
        followUp: "How would you ensure unique short codes across a distributed cluster without introducing a single point of failure?",
    },
    // Frontend & UI Architecture
    {
        id: 'fe-1',
        topic: 'System Design',
        roles: ['frontend-engineer', 'fullstack-engineer'],
        difficulty: 'Medium',
        type: 'conceptual',
        question: "How does the React Reconciliation algorithm and Virtual DOM work? How does React optimize re-renders when rendering large dynamic lists?",
        keyConcepts: ['reconciliation', 'diffing', 'virtual dom', 'key prop', 'fiber', 'memo', 'usecallback'],
        followUp: "Why is using array index as a key considered an anti-pattern when list items can be reordered or filtered?",
    },
    // Behavioral
    {
        id: 'beh-1',
        topic: 'Behavioral',
        roles: ['sde-intern', 'sde-1', 'frontend-engineer', 'backend-engineer', 'fullstack-engineer', 'ds-specialist'],
        difficulty: 'Medium',
        type: 'behavioral',
        question: "Tell me about a time you encountered a challenging bug or technical roadblock. How did you diagnose the root cause, what trade-offs did you make, and what was the outcome?",
        keyConcepts: ['situation', 'task', 'action', 'result', 'star', 'debugging', 'tradeoff', 'learning'],
        followUp: "In hindsight, what monitoring, testing, or process change did you introduce to prevent that issue from recurring?",
    },
];
// ==========================================
// CORE AI INTERVIEW SERVICE CLASS
// ==========================================
class AiInterviewService {
    static getGeminiApiKey() {
        if (!process.env.GEMINI_API_KEY) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                require('dotenv').config();
            }
            catch {
                // ignore
            }
        }
        const key = process.env.GEMINI_API_KEY;
        if (!key || key.trim() === '' || key === 'placeholder_key') {
            return null;
        }
        return key.trim();
    }
    /**
     * Generates opening interview question.
     */
    static async generateOpeningQuestion(config) {
        const apiKey = this.getGeminiApiKey();
        if (apiKey) {
            try {
                const result = await this.callGeminiOpening(apiKey, config);
                return {
                    ...result,
                    aiProvider: 'gemini',
                };
            }
            catch (err) {
                console.warn('Gemini API call failed for opening question, using simulated engine:', err?.response?.data || err.message);
            }
        }
        // Simulated Intelligence Engine Fallback
        const turn = this.simulateOpeningQuestion(config);
        return {
            ...turn,
            aiProvider: 'simulated-engine',
            missingConfigNotice: !apiKey
                ? 'GEMINI_API_KEY is not configured in backend/.env. Using AlgoVis Technical Simulation Engine.'
                : undefined,
        };
    }
    /**
     * Evaluates candidate's answer and generates next question or follow-up.
     */
    static async evaluateAndAdvance({ sessionConfig, candidateAnswer, previousMessages, turnCount, maxTurns, }) {
        const apiKey = this.getGeminiApiKey();
        const isLastTurn = turnCount >= maxTurns;
        if (apiKey) {
            try {
                const result = await this.callGeminiEvaluation(apiKey, {
                    sessionConfig,
                    candidateAnswer,
                    previousMessages,
                    turnCount,
                    maxTurns,
                });
                return {
                    ...result,
                    aiProvider: 'gemini',
                };
            }
            catch (err) {
                console.warn('Gemini API evaluation failed, using simulated engine:', err?.response?.data || err.message);
            }
        }
        // Simulated Intelligence Engine Fallback
        const turn = this.simulateEvaluationAndNext({
            sessionConfig,
            candidateAnswer,
            previousMessages,
            turnCount,
            maxTurns,
            isLastTurn,
        });
        return {
            ...turn,
            aiProvider: 'simulated-engine',
            missingConfigNotice: !apiKey
                ? 'GEMINI_API_KEY is not configured in backend/.env. Using AlgoVis Technical Simulation Engine.'
                : undefined,
        };
    }
    /**
     * Generates the comprehensive final report from the session transcript.
     */
    static async generateFinalReport({ sessionConfig, messages, evaluations, }) {
        const apiKey = this.getGeminiApiKey();
        if (apiKey) {
            try {
                return await this.callGeminiFinalReport(apiKey, { sessionConfig, messages, evaluations });
            }
            catch (err) {
                console.warn('Gemini Final Report call failed, using deterministic aggregation:', err?.response?.data || err.message);
            }
        }
        return this.simulateFinalReport({ sessionConfig, messages, evaluations });
    }
    // ==========================================
    // GEMINI API INTEGRATIONS
    // ==========================================
    static async callGeminiOpening(apiKey, config) {
        const prompt = `
You are a senior technical interviewer conducting a mock interview for the role of ${config.role}.
Interview Parameters:
- Difficulty Level: ${config.difficulty}
- Selected Topics: ${config.topics.join(', ')}
- Interview Style: ${config.style}
- Enabled Evaluation Modules: ${config.features.join(', ')}

Instructions:
1. Welcome the candidate warmly and professionally (1 brief sentence).
2. Ask your FIRST primary technical or conceptual question based on the selected role, difficulty, and topics.
3. Ask ONLY ONE question. Do not reveal the answer.
4. Output strictly valid JSON matching this schema:
{
  "interviewerMessage": "string (welcome + first question)",
  "questionTopic": "string (topic name e.g. Arrays, Trees, etc.)",
  "questionType": "conceptual" | "problem_solving" | "behavioral",
  "nextAction": "next_question",
  "isComplete": false
}
Do not include markdown backticks or commentary outside JSON.
`;
        const response = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.4,
            },
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 });
        const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = JSON.parse(rawText);
        const validated = AiResponseZodSchema.parse(parsed);
        return {
            interviewerMessage: validated.interviewerMessage,
            questionTopic: validated.questionTopic,
            questionType: validated.questionType,
            nextAction: validated.nextAction,
            isComplete: false,
            aiProvider: 'gemini',
        };
    }
    static async callGeminiEvaluation(apiKey, params) {
        const { sessionConfig, candidateAnswer, previousMessages, turnCount, maxTurns } = params;
        const isFollowUpEnabled = sessionConfig.features.includes('Follow-up Questions');
        const isLastTurn = turnCount >= maxTurns;
        const transcriptFormatted = previousMessages
            .map((m) => `${m.sender.toUpperCase()}: ${m.content}`)
            .join('\n');
        const prompt = `
You are a senior technical interviewer for a ${sessionConfig.role} position at difficulty ${sessionConfig.difficulty}.
Topics covered: ${sessionConfig.topics.join(', ')}.
Enabled Modules: ${sessionConfig.features.join(', ')}.
Follow-up allowed: ${isFollowUpEnabled ? 'YES' : 'NO'}.
Current Turn: ${turnCount} of ${maxTurns}. Is final turn: ${isLastTurn ? 'YES' : 'NO'}.

Interview Transcript so far:
${transcriptFormatted}

CANDIDATE'S LATEST ANSWER:
"${candidateAnswer}"

Tasks:
1. Objectively evaluate the candidate's latest answer.
2. Score assessed dimensions on a scale of 0.0 to 5.0 (0=No attempt, 1=Major flaws, 3=Acceptable/competent, 5=Exceptional).
   Assess only dimensions that apply:
   - technicalAccuracy: correctness of algorithm/concept
   - problemSolving: logical flow and trade-offs
   - complexityAnalysis: time/space Big-O discussion
   - communication: clarity and structure
   - confidence: observable consistency and certainty in reasoning
   - behavioral: STAR framework (only if behavioral question)
3. If this is NOT the final turn:
   - If follow-up questions are allowed and the candidate omitted details, complexity, or edge cases: ask a natural, concise follow-up.
   - Otherwise: transition smoothly and ask a new question from the remaining topics (${sessionConfig.topics.join(', ')}).
4. If this IS the final turn (${isLastTurn}):
   - Set isComplete to true.
   - Conclude the session with a brief, professional closing remarks thanking the candidate.

Return strictly valid JSON:
{
  "interviewerMessage": "string",
  "questionTopic": "string",
  "questionType": "conceptual" | "problem_solving" | "follow_up" | "behavioral",
  "evaluation": {
    "technicalAccuracy": number (0-5),
    "problemSolving": number (0-5),
    "complexityAnalysis": number (0-5),
    "communication": number (0-5),
    "confidence": number (0-5),
    "behavioral": number (0-5),
    "overallScore": number (0-5),
    "feedback": "concise feedback on the answer",
    "evidence": "specific quote or reasoning from candidate answer"
  },
  "nextAction": "${isLastTurn ? 'conclude' : 'ask_follow_up | next_question'}",
  "isComplete": ${isLastTurn}
}
`;
        const response = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.3,
            },
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 });
        const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = JSON.parse(rawText);
        const validated = AiResponseZodSchema.parse(parsed);
        return {
            interviewerMessage: validated.interviewerMessage,
            questionTopic: validated.questionTopic,
            questionType: validated.questionType,
            evaluation: validated.evaluation
                ? {
                    dimensions: {
                        technicalAccuracy: validated.evaluation.technicalAccuracy,
                        problemSolving: validated.evaluation.problemSolving,
                        complexityAnalysis: validated.evaluation.complexityAnalysis,
                        communication: validated.evaluation.communication,
                        confidence: validated.evaluation.confidence,
                        behavioral: validated.evaluation.behavioral,
                    },
                    overallScore: validated.evaluation.overallScore,
                    feedback: validated.evaluation.feedback,
                    evidence: validated.evaluation.evidence,
                }
                : undefined,
            nextAction: isLastTurn ? 'conclude' : validated.nextAction,
            isComplete: isLastTurn || validated.isComplete,
            aiProvider: 'gemini',
        };
    }
    static async callGeminiFinalReport(apiKey, params) {
        const { sessionConfig, messages, evaluations } = params;
        const transcript = messages.map((m) => `${m.sender.toUpperCase()}: ${m.content}`).join('\n');
        const evalSummary = evaluations
            .map((e) => `[${e.dimension}] Score: ${e.score}/5. Evidence: ${e.evidence}. Notes: ${e.rationale}`)
            .join('\n');
        const prompt = `
Generate a comprehensive, evidence-based post-interview diagnostic feedback report for this completed technical interview.
Role: ${sessionConfig.role}
Difficulty: ${sessionConfig.difficulty}
Topics: ${sessionConfig.topics.join(', ')}

Session Transcript:
${transcript}

Evaluation Records:
${evalSummary}

Output strictly valid JSON with this exact schema:
{
  "overallScore": number (0-5, weighted based only on assessed dimensions),
  "summary": "3-4 sentence comprehensive executive summary of performance",
  "strengths": ["string", "string", "string"],
  "improvementAreas": ["string", "string", "string"],
  "dimensionScores": {
    "technicalAccuracy": { "score": number, "label": "Technical Accuracy", "feedback": "evidence-based feedback" },
    "problemSolving": { "score": number, "label": "Problem Solving", "feedback": "evidence-based feedback" },
    "complexityAnalysis": { "score": number, "label": "Complexity Analysis", "feedback": "evidence-based feedback" },
    "communication": { "score": number, "label": "Communication", "feedback": "evidence-based feedback" }
  },
  "questionReviews": [
    {
      "question": "question text",
      "topic": "topic name",
      "candidateAnswer": "summary of candidate answer",
      "score": number,
      "feedback": "what was good and what was missing",
      "improvement": "actionable suggestion"
    }
  ],
  "recommendations": ["specific concept or practice problem to revise", "string", "string"]
}
`;
        const response = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.3,
            },
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });
        const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        return JSON.parse(rawText);
    }
    // ==========================================
    // SIMULATED INTELLIGENCE ENGINE IMPLEMENTATION
    // ==========================================
    static simulateOpeningQuestion(config) {
        // Pick the most relevant question from the bank matching selected topics and difficulty
        const matched = QUESTION_BANK.filter((q) => config.topics.includes(q.topic) || config.topics.includes('Mixed'));
        const selected = matched.length > 0
            ? matched[Math.floor(Math.random() * matched.length)]
            : QUESTION_BANK[0];
        const welcome = `Hello! Welcome to your technical interview for the ${config.role} position. We'll be focusing today on ${config.topics.slice(0, 3).join(', ')}. Let's begin with our first question:\n\n${selected.question}`;
        return {
            interviewerMessage: welcome,
            questionTopic: selected.topic,
            questionType: selected.type,
            nextAction: 'next_question',
            isComplete: false,
            aiProvider: 'simulated-engine',
        };
    }
    static simulateEvaluationAndNext(params) {
        const { sessionConfig, candidateAnswer, previousMessages, turnCount, maxTurns, isLastTurn } = params;
        const answerLower = candidateAnswer.toLowerCase().trim();
        // Find the last interviewer question
        const lastQuestionMsg = [...previousMessages].reverse().find((m) => m.sender === 'interviewer');
        const questionText = lastQuestionMsg?.content || '';
        const currentTopic = lastQuestionMsg?.questionTopic || sessionConfig.topics[0] || 'Arrays';
        // Find matching question from bank for expected key concepts
        const matchedQ = QUESTION_BANK.find((q) => questionText.includes(q.question.slice(0, 30)));
        const expectedKeywords = matchedQ?.keyConcepts || ['time', 'space', 'complexity', 'algorithm', 'data structure'];
        // Evaluation scoring heuristics
        let matchesCount = 0;
        for (const kw of expectedKeywords) {
            if (answerLower.includes(kw.toLowerCase()))
                matchesCount++;
        }
        const hasComplexity = answerLower.includes('o(') || answerLower.includes('o (') || answerLower.includes('time complexity') || answerLower.includes('space complexity');
        const isDetailed = candidateAnswer.length > 120;
        const isVeryShort = candidateAnswer.length < 35;
        // Calculate realistic scores on 0-5 scale
        let techScore = 3.0;
        let problemSolvingScore = 3.0;
        let commScore = 3.5;
        let complexityScore = hasComplexity ? 4.0 : 2.5;
        if (matchesCount >= 3 || (matchesCount >= 2 && isDetailed)) {
            techScore = 4.5;
            problemSolvingScore = 4.2;
        }
        else if (matchesCount === 0 && isVeryShort) {
            techScore = 2.0;
            problemSolvingScore = 2.0;
            commScore = 2.5;
        }
        else if (matchesCount >= 1) {
            techScore = 3.5;
            problemSolvingScore = 3.5;
        }
        const overallScore = Math.round(((techScore * 0.4 + problemSolvingScore * 0.3 + commScore * 0.2 + complexityScore * 0.1)) * 10) / 10;
        // Construct evidence-based feedback
        let feedback = 'Good explanation covering core aspects of the solution.';
        let evidence = `Candidate mentioned ${matchesCount} relevant key concept(s).`;
        if (isVeryShort) {
            feedback = 'The explanation was quite brief; consider discussing edge cases and complexity trade-offs.';
            evidence = `Response length was ${candidateAnswer.length} characters without explicit complexity justification.`;
        }
        else if (!hasComplexity && sessionConfig.features.includes('Technical Accuracy')) {
            feedback = 'Solid intuition, though formal Big-O time and space complexity analysis was omitted.';
            evidence = 'No explicit Big-O notation provided in answer.';
        }
        else if (matchesCount >= 2) {
            feedback = 'Strong grasp of algorithmic trade-offs with clear structured communication.';
            evidence = `Identified key mechanisms (${expectedKeywords.slice(0, 2).join(', ')}).`;
        }
        const evaluation = {
            dimensions: {
                technicalAccuracy: sessionConfig.features.includes('Technical Accuracy') ? techScore : undefined,
                problemSolving: problemSolvingScore,
                complexityAnalysis: complexityScore,
                communication: sessionConfig.features.includes('Communication Scoring') ? commScore : undefined,
                confidence: sessionConfig.features.includes('Confidence Analysis') ? 4.0 : undefined,
            },
            overallScore,
            feedback,
            evidence,
        };
        // If final turn reached, conclude
        if (isLastTurn) {
            return {
                interviewerMessage: `Thank you for working through those problems today! That concludes our technical interview session for the ${sessionConfig.role} position. You've demonstrated valuable technical skills across the topics. I am generating your full diagnostic feedback report now.`,
                questionTopic: currentTopic,
                questionType: 'conceptual',
                evaluation,
                nextAction: 'conclude',
                isComplete: true,
                aiProvider: 'simulated-engine',
            };
        }
        // Follow-up question logic
        const allowFollowUp = sessionConfig.features.includes('Follow-up Questions');
        const isPreviousFollowUp = lastQuestionMsg?.questionType === 'follow_up';
        if (allowFollowUp && matchedQ && !isPreviousFollowUp && (!hasComplexity || matchesCount < 2 || isDetailed)) {
            const followUpText = !hasComplexity
                ? `That makes sense. Could you analyze the time and space complexity of this approach, and point out any potential memory bottlenecks?`
                : matchedQ.followUp;
            return {
                interviewerMessage: `Great point. Following up on that:\n\n${followUpText}`,
                questionTopic: currentTopic,
                questionType: 'follow_up',
                evaluation,
                nextAction: 'ask_follow_up',
                isComplete: false,
                aiProvider: 'simulated-engine',
            };
        }
        // Move to next question from available topics
        const usedTopics = previousMessages
            .map((m) => m.questionTopic)
            .filter(Boolean);
        const remainingQuestions = QUESTION_BANK.filter((q) => !questionText.includes(q.question.slice(0, 25)));
        const nextQ = remainingQuestions.find((q) => sessionConfig.topics.includes(q.topic) && !usedTopics.includes(q.topic))
            || remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)]
            || QUESTION_BANK[1];
        return {
            interviewerMessage: `Well reasoned. Let's pivot to our next area of focus:\n\n${nextQ.question}`,
            questionTopic: nextQ.topic,
            questionType: nextQ.type,
            evaluation,
            nextAction: 'next_question',
            isComplete: false,
            aiProvider: 'simulated-engine',
        };
    }
    static simulateFinalReport(params) {
        const { sessionConfig, messages, evaluations } = params;
        // Calculate average score
        const scores = evaluations.map((e) => e.score).filter((s) => typeof s === 'number' && !isNaN(s));
        const avgScore = scores.length > 0
            ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
            : 3.8;
        // Dimension grouping
        const dimensionScores = {};
        const techEvals = evaluations.filter((e) => e.dimension === 'technicalAccuracy');
        if (techEvals.length > 0 || sessionConfig.features.includes('Technical Accuracy')) {
            const avg = techEvals.length > 0 ? techEvals.reduce((a, b) => a + b.score, 0) / techEvals.length : 3.8;
            dimensionScores.technicalAccuracy = {
                score: Math.round(avg * 10) / 10,
                label: 'Technical Accuracy',
                feedback: avg >= 4.0 ? 'Demonstrated solid algorithmic understanding with accurate edge cases.' : 'Good conceptual grasp; practice articulating exact Big-O proofs.',
            };
        }
        const probEvals = evaluations.filter((e) => e.dimension === 'problemSolving');
        const probAvg = probEvals.length > 0 ? probEvals.reduce((a, b) => a + b.score, 0) / probEvals.length : 4.0;
        dimensionScores.problemSolving = {
            score: Math.round(probAvg * 10) / 10,
            label: 'Problem Solving & Structure',
            feedback: 'Approached problems systematically by breaking down subproblems before writing or explaining code.',
        };
        if (sessionConfig.features.includes('Communication Scoring')) {
            const commEvals = evaluations.filter((e) => e.dimension === 'communication');
            const commAvg = commEvals.length > 0 ? commEvals.reduce((a, b) => a + b.score, 0) / commEvals.length : 4.2;
            dimensionScores.communication = {
                score: Math.round(commAvg * 10) / 10,
                label: 'Communication Clarity',
                feedback: 'Maintained clear, coherent technical terminology throughout answers and responded directly to prompts.',
            };
        }
        if (sessionConfig.features.includes('Confidence Analysis')) {
            dimensionScores.confidence = {
                score: 4.0,
                label: 'Observable Consistency',
                feedback: 'Stood by logical deductions and adapted constructively when presented with follow-up constraints.',
            };
        }
        // Build question reviews from messages
        const questionReviews = [];
        const interviewerMsgs = messages.filter((m) => m.sender === 'interviewer');
        const candidateMsgs = messages.filter((m) => m.sender === 'candidate');
        for (let i = 0; i < Math.min(interviewerMsgs.length, candidateMsgs.length); i++) {
            const q = interviewerMsgs[i];
            const a = candidateMsgs[i];
            const matchingEval = evaluations[i];
            questionReviews.push({
                question: q.content.replace(/^Hello!.*?\n\n/s, ''),
                topic: q.questionTopic || sessionConfig.topics[0] || 'Technical',
                candidateAnswer: a.content.length > 180 ? `${a.content.slice(0, 180)}...` : a.content,
                score: matchingEval?.score || 4.0,
                feedback: matchingEval?.rationale || 'Explained foundational concepts accurately.',
                improvement: 'Incorporate edge-case validation and space-time trade-off comparisons earlier in the answer.',
            });
        }
        return {
            overallScore: avgScore,
            summary: `The candidate completed a ${sessionConfig.difficulty}-level interview for the ${sessionConfig.role} position covering ${sessionConfig.topics.join(', ')}. Demonstrated consistent technical ability with an overall score of ${avgScore}/5.0. Showed strong problem decomposition and handled follow-up constraints effectively.`,
            strengths: [
                'Quickly identified optimal data structures (hash maps, traversal patterns).',
                'Structured responses with clear progressive explanations before diving into implementation.',
                'Responsive to follow-up prompts and constraint adjustments.',
            ],
            improvementAreas: [
                'Proactively state time and space complexity without needing prompting.',
                'Verify potential edge cases such as empty inputs, duplicates, or negative values.',
                'Deepen familiarity with advanced data structure trade-offs for scaling.',
            ],
            dimensionScores,
            questionReviews,
            recommendations: [
                `Review advanced patterns in ${sessionConfig.topics[0] || 'Arrays & Dynamic Programming'}.`,
                'Practice writing out explicit Space/Time Big-O complexity tables.',
                'Explore related AlgoVis visualizers in the Explore and Practice Arena.',
            ],
        };
    }
}
exports.AiInterviewService = AiInterviewService;
