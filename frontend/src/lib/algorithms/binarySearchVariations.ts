import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

type Variation = 
  | 'first-occurrence'
  | 'last-occurrence'
  | 'lower-bound'
  | 'upper-bound'
  | 'floor'
  | 'ceil'
  | 'search-insert-position';

function markSearchRange(
  elements: VisualElement[],
  low: number,
  high: number,
  mid: number,
  ansIndex: number,
) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].label = undefined;

    if (i === ansIndex) {
      elements[i].state = 'found';
      elements[i].label = 'ANS';
    }

    if (i === mid) {
      if (i !== ansIndex) elements[i].state = 'selected';
      if (low === mid && high === mid) elements[i].label = elements[i].label ? elements[i].label + ',L,M,R' : 'L,M,R';
      else if (low === mid) elements[i].label = elements[i].label ? elements[i].label + ',L,M' : 'L,M';
      else if (high === mid) elements[i].label = elements[i].label ? elements[i].label + ',M,R' : 'M,R';
      else elements[i].label = elements[i].label ? elements[i].label + ',M' : 'M';
    } else if (i === low) {
      if (i !== ansIndex) elements[i].state = 'comparing';
      elements[i].label = elements[i].label ? elements[i].label + ',L' : 'L';
    } else if (i === high) {
      if (i !== ansIndex) elements[i].state = 'comparing';
      elements[i].label = elements[i].label ? elements[i].label + ',R' : 'R';
    } else if (i > low && i < high) {
      if (i !== ansIndex) elements[i].state = 'comparing';
    } else {
      if (i !== ansIndex) elements[i].state = 'out-of-range';
    }
  }
}

function clearSearchStates(elements: VisualElement[]) {
  for (const el of elements) {
    if (el.state !== 'found' && el.state !== 'sorted') el.state = 'normal';
  }
}

