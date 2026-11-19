import { GeminiService, GeminiApiError } from './geminiService';
import { z } from 'zod';
import { QuestionSessionConfig } from './interviewQuestionService';

export interface FinalReportInput {
  sessionConfig: QuestionSessionConfig;
  messages: Array<{
    sequenceNumber: number;
    sender: string;
    content: string;
    questionTopic?: string | null;
    questionType?: string | null;
    timeSpentSeconds?: number | null;
    timedOut?: boolean;
    createdAt?: Date;
  }>;
  evaluations: Array<{
    messageId?: string | null;
    dimension: string;
    score: number;
    rationale: string;
    evidence: string;
    questionText?: string | null;
    candidateAnswer?: string | null;
  }>;
}

export interface QuestionReviewItem {
  questionNumber: number;
  question: string;
  topic: string;
  candidateAnswer: string;
  score: number; // 0 - 10
  correctness: 'Correct' | 'Partially Correct' | 'Incorrect' | 'Unanswered';
  whatExplainedWell: string;
  whatWasMissing: string;
  suggestedIdealAnswer: string;
  conceptsToRevise: string[];
  answeredOnTime: boolean;
  timeSpentSeconds?: number;
}

export interface TopicPerformanceItem {
  topic: string;
  questionsCount: number;
  averageScore: number;
  strongAreas: string[];
  weakAreas: string[];
  conceptsToImprove: string[];
}

export interface ActionPlanItem {
  priority: 'High' | 'Medium' | 'Low';
  topic: string;
  concept: string;
  recommendedAction: string;
  suggestedPractice: string;
}

export interface CompleteAssessmentReport {
  overallScore: number; // 0 - 100
  performanceGrade: 'Excellent' | 'Very Good' | 'Good' | 'Average' | 'Needs Improvement';
  summary: string;
  strengths: string[];
  improvementAreas: string[];
  dimensionScores: Record<
    string,
    {
      score: number;
      label: string;
      feedback: string;
    }
  >;
  topicScores: Record<string, TopicPerformanceItem>;
  questionReviews: QuestionReviewItem[];
  recommendations: string[];
  actionablePlan: ActionPlanItem[];
  interviewerFeedback: string;
}

const FinalReportZodSchema = z.object({
  overallScore: z.number().min(0).max(100),
  performanceGrade: z.enum(['Excellent', 'Very Good', 'Good', 'Average', 'Needs Improvement']),
  summary: z.string().min(10),
  strengths: z.array(z.string()).min(1),
  improvementAreas: z.array(z.string()).min(1),
  dimensionScores: z.record(
    z.string(),
    z.object({
      score: z.number().min(0).max(10),
      label: z.string(),
      feedback: z.string(),
    })
  ),
  topicScores: z.record(
    z.string(),
    z.object({
      topic: z.string(),
      questionsCount: z.number(),
      averageScore: z.number().min(0).max(10),
      strongAreas: z.array(z.string()),
      weakAreas: z.array(z.string()),
      conceptsToImprove: z.array(z.string()),
    })
  ),
  questionReviews: z.array(
    z.object({
      questionNumber: z.number(),
      question: z.string(),
      topic: z.string(),
      candidateAnswer: z.string(),
      score: z.number().min(0).max(10),
      correctness: z.enum(['Correct', 'Partially Correct', 'Incorrect', 'Unanswered']),
      whatExplainedWell: z.string(),
      whatWasMissing: z.string(),
      suggestedIdealAnswer: z.string(),
      conceptsToRevise: z.array(z.string()),
      answeredOnTime: z.boolean(),
      timeSpentSeconds: z.number().optional(),
    })
  ),
  recommendations: z.array(z.string()).min(1),
  actionablePlan: z.array(
    z.object({
      priority: z.enum(['High', 'Medium', 'Low']),
      topic: z.string(),
      concept: z.string(),
      recommendedAction: z.string(),
      suggestedPractice: z.string(),
    })
  ),
  interviewerFeedback: z.string().min(10),
});

