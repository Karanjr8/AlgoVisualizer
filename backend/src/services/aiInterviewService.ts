import { InterviewQuestionService, QuestionSessionConfig, GeneratedQuestionResult } from './interviewQuestionService';
import { AnswerEvaluationService, AnswerEvaluationInput, AnswerTurnResult, DetailedAnswerEvaluation } from './answerEvaluationService';
import { InterviewReportService, FinalReportInput, CompleteAssessmentReport } from './interviewReportService';

export type SessionConfig = QuestionSessionConfig;
export type TurnEvaluation = DetailedAnswerEvaluation;
export type InterviewTurnResult = AnswerTurnResult;
export type FinalReportData = CompleteAssessmentReport;

export class AiInterviewService {
  /**
   * Generates opening interview question live using Gemini API
   */
  public static async generateOpeningQuestion(config: SessionConfig): Promise<GeneratedQuestionResult> {
    return InterviewQuestionService.generateOpeningQuestion(config);
  }

  /**
   * Evaluates submitted answer semantically and generates follow-up or next question live using Gemini API
   */
  public static async evaluateAndAdvance(params: AnswerEvaluationInput): Promise<AnswerTurnResult> {
    return AnswerEvaluationService.evaluateAnswerAndAdvance(params);
  }

  /**
   * Generates comprehensive post-interview diagnostic report from actual evaluations and transcripts using Gemini API
   */
  public static async generateFinalReport(params: FinalReportInput): Promise<CompleteAssessmentReport> {
    return InterviewReportService.generateReport(params);
  }
}
