import { GeminiService } from './geminiService';
import { z } from 'zod';
import { QuestionSessionConfig } from './interviewQuestionService';

export interface AnswerEvaluationInput {
  sessionConfig: QuestionSessionConfig;
  currentQuestion: string;
  questionTopic: string;
  candidateAnswer: string;
  previousMessages: Array<{ sender: string; content: string; questionTopic?: string | null }>;
  turnCount: number;
  maxTurns: number;
  timeSpentSeconds?: number;
  timedOut?: boolean;
}

export interface DetailedAnswerEvaluation {
  technicalAccuracy: number;       // 0 - 10
  conceptualUnderstanding: number; // 0 - 10
  completeness: number;            // 0 - 10
  problemSolving: number;          // 0 - 10
  communicationClarity: number;    // 0 - 10
  practicalApplication: number;    // 0 - 10
  confidence?: number;             // 0 - 10
  timeManagement?: number;         // 0 - 10
  overallScore: number;            // 0 - 10
  evaluationExplanation: string;
  whatExplainedCorrectly: string;
  missingConcepts: string[];
  incorrectStatements: string[];
  areasForImprovement: string;
  suggestedImprovedAnswer: string;
  relevantConceptsToRevise: string[];
  evidenceFromAnswer: string;
}

export interface AnswerTurnResult {
  evaluation: DetailedAnswerEvaluation;
  nextInterviewerMessage: string;
  nextQuestionTopic: string;
  nextQuestionType: 'conceptual' | 'problem_solving' | 'follow_up' | 'behavioral';
  nextAction: 'ask_follow_up' | 'next_question' | 'conclude';
  isComplete: boolean;
}

const EvaluationSchema = z.object({
  technicalAccuracy: z.number().min(0).max(10),
  conceptualUnderstanding: z.number().min(0).max(10),
  completeness: z.number().min(0).max(10),
  problemSolving: z.number().min(0).max(10),
  communicationClarity: z.number().min(0).max(10),
  practicalApplication: z.number().min(0).max(10),
  confidence: z.number().min(0).max(10).optional(),
  timeManagement: z.number().min(0).max(10).optional(),
  overallScore: z.number().min(0).max(10),
  evaluationExplanation: z.string().min(5),
  whatExplainedCorrectly: z.string().min(3),
  missingConcepts: z.array(z.string()).default([]),
  incorrectStatements: z.array(z.string()).default([]),
  areasForImprovement: z.string().min(3),
  suggestedImprovedAnswer: z.string().min(10),
  relevantConceptsToRevise: z.array(z.string()).default([]),
  evidenceFromAnswer: z.string().default('Based on candidate explanation.'),
});

const TurnResultSchema = z.object({
  evaluation: EvaluationSchema,
  nextInterviewerMessage: z.string().min(5),
  nextQuestionTopic: z.string().min(1),
  nextQuestionType: z.enum(['conceptual', 'problem_solving', 'follow_up', 'behavioral']).default('conceptual'),
  nextAction: z.enum(['ask_follow_up', 'next_question', 'conclude']).default('next_question'),
  isComplete: z.boolean().default(false),
});

