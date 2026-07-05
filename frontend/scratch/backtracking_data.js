module.exports = {
  'generate-subsets': {
    id: 'generate-subsets',
    title: 'Generate Subsets',
    problem: 'Given an integer array of unique elements, return all possible subsets (the power set). The solution must not contain duplicate subsets. Order does not matter.',
    intuition: 'Imagine you are packing for a trip. For every item in your room, you have exactly two choices: pack it (include) or leave it (exclude). A subset is just a specific combination of these yes/no choices applied to every item.',
    walkthrough: [
      { phase: 'Include/Exclude', description: 'At every index of the array, we branch into two paths.' },
      { phase: 'Include Branch', description: 'Add the current element to our temporary subset list and recursively move to the next index.' },
      { phase: 'Exclude Branch', description: 'Skip the current element (do not add it) and recursively move to the next index.' },
      { phase: 'Base Case', description: 'When we reach the end of the array, the temporary subset is fully formed and we add it to our final answer list.' }
    ],
    dryRun: { 
      input: '[1, 2]', 
      output: '[[], [1], [1, 2], [2]]', 
      steps: [
        'Start at index 0 (element 1). Current subset: []',
        'Branch 1 (Include 1): Subset becomes [1]. Move to index 1.',
        'At index 1 (element 2). Branch 1.1 (Include 2): Subset becomes [1, 2]. Move to index 2.',
        'Base Case: Index 2 reached. Add [1, 2] to answers. Backtrack.',
        'Branch 1.2 (Exclude 2): Subset becomes [1]. Move to index 2.',
        'Base Case: Index 2 reached. Add [1] to answers. Backtrack.',
        'Backtrack to index 0. Branch 2 (Exclude 1): Subset becomes []. Move to index 1.',
        'At index 1 (element 2). Branch 2.1 (Include 2): Subset becomes [2]. Base Case: Add [2].',
        'Branch 2.2 (Exclude 2): Subset becomes []. Base Case: Add [].'
      ] 
    },
    complexities: {
      time: { best: 'O(N * 2^N)', average: 'O(N * 2^N)', worst: 'O(N * 2^N)' },
      space: 'O(N)',
      analysis: 'Time: There are 2^N possible subsets. For each subset, copying it into the results array takes O(N) time. Space: The recursion stack goes N levels deep. The space for the result array is O(N * 2^N) but auxiliary space is just O(N).'
    },
    code: {
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        vector<vector<int>> res;\n        vector<int> curr;\n        solve(0, nums, curr, res);\n        return res;\n    }\n\n    void solve(int i, vector<int>& nums, vector<int>& curr, vector<vector<int>>& res) {\n        if (i == nums.size()) {\n            res.push_back(curr);\n            return;\n        }\n        // Include\n        curr.push_back(nums[i]);\n        solve(i + 1, nums, curr, res);\n        curr.pop_back(); // Backtrack\n        \n        // Exclude\n        solve(i + 1, nums, curr, res);\n    }\n};',
      java: 'class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        solve(0, nums, new ArrayList<>(), res);\n        return res;\n    }\n    \n    void solve(int i, int[] nums, List<Integer> curr, List<List<Integer>> res) {\n        if (i == nums.length) {\n            res.add(new ArrayList<>(curr));\n            return;\n        }\n        curr.add(nums[i]);\n        solve(i + 1, nums, curr, res);\n        curr.remove(curr.size() - 1);\n        \n        solve(i + 1, nums, curr, res);\n    }\n}',
      python: 'class Solution:\n    def subsets(self, nums: List[int]) -> List[List[int]]:\n        res = []\n        def solve(i, curr):\n            if i == len(nums):\n                res.append(curr[:])\n                return\n            \n            curr.append(nums[i])\n            solve(i + 1, curr)\n            curr.pop()\n            \n            solve(i + 1, curr)\n            \n        solve(0, [])\n        return res',
      javascript: 'var subsets = function(nums) {\n    const res = [];\n    \n    function solve(i, curr) {\n        if (i === nums.length) {\n            res.push([...curr]);\n            return;\n        }\n        \n        curr.push(nums[i]);\n        solve(i + 1, curr);\n        curr.pop();\n        \n        solve(i + 1, curr);\n    }\n    \n    solve(0, []);\n    return res;\n};'
    },
    interviewNotes: {
      mistakes: ['Forgetting to create a deep copy of the subset before adding it to the result list.', 'Not popping the element after the recursive call (failing to backtrack).'],
      edgeCases: ['An empty input array (should return [[]]).'],
      tips: ['Draw the state space tree. The height of the tree is N, and at every node, the branching factor is 2.']
    },
    practiceProblems: [
      { title: 'Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets/' },
      { title: 'Subsets II', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets-ii/' }
    ],
    relatedTopics: [{ title: 'Bit Manipulation', id: 'bit-manipulation' }, { title: 'Combinatorics', id: 'combinatorics' }]
  },

  'generate-subsequences': {
    id: 'generate-subsequences',
    title: 'Generate Subsequences',
    problem: 'Given a string, find all of its subsequences. A subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.',
    intuition: 'Finding subsequences of a string is conceptually identical to finding subsets of an array. Each character in the string can either be kept (included) or deleted (excluded).',
    walkthrough: [
      { phase: 'Include/Exclude', description: 'At every index of the string, branch into two paths.' },
      { phase: 'Include Branch', description: 'Append the character to the current string.' },
      { phase: 'Exclude Branch', description: 'Skip the character.' },
      { phase: 'Base Case', description: 'When the end of the string is reached, record the subsequence.' }
    ],
    dryRun: { 
      input: '"ab"', 
      output: '["ab", "a", "b", ""]', 
      steps: [
        'Start at index 0 ("a"). Current: ""',
        'Include "a": Current becomes "a". Move to index 1.',
        'At index 1 ("b"). Include "b": Current becomes "ab". Base case reached -> Record "ab".',
        'Backtrack to index 1. Exclude "b": Current becomes "a". Base case reached -> Record "a".',
        'Backtrack to index 0. Exclude "a": Current becomes "". Move to index 1.',
        'At index 1 ("b"). Include "b": Current becomes "b". Base case -> Record "b".',
        'Backtrack to index 1. Exclude "b": Current becomes "". Base case -> Record "".'
      ] 
    },
    complexities: {
      time: { best: 'O(N * 2^N)', average: 'O(N * 2^N)', worst: 'O(N * 2^N)' },
      space: 'O(N)',
      analysis: 'Time: There are 2^N subsequences, string concatenation takes O(N). Space: O(N) auxiliary stack depth.'
    },
    code: {
      cpp: 'void solve(int i, string s, string curr, vector<string>& res) {\n    if (i == s.length()) {\n        res.push_back(curr);\n        return;\n    }\n    solve(i + 1, s, curr + s[i], res);\n    solve(i + 1, s, curr, res);\n}',
      java: 'void solve(int i, String s, String curr, List<String> res) {\n    if (i == s.length()) {\n        res.add(curr);\n        return;\n    }\n    solve(i + 1, s, curr + s.charAt(i), res);\n    solve(i + 1, s, curr, res);\n}',
      python: 'def get_subsequences(s):\n    res = []\n    def solve(i, curr):\n        if i == len(s):\n            res.append(curr)\n            return\n        solve(i + 1, curr + s[i])\n        solve(i + 1, curr)\n    solve(0, "")\n    return res',
      javascript: 'const getSubsequences = (s) => {\n    const res = [];\n    const solve = (i, curr) => {\n        if (i === s.length) { res.push(curr); return; }\n        solve(i + 1, curr + s[i]);\n        solve(i + 1, curr);\n    };\n    solve(0, "");\n    return res;\n};'
    },
    interviewNotes: {
      mistakes: ['Confusing subsequences with substrings. Substrings must be contiguous, subsequences do not need to be.'],
      edgeCases: ['Empty string.'],
      tips: ['String concatenation creates a new string, meaning explicit `.pop()` backtracking is not necessary if strings are immutable in your language.']
    },
    practiceProblems: [
      { title: 'Number of Matching Subsequences', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-matching-subsequences/' }
    ],
    relatedTopics: [{ title: 'Bit Manipulation', id: 'bit-manipulation' }]
  },

  'generate-permutations': {
    id: 'generate-permutations',
    title: 'Generate Permutations',
    problem: 'Given an array of distinct integers, return all the possible permutations. A permutation is a rearrangement of all elements.',
    intuition: 'Imagine trying to arrange 3 people in 3 chairs. Anyone can sit in the first chair. Once the first chair is taken, anyone remaining can sit in the second. We simulate this by iterating through the array and swapping the current element with elements we have not placed yet.',
    walkthrough: [
      { phase: 'Fix an element', description: 'Keep track of an index `first`. Every element from `first` to the end of the array is a candidate to be placed at index `first`.' },
      { phase: 'Swap', description: 'Swap the candidate element with the element at `first`.' },
      { phase: 'Recurse', description: 'Move to `first + 1` and repeat the process.' },
      { phase: 'Backtrack', description: 'Swap the elements back to restore the original array state for the next candidate.' }
    ],
    dryRun: { 
      input: '[1, 2, 3]', 
      output: '[[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,2,1], [3,1,2]]', 
      steps: [
        'Start: first=0. Array: [1, 2, 3]',
        'Swap index 0 with 0. Array: [1, 2, 3]. Recurse first=1.',
        '  Swap index 1 with 1. Array: [1, 2, 3]. Recurse first=2.',
        '    Swap index 2 with 2. Recurse first=3. Base case! Record [1, 2, 3].',
        '  Backtrack. Swap index 1 with 2. Array: [1, 3, 2]. Recurse first=2.',
        '    Swap index 2 with 2. Recurse first=3. Base case! Record [1, 3, 2].',
        'Backtrack to first=0. Swap index 0 with 1. Array: [2, 1, 3]. Recurse first=1.',
        '  ...and so on.'
      ] 
    },
    complexities: {
      time: { best: 'O(N * N!)', average: 'O(N * N!)', worst: 'O(N * N!)' },
      space: 'O(N)',
      analysis: 'Time: There are N! permutations. For each, we do an O(N) copy into the result list. Space: O(N) recursion stack, modifying the array in-place.'
    },
    code: {
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        vector<vector<int>> res;\n        solve(0, nums, res);\n        return res;\n    }\n    void solve(int first, vector<int>& nums, vector<vector<int>>& res) {\n        if (first == nums.size()) {\n            res.push_back(nums);\n            return;\n        }\n        for (int i = first; i < nums.size(); i++) {\n            swap(nums[first], nums[i]);\n            solve(first + 1, nums, res);\n            swap(nums[first], nums[i]);\n        }\n    }\n};',
      java: 'class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        solve(0, nums, res);\n        return res;\n    }\n    void solve(int first, int[] nums, List<List<Integer>> res) {\n        if (first == nums.length) {\n            List<Integer> list = new ArrayList<>();\n            for(int n : nums) list.add(n);\n            res.add(list);\n            return;\n        }\n        for (int i = first; i < nums.length; i++) {\n            swap(nums, first, i);\n            solve(first + 1, nums, res);\n            swap(nums, first, i);\n        }\n    }\n    void swap(int[] nums, int i, int j) {\n        int temp = nums[i]; nums[i] = nums[j]; nums[j] = temp;\n    }\n}',
      python: 'class Solution:\n    def permute(self, nums: List[int]) -> List[List[int]]:\n        res = []\n        def solve(first):\n            if first == len(nums):\n                res.append(nums[:])\n                return\n            for i in range(first, len(nums)):\n                nums[first], nums[i] = nums[i], nums[first]\n                solve(first + 1)\n                nums[first], nums[i] = nums[i], nums[first]\n        solve(0)\n        return res',
      javascript: 'var permute = function(nums) {\n    const res = [];\n    const solve = (first) => {\n        if (first === nums.length) {\n            res.push([...nums]);\n            return;\n        }\n        for (let i = first; i < nums.length; i++) {\n            [nums[first], nums[i]] = [nums[i], nums[first]];\n            solve(first + 1);\n            [nums[first], nums[i]] = [nums[i], nums[first]];\n        }\n    };\n    solve(0);\n    return res;\n};'
    },
    interviewNotes: {
      mistakes: ['Forgetting to un-swap (backtrack). If you don\'t swap back, the array order is mangled for the next iterations.', 'Not creating a copy of the array before adding to results.'],
      edgeCases: ['Array with 1 element.'],
      tips: ['The swap method achieves O(1) auxiliary space (excluding recursion stack). Another approach uses a boolean `visited` array, which takes O(N) extra extra space.']
    },
    practiceProblems: [
      { title: 'Permutations', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutations/' },
      { title: 'Permutations II', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutations-ii/' }
    ],
    relatedTopics: [{ title: 'Math', id: 'math' }]
  },

  'combination-sum': {
    id: 'combination-sum',
    title: 'Combination Sum',
    problem: 'Given an array of distinct integers and a target integer, return a list of all unique combinations where the chosen numbers sum to target. The same number may be chosen an unlimited number of times.',
    intuition: 'You have an unlimited supply of coins. To make a certain amount, you can repeatedly pick the same coin. However, once a branch exceeds the target, you know there is no point in adding more coins. You stop (prune) and try a different coin.',
    walkthrough: [
      { phase: 'Pick or Skip', description: 'At each number, we can either PICK it (and stay on the same number since supply is infinite) or SKIP it (move to the next number).' },
      { phase: 'Pruning', description: 'If the current sum exceeds the target, return immediately.' },
      { phase: 'Base Case', description: 'If the sum equals the target, record the combination and return.' }
    ],
    dryRun: { 
      input: 'candidates = [2, 3], target = 5', 
      output: '[[2, 3]]', 
      steps: [
        'Start index 0 (value 2), target=5, curr=[]',
        'Pick 2. target=3, curr=[2]. Stay at index 0.',
        'Pick 2. target=1, curr=[2,2]. Stay at index 0.',
        'Pick 2. target=-1. Constraint failed (target < 0). Backtrack.',
        'Skip 2 (at target=1). Move to index 1 (value 3). target=1, curr=[2,2].',
        'Pick 3. target=-2. Failed. Backtrack.',
        'Backtrack to target=3, curr=[2]. Skip 2. Move to index 1 (value 3).',
        'Pick 3. target=0, curr=[2,3]. Base case! Found combination.',
        'Backtrack and explore remaining paths...'
      ] 
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N^(T/M))', worst: 'O(2^T)' },
      space: 'O(T/M)',
      analysis: 'Time: Extremely dependent on target T and minimum element M. The tree depth is at most T/M. Space: Depth of recursion is T/M.'
    },
    code: {
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        vector<vector<int>> res;\n        vector<int> curr;\n        solve(0, target, candidates, curr, res);\n        return res;\n    }\n    void solve(int i, int target, vector<int>& c, vector<int>& curr, vector<vector<int>>& res) {\n        if (target == 0) { res.push_back(curr); return; }\n        if (target < 0 || i == c.size()) return;\n        \n        curr.push_back(c[i]);\n        solve(i, target - c[i], c, curr, res); // Pick\n        curr.pop_back();\n        \n        solve(i + 1, target, c, curr, res); // Skip\n    }\n};',
      java: 'class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        List<List<Integer>> res = new ArrayList<>();\n        solve(0, target, candidates, new ArrayList<>(), res);\n        return res;\n    }\n    void solve(int i, int target, int[] c, List<Integer> curr, List<List<Integer>> res) {\n        if (target == 0) { res.add(new ArrayList<>(curr)); return; }\n        if (target < 0 || i == c.length) return;\n        \n        curr.add(c[i]);\n        solve(i, target - c[i], c, curr, res);\n        curr.remove(curr.size() - 1);\n        \n        solve(i + 1, target, c, curr, res);\n    }\n}',
      python: 'class Solution:\n    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:\n        res = []\n        def solve(i, t, curr):\n            if t == 0:\n                res.append(curr[:])\n                return\n            if t < 0 or i == len(candidates):\n                return\n            \n            curr.append(candidates[i])\n            solve(i, t - candidates[i], curr)\n            curr.pop()\n            \n            solve(i + 1, t, curr)\n        solve(0, target, [])\n        return res',
      javascript: 'var combinationSum = function(candidates, target) {\n    const res = [];\n    const solve = (i, t, curr) => {\n        if (t === 0) { res.push([...curr]); return; }\n        if (t < 0 || i === candidates.length) return;\n        \n        curr.push(candidates[i]);\n        solve(i, t - candidates[i], curr);\n        curr.pop();\n        \n        solve(i + 1, t, curr);\n    };\n    solve(0, target, []);\n    return res;\n};'
    },
    interviewNotes: {
      mistakes: ['Iterating through a loop inside the recursive function AND incrementing `i` in the recursive call without understanding the tree structure. Either use the Pick/Skip pattern without a for-loop, or a for-loop that starts from `i`.'],
      edgeCases: ['Target is smaller than the minimum element in array (returns empty).'],
      tips: ['If you sort the candidates array first, you can prune the tree even earlier (break the loop if `target - c[i] < 0`).']
    },
    practiceProblems: [
      { title: 'Combination Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/combination-sum/' },
      { title: 'Coin Change 2', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change-2/' }
    ],
    relatedTopics: [{ title: 'Dynamic Programming', id: 'dynamic-programming' }]
  },

  'combination-sum-ii': {
    id: 'combination-sum-ii',
    title: 'Combination Sum II',
    problem: 'Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations where the candidate numbers sum to target. Each number may only be used ONCE. The solution must not contain duplicate combinations.',
    intuition: 'This problem is exactly like Subset Generation mixed with Combination Sum, with a catch: the input contains duplicates. If we pick a `2`, backtrack, and pick the next `2`, we will generate duplicate combinations. We must sort the array and skip identical siblings in our decision tree.',
    walkthrough: [
      { phase: 'Sort', description: 'Sort the array first to group duplicates together.' },
      { phase: 'For Loop Traversal', description: 'Instead of pick/skip, use a for-loop from `index` to the end of the array to pick the next element.' },
      { phase: 'Skip Duplicates', description: 'Inside the loop, if `i > index` and `arr[i] == arr[i-1]`, `continue`. This prevents branching out on the same number twice at the same tree depth.' }
    ],
    dryRun: { 
      input: 'candidates = [10,1,2,7,6,1,5], target = 8', 
      output: '[[1,1,6], [1,2,5], [1,7], [2,6]]', 
      steps: [
        'Sort: [1, 1, 2, 5, 6, 7, 10]',
        'Level 0: Loop i from 0. Pick arr[0]=1. target=7.',
        '  Level 1: Loop i from 1. Pick arr[1]=1. target=6.',
        '    Level 2: Loop i from 2. Pick arr[2]=2. target=4.',
        '      Level 3: Pick arr[3]=5. target=-1 (Fail).',
        '      Level 3: Pick arr[4]=6. target=-2 (Fail).',
        '    ... Backtrack.',
        '    Level 2: Pick arr[4]=6. target=0. BASE CASE! Record [1,1,6].',
        'Level 0: Loop reaches i=1. arr[1] == arr[0], and i > 0. SKIP duplicate branch!'
      ] 
    },
    complexities: {
      time: { best: 'O(N log N)', average: 'O(2^N)', worst: 'O(2^N)' },
      space: 'O(N)',
      analysis: 'Time: O(2^N) in the worst case (e.g. all 1s). Space: O(N) for recursion stack.'
    },
    code: {
      cpp: 'class Solution {\npublic:\n    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {\n        sort(candidates.begin(), candidates.end());\n        vector<vector<int>> res;\n        vector<int> curr;\n        solve(0, target, candidates, curr, res);\n        return res;\n    }\n    void solve(int idx, int target, vector<int>& c, vector<int>& curr, vector<vector<int>>& res) {\n        if (target == 0) { res.push_back(curr); return; }\n        for (int i = idx; i < c.size(); i++) {\n            if (i > idx && c[i] == c[i-1]) continue;\n            if (c[i] > target) break;\n            curr.push_back(c[i]);\n            solve(i + 1, target - c[i], c, curr, res);\n            curr.pop_back();\n        }\n    }\n};',
      java: 'class Solution {\n    public List<List<Integer>> combinationSum2(int[] candidates, int target) {\n        Arrays.sort(candidates);\n        List<List<Integer>> res = new ArrayList<>();\n        solve(0, target, candidates, new ArrayList<>(), res);\n        return res;\n    }\n    void solve(int idx, int target, int[] c, List<Integer> curr, List<List<Integer>> res) {\n        if (target == 0) { res.add(new ArrayList<>(curr)); return; }\n        for (int i = idx; i < c.length; i++) {\n            if (i > idx && c[i] == c[i-1]) continue;\n            if (c[i] > target) break;\n            curr.add(c[i]);\n            solve(i + 1, target - c[i], c, curr, res);\n            curr.remove(curr.size() - 1);\n        }\n    }\n}',
      python: 'class Solution:\n    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:\n        candidates.sort()\n        res = []\n        def solve(idx, t, curr):\n            if t == 0:\n                res.append(curr[:])\n                return\n            for i in range(idx, len(candidates)):\n                if i > idx and candidates[i] == candidates[i-1]:\n                    continue\n                if candidates[i] > t:\n                    break\n                curr.append(candidates[i])\n                solve(i + 1, t - candidates[i], curr)\n                curr.pop()\n        solve(0, target, [])\n        return res',
      javascript: 'var combinationSum2 = function(candidates, target) {\n    candidates.sort((a,b) => a - b);\n    const res = [];\n    const solve = (idx, t, curr) => {\n        if (t === 0) { res.push([...curr]); return; }\n        for (let i = idx; i < candidates.length; i++) {\n            if (i > idx && candidates[i] === candidates[i-1]) continue;\n            if (candidates[i] > t) break;\n            curr.push(candidates[i]);\n            solve(i + 1, t - candidates[i], curr);\n            curr.pop();\n        }\n    };\n    solve(0, target, []);\n    return res;\n};'
    },
    interviewNotes: {
      mistakes: ['Using a Set to filter out duplicate results. While this works, it usually results in Time Limit Exceeded (TLE) because you are still computing the massive duplicate branches.'],
      edgeCases: ['Array of all identical elements `[1,1,1,1]`. Proper duplicate skipping prunes this efficiently.'],
      tips: ['`if (i > idx && c[i] == c[i-1]) continue;` is the golden rule for combinations with duplicates. Memorize this pattern!']
    },
    practiceProblems: [
      { title: 'Combination Sum II', difficulty: 'Medium', url: 'https://leetcode.com/problems/combination-sum-ii/' }
    ],
    relatedTopics: []
  },

  'letter-combinations': {
    id: 'letter-combinations',
    title: 'Letter Combinations of a Phone Number',
    problem: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. A mapping of digits to letters (just like on the telephone buttons) is given below.',
    intuition: 'If you type "23" on an old phone keypad, "2" could be a, b, or c. For each of those choices, "3" could be d, e, or f. This forms a tree of choices. We use backtracking to explore every path from the first digit to the last digit.',
    walkthrough: [
      { phase: 'Mapping', description: 'Create a hash map or array linking digits to their respective characters (e.g., 2 -> "abc").' },
      { phase: 'Explore', description: 'For the current digit, iterate over its possible characters.' },
      { phase: 'Recurse', description: 'Append the character and recurse to the next digit.' }
    ],
    dryRun: { 
      input: '"23"', 
      output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', 
      steps: [
        'idx=0, digit="2", mapping="abc". Loop chars:',
        '  Char "a". Recurse idx=1.',
        '  idx=1, digit="3", mapping="def". Loop chars:',
        '    Char "d". Recurse idx=2. BASE CASE! Record "ad".',
        '    Char "e". Recurse idx=2. BASE CASE! Record "ae".',
        '    Char "f". Recurse idx=2. BASE CASE! Record "af".',
        '  Backtrack to idx=0. Next Char "b".',
        '  idx=1, digit="3", mapping="def". Loop chars:',
        '    Char "d". Record "bd".',
        '    ...and so on.'
      ] 
    },
    complexities: {
      time: { best: 'O(4^N * N)', average: 'O(4^N * N)', worst: 'O(4^N * N)' },
      space: 'O(N)',
      analysis: 'Time: There are at most 4^N combinations (since 7 and 9 have 4 letters). Building each string takes O(N). Space: Recursion stack goes N deep.'
    },
    code: {
      cpp: 'class Solution {\n    vector<string> pad = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};\npublic:\n    vector<string> letterCombinations(string digits) {\n        if (digits.empty()) return {};\n        vector<string> res;\n        solve(0, digits, "", res);\n        return res;\n    }\n    void solve(int i, string digits, string curr, vector<string>& res) {\n        if (i == digits.length()) { res.push_back(curr); return; }\n        string chars = pad[digits[i] - \'0\'];\n        for (char c : chars) {\n            solve(i + 1, digits, curr + c, res);\n        }\n    }\n};',
      java: 'class Solution {\n    String[] pad = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};\n    public List<String> letterCombinations(String digits) {\n        if (digits.isEmpty()) return new ArrayList<>();\n        List<String> res = new ArrayList<>();\n        solve(0, digits, new StringBuilder(), res);\n        return res;\n    }\n    void solve(int i, String digits, StringBuilder curr, List<String> res) {\n        if (i == digits.length()) { res.add(curr.toString()); return; }\n        String chars = pad[digits.charAt(i) - \'0\'];\n        for (char c : chars.toCharArray()) {\n            curr.append(c);\n            solve(i + 1, digits, curr, res);\n            curr.deleteCharAt(curr.length() - 1);\n        }\n    }\n}',
      python: 'class Solution:\n    def letterCombinations(self, digits: str) -> List[str]:\n        if not digits: return []\n        pad = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]\n        res = []\n        def solve(i, curr):\n            if i == len(digits):\n                res.append("".join(curr))\n                return\n            for c in pad[int(digits[i])]:\n                curr.append(c)\n                solve(i + 1, curr)\n                curr.pop()\n        solve(0, [])\n        return res',
      javascript: 'var letterCombinations = function(digits) {\n    if (!digits.length) return [];\n    const pad = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];\n    const res = [];\n    const solve = (i, curr) => {\n        if (i === digits.length) { res.push(curr); return; }\n        for (let c of pad[digits[i]]) {\n            solve(i + 1, curr + c);\n        }\n    };\n    solve(0, "");\n    return res;\n};'
    },
    interviewNotes: {
      mistakes: ['Not handling the empty string input correctly (returning `[""]` instead of `[]`).'],
      edgeCases: ['Empty string `""`.'],
      tips: ['This is the standard template for combinations across multiple lists. Very useful pattern to memorize.']
    },
    practiceProblems: [
      { title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' }
    ],
    relatedTopics: [{ title: 'Hash Table', id: 'hash-table' }]
  }
};
