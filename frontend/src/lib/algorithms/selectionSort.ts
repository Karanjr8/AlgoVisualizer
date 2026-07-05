import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

export function selectionSort(initialArray: VisualElement[]): VisualizationFrame[] {
  const elements: VisualElement[] = initialArray.map((el) => ({ ...el, state: 'normal' }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const goal = 'Find the smallest unsorted element and move it to the end of the sorted prefix.';

  pushFrame(
    { type: 'INIT', explanation: 'Starting Selection Sort' },
    { goal, action: 'Initialize array', why: 'Starting the sorting process.', result: 'Ready to sort' }
  );

  for (let i = 0; i < elements.length; i++) {
    let minIdx = i;

    elements[minIdx].state = 'selected';
    pushFrame(
      { type: 'SELECT', explanation: `Starting pass at index ${i}` },
      { goal, action: `Assume index ${i} is the minimum`, why: `We need a starting point to compare against the rest of the unsorted array.`, result: `Current minimum is ${elements[minIdx].value}.` }
    );

    for (let j = i + 1; j < elements.length; j++) {
      elements[j].state = 'comparing';
      pushFrame(
        { type: 'COMPARE', explanation: `Comparing current minimum ${elements[minIdx].value} with ${elements[j].value}.` },
        { goal, action: `Compare ${elements[minIdx].value} and ${elements[j].value}`, why: `Selection Sort scans the unsorted portion to find the absolute smallest value.`, result: `Determining if a new minimum is found.` }
      );

      if (elements[j].value < elements[minIdx].value) {
        if (minIdx !== i) elements[minIdx].state = 'normal';
        minIdx = j;
        elements[minIdx].state = 'selected';
        pushFrame(
          { type: 'SELECT', explanation: `New minimum found: ${elements[minIdx].value}` },
          { goal, action: `Update minimum to ${elements[minIdx].value}`, why: `${elements[minIdx].value} is smaller than the previous minimum.`, result: `Index ${minIdx} is the new minimum.` }
        );
      } else {
        elements[j].state = 'normal';
        pushFrame(
          { type: 'NO_SWAP', explanation: `Not smaller.` },
          { goal, action: `Ignore ${elements[j].value}`, why: `${elements[j].value} is not smaller than ${elements[minIdx].value}.`, result: `Minimum remains ${elements[minIdx].value}.` }
        );
      }
    }

    if (minIdx !== i) {
      elements[i].state = 'swapping';
      elements[minIdx].state = 'swapping';
      pushFrame(
        { type: 'SWAP', explanation: `Swapping ${elements[minIdx].value} and ${elements[i].value}` },
        { goal, action: `Swap ${elements[minIdx].value} into the sorted prefix`, why: `We found the smallest unsorted element. It belongs at index ${i}.`, result: `Elements swapped.` }
      );

      const temp = elements[i];
      elements[i] = elements[minIdx];
      elements[minIdx] = temp;

      pushFrame(
        { type: 'SWAP', explanation: `Swap complete.` },
        { goal, action: `Finish swap`, why: `The element is now in its final sorted position.`, result: `${elements[i].value} is now at index ${i}.` }
      );
      elements[minIdx].state = 'normal';
    } else {
      pushFrame(
        { type: 'NO_SWAP', explanation: `Already minimum.` },
        { goal, action: `Keep ${elements[i].value} in place`, why: `${elements[i].value} was already the smallest unsorted element.`, result: `No swap needed.` }
      );
    }

    elements[i].state = 'sorted';
    pushFrame(
      { type: 'PASS_COMPLETE', explanation: `Pass complete.` },
      { goal: 'Lock the minimum in place', action: `Mark index ${i} as sorted`, why: `The first ${i + 1} elements now form a fully sorted prefix.`, result: `Index ${i} is sorted.` }
    );
  }

  pushFrame(
    { type: 'COMPLETE', explanation: 'Array is sorted.' },
    { goal: 'Finish sorting', action: 'Algorithm complete', why: 'Every element has been placed in its final sorted position.', result: 'All elements sorted.' }
  );

  return frames;
}
