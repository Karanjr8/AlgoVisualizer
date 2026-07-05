import { useVisualizerStore } from '../../store/useVisualizerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CodeTabsProps {
  codeData: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
}

export const CodeTabs = ({ codeData }: CodeTabsProps) => {
  const language = useVisualizerStore(state => state.language);
  const setLanguage = useVisualizerStore(state => state.setLanguage);

  const TABS = [
    { id: 'cpp', label: 'C++' },
    { id: 'java', label: 'Java' },
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'JavaScript' }
  ] as const;

  return (
    <div className="w-full bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col">
      {/* Tab Header */}
      <div className="flex items-center overflow-x-auto border-b border-border bg-muted/50 px-4 no-scrollbar">
        {TABS.map(tab => {
          const isActive = language === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setLanguage(tab.id as any)}
              className={cn(
                'relative px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Code Content */}
      <div className="relative p-6 bg-card">
        <AnimatePresence mode="wait">
          <motion.pre
            key={language}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm font-mono text-card-foreground overflow-x-auto whitespace-pre no-scrollbar"
          >
            {codeData[language as keyof typeof codeData]}
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
};
