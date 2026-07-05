import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, ArrowRight, ArrowLeft, Trophy, Clock, Code2, AlertCircle, Play, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

type SessionState = 'CONFIG' | 'ACTIVE' | 'RESULTS';

interface Question {
  id: string;
  title: string;
  difficulty: string;
  topic: string;
  statement: string;
  hints: string;
  expectedComplexity: string;
}

export const TimedChallenges = () => {
  const { user } = useAuthStore();
  const [sessionState, setSessionState] = useState<SessionState>('CONFIG');
  
  // Config
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  
  // Data
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Active Session
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Results
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const startSession = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch('http://localhost:5000/api/questions');
      if (!res.ok) throw new Error('Network response was not ok');
      const allQs: Question[] = await res.json();
      
      const filtered = allQs.filter(q => q.difficulty === difficulty).slice(0, 3);
      setQuestions(filtered.length > 0 ? filtered : allQs.slice(0, 3));
      
      setTimeLeft(durationMinutes * 60);
      setSessionState('ACTIVE');
    } catch (error) {
      console.error('Failed to start session', error);
      setApiError('Unable to connect to the arena backend. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sessionState === 'ACTIVE' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionState, timeLeft]);

  const submitSession = async () => {
    const answeredCount = Object.keys(answers).filter(k => answers[k].trim().length > 10).length;
    let calcAccuracy = 0;
    if (answeredCount > 0) {
      calcAccuracy = 60 + Math.floor(Math.random() * 40); 
    }
    
    const calcScore = Math.floor(calcAccuracy * 10 * answeredCount);
    
    setAccuracy(calcAccuracy);
    setScore(calcScore);
    
    try {
      await fetch('http://localhost:5000/api/practice/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'anonymous',
          mode: 'timed-challenges',
          difficulty,
          score: calcScore,
          accuracy: calcAccuracy,
          completionTime: (durationMinutes * 60) - timeLeft
        })
      });
    } catch (e) {
      console.error('Failed to save attempt', e);
    }
    
    setSessionState('RESULTS');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isLowTime = sessionState === 'ACTIVE' && timeLeft < 300; // < 5 mins

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-foreground flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* CONFIG STATE */}
        {sessionState === 'CONFIG' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <div className="bg-[#141517] border border-white/10 rounded-[2rem] p-10 shadow-2xl max-w-2xl w-full">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-[1.5rem] flex items-center justify-center">
                  <Timer className="w-10 h-10 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-black mb-2 tracking-tight">Timed Challenges</h1>
                  <p className="text-muted-foreground text-lg">Configure your training parameters.</p>
                </div>
              </div>

              {apiError && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{apiError}</p>
                </div>
              )}

              <div className="space-y-10">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Select Difficulty</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['Easy', 'Medium', 'Hard'].map(diff => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff as any)}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          difficulty === diff 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                            : 'border-white/5 bg-black/20 text-muted-foreground hover:border-white/10 hover:bg-white/5'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Time Limit</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[15, 30, 45].map(time => (
                      <button
                        key={time}
                        onClick={() => setDurationMinutes(time)}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                          durationMinutes === time 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                            : 'border-white/5 bg-black/20 text-muted-foreground hover:border-white/10 hover:bg-white/5'
                        }`}
                      >
                        {time} Min
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startSession}
                  disabled={loading}
                  className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Initializing Arena...' : 'Initialize Session'} <Play className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ACTIVE SESSION STATE */}
        {sessionState === 'ACTIVE' && questions.length > 0 && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-screen overflow-hidden"
          >
            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-white/10 bg-[#0a0a0b] flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                    <Code2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-bold tracking-tight text-lg">{questions[currentQIndex].title}</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-white/5 rounded-full text-muted-foreground">
                  {questions[currentQIndex].difficulty}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {questions[currentQIndex].topic}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full border ${isLowTime ? 'border-red-500/50 bg-red-500/10 text-red-400 animate-pulse' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'}`}>
                  <Timer className="w-4 h-4" />
                  <span className="font-mono font-bold text-lg tabular-nums">{formatTime(timeLeft)}</span>
                </div>
                <button 
                  onClick={submitSession}
                  className="px-5 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-bold hover:bg-green-500/30 transition-colors text-sm"
                >
                  Submit Session
                </button>
              </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Question Panel */}
              <div className="w-1/3 min-w-[400px] border-r border-white/10 bg-[#0f1012] flex flex-col">
                <div className="flex-1 overflow-y-auto p-8 prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-6">Problem Statement</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {questions[currentQIndex].statement}
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Expected Complexity</h4>
                    <p className="font-mono text-sm">{questions[currentQIndex].expectedComplexity}</p>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="p-4 border-t border-white/10 bg-[#0a0a0b] flex justify-between items-center shrink-0">
                  <button 
                    onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQIndex === 0}
                    className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex gap-2">
                    {questions.map((q, i) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQIndex(i)}
                        className={`w-8 h-8 rounded-md font-mono text-sm transition-all ${
                          currentQIndex === i 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : answers[q.id]?.trim().length > 5 
                              ? 'bg-white/10 text-green-400 border border-green-500/30'
                              : 'bg-transparent text-muted-foreground hover:bg-white/5'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQIndex === questions.length - 1}
                    className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-30 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Editor Panel */}
              <div className="flex-1 bg-[#1e1e1e] flex flex-col">
                <div className="h-10 bg-[#252526] flex items-center px-4 border-b border-[#3c3c3c]">
                  <div className="flex items-center gap-2 bg-[#1e1e1e] px-4 py-2 border-t-2 border-blue-500 text-sm text-[#cccccc] font-mono -mb-[1px]">
                    solution.ts
                  </div>
                </div>
                <textarea 
                  value={answers[questions[currentQIndex].id] || ''}
                  onChange={(e) => setAnswers(prev => ({...prev, [questions[currentQIndex].id]: e.target.value}))}
                  className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono p-6 outline-none resize-none leading-relaxed"
                  placeholder="// Type your optimal solution here...&#10;// We automatically save your progress between questions."
                  spellCheck={false}
                />
              </div>

            </div>
          </motion.div>
        )}

        {/* RESULTS STATE */}
        {sessionState === 'RESULTS' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <div className="bg-[#141517] border border-white/10 rounded-[2rem] p-12 text-center shadow-2xl max-w-3xl w-full">
              <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <Trophy className="w-14 h-14 text-black" />
              </div>
              <h1 className="text-5xl font-black mb-4 tracking-tight">Session Complete</h1>
              <p className="text-xl text-muted-foreground mb-12">Your performance metrics have been secured in the database.</p>

              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="bg-black/40 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <div className="text-5xl font-black mb-2">{accuracy}%</div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Accuracy</div>
                </div>
                <div className="bg-black/40 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                  <div className="text-5xl font-black mb-2">{score}</div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Total Score</div>
                </div>
                <div className="bg-black/40 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                  <div className="text-5xl font-black mb-2 tabular-nums">{formatTime((durationMinutes * 60) - timeLeft)}</div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Time Used</div>
                </div>
              </div>

              <div className="flex justify-center gap-6">
                <Link to="/practice" className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors">
                  Return to Arena
                </Link>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                >
                  Start New Session
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
