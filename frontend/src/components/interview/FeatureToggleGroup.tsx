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
    description: 'Voice-to-text & AI voice response',
    icon: Mic,
    enabled: true,
  },
  {
    id: 'followup-questions',
    name: 'Follow-up Questions',
    description: 'Dynamic follow-ups based on code response',
    icon: GitPullRequest,
    enabled: true,
  },
  {
    id: 'ai-feedback',
    name: 'AI Feedback Report',
    description: 'Detailed post-interview diagnostic report',
    icon: FileSpreadsheet,
    enabled: true,
  },
  {
    id: 'communication-scoring',
    name: 'Communication Scoring',
    description: 'Evaluates explanation clarity & structure',
    icon: MessageSquare,
    enabled: true,
  },
  {
    id: 'confidence-analysis',
    name: 'Confidence Analysis',
    description: 'Measures certainty and consistency',
    icon: Gauge,
    enabled: true,
  },
  {
    id: 'technical-accuracy',
    name: 'Technical Accuracy',
    description: 'Validates complexity & code correctness',
    icon: CheckCircle2,
    enabled: true,
  },
  {
    id: 'behavioral-evaluation',
    name: 'Behavioral Scoring',
    description: 'Assesses STAR method soft skills',
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
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          5. AI Features & Evaluation
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          Toggle automated AI scoring and feedback modules.
        </p>
      </div>

      {/* Grid Container */}
      <div className="w-full bg-card/60 border border-border/80 rounded-2xl p-3.5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {features.map((feat) => {
          const Icon = feat.icon;

          return (
            <div
              key={feat.id}
              onClick={() => onToggleFeature(feat.id)}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-background/50 border border-border/50 hover:border-primary/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'p-2.5 rounded-lg shrink-0 transition-colors',
                    feat.enabled ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-secondary border border-border/50 text-muted-foreground'
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {feat.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold truncate">
                    {feat.description}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                className={cn(
                  'w-11 h-6.5 rounded-full p-0.5 transition-colors duration-150 cursor-pointer relative shrink-0 outline-none',
                  feat.enabled ? 'bg-primary' : 'bg-muted'
                )}
              >
                <motion.div
                  animate={{ x: feat.enabled ? 18 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-5.5 h-5.5 rounded-full bg-white shadow-xs"
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