export class AnswerEvaluationService {
  /**
   * Evaluates a candidate's answer using Gemini semantically and determines the next question or follow-up
   */
  public static async evaluateAnswerAndAdvance(input: AnswerEvaluationInput): Promise<AnswerTurnResult> {
    const {
      sessionConfig,
      currentQuestion,
      questionTopic,
      candidateAnswer,
      previousMessages,
      turnCount,
      maxTurns,
      timeSpentSeconds,
      timedOut,
    } = input;

    const isLastTurn = turnCount >= maxTurns;
    const isFollowUpEnabled = sessionConfig.features.includes('Follow-up Questions');

    const transcript = previousMessages
      .map((m) => `[${m.sender.toUpperCase()}${m.questionTopic ? ` (${m.questionTopic})` : ''}]: ${m.content}`)
      .join('\n\n');

    const isUnanswered = timedOut && (!candidateAnswer || candidateAnswer.includes('Time Expired'));

    const prompt = `
You are a senior technical interviewer conducting an interview for "${sessionConfig.role}" at difficulty "${sessionConfig.difficulty}".
Candidate's Selected Topics: ${sessionConfig.topics.join(', ')}
Interview Style: ${sessionConfig.style}
Progress: Question ${turnCount} of ${maxTurns}. Is final turn: ${isLastTurn ? 'YES' : 'NO'}.
Time Pressure Mode: ${sessionConfig.timeLimitPerQuestion ? `${sessionConfig.timeLimitPerQuestion}s limit` : 'Untimed'}
Candidate Time Spent: ${timeSpentSeconds !== undefined ? `${timeSpentSeconds} seconds` : 'N/A'}
Did timer expire: ${timedOut ? 'YES (Auto-submitted on timeout)' : 'NO'}

Interview Transcript So Far:
${transcript}

CURRENT QUESTION BEING EVALUATED (Topic: ${questionTopic}):
"${currentQuestion}"

CANDIDATE'S SUBMITTED ANSWER:
"${candidateAnswer}"

EVALUATION INSTRUCTIONS:
Evaluate the candidate's actual answer semantically (evaluating the true technical meaning, not just keyword presence).
${isUnanswered ? 'NOTE: The candidate ran out of time without submitting an answer. Grade appropriately as an unanswered question.' : ''}
Score each parameter on a strict 0.0 to 10.0 scale:
- technicalAccuracy (0-10): Factual precision, correct technical mechanisms, proper terminology.
- conceptualUnderstanding (0-10): Understanding why things work, principles behind the code/system.
- completeness (0-10): Addressed all components of the prompt, including trade-offs and edge cases.
- problemSolving (0-10): Systematic reasoning, logical flow, consideration of alternative approaches.
- communicationClarity (0-10): Clarity of explanation, readable structure, professional communication.
- practicalApplication (0-10): Ability to relate concepts to real-world software architecture.
- confidence (0-10): Deduced strictly from textual structure and reasoning firmness.
- timeManagement (0-10): ${sessionConfig.timeLimitPerQuestion ? 'Score based on pacing and whether time expired' : 'Untimed mode: score 10.0'}.
- overallScore (0-10): Weighted overall score for this turn.

Also generate:
- evaluationExplanation: A clear paragraph explaining why this score was assigned.
- whatExplainedCorrectly: Specific aspects the candidate handled well.
- missingConcepts: Array of important concepts or trade-offs omitted.
- incorrectStatements: Array of misconceptions or incorrect claims (or empty array if none).
- areasForImprovement: Concrete advice for improvement.
- suggestedImprovedAnswer: A concise model answer illustrating what an ideal response looks like.
- relevantConceptsToRevise: Array of 2-4 key technical topics to review.
- evidenceFromAnswer: Direct quotation or textual evidence from the candidate's submission.

NEXT INTERVIEWER ACTION:
- If this IS the final turn (${isLastTurn}):
  Set isComplete = true, nextAction = "conclude", and formulate a brief, polite closing statement thanking the candidate for their time.
- If this is NOT the final turn:
  - If follow-up questions are enabled AND the candidate gave an answer worth expanding or clarifying:
    Formulate a natural, context-aware FOLLOW-UP question directly referencing what the candidate just explained (e.g., "Good point on X. How would you handle Y when Z occurs?").
    Set nextQuestionType = "follow_up", nextAction = "ask_follow_up".
  - Otherwise: Transition cleanly and ask a new question chosen strictly from the candidate's selected topics: [${sessionConfig.topics.join(', ')}].
    Set nextQuestionType = "conceptual" | "problem_solving", nextAction = "next_question".

Return strictly valid JSON conforming to this schema:
{
  "evaluation": {
    "technicalAccuracy": number (0-10),
    "conceptualUnderstanding": number (0-10),
    "completeness": number (0-10),
    "problemSolving": number (0-10),
    "communicationClarity": number (0-10),
    "practicalApplication": number (0-10),
    "confidence": number (0-10),
    "timeManagement": number (0-10),
    "overallScore": number (0-10),
    "evaluationExplanation": "string",
    "whatExplainedCorrectly": "string",
    "missingConcepts": ["string"],
    "incorrectStatements": ["string"],
    "areasForImprovement": "string",
    "suggestedImprovedAnswer": "string",
    "relevantConceptsToRevise": ["string"],
    "evidenceFromAnswer": "string"
  },
  "nextInterviewerMessage": "string",
  "nextQuestionTopic": "topic name from [${sessionConfig.topics.join(', ')}]",
  "nextQuestionType": "conceptual" | "problem_solving" | "follow_up" | "behavioral",
  "nextAction": "${isLastTurn ? 'conclude' : 'ask_follow_up | next_question'}",
  "isComplete": ${isLastTurn}
}
`;

    const raw = await GeminiService.generateStructuredJson<any>(prompt, 'TurnResultSchema');
    const validated = TurnResultSchema.parse(raw);

    return {
      evaluation: validated.evaluation,
      nextInterviewerMessage: validated.nextInterviewerMessage,
      nextQuestionTopic: validated.nextQuestionTopic,
      nextQuestionType: validated.nextQuestionType,
      nextAction: isLastTurn ? 'conclude' : validated.nextAction,
      isComplete: isLastTurn || validated.isComplete,
    };
  }
}

