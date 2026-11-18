import { cn } from '../../lib/utils';
import {
  Mic,
  GitPullRequest,
  FileSpreadsheet,
  MessageSquare,
  Gauge,
  CheckCircle2,
  HeartHandshake,
  Clock,
} from 'lucide-react';

export interface FeatureSetting {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  comingSoon?: boolean;
}

export const INITIAL_FEATURES: FeatureSetting[] = [
  {
    id: 'voice-interview',
    name: 'Voice Interview',
    description: 'Speech recognition & AI voice interaction',
    icon: Mic,
    enabled: false,
    comingSoon: true,
  },
  {
    id: 'followup-questions',
    name: 'Follow-up Questions',
    description: 'Context-aware probing based on candidate answers',
    icon: GitPullRequest,
    enabled: true,
  },
  {
    id: 'ai-feedback',
    name: 'AI Feedback Report',
    description: 'Comprehensive diagnostic report with rubric scoring',
    icon: FileSpreadsheet,
    enabled: true,
  },
  {
    id: 'communication-scoring',
    name: 'Communication Scoring',
    description: 'Structure, clarity, and articulation analysis',
    icon: MessageSquare,
    enabled: true,
  },
  {
    id: 'confidence-analysis',
    name: 'Confidence Analysis',
    description: 'Reasoning consistency and delivery certainty',
    icon: Gauge,
    enabled: true,
  },
  {
    id: 'technical-accuracy',
    name: 'Technical Accuracy',
    description: 'Fact-checking, complexity analysis & edge-case checks',
    icon: CheckCircle2,
    enabled: true,
  },
  {
    id: 'behavioral-evaluation',
    name: 'Behavioral Scoring',
    description: 'STAR framework evaluation for situational answers',
    icon: HeartHandshake,
    enabled: true,
  },
];

interface FeatureToggleGroupProps {
  features: FeatureSetting[];
  onToggleFeature: (featureId: string) => void;
}

export const FeatureToggleGroup = ({ features, onToggleFeature }: FeatureToggleGroupProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          AI Evaluation & Interaction Modules
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Configure diagnostic evaluation criteria and automated interviewer behaviors.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {features.map((feat) => {
          const Icon = feat.icon;
          const isComingSoon = feat.comingSoon;

          return (
            <div
              key={feat.id}
              onClick={() => {
                if (!isComingSoon) onToggleFeature(feat.id);
              }}
              className={cn(
                'flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-150',
                isComingSoon
                  ? 'bg-muted/30 border-border/50 opacity-60 cursor-not-allowed'
                  : feat.enabled
                  ? 'bg-card border-border/90 hover:border-primary/40 cursor-pointer shadow-xs'
                  : 'bg-card/60 border-border/60 hover:border-border cursor-pointer'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    'p-2 rounded-xl shrink-0 transition-colors',
                    isComingSoon
                      ? 'bg-muted text-muted-foreground'
                      : feat.enabled
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground truncate">
                      {feat.name}
                    </span>
                    {isComingSoon && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">
                    {feat.description}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div
                className={cn(
                  'w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 flex items-center',
                  isComingSoon
                    ? 'bg-muted'
                    : feat.enabled
                    ? 'bg-primary'
                    : 'bg-secondary border border-border/80'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full bg-white shadow-xs transition-transform',
                    !isComingSoon && feat.enabled ? 'translate-x-4' : 'translate-x-0'
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
