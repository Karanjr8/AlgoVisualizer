import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Mic, GitPullRequest, FileSpreadsheet, MessageSquare, Gauge, CheckCircle2, HeartHandshake } from 'lucide-react';

export interface FeatureSetting {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
}

export const INITIAL_FEATURES: FeatureSetting[] = [
  {
    id: 'voice-interview',
    name: 'Voice Interview',
    description: 'Speech recognition & AI voice response',
    icon: Mic,
    enabled: true,
  },
  {
    id: 'followup-questions',
    name: 'Follow-up Questions',
    description: 'Dynamic inquiry based on code decisions',
    icon: GitPullRequest,
    enabled: true,
  },
  {
    id: 'ai-feedback',
    name: 'AI Feedback Report',
    description: 'Diagnostic report with rubric scoring',
    icon: FileSpreadsheet,
    enabled: true,
  },
  {
    id: 'communication-scoring',
    name: 'Communication Scoring',
    description: 'Explanation clarity and structure analysis',
    icon: MessageSquare,
    enabled: true,
  },
  {
    id: 'confidence-analysis',
    name: 'Confidence Analysis',
    description: 'Delivery certainty and reasoning flow',
    icon: Gauge,
    enabled: true,
  },
  {
    id: 'technical-accuracy',
    name: 'Technical Accuracy',
    description: 'Complexity checks and edge case validation',
    icon: CheckCircle2,
    enabled: true,
  },
  {
    id: 'behavioral-evaluation',
    name: 'Behavioral Scoring',
    description: 'STAR framework soft skills assessment',
    icon: HeartHandshake,
    enabled: false,
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
          AI Evaluation Modules
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Toggle automated diagnostic feedback and evaluation features for this session.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {features.map((feat) => {
          const Icon = feat.icon;

          return (
            <div
              key={feat.id}
              onClick={() => onToggleFeature(feat.id)}
              className={cn(
                'flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-150 cursor-pointer group',
                feat.enabled
                  ? 'bg-card border-border/90 hover:border-primary/40'
                  : 'bg-card/60 border-border/60 hover:border-border'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    'p-2 rounded-xl shrink-0 transition-colors',
                    feat.enabled
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-secondary text-muted-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {feat.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium truncate">
                    {feat.description}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                className={cn(
                  'w-9 h-5 rounded-full p-0.5 transition-colors duration-150 cursor-pointer relative shrink-0 outline-none',
                  feat.enabled ? 'bg-primary' : 'bg-muted'
                )}
                aria-label={`Toggle ${feat.name}`}
              >
                <motion.div
                  animate={{ x: feat.enabled ? 16 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-4 h-4 rounded-full bg-white shadow-xs"
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
