import type { VisualElement, VisualizationFrame } from '../../types/visualizer';

export function generateGenericHeapFrames(title: string): VisualizationFrame[] {
  const defaultArr = [50, 30, 40, 10, 20, 35, 15];
  const elements: VisualElement[] = defaultArr.map((v, i) => ({
    id: `heap-el-${i}`,
    value: v,
    state: i === 0 ? 'selected' : 'normal'
  }));

  return [
    {
      elements,
      event: {
        type: 'INIT',
        explanation: `${title}: Initial Binary Heap state with Root element ${defaultArr[0]} at index 0.`
      }
    },
    {
      elements: elements.map((e, i) => i === 0 ? { ...e, state: 'comparing' } : e),
      event: {
        type: 'COMPARE',
        explanation: `Checking Root element ${defaultArr[0]} vs children at index 1 and index 2.`
      }
    },
    {
      elements: elements.map((e) => ({ ...e, state: 'sorted' })),
      event: {
        type: 'COMPLETE',
        explanation: `${title}: Heap property verified across all levels.`
      }
    }
  ];
}
