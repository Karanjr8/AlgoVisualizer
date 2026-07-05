import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

function clearStates(elements: VisualElement[]) {
  for (const el of elements) {
    if (el.state !== 'found' && el.state !== 'sorted') {
      el.state = 'normal';
    }
    el.label = undefined;
  }
}

export function searchRotatedSortedArray(initialArray: VisualElement[], target: number): VisualizationFrame[] {
  // A standard sorted array needs to be rotated first for the visualizer
  let elements = [...initialArray].sort((a, b) => a.value - b.value);
  const pivot = Math.floor(elements.length / 2);
  elements = [...elements.slice(pivot), ...elements.slice(0, pivot)].map(el => ({ ...el, state: 'sorted' as VisualElement['state'] }));

  const { frames, pushFrame } = createFrameBuilder(elements);
  const overallGoal = `Find target ${target} in a rotated sorted array using binary search logic.`;
  
  pushFrame(
    { type: 'INIT', explanation: `Starting search in rotated array for target = ${target}.` },
    { goal: overallGoal, action: `Initialize search bounds`, why: `Even though the array is rotated, at least one half of the array will always be strictly sorted.`, result: `Ready to search.` }
  );

  let low = 0;
  let high = elements.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    elements[low].label = 'L';
    elements[low].state = 'comparing';
    elements[high].label = 'R';
    elements[high].state = 'comparing';
    elements[mid].label = 'M';
    elements[mid].state = 'selected';

    pushFrame(
      { type: 'SEARCH', explanation: `Mid is index ${mid} (value ${elements[mid].value}).` },
      { goal: `Evaluate the midpoint`, action: `Calculate mid = ${mid}`, why: `Standard binary search checks the middle element first.`, result: `Checking if we found the target.` }
    );

    if (elements[mid].value === target) {
      clearStates(elements);
      elements[mid].state = 'found';
      elements[mid].label = 'ANS';
      pushFrame(
        { type: 'FOUND', explanation: `Match found at index ${mid}.` },
        { goal: `Search complete`, action: `Return index ${mid}`, why: `The middle element matches our target.`, result: `Target found.` }
      );
      return frames;
    }

    if (elements[low].value <= elements[mid].value) {
      pushFrame(
        { type: 'SEARCH', explanation: `Left half [L..M] is sorted (${elements[low].value} <= ${elements[mid].value}).` },
        { goal: `Determine which half is properly sorted`, action: `Compare L and M`, why: `We need to find the strictly sorted half so we can definitively check if the target lies within it.`, result: `Left half is sorted.` }
      );
      if (elements[low].value <= target && target < elements[mid].value) {
        pushFrame(
          { type: 'ELIMINATE', explanation: `Target ${target} is within the left sorted half. Discard right half.` },
          { goal: `Narrow the search space`, action: `Move high to ${mid - 1}`, why: `The target falls within the bounds of the sorted left half.`, result: `Right half eliminated.` }
        );
        high = mid - 1;
      } else {
        pushFrame(
          { type: 'ELIMINATE', explanation: `Target ${target} is NOT in the left sorted half. Discard left half.` },
          { goal: `Narrow the search space`, action: `Move low to ${mid + 1}`, why: `The target does not fall within the sorted left half, so it must be in the right half.`, result: `Left half eliminated.` }
        );
        low = mid + 1;
      }
    } else {
      pushFrame(
        { type: 'SEARCH', explanation: `Right half [M..R] is sorted (${elements[mid].value} <= ${elements[high].value}).` },
        { goal: `Determine which half is properly sorted`, action: `Compare M and R`, why: `The left half is not strictly sorted, meaning the rotation pivot is there. Thus, the right half must be strictly sorted.`, result: `Right half is sorted.` }
      );
      if (elements[mid].value < target && target <= elements[high].value) {
        pushFrame(
          { type: 'ELIMINATE', explanation: `Target ${target} is within the right sorted half. Discard left half.` },
          { goal: `Narrow the search space`, action: `Move low to ${mid + 1}`, why: `The target falls within the bounds of the sorted right half.`, result: `Left half eliminated.` }
        );
        low = mid + 1;
      } else {
        pushFrame(
          { type: 'ELIMINATE', explanation: `Target ${target} is NOT in the right sorted half. Discard right half.` },
          { goal: `Narrow the search space`, action: `Move high to ${mid - 1}`, why: `The target does not fall within the sorted right half, so it must be in the left half.`, result: `Right half eliminated.` }
        );
        high = mid - 1;
      }
    }
    clearStates(elements);
  }

  pushFrame(
    { type: 'COMPLETE', explanation: `Target ${target} not found.` },
    { goal: `Search complete`, action: `Return not found`, why: `The search space was exhausted.`, result: `Target not found.` }
  );
  return frames;
}

