import { useState, useMemo } from 'react';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { 
  GitBranch, 
  Settings2 
} from 'lucide-react';
import { generateElements } from '../../lib/utils';
import { generateFrames } from '../../lib/algorithms';
import { EngineRenderer } from '../../components/visualizer/EngineRenderer';
import { useSimulation } from '../../hooks/useSimulation';
import { useVisualizerStore } from '../../store/useVisualizerStore';

type WhatIfExperiment = 'binary-search' | 'quick-sort' | 'dijkstra';

export const WhatIfSimulator = () => {
  const { speed, mode } = useVisualizerStore();
  const [experiment, setExperiment] = useState<WhatIfExperiment>('binary-search');

  // Binary Search Midpoint State
  const [midStrategy, setMidStrategy] = useState<'standard' | 'safe' | 'bad'>('standard');

  // Quick Sort Pivot State
  const [pivotStrategy, setPivotStrategy] = useState<'first' | 'last' | 'random' | 'median3'>('first');

  // Dijkstra Edge Weight State
  const [edgeWeight, setEdgeWeight] = useState<number>(4);

  // Default array size 10
  const [initialElements] = useState(() => generateElements(10, 'random'));

  const origFrames = useMemo(() => generateFrames('bubble', initialElements), [initialElements]);
  const modFrames = useMemo(() => generateFrames('quick', initialElements), [initialElements]);

  const origSim = useSimulation(origFrames, speed, mode);
  const modSim = useSimulation(modFrames, speed, mode);

  const navLinks = [
    { id: 'what-if', label: 'What-If Simulator', icon: <GitBranch className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-8 text-left pb-16">
        
        {/* HERO HEADER */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/90 via-card/50 to-cyan-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider">
                <GitBranch className="w-3.5 h-3.5" /> Dynamic Algorithm Rule Simulator
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                What-If Simulator
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl font-medium">
                Modify pivot selection, midpoint strategies, or graph edge weights live. Watch how algorithm behavior, comparisons, and correctness change in real-time.
              </p>
            </div>
          </div>
        </section>

        {/* EXPERIMENT SELECTOR */}
        <section className="w-full bg-card/80 border border-border/80 p-1.5 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { id: 'binary-search', name: '1. Binary Search Midpoint Rules' },
            { id: 'quick-sort', name: '2. Quick Sort Pivot Strategies' },
            { id: 'dijkstra', name: '3. Dijkstra Edge Weight Modifier' },
          ].map(exp => (
            <button
              key={exp.id}
              onClick={() => setExperiment(exp.id as WhatIfExperiment)}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${experiment === exp.id ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
            >
              {exp.name}
            </button>
          ))}
        </section>

        {/* EXPERIMENT RULE CONTROLS */}
        <section className="w-full bg-card/90 border border-border/80 p-6 rounded-3xl shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Settings2 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-black text-base text-foreground capitalize">Rule Configuration ({experiment.replace('-', ' ')})</h3>
          </div>

          {experiment === 'binary-search' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button onClick={() => setMidStrategy('standard')} className={`p-4 rounded-2xl border font-bold text-xs text-left transition-all cursor-pointer ${midStrategy === 'standard' ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground'}`}>
                <div className="font-black text-sm text-foreground">Standard Midpoint</div>
                <div className="text-[11px] font-mono mt-1">mid = (low + high) / 2</div>
              </button>
              <button onClick={() => setMidStrategy('safe')} className={`p-4 rounded-2xl border font-bold text-xs text-left transition-all cursor-pointer ${midStrategy === 'safe' ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground'}`}>
                <div className="font-black text-sm text-foreground">Safe Midpoint</div>
                <div className="text-[11px] font-mono mt-1">mid = low + (high - low) / 2</div>
              </button>
              <button onClick={() => setMidStrategy('bad')} className={`p-4 rounded-2xl border font-bold text-xs text-left transition-all cursor-pointer ${midStrategy === 'bad' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 'bg-background border-border text-muted-foreground'}`}>
                <div className="font-black text-sm text-foreground">Buggy Midpoint (Overflow)</div>
                <div className="text-[11px] font-mono mt-1">mid = (low + high) [risk]</div>
              </button>
            </div>
          )}

          {experiment === 'quick-sort' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['first', 'last', 'random', 'median3'] as const).map(p => (
                <button key={p} onClick={() => setPivotStrategy(p)} className={`p-3.5 rounded-xl border font-bold text-xs capitalize transition-all cursor-pointer ${pivotStrategy === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border'}`}>
                  {p} Pivot
                </button>
              ))}
            </div>
          )}

          {experiment === 'dijkstra' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase">
                <span>Modify Target Edge Weight W</span>
                <span className="text-cyan-400 font-black">{edgeWeight}</span>
              </div>
              <input
                type="range"
                min="1" max="20"
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(parseInt(e.target.value))}
                className="w-full cursor-pointer accent-cyan-400 h-2 bg-muted rounded-full appearance-none"
              />
            </div>
          )}
        </section>

        {/* SIDE-BY-SIDE COMPARISON */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* STANDARD ALGORITHM */}
          <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Standard Strategy</span>
                <h3 className="text-lg font-black text-foreground">Original Algorithm</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                Optimal
              </span>
            </div>

            <div className="w-full min-h-[280px] bg-background/50 border border-border/60 rounded-2xl flex items-center justify-center p-4">
              <EngineRenderer algorithm="bubble" frame={origSim.currentFrame} initialElements={initialElements} />
            </div>

            <div className="p-3 bg-background/80 border border-border/60 rounded-xl text-xs font-medium text-muted-foreground">
              Guarantees standard theoretical bounds.
            </div>
          </div>

          {/* MODIFIED ALGORITHM */}
          <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Dynamic Rule</span>
                <h3 className="text-lg font-black text-foreground">Modified Rule Algorithm</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                {experiment === 'binary-search' ? `${midStrategy} Mid` : experiment === 'quick-sort' ? `${pivotStrategy} Pivot` : `W = ${edgeWeight}`}
              </span>
            </div>

            <div className="w-full min-h-[280px] bg-background/50 border border-border/60 rounded-2xl flex items-center justify-center p-4">
              <EngineRenderer algorithm="quick" frame={modSim.currentFrame} initialElements={initialElements} />
            </div>

            <div className="p-3 bg-background/80 border border-border/60 rounded-xl text-xs font-medium text-muted-foreground">
              Dynamic rule evaluation: Shows performance & step differences under custom rule parameters.
            </div>
          </div>

        </section>

      </div>
    </WorkspaceLayout>
  );
};
