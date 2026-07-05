import { PRACTICE_QUESTIONS } from '../data/practice/questions';
import { DEBUG_BANK } from '../data/practice/debugBank';
import { COMPLEXITY_BANK } from '../data/practice/complexityBank';
import { INTERVIEW_SCENARIOS } from '../data/practice/interviewScenarios';

export const usePracticeData = () => {
  return {
    getQuestions: () => PRACTICE_QUESTIONS,
    getQuestionsByPattern: (pattern: string) => PRACTICE_QUESTIONS.filter(q => q.pattern === pattern),
    getQuestionById: (id: string) => PRACTICE_QUESTIONS.find(q => q.id === id),
    
    getDebugChallenges: () => DEBUG_BANK,
    getDebugChallengeById: (id: string) => DEBUG_BANK.find(q => q.id === id),
    
    getComplexityChallenges: () => COMPLEXITY_BANK,
    
    getInterviewScenarios: () => INTERVIEW_SCENARIOS,
  };
};
