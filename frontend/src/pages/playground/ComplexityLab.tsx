import { useState, useEffect } from 'react';
import { generateElements } from '../../lib/utils';
import { generateFrames } from '../../lib/algorithms';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { Activity, Play } from 'lucide-react';
import type { AlgorithmType } from '../../types/visualizer';
import { motion, AnimatePresence } from 'framer-motion';

interface DataPoint {
  size: number;
  operations: number;
}

export const ComplexityLab = () => {
  const [algo, setAlgo] = useState<AlgorithmType>('bubble');
  const [data, setData] = useState<DataPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setData([]); // reset data
    const sizes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const results: DataPoint[] = [];

    for (const size of sizes) {
      // Yield to main thread to allow React to update UI step-by-step
      await new Promise(resolve => setTimeout(resolve, 50));
      const elements = generateElements(size, 'random');
      const frames = generateFrames(algo, elements);
      
      let ops = 0;
      for (const f of frames) {
        if (f.event.type === 'COMPARE' || f.event.type === 'SWAP' || f.event.type === 'INSERT' || f.event.type === 'PARTITION') {
          ops++;
        }
      }
      
      results.push({ size, operations: ops > 0 ? ops : frames.length });
      setData([...results]);
    }
    
    setIsRunning(false);
  };

  useEffect(() => {
    setData([]);
  }, [algo]);

  const maxOps = Math.max(1, ...data.map(d => d.operations));

  const navLinks = [
    { id: 'complexity', label: 'Complexity Lab', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Complexity Laboratory</h1>
        <p className="text-muted-foreground text-xl max-w-3xl">See how algorithms scale with input size by simulating execution in real-time and mapping operations to dataset size.</p>
      </header>

      <div className="flex flex-col gap-10">
        
        {/* Controls */}
        <div className="w-full bg-card border border-border p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-end gap-6 max-w-4xl mx-auto">
          <div className="w-full md:flex-1 flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Algorithm to Analyze</label>
            <select 
              value={algo} 
              onChange={(e) => setAlgo(e.target.value as AlgorithmType)}
              disabled={isRunning}
              className="w-full bg-background border border-border rounded-xl p-4 outline-none focus:border-primary transition-colors font-bold text-lg disabled:opacity-50"
            >
              <option value="bubble">Bubble Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
            </select>
          </div>
          
          <button 
            onClick={runSimulation}
            disabled={isRunning}
            className="w-full md:w-auto px-10 py-4 bg-primary text-primary-foreground rounded-xl font-black shadow-md hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5" /> {isRunning ? 'Running Simulation...' : 'Start Analysis'}
          </button>
        </div>

        {/* Chart Area */}
        <div className="w-full bg-card rounded-[2rem] border border-border shadow-2xl p-8 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
          
          <div className="absolute top-8 left-8 text-xs font-bold text-muted-foreground uppercase tracking-widest rotate-[-90deg] origin-left -translate-y-full translate-x-4">
            Operations Count
          </div>
          <div className="absolute bottom-4 right-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Dataset Size (N)
          </div>

          <div className="flex-1 flex flex-col justify-end relative pl-12 pb-8 border-l-2 border-b-2 border-border/50">
            {data.length === 0 && !isRunning && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-medium text-lg">
                Select an algorithm and click "Start Analysis" to generate the complexity curve.
              </div>
            )}
            
            <div className="flex items-end justify-between h-[350px] gap-2 md:gap-4 pt-10">
              <AnimatePresence>
                {data.map((d, index) => {
                  const heightPercentage = Math.max((d.operations / maxOps) * 100, 2);
                  return (
                    <motion.div 
                      key={d.size} 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: '100%' }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex-1 flex flex-col items-center justify-end group relative h-full"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold whitespace-nowrap z-10 pointer-events-none">
                        {d.operations.toLocaleString()} ops
                      </div>
                      
                      {/* Bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                        className="w-full max-w-[60px] bg-primary/80 group-hover:bg-primary rounded-t-md transition-colors shadow-[0_-5px_15px_rgba(var(--primary),0.1)] relative"
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/30 rounded-t-md"></div>
                      </motion.div>
                      
                      {/* X-axis Label */}
                      <div className="absolute -bottom-8 text-sm font-black text-muted-foreground w-full text-center">
                        {d.size}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
};