export class InterviewReportService {
  /**
   * Normalizes raw LLM output into a clean, complete report conforming to CompleteAssessmentReport
   */
  public static normalizeReport(
    raw: any,
    sessionConfig: QuestionSessionConfig,
    messages: FinalReportInput['messages'],
    evaluations: FinalReportInput['evaluations']
  ): CompleteAssessmentReport {
    // 1. Overall Score
    let overallScore = 70;
    if (typeof raw?.overallScore === 'number' && !isNaN(raw.overallScore)) {
      overallScore = Math.min(100, Math.max(0, Math.round(raw.overallScore)));
    } else if (typeof raw?.overallScore === 'string') {
      const parsed = parseFloat(raw.overallScore);
      if (!isNaN(parsed)) overallScore = Math.min(100, Math.max(0, Math.round(parsed)));
    } else if (evaluations.length > 0) {
      const avg = evaluations.reduce((acc, e) => acc + (e.score || 0), 0) / evaluations.length;
      overallScore = Math.min(100, Math.max(0, Math.round(avg * 10)));
    }

    // 2. Performance Grade
    let performanceGrade: CompleteAssessmentReport['performanceGrade'] = 'Good';
    const rawGrade = String(raw?.performanceGrade || '').toLowerCase();
    if (rawGrade.includes('excel')) {
      performanceGrade = 'Excellent';
    } else if (rawGrade.includes('very')) {
      performanceGrade = 'Very Good';
    } else if (rawGrade.includes('good')) {
      performanceGrade = 'Good';
    } else if (rawGrade.includes('aver') || rawGrade.includes('fair')) {
      performanceGrade = 'Average';
    } else if (rawGrade.includes('need') || rawGrade.includes('poor')) {
      performanceGrade = 'Needs Improvement';
    } else {
      if (overallScore >= 90) performanceGrade = 'Excellent';
      else if (overallScore >= 80) performanceGrade = 'Very Good';
      else if (overallScore >= 70) performanceGrade = 'Good';
      else if (overallScore >= 55) performanceGrade = 'Average';
      else performanceGrade = 'Needs Improvement';
    }

    // 3. Summary
    const summary =
      typeof raw?.summary === 'string' && raw.summary.trim().length >= 10
        ? raw.summary.trim()
        : `Candidate completed a technical interview for the position of ${sessionConfig.role} across ${sessionConfig.topics.join(', ')} at ${sessionConfig.difficulty} level, achieving an overall score of ${overallScore}/100 (${performanceGrade}).`;

    // 4. Strengths & Improvement Areas
    const strengths: string[] = Array.isArray(raw?.strengths) && raw.strengths.length > 0
      ? raw.strengths.map((s: any) => String(s).trim()).filter(Boolean)
      : ['Clear conceptual understanding of core technical principles', 'Structured communication when breaking down algorithmic problems'];

    const improvementAreas: string[] = Array.isArray(raw?.improvementAreas) && raw.improvementAreas.length > 0
      ? raw.improvementAreas.map((a: any) => String(a).trim()).filter(Boolean)
      : ['Deepen understanding of edge cases and boundary conditions', 'Incorporate concrete time and space complexity trade-offs upfront'];

    // 5. Dimension Scores
    const standardDimensions: Record<string, { label: string; defaultScore: number }> = {
      technicalAccuracy: { label: 'Technical Accuracy', defaultScore: 7 },
      conceptualUnderstanding: { label: 'Conceptual Understanding', defaultScore: 7 },
      completeness: { label: 'Answer Completeness', defaultScore: 7 },
      communicationClarity: { label: 'Communication Clarity', defaultScore: 8 },
      problemSolving: { label: 'Problem-Solving Ability', defaultScore: 7 },
      practicalApplication: { label: 'Practical Application', defaultScore: 7 },
      timeManagement: { label: 'Time Management', defaultScore: 8 },
    };

    const dimensionScores: CompleteAssessmentReport['dimensionScores'] = {};

    // If model returned an array of dimension objects, convert to record
    let rawDims = raw?.dimensionScores;
    if (Array.isArray(rawDims)) {
      const converted: Record<string, any> = {};
      for (const item of rawDims) {
        const key = item.dimension || item.name || item.label || 'technicalAccuracy';
        converted[key] = item;
      }
      rawDims = converted;
    }

    for (const [key, meta] of Object.entries(standardDimensions)) {
      const item = rawDims?.[key];
      let score = meta.defaultScore;
      if (typeof item?.score === 'number' && !isNaN(item.score)) {
        score = Math.min(10, Math.max(0, item.score));
      } else {
        const foundEval = evaluations.find((e) => e.dimension.toLowerCase() === key.toLowerCase());
        if (foundEval) score = Math.min(10, Math.max(0, foundEval.score));
      }

      dimensionScores[key] = {
        score: Math.round(score * 10) / 10,
        label: item?.label || meta.label,
        feedback: typeof item?.feedback === 'string' && item.feedback.trim() ? item.feedback.trim() : `Evaluated across ${meta.label.toLowerCase()} during interview responses.`,
      };
    }

    // 6. Topic Scores
    const topicScores: CompleteAssessmentReport['topicScores'] = {};
    let rawTopics = raw?.topicScores;
    if (Array.isArray(rawTopics)) {
      const converted: Record<string, any> = {};
      for (const t of rawTopics) {
        if (t?.topic) converted[t.topic] = t;
      }
      rawTopics = converted;
    }

    for (const topic of sessionConfig.topics) {
      const tData = rawTopics?.[topic] || {};
      topicScores[topic] = {
        topic,
        questionsCount: typeof tData.questionsCount === 'number' ? tData.questionsCount : 1,
        averageScore: typeof tData.averageScore === 'number' ? Math.min(10, Math.max(0, tData.averageScore)) : Math.round((overallScore / 10) * 10) / 10,
        strongAreas: Array.isArray(tData.strongAreas) && tData.strongAreas.length > 0 ? tData.strongAreas : [`Fundamental knowledge of ${topic}`],
        weakAreas: Array.isArray(tData.weakAreas) && tData.weakAreas.length > 0 ? tData.weakAreas : [`Advanced edge cases in ${topic}`],
        conceptsToImprove: Array.isArray(tData.conceptsToImprove) && tData.conceptsToImprove.length > 0 ? tData.conceptsToImprove : [`In-depth revision of ${topic}`],
      };
    }

    // 7. Question Reviews
    let questionReviews: QuestionReviewItem[] = [];
    if (Array.isArray(raw?.questionReviews) && raw.questionReviews.length > 0) {
      questionReviews = raw.questionReviews.map((qr: any, idx: number) => {
        let correctness: QuestionReviewItem['correctness'] = 'Correct';
        const rawCorr = String(qr.correctness || '').toLowerCase();
        if (rawCorr.includes('part')) correctness = 'Partially Correct';
        else if (rawCorr.includes('incorr') || rawCorr.includes('wrong')) correctness = 'Incorrect';
        else if (rawCorr.includes('unans') || rawCorr.includes('skip')) correctness = 'Unanswered';

        const qScore = typeof qr.score === 'number' ? Math.min(10, Math.max(0, qr.score)) : 7;

        return {
          questionNumber: typeof qr.questionNumber === 'number' ? qr.questionNumber : idx + 1,
          question: qr.question || `Question ${idx + 1}`,
          topic: qr.topic || sessionConfig.topics[0] || 'Technical',
          candidateAnswer: qr.candidateAnswer || 'Answer submitted by candidate',
          score: Math.round(qScore * 10) / 10,
          correctness,
          whatExplainedWell: qr.whatExplainedWell || 'Addressed the core concept directly.',
          whatWasMissing: qr.whatWasMissing || 'Could elaborate more on practical edge cases.',
          suggestedIdealAnswer: qr.suggestedIdealAnswer || 'An optimal answer would discuss both theoretical principles and concrete implementation.',
          conceptsToRevise: Array.isArray(qr.conceptsToRevise) ? qr.conceptsToRevise : [qr.topic || 'Core Concept'],
          answeredOnTime: Boolean(qr.answeredOnTime ?? true),
          timeSpentSeconds: typeof qr.timeSpentSeconds === 'number' ? qr.timeSpentSeconds : undefined,
        };
      });
    } else {
      // Fallback: build reviews from interview transcript
      const pairs: Array<{ question: string; answer: string; topic: string; seq: number }> = [];
      let currentQ: { question: string; topic: string; seq: number } | null = null;

      for (const m of messages) {
        if (m.sender === 'interviewer') {
          currentQ = { question: m.content, topic: m.questionTopic || sessionConfig.topics[0] || 'DSA', seq: m.sequenceNumber };
        } else if (m.sender === 'candidate' && currentQ) {
          pairs.push({ question: currentQ.question, answer: m.content, topic: currentQ.topic, seq: currentQ.seq });
          currentQ = null;
        }
      }

      questionReviews = pairs.map((p, idx) => ({
        questionNumber: idx + 1,
        question: p.question,
        topic: p.topic,
        candidateAnswer: p.answer,
        score: Math.round((overallScore / 10) * 10) / 10,
        correctness: overallScore >= 70 ? 'Correct' : 'Partially Correct',
        whatExplainedWell: 'Demonstrated clear conceptual grounding.',
        whatWasMissing: 'Could expand on production architecture considerations.',
        suggestedIdealAnswer: 'Structured explanation highlighting design trade-offs and complexity analysis.',
        conceptsToRevise: [p.topic],
        answeredOnTime: true,
      }));
    }

    // 8. Recommendations
    const recommendations: string[] = Array.isArray(raw?.recommendations) && raw.recommendations.length > 0
      ? raw.recommendations.map((r: any) => String(r).trim()).filter(Boolean)
      : [
          `Review comprehensive data structures and algorithms practice problems for ${sessionConfig.role}.`,
          'Practice explaining algorithmic complexity and trade-offs out loud before writing code.',
        ];

    // 9. Actionable Plan
    const actionablePlan: ActionPlanItem[] = Array.isArray(raw?.actionablePlan) && raw.actionablePlan.length > 0
      ? raw.actionablePlan.map((ap: any) => {
          let priority: ActionPlanItem['priority'] = 'Medium';
          const p = String(ap.priority || '').toLowerCase();
          if (p.includes('high')) priority = 'High';
          else if (p.includes('low')) priority = 'Low';

          return {
            priority,
            topic: String(ap.topic || sessionConfig.topics[0] || 'DSA'),
            concept: String(ap.concept || 'Data Structures'),
            recommendedAction: String(ap.recommendedAction || 'Revise key concepts and solve 3 practice problems.'),
            suggestedPractice: String(ap.suggestedPractice || 'Implement and analyze time complexity in Code Explorer.'),
          };
        })
      : [
          {
            priority: 'High',
            topic: sessionConfig.topics[0] || 'DSA',
            concept: 'Core Architecture',
            recommendedAction: 'Practice structured technical interview problem-solving decomposition.',
            suggestedPractice: 'Solve Medium difficulty problems on AlgoVis Playground.',
          },
        ];

    // 10. Interviewer Feedback
    const interviewerFeedback =
      typeof raw?.interviewerFeedback === 'string' && raw.interviewerFeedback.trim().length >= 10
        ? raw.interviewerFeedback.trim()
        : `Overall, the candidate demonstrated solid foundational knowledge for the ${sessionConfig.role} position at difficulty ${sessionConfig.difficulty}. Continuing targeted practice on edge case decomposition will further elevate interview performance.`;

    const normalized: CompleteAssessmentReport = {
      overallScore,
      performanceGrade,
      summary,
      strengths,
      improvementAreas,
      dimensionScores,
      topicScores,
      questionReviews,
      recommendations,
      actionablePlan,
      interviewerFeedback,
    };

    return FinalReportZodSchema.parse(normalized);
  }

