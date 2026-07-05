import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

export function heapSort(initialArray: VisualElement[]): VisualizationFrame[] {
  const elements: VisualElement[] = initialArray.map((el) => ({ ...el, state: 'normal' }));
  const { frames, pushFrame } = createFrameBuilder(elements);
  const n = elements.length;

  const overallGoal = 'Build a max-heap, then repeatedly extract the largest element to build a sorted array from the end.';

  pushFrame(
    { type: 'INIT', explanation: 'Starting Heap Sort' },
    { goal: overallGoal, action: 'Initialize array', why: 'Starting the sorting process.', result: 'Ready to sort' }
  );

  const heapify = (size: number, root: number, context: string) => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      elements[root].state = 'comparing';
      elements[left].state = 'comparing';
      pushFrame(
        { type: 'COMPARE', explanation: `${context}: Comparing parent ${elements[root].value} with left child ${elements[left].value}.` },
        { goal: `Maintain max-heap property`, action: `Compare parent ${elements[root].value} and left child ${elements[left].value}`, why: `In a max-heap, a parent node must be larger than both of its children.`, result: `Checking if swap is needed.` }
      );
      if (elements[left].value > elements[largest].value) largest = left;
    }

    if (right < size) {
      elements[largest].state = 'comparing';
      elements[right].state = 'comparing';
      pushFrame(
        { type: 'COMPARE', explanation: `${context}: Comparing current largest ${elements[largest].value} with right child ${elements[right].value}.` },
        { goal: `Find the largest element among parent and children`, action: `Compare ${elements[largest].value} and right child ${elements[right].value}`, why: `We must identify the absolute largest value between the parent and both children.`, result: `Largest value identified.` }
      );
      if (elements[right].value > elements[largest].value) largest = right;
    }

    if (largest !== root) {
      elements[root].state = 'swapping';
      elements[largest].state = 'swapping';
      pushFrame(
        { type: 'HEAPIFY', explanation: `Child ${elements[largest].value} is larger than parent ${elements[root].value}. Swapping.` },
        { goal: `Restore max-heap property`, action: `Swap ${elements[root].value} and ${elements[largest].value}`, why: `The parent was smaller than one of its children, violating the max-heap rule.`, result: `Elements swapped.` }
      );

      const temp = elements[root];
      elements[root] = elements[largest];
      elements[largest] = temp;

      pushFrame(
        { type: 'HEAPIFY', explanation: `Swap complete. Continuing to heapify down.` },
        { goal: `Ensure the affected subtree remains a max-heap`, action: `Recurse downward`, why: `Swapping might have disturbed the max-heap property lower down in the tree.`, result: `Ready to check children.` }
      );

      elements[root].state = 'normal';
      elements[largest].state = 'normal';
      heapify(size, largest, context);
    } else {
      elements[root].state = 'normal';
      if (left < size) elements[left].state = 'normal';
      if (right < size) elements[right].state = 'normal';
      pushFrame(
        { type: 'HEAPIFY', explanation: `Heap property satisfied at index ${root}.` },
        { goal: `Verify max-heap property`, action: `Leave elements in place`, why: `The parent is larger than both children, so the max-heap property is satisfied here.`, result: `No swaps needed.` }
      );
    }
  };

  pushFrame(
    { type: 'HEAPIFY', explanation: 'Building the initial max-heap.' },
    { goal: `Transform the entire array into a max-heap`, action: `Start heap construction`, why: `We must first organize the array into a valid max-heap before we can extract sorted elements.`, result: `Ready to heapify.` }
  );

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    pushFrame(
      { type: 'HEAPIFY', explanation: `Heapifying subtree rooted at index ${i}` },
      { goal: `Ensure subtree ${i} is a max-heap`, action: `Heapify from index ${i}`, why: `We process nodes from bottom to top to build the complete max-heap.`, result: `Heapifying.` }
    );
    heapify(n, i, 'Build phase');
  }

  pushFrame(
    { type: 'PASS_COMPLETE', explanation: 'Max-heap construction complete.' },
    { goal: `Finish building the heap`, action: `Heap construction complete`, why: `The entire array now satisfies the max-heap property. The largest element is at the root (index 0).`, result: `Ready for extraction phase.` }
  );

  for (let i = n - 1; i > 0; i--) {
    elements[0].state = 'swapping';
    elements[i].state = 'swapping';
    pushFrame(
      { type: 'EXTRACT', explanation: `Extracting maximum ${elements[0].value} and moving it to the end (index ${i}).` },
      { goal: `Sort the largest remaining element`, action: `Swap root ${elements[0].value} with last element ${elements[i].value}`, why: `The root of a max-heap is always the largest element. We swap it to the end to place it in its final sorted position.`, result: `Maximum extracted.` }
    );

    const temp = elements[0];
    elements[0] = elements[i];
    elements[i] = temp;

    elements[i].state = 'sorted';
    pushFrame(
      { type: 'EXTRACT', explanation: `${elements[i].value} is now in its final sorted position.` },
      { goal: `Lock sorted element`, action: `Mark index ${i} as sorted`, why: `The element is in its final position. The heap size is reduced.`, result: `Index ${i} sorted.` }
    );

    pushFrame(
      { type: 'HEAPIFY', explanation: `Re-heapifying the remaining elements.` },
      { goal: `Restore max-heap property for the remaining elements`, action: `Heapify from root`, why: `The new root element might be small, violating the max-heap property. It needs to bubble down.`, result: `Heapifying.` }
    );
    heapify(i, 0, 'Extract phase');
  }

  if (n > 0) elements[0].state = 'sorted';
  pushFrame(
    { type: 'COMPLETE', explanation: 'Array is sorted.' },
    { goal: 'Finish sorting', action: 'Algorithm complete', why: 'All elements have been extracted from the heap and placed in their final sorted positions.', result: 'All elements sorted.' }
  );

  return frames;
}
