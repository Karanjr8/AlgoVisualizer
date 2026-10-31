import type { VisualElement, VisualizationFrame } from '../../types/visualizer';

export function generateGenericHeapFrames(title: string): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const heap = [50, 30, 40, 10, 20, 35, 15];

  const getSnapshot = (currIdx?: number, compIdx?: number, swapIdxs?: [number, number], sortedIdxs: number[] = []): VisualElement[] => {
    return heap.map((val, i) => {
      let state: VisualElement['state'] = 'normal';
      if (sortedIdxs.includes(i)) state = 'sorted';
      else if (swapIdxs && (i === swapIdxs[0] || i === swapIdxs[1])) state = 'swapping';
      else if (i === currIdx) state = 'selected';
      else if (i === compIdx) state = 'comparing';

      return {
        id: `heap-${i}`,
        value: val,
        state,
        label: `i:${i}`
      };
    });
  };

  frames.push({
    elements: getSnapshot(0),
    event: { type: 'INIT', explanation: `${title}: Binary Heap initialized with max element ${heap[0]} at Root (index 0).` }
  });

  // Insert 45
  const newKey = 45;
  heap.push(newKey);
  let curr = heap.length - 1;

  frames.push({
    elements: getSnapshot(curr),
    event: { type: 'INSERT', explanation: `Inserted new value ${newKey} at index ${curr}. Initiating Bubble-Up (Sift-Up) to restore heap property.` }
  });

  while (curr > 0) {
    const parent = Math.floor((curr - 1) / 2);
    frames.push({
      elements: getSnapshot(curr, parent),
      event: { type: 'COMPARE', explanation: `Bubble-Up: Comparing node index ${curr} (${heap[curr]}) with parent index ${parent} (${heap[parent]}).` }
    });

    if (heap[curr] > heap[parent]) {
      const temp = heap[curr];
      heap[curr] = heap[parent];
      heap[parent] = temp;

      frames.push({
        elements: getSnapshot(parent, undefined, [curr, parent]),
        event: { type: 'SWAP', explanation: `Swapped child ${heap[parent]} at index ${curr} with parent ${heap[curr]} at index ${parent}.` }
      });
      curr = parent;
    } else {
      break;
    }
  }

  // Final Complete Frame
  frames.push({
    elements: getSnapshot(undefined, undefined, undefined, [0, 1, 2, 3, 4, 5, 6, 7]),
    event: { type: 'COMPLETE', explanation: `${title}: Heap property restored! Parents strictly satisfy condition parent >= child.` }
  });

  return frames;
}
