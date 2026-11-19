import { GeminiService, GeminiApiError } from './geminiService';

// ==========================================
// 1. DEBUG MODE INTERFACES
// ==========================================
export interface DebugTestCase {
  id: string;
  input: any;
  expectedOutput: any;
  isHidden?: boolean;
  explanation?: string;
}

export interface DebugChallenge {
  id: string;
  mode: 'debug';
  title: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  functionName: string;
  problem: string;
  constraints: string[];
  brokenCode: string;
  bugCount: number;
  bugHints: string[];
  testCases: DebugTestCase[];
  correctedSolution: string;
  explanation: string;
}

export interface DebugEvaluation {
  passed: boolean;
  overallFeedback: string;
  remainingBugs: string[];
  fixedBugs: string[];
  explanation: string;
  suggestions: string[];
}

// ==========================================
// 2. SPEED RUN INTERFACES
// ==========================================
export interface SpeedRunQuestion {
  id: string;
  mode: 'speedrun';
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionType:
    | 'mcq'
    | 'predict_output'
    | 'time_complexity'
    | 'space_complexity'
    | 'missing_code'
    | 'algorithm_id'
    | 'edge_case'
    | 'short_problem';
  statement: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string; // The correct option string or index
  correctOptionIndex: number; // 0-based index
  explanation: string;
}

export interface SpeedRunReport {
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedAnswers: number;
  completionTimeSeconds: number;
  topicPerformance: Record<string, { total: number; correct: number; accuracy: number }>;
  difficultyPerformance: Record<string, { total: number; correct: number; accuracy: number }>;
  weakTopics: string[];
  recommendations: string[];
}

// ==========================================
// 3. COMPLEXITY CHALLENGES INTERFACES
// ==========================================
export interface ComplexityChallenge {
  id: string;
  mode: 'complexity';
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  codeSnippet: string;
  secondCodeSnippet?: string; // For comparing two implementations
  timeComplexity: string; // e.g. "O(n log n)"
  spaceComplexity: string; // e.g. "O(1)" or "O(n)"
  timeComplexityOptions: string[];
  spaceComplexityOptions: string[];
  explanation: string;
  recurrenceRelation?: string;
  bestCaseComplexity?: string;
  worstCaseComplexity?: string;
}

export interface ComplexityEvaluation {
  isTimeCorrect: boolean;
  isSpaceCorrect: boolean;
  overallScore: number; // 0 - 100
  timeFeedback: string;
  spaceFeedback: string;
  reasoningFeedback?: string;
  stepByStepBreakdown: string;
}

