import { useState, useMemo, useEffect } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { useSimulation } from '../../hooks/useSimulation';
import { generateElements } from '../../lib/utils';
import { EngineRenderer } from '../../components/visualizer/EngineRenderer';
import { SideControls } from '../../components/visualizer/SideControls';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { ExplanationPanel } from '../../components/visualizer/ExplanationPanel';
import { GitBranch, Settings2 } from 'lucide-react';
import type { VisualizationFrame } from '../../types/visualizer';

export const WhatIfSimulator = () => {
  const { speed, mode } = useVisualizerStore();
  const [initialElements, setInitialElements] = useState(() => generateElements(15, 'random'));
  const [datasetType, setDatasetType] = useState('random');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setInitialElements(generateElements(15, datasetType as any));
  }, [datasetType]);

  // Custom Bubble Sort generator that supports Ascending/Descending
  const frames = useMemo(() => {
    const arr = [...initialElements.map(e => ({ ...e, state: e.state as any }))];
    const f: VisualizationFrame[] = [];
    
    f.push({ elements: [...arr], event: { type: 'INIT', explanation: `Starting Bubble Sort (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})` }});

    for (let i = 0; i < arr.length - 1; i++) {
      let swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        arr[j].state = 'comparing';
        arr[j+1].state = 'comparing';
        f.push({ elements: arr.map(e => ({...e})), event: { type: 'COMPARE', explanation: `Comparing ${arr[j].value} and ${arr[j+1].value}` }});

        const condition = sortOrder === 'asc' ? arr[j].value > arr[j+1].value : arr[j].value < arr[j+1].value;

        if (condition) {
          arr[j].state = 'swapping';
          arr[j+1].state = 'swapping';
          f.push({ elements: arr.map(e => ({...e})), event: { type: 'SWAP', explanation: `Swapping because they are in the wrong order for ${sortOrder === 'asc' ? 'ascending' : 'descending'} sort` }});
          
          const temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
          swapped = true;
        }
        arr[j].state = 'normal';
        arr[j+1].state = 'normal';
      }
      arr[arr.length - 1 - i].state = 'sorted';
      if (!swapped) break;
    }
    arr.forEach(e => e.state = 'sorted');
    f.push({ elements: [...arr], event: { type: 'COMPLETE', explanation: 'Array is sorted!' }});
    
    return f;
  }, [initialElements, sortOrder]);

  const simulation = useSimulation(frames, speed, mode);

  const navLinks = [
    { id: 'whatif', label: 'What-If Simulator', icon: <GitBranch className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">What-If Simulator</h1>
        <p className="text-muted-foreground text-xl max-w-3xl">Change core algorithm rules or inputs and instantly observe the consequences on execution.</p>
      </header>

      <div className="flex flex-col gap-10">
        
        {/* Controls Grid */}
        <div className="w-full bg-card border border-border p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          
          <div className="flex-1 flex flex-col gap-4">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" /> Modify Algorithm Rule
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => { setSortOrder('asc'); simulation.reset(); }}
                className={`py-4 px-4 rounded-xl font-black border-2 transition-all shadow-sm ${sortOrder === 'asc' ? 'bg-primary text-primary-foreground border-primary scale-105' : 'bg-background border-border text-foreground hover:border-primary/50'}`}
              >
                Sort Ascending
              </button>
              <button 
                onClick={() => { setSortOrder('desc'); simulation.reset(); }}
                className={`py-4 px-4 rounded-xl font-black border-2 transition-all shadow-sm ${sortOrder === 'desc' ? 'bg-primary text-primary-foreground border-primary scale-105' : 'bg-background border-border text-foreground hover:border-primary/50'}`}
              >
                Sort Descending
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Modify Initial State</label>
            <select 
              value={datasetType} 
              onChange={(e) => { setDatasetType(e.target.value); simulation.reset(); }}
              className="w-full bg-background border border-border rounded-xl p-4 outline-none focus:border-primary transition-colors font-bold text-lg shadow-sm"
            >
              <option value="random">Random Input</option>
              <option value="reverse-sorted">Reverse Sorted Array</option>
              <option value="nearly-sorted">Nearly Sorted Array</option>
            </select>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="w-full bg-card rounded-[2rem] border border-border shadow-2xl overflow-hidden flex flex-col relative min-h-[500px]">
          <div className="flex-1 w-full flex flex-col items-center justify-center p-8 relative bg-gradient-to-b from-transparent to-background/50">
            <div className="flex-1 w-full flex items-center justify-center min-h-[400px] z-10">
              <EngineRenderer algorithm="bubble" frame={simulation.currentFrame} initialElements={initialElements} />
            </div>
            <div className="w-full max-w-4xl mx-auto mt-8 z-20">
              <SideControls simulation={simulation} algorithm="bubble" />
            </div>
          </div>
        </div>

        <div className="w-full mt-4">
          <ExplanationPanel 
            frame={simulation.currentFrame} 
            currentIndex={simulation.currentIndex} 
            totalFrames={simulation.totalFrames} 
          />
        </div>
      </div>
    </WorkspaceLayout>
  );
};
