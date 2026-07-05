import { useVisualizerStore } from '../../store/useVisualizerStore';
import { Play, Pause, RotateCcw, StepForward, StepBack } from 'lucide-react';
import { generateElements } from '../../lib/utils';
import { useSimulation } from '../../hooks/useSimulation';
import { ALGORITHM_REGISTRY } from '../../lib/algorithms';
import type { AlgorithmType } from '../../types/visualizer';

interface PlaygroundControlsProps {
  simulation: ReturnType<typeof useSimulation>;
}

export const PlaygroundControls = ({ simulation }: PlaygroundControlsProps) => {
  const {
    algorithm,
    setAlgorithm,
    speed,
    setSpeed,
    setInitialElements,
    initialElements,
    searchTarget,
    setSearchTarget,
  } = useVisualizerStore();
  const { isPlaying, play, pause, nextStep, prevStep, reset, currentIndex, totalFrames, setCurrentIndex } =
    simulation;

  const handleGenerate = () => {
    reset();
    setInitialElements(generateElements(10));
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-card rounded-xl border shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            className="p-2 rounded-md border bg-background text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
            disabled={isPlaying}
          >
            {(Object.entries(ALGORITHM_REGISTRY) as [AlgorithmType, { label: string }][]).map(
              ([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>

          { (algorithm.includes('search') || ['first-occurrence', 'last-occurrence', 'lower-bound', 'upper-bound', 'floor', 'ceil', 'monotonic-predicate', 'jump-search', 'interpolation-search', 'exponential-search', 'search-sorted-rotated', 'search-on-answer', 'search-insert-position'].includes(algorithm)) && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Target</label>
              <input
                type="number"
                className="w-24 p-2 rounded-md border bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                value={searchTarget ?? ''}
                onChange={(e) => setSearchTarget(Number(e.target.value))}
                disabled={isPlaying}
              />
              <button
                type="button"
                onClick={() => {
                  if (initialElements.length > 0) {
                    setSearchTarget(
                      initialElements[Math.floor(Math.random() * initialElements.length)].value,
                    );
                  }
                }}
                disabled={isPlaying || initialElements.length === 0}
                className="btn btn-secondary text-xs px-2 py-1.5 rounded"
              >
                Random Target
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Speed</label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={1100 - speed}
              onChange={(e) => setSpeed(1100 - Number(e.target.value))}
              className="accent-primary cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isPlaying}
          className="btn btn-secondary px-4 py-2 rounded-md text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Generate Random Array
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <input
          type="range"
          min="0"
          max={Math.max(0, totalFrames - 1)}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
          className="w-full cursor-pointer accent-primary"
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={prevStep}
            disabled={isPlaying || currentIndex === 0}
            className="btn btn-secondary p-3 rounded-full"
          >
            <StepBack className="w-5 h-5" />
          </button>

          <button
            onClick={isPlaying ? pause : play}
            disabled={totalFrames === 0 || currentIndex >= totalFrames - 1}
            className="btn btn-primary w-32 px-6 py-2 font-bold rounded-full"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={nextStep}
            disabled={isPlaying || currentIndex >= totalFrames - 1}
            className="btn btn-secondary p-3 rounded-full"
          >
            <StepForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
