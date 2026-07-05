import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

function markSearchRange(
  elements: VisualElement[],
  low: number,
  high: number,
  mid: number,
) {
  for (let i = 0; i < elements.length; i++) {
    // Clear previous labels
    elements[i].label = undefined;

    if (i === mid) {
      elements[i].state = 'selected';
      // If L, M, and R are the same, label it "L,M,R"
      if (low === mid && high === mid) elements[i].label = 'L,M,R';
      else if (low === mid) elements[i].label = 'L,M';
      else if (high === mid) elements[i].label = 'M,R';
      else elements[i].label = 'M';
    } else if (i === low) {
      elements[i].state = 'comparing';
      elements[i].label = 'L';
    } else if (i === high) {
      elements[i].state = 'comparing';
      elements[i].label = 'R';
    } else if (i > low && i < high) {
      elements[i].state = 'comparing';
    } else {
      elements[i].state = 'out-of-range';
    }
  }
}

function clearSearchStates(elements: VisualElement[]) {
  for (const el of elements) {
    if (el.state !== 'found' && el.state !== 'sorted') el.state = 'normal';
  }
}

export function binarySearch(
  initialArray: VisualElement[],
  target: number,
): VisualizationFrame[] {
  const elements: VisualElement[] = [...initialArray]
    .sort((a, b) => a.value - b.value)
    .map((el) => ({ ...el, state: 'sorted' as const }));

  const { frames, pushFrame } = createFrameBuilder(elements);
  const overallGoal = `Find target ${target} by repeatedly dividing the sorted search space in half.`;

  pushFrame(
    { type: 'INIT', explanation: `Binary Search requires a sorted array. Searching for target ${target}.` },
    { goal: overallGoal, action: 'Initialize search space', why: 'Binary Search depends on order. We start with the full array as our search space.', result: 'Ready to search.' }
  );

  let low = 0;
  let high = elements.length - 1;
  let step = 0;

  while (low <= high) {
    step++;
    const mid = Math.floor((low + high) / 2);
    markSearchRange(elements, low, high, mid);

    pushFrame(
      { type: 'SEARCH', explanation: `Step ${step}: Searching range [${low}..${high}]. Mid index is ${mid}.` },
      { goal: `Find the midpoint of the current search space`, action: `Calculate mid = Math.floor((${low} + ${high}) / 2) = ${mid}`, why: `We pick the middle element to eliminate half of the remaining possibilities.`, result: `Midpoint value is ${elements[mid].value}.` }
    );

    pushFrame(
      { type: 'COMPARE', explanation: `Comparing mid value ${elements[mid].value} with target ${target}.` },
      { goal: `Check if we found the target`, action: `Compare ${elements[mid].value} and ${target}`, why: `If the middle element matches, we are done. If not, we will know which half to search next.`, result: `Checking equality.` }
    );

    if (elements[mid].value === target) {
      elements[mid].state = 'found';
      for (let i = 0; i < elements.length; i++) {
        if (i !== mid) elements[i].state = 'out-of-range';
      }
      pushFrame(
        { type: 'FOUND', explanation: `Target ${target} found at index ${mid}!` },
        { goal: `Search complete`, action: `Return index ${mid}`, why: `The middle element matches our target. Binary Search terminates.`, result: `Target found.` }
      );
      pushFrame(
        { type: 'COMPLETE', explanation: `Search complete in ${step} step(s).` },
        { goal: `Finish search`, action: `Return result`, why: `Target located successfully.`, result: `Search successful.` }
      );
      return frames;
    }

    if (elements[mid].value < target) {
      pushFrame(
        { type: 'SEARCH', explanation: `${elements[mid].value} < ${target}. Target must be in the right half.` },
        { goal: `Eliminate the left half`, action: `Update low = ${mid} + 1 = ${mid + 1}`, why: `Because the array is sorted, all elements to the left of mid are also less than the target.`, result: `Left half discarded.` }
      );
      low = mid + 1;
    } else {
      pushFrame(
        { type: 'SEARCH', explanation: `${elements[mid].value} > ${target}. Target must be in the left half.` },
        { goal: `Eliminate the right half`, action: `Update high = ${mid} - 1 = ${mid - 1}`, why: `Because the array is sorted, all elements to the right of mid are also greater than the target.`, result: `Right half discarded.` }
      );
      high = mid - 1;
    }

    clearSearchStates(elements);
    for (const el of elements) {
      if (el.state === 'normal') el.state = 'sorted';
    }
  }

  for (const el of elements) el.state = 'sorted';
  pushFrame(
    { type: 'COMPLETE', explanation: `Target ${target} is not in the array.` },
    { goal: `Search complete`, action: `Return not found`, why: `The search space [low..high] has become empty (low > high). The target does not exist.`, result: `Target not found.` }
  );

  return frames;
}
