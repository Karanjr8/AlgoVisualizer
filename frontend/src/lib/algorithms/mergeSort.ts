import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

export function mergeSort(initialArray: VisualElement[]): VisualizationFrame[] {
  const elements: VisualElement[] = initialArray.map((el) => ({ ...el, state: 'normal' }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const overallGoal = 'Recursively divide the array into halves until they are trivially sorted, then merge them back together.';

  pushFrame(
    { type: 'INIT', explanation: 'Starting Merge Sort' },
    { goal: overallGoal, action: 'Initialize array', why: 'Starting the sorting process.', result: 'Ready to sort' }
  );

  const merge = (left: number, mid: number, right: number) => {
    pushFrame(
      { type: 'MERGE', explanation: `Merging sub-arrays [${left}..${mid}] and [${mid + 1}..${right}]` },
      { goal: `Merge sorted halves`, action: `Merge [${left}..${mid}] and [${mid + 1}..${right}]`, why: `The two halves are sorted. We need to combine them into a single sorted segment.`, result: `Ready to compare elements.` }
    );

    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      elements[i].state = 'comparing';
      elements[j].state = 'comparing';
      pushFrame(
        { type: 'COMPARE', explanation: `Comparing left element ${elements[i].value} with right element ${elements[j].value}` },
        { goal: `Pick the smaller element`, action: `Compare ${elements[i].value} and ${elements[j].value}`, why: `Merge sort combines sorted arrays by picking the smallest available element from the front of either half.`, result: `Determining which element goes next.` }
      );

      if (elements[i].value <= elements[j].value) {
        pushFrame(
          { type: 'MERGE', explanation: `${elements[i].value} stays in place.` },
          { goal: `Pick the smaller element`, action: `Keep ${elements[i].value} in place`, why: `${elements[i].value} is smaller or equal, so it's already in the correct merged order.`, result: `Advance left pointer.` }
        );
        elements[i].state = 'normal';
        elements[j].state = 'normal';
        i++;
      } else {
        const moving = elements[j];
        moving.state = 'swapping';
        pushFrame(
          { type: 'MERGE', explanation: `${moving.value} must move before ${elements[i].value}.` },
          { goal: `Insert the smaller element`, action: `Shift elements right to insert ${moving.value}`, why: `${moving.value} from the right half is smaller, so it belongs before the remaining elements of the left half.`, result: `Making room for insertion.` }
        );

        const valueObj = { ...moving };
        for (let k = j; k > i; k--) {
          elements[k] = elements[k - 1];
        }
        elements[i] = valueObj;

        pushFrame(
          { type: 'MERGE', explanation: `${valueObj.value} merged into position.` },
          { goal: `Finish insertion`, action: `Drop ${valueObj.value} at index ${i}`, why: `The shift is complete and the element is in its merged position.`, result: `Pointers updated.` }
        );

        valueObj.state = 'normal';
        i++;
        mid++;
        j++;
      }
    }

    pushFrame(
      { type: 'PASS_COMPLETE', explanation: `Merge step complete.` },
      { goal: `Finish merging halves`, action: `Merge complete for [${left}..${right}]`, why: `One of the halves was fully processed. Any remaining elements in the other half are already in their correct merged positions.`, result: `Sub-array [${left}..${right}] is now fully sorted.` }
    );
  };

  const sort = (left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor(left + (right - left) / 2);
      pushFrame(
        { type: 'DIVIDE', explanation: `Dividing at index ${mid}` },
        { goal: `Break the problem down`, action: `Divide [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}]`, why: `Merge Sort splits the array in half recursively until each sub-array has only 1 element.`, result: `Array divided.` }
      );
      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
    }
  };

  if (elements.length > 0) sort(0, elements.length - 1);

  for (const el of elements) el.state = 'sorted';
  pushFrame(
    { type: 'COMPLETE', explanation: 'Array is sorted.' },
    { goal: 'Finish sorting', action: 'Algorithm complete', why: 'All recursive divisions have been merged back together.', result: 'All elements sorted.' }
  );

  return frames;
}
