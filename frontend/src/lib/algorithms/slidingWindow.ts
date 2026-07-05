import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

export const slidingWindowMaximumSum = (initialArray: VisualElement[], k: number = 3): VisualizationFrame[] => {
  const elements: VisualElement[] = initialArray.map(el => ({ ...el, state: 'normal', label: undefined }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  if (k > elements.length) k = elements.length;

  const overallGoal = `Find the maximum sum of any contiguous subarray of size K=${k}.`;

  pushFrame(
    { type: 'INIT', explanation: `Starting Sliding Window Maximum Sum (K=${k}).` },
    { goal: overallGoal, action: `Initialize sliding window`, why: `We use a window of size ${k} to avoid re-summing all elements.`, result: `Ready to slide.` }
  );

  let maxSum = -Infinity;
  let currentSum = 0;

  for (let i = 0; i < elements.length; i++) {
    elements[i].state = 'comparing';
    pushFrame(
      { type: 'EXPAND_WINDOW', explanation: `Add element ${elements[i].value} to window.` },
      { goal: `Expand window to the right`, action: `Include index ${i}`, why: `We grow the window by adding the next element on the right.`, result: `Element added.` }
    );

    currentSum += elements[i].value;
    elements[i].state = 'selected';

    if (i >= k - 1) {
      if (currentSum > maxSum) {
        maxSum = currentSum;
        pushFrame(
          { type: 'UPDATE_BEST', explanation: `New maximum sum found: ${maxSum}` },
          { goal: `Track the best sum so far`, action: `Update maxSum to ${currentSum}`, why: `The current window's sum is greater than any previous window's sum.`, result: `New max sum recorded.` }
        );
      } else {
        pushFrame(
          { type: 'CHECK_CONDITION', explanation: `Current sum ${currentSum} is not greater than max sum ${maxSum}.` },
          { goal: `Track the best sum so far`, action: `Compare sums`, why: `We only update the max sum if the current window is better.`, result: `No update needed.` }
        );
      }

      const leftIdx = i - k + 1;
      elements[leftIdx].state = 'comparing';
      pushFrame(
        { type: 'SHRINK_WINDOW', explanation: `Window size reached K=${k}. Element ${elements[leftIdx].value} will leave the window.` },
        { goal: `Maintain window size of ${k}`, action: `Remove left element at index ${leftIdx}`, why: `The window must remain size ${k} as it slides right.`, result: `Left element removed from sum.` }
      );
      currentSum -= elements[leftIdx].value;
      elements[leftIdx].state = 'normal';
    }
  }

  pushFrame(
    { type: 'COMPLETE', explanation: `Finished! Maximum sum is ${maxSum}` },
    { goal: `Complete traversal`, action: `Return max sum`, why: `All possible windows of size ${k} have been checked.`, result: `Algorithm complete.` }
  );

  return frames;
};

export const slidingWindowAverage = (initialArray: VisualElement[], k: number = 3): VisualizationFrame[] => {
  const elements: VisualElement[] = initialArray.map(el => ({ ...el, state: 'normal', label: undefined }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  if (k > elements.length) k = elements.length;

  const overallGoal = `Calculate the moving average for every contiguous subarray of size K=${k}.`;

  pushFrame(
    { type: 'INIT', explanation: `Starting Moving Average (K=${k}).` },
    { goal: overallGoal, action: `Initialize sliding window`, why: `We use a window of size ${k} to avoid re-summing for every average.`, result: `Ready to slide.` }
  );

  let currentSum = 0;
  let averages: number[] = [];

  for (let i = 0; i < elements.length; i++) {
    elements[i].state = 'comparing';
    pushFrame(
      { type: 'EXPAND_WINDOW', explanation: `Add element ${elements[i].value} to window.` },
      { goal: `Expand window to the right`, action: `Include index ${i}`, why: `We grow the window by adding the next element on the right.`, result: `Element added.` }
    );

    currentSum += elements[i].value;
    elements[i].state = 'selected';

    if (i >= k - 1) {
      const avg = Number((currentSum / k).toFixed(2));
      averages.push(avg);
      
      pushFrame(
        { type: 'UPDATE_BEST', explanation: `Current window average is ${avg}` },
        { goal: `Calculate window average`, action: `Divide sum by ${k}`, why: `The window has reached its target size, so we record its average.`, result: `Average computed.` }
      );

      const leftIdx = i - k + 1;
      elements[leftIdx].state = 'comparing';
      pushFrame(
        { type: 'SHRINK_WINDOW', explanation: `Window size reached K=${k}. Element ${elements[leftIdx].value} leaves the window.` },
        { goal: `Maintain window size of ${k}`, action: `Remove left element at index ${leftIdx}`, why: `The window must remain size ${k} as it slides right.`, result: `Left element removed from sum.` }
      );
      currentSum -= elements[leftIdx].value;
      elements[leftIdx].state = 'normal';
    }
  }

  pushFrame(
    { type: 'COMPLETE', explanation: `Finished! Calculated all moving averages.` },
    { goal: `Complete traversal`, action: `Return averages`, why: `All possible windows of size ${k} have been checked.`, result: `Algorithm complete.` }
  );

  return frames;
};

export const slidingWindowLongestSubstring = (initialArray: VisualElement[]): VisualizationFrame[] => {
  const elements: VisualElement[] = initialArray.map(el => ({ 
    ...el, 
    state: 'normal', 
    label: undefined,
    displayValue: String.fromCharCode((el.value % 5) + 65) 
  }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const overallGoal = `Find the length of the longest contiguous substring without repeating characters.`;

  pushFrame(
    { type: 'INIT', explanation: `Finding Longest Substring Without Repeating Characters` },
    { goal: overallGoal, action: `Initialize sliding window`, why: `A dynamic sliding window allows us to track valid substrings efficiently.`, result: `Ready to slide.` }
  );

  let left = 0;
  let maxLength = 0;
  const charSet = new Set<string>();

  for (let right = 0; right < elements.length; right++) {
    const char = elements[right].displayValue!;
    elements[right].label = 'R';
    
    pushFrame(
      { type: 'EXPAND_WINDOW', explanation: `Right pointer at ${char}.` },
      { goal: `Expand window to the right`, action: `Examine character ${char}`, why: `We try to add the next character to our current valid substring.`, result: `Checking if character is unique.` }
    );

    while (charSet.has(char)) {
      pushFrame(
        { type: 'CHECK_CONDITION', explanation: `Character ${char} is already in the window! Need to shrink.` },
        { goal: `Restore uniqueness property`, action: `Prepare to shrink window`, why: `The substring must not contain duplicates. We must move the left pointer.`, result: `Shrinking left side.` }
      );
      
      const leftChar = elements[left].displayValue!;
      charSet.delete(leftChar);
      elements[left].state = 'normal';
      elements[left].label = undefined;
      left++;
      if (left < elements.length) {
        elements[left].label = 'L';
      }
      
      pushFrame(
        { type: 'SHRINK_WINDOW', explanation: `Left pointer moved. Removed ${leftChar} from window.` },
        { goal: `Remove duplicate character`, action: `Advance left pointer`, why: `We remove characters from the left until the duplicate character is gone.`, result: `Window shrank.` }
      );
    }

    charSet.add(char);
    elements[right].state = 'selected';
    if (left === right) {
      elements[left].label = 'L/R';
    } else {
      elements[left].label = 'L';
      elements[right].label = 'R';
    }

    if (right - left + 1 > maxLength) {
      maxLength = right - left + 1;
      pushFrame(
        { type: 'UPDATE_BEST', explanation: `New max length found: ${maxLength}` },
        { goal: `Track longest valid substring`, action: `Update max length`, why: `The current valid substring is longer than any previously seen.`, result: `New maximum length recorded.` }
      );
    } else {
      pushFrame(
        { type: 'SLIDE_WINDOW', explanation: `Current valid window size: ${right - left + 1}` },
        { goal: `Track longest valid substring`, action: `Compare lengths`, why: `The current valid substring is shorter than our best so far.`, result: `No update needed.` }
      );
    }
  }

  elements.forEach(el => el.label = undefined);
  pushFrame(
    { type: 'COMPLETE', explanation: `Finished! Longest substring length is ${maxLength}` },
    { goal: `Complete traversal`, action: `Return max length`, why: `The entire string has been processed.`, result: `Algorithm complete.` }
  );

  return frames;
};

export const slidingWindowMinimumSum = (initialArray: VisualElement[], targetSum: number = 20): VisualizationFrame[] => {
  const elements: VisualElement[] = initialArray.map(el => ({ ...el, state: 'normal', label: undefined }));
  const { frames, pushFrame } = createFrameBuilder(elements);

  const overallGoal = `Find the minimal length of a contiguous subarray whose sum is >= ${targetSum}.`;

  pushFrame(
    { type: 'INIT', explanation: `Finding Minimum Size Subarray with Sum >= ${targetSum}` },
    { goal: overallGoal, action: `Initialize dynamic sliding window`, why: `A dynamic window can efficiently expand to reach the target sum and shrink to minimize size.`, result: `Ready to slide.` }
  );

  let left = 0;
  let currentSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < elements.length; right++) {
    elements[right].label = 'R';
    elements[right].state = 'comparing';
    
    pushFrame(
      { type: 'EXPAND_WINDOW', explanation: `Expand right pointer. Adding ${elements[right].value}.` },
      { goal: `Reach or exceed the target sum`, action: `Add index ${right} to window`, why: `We expand the window until its sum meets the target requirement.`, result: `Element added to window.` }
    );

    currentSum += elements[right].value;
    elements[right].state = 'selected';
    
    if (left === right) elements[left].label = 'L/R';
    else {
      elements[left].label = 'L';
      elements[right].label = 'R';
    }

    pushFrame(
      { type: 'CHECK_CONDITION', explanation: `Current Sum: ${currentSum}. Target: ${targetSum}.` },
      { goal: `Check if target sum is met`, action: `Compare current sum to target`, why: `If the sum is >= target, we have a valid candidate subarray.`, result: `Checking sum.` }
    );

    while (currentSum >= targetSum) {
      if (right - left + 1 < minLength) {
        minLength = right - left + 1;
        pushFrame(
          { type: 'UPDATE_BEST', explanation: `Condition met! New min length: ${minLength}` },
          { goal: `Minimize the valid subarray length`, action: `Update minLength`, why: `The current valid subarray is shorter than any previously seen.`, result: `New minimum length recorded.` }
        );
      }

      elements[left].state = 'swapping'; // Highlight leaving element
      pushFrame(
        { type: 'SHRINK_WINDOW', explanation: `Sum >= ${targetSum}. Shrink from left to find smaller window. Removing ${elements[left].value}.` },
        { goal: `Minimize the valid subarray length`, action: `Remove left element`, why: `We try to make the window smaller from the left while keeping the sum >= target.`, result: `Window shrank.` }
      );

      currentSum -= elements[left].value;
      elements[left].state = 'normal';
      elements[left].label = undefined;
      left++;
      if (left <= right) {
        elements[left].label = 'L';
      }
    }
  }

  elements.forEach(el => el.label = undefined);
  pushFrame(
    { type: 'COMPLETE', explanation: `Finished! Minimum size is ${minLength === Infinity ? 0 : minLength}` },
    { goal: `Complete traversal`, action: `Return min length`, why: `The entire array has been processed.`, result: `Algorithm complete.` }
  );

  return frames;
};
