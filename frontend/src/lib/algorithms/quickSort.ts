import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

export function quickSort(initialArray: VisualElement[]): VisualizationFrame[] {
  const elements: VisualElement[] = initialArray.map((el) => ({ ...el, state: 'normal' }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const overallGoal = 'Pick a pivot, move smaller elements to its left, larger elements to its right, and recursively sort both sides.';

  pushFrame(
    { type: 'INIT', explanation: 'Starting Quick Sort' },
    { goal: overallGoal, action: 'Initialize array', why: 'Starting the sorting process.', result: 'Ready to sort' }
  );

  const partition = (low: number, high: number): number => {
    const pivot = elements[high];
    pivot.state = 'selected';
    pushFrame(
      { type: 'PIVOT', explanation: `Pivot selected: ${pivot.value}` },
      { goal: `Partition sub-array [${low}..${high}]`, action: `Select ${pivot.value} as pivot`, why: `We use the last element in the range as our pivot to divide the array into two halves.`, result: `Pivot is ${pivot.value}.` }
    );

    let i = low - 1;

    for (let j = low; j < high; j++) {
      elements[j].state = 'comparing';
      pushFrame(
        { type: 'COMPARE', explanation: `Comparing ${elements[j].value} with pivot ${pivot.value}` },
        { goal: `Group elements by size relative to pivot`, action: `Compare ${elements[j].value} and ${pivot.value}`, why: `We need to find if this element belongs on the left side (smaller) or right side (larger) of the pivot.`, result: `Determining placement.` }
      );

      if (elements[j].value < pivot.value) {
        i++;
        if (i !== j) {
          elements[i].state = 'swapping';
          elements[j].state = 'swapping';
          pushFrame(
            { type: 'SWAP', explanation: `${elements[j].value} < ${pivot.value}. Swapping into smaller region.` },
            { goal: `Move smaller elements to the left`, action: `Swap ${elements[i].value} and ${elements[j].value}`, why: `${elements[j].value} is smaller than the pivot, so we swap it to the left side of the partition.`, result: `Elements swapped.` }
          );

          const temp = elements[i];
          elements[i] = elements[j];
          elements[j] = temp;

          pushFrame(
            { type: 'SWAP', explanation: `Swap complete.` },
            { goal: `Finish swap`, action: `Complete swap`, why: `The left region has grown to include ${elements[i].value}.`, result: `Pointers advanced.` }
          );
        } else {
          pushFrame(
            { type: 'PARTITION', explanation: `${elements[j].value} is already in the left region.` },
            { goal: `Keep smaller element on the left`, action: `Leave ${elements[j].value} in place`, why: `${elements[j].value} is smaller than the pivot and is already in the correct region.`, result: `No swap needed.` }
          );
        }
        elements[i].state = 'normal';
      } else {
        pushFrame(
          { type: 'NO_SWAP', explanation: `${elements[j].value} >= ${pivot.value}. Belongs on the right.` },
          { goal: `Keep larger elements on the right`, action: `Leave ${elements[j].value} in place`, why: `${elements[j].value} is greater than or equal to the pivot, so it stays on the right side.`, result: `No swap needed.` }
        );
      }
      elements[j].state = 'normal';
    }

    elements[i + 1].state = 'swapping';
    elements[high].state = 'swapping';
    pushFrame(
      { type: 'PARTITION', explanation: `Placing pivot ${pivot.value} in final position.` },
      { goal: `Place pivot in its correct sorted position`, action: `Swap pivot ${pivot.value} into index ${i + 1}`, why: `All smaller elements are to the left, so index ${i + 1} is the pivot's true sorted position.`, result: `Pivot placed.` }
    );

    const temp = elements[i + 1];
    elements[i + 1] = elements[high];
    elements[high] = temp;

    elements[i + 1].state = 'sorted';
    if (high !== i + 1) elements[high].state = 'normal';

    pushFrame(
      { type: 'PASS_COMPLETE', explanation: `Partition complete. Pivot is locked.` },
      { goal: `Finish partitioning`, action: `Lock ${pivot.value} at index ${i + 1}`, why: `The pivot is now correctly placed. Elements to the left are smaller, elements to the right are larger.`, result: `Pivot is sorted.` }
    );

    return i + 1;
  };

  const sort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      pushFrame(
        { type: 'DIVIDE', explanation: `Recursively sorting left and right sub-arrays.` },
        { goal: `Sort the remaining unsorted sections`, action: `Divide around pivot index ${pi}`, why: `The pivot is in the correct place, now we must repeat the process for the left and right halves.`, result: `Ready to recurse.` }
      );
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high && low >= 0 && low < elements.length) {
      elements[low].state = 'sorted';
      pushFrame(
        { type: 'PASS_COMPLETE', explanation: `Single element is trivially sorted.` },
        { goal: `Base case reached`, action: `Mark index ${low} as sorted`, why: `A sub-array of length 1 is already sorted.`, result: `Index ${low} is sorted.` }
      );
    }
  };

  if (elements.length > 0) sort(0, elements.length - 1);

  for (const el of elements) el.state = 'sorted';
  pushFrame(
    { type: 'COMPLETE', explanation: 'Array is sorted.' },
    { goal: 'Finish sorting', action: 'Algorithm complete', why: 'All recursive partitions have been completed.', result: 'All elements sorted.' }
  );

  return frames;
}
