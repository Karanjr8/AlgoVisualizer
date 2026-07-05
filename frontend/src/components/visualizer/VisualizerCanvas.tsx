import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { ExplanationPanel } from './ExplanationPanel';
import { ArrayRenderer } from './ArrayRenderer';

interface VisualizerCanvasProps {
  elements: VisualElement[];
  frame: VisualizationFrame | null;
  currentIndex: number;
  totalFrames: number;
}

export const VisualizerCanvas = ({
  elements,
  frame,
  currentIndex,
  totalFrames,
}: VisualizerCanvasProps) => {
  return (
    <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
      <ExplanationPanel
        frame={frame}
        currentIndex={currentIndex}
        totalFrames={totalFrames}
      />
      <ArrayRenderer elements={elements} />
    </div>
  );
};
