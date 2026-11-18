"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewReportService = void 0;
const geminiService_1 = require("./geminiService");
const zod_1 = require("zod");
const FinalReportSchema = zod_1.z.object({
    overallScore: zod_1.z.number().min(0).max(100),
    performanceGrade: zod_1.z.enum(['Excellent', 'Very Good', 'Good', 'Average', 'Needs Improvement']),
    summary: zod_1.z.string().min(20),
    strengths: zod_1.z.array(zod_1.z.string()).min(2),
    improvementAreas: zod_1.z.array(zod_1.z.string()).min(2),
    dimensionScores: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
        score: zod_1.z.number().min(0).max(10),
        label: zod_1.z.string(),
        feedback: zod_1.z.string(),
    })),
    topicScores: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
        topic: zod_1.z.string(),
        questionsCount: zod_1.z.number(),
        averageScore: zod_1.z.number().min(0).max(10),
        strongAreas: zod_1.z.array(zod_1.z.string()),
        weakAreas: zod_1.z.array(zod_1.z.string()),
        conceptsToImprove: zod_1.z.array(zod_1.z.string()),
    })),
    questionReviews: zod_1.z.array(zod_1.z.object({
        questionNumber: zod_1.z.number(),
        question: zod_1.z.string(),
        topic: zod_1.z.string(),
        candidateAnswer: zod_1.z.string(),
        score: zod_1.z.number().min(0).max(10),
        correctness: zod_1.z.enum(['Correct', 'Partially Correct', 'Incorrect', 'Unanswered']),
        whatExplainedWell: zod_1.z.string(),
        whatWasMissing: zod_1.z.string(),
        suggestedIdealAnswer: zod_1.z.string(),
        conceptsToRevise: zod_1.z.array(zod_1.z.string()),
        answeredOnTime: zod_1.z.boolean(),
        timeSpentSeconds: zod_1.z.number().optional(),
    })),
    recommendations: zod_1.z.array(zod_1.z.string()).min(2),
    actionablePlan: zod_1.z.array(zod_1.z.object({
        priority: zod_1.z.enum(['High', 'Medium', 'Low']),
        topic: zod_1.z.string(),
        concept: zod_1.z.string(),
        recommendedAction: zod_1.z.string(),
        suggestedPractice: zod_1.z.string(),
    })),
    interviewerFeedback: zod_1.z.string().min(20),
});
class InterviewReportService {
    /**
     * Generates the final diagnostic assessment report purely from actual question evaluations and conversation history
     */
    static async generateReport(input) {
        const { sessionConfig, messages, evaluations } = input;
        const transcript = messages
            .map((m) => `[${m.sender.toUpperCase()}${m.questionTopic ? ` (${m.questionTopic})` : ''}]: ${m.content}`)
            .join('\n\n');
        const evalSummary = evaluations
            .map((e) => `[Dimension: ${e.dimension}] Score: ${e.score}/10 | Evidence: "${e.evidence}" | Evaluator Rationale: ${e.rationale}`)
            .join('\n');
        const prompt = `
You are the Chief Technical Interview Evaluator.
Analyze this completed technical interview session and generate an authentic, evidence-based post-interview diagnostic assessment report.
Candidate Role: ${sessionConfig.role}
Difficulty Level: ${sessionConfig.difficulty}
Selected Topics: ${sessionConfig.topics.join(', ')}
Interview Format / Style: ${sessionConfig.style}
Time Pressure Mode: ${sessionConfig.timeLimitPerQuestion ? `${sessionConfig.timeLimitPerQuestion}s per question` : 'Untimed'}

FULL INTERVIEW TRANSCRIPT:
${transcript}

STORED DIMENSION EVALUATIONS FROM SESSION:
${evalSummary || 'No individual dimension evaluations recorded.'}

INSTRUCTIONS FOR REPORT GENERATION:
1. Overall Performance Score: An integer from 0 to 100 based strictly on the candidate's actual answers and evaluations.
2. Performance Grade:
   - "Excellent" (90 - 100)
   - "Very Good" (80 - 89)
   - "Good" (70 - 79)
   - "Average" (55 - 69)
   - "Needs Improvement" (0 - 54)
3. Parameter-wise Assessment (Scores out of 10):
   - technicalAccuracy: Accuracy of core definitions, mechanics, and terminology.
   - conceptualUnderstanding: Grasp of underlying principles and trade-offs.
   - completeness: Whether answers covered full problem scope and edge cases.
   - communicationClarity: Structure, clarity, and articulation.
   - problemSolving: Methodical breakdown, decomposition, and reasoning.
   - practicalApplication: Connecting concepts to real software architecture.
   - timeManagement: Timeliness and pacing (or score 10 if untimed).
   Provide evidence-based diagnostic feedback for each.
4. Topic-wise Performance: For each selected topic (${sessionConfig.topics.join(', ')}), calculate the questionsCount, averageScore (/10), strongAreas, weakAreas, conceptsToImprove.
5. Question-by-Question Reviews: For every question asked in the transcript, extract:
   - Question number & text
   - Topic name
   - Candidate's submitted answer
   - Score (/10)
   - Correctness ("Correct" | "Partially Correct" | "Incorrect" | "Unanswered")
   - What the candidate explained well
   - What was missing or flawed
   - Suggested ideal model answer
   - Key concepts to revise
   - Whether answered on time
6. Strengths: 3-4 specific strengths directly evidenced by candidate responses.
7. Improvement Areas: 3-4 specific weaknesses and conceptual gaps identified.
8. Actionable Plan: A prioritized list (High, Medium, Low) of actionable revision items, targeted concepts, and concrete coding/architecture exercises.
9. Final Interviewer Feedback: A realistic 2-3 paragraph senior interviewer evaluation summarizing hiring readiness, communication, and next steps, with a clear disclaimer that this is an AI diagnostic simulation.

Return strictly valid JSON conforming to this schema:
{
  "overallScore": number (0-100),
  "performanceGrade": "Excellent" | "Very Good" | "Good" | "Average" | "Needs Improvement",
  "summary": "3-4 sentence executive diagnostic summary",
  "strengths": ["string", "string", "string"],
  "improvementAreas": ["string", "string", "string"],
  "dimensionScores": {
    "technicalAccuracy": { "score": number, "label": "Technical Accuracy", "feedback": "string" },
    "conceptualUnderstanding": { "score": number, "label": "Conceptual Understanding", "feedback": "string" },
    "completeness": { "score": number, "label": "Answer Completeness", "feedback": "string" },
    "communicationClarity": { "score": number, "label": "Communication Clarity", "feedback": "string" },
    "problemSolving": { "score": number, "label": "Problem-Solving Ability", "feedback": "string" },
    "practicalApplication": { "score": number, "label": "Practical Application", "feedback": "string" },
    "timeManagement": { "score": number, "label": "Time Management", "feedback": "string" }
  },
  "topicScores": {
    "TopicName": {
      "topic": "TopicName",
      "questionsCount": number,
      "averageScore": number,
      "strongAreas": ["string"],
      "weakAreas": ["string"],
      "conceptsToImprove": ["string"]
    }
  },
  "questionReviews": [
    {
      "questionNumber": 1,
      "question": "string",
      "topic": "string",
      "candidateAnswer": "string",
      "score": number,
      "correctness": "Correct" | "Partially Correct" | "Incorrect" | "Unanswered",
      "whatExplainedWell": "string",
      "whatWasMissing": "string",
      "suggestedIdealAnswer": "string",
      "conceptsToRevise": ["string"],
      "answeredOnTime": boolean,
      "timeSpentSeconds": number
    }
  ],
  "recommendations": ["string", "string", "string"],
  "actionablePlan": [
    {
      "priority": "High" | "Medium" | "Low",
      "topic": "string",
      "concept": "string",
      "recommendedAction": "string",
      "suggestedPractice": "string"
    }
  ],
  "interviewerFeedback": "string"
}
`;
        const raw = await geminiService_1.GeminiService.generateStructuredJson(prompt, 'FinalReportSchema', 35000);
        const validated = FinalReportSchema.parse(raw);
        return validated;
    }
}
exports.InterviewReportService = InterviewReportService;
