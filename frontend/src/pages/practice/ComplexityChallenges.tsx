import { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Trophy,
  AlertCircle,
  Code2,
  BookOpen,
  Send,
  BrainCircuit,
  Flag,
  RotateCcw,
  RefreshCw,
  Lightbulb,
  Check,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

interface ComplexityChallenge {
  id: string;
  mode: 'complexity';
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  codeSnippet: string;
  secondCodeSnippet?: string;
  timeComplexity: string;
  spaceComplexity: string;
  timeComplexityOptions: string[];
  spaceComplexityOptions: string[];
  explanation: string;
  recurrenceRelation?: string;
}

interface ComplexityEvaluation {
  isTimeCorrect: boolean;
  isSpaceCorrect: boolean;
  overallScore: number;
  timeFeedback: string;
  spaceFeedback: string;
  reasoningFeedback?: string;
  stepByStepBreakdown: string;
}

type ModeState = 'LANDING' | 'CHALLENGE' | 'RESULTS';

interface UserAnswerState {
  selectedTime: string;
  selectedSpace: string;
  reasoning: string;
  markedForReview: boolean;
  evaluation?: ComplexityEvaluation;
  timeSpentSeconds: number;
}

const COMPLEXITY_CATEGORIES = [
  {
    id: 'all',
    label: 'All Complexity Patterns',
    description: 'Comprehensive test covering nested bounds, divide-and-conquer, recursion trees, and DP tables.',
    icon: BrainCircuit,
  },
  {
    id: 'nested_loops',
    label: 'Nested Loops & Stepping Bounds',
    description: 'Geometric multiplications (i *= 2), dependent inner loops (j < i), and irregular increments.',
    icon: Activity,
  },
  {
    id: 'recursion',
    label: 'Recursive Functions & Call Stacks',
    description: 'Branching recursion trees, Master Theorem relations, and stack depth bounds.',
    icon: Zap,
  },
  {
    id: 'space_complexity',
    label: 'Auxiliary Space vs Input References',
    description: 'Distinguish in-place transformations O(1) from hash allocation, recursive stacks, and buffers.',
    icon: BookOpen,
  },
  {
    id: 'compare_algorithms',
    label: 'Compare Two Implementations',
    description: 'Dual-snippet evaluation analyzing trade-offs (e.g. Iterative vs Recursive, Array vs Map).',
    icon: Code2,
  },
  {
    id: 'graph_complexity',
    label: 'Graph Algorithms',
    description: 'Adjacency list O(V + E) vs matrix O(V²), Dijkstra heap operations, and topological traversals.',
    icon: Activity,
  },
  {
    id: 'dp_complexity',
    label: 'Dynamic Programming Memoization',
    description: 'State space cardinality multiplied by transition time, plus table memory allocation.',
    icon: BrainCircuit,
  },
  {
    id: 'sorting_searching',
    label: 'Sorting & Searching Bounds',
    description: 'Comparison-based lower bounds O(n log n), binary partition ranges, and counting distributions.',
    icon: Zap,
  },
  {
    id: 'amortized',
    label: 'Amortized Analysis',
    description: 'Dynamic array doubling, aggregate accounting method, and two-pointer invariant windows.',
    icon: Clock,
  },
];

const STANDARD_TIME_OPTIONS = [
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n²)',
  'O(n³)',
  'O(2ⁿ)',
  'O(n!)',
];

const STANDARD_SPACE_OPTIONS = [
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n²)',
  'O(2ⁿ)',
];

