import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

export function insertionSort(initialArray: VisualElement[]): VisualizationFrame[] {
  const elements: VisualElement[] = initialArray.map((el) => ({ ...el, state: 'normal' }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const goal = 'Grow a sorted prefix on the left by inserting one element at a time into its correct position.';

  pushFrame(
    { type: 'INIT', explanation: 'Starting Insertion Sort' },
    { goal, action: 'Initialize array', why: 'Starting the sorting process.', result: 'Ready to sort' }
  );

  if (elements.length > 0) {
    elements[0].state = 'sorted';
    pushFrame(
      { type: 'INSERT', explanation: `The first element (${elements[0].value}) is trivially sorted.` },
      { goal, action: `Mark index 0 as sorted`, why: `A single element by itself is inherently sorted.`, result: `Sorted portion starts at index 0.` }
    );
  }

  for (let i = 1; i < elements.length; i++) {
    let j = i;
    const key = elements[j].value;

    elements[j].state = 'selected';
    pushFrame(
      { type: 'INSERT', explanation: `Picking up ${key} at index ${i}` },
      { goal, action: `Select ${key} to insert`, why: `We need to find where ${key} belongs in the sorted prefix (indices 0 to ${i - 1}).`, result: `Ready to slide ${key} left.` }
    );

    while (j > 0 && elements[j - 1].value > key) {
      elements[j - 1].state = 'comparing';
      elements[j].state = 'swapping';
      pushFrame(
        { type: 'COMPARE', explanation: `Comparing ${elements[j - 1].value} with ${key}.` },
        { goal, action: `Compare ${elements[j - 1].value} and ${key}`, why: `Insertion Sort shifts larger values to the right to make room for smaller values.`, result: `Determining if a shift is needed.` }
      );

      pushFrame(
        { type: 'SWAP', explanation: `Shifting ${elements[j - 1].value} to the right.` },
        { goal, action: `Shift ${elements[j - 1].value} right`, why: `${elements[j - 1].value} is greater than ${key}, so it must move right.`, result: `Room created for ${key}.` }
      );

      const temp = elements[j];
      elements[j] = elements[j - 1];
      elements[j - 1] = temp;
      j--;

      elements[j].state = 'selected';
      pushFrame(
        { type: 'INSERT', explanation: `${key} continues sliding left.` },
        { goal, action: `Slide ${key} left to index ${j}`, why: `We shifted the larger value, moving ${key} closer to its final spot.`, result: `${key} is now at index ${j}.` }
      );
    }

    if (j < i) {
      pushFrame(
        { type: 'INSERT', explanation: `${key} has found its place at index ${j}.` },
        { goal, action: `Drop ${key} into position`, why: `The element to the left is smaller or we reached the start of the array.`, result: `${key} is correctly inserted.` }
      );
    } else {
      pushFrame(
        { type: 'NO_SWAP', explanation: `${key} is already in the correct position.` },
        { goal, action: `Keep ${key} in place`, why: `${key} is greater than or equal to the largest element in the sorted prefix.`, result: `No shifting needed.` }
      );
    }

    for (let k = 0; k <= i; k++) elements[k].state = 'sorted';
    pushFrame(
      { type: 'PASS_COMPLETE', explanation: `Pass complete.` },
      { goal: 'Lock the newly inserted element', action: `Mark index ${i} as sorted`, why: `The sorted prefix has now grown by one element.`, result: `Indices 0 through ${i} are sorted.` }
    );
  }

  for (const el of elements) el.state = 'sorted';
  pushFrame(
    { type: 'COMPLETE', explanation: 'Array is sorted.' },
    { goal: 'Finish sorting', action: 'Algorithm complete', why: 'Every element was inserted into the sorted prefix.', result: 'All elements sorted.' }
  );

  return frames;
}
