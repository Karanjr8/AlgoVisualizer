import { DebugChallenge } from '../../types/practice';
import { PRACTICE_QUESTIONS } from './questions';

const baseBinarySearch = PRACTICE_QUESTIONS.find(q => q.id === 'binary-search')!;
const baseTwoSum = PRACTICE_QUESTIONS.find(q => q.id === 'two-sum-ii')!;

export const DEBUG_BANK: DebugChallenge[] = [
  {
    ...baseBinarySearch,
    id: 'debug-binary-search-1',
    title: 'Debug: Binary Search (Infinite Loop)',
    brokenCode: `function search(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        // BUG HERE: Using Math.ceil can lead to an infinite loop 
        // when left and right are adjacent.
        const mid = left + Math.ceil((right - left) / 2);

        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid; // BUG HERE: Should be mid + 1
        } else {
            right = mid - 1;
        }
    }

    return -1;
}`,
    bugType: 'Infinite Loop',
    bugExplanation: `There are two fatal flaws in this implementation that cause an infinite loop:
1. \`left = mid\` instead of \`left = mid + 1\`. If the search space is narrowed down to two adjacent elements and the target is the right element, \`left\` will never advance past \`mid\`.
2. Using \`Math.ceil\` instead of \`Math.floor\` biases the midpoint to the right, exacerbating the first bug by constantly recalculating the same index.

**The Fix:** Always use \`Math.floor\` for midpoint calculation and strictly shrink the boundary using \`left = mid + 1\` and \`right = mid - 1\`.`
  },
  {
    ...baseTwoSum,
    id: 'debug-two-sum-1',
    title: 'Debug: Two Sum II (Out of Bounds)',
    brokenCode: `function twoSum(numbers: number[], target: number): number[] {
    let left = 0;
    let right = numbers.length; // BUG: Should be length - 1

    while (left < right) {
        // This will result in NaN on the first iteration because numbers[numbers.length] is undefined.
        const currentSum = numbers[left] + numbers[right];

        if (currentSum === target) {
            return [left + 1, right + 1];
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }

    return [];
}`,
    bugType: 'Off-by-one',
    bugExplanation: `The right pointer is initialized to \`numbers.length\` instead of \`numbers.length - 1\`. 
In JavaScript/TypeScript, arrays are 0-indexed. Accessing \`numbers[numbers.length]\` returns \`undefined\`. 
Adding a number to \`undefined\` results in \`NaN\`. 
Since \`NaN === target\` is false, and \`NaN < target\` is false, the code falls into the \`else\` block, immediately decrementing \`right\`. 
While it might accidentally "recover" on the next iteration, this is a dangerous out-of-bounds bug that can crash in strongly typed languages like Java or C++.`
  }
];
