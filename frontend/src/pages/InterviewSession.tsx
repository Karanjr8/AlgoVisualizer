import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Bot,
  Send,
  Clock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Target,
  RefreshCw,
  LogOut,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  Printer,
  Sparkles,
  Zap,
  TrendingUp,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { api } from '../lib/api';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  sessionId: string;
  sequenceNumber: number;
  sender: 'interviewer' | 'candidate' | 'system';
  content: string;
  questionTopic?: string | null;
  questionType?: string | null;
  timeSpentSeconds?: number | null;
  timedOut?: boolean;
  createdAt?: string;
  evaluationSnippet?: {
    overallScore?: number;
    feedback?: string;
    strengths?: string;
    weaknesses?: string;
  };
}

interface DimensionScore {
  score: number;
  label: string;
  feedback: string;
}

interface QuestionReview {
  questionNumber: number;
  question: string;
  topic: string;
  candidateAnswer: string;
  score: number;
  correctness: 'Correct' | 'Partially Correct' | 'Incorrect' | 'Unanswered';
  whatExplainedWell: string;
  whatWasMissing: string;
  suggestedIdealAnswer: string;
  conceptsToRevise: string[];
  answeredOnTime: boolean;
  timeSpentSeconds?: number;
}

interface TopicPerformance {
  topic: string;
  questionsCount: number;
  averageScore: number;
  strongAreas: string[];
  weakAreas: string[];
  conceptsToImprove: string[];
}

interface ActionablePlanItem {
  priority: 'High' | 'Medium' | 'Low';
  topic: string;
  concept: string;
  recommendedAction: string;
  suggestedPractice: string;
}

interface ReportData {
  id?: string;
  overallScore: number | null;
  performanceGrade?: 'Excellent' | 'Very Good' | 'Good' | 'Average' | 'Needs Improvement' | null;
  summary: string;
  strengths: string[];
  improvementAreas: string[];
  dimensionScores: Record<string, DimensionScore>;
  topicScores?: Record<string, TopicPerformance>;
  questionReviews: QuestionReview[];
  recommendations: string[];
  actionablePlan?: ActionablePlanItem[];
  interviewerFeedback?: string;
}

interface SessionData {
  id: string;
  userId?: string | null;
  role: string;
  difficulty: string;
  interviewStyle: string;
  selectedTopics: string[];
  enabledFeatures: string[];
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  turnCount: number;
  maxTurns: number;
  timeLimitPerQuestion?: number;
  startedAt: string;
  completedAt?: string | null;
  messages?: Message[];
  report?: ReportData | null;
}

