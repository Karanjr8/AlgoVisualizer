import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Code2, Video, Map, Brain, BarChart2 } from 'lucide-react';

interface LearningOverviewSectionProps {
  algorithmsCompleted: number;
  practiceProblemsSolved: number;
  interviewSimulationsTaken: number;
  roadmapCompletion: number;
  visualizationsExplored: number;
  averageQuizScore: number;
}

// Custom animated counter hook
function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

interface MetricCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: any;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  delay?: number;
}

const MetricCard = ({
  title,
  value,
  suffix = '',
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  delay = 0,
}: MetricCardProps) => {
  const animatedValue = useCountUp(value, 1200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-card/40 backdrop-blur-md transform-gpu border border-white/10 rounded-2xl p-5 shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${bgColor} ${borderColor} border ${iconColor} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          {animatedValue}
        </span>
        {suffix && <span className="text-lg font-bold text-primary">{suffix}</span>}
      </div>
    </motion.div>
  );
};

export const LearningOverviewSection = ({
  algorithmsCompleted,
  practiceProblemsSolved,
  interviewSimulationsTaken,
  roadmapCompletion,
  visualizationsExplored,
  averageQuizScore,
}: LearningOverviewSectionProps) => {
  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-foreground flex items-center gap-2.5">
          <BarChart2 className="w-6 h-6 text-primary" />
          Learning & Performance Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Algorithms Completed"
          value={algorithmsCompleted}
          icon={CheckCircle}
          iconColor="text-emerald-400"
          bgColor="bg-emerald-500/10"
          borderColor="border-emerald-500/20"
          delay={0.05}
        />

        <MetricCard
          title="Practice Solved"
          value={practiceProblemsSolved}
          icon={Code2}
          iconColor="text-purple-400"
          bgColor="bg-purple-500/10"
          borderColor="border-purple-500/20"
          delay={0.1}
        />

        <MetricCard
          title="Interview Sims"
          value={interviewSimulationsTaken}
          icon={Brain}
          iconColor="text-amber-400"
          bgColor="bg-amber-500/10"
          borderColor="border-amber-500/20"
          delay={0.15}
        />

        <MetricCard
          title="Roadmap Completion"
          value={roadmapCompletion}
          suffix="%"
          icon={Map}
          iconColor="text-blue-400"
          bgColor="bg-blue-500/10"
          borderColor="border-blue-500/20"
          delay={0.2}
        />

        <MetricCard
          title="Visualizations"
          value={visualizationsExplored}
          icon={Video}
          iconColor="text-cyan-400"
          bgColor="bg-cyan-500/10"
          borderColor="border-cyan-500/20"
          delay={0.25}
        />

        <MetricCard
          title="Avg Quiz Score"
          value={averageQuizScore}
          suffix="%"
          icon={BarChart2}
          iconColor="text-rose-400"
          bgColor="bg-rose-500/10"
          borderColor="border-rose-500/20"
          delay={0.3}
        />
      </div>
    </section>
  );
};
