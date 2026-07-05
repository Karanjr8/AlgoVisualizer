import { EducationalContext } from '../../types/visualizer';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { Lightbulb, Info } from 'lucide-react';

interface Props {
  context: EducationalContext | undefined;
}

export const EducationalPanel = ({ context }: Props) => {
  const mode = useVisualizerStore(state => state.mode);
  
  if (!context) return null;

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm mt-8 animate-in fade-in duration-300">
       <div className="flex items-center gap-2 mb-4">
         <Lightbulb className="w-5 h-5 text-primary" />
         <h3 className="text-xl font-bold">What's happening?</h3>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-muted p-5 rounded-xl border border-border/50 flex flex-col justify-center">
           <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
             <Info className="w-4 h-4" /> Current Action
           </div>
           <div className="text-lg font-medium">{context.action || 'Idle'}</div>
           
           {context.result && (
             <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in">
               <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Result</div>
               <div className="text-md text-green-600 dark:text-green-400 font-medium">{context.result}</div>
             </div>
           )}
         </div>

         <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl flex flex-col justify-center">
           <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
              Why?
           </div>
           <div className="text-md leading-relaxed">{context.why || 'Watching the algorithm...'}</div>
         </div>
       </div>
       
       {mode === 'intuition' && !context.isMilestone && context.overallProgress < 100 && (
         <div className="mt-4 text-center text-sm text-muted-foreground italic animate-pulse">
            Simulating until the next milestone...
         </div>
       )}
    </div>
  );
};