export const InterviewSession: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId: paramSessionId } = useParams<{ sessionId?: string }>();

  // State
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [candidateInput, setCandidateInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isRetryingReport, setIsRetryingReport] = useState(false);
  const [error, setError] = useState<{ message: string; canRetry?: boolean; lastAction?: 'submit' | 'report' } | null>(null);
  const [lastAttemptedAnswer, setLastAttemptedAnswer] = useState<string>('');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [missingConfigNotice, setMissingConfigNotice] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showTranscriptInReport, setShowTranscriptInReport] = useState(false);
  const [expandedQuestionReview, setExpandedQuestionReview] = useState<number | null>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Time Pressure Countdown State
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting]);

  // Overall session elapsed timer
  useEffect(() => {
    if (session?.status !== 'IN_PROGRESS') return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.status]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Helper to determine active question sequence
  const latestInterviewerMsg = [...messages].reverse().find((m) => m.sender === 'interviewer');
  const currentQuestionSeq = latestInterviewerMsg ? latestInterviewerMsg.sequenceNumber : 1;

  // Initialize or fetch session
  useEffect(() => {
    const initSession = async () => {
      setIsLoadingSession(true);
      setError(null);

      // Case 1: Session passed via navigation state
      const state = location.state as {
        session?: SessionData;
        firstMessage?: Message;
        aiProvider?: string;
        missingConfigNotice?: string;
        voiceNotice?: string;
      } | null;

      if (state?.session) {
        setSession(state.session);
        setVoiceNotice(state.voiceNotice || null);
        setMissingConfigNotice(state.missingConfigNotice || null);

        if (state.session.report) {
          setReport(state.session.report);
        }

        if (state.session.messages && state.session.messages.length > 0) {
          setMessages(state.session.messages);
        } else if (state.firstMessage) {
          setMessages([state.firstMessage]);
        }
        setIsLoadingSession(false);
        return;
      }

      // Case 2: Load session from API via paramSessionId
      const targetId = paramSessionId;
      if (targetId) {
        try {
          const res = await api.get(`/interviews/${targetId}`);
          const fetchedSession: SessionData = res.data.session;
          setSession(fetchedSession);

          if (fetchedSession.messages) {
            setMessages(fetchedSession.messages);
          }

          if (fetchedSession.report) {
            setReport(fetchedSession.report);
          }
        } catch (err: any) {
          console.error('Failed to load session:', err);
          setError({
            message: err?.response?.data?.error || 'Unable to retrieve interview session.',
            canRetry: true,
          });
        } finally {
          setIsLoadingSession(false);
        }
        return;
      }

      navigate('/practice/interview', { replace: true });
    };

    initSession();
  }, [location.state, paramSessionId, navigate]);

  // Submit Answer handler
  const doSubmitAnswer = useCallback(
    async (forcedAnswer?: string, isTimeout: boolean = false) => {
      if (!session || isSubmitting) return;

      const answerText = forcedAnswer !== undefined ? forcedAnswer : candidateInput.trim();
      if (!answerText && !isTimeout) return;

      setLastAttemptedAnswer(answerText);
      setError(null);
      setIsSubmitting(true);

      const limit = session.timeLimitPerQuestion || 0;
      const spent = limit > 0 && questionTimeRemaining !== null ? Math.max(1, limit - questionTimeRemaining) : undefined;

      try {
        const res = await api.post(`/interviews/${session.id}/answers`, {
          answer: answerText || (isTimeout ? '[Time Expired - No response submitted]' : '[No response submitted]'),
          modality: 'text',
          timeSpentSeconds: spent,
          timedOut: isTimeout,
        });

        const { candidateMessage, interviewerMessage, evaluation, isComplete, turnCount, report: finalReport } = res.data;

        // Append messages
        setMessages((prev) => [
          ...prev,
          candidateMessage,
          {
            ...interviewerMessage,
            evaluationSnippet: evaluation
              ? {
                  overallScore: evaluation.overallScore,
                  feedback: evaluation.evaluationExplanation || evaluation.feedback,
                  strengths: evaluation.whatExplainedCorrectly || evaluation.strengths,
                  weaknesses: evaluation.areasForImprovement || evaluation.weaknesses,
                }
              : undefined,
          },
        ]);

        // Clear input
        setCandidateInput('');

        // Update session turn count
        setSession((prev) => (prev ? { ...prev, turnCount } : prev));

        // Reset timer storage for new question
        if (session.timeLimitPerQuestion && session.timeLimitPerQuestion > 0) {
          sessionStorage.removeItem(`interview_q_timer_${session.id}_${currentQuestionSeq}`);
        }

        // Handle completion
        if (isComplete) {
          setSession((prev) => (prev ? { ...prev, status: 'COMPLETED' } : prev));
          if (finalReport) {
            setReport(finalReport);
          }
        }
      } catch (err: any) {
        console.error('Failed to submit answer:', err);
        setError({
          message: err?.response?.data?.error || 'Live AI evaluation failed. Your answer is preserved. Please click Retry.',
          canRetry: true,
          lastAction: 'submit',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [session, isSubmitting, candidateInput, questionTimeRemaining, currentQuestionSeq]
  );

  // Time Pressure Mode Countdown Timer Logic with anti-refresh reset
  useEffect(() => {
    if (session?.status !== 'IN_PROGRESS' || !session.timeLimitPerQuestion || session.timeLimitPerQuestion <= 0) {
      setQuestionTimeRemaining(null);
      return;
    }

    if (isSubmitting) return;

    const timeLimit = session.timeLimitPerQuestion;
    const storageKey = `interview_q_timer_${session.id}_${currentQuestionSeq}`;

    let startTimestamp = parseInt(sessionStorage.getItem(storageKey) || '0', 10);
    const now = Date.now();

    if (!startTimestamp || isNaN(startTimestamp)) {
      startTimestamp = now;
      sessionStorage.setItem(storageKey, startTimestamp.toString());
    }

    const elapsed = Math.floor((now - startTimestamp) / 1000);
    const initialRemaining = Math.max(0, timeLimit - elapsed);
    setQuestionTimeRemaining(initialRemaining);

    if (initialRemaining <= 0) {
      doSubmitAnswer(candidateInput.trim(), true);
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          doSubmitAnswer(candidateInput.trim(), true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.id, session?.status, session?.timeLimitPerQuestion, currentQuestionSeq, isSubmitting, doSubmitAnswer]);

  const handleSubmitAnswer = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!candidateInput.trim()) return;
    await doSubmitAnswer(candidateInput.trim(), false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  // End Interview Early
  const handleConfirmEndInterview = async () => {
    if (!session || isEnding) return;
    setIsEnding(true);
    setShowEndModal(false);
    setError(null);

    try {
      const res = await api.post(`/interviews/${session.id}/end`);
      if (res.data?.report) {
        setSession((prev) => (prev ? { ...prev, status: 'COMPLETED' } : prev));
        setReport(res.data.report);
      }
    } catch (err: any) {
      console.error('Failed to end interview:', err);
      setError({
        message: err?.response?.data?.error || 'Failed to generate live assessment report. Please click Retry Report.',
        canRetry: true,
        lastAction: 'report',
      });
    } finally {
      setIsEnding(false);
    }
  };

  // Retry generating report
  const handleRetryReport = async () => {
    if (!session || isRetryingReport) return;
    setIsRetryingReport(true);
    setError(null);

    try {
      const res = await api.post(`/interviews/${session.id}/retry-report`);
      if (res.data?.report) {
        setReport(res.data.report);
        setSession((prev) => (prev ? { ...prev, status: 'COMPLETED' } : prev));
      }
    } catch (err: any) {
      console.error('Retry report generation failed:', err);
      setError({
        message: err?.response?.data?.error || 'AI assessment report generation failed. Please check Gemini API configuration.',
        canRetry: true,
        lastAction: 'report',
      });
    } finally {
      setIsRetryingReport(false);
    }
  };

  const getGradeStyle = (grade?: string | null, score?: number | null) => {
    const s = score || 0;
    if (s >= 90 || grade === 'Excellent') {
      return {
        bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        text: 'text-emerald-500',
        border: 'border-emerald-500/30',
        label: 'Excellent',
      };
    }
    if (s >= 80 || grade === 'Very Good') {
      return {
        bg: 'bg-primary/10 text-primary border-primary/20',
        text: 'text-primary',
        border: 'border-primary/30',
        label: 'Very Good',
      };
    }
    if (s >= 70 || grade === 'Good') {
      return {
        bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        text: 'text-blue-500',
        border: 'border-blue-500/30',
        label: 'Good',
      };
    }
    if (s >= 55 || grade === 'Average') {
      return {
        bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        text: 'text-amber-500',
        border: 'border-amber-500/30',
        label: 'Average',
      };
    }
    return {
      bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      text: 'text-rose-500',
      border: 'border-rose-500/30',
      label: 'Needs Improvement',
    };
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (isLoadingSession) {
    return (
      <WorkspaceLayout>
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 text-foreground">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <h2 className="text-xl font-bold">Initializing Live Gemini Interview Session...</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Contacting AI model and preparing tailored questions.
          </p>
        </div>
      </WorkspaceLayout>
    );
  }

  // ==========================================
  // COMPLETED SESSION - REPORT PENDING STATE
  // ==========================================
  if (session?.status === 'COMPLETED' && !report) {
    return (
      <WorkspaceLayout>
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-6 text-left max-w-2xl mx-auto p-6 bg-card border border-border/80 rounded-3xl shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-black text-foreground">Interview Concluded</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your interview responses have been recorded. Click below to generate your complete, evidence-based diagnostic assessment report using live Gemini AI.
            </p>
          </div>

          {error && (
            <div className="w-full p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error.message}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleRetryReport}
            disabled={isRetryingReport}
            className="w-full py-3.5 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isRetryingReport ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Comprehensive AI Assessment Report...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Diagnostic Assessment Report</span>
              </>
            )}
          </button>
        </div>
      </WorkspaceLayout>
    );
  }

  // ==========================================
  // COMPREHENSIVE AI ASSESSMENT REPORT VIEW
  // ==========================================
  if (session?.status === 'COMPLETED' && report) {
    const gradeStyle = getGradeStyle(report.performanceGrade, report.overallScore);
    const completedDate = session.completedAt
      ? new Date(session.completedAt).toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : new Date().toLocaleDateString();

    const attemptedCount = messages.filter((m) => m.sender === 'candidate').length;

    return (
      <WorkspaceLayout>
        <div className="w-full flex flex-col gap-8 pb-20 text-left max-w-6xl mx-auto print:max-w-full">
          {/* TOP ACTION BAR */}
          <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-4 print:hidden">
            <button
              type="button"
              onClick={() => navigate('/practice/interview')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary text-xs sm:text-sm font-bold hover:bg-secondary/80 text-foreground transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Start New Interview
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Download / Print Report
              </button>
            </div>
          </div>

          {/* SECTION A: INTERVIEW OVERVIEW BANNER */}
          <div className="w-full bg-gradient-to-r from-card/90 via-card/50 to-primary/10 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> Live AI Diagnostic Assessment Report
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                  {session.role} Technical Assessment
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Conducted on {completedDate} &bull; Difficulty: <strong className="text-foreground">{session.difficulty}</strong> &bull; Format: <strong className="text-foreground">{session.interviewStyle}</strong>
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {session.selectedTopics.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-lg bg-secondary text-[11px] font-semibold text-foreground border border-border/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* OVERVIEW STATS BADGES */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 self-stretch lg:self-auto">
                <div className="p-3 bg-card/80 border border-border/80 rounded-2xl text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Questions
                  </span>
                  <span className="font-mono font-black text-lg text-foreground">
                    {attemptedCount} / {session.maxTurns}
                  </span>
                </div>
                <div className="p-3 bg-card/80 border border-border/80 rounded-2xl text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Total Time
                  </span>
                  <span className="font-mono font-black text-lg text-foreground">
                    {formatTimer(elapsedSeconds)}
                  </span>
                </div>
                <div className="p-3 bg-card/80 border border-border/80 rounded-2xl text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Mode
                  </span>
                  <span className="font-mono font-bold text-xs text-foreground block mt-1">
                    {session.timeLimitPerQuestion ? `${session.timeLimitPerQuestion}s Timed` : 'Untimed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: OVERALL PERFORMANCE SCORE CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* SCORE HERO CARD */}
            <div className="lg:col-span-5 bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden backdrop-blur-md">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Overall Performance Score
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl sm:text-6xl font-black font-mono text-foreground tracking-tight">
                    {report.overallScore || 0}
                  </span>
                  <span className="text-xl font-bold text-muted-foreground">/ 100</span>
                </div>

                <div className="mt-3">
                  <span className={cn('inline-block px-3 py-1 rounded-xl border text-xs sm:text-sm font-black uppercase tracking-wider', gradeStyle.bg)}>
                    Rating: {report.performanceGrade || gradeStyle.label}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-background/60 border border-border/70 text-xs sm:text-sm font-medium text-foreground/90 leading-relaxed">
                {report.summary}
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span>Evaluation Engine</span>
                <span className="font-bold text-foreground">Google Gemini Semantic Rubric</span>
              </div>
            </div>

            {/* SECTION C: PARAMETER-WISE ASSESSMENT METERS */}
            <div className="lg:col-span-7 bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between gap-4 backdrop-blur-md">
              <div className="border-b border-border/60 pb-3">
                <h3 className="font-black text-lg text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Evaluation Dimensions (/10)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Scores across core parameters generated dynamically by Gemini from candidate answers.
                </p>
              </div>

              <div className="space-y-3.5">
                {Object.entries(report.dimensionScores || {}).map(([key, dim]) => {
                  const scoreVal = dim.score || 0;
                  const pct = Math.min(100, Math.max(0, scoreVal * 10));

                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-foreground">{dim.label}</span>
                        <span className="font-mono text-primary font-black">
                          {scoreVal.toFixed(1)} / 10
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {dim.feedback && (
                        <p className="text-[11px] text-muted-foreground leading-tight">
                          {dim.feedback}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION D: TOPIC-WISE PERFORMANCE */}
          {report.topicScores && Object.keys(report.topicScores).length > 0 && (
            <div className="w-full bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 backdrop-blur-md">
              <div className="border-b border-border/60 pb-3">
                <h3 className="font-black text-lg text-foreground flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Topic-wise Performance
                </h3>
                <p className="text-xs text-muted-foreground">
                  Performance across candidate's selected domains with identified strengths and revision needs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(report.topicScores).map((tp) => (
                  <div key={tp.topic} className="p-4 rounded-2xl bg-background/60 border border-border/70 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="font-bold text-sm text-foreground truncate">{tp.topic}</span>
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {tp.averageScore.toFixed(1)} / 10
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-500 block">Strong Areas:</span>
                        <p className="text-muted-foreground font-medium">{tp.strongAreas.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-rose-500 block">Topics to Revise:</span>
                        <p className="text-muted-foreground font-medium">{tp.weakAreas.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION E: QUESTION-BY-QUESTION REVIEW */}
          <div className="w-full bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 backdrop-blur-md">
            <div className="border-b border-border/60 pb-3">
              <h3 className="font-black text-lg text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Question-by-Question Evaluation & Ideal Answers
              </h3>
              <p className="text-xs text-muted-foreground">
                Semantic analysis of each question, submitted candidate reasoning, weaknesses identified, and ideal answers.
              </p>
            </div>

            <div className="space-y-4">
              {report.questionReviews.map((qr) => {
                const isOpen = expandedQuestionReview === qr.questionNumber;
                const isCorrect = qr.correctness === 'Correct';
                const isUnanswered = qr.correctness === 'Unanswered';

                return (
                  <div
                    key={qr.questionNumber}
                    className="border border-border/80 rounded-2xl bg-background/60 overflow-hidden transition-all shadow-xs"
                  >
                    <div
                      onClick={() => setExpandedQuestionReview(isOpen ? null : qr.questionNumber)}
                      className="p-4 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          Q{qr.questionNumber}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-secondary text-foreground">
                              {qr.topic}
                            </span>
                            <span
                              className={cn(
                                'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border',
                                isCorrect
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                  : isUnanswered
                                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              )}
                            >
                              {qr.correctness}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-foreground mt-1 truncate">
                            {qr.question}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-black text-sm text-foreground">
                          {qr.score}/10
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="p-4 sm:p-6 border-t border-border/60 space-y-4 text-xs sm:text-sm bg-card/40">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                            Interviewer Question:
                          </span>
                          <p className="p-3 rounded-xl bg-background border border-border/70 font-semibold text-foreground">
                            {qr.question}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                            Candidate's Submitted Answer:
                          </span>
                          <p className="p-3 rounded-xl bg-background border border-border/70 font-medium text-foreground whitespace-pre-wrap">
                            {qr.candidateAnswer}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> What Was Handled Well
                            </span>
                            <p className="text-xs text-foreground/90 font-medium">
                              {qr.whatExplainedWell}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Missing Concepts & Flaws
                            </span>
                            <p className="text-xs text-foreground/90 font-medium">
                              {qr.whatWasMissing}
                            </p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Suggested Ideal Answer
                          </span>
                          <p className="text-xs text-foreground font-medium leading-relaxed">
                            {qr.suggestedIdealAnswer}
                          </p>
                        </div>

                        {qr.conceptsToRevise && qr.conceptsToRevise.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/40">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase">
                              Revision Concepts:
                            </span>
                            {qr.conceptsToRevise.map((c) => (
                              <span key={c} className="px-2 py-0.5 rounded-md bg-secondary text-[11px] font-mono font-medium text-foreground border border-border/60">
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTIONS F & G: STRENGTHS & WEAKNESSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-500 border-b border-border/60 pb-3">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-black text-lg text-foreground">Demonstrated Strengths</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-foreground/90">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2 text-rose-500 border-b border-border/60 pb-3">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-black text-lg text-foreground">Areas for Improvement</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-foreground/90">
                {report.improvementAreas.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION H: ACTIONABLE PLAN */}
          {report.actionablePlan && report.actionablePlan.length > 0 && (
            <div className="w-full bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 backdrop-blur-md">
              <div className="border-b border-border/60 pb-3">
                <h3 className="font-black text-lg text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Personalized Actionable Improvement Plan
                </h3>
                <p className="text-xs text-muted-foreground">
                  Targeted roadmap of concepts to revise prioritized by Gemini from your weakest responses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.actionablePlan.map((item, idx) => {
                  const priorityColor =
                    item.priority === 'High'
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      : item.priority === 'Medium'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-500 border-blue-500/20';

                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-background/60 border border-border/70 space-y-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', priorityColor)}>
                            {item.priority} Priority
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground">{item.topic}</span>
                        </div>
                        <h4 className="font-black text-sm text-foreground">{item.concept}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.recommendedAction}</p>
                      </div>

                      <div className="pt-2 border-t border-border/40 text-[11px] text-primary font-medium">
                        <strong>Practice:</strong> {item.suggestedPractice}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION I: SENIOR INTERVIEWER FEEDBACK */}
          {report.interviewerFeedback && (
            <div className="w-full bg-muted/40 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-3">
              <h4 className="font-black text-base text-foreground flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" /> Senior Interviewer Concluding Remarks
              </h4>
              <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed whitespace-pre-wrap">
                {report.interviewerFeedback}
              </p>
            </div>
          )}

          {/* TRANSCRIPT TOGGLE */}
          <div className="pt-2 border-t border-border/60 print:hidden">
            <button
              type="button"
              onClick={() => setShowTranscriptInReport(!showTranscriptInReport)}
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer"
            >
              {showTranscriptInReport ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{showTranscriptInReport ? 'Hide Complete Conversation Transcript' : 'View Complete Conversation Transcript'}</span>
            </button>

            {showTranscriptInReport && (
              <div className="mt-4 p-5 rounded-2xl bg-card border border-border/80 space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className="text-xs space-y-1 border-b border-border/40 pb-3 last:border-0">
                    <span className="font-bold uppercase tracking-wider text-primary">
                      {m.sender === 'interviewer' ? 'AlgoVis Interviewer' : 'Candidate'}:
                    </span>
                    <p className="text-foreground whitespace-pre-wrap font-medium">{m.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </WorkspaceLayout>
    );
  }

  // ==========================================
  // ACTIVE INTERVIEW SESSION VIEW
  // ==========================================
  const isTimePressureActive = (session?.timeLimitPerQuestion || 0) > 0;
  const isLowTime = questionTimeRemaining !== null && questionTimeRemaining <= 15;
  const isUrgentTime = questionTimeRemaining !== null && questionTimeRemaining <= 5;

  return (
    <WorkspaceLayout>
      <div className="w-full flex flex-col gap-5 pb-16 text-left max-w-5xl mx-auto">
        {/* TOP STATUS BAR */}
        <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/practice/interview')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-xs font-bold hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Setup
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">{session?.role}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {session?.difficulty}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">&bull;</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {session?.selectedTopics.slice(0, 3).join(', ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            {/* Turn Count Indicator */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Question {Math.min(session?.turnCount ? session.turnCount + 1 : 1, session?.maxTurns || 8)} of {session?.maxTurns || 8}</span>
            </div>

            {/* Time Pressure Countdown Timer */}
            {isTimePressureActive && questionTimeRemaining !== null && (
              <div
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black border transition-colors',
                  isUrgentTime
                    ? 'bg-rose-500/20 text-rose-500 border-rose-500/40 animate-pulse'
                    : isLowTime
                    ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                    : 'bg-primary/10 text-primary border-primary/20'
                )}
                title="Time remaining for current question"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{questionTimeRemaining}s</span>
              </div>
            )}

            {/* Overall Elapsed Timer */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary text-xs font-mono font-bold text-foreground">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            {/* End Interview Action */}
            <button
              type="button"
              onClick={() => setShowEndModal(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>End</span>
            </button>
          </div>
        </div>

        {/* TIME PRESSURE NOTICE */}
        {isTimePressureActive && (
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Time Pressure Mode: {session?.timeLimitPerQuestion}s per question. Answers auto-submit when the countdown hits zero.
            </span>
          </div>
        )}

        {(voiceNotice || missingConfigNotice) && (
          <div className="px-4 py-2 rounded-xl bg-muted border border-border text-muted-foreground text-xs font-medium flex flex-col gap-1">
            {voiceNotice && <div>🎙️ {voiceNotice}</div>}
            {missingConfigNotice && <div>⚠️ {missingConfigNotice}</div>}
          </div>
        )}

        {/* ERROR WITH RETRY BUTTON */}
        {error && (
          <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {error.canRetry && error.lastAction === 'submit' && (
                <button
                  type="button"
                  onClick={() => doSubmitAnswer(lastAttemptedAnswer || candidateInput.trim(), false)}
                  className="px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold hover:bg-destructive/90 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry Evaluation</span>
                </button>
              )}
              {error.canRetry && error.lastAction === 'report' && (
                <button
                  type="button"
                  onClick={handleRetryReport}
                  className="px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold hover:bg-destructive/90 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry Report</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs underline text-destructive hover:opacity-80 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* CONVERSATION HISTORY CONTAINER */}
        <div className="bg-card/60 border border-border/80 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col gap-4 min-h-[420px] max-h-[620px] overflow-y-auto">
          {messages.map((m) => {
            const isInterviewer = m.sender === 'interviewer';

            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                  isInterviewer ? 'self-start' : 'self-end flex-row-reverse'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isInterviewer
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}
                >
                  {isInterviewer ? <Bot className="w-4 h-4" /> : 'You'}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                    isInterviewer
                      ? 'bg-card border border-border/80 text-foreground shadow-xs'
                      : 'bg-primary/10 border border-primary/25 text-foreground'
                  }`}
                >
                  {isInterviewer && m.questionTopic && (
                    <div className="mb-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-bold uppercase tracking-wider text-primary border border-border/60">
                        {m.questionTopic}
                      </span>
                      {m.questionType === 'follow_up' && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-amber-500/20">
                          Context-Aware Follow-up
                        </span>
                      )}
                    </div>
                  )}

                  <p>{m.content}</p>

                  {/* Immediate turn evaluation snippet from Gemini */}
                  {m.evaluationSnippet && (
                    <div className="mt-3 pt-2.5 border-t border-border/40 text-[11px] flex flex-col gap-1 text-muted-foreground font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">Gemini Evaluator:</span>
                        <span className="font-mono font-black text-primary">
                          {m.evaluationSnippet.overallScore !== undefined ? `${m.evaluationSnippet.overallScore}/10` : ''}
                        </span>
                      </div>
                      <p className="italic text-foreground/80">{m.evaluationSnippet.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator while Gemini evaluates & prepares next question */}
          {isSubmitting && (
            <div className="flex gap-3 max-w-[85%] self-start items-center">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 text-xs font-semibold text-muted-foreground flex items-center gap-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>Gemini AI is analyzing your response and formulating the next question...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* CANDIDATE ANSWER INPUT FORM */}
        <form onSubmit={handleSubmitAnswer} className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={4}
              value={candidateInput}
              onChange={(e) => setCandidateInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              placeholder={
                isSubmitting
                  ? 'Gemini AI is currently evaluating your answer...'
                  : 'Type your technical response here. Walk through your approach, key concepts, trade-offs, and complexity... (Ctrl + Enter to submit)'
              }
              className="w-full p-4 rounded-2xl bg-card border border-border/80 text-foreground text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/60 resize-y shadow-xs disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">Enter</kbd> to submit</span>
              <span>{candidateInput.length} characters</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !candidateInput.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Answer</span>
            </button>
          </div>
        </form>

        {/* END INTERVIEW CONFIRMATION MODAL */}
        {showEndModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="bg-card border border-border/90 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-left">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="w-6 h-6" />
                <h3 className="font-black text-lg text-foreground">Conclude Interview Early?</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                Are you sure you want to conclude the interview now? The session will end, and Gemini AI will generate a complete diagnostic assessment report based on your submitted answers.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEndModal(false)}
                  className="px-4 py-2 rounded-xl bg-secondary text-xs font-bold text-foreground hover:bg-secondary/80 cursor-pointer"
                >
                  Continue Interview
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEndInterview}
                  disabled={isEnding}
                  className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold hover:bg-destructive/90 cursor-pointer flex items-center gap-1.5"
                >
                  {isEnding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                  <span>Conclude & Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
};
