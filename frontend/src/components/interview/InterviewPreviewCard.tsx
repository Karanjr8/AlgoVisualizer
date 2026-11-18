import { Sparkles, Bot, Clock, Briefcase, Gauge, Layers, CheckCircle2, Zap } from 'lucide-react';
import { ROLES } from './RoleCardGroup';
import { STYLES } from './InterviewStyleCardGroup';

interface InterviewPreviewCardProps {
  selectedRole: string;
  selectedDifficulty: string;
  selectedTopics: string[];
  selectedStyle: string;
  enabledFeaturesCount: number;
  timeLimitPerQuestion?: number;
}

export const InterviewPreviewCard = ({
  selectedRole,
  selectedDifficulty,
  selectedTopics,
  selectedStyle,
  enabledFeaturesCount,
  timeLimitPerQuestion = 0,
}: InterviewPreviewCardProps) => {
  const roleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[0];
  const styleObj = STYLES.find((s) => s.id === selectedStyle) || STYLES[0];

  // Difficulty badge colors
  const difficultyColor =
    selectedDifficulty === 'Easy'
      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      : selectedDifficulty === 'Hard'
      ? 'text-rose-500 bg-rose-500/10 border-rose-500/20'
      : 'text-amber-500 bg-amber-500/10 border-amber-500/20';

  return (
    <div className="w-full bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Session Summary</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold">
          Configured
        </span>
      </div>

      {/* Synchronized Configuration Rows */}
      <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> Role
          </span>
          <span className="font-bold text-foreground text-right">{roleObj.name}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-muted-foreground" /> Difficulty
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${difficultyColor}`}>
            {selectedDifficulty}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Style & Duration
          </span>
          <div className="text-right flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{styleObj.name}</span>
            <span className="text-[10px] text-muted-foreground font-medium">({styleObj.duration})</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-muted-foreground" /> Timer Mode
          </span>
          <span className="font-semibold text-foreground">
            {timeLimitPerQuestion > 0 ? (
              <span className="text-amber-500 font-bold">{timeLimitPerQuestion}s / Question</span>
            ) : (
              <span className="text-muted-foreground">Untimed</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-muted-foreground" /> Selected Topics
          </span>
          <span className="font-semibold text-foreground">
            {selectedTopics.length === 0 ? (
              <span className="text-muted-foreground italic">None (Random)</span>
            ) : (
              `${selectedTopics.length} Topics`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-muted-foreground" /> AI Modules
          </span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            {enabledFeaturesCount} Active
          </span>
        </div>
      </div>
    </div>
  );
};
