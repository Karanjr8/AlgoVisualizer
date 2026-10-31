import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Clock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Target,
  RefreshCw,
  LogOut,
  HelpCircle,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react';
import { api } from '../lib/api';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';

interface Message {
  id: string;
  sessionId: string;
  sequenceNumber: number;
  sender: 'interviewer' | 'candidate' | 'system';
  content: string;
  questionTopic?: string | null;
  questionType?: string | null;
  createdAt?: string;
  evaluationSnippet?: {
    overallScore?: number;
    feedback?: string;
  };
}

interface DimensionScore {
  score: number;
  label: string;
  feedback: string;
}

interface QuestionReview {
  question: string;
  topic: string;
  candidateAnswer: string;
  score: number;
  feedback: string;
  improvement: string;
}

interface ReportData {
  id?: string;
  overallScore: number | null;
  summary: string;
  strengths: string[];
  improvementAreas: string[];
  dimensionScores: Record<string, DimensionScore>;
  questionReviews: QuestionReview[];
  recommendations: string[];
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
  const [error, setError] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [missingConfigNotice, setMissingConfigNotice] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showTranscriptInReport, setShowTranscriptInReport] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting]);

  // Elapsed timer
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
          setError(err?.response?.data?.error || 'Unable to retrieve interview session.');
        } finally {
          setIsLoadingSession(false);
        }
        return;
      }

      // If no session passed and no ID in params, redirect to setup
      navigate('/practice/interview', { replace: true });
    };

    initSession();
  }, [location.state, paramSessionId, navigate]);

  // Submit Answer
  const handleSubmitAnswer = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!session || !candidateInput.trim() || isSubmitting) return;

    const answerText = candidateInput.trim();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await api.post(`/interviews/${session.id}/answers`, {
        answer: answerText,
        modality: 'text',
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
                feedback: evaluation.feedback,
              }
            : undefined,
        },
      ]);

      // Clear input
      setCandidateInput('');

      // Update session turn count
      setSession((prev) => (prev ? { ...prev, turnCount } : prev));

      // Handle completion if interview concluded
      if (isComplete && finalReport) {
        setSession((prev) => (prev ? { ...prev, status: 'COMPLETED' } : prev));
        setReport(finalReport);
      }
    } catch (err: any) {
      console.error('Failed to submit answer:', err);
      setError(err?.response?.data?.error || 'Failed to submit response. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  // End Interview manually
  const handleEndInterview = async () => {
    if (!session || isEnding) return;
    setIsEnding(true);
    setShowEndModal(false);
    setError(null);

    try {
      const res = await api.post(`/interviews/${session.id}/end`);
      const { report: finalReport } = res.data;
      setSession((prev) => (prev ? { ...prev, status: 'COMPLETED' } : prev));
      setReport(finalReport);
    } catch (err: any) {
      console.error('Failed to conclude interview:', err);
      setError(err?.response?.data?.error || 'Unable to conclude interview session.');
    } finally {
      setIsEnding(false);
    }
  };

  // Loading Screen
  if (isLoadingSession) {
    return (
      <WorkspaceLayout>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-muted-foreground">Loading interview session...</p>
        </div>
      </WorkspaceLayout>
    );
  }

  // ==========================================
  // RENDER REPORT VIEW (When session is complete)
  // ==========================================
  if (session?.status === 'COMPLETED' && report) {
    return (
      <WorkspaceLayout>
        <div className="w-full flex flex-col gap-8 pb-16 text-left">
          {/* REPORT TOP BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/practice/interview')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-bold hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Setup
              </button>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed Session
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/practice"
                className="px-3.5 py-1.5 rounded-xl bg-secondary text-foreground text-xs font-bold hover:bg-secondary/80 transition-colors"
              >
                Practice Arena
              </Link>
              <button
                type="button"
                onClick={() => navigate('/practice/interview')}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 shadow-xs transition-all cursor-pointer"
              >
                Start New Interview
              </button>
            </div>
          </div>

          {/* REPORT HEADER SUMMARY CARD */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Diagnostic Performance Report
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {session.role} ({session.difficulty})
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">Evaluation</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                {report.summary}
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-primary/5 border border-primary/20 shrink-0 min-w-[150px]">
              <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">
                Overall Score
              </span>
              <div className="flex items-baseline gap-1 text-primary">
                <span className="text-4xl font-black">{report.overallScore ?? 'N/A'}</span>
                <span className="text-xs font-bold text-muted-foreground">/ 5.0</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-500 mt-1 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {(report.overallScore || 0) >= 4 ? 'Interview Ready' : 'Proficient'}
              </span>
            </div>
          </div>

          {/* DIMENSIONS PERFORMANCE BREAKDOWN */}
          {report.dimensionScores && Object.keys(report.dimensionScores).length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Evaluation Dimension Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {Object.entries(report.dimensionScores).map(([key, dim]) => (
                  <div key={key} className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{dim.label}</span>
                      <span className="text-xs font-black text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {dim.score} / 5.0
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                        style={{ width: `${Math.min(100, (dim.score / 5) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium leading-snug">
                      {dim.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STRENGTHS & AREAS FOR IMPROVEMENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Key Strengths
              </div>
              <ul className="space-y-2">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90 font-medium">
                    <span className="text-emerald-500 font-bold shrink-0">&bull;</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Areas */}
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <HelpCircle className="w-4 h-4" /> Areas for Improvement
              </div>
              <ul className="space-y-2">
                {report.improvementAreas.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90 font-medium">
                    <span className="text-amber-500 font-bold shrink-0">&bull;</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* QUESTION-BY-QUESTION REVIEW */}
          {report.questionReviews && report.questionReviews.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" /> Question-by-Question Review
              </h2>
              <div className="space-y-3">
                {report.questionReviews.map((rev, idx) => (
                  <div key={idx} className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-primary">Q{idx + 1}.</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/60">
                          {rev.topic}
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded shrink-0">
                        Score: {rev.score}/5
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      {rev.question}
                    </p>

                    <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 text-xs text-muted-foreground font-mono leading-relaxed">
                      <span className="font-sans font-bold text-foreground block mb-0.5">Your Response:</span>
                      {rev.candidateAnswer}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400">
                        <span className="font-bold block mb-0.5">What Went Well:</span>
                        {rev.feedback}
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-400">
                        <span className="font-bold block mb-0.5">Recommended Adjustment:</span>
                        {rev.improvement}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECOMMENDATIONS & NEXT STEPS */}
          {report.recommendations && report.recommendations.length > 0 && (
            <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" /> Actionable Next Steps & Concepts to Revise
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {report.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 text-xs font-medium text-foreground flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOGGLE FULL TRANSCRIPT */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowTranscriptInReport(!showTranscriptInReport)}
              className="flex items-center gap-2 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              {showTranscriptInReport ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{showTranscriptInReport ? 'Hide Complete Conversation Transcript' : 'View Complete Conversation Transcript'}</span>
            </button>

            {showTranscriptInReport && (
              <div className="mt-4 p-4 rounded-2xl bg-card border border-border/80 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="text-xs space-y-1 border-b border-border/40 pb-2.5 last:border-0">
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
  // RENDER ACTIVE INTERVIEW SESSION
  // ==========================================
  return (
    <WorkspaceLayout>
      <div className="w-full flex flex-col gap-5 pb-16 text-left">
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
                {session?.selectedTopics.join(', ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            {/* Turn Count Indicator */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Turn {session?.turnCount || 1} of {session?.maxTurns || 8}</span>
            </div>

            {/* Elapsed Timer */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary text-xs font-mono font-bold text-foreground">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            {/* End Interview Action */}
            <button
              type="button"
              onClick={() => setShowEndModal(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>End Interview</span>
            </button>
          </div>
        </div>

        {/* NOTICES */}
        {voiceNotice && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold flex items-center justify-between gap-2">
            <span>{voiceNotice}</span>
            <button
              type="button"
              onClick={() => setVoiceNotice(null)}
              className="text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {missingConfigNotice && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex items-center justify-between gap-2">
            <span>{missingConfigNotice}</span>
            <button
              type="button"
              onClick={() => setMissingConfigNotice(null)}
              className="text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs underline shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* CONVERSATION HISTORY CONTAINER */}
        <div className="bg-card/60 border border-border/80 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col gap-4 min-h-[420px] max-h-[600px] overflow-y-auto">
          {messages.map((m) => {
            const isInterviewer = m.sender === 'interviewer';

            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[90%] sm:max-w-[82%] ${
                  isInterviewer ? 'self-start' : 'self-end flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isInterviewer
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {isInterviewer ? <Bot className="w-4 h-4" /> : 'You'}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                    isInterviewer
                      ? 'bg-card border border-border/80 text-foreground'
                      : 'bg-primary/10 border border-primary/25 text-foreground'
                  }`}
                >
                  {/* Topic Tag if question */}
                  {isInterviewer && m.questionTopic && (
                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-border/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Topic: {m.questionTopic}
                      </span>
                      {m.questionType && (
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          &bull; {m.questionType === 'follow_up' ? 'Follow-up' : m.questionType}
                        </span>
                      )}
                    </div>
                  )}

                  {m.content}

                  {/* Evaluation Snippet Pill if present */}
                  {m.evaluationSnippet && (
                    <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground gap-2">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Turn Evaluated
                      </span>
                      <span className="font-bold text-foreground">
                        Score: {m.evaluationSnippet.overallScore}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Evaluating Indicator */}
          {isSubmitting && (
            <div className="flex items-center gap-3 self-start max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Interviewer is evaluating response & formulating next question...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* CANDIDATE INPUT AREA */}
        <form onSubmit={handleSubmitAnswer} className="bg-card border border-border/80 rounded-2xl p-3.5 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="font-semibold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              Your Solution / Explanation
            </span>
            <span className="text-[11px] hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono text-[10px]">Ctrl + Enter</kbd> to submit
            </span>
          </div>

          <textarea
            ref={textareaRef}
            rows={4}
            value={candidateInput}
            onChange={(e) => setCandidateInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting || session?.status === 'COMPLETED'}
            placeholder="Type your algorithmic approach, code explanation, edge case handling, and time/space complexity here..."
            className="w-full p-3 rounded-xl bg-background border border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs sm:text-sm font-mono leading-relaxed resize-y transition-all"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-muted-foreground font-medium">
              {candidateInput.length} characters
            </span>

            <div className="flex items-center gap-2">
              {candidateInput.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCandidateInput('')}
                  disabled={isSubmitting}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                disabled={!candidateInput.trim() || isSubmitting || session?.status === 'COMPLETED'}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-sm hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* CONFIRMATION MODAL TO END INTERVIEW */}
        {showEndModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-4 text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2.5 text-foreground">
                <div className="p-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
                  <LogOut className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold">End Interview Session?</h3>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Ending the interview now will finalize your session and generate your post-interview evaluation report based on the answers you have provided so far.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setShowEndModal(false)}
                  disabled={isEnding}
                  className="px-3.5 py-2 rounded-xl bg-secondary text-xs font-bold text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  Continue Interview
                </button>
                <button
                  type="button"
                  onClick={handleEndInterview}
                  disabled={isEnding}
                  className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isEnding ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Report...</span>
                    </>
                  ) : (
                    <span>End & View Report</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
};