export function searchOnAnswer(initialArray: VisualElement[], target: number): VisualizationFrame[] {
  // Simulate searching on an answer space [1..N]
  const elements = Array.from({ length: 15 }, (_, i) => ({
    id: `ans-${i}`,
    value: i + 1,
    state: 'sorted' as VisualElement['state'],
    label: undefined as string | undefined,
  }));
  const { frames, pushFrame } = createFrameBuilder(elements);
  const realTarget = Math.min(Math.max(1, target), 15);

  const overallGoal = `Find the minimum sufficient capacity/value in the answer space [1..15].`;

  pushFrame(
    { type: 'INIT', explanation: `Search on Answer: Finding minimum sufficient capacity ${realTarget}.` },
    { goal: overallGoal, action: `Initialize answer space`, why: `We are searching across a range of potential answers rather than indices.`, result: `Ready to search.` }
  );

  let low = 0;
  let high = elements.length - 1;
  let ans = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    elements[low].label = 'L';
    elements[high].label = 'R';
    elements[mid].label = 'M';
    elements[mid].state = 'selected';

    pushFrame(
      { type: 'SEARCH', explanation: `Checking if capacity ${elements[mid].value} is sufficient...` },
      { goal: `Evaluate the current potential answer`, action: `Check capacity ${elements[mid].value}`, why: `We test the midpoint to see if it satisfies the required condition.`, result: `Checking sufficiency.` }
    );

    if (elements[mid].value >= realTarget) {
      ans = mid;
      pushFrame(
        { type: 'FOUND', explanation: `Capacity ${elements[mid].value} is SUFFICIENT. Searching left for smaller valid capacity.` },
        { goal: `Find the minimum sufficient capacity`, action: `Save answer ${elements[mid].value} and move high to ${mid - 1}`, why: `This capacity works, but we want the smallest possible capacity that works.`, result: `Answer updated.` }
      );
      high = mid - 1;
    } else {
      pushFrame(
        { type: 'ELIMINATE', explanation: `Capacity ${elements[mid].value} is NOT SUFFICIENT. We need more capacity, searching right.` },
        { goal: `Find a valid capacity`, action: `Move low to ${mid + 1}`, why: `This capacity is too small, so any smaller capacity will also fail. We must search higher.`, result: `Left portion eliminated.` }
      );
      low = mid + 1;
    }
    clearStates(elements);
  }

  if (ans !== -1) {
    elements[ans].state = 'found';
    elements[ans].label = 'ANS';
    pushFrame(
      { type: 'COMPLETE', explanation: `Minimum sufficient capacity found is ${elements[ans].value}.` },
      { goal: `Search complete`, action: `Return minimum capacity`, why: `We found the smallest capacity that satisfies the condition.`, result: `Answer found.` }
    );
  }

  return frames;
}

export function monotonicPredicate(initialArray: VisualElement[], target: number): VisualizationFrame[] {
  // Simulate a boolean predicate array T T T F F F F
  const elements = Array.from({ length: 15 }, (_, i) => ({
    id: `pred-${i}`,
    value: i < 7 ? 1 : 0, // 1 for True, 0 for False
    state: 'sorted' as VisualElement['state'],
    label: undefined as string | undefined,
  }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const overallGoal = `Find the boundary (Last True) in a monotonic boolean array (TTT...FFF).`;

  pushFrame(
    { type: 'INIT', explanation: `Monotonic Predicate: We map the answer space to booleans (True/False).` },
    { goal: overallGoal, action: `Initialize boolean array`, why: `Many advanced binary search problems can be mapped to finding the boundary in an array of True/False values.`, result: `Ready to search.` }
  );

  let low = 0;
  let high = elements.length - 1;
  let ans = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    elements[low].label = 'L';
    elements[high].label = 'R';
    elements[mid].label = 'M';
    elements[mid].state = 'selected';

    const isTrue = elements[mid].value === 1;

    pushFrame(
      { type: 'SEARCH', explanation: `Evaluating predicate at index ${mid}... Result: ${isTrue ? 'TRUE' : 'FALSE'}.` },
      { goal: `Evaluate the predicate at the midpoint`, action: `Check value at index ${mid}`, why: `We need to know if we are on the True side or False side of the boundary.`, result: `Predicate evaluated.` }
    );

    if (isTrue) {
      ans = mid;
      pushFrame(
        { type: 'FOUND', explanation: `Predicate is TRUE. This is a potential answer for "Last True". Searching right.` },
        { goal: `Find the absolute last True`, action: `Save answer ${mid} and move low to ${mid + 1}`, why: `We found a True, but we want the LAST True, so we must check if there are more Trues to the right.`, result: `Answer updated.` }
      );
      low = mid + 1;
    } else {
      pushFrame(
        { type: 'ELIMINATE', explanation: `Predicate is FALSE. We must search left for the True boundary.` },
        { goal: `Move towards the True section`, action: `Move high to ${mid - 1}`, why: `We are too far right in the False section. The boundary must be to the left.`, result: `Right portion eliminated.` }
      );
      high = mid - 1;
    }
    clearStates(elements);
  }

  if (ans !== -1) {
    elements[ans].state = 'found';
    elements[ans].label = 'ANS';
    pushFrame(
      { type: 'COMPLETE', explanation: `The boundary (Last True) is at index ${ans}.` },
      { goal: `Search complete`, action: `Return boundary index`, why: `We successfully located the exact point where True changes to False.`, result: `Boundary found.` }
    );
  }

  return frames;
}
