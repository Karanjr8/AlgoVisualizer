import { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Flag,
  Sparkles,
  AlertCircle,
  BarChart3,
  Award,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

interface SpeedRunQuestion {
  id: string;
  mode: 'speedrun';
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionType: string;
  statement: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string;
  correctOptionIndex: number;
  explanation: string;
}

interface SpeedRunReport {
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

type ModeState = 'LANDING' | 'ASSESSMENT' | 'RESULTS';

const SPEEDRUN_TOPICS = [
  'Arrays',
  'Strings',
  'Binary Search',
  'Sorting',
  'Two Pointers',
  'Linked Lists',
  'Stacks & Queues',
  'Hash Maps',
  'Trees & BST',
  'Heaps',
  'Graphs (BFS/DFS)',
  'Dynamic Programming',
];

const QUESTION_CATEGORIES = [
  { id: 'mixed', label: 'Mixed Practice (Recommended)' },
  { id: 'predict_output', label: 'Predict the Output' },
  { id: 'time_complexity', label: 'Time Complexity Analysis' },
  { id: 'space_complexity', label: 'Space Complexity Analysis' },
  { id: 'algorithm_id', label: 'Identify Algorithm & Pattern' },
  { id: 'missing_code', label: 'Find Missing Code Block' },
  { id: 'edge_case', label: 'Edge Case Detection' },
];

export const SpeedRun = () => {
  const { user } = useAuthStore();

  // Mode state
  const [modeState, setModeState] = useState<ModeState>('LANDING');

  // Config
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Arrays', 'Binary Search', 'Sorting']);
  const [selectedCategory, setSelectedCategory] = useState<string>('mixed');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(12);

  // Assessment runtime
  const [questions, setQuestions] = useState<SpeedRunQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> optionText
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Results
  const [report, setReport] = useState<SpeedRunReport | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Countdown timer
  useEffect(() => {
    let timer: any = null;
    if (modeState === 'ASSESSMENT' && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmitOnExpiry();
            return 0;
          }
          return prev - 1;
        });
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [modeState, secondsRemaining]);

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Adjust default counts when difficulty changes
  const handleDifficultyChange = (diff: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setDifficulty(diff);
    if (diff === 'Beginner') {
      setQuestionCount(5);
      setDurationMinutes(8);
    } else if (diff === 'Intermediate') {
      setQuestionCount(10);
      setDurationMinutes(12);
    } else {
      setQuestionCount(15);
      setDurationMinutes(18);
    }
  };

  const handleToggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? (prev.length > 1 ? prev.filter((t) => t !== topic) : prev) : [...prev, topic]
    );
  };

  // Start Assessment via Gemini
  const handleStartSpeedRun = async () => {
    setIsGenerating(true);
    setApiError(null);

    try {
      const res = await api.post('/practice/speedrun/generate', {
        difficulty,
        topics: selectedTopics,
        count: questionCount,
        category: selectedCategory,
      });

      const qSet: SpeedRunQuestion[] = res.data.questions;
      if (!qSet || qSet.length === 0) {
        throw new Error('Failed to retrieve question set');
      }

      setQuestions(qSet);
      setCurrentIndex(0);
      setUserAnswers({});
      setFlaggedQuestions({});
      setSecondsRemaining(durationMinutes * 60);
      setTotalElapsedTime(0);
      setReport(null);
      setModeState('ASSESSMENT');
    } catch (err: any) {
      console.error('Speed Run generation error:', err);
      setApiError(err?.response?.data?.error || 'Failed to generate Speed Run assessment. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Select an option
  const handleSelectOption = (option: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  // Toggle flag
  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  // Submit test calculation
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowSubmitModal(false);

    try {
      const res = await api.post('/practice/speedrun/evaluate', {
        questions,
        userAnswers,
        timeTakenSeconds: totalElapsedTime,
      });

      const rep: SpeedRunReport = res.data.report;
      setReport(rep);

      // Persist to database
      await api.post('/practice/attempts', {
        userId: user?.id,
        mode: 'speed-run',
        difficulty,
        score: rep.score,
        accuracy: rep.accuracy,
        completionTime: totalElapsedTime,
        totalQuestions: rep.totalQuestions,
        correctAnswers: rep.correctAnswers,
        topics: selectedTopics,
        sessionDetails: {
          report: rep,
          questions: questions.map((q) => ({
            id: q.id,
            statement: q.statement,
            userAnswer: userAnswers[q.id] || null,
            correctAnswer: q.correctAnswer,
            isCorrect: (userAnswers[q.id] || '').trim() === q.correctAnswer.trim(),
            explanation: q.explanation,
          })),
        },
      });

      setModeState('RESULTS');
    } catch (err: any) {
      console.error('Speed Run submission error:', err);
      setApiError(err?.response?.data?.error || 'Failed to evaluate assessment results.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmitOnExpiry = () => {
    handleFinalSubmit();
  };

  const answeredCount = Object.keys(userAnswers).filter((k) => userAnswers[k]?.trim()).length;

  return (
    <WorkspaceLayout>
      {/* ======================================================== */}
      {/* 1. SPEED RUN LANDING CONFIG                              */}
      {/* ======================================================== */}
      {modeState === 'LANDING' && (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12 animate-in fade-in-0 duration-200">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
            <Link to="/practice" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Practice Arena
            </Link>
            <span>/</span>
            <span className="text-foreground">Speed Run</span>
          </div>

          {/* Hero */}
          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-950/40 via-card to-background border border-yellow-500/20 p-8 sm:p-10 rounded-3xl shadow-sm text-left">
            <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-yellow-500/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-start gap-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-black uppercase tracking-wider">
                <Zap className="w-4 h-4 fill-current" />
                <span>Rapid-Fire Assessment Engine</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
                DSA <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">Speed Run</span>
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                Put your algorithmic reflexes to the test. Answer timed, pattern-recognition, output-tracing, and complexity questions designed to simulate technical screening rounds and competitive programming contests.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span>Timed Test Simulation</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Topic &amp; Weak Area Analytics</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Gemini Dynamic Questions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* Left 2 Cols: Topics & Category */}
            <div className="lg:col-span-2 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="text-lg font-black text-foreground">1. Select Topics to Test</h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Questions will be drawn proportionally from your chosen domains.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {SPEEDRUN_TOPICS.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleToggleTopic(topic)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20 ring-2 ring-yellow-500/30'
                          : 'bg-muted/70 hover:bg-muted text-foreground border border-border/60'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border/60 space-y-3">
                <h4 className="text-sm font-bold text-foreground">Question Category Mode</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUESTION_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500 shadow-2xs'
                            : 'bg-muted/40 border-border/70 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Col: Difficulty & Launch */}
            <div className="flex flex-col gap-6">
              {/* Difficulty Card */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-4 shadow-sm text-left">
                <div>
                  <h3 className="text-base font-black text-foreground">2. Difficulty Tier</h3>
                  <p className="text-xs text-muted-foreground font-medium">Sets question depth and countdown pacing.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => {
                    const isSelected = difficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => handleDifficultyChange(diff)}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-yellow-500/15 border-yellow-500 text-yellow-500 shadow-2xs font-black'
                            : 'bg-muted/50 border-border/80 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div>{diff}</div>
                        <div className="text-[10px] font-medium opacity-70 mt-1">
                          {diff === 'Beginner' ? '5 Qs • 8m' : diff === 'Intermediate' ? '10 Qs • 12m' : '15 Qs • 18m'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom tuning */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Questions: <strong className="text-foreground">{questionCount}</strong></span>
                  <span>Duration: <strong className="text-foreground">{durationMinutes} min</strong></span>
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
                onClick={handleStartSpeedRun}
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-black font-black text-sm shadow-lg shadow-yellow-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                    <span>Gemini AI is generating questions...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Start Speed Run Test</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ACTIVE TEST TAKING ASSESSMENT                         */}
      {/* ======================================================== */}
      {modeState === 'ASSESSMENT' && questions.length > 0 && (
        <div className="flex flex-col max-w-5xl mx-auto gap-4 text-left animate-in fade-in-0 duration-150">
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-card border border-border/80 px-5 py-3 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-500 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <div>
                <div className="text-xs font-black text-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </div>
                <div className="text-[10px] text-muted-foreground font-medium">
                  {answeredCount} answered • {questions.length - answeredCount} remaining
                </div>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-mono font-black text-sm ${
                  secondsRemaining < 120
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-500 animate-pulse'
                    : 'bg-muted/70 border-border text-foreground'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatSeconds(secondsRemaining)}</span>
              </div>

              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* Navigation Palette */}
          <div className="flex items-center gap-2 overflow-x-auto p-2 bg-card border border-border/80 rounded-2xl">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = !!userAnswers[q.id]?.trim();
              const isFlagged = !!flaggedQuestions[q.id];

              let badgeStyle = 'bg-muted/50 text-muted-foreground border-border/60';
              if (isCurrent) {
                badgeStyle = 'bg-primary text-primary-foreground font-black ring-2 ring-primary/40';
              } else if (isFlagged) {
                badgeStyle = 'bg-amber-500/20 text-amber-500 border-amber-500/40 font-bold';
              } else if (isAnswered) {
                badgeStyle = 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40 font-bold';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`min-w-8 h-8 px-2 rounded-xl text-xs border flex items-center justify-center transition-all cursor-pointer ${badgeStyle}`}
                >
                  {isFlagged ? '⚑ ' : ''}
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Main Question Card */}
          {questions[currentIndex] && (
            <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Question Meta */}
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] uppercase tracking-wider">
                    {questions[currentIndex].topic}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] uppercase">
                    {questions[currentIndex].questionType}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    flaggedQuestions[questions[currentIndex].id]
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flaggedQuestions[questions[currentIndex].id] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Statement */}
              <h3 className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
                {questions[currentIndex].statement}
              </h3>

              {/* Code Snippet if present */}
              {questions[currentIndex].codeSnippet && (
                <div className="p-4 rounded-2xl bg-[#14151c] border border-border/70 font-mono text-xs sm:text-sm text-foreground overflow-x-auto whitespace-pre leading-relaxed shadow-2xs">
                  {questions[currentIndex].codeSnippet}
                </div>
              )}

              {/* Options Radio List */}
              <div className="space-y-3 pt-2">
                {questions[currentIndex].options.map((option, optIdx) => {
                  const isSelected = userAnswers[questions[currentIndex].id] === option;
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-500/15 border-yellow-500 text-foreground ring-1 ring-yellow-500/40 shadow-xs'
                          : 'bg-muted/40 hover:bg-muted/70 border-border/70 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                            isSelected
                              ? 'bg-yellow-500 text-black'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {optionLetters[optIdx]}
                        </span>
                        <span className="font-medium text-xs sm:text-sm">{option}</span>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-yellow-500 bg-yellow-500' : 'border-border'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {userAnswers[questions[currentIndex].id] && (
                    <button
                      type="button"
                      onClick={() => {
                        const copy = { ...userAnswers };
                        delete copy[questions[currentIndex].id];
                        setUserAnswers(copy);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 cursor-pointer"
                    >
                      Clear Choice
                    </button>
                  )}

                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(true)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      <span>Review & Submit</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Confirmation Modal */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-left animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="flex items-center gap-2 text-foreground font-black text-base">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span>Submit Speed Run Assessment?</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
                  {questions.length - answeredCount > 0 && (
                    <span className="text-amber-500 block mt-1 font-semibold">
                      You have {questions.length - answeredCount} unattempted questions!
                    </span>
                  )}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-bold text-foreground cursor-pointer"
                  >
                    Continue Test
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black shadow-md hover:bg-primary/90 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Scoring...' : 'Confirm Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SPEED RUN RESULTS & EXPLANATION REPORT                */}
      {/* ======================================================== */}
      {modeState === 'RESULTS' && report && (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8 text-left animate-in fade-in-0 duration-200">
          <div className="bg-card border border-border/80 rounded-3xl p-8 sm:p-10 text-center shadow-lg relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6 text-black shadow-xl shadow-yellow-500/25">
              <Award className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-foreground mb-2">
              Assessment Complete!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto mb-8 font-medium">
              Review your speed, accuracy, and detailed Gemini explanation breakdown below.
            </p>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/60">
                <div className="text-3xl font-black text-yellow-500">{report.score}</div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground mt-1">Total Score</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/60">
                <div className="text-3xl font-black text-emerald-500">{report.accuracy}%</div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground mt-1">Accuracy</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/60">
                <div className="text-3xl font-black text-foreground">
                  {report.correctAnswers}/{report.totalQuestions}
                </div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground mt-1">Correct Answers</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/60">
                <div className="text-3xl font-black text-primary font-mono">
                  {formatSeconds(report.completionTimeSeconds)}
                </div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground mt-1">Time Used</div>
              </div>
            </div>

            {/* Recommendations & Weak Topics */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-card to-background border border-yellow-500/25 text-left space-y-3 mb-8 shadow-xs">
              <div className="flex items-center gap-2 text-yellow-500 font-extrabold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Coach Insights &amp; Recommendations</span>
              </div>
              <ul className="list-disc pl-4 text-xs text-foreground space-y-1 font-medium">
                {report.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Detailed Question Review Accordion */}
            <div className="text-left space-y-4 mb-8">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Question-by-Question Review</span>
              </h3>

              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const candidateChoice = userAnswers[q.id];
                  const isCorrect = (candidateChoice || '').trim() === q.correctAnswer.trim();
                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border text-xs space-y-3 ${
                        isCorrect
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'bg-rose-500/5 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">Q{idx + 1}.</span>
                          <span className="font-semibold text-muted-foreground">({q.topic})</span>
                        </div>
                        {isCorrect ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 text-[11px] font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>

                      <p className="font-medium text-foreground">{q.statement}</p>

                      {q.codeSnippet && (
                        <div className="p-3 rounded-xl bg-[#14151c] font-mono text-xs whitespace-pre overflow-x-auto text-foreground">
                          {q.codeSnippet}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-card border border-border">
                          <span className="text-muted-foreground block font-semibold mb-0.5">Your Answer:</span>
                          <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {candidateChoice || 'Unattempted'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border">
                          <span className="text-muted-foreground block font-semibold mb-0.5">Correct Answer:</span>
                          <span className="text-emerald-400 font-bold">{q.correctAnswer}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-muted/40 text-muted-foreground text-[11px] leading-relaxed">
                        <strong className="text-foreground">Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
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
                onClick={handleStartSpeedRun}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Generate Another Assessment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
};
