import { EducationalContext } from '../../types/visualizer';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { CheckCircle2, Circle, ArrowRightCircle } from 'lucide-react';

interface Props {
  context: EducationalContext | undefined;
}

export const PassTracker = ({ context }: Props) => {
  const { mode, setMode } = useVisualizerStore();
  
  if (!context) return null;

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm mb-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h2 className="text-2xl font-bold">{context.phaseName}</h2>
            <div className="text-muted-foreground mt-1">Goal: {context.goal}</div>
         </div>
         <div className="flex gap-1.5 bg-muted p-1.5 rounded-xl border self-stretch md:self-auto">
            <button 
              onClick={() => setMode('intuition')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'intuition' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Intuition Mode
            </button>
            <button 
              onClick={() => setMode('execution')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'execution' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Execution Mode
            </button>
         </div>
      </div>

      <div className="space-y-2">
         <div className="flex justify-between text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Overall Progress</span>
            <span>{context.overallProgress}%</span>
         </div>
         <div className="w-full bg-muted rounded-full h-3 overflow-hidden border">
            <div 
              className="bg-primary h-full transition-all duration-500 ease-out relative" 
              style={{ width: `${context.overallProgress}%` }}
            >
               <div className="absolute inset-0 bg-foreground/20 w-full animate-pulse" />
            </div>
         </div>
      </div>
      
      {context.totalPasses > 1 && (
        <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
           {Array.from({ length: context.totalPasses }).map((_, i) => {
              const passNum = i + 1;
              const isCompleted = passNum < context.currentPass || context.overallProgress === 100;
              const isCurrent = passNum === context.currentPass && context.overallProgress < 100;
              
              return (
                 <div key={passNum} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                    isCompleted ? 'bg-viz-sorted/10 border-viz-sorted/30 text-viz-sorted' :
                    isCurrent ? 'bg-primary/10 border-primary/30 text-primary' :
                    'bg-muted border-transparent text-muted-foreground'
                 }`}>
                   {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? <ArrowRightCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                   Pass {passNum}
                 </div>
              );
           })}
        </div>
      )}
    </div>
  );
};
