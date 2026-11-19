import { useState, useEffect } from 'react';
import {
  Bug,
  Play,
  Send,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Code2,
  Trophy,
  AlertCircle,
  Flame,
  Terminal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { CodeEditor } from '../../components/practice/CodeEditor';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

// Topic categories
const TOPIC_CATEGORIES = {
  Fundamentals: ['Arrays', 'Strings', 'Searching', 'Sorting', 'Binary Search'],
  'Data Structures': [
    'Linked Lists',
    'Stacks',
    'Queues',
    'Hash Maps',
    'Trees',
    'Binary Search Trees',
    'Heaps',
    'Graphs',
  ],
  Algorithms: [
    'Recursion',
    'Backtracking',
    'Greedy Algorithms',
    'Dynamic Programming',
    'BFS',
    'DFS',
    'Dijkstra',
    'Sliding Window',
    'Two Pointers',
  ],
};

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', ext: 'js' },
  { id: 'python', label: 'Python', ext: 'py' },
  { id: 'cpp', label: 'C++', ext: 'cpp' },
  { id: 'java', label: 'Java', ext: 'java' },
];

interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  isHidden?: boolean;
  explanation?: string;
}

interface DebugChallenge {
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
  testCases: TestCase[];
  correctedSolution: string;
  explanation: string;
}

interface TestResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
  executionTimeMs: number;
  isHidden?: boolean;
}

type ModeState = 'LANDING' | 'WORKSPACE' | 'RESULTS';

