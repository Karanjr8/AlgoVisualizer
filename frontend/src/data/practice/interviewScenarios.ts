import { InterviewScenario } from '../../types/practice';

export const INTERVIEW_SCENARIOS: InterviewScenario[] = [
  {
    id: 'interview-1',
    title: 'The "Two Sum" Progression',
    difficulty: 'Medium',
    companyFocus: 'General FAANG',
    baseQuestionId: 'two-sum-ii', // We would normally point to a generic Two Sum first, but using II for demonstration
    progression: [
      {
        id: 'step-1',
        interviewerDialogue: 'Given an array of integers, return the indices of the two numbers that add up to a specific target. You can assume there is exactly one solution. How would you approach this?',
        expectedConcept: 'Brute Force / Hash Map',
        timeLimitMinutes: 10
      },
      {
        id: 'step-2',
        interviewerDialogue: 'Okay, the hash map solution gives us O(N) time and O(N) space. What if the array is absolutely massive, and we cannot afford O(N) auxiliary space? But wait, what if I told you the input array is already sorted?',
        expectedConcept: 'Opposite Direction Two Pointers',
        requiresCodeChange: true,
        timeLimitMinutes: 15
      },
      {
        id: 'step-3',
        interviewerDialogue: 'Great, the Two Pointers approach gives us O(N) time and O(1) space. What if the array was NOT sorted, we still cannot use O(N) extra space, but we are allowed to modify the input array?',
        expectedConcept: 'In-place sorting followed by Two Pointers',
        timeLimitMinutes: 5
      }
    ]
  },
  {
    id: 'interview-2',
    title: 'Finding Elements under Constraints',
    difficulty: 'Medium',
    companyFocus: 'General FAANG',
    baseQuestionId: 'binary-search',
    progression: [
      {
        id: 'step-1',
        interviewerDialogue: 'Write a function to find a target integer in a sorted array and return its index.',
        expectedConcept: 'Standard Binary Search',
        requiresCodeChange: true,
        timeLimitMinutes: 10
      },
      {
        id: 'step-2',
        interviewerDialogue: 'Nice job. Now, what if the array contains duplicates, and I want you to find the very FIRST occurrence of the target?',
        expectedConcept: 'Modified Binary Search (Lower Bound)',
        requiresCodeChange: true,
        timeLimitMinutes: 10
      },
      {
        id: 'step-3',
        interviewerDialogue: 'What is the time complexity of your solution? Is it possible to find the count of a target element in this array in better than O(N) time?',
        expectedConcept: 'O(log N). Yes, by doing Binary Search twice to find the first and last occurrence, then subtracting the indices.',
        timeLimitMinutes: 5
      }
    ]
  }
];
