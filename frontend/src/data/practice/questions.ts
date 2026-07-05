import { PracticeQuestion } from '../../types/practice';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    pattern: 'Searching',
    tags: ['Array', 'Binary Search'],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    hints: [
      'Since the array is sorted, we can safely eliminate half of the search space at each step.',
      'Maintain two pointers, `left` and `right`. Calculate the `mid` point.',
      'Beware of integer overflow when calculating `mid`. Use `left + Math.floor((right - left) / 2)` instead of `Math.floor((left + right) / 2)`.'
    ],
    expectedTimeComplexity: 'O(log N)',
    expectedSpaceComplexity: 'O(1)',
    solutionCode: `function search(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}`,
    explanation: `The algorithm maintains a search window defined by \`left\` and \`right\` pointers. By checking the middle element, we can determine which half of the window the target must reside in (if it exists). We then shrink the window accordingly until the target is found or the window becomes invalid (\`left > right\`).`,
    patternRecognition: `Any time a problem asks you to search for an element or find a boundary in a **sorted** array in **better than O(N) time**, Binary Search is almost certainly the required pattern.`,
    commonMistakes: [
      'Using `while(left < right)` instead of `while(left <= right)`, missing the final element check.',
      'Failing to offset `mid` by `+1` or `-1` when updating boundaries, leading to infinite loops.',
      'Integer overflow when calculating `mid` (more common in Java/C++ than JS/TS, but still a best practice to avoid).'
    ],
    followUpQuestions: [
      {
        question: 'What if the array was sorted in descending order instead?',
        expectedAnswer: 'The logic is mirrored. If `nums[mid] < target`, we eliminate the right half by setting `right = mid - 1`.'
      }
    ]
  },
  {
    id: 'two-sum-ii',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Binary Search'],
    description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`index1\` and \`index2\`, added by one as an integer array \`[index1, index2]\` of length 2.

The tests are generated such that there is **exactly one solution**. You may not use the same element twice.
Your solution must use only constant extra space.`,
    hints: [
      'A brute force solution would be O(N²). Can we do better?',
      'Since the array is sorted, what happens if we place a pointer at the beginning and a pointer at the end?',
      'If the sum of the two pointers is too large, how do we decrease the sum? If it is too small, how do we increase it?'
    ],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    solutionCode: `function twoSum(numbers: number[], target: number): number[] {
    let left = 0;
    let right = numbers.length - 1;

    while (left < right) {
        const currentSum = numbers[left] + numbers[right];

        if (currentSum === target) {
            return [left + 1, right + 1]; // 1-indexed
        } else if (currentSum < target) {
            left++; // Need a larger sum
        } else {
            right--; // Need a smaller sum
        }
    }

    return [];
}`,
    explanation: `We use the Opposite Direction Two Pointers pattern. Because the array is sorted, moving the left pointer to the right strictly increases our sum, and moving the right pointer to the left strictly decreases our sum. We iteratively adjust our pointers based on whether our current sum is too small or too large until we hit the target.`,
    patternRecognition: `Whenever you need to find a pair of elements that satisfy a condition (like a sum) in a **sorted array**, Opposite Direction Two Pointers is the standard O(N) approach.`,
    commonMistakes: [
      'Using a Hash Map (O(N) space) which solves the unsorted Two Sum problem, but fails the strict O(1) space constraint of this variation.',
      'Forgetting that the problem requires 1-indexed output and returning 0-indexed values.'
    ]
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    pattern: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    hints: [
      'The area formed between the lines will always be limited by the height of the shorter line.',
      'Start with the maximum possible width (pointers at the two ends of the array).',
      'Which pointer should you move inward to potentially find a larger area?'
    ],
    expectedTimeComplexity: 'O(N)',
    expectedSpaceComplexity: 'O(1)',
    solutionCode: `function maxArea(height: number[]): number {
    let left = 0;
    let right = height.length - 1;
    let maxArea = 0;

    while (left < right) {
        const currentWidth = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const currentArea = currentWidth * currentHeight;
        
        maxArea = Math.max(maxArea, currentArea);

        // Move the pointer pointing to the shorter line
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxArea;
}`,
    explanation: `We start with the widest possible container by placing pointers at the ends. The area is constrained by the shorter line. Moving the pointer at the taller line inward cannot possibly increase the area because the width strictly decreases and the height is still limited by the shorter line. Therefore, we must move the pointer at the shorter line inward to have any hope of finding a taller line that compensates for the lost width.`,
    patternRecognition: `This is a classic greedy application of Opposite Direction Two Pointers. When maximizing an area/volume constrained by two boundaries, start wide and aggressively prune the boundary that is limiting the current result.`,
    commonMistakes: [
      'Trying to move both pointers at once.',
      'Moving the taller line inward instead of the shorter line.',
      'Using a nested loop (brute force) which results in O(N²) time and TLE (Time Limit Exceeded).'
    ]
  }
];