export const DebugAlgorithm = () => {
  const { user } = useAuthStore();

  // State
  const [modeState, setModeState] = useState<ModeState>('LANDING');
  const [selectedTopic, setSelectedTopic] = useState<string>('Binary Search');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');

  // Active Challenge State
  const [challenge, setChallenge] = useState<DebugChallenge | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Hints & Test Results
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [showHintsModal, setShowHintsModal] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState<'testcases' | 'console'>('testcases');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [executionError, setExecutionError] = useState<string | null>(null);

  // Time & Evaluation
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<any>(null);

  // Timer
  useEffect(() => {
    let interval: any = null;
    if (modeState === 'WORKSPACE') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [modeState]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Generate Challenge via Gemini
  const handleStartChallenge = async () => {
    setIsGenerating(true);
    setApiError(null);
    try {
      const res = await api.post('/practice/debug/generate', {
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        language: selectedLanguage,
      });

      const generated: DebugChallenge = res.data.challenge;
      setChallenge(generated);
      setUserCode(generated.brokenCode);
      setTestResults([]);
      setConsoleLogs([]);
      setExecutionError(null);
      setActiveHintIndex(-1);
      setElapsedSeconds(0);
      setModeState('WORKSPACE');
    } catch (err: any) {
      console.error('Failed to generate challenge:', err);
      setApiError(
        err?.response?.data?.error || 'Failed to generate debugging challenge from Gemini AI. Please retry.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Run Code against test cases
  const handleRunCode = async () => {
    if (!challenge || isRunning) return;
    setIsRunning(true);
    setExecutionError(null);

    try {
      const res = await api.post('/practice/debug/run', {
        code: userCode,
        language: challenge.language,
        functionName: challenge.functionName,
        testCases: challenge.testCases,
      });

      if (res.data.error && (!res.data.testResults || res.data.testResults.length === 0)) {
        setExecutionError(res.data.error);
      }

      setTestResults(res.data.testResults || []);
      setConsoleLogs(res.data.logs || []);
    } catch (err: any) {
      console.error('Run code error:', err);
      setExecutionError(err?.response?.data?.error || 'Code runner error occurred.');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution
  const handleFinalSubmit = async () => {
    if (!challenge || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. First run code if not already run
      let currentResults = testResults;
      if (currentResults.length === 0) {
        const runRes = await api.post('/practice/debug/run', {
          code: userCode,
          language: challenge.language,
          functionName: challenge.functionName,
          testCases: challenge.testCases,
        });
        currentResults = runRes.data.testResults || [];
        setTestResults(currentResults);
      }

      // 2. Evaluate with Gemini
      const evalRes = await api.post('/practice/debug/evaluate', {
        challenge,
        userCode,
        testResults: currentResults,
        language: challenge.language,
      });

      const evalData = evalRes.data.evaluation;
      setEvaluation(evalData);

      // 3. Persist Attempt to DB
      const passedCount = currentResults.filter((t) => t.passed).length;
      const accuracy = currentResults.length > 0 ? Math.round((passedCount / currentResults.length) * 100) : 0;
      const score = Math.round(accuracy * 10);

      await api.post('/practice/attempts', {
        userId: user?.id,
        mode: 'debug',
        difficulty: challenge.difficulty,
        score,
        accuracy,
        completionTime: elapsedSeconds,
        totalQuestions: 1,
        correctAnswers: passedCount === currentResults.length ? 1 : 0,
        topics: [challenge.topic],
        sessionDetails: {
          challengeId: challenge.id,
          title: challenge.title,
          language: challenge.language,
          passedTests: passedCount,
          totalTests: currentResults.length,
          evaluation: evalData,
        },
      });

      setModeState('RESULTS');
    } catch (err: any) {
      console.error('Submit solution error:', err);
      setExecutionError(err?.response?.data?.error || 'Failed to submit solution.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to original broken code
  const handleResetCode = () => {
    if (challenge) {
      setUserCode(challenge.brokenCode);
      setTestResults([]);
      setExecutionError(null);
    }
  };

  return (
    <WorkspaceLayout>
      {/* ======================================================== */}
      {/* 1. LANDING PAGE STATE                                    */}
      {/* ======================================================== */}
      {modeState === 'LANDING' && (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12 animate-in fade-in-0 duration-200">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
            <Link to="/practice" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Practice Arena
            </Link>
            <span>/</span>
            <span className="text-foreground">Debug The Algorithm</span>
          </div>

          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-rose-950/40 via-card to-background border border-rose-500/20 p-8 sm:p-10 rounded-3xl shadow-sm text-left">
            <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-rose-500/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-start gap-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-black uppercase tracking-wider">
                <Bug className="w-4 h-4" />
                <span>AI Debugging Simulator</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
                Debug The <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400">Algorithm</span>
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                Step into the shoes of a code reviewer. Gemini AI dynamically crafts functional algorithms with intentional, subtle edge-case and logical bugs. Identify the flaws, fix the code, pass the sandboxed test suite, and receive architectural feedback.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>Est. Time: 10 - 20 min</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Interactive Test Runner</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Gemini AI Evaluation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* Left 2 Cols: Topic Selection */}
            <div className="lg:col-span-2 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="text-lg font-black text-foreground">1. Select Algorithmic Topic</h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Choose the domain where you want to test your debugging intuition.
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(TOPIC_CATEGORIES).map(([category, topics]) => (
                  <div key={category} className="space-y-2.5">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic) => {
                        const isSelected = selectedTopic === topic;
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => setSelectedTopic(topic)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-500/30'
                                : 'bg-muted/70 hover:bg-muted text-foreground border border-border/60'
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Difficulty & Language & Launch */}
            <div className="flex flex-col gap-6">
              {/* Difficulty Card */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-4 shadow-sm text-left">
                <div>
                  <h3 className="text-base font-black text-foreground">2. Difficulty Level</h3>
                  <p className="text-xs text-muted-foreground font-medium">Controls bug subtlety and constraint complexity.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => {
                    const isSelected = selectedDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500/10 border-rose-500 text-rose-500 shadow-xs'
                            : 'bg-muted/50 border-border/80 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div>{diff}</div>
                        <div className="text-[10px] font-medium opacity-70 mt-1">
                          {diff === 'Beginner' ? '1-2 bugs' : diff === 'Intermediate' ? '2-3 bugs' : '2-4 bugs'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language Card */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-4 shadow-sm text-left">
                <div>
                  <h3 className="text-base font-black text-foreground">3. Programming Language</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Native sandboxed execution supported for JavaScript.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setSelectedLanguage(lang.id)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary text-primary shadow-xs'
                            : 'bg-muted/50 border-border/80 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <Code2 className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Banner */}
              {apiError && (
                <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Launch Button */}
              <button
                type="button"
                onClick={handleStartChallenge}
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 text-white font-black text-sm shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Gemini AI is crafting your challenge...</span>
                  </>
                ) : (
                  <>
                    <span>Generate & Launch Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. INTERACTIVE DEBUG WORKSPACE                            */}
      {/* ======================================================== */}
      {modeState === 'WORKSPACE' && challenge && (
        <div className="flex flex-col h-[calc(100vh-6rem)] gap-3 text-left animate-in fade-in-0 duration-200">
          {/* Workspace Top Bar */}
          <div className="flex items-center justify-between bg-card border border-border/80 px-4 py-2.5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModeState('LANDING')}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Back to Setup"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-foreground">{challenge.title}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-extrabold uppercase">
                    {challenge.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                    {challenge.topic}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Timer */}
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-muted-foreground px-2.5 py-1 rounded-xl bg-muted/60">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>

              {/* Hints Button */}
              {challenge.bugHints && challenge.bugHints.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHintsModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-bold hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Hints ({challenge.bugHints.length})</span>
                </button>
              )}

              {/* Reset Code */}
              <button
                type="button"
                onClick={handleResetCode}
                title="Reset code to original broken state"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Code</span>
              </button>

              {/* Run Code */}
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-muted border border-border/80 hover:bg-muted/80 text-foreground font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current text-emerald-500" />
                <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
              </button>

              {/* Submit Solution */}
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 overflow-hidden">
            {/* LEFT PANEL: Problem Statement & Test Cases (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-border/60 bg-muted/30">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Problem Description
                </h3>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-5 text-xs text-foreground leading-relaxed">
                <div>
                  <h4 className="font-extrabold text-sm mb-2 text-foreground">{challenge.title}</h4>
                  <p className="whitespace-pre-line text-muted-foreground font-medium leading-relaxed">
                    {challenge.problem}
                  </p>
                </div>

                {/* Detected Bugs Badge */}
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5">
                  <Bug className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-500 text-xs">
                      {challenge.bugCount} Intentional Bug{challenge.bugCount > 1 ? 's' : ''} Present
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Review pointer updates, comparison operators, and loop bounds carefully.
                    </div>
                  </div>
                </div>

                {/* Constraints */}
                {challenge.constraints && challenge.constraints.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-bold text-foreground">Constraints:</span>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground font-mono text-[11px]">
                      {challenge.constraints.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample Test Cases Preview */}
                <div className="space-y-2.5">
                  <span className="font-bold text-foreground">Sample Test Cases:</span>
                  <div className="space-y-2">
                    {challenge.testCases.slice(0, 3).map((tc, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-muted/50 border border-border/60 font-mono text-[11px] space-y-1">
                        <div className="text-muted-foreground">
                          <span className="font-bold text-foreground">Input:</span> {JSON.stringify(tc.input)}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-bold text-foreground">Expected:</span> {JSON.stringify(tc.expectedOutput)}
                        </div>
                        {tc.explanation && (
                          <div className="text-[10px] text-muted-foreground/80 font-sans italic">
                            {tc.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: Code Editor & Test Results (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-3 overflow-hidden">
              {/* Code Editor Container */}
              <div className="flex-1 min-h-[340px] overflow-hidden">
                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                  language={challenge.language}
                  onRun={handleRunCode}
                  onSubmit={handleFinalSubmit}
                />
              </div>

              {/* Bottom Drawer: Test Results & Console */}
              <div className="h-56 bg-card border border-border/80 rounded-2xl flex flex-col overflow-hidden shadow-xs">
                {/* Tabs Header */}
                <div className="h-9 px-4 bg-muted/40 border-b border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('testcases')}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        activeTab === 'testcases' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Test Results ({testResults.filter((t) => t.passed).length}/{challenge.testCases.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('console')}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        activeTab === 'console' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Console Output ({consoleLogs.length})
                    </button>
                  </div>

                  {testResults.length > 0 && (
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      {testResults.every((t) => t.passed) ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> All Tests Passed
                        </span>
                      ) : (
                        <span className="text-rose-500 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> {testResults.filter((t) => !t.passed).length} Tests Failed
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Tab Body */}
                <div className="flex-1 p-3 overflow-y-auto text-xs font-mono">
                  {executionError && (
                    <div className="p-3 mb-2 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold">
                      {executionError}
                    </div>
                  )}

                  {activeTab === 'testcases' && (
                    <div className="space-y-2">
                      {testResults.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-8 text-center text-muted-foreground font-sans">
                          <Terminal className="w-6 h-6 mb-2 opacity-50" />
                          <p className="font-semibold text-xs">No execution results yet.</p>
                          <p className="text-[11px] opacity-70">Click &quot;Run Tests&quot; to execute your code against the sandboxed test suite.</p>
                        </div>
                      ) : (
                        testResults.map((tr, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                              tr.passed
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {tr.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                              )}
                              <span className="font-bold text-foreground">
                                Case {idx + 1} {tr.isHidden ? '(Hidden)' : ''}:
                              </span>
                              <span className="text-muted-foreground font-mono text-[11px]">
                                Input: {tr.input}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] font-mono">
                              <div>
                                Expected: <span className="text-foreground">{tr.expected}</span>
                              </div>
                              <div>
                                Actual: <span className={tr.passed ? 'text-emerald-400' : 'text-rose-400'}>{tr.actual}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground opacity-60">
                                {tr.executionTimeMs}ms
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'console' && (
                    <div className="space-y-1">
                      {consoleLogs.length === 0 ? (
                        <p className="text-muted-foreground text-center py-6 font-sans">No console.log outputs captured.</p>
                      ) : (
                        consoleLogs.map((log, idx) => (
                          <div key={idx} className="text-muted-foreground">
                            <span className="text-primary font-bold mr-2">&gt;</span>
                            {log}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hints Modal */}
          {showHintsModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border/80 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-left animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-500 font-extrabold text-sm">
                    <Lightbulb className="w-4 h-4" />
                    <span>Algorithmic Hints</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHintsModal(false)}
                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Stuck? Reveal hints step-by-step to preserve the learning challenge.
                </p>

                <div className="space-y-2.5">
                  {challenge.bugHints.map((hint, idx) => {
                    const isRevealed = idx <= activeHintIndex;
                    return (
                      <div key={idx} className="p-3.5 rounded-2xl border border-border/80 bg-muted/40 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>Hint #{idx + 1}</span>
                          {!isRevealed && (
                            <button
                              type="button"
                              onClick={() => setActiveHintIndex(idx)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-500 text-[11px] font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                            >
                              Reveal Hint
                            </button>
                          )}
                        </div>
                        {isRevealed && (
                          <p className="text-xs text-foreground font-medium animate-in fade-in-0 duration-150">
                            {hint}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. RESULTS & AI ANALYSIS STATE                           */}
      {/* ======================================================== */}
      {modeState === 'RESULTS' && challenge && (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8 text-left animate-in fade-in-0 duration-200">
          <div className="bg-card border border-border/80 rounded-3xl p-8 sm:p-10 text-center shadow-lg relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-rose-500/25">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-foreground mb-2">
              Debugging Session Complete!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto mb-8 font-medium">
              Your solution has been verified against the test suite and evaluated by Gemini AI.
            </p>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/60">
                <div className="text-2xl font-black text-foreground">
                  {testResults.filter((t) => t.passed).length}/{testResults.length}
                </div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground mt-1">Tests Passed</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/60">
                <div className="text-2xl font-black text-emerald-500">
                  {testResults.length > 0 ? Math.round((testResults.filter((t) => t.passed).length / testResults.length) * 100) : 0}%
                </div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground mt-1">Accuracy</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/60">
                <div className="text-2xl font-black text-rose-400 font-mono">
                  {formatTime(elapsedSeconds)}
                </div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground mt-1">Time Used</div>
              </div>
            </div>

            {/* AI Architectural Feedback Card */}
            {evaluation && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-card to-background border border-rose-500/25 text-left space-y-4 mb-8 shadow-xs">
                <div className="flex items-center gap-2 text-rose-500 font-extrabold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini AI Review & Architectural Explanation</span>
                </div>

                <p className="text-xs text-foreground font-medium leading-relaxed">
                  {evaluation.overallFeedback}
                </p>

                {evaluation.fixedBugs && evaluation.fixedBugs.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400">Resolved Flaws:</span>
                    <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                      {evaluation.fixedBugs.map((b: string, i: number) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.remainingBugs && evaluation.remainingBugs.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-400">Remaining Issues:</span>
                    <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-1">
                      {evaluation.remainingBugs.map((b: string, i: number) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 border-t border-border/60">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Original Bug Breakdown:
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {challenge.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setModeState('LANDING')}
                className="px-6 py-3 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground transition-colors cursor-pointer"
              >
                Back to Mode Setup
              </button>
              <button
                type="button"
                onClick={handleStartChallenge}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Generate Next Challenge</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
