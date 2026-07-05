import type { VisualElement, VisualizationFrame } from '../../types/visualizer';
import { createFrameBuilder } from './frameBuilder';

export function linearSearch(
  initialArray: VisualElement[],
  target: number,
): VisualizationFrame[] {
  const elements: VisualElement[] = initialArray.map((el) => ({ ...el, state: 'normal' }));

  const { frames, pushFrame } = createFrameBuilder(elements);
  const overallGoal = `Find target ${target} by checking each element sequentially.`;

  pushFrame(
    { type: 'INIT', explanation: `Starting Linear Search for ${target}` },
    { goal: overallGoal, action: 'Initialize array', why: 'Starting the search process.', result: 'Ready to search' }
  );

  for (let i = 0; i < elements.length; i++) {
    // Mark current element
    elements[i].state = 'comparing';
    elements[i].label = 'curr';

    pushFrame(
      { type: 'COMPARE', explanation: `Checking index ${i}. Is ${elements[i].value} == ${target}?` },
      { goal: `Check if target is at index ${i}`, action: `Compare ${elements[i].value} and ${target}`, why: `Linear search must check every element one by one from left to right.`, result: `Checking equality.` }
    );

    if (elements[i].value === target) {
      elements[i].state = 'found';
      elements[i].label = 'found';
      
      // Mark others out of range
      for (let j = 0; j < elements.length; j++) {
        if (j !== i) elements[j].state = 'out-of-range';
      }

      pushFrame(
        { type: 'FOUND', explanation: `Target ${target} found at index ${i}!` },
        { goal: `Search complete`, action: `Return index ${i}`, why: `The current element matches our target. Linear search can now terminate early.`, result: `Target found.` }
      );
      return frames;
    } else {
      // Mark as eliminated
      elements[i].state = 'out-of-range';
      elements[i].label = undefined;

      pushFrame(
        { type: 'ELIMINATE', explanation: `${elements[i].value} != ${target}. Moving to the next element.` },
        { goal: `Move to next element`, action: `Eliminate index ${i}`, why: `${elements[i].value} is not the target, so we must continue searching the remaining elements.`, result: `Index ${i} eliminated.` }
      );
    }
  }

  pushFrame(
    { type: 'COMPLETE', explanation: `Target ${target} not found in the array.` },
    { goal: `Search complete`, action: `Return not found`, why: `We checked every single element and none of them matched the target.`, result: `Target does not exist in array.` }
  );

  return frames;
}