export const ComplexityChallenges = () => {
  const { user } = useAuthStore();

  const [modeState, setModeState] = useState<ModeState>('LANDING');

  // Config
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [challengeCount, setChallengeCount] = useState<number>(5);

  // Runtime
  const [challenges, setChallenges] = useState<ComplexityChallenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswerState>>({});

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Session stats & Timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (modeState === 'CHALLENGE') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [modeState]);

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Helper to get or initialize current question's state
  const getCurrentAnswer = (): UserAnswerState => {
    return (
      userAnswers[currentIndex] || {
        selectedTime: '',
        selectedSpace: '',
        reasoning: '',
        markedForReview: false,
        timeSpentSeconds: 0,
      }
    );
  };

  const updateCurrentAnswer = (patch: Partial<UserAnswerState>) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: {
        ...(prev[currentIndex] || {
          selectedTime: '',
          selectedSpace: '',
          reasoning: '',
          markedForReview: false,
          timeSpentSeconds: 0,
        }),
        ...patch,
      },
    }));
  };

  // 1. START CHALLENGE GENERATION VIA GEMINI
  const handleStartChallenges = async () => {
    setIsGenerating(true);
    setApiError(null);

    try {
      const res = await api.post('/practice/complexity/generate', {
        difficulty,
        category: selectedCategory,
        count: challengeCount,
      });

      const list: ComplexityChallenge[] = res.data.challenges;
      if (!list || list.length === 0) {
        throw new Error('No challenges returned from AI generator');
      }

      setChallenges(list);
      setCurrentIndex(0);
      setUserAnswers({});
      setElapsedSeconds(0);
      setModeState('CHALLENGE');
    } catch (err: any) {
      console.error('Failed to generate complexity challenges:', err);
      const msg =
        err?.response?.data?.error ||
        'Failed to generate complexity challenges. Please retry or pick a different topic.';
      setApiError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. EVALUATE CURRENT QUESTION ON-THE-FLY
  const handleEvaluateCurrent = async () => {
    const current = challenges[currentIndex];
    const answer = getCurrentAnswer();
    if (!current || !answer.selectedTime || !answer.selectedSpace || isEvaluating) return;

    setIsEvaluating(true);
    setApiError(null);

    try {
      const res = await api.post('/practice/complexity/evaluate', {
        challenge: current,
        userTimeComplexity: answer.selectedTime,
        userSpaceComplexity: answer.selectedSpace,
        userReasoning: answer.reasoning.trim() || undefined,
      });

      const evalData: ComplexityEvaluation = res.data.evaluation;
      updateCurrentAnswer({ evaluation: evalData });
    } catch (err: any) {
      console.error('Complexity evaluation error:', err);
      // Fallback deterministic local evaluation if network hiccups
      const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();
      const isTimeCorrect = norm(answer.selectedTime) === norm(current.timeComplexity);
      const isSpaceCorrect = norm(answer.selectedSpace) === norm(current.spaceComplexity);
      let sc = 0;
      if (isTimeCorrect) sc += 60;
      if (isSpaceCorrect) sc += 40;

      updateCurrentAnswer({
        evaluation: {
          isTimeCorrect,
          isSpaceCorrect,
          overallScore: sc,
          timeFeedback: isTimeCorrect
            ? `Correct! The code runs in ${current.timeComplexity}.`
            : `Incorrect. You chose ${answer.selectedTime}, but the correct time is ${current.timeComplexity}.`,
          spaceFeedback: isSpaceCorrect
            ? `Correct! Auxiliary space is ${current.spaceComplexity}.`
            : `Incorrect. You chose ${answer.selectedSpace}, but auxiliary space is ${current.spaceComplexity}.`,
          stepByStepBreakdown: current.explanation,
        },
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  // 3. FINAL ASSESSMENT SUBMISSION & DATABASE PERSISTENCE
  const handleSubmitAssessment = async () => {
    setIsSubmittingFinal(true);
    const totalChallenges = challenges.length;

    // Calculate score metrics
    let totalPoints = 0;
    let correctTimeCount = 0;
    let correctSpaceCount = 0;

    const historyData = challenges.map((ch, idx) => {
      const ans = userAnswers[idx] || {
        selectedTime: '',
        selectedSpace: '',
        reasoning: '',
        markedForReview: false,
        timeSpentSeconds: 0,
      };

      const norm = (s: string) => s.replace(/\s+/g, '').toLowerCase();
      const isTimeCorrect = ans.evaluation?.isTimeCorrect ?? norm(ans.selectedTime) === norm(ch.timeComplexity);
      const isSpaceCorrect = ans.evaluation?.isSpaceCorrect ?? norm(ans.selectedSpace) === norm(ch.spaceComplexity);

      let sc = 0;
      if (isTimeCorrect) sc += 60;
      if (isSpaceCorrect) sc += 40;

      if (isTimeCorrect) correctTimeCount++;
      if (isSpaceCorrect) correctSpaceCount++;
      totalPoints += sc;

      return {
        challenge: ch,
        selectedTime: ans.selectedTime || 'Not answered',
        selectedSpace: ans.selectedSpace || 'Not answered',
        reasoning: ans.reasoning,
        evaluation: ans.evaluation || {
          isTimeCorrect,
          isSpaceCorrect,
          overallScore: sc,
          timeFeedback: isTimeCorrect ? 'Correct time complexity' : `Expected ${ch.timeComplexity}`,
          spaceFeedback: isSpaceCorrect ? 'Correct auxiliary space' : `Expected ${ch.spaceComplexity}`,
          stepByStepBreakdown: ch.explanation,
        },
      };
    });

    const accuracy = totalChallenges > 0 ? Math.round(totalPoints / totalChallenges) : 0;

    try {
      await api.post('/practice/attempts', {
        userId: user?.id,
        mode: 'complexity',
        difficulty,
        score: Math.round(accuracy * 10),
        accuracy,
        completionTime: elapsedSeconds,
        totalQuestions: totalChallenges,
        correctAnswers: correctTimeCount,
        topics: [selectedCategory],
        sessionDetails: {
          history: historyData,
          timeAccuracy: Math.round((correctTimeCount / totalChallenges) * 100),
          spaceAccuracy: Math.round((correctSpaceCount / totalChallenges) * 100),
        },
      });
    } catch (saveErr) {
      console.warn('Failed to save complexity attempt to database:', saveErr);
    } finally {
      setIsSubmittingFinal(false);
      setModeState('RESULTS');
    }
  };

  const activeChallenge = challenges[currentIndex];
  const activeAnswer = getCurrentAnswer();

  return (
    <WorkspaceLayout>
      {/* ======================================================== */}
      {/* 1. LANDING CONFIG (SPACIOUS FULL-VIEWPORT TWO-COLUMN)     */}
      {/* ======================================================== */}
      {modeState === 'LANDING' && (
        <div className="w-full flex flex-col gap-8 pb-16 animate-in fade-in-0 duration-200">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
            <Link to="/practice" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Practice Arena
            </Link>
            <span>/</span>
            <span className="text-foreground">Complexity Challenges</span>
          </div>

          {/* Full-Width Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-card to-background border border-emerald-500/25 p-8 sm:p-12 rounded-3xl shadow-sm text-left">
            <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-start gap-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>Interactive Asymptotic Analysis Masterclass</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
                Complexity{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Challenges
                </span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
                Deduce asymptotic Time &amp; Auxiliary Space complexities for realistic, multi-paradigm algorithms.
                Master irregular stepping bounds, recursion trees, memoization matrices, and comparative implementation
                trade-offs with verified Gemini AI step-by-step mathematical proofs.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card/80 border border-border">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Est. Duration: {challengeCount * 2} - {challengeCount * 3} min</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card/80 border border-border">
                  <BrainCircuit className="w-4 h-4 text-teal-400" />
                  <span>Formal Mathematical Breakdowns</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card/80 border border-border">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Dynamic Gemini Problem Generation</span>
                </div>
              </div>
            </div>
          </div>

          {/* SPACIOUS TWO-COLUMN SETUP: LEFT = CATEGORIES, RIGHT = CONFIG & LAUNCH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
            {/* LEFT SECTION (7 Cols): Category Selection Cards */}
            <div className="lg:col-span-7 xl:col-span-8 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                    <span>1. Select Complexity Focus Area</span>
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Choose an algorithmic structure to practice or test all paradigms together.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {COMPLEXITY_CATEGORIES.length} Categories
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {COMPLEXITY_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-foreground ring-2 ring-emerald-500/30 shadow-sm'
                          : 'bg-muted/40 hover:bg-muted/70 border-border/70 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-foreground">
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-primary'}`} />
                          <span>{cat.label}</span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                        {cat.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SECTION (5 Cols): Difficulty, Count, Instructions, Launch */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              {/* Difficulty & Count Panel */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm text-left">
                <div>
                  <h3 className="text-base font-black text-foreground">2. Challenge Parameters</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Tailor recurrence depth and problem volume.
                  </p>
                </div>

                {/* Difficulty Tiers */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    Difficulty Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => {
                      const isSelected = difficulty === diff;
                      return (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setDifficulty(diff)}
                          className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-2xs font-black ring-1 ring-emerald-500/30'
                              : 'bg-muted/50 border-border/80 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <div>{diff}</div>
                          <div className="text-[10px] font-medium opacity-70 mt-1">
                            {diff === 'Beginner' ? 'Basic Loops' : diff === 'Intermediate' ? 'Recurrences' : 'Amortized'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Count */}
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-muted-foreground uppercase tracking-wider">Number of Problems</span>
                    <span className="font-bold text-foreground">{challengeCount} Questions</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 8].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setChallengeCount(c)}
                        className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                          challengeCount === c
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                            : 'bg-muted border-border/70 hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        {c} Challenges
                      </button>
                    ))}
                  </div>
                </div>

                {/* Session Instructions */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 text-xs space-y-2 text-muted-foreground">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Challenge Guidelines:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                    <li>Deduce both Time and Auxiliary Space independently.</li>
                    <li>Auxiliary Space excludes original function input memory.</li>
                    <li>Compare snippets on comparative implementation questions.</li>
                    <li>You can mark questions to revisit before final submission.</li>
                  </ul>
                </div>

                {/* Error Banner */}
                {apiError && (
                  <div className="p-3.5 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold flex items-start gap-2 shadow-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p>{apiError}</p>
                    </div>
                  </div>
                )}

                {/* Launch Button */}
                <button
                  type="button"
                  onClick={handleStartChallenges}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-sm shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Gemini is generating challenges...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      <span>Start Complexity Challenges</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ASSESSMENT INTERFACE (SPACIOUS FULL-WIDTH TWO-PANEL)  */}
      {/* ======================================================== */}
      {modeState === 'CHALLENGE' && activeChallenge && (
        <div className="w-full flex flex-col gap-6 text-left pb-16 animate-in fade-in-0 duration-150">
          {/* Top Navigation & Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border/80 px-6 py-4 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">
                #{currentIndex + 1}
              </span>
              <div>
                <div className="text-sm font-black text-foreground flex items-center gap-2">
                  <span>Challenge {currentIndex + 1} of {challenges.length}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-extrabold uppercase">
                    {activeChallenge.difficulty}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {activeChallenge.title}
                </div>
              </div>
            </div>

            {/* Middle: Question Navigation Quick-Jump Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {challenges.map((_, idx) => {
                const ans = userAnswers[idx];
                const isCurrent = idx === currentIndex;
                const isAnswered = ans && ans.selectedTime && ans.selectedSpace;
                const isMarked = ans && ans.markedForReview;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    title={`Go to Question ${idx + 1}`}
                    className={`w-8 h-8 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center justify-center relative ${
                      isCurrent
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm scale-105'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isMarked && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-card" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Timer & Mark for Review */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCurrentAnswer({ markedForReview: !activeAnswer.markedForReview })}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  activeAnswer.markedForReview
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{activeAnswer.markedForReview ? 'Marked' : 'Mark for Review'}</span>
              </button>

              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 border border-border font-mono font-bold text-xs text-foreground">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{formatSeconds(elapsedSeconds)}</span>
              </div>
            </div>
          </div>

          {/* MAIN TWO-PANEL ASSESSMENT WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT PANEL (7 Cols on desktop): Problem description, valid formatted code snippet(s) */}
            <div className="lg:col-span-7 xl:col-span-8 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>Category: <strong className="text-foreground">{activeChallenge.category}</strong></span>
                  {activeChallenge.recurrenceRelation && (
                    <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                      Recurrence: {activeChallenge.recurrenceRelation}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {activeChallenge.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                  {activeChallenge.description}
                </p>
              </div>

              {/* Primary Code Snippet */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-primary" /> Primary Code Implementation
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">JavaScript / Pseudo-code</span>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1117] border border-border/70 font-mono text-xs sm:text-sm text-emerald-300/90 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {activeChallenge.codeSnippet}
                </div>
              </div>

              {/* Second Code Snippet if comparative */}
              {activeChallenge.secondCodeSnippet && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-teal-400" /> Comparative Alternative Implementation
                    </span>
                    <span className="text-[11px] font-mono text-teal-400">Implementation B</span>
                  </div>
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1117] border border-border/70 font-mono text-xs sm:text-sm text-teal-300/90 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                    {activeChallenge.secondCodeSnippet}
                  </div>
                </div>
              )}

              {/* AI Mathematical Breakdown (Displayed if user has checked answer) */}
              {activeAnswer.evaluation && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-card to-background border border-emerald-500/30 space-y-4 animate-in fade-in-0 duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>Gemini AI Mathematical Breakdown</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs font-mono">
                      Question Score: {activeAnswer.evaluation.overallScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div
                      className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                        activeAnswer.evaluation.isTimeCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {activeAnswer.evaluation.isTimeCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                      )}
                      <div>
                        <strong className="block font-bold">Time: {activeChallenge.timeComplexity}</strong>
                        <span className="text-[11px] leading-relaxed opacity-90">
                          {activeAnswer.evaluation.timeFeedback}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                        activeAnswer.evaluation.isSpaceCorrect
                          ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {activeAnswer.evaluation.isSpaceCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-teal-500" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                      )}
                      <div>
                        <strong className="block font-bold">Space: {activeChallenge.spaceComplexity}</strong>
                        <span className="text-[11px] leading-relaxed opacity-90">
                          {activeAnswer.evaluation.spaceFeedback}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 space-y-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Step-by-Step Proof:
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-line">
                      {activeAnswer.evaluation.stepByStepBreakdown || activeChallenge.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL (5 Cols on desktop): Selectors, Reasoning, Evaluation, Navigation */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm text-left">
                {/* 1. Time Complexity Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      1. Select Time Complexity
                    </label>
                    {activeAnswer.selectedTime && (
                      <span className="font-mono text-xs font-black text-emerald-400">
                        {activeAnswer.selectedTime}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {(activeChallenge.timeComplexityOptions || STANDARD_TIME_OPTIONS).map((opt) => {
                      const isSelected = activeAnswer.selectedTime === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateCurrentAnswer({ selectedTime: opt })}
                          className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/25 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/30'
                              : 'bg-muted/40 border-border/70 text-foreground hover:bg-muted'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Space Complexity Selection */}
                <div className="space-y-3 pt-3 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      2. Select Auxiliary Space
                    </label>
                    {activeAnswer.selectedSpace && (
                      <span className="font-mono text-xs font-black text-teal-400">
                        {activeAnswer.selectedSpace}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(activeChallenge.spaceComplexityOptions || STANDARD_SPACE_OPTIONS).map((opt) => {
                      const isSelected = activeAnswer.selectedSpace === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateCurrentAnswer({ selectedSpace: opt })}
                          className={`py-2 px-1 rounded-xl text-xs font-mono font-bold border transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-teal-500/25 border-teal-500 text-teal-400 ring-2 ring-teal-500/30'
                              : 'bg-muted/40 border-border/70 text-foreground hover:bg-muted'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Optional Reasoning Field */}
                <div className="space-y-1.5 pt-3 border-t border-border/60">
                  <label className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                    <span>3. Mathematical Reasoning (Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={activeAnswer.reasoning}
                    onChange={(e) => updateCurrentAnswer({ reasoning: e.target.value })}
                    placeholder="e.g. Geometric series with step multiplier 2 gives sum = 2n - 1, hence O(n)..."
                    className="w-full p-3 rounded-xl bg-background border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/60 resize-none shadow-2xs"
                  />
                </div>

                {/* On-the-fly verification button */}
                {!activeAnswer.evaluation && (
                  <button
                    type="button"
                    onClick={handleEvaluateCurrent}
                    disabled={!activeAnswer.selectedTime || !activeAnswer.selectedSpace || isEvaluating}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isEvaluating ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Verify This Question &amp; View Proof</span>
                      </>
                    )}
                  </button>
                )}

                {/* Question Navigation Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentIndex < challenges.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((prev) => Math.min(challenges.length - 1, prev + 1))}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-foreground transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitAssessment}
                      disabled={isSubmittingFinal}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingFinal ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Finalizing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Submit Assessment</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FINAL RESULTS (SPACIOUS FULL-WIDTH DASHBOARD)         */}
      {/* ======================================================== */}
      {modeState === 'RESULTS' && (
        <div className="w-full flex flex-col gap-8 pb-16 text-left animate-in fade-in-0 duration-200">
          {/* Header Trophy Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-card to-background border border-emerald-500/25 p-8 sm:p-12 rounded-3xl shadow-sm text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-5 text-white shadow-xl shadow-emerald-500/25">
              <Trophy className="w-10 h-10" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
              Complexity Assessment Completed!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto mb-8 font-medium">
              You analyzed {challenges.length} complex algorithms across asymptotic bounds. Your score and performance
              breakdown have been recorded.
            </p>

            {/* Top Score Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="p-5 rounded-2xl bg-card/80 border border-border/80 shadow-xs">
                <div className="text-4xl font-black text-emerald-400">
                  {challenges.length > 0
                    ? Math.round(
                        Object.values(userAnswers).reduce(
                          (acc, cur) => acc + (cur.evaluation?.overallScore ?? 0),
                          0
                        ) / challenges.length
                      )
                    : 0}%
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1.5">
                  Overall Accuracy
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card/80 border border-border/80 shadow-xs">
                <div className="text-4xl font-black text-foreground">
                  {
                    Object.values(userAnswers).filter(
                      (a) => a.evaluation?.isTimeCorrect
                    ).length
                  } / {challenges.length}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1.5">
                  Time Complexity Correct
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-card/80 border border-border/80 shadow-xs">
                <div className="text-4xl font-black text-teal-400">
                  {
                    Object.values(userAnswers).filter(
                      (a) => a.evaluation?.isSpaceCorrect
                    ).length
                  } / {challenges.length}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1.5">
                  Space Complexity Correct
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question-by-Question Review Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>Question-by-Question Analysis &amp; Proofs</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((ch, idx) => {
                const ans = userAnswers[idx];
                const isTimeRight = ans?.evaluation?.isTimeCorrect;
                const isSpaceRight = ans?.evaluation?.isSpaceCorrect;

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4 flex flex-col justify-between text-left"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-sm flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center font-mono text-xs">
                            {idx + 1}
                          </span>
                          <span>{ch.title}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-muted text-muted-foreground">
                          Score: {ans?.evaluation?.overallScore ?? 0}/100
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0f1117] text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre max-h-32 border border-border/60">
                        {ch.codeSnippet}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div
                          className={`p-2 rounded-xl border ${
                            isTimeRight
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold text-muted-foreground">Time Complexity</div>
                          <div className="font-bold">
                            Your: {ans?.selectedTime || 'None'} | Correct: {ch.timeComplexity}
                          </div>
                        </div>

                        <div
                          className={`p-2 rounded-xl border ${
                            isSpaceRight
                              ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold text-muted-foreground">Space Complexity</div>
                          <div className="font-bold">
                            Your: {ans?.selectedSpace || 'None'} | Correct: {ch.spaceComplexity}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed pt-1 font-mono">
                        {ch.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setModeState('LANDING')}
              className="px-6 py-3 rounded-2xl border border-border hover:bg-muted text-xs font-bold text-foreground transition-colors cursor-pointer"
            >
              Back to Mode Selection
            </button>
            <button
              type="button"
              onClick={handleStartChallenges}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Another Challenge Session</span>
            </button>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
