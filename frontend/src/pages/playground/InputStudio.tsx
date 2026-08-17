import { useState } from 'react';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { PenTool, Shuffle, ArrowDownUp, Copy, Save, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { useNavigate } from 'react-router-dom';
import { generateElements } from '../../lib/utils';

export const InputStudio = () => {
  const [array, setArray] = useState<number[]>([50, 20, 80, 10, 90, 30, 70, 40, 60]);
  const [inputValue, setInputValue] = useState('');
  const setInitialElements = useVisualizerStore(state => state.setInitialElements);
  const navigate = useNavigate();

  const handleUpdate = (index: number, val: number) => {
    const newArr = [...array];
    newArr[index] = val;
    setArray(newArr);
  };

  const addValue = () => {
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && array.length < 20) {
      setArray([...array, val]);
      setInputValue('');
    }
  };

  const removeValue = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const handleShuffle = () => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    setArray(newArr);
  };

  const handleReverse = () => {
    setArray([...array].reverse());
  };

  const handleDuplicate = () => {
    if (array.length < 20 && array.length > 0) {
      setArray([...array, array[array.length - 1]]);
    }
  };

  const handleExportToLab = () => {
    setInitialElements(generateElements(array.length, 'custom', array));
    navigate('/playground/algorithm-lab');
  };

  const maxVal = Math.max(...array, 100);

  const navLinks = [
    { id: 'input', label: 'Input Studio', icon: <PenTool className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Input Studio</h1>
        <p className="text-muted-foreground text-xl max-w-3xl">Visually construct and manipulate custom datasets. Build your own array visually, then send it to the lab.</p>
      </header>

      <div className="flex flex-col gap-10">
        
        {/* Top Controls */}
        <div className="w-full bg-card border border-border p-6 md:p-8 rounded-3xl shadow-lg flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
          
          <div className="flex-1 flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Add Element (Max 20)</label>
            <div className="flex gap-2">
              <input 
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value (1-100)"
                onKeyDown={(e) => e.key === 'Enter' && addValue()}
                className="flex-1 bg-background border border-border rounded-xl p-4 outline-none focus:border-primary font-bold text-base shadow-sm"
              />
              <button 
                onClick={addValue} 
                className="px-6 bg-primary text-primary-foreground rounded-xl font-black shadow-md hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add
              </button>
            </div>
          </div>

          <div className="flex-[2] flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Transformations</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={handleShuffle} className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground p-4 rounded-xl font-bold hover:bg-secondary/80 transition-colors shadow-sm">
                <Shuffle className="w-5 h-5" /> Shuffle
              </button>
              <button onClick={handleReverse} className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground p-4 rounded-xl font-bold hover:bg-secondary/80 transition-colors shadow-sm">
                <ArrowDownUp className="w-5 h-5" /> Reverse
              </button>
              <button onClick={handleDuplicate} className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground p-4 rounded-xl font-bold hover:bg-secondary/80 transition-colors shadow-sm">
                <Copy className="w-5 h-5" /> Duplicate
              </button>
              <button onClick={handleExportToLab} className="flex items-center justify-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 p-4 rounded-xl font-black hover:bg-green-500/20 transition-all shadow-sm group">
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> Send to Lab
              </button>
            </div>
          </div>
        </div>

        {/* Visual Array Editor */}
        <div className="w-full bg-card rounded-[2rem] border border-border shadow-2xl p-8 md:p-12 min-h-[500px] flex flex-col">
          
          <div className="flex-1 flex items-end justify-center gap-3 md:gap-4 mb-12 border-b-2 border-border/50 pb-8 min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {array.map((val, i) => {
                const heightPercentage = Math.max((val / maxVal) * 100, 5);
                return (
                  <motion.div 
                    key={`${i}-${val}`} // ensures animation on value change or index change
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-12 md:w-16 flex flex-col items-center group relative cursor-pointer"
                    onClick={() => removeValue(i)}
                  >
                    <div className="opacity-0 group-hover:opacity-100 text-xs font-black text-destructive mb-3 absolute -top-8 transition-opacity bg-background px-2 py-1 rounded shadow-sm border border-destructive/20">
                      Remove
                    </div>
                    <motion.div 
                      layout
                      className="w-full bg-primary/80 group-hover:bg-primary rounded-t-lg transition-colors shadow-[0_-4px_10px_rgba(var(--primary),0.1)] relative"
                      style={{ height: `${heightPercentage}%`, minHeight: '30px' }}
                    >
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-white/30 rounded-t-lg"></div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {array.length === 0 && (
              <div className="text-muted-foreground font-medium text-lg pb-10 flex-1 text-center">
                Your array is empty. Add elements above!
              </div>
            )}
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-3 max-h-64 overflow-y-auto p-2 custom-scrollbar">
            <AnimatePresence>
              {array.map((val, i) => (
                <motion.div
                  key={`input-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <span className="absolute -top-2 -left-2 w-5 h-5 bg-muted text-[10px] font-bold flex items-center justify-center rounded-full text-muted-foreground z-10 border border-border">
                    {i}
                  </span>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => handleUpdate(i, parseInt(e.target.value) || 0)}
                    className="w-full bg-background border border-border rounded-xl p-3 text-center text-lg font-black outline-none focus:border-primary shadow-sm hover:border-primary/50 transition-colors"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};