export function binarySearchVariations(
  initialArray: VisualElement[],
  target: number,
  variation: Variation
): VisualizationFrame[] {
  // Variations generally require sorted arrays.
  const elements: VisualElement[] = [...initialArray]
    .sort((a, b) => a.value - b.value)
    .map((el) => ({ ...el, state: 'sorted' as const }));

  const { frames, pushFrame } = createFrameBuilder(elements);

  let explanation = '';
  let overallGoal = '';
  switch (variation) {
    case 'first-occurrence':
      explanation = `Finding the FIRST occurrence of ${target}.`;
      overallGoal = `Find the first occurrence of ${target} by searching left even after finding a match.`;
      break;
    case 'last-occurrence':
      explanation = `Finding the LAST occurrence of ${target}.`;
      overallGoal = `Find the last occurrence of ${target} by searching right even after finding a match.`;
      break;
    case 'lower-bound':
      explanation = `Finding the Lower Bound (first element >= ${target}).`;
      overallGoal = `Find the smallest element that is greater than or equal to ${target}.`;
      break;
    case 'upper-bound':
      explanation = `Finding the Upper Bound (first element > ${target}).`;
      overallGoal = `Find the first element that is strictly greater than ${target}.`;
      break;
    case 'floor':
      explanation = `Finding the Floor (largest element <= ${target}).`;
      overallGoal = `Find the largest element that is less than or equal to ${target}.`;
      break;
    case 'ceil':
      explanation = `Finding the Ceil (smallest element >= ${target}).`;
      overallGoal = `Find the smallest element that is greater than or equal to ${target}.`;
      break;
    case 'search-insert-position':
      explanation = `Finding the Search Insert Position for ${target}.`;
      overallGoal = `Find the index where ${target} should be inserted to maintain sorted order.`;
      break;
  }

  pushFrame(
    { type: 'INIT', explanation },
    { goal: overallGoal, action: 'Initialize search space', why: 'Starting the variation search on a sorted array.', result: 'Ready to search.' }
  );

  let low = 0;
  let high = elements.length - 1;
  let ansIndex = -1;
  let step = 0;

  while (low <= high) {
    step++;
    const mid = Math.floor((low + high) / 2);
    markSearchRange(elements, low, high, mid, ansIndex);

    pushFrame(
      { type: 'SEARCH', explanation: `Step ${step}: L=${low}, R=${high}. Mid is ${mid} (value ${elements[mid].value}).` },
      { goal: `Check the midpoint of current search space`, action: `Calculate mid = ${mid}`, why: `Standard binary search logic to reduce the search space by half.`, result: `Midpoint identified.` }
    );

    if (variation === 'first-occurrence') {
      if (elements[mid].value === target) {
        ansIndex = mid;
        pushFrame(
          { type: 'FOUND', explanation: `Match found! Recording index ${mid}. Checking left for earlier occurrences.` },
          { goal: `Find the absolute first occurrence`, action: `Save answer ${mid} and move R = mid - 1`, why: `Because duplicates might exist on the left, we must continue searching the left half.`, result: `Answer updated.` }
        );
        high = mid - 1;
      } else if (elements[mid].value < target) {
        pushFrame(
          { type: 'ELIMINATE', explanation: `${elements[mid].value} < ${target}, moving right.` },
          { goal: `Narrow search space`, action: `Move L = mid + 1`, why: `Target is larger, so we eliminate the left half.`, result: `Left portion eliminated.` }
        );
        low = mid + 1;
      } else {
        pushFrame(
          { type: 'ELIMINATE', explanation: `${elements[mid].value} > ${target}, moving left.` },
          { goal: `Narrow search space`, action: `Move R = mid - 1`, why: `Target is smaller, so we eliminate the right half.`, result: `Right portion eliminated.` }
        );
        high = mid - 1;
      }
    } 
    else if (variation === 'last-occurrence') {
      if (elements[mid].value === target) {
        ansIndex = mid;
        pushFrame(
          { type: 'FOUND', explanation: `Match found! Recording index ${mid}. Checking right for later occurrences.` },
          { goal: `Find the absolute last occurrence`, action: `Save answer ${mid} and move L = mid + 1`, why: `Because duplicates might exist on the right, we must continue searching the right half.`, result: `Answer updated.` }
        );
        low = mid + 1;
      } else if (elements[mid].value < target) {
        pushFrame(
          { type: 'ELIMINATE', explanation: `${elements[mid].value} < ${target}, moving right.` },
          { goal: `Narrow search space`, action: `Move L = mid + 1`, why: `Target is larger, so we eliminate the left half.`, result: `Left portion eliminated.` }
        );
        low = mid + 1;
      } else {
        pushFrame(
          { type: 'ELIMINATE', explanation: `${elements[mid].value} > ${target}, moving left.` },
          { goal: `Narrow search space`, action: `Move R = mid - 1`, why: `Target is smaller, so we eliminate the right half.`, result: `Right portion eliminated.` }
        );
        high = mid - 1;
      }
    }
    else if (variation === 'lower-bound' || variation === 'ceil' || variation === 'search-insert-position') {
      if (elements[mid].value >= target) {
        ansIndex = mid;
        pushFrame(
          { type: 'FOUND', explanation: `${elements[mid].value} >= ${target}. Saving index ${mid}. Searching left for earlier valid element.` },
          { goal: `Find the first element >= ${target}`, action: `Save answer ${mid} and move R = mid - 1`, why: `This is a valid candidate, but we want the smallest index that satisfies the condition, so we look left.`, result: `Answer updated.` }
        );
        high = mid - 1;
      } else {
        pushFrame(
          { type: 'ELIMINATE', explanation: `${elements[mid].value} < ${target}. Not a valid answer. Moving right.` },
          { goal: `Narrow search space`, action: `Move L = mid + 1`, why: `We need an element >= target. Current element is too small.`, result: `Left portion eliminated.` }
        );
        low = mid + 1;
      }
    }
    else if (variation === 'upper-bound') {
      if (elements[mid].value > target) {
        ansIndex = mid;
        pushFrame(
          { type: 'FOUND', explanation: `${elements[mid].value} > ${target}. Saving index ${mid}. Searching left for earlier valid element.` },
          { goal: `Find the first element > ${target}`, action: `Save answer ${mid} and move R = mid - 1`, why: `This is a valid candidate, but we want the smallest index that satisfies the condition, so we look left.`, result: `Answer updated.` }
        );
        high = mid - 1;
      } else {
        pushFrame(
          { type: 'ELIMINATE', explanation: `${elements[mid].value} <= ${target}. Not a valid answer. Moving right.` },
          { goal: `Narrow search space`, action: `Move L = mid + 1`, why: `We need an element strictly > target. Current element is too small or equal.`, result: `Left portion eliminated.` }
        );
        low = mid + 1;
      }
    }
    else if (variation === 'floor') {
      if (elements[mid].value <= target) {
        ansIndex = mid;
        pushFrame(
          { type: 'FOUND', explanation: `${elements[mid].value} <= ${target}. Saving index ${mid}. Searching right for larger valid element.` },
          { goal: `Find the largest element <= ${target}`, action: `Save answer ${mid} and move L = mid + 1`, why: `This is a valid candidate, but we want the largest possible value that satisfies the condition, so we look right.`, result: `Answer updated.` }
        );
        low = mid + 1;
      } else {
        pushFrame(
          { type: 'ELIMINATE', explanation: `${elements[mid].value} > ${target}. Not a valid answer. Moving left.` },
          { goal: `Narrow search space`, action: `Move R = mid - 1`, why: `We need an element <= target. Current element is too large.`, result: `Right portion eliminated.` }
        );
        high = mid - 1;
      }
    }

    clearSearchStates(elements);
    for (const el of elements) {
      if (el.state === 'normal') el.state = 'sorted';
    }
  }

  // Final rendering
  for (let i = 0; i < elements.length; i++) {
    elements[i].state = i === ansIndex ? 'found' : 'out-of-range';
    elements[i].label = i === ansIndex ? 'ANS' : undefined;
  }
  
  const finalMsg = ansIndex !== -1 
    ? `Final Answer: Index ${ansIndex} (Value: ${elements[ansIndex].value}).`
    : `Final Answer: None found.`;

  pushFrame(
    { type: 'COMPLETE', explanation: `Search Complete! ${finalMsg}` },
    { goal: `Return the final result`, action: `Terminate search`, why: `The search space has been completely exhausted.`, result: `Search complete.` }
  );

  return frames;
}
