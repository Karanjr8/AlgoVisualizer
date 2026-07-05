export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface FollowUp {
  question: string;
  expectedAnswer: string;
  newTimeComplexity?: string;
  newSpaceComplexity?: string;
}

export interface PracticeQuestion {
  id: string;
  title: string;
  difficulty: Difficulty;
  pattern: string; // e.g., "Two Pointers", "Sliding Window"
  tags: string[];
  description: string; // Markdown supported
  hints: string[];
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  
  // The Solution & Explanation Phase
  solutionCode: string;
  alternativeSolutionCode?: string;
  explanation: string;
  patternRecognition: string;
  commonMistakes: string[];
  
  followUpQuestions?: FollowUp[];
}

export interface DebugChallenge extends PracticeQuestion {
  brokenCode: string;
  bugType: 'Off-by-one' | 'Infinite Loop' | 'Wrong Condition' | 'Missing Base Case' | 'Other';
  bugExplanation: string;
}

export interface ComplexityChallenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  pattern: string;
  codeSnippet: string;
  optionsTime: string[];
  correctTime: string;
  optionsSpace: string[];
  correctSpace: string;
  explanation: string;
}

export interface InterviewScenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  companyFocus?: string;
  baseQuestionId: string; // Refers to a PracticeQuestion id
  progression: InterviewStep[];
}

export interface InterviewStep {
  id: string;
  interviewerDialogue: string;
  expectedConcept: string;
  // If it's a code modification step
  requiresCodeChange?: boolean;
  timeLimitMinutes?: number;
}
