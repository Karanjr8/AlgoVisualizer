"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiInterviewService = void 0;
const interviewQuestionService_1 = require("./interviewQuestionService");
const answerEvaluationService_1 = require("./answerEvaluationService");
const interviewReportService_1 = require("./interviewReportService");
class AiInterviewService {
    /**
     * Generates opening interview question live using Gemini API
     */
    static async generateOpeningQuestion(config) {
        return interviewQuestionService_1.InterviewQuestionService.generateOpeningQuestion(config);
    }
    /**
     * Evaluates submitted answer semantically and generates follow-up or next question live using Gemini API
     */
    static async evaluateAndAdvance(params) {
        return answerEvaluationService_1.AnswerEvaluationService.evaluateAnswerAndAdvance(params);
    }
    /**
     * Generates comprehensive post-interview diagnostic report from actual evaluations and transcripts using Gemini API
     */
    static async generateFinalReport(params) {
        return interviewReportService_1.InterviewReportService.generateReport(params);
    }
}
exports.AiInterviewService = AiInterviewService;