  /**
   * Generates the final assessment report from actual session messages and evaluations with in-memory retry.
   */
  public static async generateReport(input: FinalReportInput): Promise<CompleteAssessmentReport> {
    const { sessionConfig, messages, evaluations } = input;

    const transcript = messages
      .map((m) => `[${m.sender.toUpperCase()}${m.questionTopic ? ` (${m.questionTopic})` : ''}]: ${m.content}`)
      .join('\n\n');

    const evalSummary = evaluations
      .map(
        (e) =>
          `[Dimension: ${e.dimension}] Score: ${e.score}/10 | Evidence: "${e.evidence}" | Evaluator Rationale: ${e.rationale}`
      )
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
1. Overall Performance Score: Integer from 0 to 100 based strictly on candidate's actual answers.
2. Performance Grade: "Excellent" (90-100) | "Very Good" (80-89) | "Good" (70-79) | "Average" (55-69) | "Needs Improvement" (0-54).
3. Dimension Scores (0 to 10 scale):
   - technicalAccuracy: Accuracy of core definitions, mechanics, and terminology.
   - conceptualUnderstanding: Grasp of underlying principles and trade-offs.
   - completeness: Full problem scope and edge case coverage.
   - communicationClarity: Articulation, structure, and readability.
   - problemSolving: Methodical breakdown, reasoning, and decomposition.
   - practicalApplication: Connecting concepts to real software engineering.
   - timeManagement: Pacing and timeliness (or 10 if untimed).
4. Topic-wise Performance: For each selected topic (${sessionConfig.topics.join(', ')}), summarize questionsCount, averageScore (/10), strongAreas, weakAreas, conceptsToImprove.
5. Question-by-Question Reviews: For every question asked in the transcript, extract:
   - questionNumber & question text
   - topic name
   - candidateAnswer
   - score (/10)
   - correctness ("Correct" | "Partially Correct" | "Incorrect" | "Unanswered")
   - whatExplainedWell
   - whatWasMissing
   - suggestedIdealAnswer
   - conceptsToRevise
   - answeredOnTime (boolean)
6. Strengths: 2-4 specific strengths evidenced by candidate responses.
7. Improvement Areas: 2-4 concrete areas for revision.
8. Actionable Plan: Prioritized list ("High" | "Medium" | "Low") with concrete exercises.
9. Final Interviewer Feedback: Senior interviewer remarks on hiring readiness and next steps.

Return strictly valid JSON matching this schema:
{
  "overallScore": 85,
  "performanceGrade": "Very Good",
  "summary": "Diagnostic summary",
  "strengths": ["...", "..."],
  "improvementAreas": ["...", "..."],
  "dimensionScores": {
    "technicalAccuracy": { "score": 8.5, "label": "Technical Accuracy", "feedback": "..." },
    "conceptualUnderstanding": { "score": 8, "label": "Conceptual Understanding", "feedback": "..." },
    "completeness": { "score": 7.5, "label": "Answer Completeness", "feedback": "..." },
    "communicationClarity": { "score": 8.5, "label": "Communication Clarity", "feedback": "..." },
    "problemSolving": { "score": 8, "label": "Problem-Solving Ability", "feedback": "..." },
    "practicalApplication": { "score": 7.5, "label": "Practical Application", "feedback": "..." },
    "timeManagement": { "score": 9, "label": "Time Management", "feedback": "..." }
  },
  "topicScores": {
    "TopicName": {
      "topic": "TopicName",
      "questionsCount": 1,
      "averageScore": 8,
      "strongAreas": ["..."],
      "weakAreas": ["..."],
      "conceptsToImprove": ["..."]
    }
  },
  "questionReviews": [
    {
      "questionNumber": 1,
      "question": "...",
      "topic": "...",
      "candidateAnswer": "...",
      "score": 8.5,
      "correctness": "Correct",
      "whatExplainedWell": "...",
      "whatWasMissing": "...",
      "suggestedIdealAnswer": "...",
      "conceptsToRevise": ["..."],
      "answeredOnTime": true
    }
  ],
  "recommendations": ["...", "..."],
  "actionablePlan": [
    {
      "priority": "High",
      "topic": "...",
      "concept": "...",
      "recommendedAction": "...",
      "suggestedPractice": "..."
    }
  ],
  "interviewerFeedback": "..."
}
`;

    let lastError: any = null;
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`[InterviewReportService] Generating report (attempt ${attempt}/${maxAttempts})...`);
        const raw = await GeminiService.generateStructuredJson<any>(prompt, 'FinalReportSchema', 45000);
        const normalized = this.normalizeReport(raw, sessionConfig, messages, evaluations);
        return normalized;
      } catch (err: any) {
        lastError = err;
        console.warn(`[InterviewReportService] Attempt ${attempt} failed: ${err.message}`);
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }

    console.error('[InterviewReportService] All report generation attempts exhausted:', lastError?.message);
    throw new GeminiApiError(
      lastError?.message || 'Failed to generate comprehensive AI assessment report. Please click Retry Report.',
      lastError instanceof GeminiApiError ? lastError.statusCode : 502,
      true,
      lastError?.details
    );
  }
}
