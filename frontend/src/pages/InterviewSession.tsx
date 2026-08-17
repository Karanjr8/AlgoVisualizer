import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, Mic, MicOff, Video, PhoneOff, Code2, Sparkles, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state || {
    role: { name: 'SDE 1' },
    difficulty: 'Medium',
    topics: ['Arrays', 'Trees', 'Graphs'],
    style: { name: 'Mock Company Interview' },
    features: ['Voice Interview', 'AI Feedback Report', 'Technical Accuracy Evaluation'],
  };

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-14 sm:pt-16 pb-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <button
            onClick={() => navigate('/practice/interview')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Setup
          </button>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live AI Session
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-mono font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 44:52 Left
            </span>
          </div>
        </div>

        {/* SESSION CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: AI INTERVIEWER VIDEO / AVATAR PANEL */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* AI Stream Box */}
            <div className="w-full aspect-video bg-card/90 border border-border rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
              {/* Background Glow Mesh */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-purple-500/5 to-transparent pointer-events-none" />

              {/* Stream Top Pill */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border text-xs font-bold">
                  <Bot className="w-4 h-4 text-primary" /> AlgoVis AI Interviewer
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase">
                  Connected
                </div>
              </div>

              {/* Center AI Avatar Graphic */}
              <div className="self-center flex flex-col items-center gap-3 z-10">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary via-purple-600 to-blue-600 p-[3px] shadow-2xl shadow-primary/30">
                  <div className="w-full h-full bg-card rounded-[22px] flex items-center justify-center text-primary">
                    <Bot className="w-12 h-12" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Analyzing Response...
                </div>
              </div>

              {/* Stream Bottom Controls */}
              <div className="flex items-center justify-center gap-3 z-10">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full border transition-all ${isMicOn ? 'bg-secondary border-border text-foreground' : 'bg-destructive/20 border-destructive text-destructive'}`}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsCamOn(!isCamOn)}
                  className={`p-3 rounded-full border transition-all ${isCamOn ? 'bg-secondary border-border text-foreground' : 'bg-destructive/20 border-destructive text-destructive'}`}
                >
                  <Video className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/practice')}
                  className="px-6 py-3 rounded-full bg-destructive text-destructive-foreground font-black text-xs shadow-lg hover:opacity-90 flex items-center gap-2"
                >
                  <PhoneOff className="w-4 h-4" /> End Interview
                </button>
              </div>
            </div>

            {/* AI PROMPT / QUESTION CARD */}
            <div className="w-full bg-card border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Active Prompt
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  Role: {config.role?.name} • {config.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground leading-snug">
                "Given an integer array <code className="font-mono text-purple-400 px-1 bg-secondary rounded">nums</code>, find the contiguous subarray with the maximum sum and return its sum. Explain your approach step-by-step."
              </h3>

              <div className="flex items-center gap-2 flex-wrap pt-2">
                <span className="text-xs font-bold text-muted-foreground mr-1">Topics:</span>
                {config.topics?.map((t: string) => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-bold border border-border">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE CODE EDITOR & NOTES PLACEHOLDER */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="w-full bg-card border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-4 h-full min-h-[420px]">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-black uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" /> Interactive Code Workspace
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">Python 3</span>
              </div>

              <textarea
                className="w-full flex-1 bg-background border border-border rounded-2xl p-4 font-mono text-xs text-foreground focus:outline-none focus:border-primary/50 resize-none leading-relaxed"
                defaultValue={`def maxSubArray(nums: list[int]) -> int:
    # Kadane's Algorithm
    max_current = max_global = nums[0]
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        if max_current > max_global:
            max_global = max_current
    return max_global`}
              />

              <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs shadow-md hover:opacity-90 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Submit Code for AI Evaluation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
