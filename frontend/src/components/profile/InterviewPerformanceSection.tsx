import { motion } from 'framer-motion';
import { Briefcase, MessageSquare, BrainCircuit, CheckCheck, Star, Award, TrendingUp } from 'lucide-react';

interface InterviewPerformanceSectionProps {
  interviewsTaken?: number;
  averageScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  confidenceScore?: number;
  technicalAccuracy?: number;
}

export const InterviewPerformanceSection = ({
  interviewsTaken = 4,
  averageScore = 88,
  communicationScore = 85,
  problemSolvingScore = 92,
  confidenceScore = 84,
  technicalAccuracy = 90,
}: InterviewPerformanceSectionProps) => {
  // Determine Mock Hiring Recommendation based on overall score
  let recommendation = 'Strong Hire';
  let recBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20 shadow-lg';
  let recDesc = 'Demonstrates exceptional technical depth, clear communication, and efficient problem solving under time constraints.';

  if (averageScore < 60) {
    recommendation = 'Needs Practice';
    recBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    recDesc = 'Requires additional practice in data structure selection and verbalizing thought process during live coding.';
  } else if (averageScore < 75) {
    recommendation = 'Lean Hire';
    recBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    recDesc = 'Solid foundation shown. Practice optimization and edge case handling to boost interview confidence.';
  } else if (averageScore < 85) {
    recommendation = 'Hire';
    recBadge = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    recDesc = 'Meets all target competency benchmarks. Good communication and strong algorithmic execution.';
  }

  const domains = [
    { label: 'Problem Solving', score: problemSolvingScore, icon: BrainCircuit, color: 'from-purple-500 to-indigo-500' },
    { label: 'Technical Accuracy', score: technicalAccuracy, icon: CheckCheck, color: 'from-emerald-500 to-teal-500' },
    { label: 'Communication', score: communicationScore, icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
    { label: 'Confidence Score', score: confidenceScore, icon: Star, color: 'from-amber-500 to-rose-500' },
  ];

  return (
    <section className="w-full flex flex-col gap-6 bg-card/40 backdrop-blur-md transform-gpu border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-amber-400" />
            Interview Simulator Analytics
          </h2>
          <p className="text-sm font-semibold text-muted-foreground mt-1">
            Performance metrics, AI candidate feedback, and mock hiring evaluation
          </p>
        </div>

        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-2xl text-xs font-bold text-purple-300 self-start sm:self-auto">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span>Interviews Completed: <strong className="text-white font-black text-sm">{interviewsTaken}</strong></span>
        </div>
      </div>

      {/* Main Grid: Left Recommendation Banner, Right 4 Domain Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Overall Hiring Recommendation Card */}
        <div className="lg:col-span-5 bg-background/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Mock Hiring Recommendation
              </span>
              <span className={`inline-block mt-2 px-3 py-1 rounded-xl border text-base font-black uppercase tracking-wider ${recBadge}`}>
                {recommendation}
              </span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-400 shrink-0">
              <span className="text-2xl font-black">{averageScore}</span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">Avg Score</span>
            </div>
          </div>

          <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
            {recDesc}
          </p>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold">
            <span className="text-muted-foreground">System Evaluator</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Award className="w-4 h-4" /> AlgoVis Interview Engine
            </span>
          </div>
        </div>

        {/* Right: 4 Domain Score Gauges */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {domains.map((dom, idx) => {
            const Icon = dom.icon;
            return (
              <div
                key={idx}
                className="bg-background/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{dom.label}</span>
                  </div>
                  <span className="text-lg font-black text-foreground">{dom.score}%</span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-white/5 border border-white/10 overflow-hidden p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dom.score}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${dom.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
