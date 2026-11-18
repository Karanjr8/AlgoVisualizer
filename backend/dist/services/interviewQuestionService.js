"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewQuestionService = void 0;
const geminiService_1 = require("./geminiService");
const zod_1 = require("zod");
const QuestionResultSchema = zod_1.z.object({
    interviewerMessage: zod_1.z.string().min(5),
    questionTopic: zod_1.z.string().min(1),
    questionType: zod_1.z.enum(['conceptual', 'problem_solving', 'behavioral', 'follow_up']).default('conceptual'),
});
class InterviewQuestionService {
    /**
     * Generates the opening question dynamically with Gemini based on candidate configuration
     */
    static async generateOpeningQuestion(config) {
        const prompt = `
You are a senior technical interviewer conducting a live, professional interview for the position of "${config.role}".
Difficulty Level: ${config.difficulty}
Interview Style / Format: ${config.style}
Candidate Selected Topics: ${config.topics.join(', ')}
Time Pressure Mode: ${config.timeLimitPerQuestion && config.timeLimitPerQuestion > 0 ? `${config.timeLimitPerQuestion} seconds limit per question` : 'Untimed'}

STRICT TOPIC CONSTRAINT:
You MUST ask a question belonging strictly to one of the candidate's selected topics: [${config.topics.join(', ')}].
Do not ask questions outside of these topics.
- If Frontend Developer is selected with JavaScript/React, ask about frontend architecture, browser mechanics, or modern React/JS.
- If Backend Developer is selected with DBMS/OS/Node, ask about database transactions, concurrency, or backend APIs.
- If DSA is selected, present a concrete algorithmic problem or data structure design question.

Instructions:
1. Provide a brief, professional greeting (1-2 sentences) introducing yourself as the AlgoVis Technical Interviewer.
2. Clearly formulate the first technical question suited for difficulty ${config.difficulty}.
3. The question must be open-ended, test conceptual and practical understanding, and require structured explanation.

Return strictly valid JSON conforming to this schema:
{
  "interviewerMessage": "Greeting and full opening question prompt",
  "questionTopic": "Exact topic name from [${config.topics.join(', ')}]",
  "questionType": "conceptual" | "problem_solving" | "behavioral"
}
`;
        const raw = await geminiService_1.GeminiService.generateStructuredJson(prompt, 'QuestionResultSchema');
        const validated = QuestionResultSchema.parse(raw);
        return {
            interviewerMessage: validated.interviewerMessage,
            questionTopic: validated.questionTopic,
            questionType: validated.questionType,
        };
    }
    /**
     * Generates the next question dynamically from the remaining selected topics
     */
    static async generateNextQuestion(config, previousMessages, turnNumber, maxTurns) {
        const transcript = previousMessages
            .map((m) => `[${m.sender.toUpperCase()}${m.questionTopic ? ` - ${m.questionTopic}` : ''}]: ${m.content}`)
            .join('\n\n');
        const testedTopics = previousMessages
            .filter((m) => m.sender === 'interviewer' && m.questionTopic)
            .map((m) => m.questionTopic);
        // Identify topics not yet covered heavily
        const uncoveredTopics = config.topics.filter((t) => !testedTopics.some((tested) => tested.toLowerCase().includes(t.toLowerCase())));
        const targetTopicList = uncoveredTopics.length > 0 ? uncoveredTopics : config.topics;
        const prompt = `
You are a senior technical interviewer for a "${config.role}" role at difficulty "${config.difficulty}".
Candidate's Selected Topics: ${config.topics.join(', ')}
Interview Style: ${config.style}
Progress: Question ${turnNumber} of ${maxTurns}.

Interview Transcript So Far:
${transcript}

Topics Already Covered: ${testedTopics.join(', ') || 'None yet'}
Recommended Next Topic(s) from candidate's selection: ${targetTopicList.join(', ')}

STRICT TOPIC CONSTRAINT:
You MUST generate a new, distinct question strictly belonging to one of the candidate's selected topics: [${config.topics.join(', ')}].
Prioritize uncovered topics: [${targetTopicList.join(', ')}].
Do not repeat questions already asked in the transcript.

Instructions:
1. Transition smoothly from the previous discussion (e.g. "Thank you. Let's move on to our next area...").
2. Formulate a challenging, high-signal question suited for a ${config.difficulty} level ${config.role}.

Return strictly valid JSON:
{
  "interviewerMessage": "Transition phrase and new question text",
  "questionTopic": "Topic name from candidate's selected topics",
  "questionType": "conceptual" | "problem_solving" | "behavioral"
}
`;
        const raw = await geminiService_1.GeminiService.generateStructuredJson(prompt, 'QuestionResultSchema');
        const validated = QuestionResultSchema.parse(raw);
        return {
            interviewerMessage: validated.interviewerMessage,
            questionTopic: validated.questionTopic,
            questionType: validated.questionType,
        };
    }
}
exports.InterviewQuestionService = InterviewQuestionService;