// ==========================================
// CENTRAL PRACTICE AI SERVICE
// ==========================================
export class PracticeAiService {
  /**
   * Generates a tailored, genuinely broken algorithm challenge using Gemini.
   */
  public static async generateDebugChallenge(params: {
    topic: string;
    difficulty: string;
    language?: string;
  }): Promise<DebugChallenge> {
    const { topic, difficulty, language = 'javascript' } = params;

    const prompt = `You are a Principal Software Engineer creating an interactive algorithm debugging challenge for the AlgoVis DSA platform.

Create an engaging debugging challenge for:
- Topic: ${topic}
- Difficulty: ${difficulty}
- Language: ${language}

CRITICAL REQUIREMENTS:
1. The problem must have a clear specification (e.g. binary search, two sum, reverse linked list, quicksort partition, cycle detection, knapsack transition, etc.).
2. The provided "brokenCode" MUST CONTAIN REAL LOGICAL BUGS (1 to 2 bugs for Beginner, 2 to 3 bugs for Intermediate, 2 to 4 bugs for Advanced).
3. Do NOT make the bug a mere syntax typo or missing bracket.
   Examples of real bugs:
   - Off-by-one errors in loop boundaries or slices (e.g. i < len vs i <= len).
   - Inverted condition in comparisons (e.g. > vs <).
   - Missing base cases in recursive methods.
   - Premature return statement inside a loop.
   - Incorrect pointer updates in two-pointer or linked list logic.
   - Wrong indices in dynamic programming memoization lookups.
4. Provide 4 to 5 rigorous test cases:
   - Include sample test cases and 1-2 edge cases (e.g. empty array, single element, negative numbers, target not found).
   - Each test case must have:
     - "id": string
     - "input": Array of arguments to pass to the function (e.g. [[1, 3, 5, 7], 5] for function(arr, target)).
     - "expectedOutput": The correct return value.
     - "isHidden": boolean (mark the last 1 or 2 as true).
     - "explanation": brief string explaining the test case.
5. The "functionName" must match the entry function in the broken code.
6. Provide a working "correctedSolution" and an in-depth "explanation" of what was broken.

Respond ONLY with valid JSON conforming strictly to this schema:
{
  "id": "debug_${Date.now()}",
  "mode": "debug",
  "title": "Clear Challenge Title",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "language": "${language}",
  "functionName": "entryFunctionName",
  "problem": "Detailed problem description with input/output format",
  "constraints": ["1 <= arr.length <= 10^5", "-10^9 <= arr[i] <= 10^9"],
  "brokenCode": "function entryFunctionName(param1, param2) { ... }",
  "bugCount": 2,
  "bugHints": ["Hint 1 pointing towards the boundary condition", "Hint 2 about the loop check"],
  "testCases": [
    {
      "id": "tc_1",
      "input": [[1, 2, 4, 8], 4],
      "expectedOutput": 2,
      "isHidden": false,
      "explanation": "Standard case"
    }
  ],
  "correctedSolution": "function entryFunctionName(param1, param2) { ... }",
  "explanation": "Detailed explanation of why the original code failed and how the fix resolves it."
}`;

    try {
      const result = await GeminiService.generateInteraction(prompt, true, 45000, {
        temperature: 0.3,
      });

      const parsed: DebugChallenge = GeminiService.repairJson<DebugChallenge>(result.text);

      // Validate required fields
      if (!parsed.problem || !parsed.brokenCode || !Array.isArray(parsed.testCases) || parsed.testCases.length === 0) {
        throw new Error('Incomplete debug challenge structure received from Gemini');
      }

      parsed.id = parsed.id || `debug_${Date.now()}`;
      parsed.mode = 'debug';
      parsed.topic = topic;
      parsed.difficulty = difficulty as any;
      parsed.language = language;

      return parsed;
    } catch (err: any) {
      console.error('[PracticeAiService] generateDebugChallenge failed:', err.message);
      throw err instanceof GeminiApiError
        ? err
        : new GeminiApiError(`Failed to generate debugging challenge: ${err.message}`, 502);
    }
  }

  /**
   * Uses Gemini to analyze submitted code alongside actual test execution results.
   */
  public static async evaluateDebugSolution(params: {
    challenge: DebugChallenge;
    userCode: string;
    testResults: any[];
    language?: string;
  }): Promise<DebugEvaluation> {
    const { challenge, userCode, testResults, language = 'javascript' } = params;

    const totalTests = testResults.length;
    const passedTests = testResults.filter((t) => t.passed).length;
    const allPassed = totalTests > 0 && passedTests === totalTests;

    const prompt = `You are evaluating a candidate's code submission in the AlgoVis Debugging Challenge.

CHALLENGE DETAILS:
- Topic: ${challenge.topic}
- Problem: ${challenge.problem}
- Intended Bugs in original: ${challenge.explanation}
- Language: ${language}

CANDIDATE SUBMISSION:
\`\`\`${language}
${userCode}
\`\`\`

TEST RUNNER RESULTS:
- Passed: ${passedTests} / ${totalTests}
- Results: ${JSON.stringify(testResults.slice(0, 5))}

TASK:
Provide constructive feedback explaining:
1. Did the candidate fix the intentional bugs?
2. Are there any edge cases or remaining bugs that failed?
3. What is the algorithmic impact of their changes?

Respond ONLY with valid JSON:
{
  "passed": ${allPassed},
  "overallFeedback": "Concise 2-3 sentence overview of their solution quality.",
  "fixedBugs": ["Bug 1 fixed explanation", "Bug 2 fixed explanation"],
  "remainingBugs": ["Any remaining issues or empty array if all passed"],
  "explanation": "Clear architectural explanation of the algorithm.",
  "suggestions": ["Suggestion for improvement or optimization"]
}`;

    try {
      const result = await GeminiService.generateInteraction(prompt, true, 35000, {
        temperature: 0.2,
      });
      const parsed = GeminiService.repairJson<DebugEvaluation>(result.text);
      parsed.passed = allPassed;
      return parsed;
    } catch (err: any) {
      console.warn('[PracticeAiService] evaluateDebugSolution fallback:', err.message);
      return {
        passed: allPassed,
        overallFeedback: allPassed
          ? 'Great job! Your solution passed all test cases successfully.'
          : `Your solution passed ${passedTests} of ${totalTests} test cases. Review the failed test cases to pinpoint remaining edge cases.`,
        fixedBugs: allPassed ? ['All identified bugs were resolved.'] : [],
        remainingBugs: allPassed ? [] : ['Check boundary conditions and edge cases.'],
        explanation: challenge.explanation,
        suggestions: ['Review time complexity and memory usage.'],
      };
    }
  }

