import { useState, useCallback, memo } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { Play, Pause, StepForward, StepBack, RotateCcw, Dices } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';
import { generateElements, parseCustomInput, cn } from '../../lib/utils';
import type { AlgorithmType } from '../../types/visualizer';

interface SideControlsProps {
  simulation: ReturnType<typeof useSimulation>;
  algorithm: AlgorithmType;
}

export const SideControls = memo(({ simulation }: SideControlsProps) => {
  const { speed, setSpeed, setInitialElements, setDatasetType } = useVisualizerStore();
  const { isPlaying, play, pause, nextStep, prevStep, currentIndex, totalFrames, reset } = simulation;
  
  const [selectedSize, setSelectedSize] = useState<number>(7);
  const [customInput, setCustomInput] = useState('');
  const [error, setError] = useState('');

  const handleRandomize = useCallback((size: number = selectedSize) => {
    reset();
    setSelectedSize(size);
    setDatasetType('random');
    setInitialElements(generateElements(size, 'random'));
    setCustomInput('');
    setError('');
  }, [reset, setDatasetType, setInitialElements, selectedSize]);

  const handleCustomSubmit = useCallback(() => {
    const parsed = parseCustomInput(customInput);
    if (!parsed) {
      setError('Invalid input.');
      return;
    }
    if (parsed.length > 30) {
      setError('Max 30 items.');
      return;
    }
    setError('');
    reset();
    setDatasetType('custom');
    setInitialElements(generateElements(parsed.length, 'custom', parsed));
  }, [customInput, reset, setDatasetType, setInitialElements]);

  // Speed multiplier logic: 1000ms delay = 1.0x. 
  // Min speed (2000ms delay) = 0.5x
  // Max speed (200ms delay) = 5.0x
  const speedMultiplier = (1000 / speed).toFixed(1);

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-2 sm:p-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        
        {/* Left: Dataset Size & Custom Input */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Dataset Size Presets */}
          <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-xl border border-border">
            <button
              onClick={() => handleRandomize(7)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                selectedSize === 7 ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Small Dataset (7 items - Learning Mode)"
            >
              Small (7)
            </button>
            <button
              onClick={() => handleRandomize(12)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                selectedSize === 12 ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Medium Dataset (12 items)"
            >
              Med (12)
            </button>
            <button
              onClick={() => handleRandomize(18)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                selectedSize === 18 ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Large Dataset (18 items)"
            >
              Large (18)
            </button>
          </div>

          <button
            onClick={() => handleRandomize(selectedSize)}
            className="p-2 bg-secondary text-secondary-foreground rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-1.5 transition-colors shadow-sm"
            title="Randomize Values"
          >
            <Dices className="w-4 h-4" />
          </button>
          
          <div className="flex bg-background border border-border rounded-xl overflow-hidden flex-1 md:w-44 focus-within:border-primary transition-colors shadow-sm">
            <input
              type="text"
              placeholder="Custom e.g. 5, 2, 8"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
              className="w-full px-2.5 py-1.5 text-xs focus:outline-none bg-transparent placeholder:text-muted-foreground/50"
            />
            <button
              onClick={handleCustomSubmit}
              className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-colors"
            >
              Load
            </button>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-1 w-full md:w-auto">
          <button
            onClick={reset}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={prevStep}
            disabled={isPlaying || currentIndex === 0}
            className="p-2 text-foreground hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent rounded-full transition-colors"
          >
            <StepBack className="w-4 h-4" />
          </button>

          <button
            onClick={isPlaying ? pause : play}
            disabled={totalFrames === 0 || currentIndex >= totalFrames - 1}
            className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
          </button>

          <button
            onClick={nextStep}
            disabled={isPlaying || currentIndex >= totalFrames - 1}
            className="p-2 text-foreground hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent rounded-full transition-colors"
          >
            <StepForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Info & Speed */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          
          {/* Step Badge */}
          <div className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap border border-border/50 shadow-sm">
            Step {totalFrames > 0 ? Math.min(currentIndex + 1, totalFrames) : 0} / {totalFrames}
          </div>

          {/* Speed Slider */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-muted-foreground w-8 text-right tabular-nums">
              {speedMultiplier}x
            </span>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={2200 - speed}
              onChange={(e) => setSpeed(2200 - Number(e.target.value))}
              className="w-20 sm:w-24 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

        </div>
      </div>
      {error && <p className="text-destructive text-xs font-medium px-2 text-center md:text-left">{error}</p>}
    </div>
  );
});

SideControls.displayName = 'SideControls';

