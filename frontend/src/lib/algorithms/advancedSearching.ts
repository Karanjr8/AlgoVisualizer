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

export function jumpSearch(initialArray: VisualElement[], target: number): VisualizationFrame[] {
  const elements = [...initialArray]
    .sort((a, b) => a.value - b.value)
    .map(el => ({ ...el, state: 'sorted' as VisualElement['state'] }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const n = elements.length;
  let step = Math.floor(Math.sqrt(n));
  
  const overallGoal = `Find target ${target} by jumping ahead in steps of √n, then performing a linear search.`;

  pushFrame(
    { type: 'INIT', explanation: `Starting Jump Search for ${target}.` },
    { goal: overallGoal, action: `Set step size to √${n} ≈ ${step}`, why: `Jumping by √n balances the cost of jumping and the cost of the final linear search.`, result: `Ready to jump.` }
  );

  let prev = 0;
  while (elements[Math.min(step, n) - 1].value < target) {
    elements[prev].state = 'selected';
    elements[prev].label = 'prev';
    const curr = Math.min(step, n) - 1;
    elements[curr].state = 'comparing';
    elements[curr].label = 'step-1';

    pushFrame(
      { type: 'SEARCH', explanation: `Value at index ${curr} is ${elements[curr].value} < ${target}.` },
      { goal: `Find the block containing the target`, action: `Compare ${elements[curr].value} and ${target}`, why: `If the value at the end of the block is less than the target, the target must be further ahead.`, result: `Jumping forward.` }
    );

    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) {
      clearStates(elements);
      pushFrame(
        { type: 'COMPLETE', explanation: `Reached end of array. Target ${target} not found.` },
        { goal: `Search complete`, action: `Return not found`, why: `We jumped past the end of the array without finding a block that could contain the target.`, result: `Target not found.` }
      );
      return frames;
    }
    clearStates(elements);
  }

  pushFrame(
    { type: 'FOUND', explanation: `Block found between index ${prev} and ${Math.min(step, n) - 1}.` },
    { goal: `Locate target within the identified block`, action: `Start linear search from index ${prev}`, why: `The target must lie within this block because the value at the end of the block is >= target.`, result: `Linear search starting.` }
  );

  while (elements[prev].value < target) {
    elements[prev].state = 'comparing';
    pushFrame(
      { type: 'SEARCH', explanation: `Index ${prev} (value ${elements[prev].value}) < ${target}.` },
      { goal: `Scan the block for the target`, action: `Compare ${elements[prev].value} and ${target}`, why: `We sequentially check elements until we find the target or exceed it.`, result: `Moving to next element.` }
    );
    elements[prev].state = 'sorted';
    prev++;

    if (prev === Math.min(step, n)) {
      clearStates(elements);
      pushFrame(
        { type: 'COMPLETE', explanation: `Reached end of block. Target ${target} not found.` },
        { goal: `Search complete`, action: `Return not found`, why: `We exhausted all elements in the block without finding the target.`, result: `Target not found.` }
      );
      return frames;
    }
  }

  if (elements[prev].value === target) {
    elements[prev].state = 'found';
    elements[prev].label = 'ANS';
    pushFrame(
      { type: 'FOUND', explanation: `Found ${target} at index ${prev}.` },
      { goal: `Search complete`, action: `Return index ${prev}`, why: `The target matches the current element.`, result: `Target found.` }
    );
  } else {
    pushFrame(
      { type: 'COMPLETE', explanation: `Target ${target} not found.` },
      { goal: `Search complete`, action: `Return not found`, why: `The current element is greater than the target, so the target does not exist in the array.`, result: `Target not found.` }
    );
  }

  return frames;
}

export function interpolationSearch(initialArray: VisualElement[], target: number): VisualizationFrame[] {
  const elements = [...initialArray]
    .sort((a, b) => a.value - b.value)
    .map(el => ({ ...el, state: 'sorted' as VisualElement['state'] }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const overallGoal = `Find target ${target} by estimating its position based on boundary values.`;

  pushFrame(
    { type: 'INIT', explanation: `Starting Interpolation Search for ${target}.` },
    { goal: overallGoal, action: `Initialize search boundaries`, why: `Interpolation Search uses the values at the ends of the range to guess where the target might be.`, result: `Ready to search.` }
  );

  let low = 0;
  let high = elements.length - 1;

  while (low <= high && target >= elements[low].value && target <= elements[high].value) {
    if (low === high) {
      if (elements[low].value === target) {
        elements[low].state = 'found';
        pushFrame(
          { type: 'FOUND', explanation: `Found target at index ${low}.` },
          { goal: `Search complete`, action: `Return index ${low}`, why: `The single remaining element matches the target.`, result: `Target found.` }
        );
      }
      break;
    }

    const pos = low + Math.floor(((target - elements[low].value) * (high - low)) / (elements[high].value - elements[low].value));
    
    elements[low].state = 'comparing';
    elements[low].label = 'low';
    elements[high].state = 'comparing';
    elements[high].label = 'high';
    elements[pos].state = 'selected';
    elements[pos].label = 'pos';

    pushFrame(
      { type: 'SEARCH', explanation: `Interpolated pos = ${pos} (Value: ${elements[pos].value}).` },
      { goal: `Estimate the target's position`, action: `Probe index ${pos}`, why: `Using a linear interpolation formula, we guess that the target is near index ${pos}.`, result: `Checking estimated position.` }
    );

    if (elements[pos].value === target) {
      clearStates(elements);
      elements[pos].state = 'found';
      pushFrame(
        { type: 'FOUND', explanation: `Found target at index ${pos}.` },
        { goal: `Search complete`, action: `Return index ${pos}`, why: `The value at the interpolated position matches the target.`, result: `Target found.` }
      );
      return frames;
    }

    if (elements[pos].value < target) {
      pushFrame(
        { type: 'ELIMINATE', explanation: `${elements[pos].value} < ${target}. New low is ${pos + 1}.` },
        { goal: `Narrow the search space`, action: `Update low bound to ${pos + 1}`, why: `The target is larger than the value at the probed position, so it must be further to the right.`, result: `Left portion eliminated.` }
      );
      low = pos + 1;
    } else {
      pushFrame(
        { type: 'ELIMINATE', explanation: `${elements[pos].value} > ${target}. New high is ${pos - 1}.` },
        { goal: `Narrow the search space`, action: `Update high bound to ${pos - 1}`, why: `The target is smaller than the value at the probed position, so it must be further to the left.`, result: `Right portion eliminated.` }
      );
      high = pos - 1;
    }
    clearStates(elements);
  }

  pushFrame(
    { type: 'COMPLETE', explanation: `Target ${target} not found in array.` },
    { goal: `Search complete`, action: `Return not found`, why: `The target is outside the bounds of the remaining search space.`, result: `Target not found.` }
  );
  return frames;
}

export function exponentialSearch(initialArray: VisualElement[], target: number): VisualizationFrame[] {
  const elements = [...initialArray]
    .sort((a, b) => a.value - b.value)
    .map(el => ({ ...el, state: 'sorted' as VisualElement['state'] }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const n = elements.length;
  const overallGoal = `Find target ${target} by finding a bounding range, then performing binary search.`;

  pushFrame(
    { type: 'INIT', explanation: `Starting Exponential Search for ${target}.` },
    { goal: overallGoal, action: `Check first element`, why: `Exponential Search rapidly doubles the search index to find an upper bound.`, result: `Ready to search.` }
  );

  if (elements[0].value === target) {
    elements[0].state = 'found';
    pushFrame(
      { type: 'FOUND', explanation: `Found target at index 0.` },
      { goal: `Search complete`, action: `Return index 0`, why: `The target matches the very first element.`, result: `Target found.` }
    );
    return frames;
  }

  let i = 1;
  while (i < n && elements[i].value <= target) {
    elements[i].state = 'comparing';
    elements[i].label = 'i';
    pushFrame(
      { type: 'SEARCH', explanation: `Index ${i} (value ${elements[i].value}) <= ${target}. Doubling index.` },
      { goal: `Find an upper bound for the target`, action: `Double the index to ${i * 2}`, why: `Since ${elements[i].value} is smaller than or equal to the target, we keep doubling the search index.`, result: `Index doubled.` }
    );
    elements[i].state = 'sorted';
    elements[i].label = undefined;
    i *= 2;
  }

  const low = Math.floor(i / 2);
  const high = Math.min(i, n - 1);
  pushFrame(
    { type: 'FOUND', explanation: `Range found: [${low}..${high}].` },
    { goal: `Perform binary search in the identified range`, action: `Set bounds low=${low}, high=${high}`, why: `We found a range where the target must exist. We now binary search this range.`, result: `Ready for binary search.` }
  );

  let left = low;
  let right = high;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    elements[left].label = 'L';
    elements[right].label = 'R';
    elements[mid].label = 'M';
    elements[mid].state = 'selected';

    pushFrame(
      { type: 'SEARCH', explanation: `Binary Search: Mid=${mid} (value ${elements[mid].value}).` },
      { goal: `Find the target in the remaining range`, action: `Check midpoint ${mid}`, why: `Standard binary search logic within the exponentially discovered bounds.`, result: `Checking equality.` }
    );

    if (elements[mid].value === target) {
      clearStates(elements);
      elements[mid].state = 'found';
      elements[mid].label = 'ANS';
      pushFrame(
        { type: 'FOUND', explanation: `Found target at index ${mid}.` },
        { goal: `Search complete`, action: `Return index ${mid}`, why: `The middle element matches our target.`, result: `Target found.` }
      );
      return frames;
    }

    if (elements[mid].value < target) {
      pushFrame(
        { type: 'ELIMINATE', explanation: `Move right.` },
        { goal: `Narrow search space`, action: `Update left bound to ${mid + 1}`, why: `The target is larger than the mid element.`, result: `Left portion eliminated.` }
      );
      left = mid + 1;
    } else {
      pushFrame(
        { type: 'ELIMINATE', explanation: `Move left.` },
        { goal: `Narrow search space`, action: `Update right bound to ${mid - 1}`, why: `The target is smaller than the mid element.`, result: `Right portion eliminated.` }
      );
      right = mid - 1;
    }
    clearStates(elements);
  }

  pushFrame(
    { type: 'COMPLETE', explanation: `Target ${target} not found.` },
    { goal: `Search complete`, action: `Return not found`, why: `Binary search completed without finding the target.`, result: `Target not found.` }
  );
  return frames;
}