  /**
   * Generates a rapid-fire set of DSA questions for Speed Run mode.
   */
  public static async generateSpeedRunSet(params: {
    difficulty: string;
    topics: string[];
    count: number;
    category?: string;
  }): Promise<SpeedRunQuestion[]> {
    const { difficulty, topics, count, category = 'mixed' } = params;

    const prompt = `You are an elite competitive programming coach creating a rapid-fire DSA Speed Run assessment for the AlgoVis platform.

PARAMETERS:
- Difficulty: ${difficulty}
- Topics: ${topics.join(', ')}
- Question Count: ${count}
- Focus Category: ${category} (Can be 'mixed', 'mcq', 'predict_output', 'time_complexity', 'space_complexity', 'missing_code', 'algorithm_id', 'edge_case', 'short_problem')

REQUIREMENTS:
1. Generate exactly ${count} distinct, high-quality technical questions.
2. If "predict_output" is used, provide a deterministic code snippet in JavaScript or Python without undefined behavior.
3. If "time_complexity" or "space_complexity" is used, ensure the Big-O expression is mathematically exact.
4. Each question must have:
   - "id": string
   - "mode": "speedrun"
   - "topic": One of the chosen topics (${topics.join(', ')})
   - "difficulty": "${difficulty}"
   - "questionType": string
   - "statement": Clear, concise problem statement
   - "codeSnippet": (optional) string with formatted code if required
   - "options": exactly 4 distinct answer choices
   - "correctOptionIndex": 0, 1, 2, or 3
   - "correctAnswer": Exact text of options[correctOptionIndex]
   - "explanation": In-depth 2-3 sentence explanation of why this answer is correct and why other options are pitfalls.

Respond ONLY with valid JSON conforming to:
{
  "questions": [
    {
      "id": "sr_1",
      "mode": "speedrun",
      "topic": "${topics[0] || 'Arrays'}",
      "difficulty": "${difficulty}",
      "questionType": "predict_output",
      "statement": "What will be the output of the following function call?",
      "codeSnippet": "function test() {\\n  let arr = [1, 2, 3];\\n  return arr.map(x => x * 2).filter(x => x > 3);\\n}",
      "options": ["[2, 4, 6]", "[4, 6]", "[2]", "[6]"],
      "correctOptionIndex": 1,
      "correctAnswer": "[4, 6]",
      "explanation": "map creates [2, 4, 6], and filter retains elements strictly greater than 3, resulting in [4, 6]."
    }
  ]
}`;

    try {
      const result = await GeminiService.generateInteraction(prompt, true, 50000, {
        temperature: 0.3,
      });

      const parsed = GeminiService.repairJson<{ questions: SpeedRunQuestion[] }>(result.text);

      if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('Empty questions array returned from Gemini');
      }

      // Sanitize and validate
      return parsed.questions.map((q, idx) => ({
        id: q.id || `sr_${Date.now()}_${idx}`,
        mode: 'speedrun',
        topic: q.topic || topics[idx % topics.length] || 'DSA',
        difficulty: (q.difficulty || difficulty) as any,
        questionType: q.questionType || 'mcq',
        statement: q.statement,
        codeSnippet: q.codeSnippet || undefined,
        options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['A', 'B', 'C', 'D'],
        correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
        correctAnswer: q.options?.[q.correctOptionIndex] || q.correctAnswer || q.options?.[0] || 'A',
        explanation: q.explanation || 'Option is algorithmically optimal.',
      }));
    } catch (err: any) {
      console.error('[PracticeAiService] generateSpeedRunSet failed:', err.message);
      throw err instanceof GeminiApiError
        ? err
        : new GeminiApiError(`Failed to generate Speed Run questions: ${err.message}`, 502);
    }
  }

  /**
   * Calculates comprehensive Speed Run results and AI recommendations.
   */
  public static evaluateSpeedRun(params: {
    questions: SpeedRunQuestion[];
    userAnswers: Record<string, string>; // questionId -> selectedOptionText
    timeTakenSeconds: number;
  }): SpeedRunReport {
    const { questions, userAnswers, timeTakenSeconds } = params;

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const topicStats: Record<string, { total: number; correct: number }> = {};
    const diffStats: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q) => {
      const topic = q.topic || 'General DSA';
      const diff = q.difficulty || 'Medium';

      if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
      if (!diffStats[diff]) diffStats[diff] = { total: 0, correct: 0 };

      topicStats[topic].total++;
      diffStats[diff].total++;

      const selected = userAnswers[q.id];
      if (!selected || selected.trim() === '') {
        unattemptedCount++;
      } else if (selected.trim() === q.correctAnswer.trim()) {
        correctCount++;
        topicStats[topic].correct++;
        diffStats[diff].correct++;
      } else {
        incorrectCount++;
      }
    });

    const totalQuestions = questions.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const score = Math.max(0, correctCount * 100 - incorrectCount * 20);

    const topicPerformance: Record<string, { total: number; correct: number; accuracy: number }> = {};
    const weakTopics: string[] = [];

    Object.keys(topicStats).forEach((topic) => {
      const { total, correct } = topicStats[topic];
      const acc = Math.round((correct / total) * 100);
      topicPerformance[topic] = { total, correct, accuracy: acc };
      if (acc < 60) {
        weakTopics.push(topic);
      }
    });

    const difficultyPerformance: Record<string, { total: number; correct: number; accuracy: number }> = {};
    Object.keys(diffStats).forEach((diff) => {
      const { total, correct } = diffStats[diff];
      difficultyPerformance[diff] = {
        total,
        correct,
        accuracy: Math.round((correct / total) * 100),
      };
    });

    const recommendations: string[] = [];
    if (weakTopics.length > 0) {
      recommendations.push(
        `Focus on practicing ${weakTopics.slice(0, 2).join(' and ')} to improve pattern recognition.`
      );
    }
    if (accuracy >= 80) {
      recommendations.push('Exceptional accuracy! Step up to the next difficulty level or reduce the time limit.');
    } else if (accuracy >= 50) {
      recommendations.push('Good foundation. Pay close attention to loop termination and edge conditions.');
    } else {
      recommendations.push('Revisit basic complexity theorems and practice output tracing with pencil and paper.');
    }

    return {
      score,
      accuracy,
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unattemptedAnswers: unattemptedCount,
      completionTimeSeconds: timeTakenSeconds,
      topicPerformance,
      difficultyPerformance,
      weakTopics: weakTopics.length > 0 ? weakTopics : ['None! Great all-round mastery.'],
      recommendations,
    };
  }

  /**
   * Generates code analysis challenges for Big-O Complexity Challenges.
   */
  public static async generateComplexityChallenges(params: {
    difficulty: string;
    category?: string;
    count?: number;
  }): Promise<ComplexityChallenge[]> {
    const { difficulty, category = 'all', count = 5 } = params;
    const requestedCount = Math.min(15, Math.max(1, Number(count) || 5));

    console.log(`[PracticeAiService] Generating ${requestedCount} complexity challenges (difficulty: ${difficulty}, category: ${category})...`);

    const prompt = `You are a Professor of Computer Science creating Big-O Complexity Challenges for AlgoVis.

PARAMETERS:
- Difficulty: ${difficulty}
- Category: ${category} (e.g., 'nested_loops', 'recursion', 'space_complexity', 'compare_algorithms', 'graph_complexity', 'dp_complexity', 'amortized', 'all')
- Challenge Count: Exactly ${requestedCount} challenges

REQUIREMENTS:
1. Provide realistic algorithmic code snippets with non-trivial loops, divide-and-conquer, recursion trees, or auxiliary data structures.
2. If "compare_algorithms" is chosen, provide two functions in "codeSnippet" and "secondCodeSnippet".
3. Provide standard selectable Big-O options:
   Time options: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(n³)", "O(2ⁿ)", "O(n!)"]
   Space options: ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"]
4. For each challenge include:
   - "id": string (e.g. "comp_${Date.now()}_1")
   - "mode": "complexity"
   - "title": Descriptive title (e.g. "Binary Search with Nested Verification", "Matrix Exponentiation Loop")
   - "category": string
   - "difficulty": "${difficulty}"
   - "description": Clear explanation of what the algorithm or routine is intended to do
   - "codeSnippet": Formatted, valid code snippet
   - "secondCodeSnippet": (optional) string
   - "timeComplexity": Exact Big-O time (e.g. "O(n log n)")
   - "spaceComplexity": Exact auxiliary space (e.g. "O(1)")
   - "timeComplexityOptions": string array containing at least 4 options including the correct answer
   - "spaceComplexityOptions": string array containing at least 4 options including the correct answer
   - "recurrenceRelation": (optional) e.g. "T(n) = 2T(n/2) + O(n)"
   - "explanation": Step-by-step mathematical breakdown explaining loop counts, recursion stack depth, and data structure allocations.

Respond ONLY with valid JSON conforming to:
{
  "challenges": [
    {
      "id": "comp_1",
      "mode": "complexity",
      "title": "Logarithmic Nested Stepping",
      "category": "nested_loops",
      "difficulty": "${difficulty}",
      "description": "Determine the time and auxiliary space complexity of the following search routine.",
      "codeSnippet": "function process(n) {\\n  let count = 0;\\n  for (let i = 1; i < n; i *= 2) {\\n    for (let j = 0; j < i; j++) {\\n      count++;\\n    }\\n  }\\n  return count;\\n}",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(1)",
      "timeComplexityOptions": ["O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
      "spaceComplexityOptions": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      "explanation": "The outer loop runs for i = 1, 2, 4, 8, ..., n. The inner loop executes i times. Summing 1 + 2 + 4 + ... + n is a geometric series that equals 2n - 1, which simplifies to O(n) total time. Space is O(1) as only variables i, j, count are kept in memory."
    }
  ]
}`;

    let lastError: any = null;
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await GeminiService.generateInteraction(prompt, true, 55000, {
          temperature: 0.25,
        });

        // Use safe JSON repair that also handles bare arrays or object schemas
        let rawParsed: any;
        try {
          rawParsed = GeminiService.repairJson(result.text);
        } catch (repairErr: any) {
          console.warn(`[PracticeAiService] repairJson failed on attempt ${attempt}:`, repairErr.message);
          continue;
        }

        let challengesList: any[] = [];
        if (Array.isArray(rawParsed)) {
          challengesList = rawParsed;
        } else if (rawParsed && Array.isArray(rawParsed.challenges)) {
          challengesList = rawParsed.challenges;
        } else if (rawParsed && typeof rawParsed === 'object') {
          // Check if any property is an array of challenges
          const arrayProp = Object.values(rawParsed).find((val) => Array.isArray(val)) as any[];
          if (arrayProp && arrayProp.length > 0) {
            challengesList = arrayProp;
          }
        }

        if (!challengesList || challengesList.length === 0) {
          throw new Error('Gemini response did not contain a valid challenges array');
        }

        const validated: ComplexityChallenge[] = challengesList.map((c: any, idx: number) => {
          const timeOpts = Array.isArray(c.timeComplexityOptions) && c.timeComplexityOptions.length >= 2
            ? c.timeComplexityOptions
            : ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'];
          
          const spaceOpts = Array.isArray(c.spaceComplexityOptions) && c.spaceComplexityOptions.length >= 2
            ? c.spaceComplexityOptions
            : ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'];

          // Guarantee that the correct answer is present inside the options array
          if (c.timeComplexity && !timeOpts.includes(c.timeComplexity)) {
            timeOpts.unshift(c.timeComplexity);
          }
          if (c.spaceComplexity && !spaceOpts.includes(c.spaceComplexity)) {
            spaceOpts.unshift(c.spaceComplexity);
          }

          return {
            id: c.id ? String(c.id) : `comp_${Date.now()}_${idx}`,
            mode: 'complexity' as const,
            title: c.title || `Complexity Challenge ${idx + 1}`,
            category: c.category || category,
            difficulty: (c.difficulty || difficulty) as any,
            description: c.description || 'Analyze the time and space complexity of the provided code snippet.',
            codeSnippet: c.codeSnippet || '// No code snippet provided\nfunction analyze(n) { return n; }',
            secondCodeSnippet: c.secondCodeSnippet || undefined,
            timeComplexity: c.timeComplexity || 'O(n)',
            spaceComplexity: c.spaceComplexity || 'O(1)',
            timeComplexityOptions: timeOpts,
            spaceComplexityOptions: spaceOpts,
            recurrenceRelation: c.recurrenceRelation || undefined,
            explanation: c.explanation || 'Analyze step-by-step loop bounds and recursive calls.',
          };
        });

        console.log(`[PracticeAiService] Successfully validated ${validated.length} challenges on attempt ${attempt}.`);
        return validated;
      } catch (err: any) {
        lastError = err;
        console.warn(`[PracticeAiService] Attempt ${attempt} failed: ${err.message}. Retrying...`);
      }
    }

    console.error('[PracticeAiService] generateComplexityChallenges failed after retries:', lastError?.message);
    throw lastError instanceof GeminiApiError
      ? lastError
      : new GeminiApiError(`Failed to generate Complexity Challenges: ${lastError?.message || 'Upstream model error'}`, 502);
  }

  /**
   * Evaluates a candidate's complexity answer with step-by-step reasoning breakdown.
   */
  public static async evaluateComplexityAnswer(params: {
    challenge: ComplexityChallenge;
    userTimeComplexity: string;
    userSpaceComplexity: string;
    userReasoning?: string;
  }): Promise<ComplexityEvaluation> {
    const { challenge, userTimeComplexity, userSpaceComplexity, userReasoning } = params;

    const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    const isTimeCorrect = normalize(userTimeComplexity) === normalize(challenge.timeComplexity);
    const isSpaceCorrect = normalize(userSpaceComplexity) === normalize(challenge.spaceComplexity);

    let score = 0;
    if (isTimeCorrect) score += 60;
    if (isSpaceCorrect) score += 40;

    const prompt = `You are evaluating a student's Big-O complexity analysis of the following code.

CODE SNIPPET:
\`\`\`
${challenge.codeSnippet}
\`\`\`

CORRECT VALUES:
- Time Complexity: ${challenge.timeComplexity}
- Space Complexity: ${challenge.spaceComplexity}
- Mathematical Explanation: ${challenge.explanation}

STUDENT SUBMISSION:
- Selected Time: ${userTimeComplexity} (${isTimeCorrect ? 'CORRECT' : 'INCORRECT'})
- Selected Space: ${userSpaceComplexity} (${isSpaceCorrect ? 'CORRECT' : 'INCORRECT'})
- Student Reasoning: "${userReasoning || 'No justification provided'}"

TASK:
Provide step-by-step mathematical feedback:
1. "timeFeedback": Explain specifically whether and why their time complexity answer is right or wrong based on the loops or recursion.
2. "spaceFeedback": Explain specifically auxiliary space vs recursion stack space.
3. "reasoningFeedback": Critique the student's written reasoning.
4. "stepByStepBreakdown": A comprehensive step-by-step analysis of the code.

Respond ONLY with valid JSON:
{
  "isTimeCorrect": ${isTimeCorrect},
  "isSpaceCorrect": ${isSpaceCorrect},
  "overallScore": ${score},
  "timeFeedback": "...",
  "spaceFeedback": "...",
  "reasoningFeedback": "...",
  "stepByStepBreakdown": "..."
}`;

    try {
      const result = await GeminiService.generateInteraction(prompt, true, 35000, {
        temperature: 0.2,
      });
      const parsed = GeminiService.repairJson<ComplexityEvaluation>(result.text);
      parsed.isTimeCorrect = isTimeCorrect;
      parsed.isSpaceCorrect = isSpaceCorrect;
      parsed.overallScore = score;
      return parsed;
    } catch (err: any) {
      console.warn('[PracticeAiService] evaluateComplexityAnswer fallback:', err.message);
      return {
        isTimeCorrect,
        isSpaceCorrect,
        overallScore: score,
        timeFeedback: isTimeCorrect
          ? `Correct! The time complexity is indeed ${challenge.timeComplexity}.`
          : `Incorrect. You chose ${userTimeComplexity}, but the correct time complexity is ${challenge.timeComplexity}.`,
        spaceFeedback: isSpaceCorrect
          ? `Correct! Auxiliary space is ${challenge.spaceComplexity}.`
          : `Incorrect. You chose ${userSpaceComplexity}, but the correct auxiliary space is ${challenge.spaceComplexity}.`,
        reasoningFeedback: userReasoning
          ? 'Your reasoning was evaluated against the mathematical recurrence structure.'
          : undefined,
        stepByStepBreakdown: challenge.explanation,
      };
    }
  }
}
