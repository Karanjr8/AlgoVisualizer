import { motion } from 'framer-motion';
import { Sparkles, Bot, CheckCircle2, Clock } from 'lucide-react';
import { ROLES } from './RoleCardGroup';
import { STYLES } from './InterviewStyleCardGroup';

interface InterviewPreviewCardProps {
  selectedRole: string;
  selectedDifficulty: string;
  selectedTopics: string[];
  selectedStyle: string;
  enabledFeaturesCount: number;
}

export const InterviewPreviewCard = ({
  selectedRole,
  selectedDifficulty,
  selectedTopics,
  selectedStyle,
  enabledFeaturesCount,
}: InterviewPreviewCardProps) => {
  const roleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[1];
  const styleObj = STYLES.find((s) => s.id === selectedStyle) || STYLES[2];

  return (
    <div className="w-full bg-card/80 backdrop-blur-xl border border-border/80 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col gap-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Interview Summary
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
          Configured
        </span>
      </div>

      {/* Concise Key-Value Rows */}
      <div className="flex flex-col gap-3 text-xs sm:text-sm font-medium">
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground font-semibold">Target Role</span>
          <motion.span
            key={selectedRole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-foreground"
          >
            {roleObj.name}
          </motion.span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground font-semibold">Difficulty</span>
          <motion.span
            key={selectedDifficulty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-primary"
          >
            {selectedDifficulty}
          </motion.span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground font-semibold">Style</span>
          <motion.span
            key={selectedStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-foreground truncate max-w-[180px] text-right"
          >
            {styleObj.name}
          </motion.span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground font-semibold">Topics Selected</span>
          <motion.span
            key={selectedTopics.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-foreground"
          >
            {selectedTopics.length} Topics
          </motion.span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-400" /> Est. Duration
          </span>
          <span className="font-bold text-foreground">{styleObj.duration}</span>
        </div>
      </div>

      {/* AI Evaluation Status Badge */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
        <span className="flex items-center gap-1.5">
          <Bot className="w-4 h-4" /> AI Evaluation
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> {enabledFeaturesCount} Active
        </span>
      </div>
    </div>
  );
};
