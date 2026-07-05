import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

export function bubbleSort(initialArray: VisualElement[]): VisualizationFrame[] {
  const elements: VisualElement[] = initialArray.map((el) => ({ ...el, state: 'normal' }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const goal = 'Move the largest unsorted element to the end of the array.';

  pushFrame(
    { type: 'INIT', explanation: 'Starting Bubble Sort' },
    { goal, action: 'Initialize array', why: 'Starting the sorting process.', result: 'Ready to sort' }
  );

  for (let pass = 0; pass < elements.length - 1; pass++) {
    let swappedInPass = false;

    for (let j = 0; j < elements.length - pass - 1; j++) {
      const left = elements[j];
      const right = elements[j + 1];

      left.state = 'comparing';
      right.state = 'comparing';
      pushFrame(
        { type: 'COMPARE', explanation: `Comparing ${left.value} and ${right.value}` },
        { goal, action: `Compare ${left.value} and ${right.value}`, why: 'Bubble Sort checks adjacent elements to see if they are out of order.', result: 'Determining if a swap is needed.' }
      );

      if (left.value > right.value) {
        left.state = 'swapping';
        right.state = 'swapping';
        pushFrame(
          { type: 'SWAP', explanation: `Swapping ${left.value} and ${right.value}` },
          { goal, action: `Swap ${left.value} and ${right.value}`, why: `${left.value} is greater than ${right.value}, so they are out of order.`, result: 'Elements swapped.' }
        );

        const temp = elements[j];
        elements[j] = elements[j + 1];
        elements[j + 1] = temp;
        swappedInPass = true;

        pushFrame(
          { type: 'SWAP', explanation: `Swap complete.` },
          { goal, action: 'Finish swap', why: 'The larger element is now correctly on the right.', result: `${elements[j+1].value} is now ahead of ${elements[j].value}.` }
        );
      } else {
        pushFrame(
          { type: 'NO_SWAP', explanation: `No swap needed.` },
          { goal, action: `Keep ${left.value} and ${right.value} in place`, why: `${left.value} is less than or equal to ${right.value}. They are in the correct order.`, result: 'No changes made.' }
        );
      }

      elements[j].state = 'normal';
      elements[j + 1].state = 'normal';
    }

    const sortedIndex = elements.length - pass - 1;
    elements[sortedIndex].state = 'sorted';
    pushFrame(
      { type: 'PASS_COMPLETE', explanation: `Pass complete.` },
      { goal: 'Lock the largest element in place', action: `Mark index ${sortedIndex} as sorted`, why: `The largest value in the unsorted portion (${elements[sortedIndex].value}) has bubbled to the end.`, result: `Index ${sortedIndex} is sorted.` }
    );

    if (!swappedInPass) break;
  }

  for (const el of elements) el.state = 'sorted';
  pushFrame(
    { type: 'COMPLETE', explanation: 'Array is sorted.' },
    { goal: 'Finish sorting', action: 'Algorithm complete', why: 'No swaps were made in the last pass, or all passes finished. The array is fully sorted.', result: 'All elements sorted.' }
  );

  return frames;
}
