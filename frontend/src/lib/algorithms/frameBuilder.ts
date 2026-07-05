import type {
  AlgorithmEvent,
  VisualElement,
  VisualizationFrame,
  EducationalContext,
} from '../../types/visualizer';

export function createFrameBuilder(elements: VisualElement[]) {
  const frames: VisualizationFrame[] = [];

  const pushFrame = (event: AlgorithmEvent, context?: Partial<EducationalContext>) => {
    frames.push({
      elements: elements.map((el) => ({ ...el })),
      event,
      description: event.explanation,
      context: context as EducationalContext | undefined,
    });
  };

  return { frames, pushFrame };
}
