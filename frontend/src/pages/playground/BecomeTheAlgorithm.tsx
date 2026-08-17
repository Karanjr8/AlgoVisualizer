import { useState } from 'react';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { Gamepad2, RotateCcw, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { generateElements } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const BecomeTheAlgorithm = () => {
  const [elements, setElements] = useState(() => generateElements(10, 'random'));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' }>({ message: 'Select two adjacent elements to swap if they are out of order.', type: 'info' });
  const [sortedCount, setSortedCount] = useState(0);

  const reset = () => {
    setElements(generateElements(10, 'random'));
    setSelectedIdx(null);
    setFeedback({ message: 'Select two adjacent elements to swap if they are out of order.', type: 'info' });
    setSortedCount(0);
  };

  const handleElementClick = (idx: number) => {
    if (idx >= elements.length - sortedCount) {
      setFeedback({ message: "That element is already in its final sorted position!", type: 'error' });
      return;
    }

    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      if (selectedIdx === idx) {
        setSelectedIdx(null);
        return;
      }
      
      // Attempting a swap
      if (Math.abs(selectedIdx - idx) !== 1) {
        setFeedback({ message: "In Bubble Sort, you can only swap adjacent elements!", type: 'error' });
        setSelectedIdx(null);
        return;
      }

      const leftIdx = Math.min(selectedIdx, idx);
      const rightIdx = Math.max(selectedIdx, idx);

      if (elements[leftIdx].value <= elements[rightIdx].value) {
        setFeedback({ message: "Those elements are already in order. No need to swap!", type: 'error' });
        setSelectedIdx(null);
        return;
      }

      // Valid swap
      const newElements = [...elements];
      const temp = newElements[leftIdx];
      newElements[leftIdx] = newElements[rightIdx];
      newElements[rightIdx] = temp;
      
      setElements(newElements);
      setSelectedIdx(null);
      setFeedback({ message: "Good job! Correct swap.", type: 'success' });
    }
  };

  const markPassComplete = () => {
    // Check if the current largest in the unsorted portion is at the end of the unsorted portion
    let maxFound = -1;
    let maxIdx = -1;
    const unsortedEnd = elements.length - sortedCount - 1;
    
    for (let i = 0; i <= unsortedEnd; i++) {
      if (elements[i].value > maxFound) {
        maxFound = elements[i].value;
        maxIdx = i;
      }
    }

    if (maxIdx === unsortedEnd) {
      setSortedCount(prev => prev + 1);
      setFeedback({ message: `Pass complete! The element ${maxFound} is locked in place.`, type: 'success' });
    } else {
      setFeedback({ message: "You haven't bubbled the largest element to the end of the unsorted portion yet!", type: 'error' });
    }
  };

  const navLinks = [
    { id: 'become', label: 'Become the Algorithm', icon: <Gamepad2 className="w-4 h-4" /> },
  ];

  const maxVal = Math.max(...elements.map(e => e.value), 100);

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Become the Algorithm</h1>
        <p className="text-muted-foreground text-xl max-w-3xl">Perform Bubble Sort manually. No score. Only learning. Click elements to swap them!</p>
      </header>

      <div className="flex flex-col gap-10">
        
        {/* Top Controls & Feedback */}
        <div className="w-full bg-card border border-border p-6 md:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row gap-6 max-w-6xl mx-auto items-center">
          
          <div className="flex-1 w-full">
            <div className={`p-6 rounded-2xl border-2 font-bold text-lg leading-relaxed flex items-center gap-4 shadow-sm transition-colors duration-300
              ${feedback.type === 'error' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                feedback.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
              
              {feedback.type === 'error' && <AlertCircle className="w-8 h-8 shrink-0" />}
              {feedback.type === 'success' && <CheckCircle2 className="w-8 h-8 shrink-0" />}
              {feedback.type === 'info' && <Info className="w-8 h-8 shrink-0" />}
              
              {feedback.message}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button 
              onClick={markPassComplete} 
              className="px-8 py-4 bg-secondary text-secondary-foreground font-black rounded-2xl hover:bg-secondary/80 transition-all shadow-sm active:scale-95"
            >
              End Current Pass
            </button>
            <button 
              onClick={reset} 
              className="px-8 py-4 flex items-center justify-center gap-3 bg-muted text-muted-foreground rounded-2xl font-black hover:bg-muted/80 transition-all shadow-sm active:scale-95"
            >
              <RotateCcw className="w-5 h-5" /> Reset Array
            </button>
          </div>
        </div>

        {/* Array Visualization Area */}
        <div className="w-full bg-card rounded-[2rem] border border-border shadow-2xl p-8 md:p-16 min-h-[500px] flex items-end justify-center gap-3 md:gap-4 overflow-x-auto">
          <AnimatePresence>
            {elements.map((el, idx) => {
              const isSorted = idx >= elements.length - sortedCount;
              const isSelected = selectedIdx === idx;
              const heightPercentage = Math.max((el.value / maxVal) * 100, 8);
              
              let colorClass = "bg-primary/80 group-hover:bg-primary shadow-[0_-5px_15px_rgba(var(--primary),0.1)]";
              if (isSorted) colorClass = "bg-green-500/90 group-hover:bg-green-500 shadow-[0_-5px_15px_rgba(34,197,94,0.3)]";
              if (isSelected) colorClass = "bg-amber-500 shadow-[0_-5px_15px_rgba(245,158,11,0.5)] ring-4 ring-amber-500/50";

              return (
                <motion.div
                  key={el.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={() => handleElementClick(idx)}
                  className="w-16 md:w-20 flex flex-col items-center cursor-pointer group"
                >
                  <div className={`text-base font-black mb-3 transition-colors ${isSelected ? 'text-amber-500 scale-125' : isSorted ? 'text-green-500' : 'text-foreground group-hover:text-primary'}`}>
                    {el.value}
                  </div>
                  <motion.div 
                    layout
                    className={`w-full ${colorClass} rounded-t-lg transition-all border border-background/20 relative`}
                    style={{ height: `${heightPercentage}%`, minHeight: '40px' }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-white/30 rounded-t-lg"></div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </WorkspaceLayout>
  );
};
