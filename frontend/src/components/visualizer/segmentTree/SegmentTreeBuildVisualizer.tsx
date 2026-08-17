import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { VisualizationFrame } from '../../../types/visualizer';

interface BuildStep {
  stepIndex: number;
  phaseName: string;
  activeNodeId?: string;
  leftChildId?: string;
  rightChildId?: string;
  visibleNodeIds: string[];
  explanation: string;
}

interface TreeNode {
  id: string;
  l: number;
  r: number;
  val: number;
  x: number;
  y: number;
  leftId?: string;
  rightId?: string;
}

interface Props {
  frame?: VisualizationFrame;
}

export const SegmentTreeBuildVisualizer: React.FC<Props> = () => {

  const nodes: TreeNode[] = [
    // Root
    { id: '1', l: 0, r: 5, val: 24, x: 380, y: 50, leftId: '10', rightId: '11' },
    // Level 1
    { id: '10', l: 0, r: 2, val: 8, x: 220, y: 125, leftId: '100', rightId: '101' },
    { id: '11', l: 3, r: 5, val: 16, x: 540, y: 125, leftId: '110', rightId: '111' },
    // Level 2
    { id: '100', l: 0, r: 1, val: 7, x: 140, y: 200, leftId: 'L0', rightId: 'L1' },
    { id: '101', l: 2, r: 2, val: 1, x: 300, y: 200 },
    { id: '110', l: 3, r: 4, val: 13, x: 460, y: 200, leftId: 'L3', rightId: 'L4' },
    { id: '111', l: 5, r: 5, val: 3, x: 620, y: 200 },
    // Leaves
    { id: 'L0', l: 0, r: 0, val: 2, x: 100, y: 275 },
    { id: 'L1', l: 1, r: 1, val: 5, x: 180, y: 275 },
    { id: 'L3', l: 3, r: 3, val: 9, x: 420, y: 275 },
    { id: 'L4', l: 4, r: 4, val: 4, x: 500, y: 275 }
  ];

  const steps: BuildStep[] = [
    {
      stepIndex: 0,
      phaseName: 'Initialization',
      visibleNodeIds: [],
      explanation: 'Array A = [2, 5, 1, 4, 9, 3] initialized. Starting bottom-up Segment Tree construction.'
    },
    {
      stepIndex: 1,
      phaseName: 'Leaf Creation',
      visibleNodeIds: ['L0', 'L1', '101', 'L3', 'L4', '111'],
      explanation: 'Step 1: Leaf nodes created directly from array elements: [0]=2, [1]=5, [2]=1, [3]=9, [4]=4, [5]=3.'
    },
    {
      stepIndex: 2,
      phaseName: 'Parent Merge [0, 1]',
      activeNodeId: '100',
      leftChildId: 'L0',
      rightChildId: 'L1',
      visibleNodeIds: ['L0', 'L1', '101', 'L3', 'L4', '111', '100'],
      explanation: 'Combining left child sum 2 (node [0]) and right child sum 5 (node [1]) to form parent node [0,1] with sum 7.'
    },
    {
      stepIndex: 3,
      phaseName: 'Parent Merge [3, 4]',
      activeNodeId: '110',
      leftChildId: 'L3',
      rightChildId: 'L4',
      visibleNodeIds: ['L0', 'L1', '101', 'L3', 'L4', '111', '100', '110'],
      explanation: 'Combining left child sum 9 (node [3]) and right child sum 4 (node [4]) to form parent node [3,4] with sum 13.'
    },
    {
      stepIndex: 4,
      phaseName: 'Subtree Merge [0, 2]',
      activeNodeId: '10',
      leftChildId: '100',
      rightChildId: '101',
      visibleNodeIds: ['L0', 'L1', '101', 'L3', 'L4', '111', '100', '110', '10'],
      explanation: 'Combining left child sum 7 (node [0,1]) and right child sum 1 (node [2]) to form parent node [0,2] with sum 8.'
    },
    {
      stepIndex: 5,
      phaseName: 'Subtree Merge [3, 5]',
      activeNodeId: '11',
      leftChildId: '110',
      rightChildId: '111',
      visibleNodeIds: ['L0', 'L1', '101', 'L3', 'L4', '111', '100', '110', '10', '11'],
      explanation: 'Combining left child sum 13 (node [3,4]) and right child sum 3 (node [5]) to form parent node [3,5] with sum 16.'
    },
    {
      stepIndex: 6,
      phaseName: 'Root Construction [0, 5]',
      activeNodeId: '1',
      leftChildId: '10',
      rightChildId: '11',
      visibleNodeIds: ['L0', 'L1', '101', 'L3', 'L4', '111', '100', '110', '10', '11', '1'],
      explanation: 'Combining left root sum 8 (node [0,2]) and right root sum 16 (node [3,5]) to construct Root node [0,5] with sum 24.'
    }
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentStep = steps[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  React.useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      
      {/* Controls Bar */}
      <div className="w-full bg-card/90 border border-border rounded-2xl p-4 backdrop-blur-md shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isPlaying ? 'Pause' : 'Play Build'}
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-xl bg-background border border-border text-foreground hover:bg-accent disabled:opacity-40 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIdx === steps.length - 1}
            className="p-2 rounded-xl bg-background border border-border text-foreground hover:bg-accent disabled:opacity-40 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-muted-foreground">Build Step:</span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
            {currentStepIdx + 1} / {steps.length} — {currentStep.phaseName}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full bg-card rounded-3xl border border-border shadow-2xl p-4 sm:p-6 overflow-x-auto min-h-[380px] flex flex-col items-center justify-center relative">
        <div className="relative w-[760px] h-[300px]">
          
          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map(n => {
              if (!currentStep.visibleNodeIds.includes(n.id)) return null;

              const leftChild = nodes.find(c => c.id === n.leftId);
              const rightChild = nodes.find(c => c.id === n.rightId);

              const lines = [];
              if (leftChild && currentStep.visibleNodeIds.includes(leftChild.id)) {
                lines.push(
                  <line
                    key={`${n.id}-${leftChild.id}`}
                    x1={n.x}
                    y1={n.y}
                    x2={leftChild.x}
                    y2={leftChild.y}
                    stroke="currentColor"
                    strokeWidth={n.id === currentStep.activeNodeId ? "3" : "2"}
                    className={n.id === currentStep.activeNodeId ? "text-amber-400" : "text-border/70"}
                  />
                );
              }
              if (rightChild && currentStep.visibleNodeIds.includes(rightChild.id)) {
                lines.push(
                  <line
                    key={`${n.id}-${rightChild.id}`}
                    x1={n.x}
                    y1={n.y}
                    x2={rightChild.x}
                    y2={rightChild.y}
                    stroke="currentColor"
                    strokeWidth={n.id === currentStep.activeNodeId ? "3" : "2"}
                    className={n.id === currentStep.activeNodeId ? "text-amber-400" : "text-border/70"}
                  />
                );
              }
              return lines;
            })}
          </svg>

          {/* Node Elements */}
          {nodes.map(n => {
            const isVisible = currentStep.visibleNodeIds.includes(n.id);
            if (!isVisible) return null;

            const isActive = currentStep.activeNodeId === n.id;
            const isLeft = currentStep.leftChildId === n.id;
            const isRight = currentStep.rightChildId === n.id;

            let style = 'bg-background/90 border-border text-foreground';
            if (isActive) style = 'bg-amber-500/25 border-amber-500 text-amber-300 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20';
            else if (isLeft) style = 'bg-blue-500/25 border-blue-500 text-blue-300 ring-2 ring-blue-500/40';
            else if (isRight) style = 'bg-purple-500/25 border-purple-500 text-purple-300 ring-2 ring-purple-500/40';

            return (
              <motion.div
                key={n.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ left: n.x - 44, top: n.y - 20 }}
                className={`absolute w-22 h-10 rounded-2xl border-2 backdrop-blur-md flex flex-col items-center justify-center font-mono ${style}`}
              >
                <span className="text-[9px] font-bold text-muted-foreground">[{n.l},{n.r}]</span>
                <span className="text-xs font-black">Sum={n.val}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Live Step Explanation */}
      <div className="w-full bg-background/80 border border-border rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-md flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Step Explanation</span>
          <p className="text-sm text-foreground leading-relaxed font-medium">{currentStep.explanation}</p>
        </div>
      </div>

    </div>
  );
};
