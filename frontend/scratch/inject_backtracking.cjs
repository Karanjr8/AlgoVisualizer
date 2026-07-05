const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const backtrackingData = 
"  'generate-subsets': {\n" +
"    title: 'Generate Subsets (Power Set)',\n" +
"    problem: 'Given an integer array of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',\n" +
"    intuition: 'At each element, we have two choices: either include the element in the current subset, or exclude it. We branch out into two paths for every element, leading to 2^N possible subsets.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(N * 2^N)', description: 'There are 2^N subsets, and for each subset, it takes O(N) time to construct it (copying the array).' },\n" +
"      { name: 'Space Complexity', value: 'O(N)', description: 'The recursion stack takes O(N) space, where N is the number of elements.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def subsets(nums):\\n    res = []\\n    \\n    def backtrack(idx, current):\\n        if idx == len(nums):\\n            res.append(current[:])\\n            return\\n            \\n        # Decision 1: Include nums[idx]\\n        current.append(nums[idx])\\n        backtrack(idx + 1, current)\\n        \\n        # Undo choice\\n        current.pop()\\n        \\n        # Decision 2: Exclude nums[idx]\\n        backtrack(idx + 1, current)\\n        \\n    backtrack(0, [])\\n    return res`,\n" +
"      java: `class Solution {\\n    public List<List<Integer>> subsets(int[] nums) {\\n        List<List<Integer>> res = new ArrayList<>();\\n        backtrack(0, nums, new ArrayList<>(), res);\\n        return res;\\n    }\\n    \\n    private void backtrack(int idx, int[] nums, List<Integer> current, List<List<Integer>> res) {\\n        if (idx == nums.length) {\\n            res.add(new ArrayList<>(current));\\n            return;\\n        }\\n        \\n        // Include\\n        current.add(nums[idx]);\\n        backtrack(idx + 1, nums, current, res);\\n        \\n        // Undo and Exclude\\n        current.remove(current.size() - 1);\\n        backtrack(idx + 1, nums, current, res);\\n    }\\n}`,\n" +
"      cpp: `class Solution {\\npublic:\\n    vector<vector<int>> subsets(vector<int>& nums) {\\n        vector<vector<int>> res;\\n        vector<int> current;\\n        backtrack(0, nums, current, res);\\n        return res;\\n    }\\n    \\n    void backtrack(int idx, vector<int>& nums, vector<int>& current, vector<vector<int>>& res) {\\n        if (idx == nums.size()) {\\n            res.push_back(current);\\n            return;\\n        }\\n        \\n        current.push_back(nums[idx]);\\n        backtrack(idx + 1, nums, current, res);\\n        \\n        current.pop_back();\\n        backtrack(idx + 1, nums, current, res);\\n    }\\n};`,\n" +
"      javascript: `function subsets(nums) {\\n    const res = [];\\n    \\n    function backtrack(idx, current) {\\n        if (idx === nums.length) {\\n            res.push([...current]);\\n            return;\\n        }\\n        \\n        current.push(nums[idx]);\\n        backtrack(idx + 1, current);\\n        \\n        current.pop();\\n        backtrack(idx + 1, current);\\n    }\\n    \\n    backtrack(0, []);\\n    return res;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Start at index 0 with empty subset []', notes: 'Choices: include or exclude 1' },\n" +
"      { step: 'Include 1', notes: 'current = [1]' },\n" +
"      { step: 'Move to index 1', notes: 'Choices: include or exclude 2' },\n" +
"      { step: 'Base Case Reached', notes: 'Record current subset' }\n" +
"    ],\n" +
"    commonMistakes: [\n" +
"      { mistake: 'Not copying the subset', fix: 'Always push a copy of the current array into the result, e.g., current[:] or [...current].' },\n" +
"      { mistake: 'Forgetting to pop', fix: 'After returning from the recursive call where you included the element, you must pop it out to backtrack.' }\n" +
"    ],\n" +
"    interviewNotes: [\n" +
"      { tip: 'Bit Manipulation Alternative', description: 'Since there are 2^N subsets, you can use a loop from 0 to 2^N-1 and use the bits to decide which elements to include.' }\n" +
"    ],\n" +
"    practiceProblems: [\n" +
"      { name: 'Subsets II', link: 'https://leetcode.com/problems/subsets-ii/' }\n" +
"    ],\n" +
"    relatedTopics: ['Bit Manipulation', 'Recursion']\n" +
"  },\n" +
"\n" +
"  'generate-subsequences': {\n" +
"    title: 'Generate Subsequences',\n" +
"    problem: 'Given a string, find all of its possible subsequences. A subsequence is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.',\n" +
"    intuition: 'This is identical in structure to generating subsets of an array. For each character in the string, we have a choice to either pick it or drop it.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(2^N)', description: '2^N possible subsequences.' },\n" +
"      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion depth is N.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def generate_subsequences(s):\\n    res = []\\n    \\n    def backtrack(idx, current):\\n        if idx == len(s):\\n            res.append(current)\\n            return\\n            \\n        # Include character\\n        backtrack(idx + 1, current + s[idx])\\n        \\n        # Exclude character\\n        backtrack(idx + 1, current)\\n        \\n    backtrack(0, \"\")\\n    return res`,\n" +
"      javascript: `function subsequences(s) {\\n    const res = [];\\n    \\n    function backtrack(idx, current) {\\n        if (idx === s.length) {\\n            res.push(current);\\n            return;\\n        }\\n        \\n        backtrack(idx + 1, current + s[idx]);\\n        backtrack(idx + 1, current);\\n    }\\n    \\n    backtrack(0, \"\");\\n    return res;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Start index 0', notes: 'Include/exclude first char' }\n" +
"    ],\n" +
"    commonMistakes: [\n" +
"      { mistake: 'Strings vs Arrays', fix: 'In some languages strings are immutable, so appending creates a new copy automatically. Be mindful of space.' }\n" +
"    ],\n" +
"    interviewNotes: [],\n" +
"    practiceProblems: [],\n" +
"    relatedTopics: ['Subsets', 'String']\n" +
"  },\n" +
"\n" +
"  'generate-permutations': {\n" +
"    title: 'Generate Permutations',\n" +
"    problem: 'Given an array of distinct integers, return all the possible permutations. You can return the answer in any order.',\n" +
"    intuition: 'At each position, any of the remaining unused elements can be placed. We can maintain a boolean array to track which elements are used, or we can simply swap elements in-place to explore different permutations.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(N * N!)', description: 'N! permutations, and copying each takes O(N).' },\n" +
"      { name: 'Space Complexity', value: 'O(N)', description: 'In-place swap method uses O(N) stack space.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def permute(nums):\\n    res = []\\n    \\n    def backtrack(first):\\n        if first == len(nums):\\n            res.append(nums[:])\\n            return\\n            \\n        for i in range(first, len(nums)):\\n            nums[first], nums[i] = nums[i], nums[first]\\n            backtrack(first + 1)\\n            nums[first], nums[i] = nums[i], nums[first] # backtrack\\n            \\n    backtrack(0)\\n    return res`,\n" +
"      javascript: `function permute(nums) {\\n    const res = [];\\n    \\n    function backtrack(first) {\\n        if (first === nums.length) {\\n            res.push([...nums]);\\n            return;\\n        }\\n        \\n        for (let i = first; i < nums.length; i++) {\\n            [nums[first], nums[i]] = [nums[i], nums[first]];\\n            backtrack(first + 1);\\n            [nums[first], nums[i]] = [nums[i], nums[first]];\\n        }\\n    }\\n    \\n    backtrack(0);\\n    return res;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Start at first index 0', notes: 'Try swapping index 0 with 0, 1, 2...' },\n" +
"      { step: 'Recurse to index 1', notes: 'Lock in index 0, try swapping index 1 with 1, 2...' }\n" +
"    ],\n" +
"    commonMistakes: [\n" +
"      { mistake: 'Passing by reference', fix: 'Remember to copy the array when pushing to the results list.' }\n" +
"    ],\n" +
"    interviewNotes: [\n" +
"      { tip: 'In-place swapping', description: 'The swapping method is highly preferred in interviews because it avoids the O(N) extra space needed for a visited array.' }\n" +
"    ],\n" +
"    practiceProblems: [\n" +
"      { name: 'Permutations II', link: 'https://leetcode.com/problems/permutations-ii/' }\n" +
"    ],\n" +
"    relatedTopics: ['Recursion', 'Array']\n" +
"  },\n" +
"\n" +
"  'combination-sum': {\n" +
"    title: 'Combination Sum',\n" +
"    problem: 'Given an array of distinct integers and a target integer, return a list of all unique combinations where the chosen numbers sum to target. The same number may be chosen an unlimited number of times.',\n" +
"    intuition: 'Similar to subsets, but we can reuse the same element. To prevent infinite loops and permutations, we decide whether to pick the current element (and stay at the same index) or skip the current element (and move to the next index).',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(N^(T/M))', description: 'Where T is target and M is the minimal value in candidates.' },\n" +
"      { name: 'Space Complexity', value: 'O(T/M)', description: 'Maximum depth of the recursion tree.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def combinationSum(candidates, target):\\n    res = []\\n    \\n    def backtrack(idx, current, current_sum):\\n        if current_sum == target:\\n            res.append(current[:])\\n            return\\n        if current_sum > target or idx >= len(candidates):\\n            return\\n            \\n        # Pick the element (stay at same index)\\n        current.append(candidates[idx])\\n        backtrack(idx, current, current_sum + candidates[idx])\\n        current.pop()\\n        \\n        # Skip the element\\n        backtrack(idx + 1, current, current_sum)\\n        \\n    backtrack(0, [], 0)\\n    return res`,\n" +
"      javascript: `function combinationSum(candidates, target) {\\n    const res = [];\\n    \\n    function backtrack(idx, current, sum) {\\n        if (sum === target) {\\n            res.push([...current]);\\n            return;\\n        }\\n        if (sum > target || idx >= candidates.length) return;\\n        \\n        current.push(candidates[idx]);\\n        backtrack(idx, current, sum + candidates[idx]);\\n        current.pop();\\n        \\n        backtrack(idx + 1, current, sum);\\n    }\\n    \\n    backtrack(0, [], 0);\\n    return res;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Check constraints', notes: 'If sum > target, prune this branch immediately.' }\n" +
"    ],\n" +
"    commonMistakes: [\n" +
"      { mistake: 'Generating Permutations instead of Combinations', fix: 'Only explore elements from the CURRENT index onwards, never backwards.' }\n" +
"    ],\n" +
"    interviewNotes: [\n" +
"      { tip: 'Sorting Optimization', description: 'Sorting the candidates first allows you to break early inside the loop if the sum exceeds the target.' }\n" +
"    ],\n" +
"    practiceProblems: [],\n" +
"    relatedTopics: ['Pruning', 'Arrays']\n" +
"  },\n" +
"\n" +
"  'combination-sum-ii': {\n" +
"    title: 'Combination Sum II',\n" +
"    problem: 'Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations where the candidate numbers sum to target. Each number may only be used ONCE. The solution set must not contain duplicate combinations.',\n" +
"    intuition: 'We must sort the array first. When exploring branches, if we skip an element, we must skip all subsequent identical elements at that level to avoid generating duplicate combinations.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(2^N)', description: 'Worst case explores all subsets.' },\n" +
"      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion depth.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def combinationSum2(candidates, target):\\n    candidates.sort()\\n    res = []\\n    \\n    def backtrack(idx, current, target):\\n        if target == 0:\\n            res.append(current[:])\\n            return\\n        if target < 0:\\n            return\\n            \\n        for i in range(idx, len(candidates)):\\n            # Skip duplicates at the same tree level\\n            if i > idx and candidates[i] == candidates[i-1]:\\n                continue\\n            \\n            current.append(candidates[i])\\n            backtrack(i + 1, current, target - candidates[i])\\n            current.pop()\\n            \\n    backtrack(0, [], target)\\n    return res`,\n" +
"      javascript: `function combinationSum2(candidates, target) {\\n    candidates.sort((a, b) => a - b);\\n    const res = [];\\n    \\n    function backtrack(idx, current, target) {\\n        if (target === 0) {\\n            res.push([...current]);\\n            return;\\n        }\\n        if (target < 0) return;\\n        \\n        for (let i = idx; i < candidates.length; i++) {\\n            if (i > idx && candidates[i] === candidates[i-1]) continue;\\n            \\n            current.push(candidates[i]);\\n            backtrack(i + 1, current, target - candidates[i]);\\n            current.pop();\\n        }\\n    }\\n    \\n    backtrack(0, [], target);\\n    return res;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Sort candidates', notes: 'Required for grouping duplicates together.' },\n" +
"      { step: 'Skip condition', notes: 'if (i > idx && arr[i] == arr[i-1]) continue;' }\n" +
"    ],\n" +
"    commonMistakes: [\n" +
"      { mistake: 'Using a Set for deduplication', fix: 'Sets are slow and memory intensive. Sorting and skipping at the same tree level is the optimal way.' }\n" +
"    ],\n" +
"    interviewNotes: [],\n" +
"    practiceProblems: [],\n" +
"    relatedTopics: ['Pruning', 'Arrays']\n" +
"  },\n" +
"\n" +
"  'letter-combinations': {\n" +
"    title: 'Letter Combinations of a Phone Number',\n" +
"    problem: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. A mapping of digits to letters (just like on the telephone buttons) is given.',\n" +
"    intuition: 'We map each digit to its corresponding letters. For each digit, we loop through its letters, append it to our current combination, and recursively process the next digit.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(4^N)', description: 'Where N is the length of digits. Max 4 letters per digit (7 and 9).' },\n" +
"      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion depth is N.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def letterCombinations(digits):\\n    if not digits: return []\\n    \\n    phone = {\"2\":\"abc\", \"3\":\"def\", \"4\":\"ghi\", \"5\":\"jkl\", \\n             \"6\":\"mno\", \"7\":\"pqrs\", \"8\":\"tuv\", \"9\":\"wxyz\"}\\n    res = []\\n    \\n    def backtrack(idx, current):\\n        if idx == len(digits):\\n            res.append(current)\\n            return\\n            \\n        for letter in phone[digits[idx]]:\\n            backtrack(idx + 1, current + letter)\\n            \\n    backtrack(0, \"\")\\n    return res`,\n" +
"      javascript: `function letterCombinations(digits) {\\n    if (!digits) return [];\\n    \\n    const phone = {\\n        \"2\": \"abc\", \"3\": \"def\", \"4\": \"ghi\", \"5\": \"jkl\",\\n        \"6\": \"mno\", \"7\": \"pqrs\", \"8\": \"tuv\", \"9\": \"wxyz\"\\n    };\\n    const res = [];\\n    \\n    function backtrack(idx, current) {\\n        if (idx === digits.length) {\\n            res.push(current);\\n            return;\\n        }\\n        \\n        for (const char of phone[digits[idx]]) {\\n            backtrack(idx + 1, current + char);\\n        }\\n    }\\n    \\n    backtrack(0, \"\");\\n    return res;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Check length', notes: 'If digits is empty, immediately return empty list.' }\n" +
"    ],\n" +
"    commonMistakes: [],\n" +
"    interviewNotes: [],\n" +
"    practiceProblems: [],\n" +
"    relatedTopics: ['Hash Map', 'String']\n" +
"  },\n" +
"\n" +
"  'palindrome-partitioning': {\n" +
"    title: 'Palindrome Partitioning',\n" +
"    problem: 'Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.',\n" +
"    intuition: 'Iterate through the string. At each step, extract a prefix. If the prefix is a palindrome, recursively partition the remaining suffix. If it is not a palindrome, prune the branch.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(N * 2^N)', description: '2^N possible partitions. Checking palindrome takes O(N).' },\n" +
"      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion stack depth.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def partition(s):\\n    res = []\\n    \\n    def is_palindrome(start, end):\\n        while start < end:\\n            if s[start] != s[end]:\\n                return False\\n            start += 1\\n            end -= 1\\n        return True\\n        \\n    def backtrack(start, current):\\n        if start == len(s):\\n            res.append(current[:])\\n            return\\n            \\n        for end in range(start, len(s)):\\n            if is_palindrome(start, end):\\n                current.append(s[start:end+1])\\n                backtrack(end + 1, current)\\n                current.pop()\\n                \\n    backtrack(0, [])\\n    return res`,\n" +
"      javascript: `function partition(s) {\\n    const res = [];\\n    \\n    function isPalindrome(left, right) {\\n        while (left < right) {\\n            if (s[left] !== s[right]) return false;\\n            left++; right--;\\n        }\\n        return true;\\n    }\\n    \\n    function backtrack(start, current) {\\n        if (start === s.length) {\\n            res.push([...current]);\\n            return;\\n        }\\n        \\n        for (let end = start; end < s.length; end++) {\\n            if (isPalindrome(start, end)) {\\n                current.push(s.slice(start, end + 1));\\n                backtrack(end + 1, current);\\n                current.pop();\\n            }\\n        }\\n    }\\n    \\n    backtrack(0, []);\\n    return res;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Check prefix', notes: 'If prefix is palindrome, branch down.' }\n" +
"    ],\n" +
"    commonMistakes: [\n" +
"      { mistake: 'String slicing overhead', fix: 'Avoid creating new strings for palindrome checks. Use pointer indices directly on the main string.' }\n" +
"    ],\n" +
"    interviewNotes: [\n" +
"      { tip: 'DP Optimization', description: 'You can precompute all palindromes using DP in O(N^2) to make the check O(1) during backtracking.' }\n" +
"    ],\n" +
"    practiceProblems: [],\n" +
"    relatedTopics: ['String', 'Dynamic Programming']\n" +
"  },\n" +
"\n" +
"  'word-search': {\n" +
"    title: 'Word Search',\n" +
"    problem: 'Given an m x n grid of characters and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',\n" +
"    intuition: 'We iterate through each cell. If the cell matches the first letter of the word, we start a Depth First Search (DFS). During DFS, we mark the cell as visited, explore all 4 directions, and backtrack by unmarking the cell if no path works.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(N * M * 4^L)', description: 'Where L is the length of the word.' },\n" +
"      { name: 'Space Complexity', value: 'O(L)', description: 'Recursion depth is the length of the word.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def exist(board, word):\\n    ROWS, COLS = len(board), len(board[0])\\n    \\n    def dfs(r, c, i):\\n        if i == len(word):\\n            return True\\n        if (r < 0 or c < 0 or \\n            r >= ROWS or c >= COLS or \\n            word[i] != board[r][c]):\\n            return False\\n            \\n        # Mark as visited\\n        temp = board[r][c]\\n        board[r][c] = '#'\\n        \\n        # Explore 4 directions\\n        res = (dfs(r+1, c, i+1) or\\n               dfs(r-1, c, i+1) or\\n               dfs(r, c+1, i+1) or\\n               dfs(r, c-1, i+1))\\n               \\n        # Backtrack\\n        board[r][c] = temp\\n        return res\\n        \\n    for r in range(ROWS):\\n        for c in range(COLS):\\n            if dfs(r, c, 0): return True\\n            \\n    return False`,\n" +
"      javascript: `function exist(board, word) {\\n    const ROWS = board.length, COLS = board[0].length;\\n    \\n    function dfs(r, c, i) {\\n        if (i === word.length) return true;\\n        if (r < 0 || c < 0 || r >= ROWS || c >= COLS || board[r][c] !== word[i]) {\\n            return false;\\n        }\\n        \\n        const temp = board[r][c];\\n        board[r][c] = '#'; // Mark visited\\n        \\n        const found = dfs(r+1, c, i+1) || \\n                      dfs(r-1, c, i+1) || \\n                      dfs(r, c+1, i+1) || \\n                      dfs(r, c-1, i+1);\\n                      \\n        board[r][c] = temp; // Backtrack\\n        return found;\\n    }\\n    \\n    for (let r = 0; r < ROWS; r++) {\\n        for (let c = 0; c < COLS; c++) {\\n            if (dfs(r, c, 0)) return true;\\n        }\\n    }\\n    return false;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Check bounds and match', notes: 'Fail immediately if out of bounds or letter mismatch.' },\n" +
"      { step: 'In-place modification', notes: 'Temporarily change character to # to prevent cycles.' }\n" +
"    ],\n" +
"    commonMistakes: [\n" +
"      { mistake: 'Using a visited set', fix: 'A visited set requires extra O(N*M) space and hashing overhead. In-place modification is much faster.' }\n" +
"    ],\n" +
"    interviewNotes: [],\n" +
"    practiceProblems: [\n" +
"      { name: 'Word Search II', link: 'https://leetcode.com/problems/word-search-ii/' }\n" +
"    ],\n" +
"    relatedTopics: ['Matrix', 'DFS']\n" +
"  },\n" +
"\n" +
"  'm-coloring': {\n" +
"    title: 'M Coloring Problem',\n" +
"    problem: 'Given an undirected graph and an integer M, determine if the graph can be colored with at most M colors such that no two adjacent vertices share the same color.',\n" +
"    intuition: 'Try coloring the first vertex with color 1. Then recursively try to color the next vertex with color 1. If it violates the constraint (a neighbor has color 1), try color 2, etc. If no color works, backtrack.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(M^V)', description: 'For each of the V vertices, we try M colors.' },\n" +
"      { name: 'Space Complexity', value: 'O(V)', description: 'To store the colors array and the recursion stack.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def graphColoring(graph, m, V):\\n    color = [0] * V\\n    \\n    def isSafe(node, c):\\n        for neighbor in range(V):\\n            if graph[node][neighbor] == 1 and color[neighbor] == c:\\n                return False\\n        return True\\n        \\n    def solve(node):\\n        if node == V:\\n            return True\\n            \\n        for c in range(1, m + 1):\\n            if isSafe(node, c):\\n                color[node] = c\\n                if solve(node + 1):\\n                    return True\\n                color[node] = 0 # backtrack\\n                \\n        return False\\n        \\n    return solve(0)`,\n" +
"      javascript: `function graphColoring(graph, m, V) {\\n    const color = new Array(V).fill(0);\\n    \\n    function isSafe(node, c) {\\n        for (let i = 0; i < V; i++) {\\n            if (graph[node][i] === 1 && color[i] === c) {\\n                return false;\\n            }\\n        }\\n        return true;\\n    }\\n    \\n    function solve(node) {\\n        if (node === V) return true;\\n        \\n        for (let c = 1; c <= m; c++) {\\n            if (isSafe(node, c)) {\\n                color[node] = c;\\n                if (solve(node + 1)) return true;\\n                color[node] = 0; // backtrack\\n            }\\n        }\\n        return false;\\n    }\\n    \\n    return solve(0);\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Check safety', notes: 'Ensure no adjacent node has the same color before assigning.' }\n" +
"    ],\n" +
"    commonMistakes: [],\n" +
"    interviewNotes: [],\n" +
"    practiceProblems: [],\n" +
"    relatedTopics: ['Graph', 'Constraints']\n" +
"  },\n" +
"\n" +
"  'restore-ip-addresses': {\n" +
"    title: 'Restore IP Addresses',\n" +
"    problem: 'A valid IP address consists of exactly four integers separated by single dots. Each integer is between 0 and 255 and cannot have leading zeros. Given a string s containing only digits, return all possible valid IP addresses that can be formed.',\n" +
"    intuition: 'We need to place exactly 3 dots. At each step, we can grab 1, 2, or 3 digits. We check if the extracted segment is a valid integer (<= 255) and has no leading zeroes. If valid, recurse.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(1)', description: 'The maximum length of a valid IP string is 12. So the tree height is bounded.' },\n" +
"      { name: 'Space Complexity', value: 'O(1)', description: 'Output list size is bounded, recursion stack is max 4.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def restoreIpAddresses(s):\\n    res = []\\n    \\n    def backtrack(i, dots, currentIP):\\n        if dots == 4 and i == len(s):\\n            res.append(currentIP[:-1])\\n            return\\n        if dots > 4:\\n            return\\n            \\n        for j in range(i, min(i + 3, len(s))):\\n            part = s[i:j+1]\\n            if int(part) <= 255 and (i == j or part[0] != \"0\"):\\n                backtrack(j + 1, dots + 1, currentIP + part + \".\")\\n                \\n    backtrack(0, 0, \"\")\\n    return res`,\n" +
"      javascript: `function restoreIpAddresses(s) {\\n    const res = [];\\n    \\n    function backtrack(i, dots, currentIP) {\\n        if (dots === 4 && i === s.length) {\\n            res.push(currentIP.slice(0, -1));\\n            return;\\n        }\\n        if (dots > 4) return;\\n        \\n        for (let j = i; j < Math.min(i + 3, s.length); j++) {\\n            const part = s.substring(i, j + 1);\\n            if (parseInt(part) <= 255 && (i === j || part[0] !== '0')) {\\n                backtrack(j + 1, dots + 1, currentIP + part + '.');\\n            }\\n        }\\n    }\\n    \\n    backtrack(0, 0, \"\");\\n    return res;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Check bounds', notes: 'Ensure string part is <= 255.' },\n" +
"      { step: 'Leading zero check', notes: '\"01\" is invalid, but \"0\" is valid.' }\n" +
"    ],\n" +
"    commonMistakes: [\n" +
"      { mistake: 'Validating after generation', fix: 'Prune branches IMMEDIATELY if the number > 255 or has a leading zero.' }\n" +
"    ],\n" +
"    interviewNotes: [],\n" +
"    practiceProblems: [],\n" +
"    relatedTopics: ['String', 'Parsing']\n" +
"  },\n" +
"\n" +
"  'beautiful-arrangement': {\n" +
"    title: 'Beautiful Arrangement',\n" +
"    problem: 'Suppose you have n integers labeled 1 through n. A permutation of those n integers perm (1-indexed) is considered a beautiful arrangement if for every i (1 <= i <= n), either perm[i] is divisible by i, or i is divisible by perm[i]. Return the number of the beautiful arrangements.',\n" +
"    intuition: 'We can generate permutations one position at a time. At position i, we iterate through all available unvisited numbers. If the divisibility condition holds, we place the number, mark it visited, and recurse to i+1.',\n" +
"    complexities: [\n" +
"      { name: 'Time Complexity', value: 'O(K)', description: 'Where K is the number of valid permutations.' },\n" +
"      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion depth is N.' }\n" +
"    ],\n" +
"    code: {\n" +
"      python: `def countArrangement(n):\\n    visited = set()\\n    res = 0\\n    \\n    def backtrack(i):\\n        nonlocal res\\n        if i > n:\\n            res += 1\\n            return\\n            \\n        for num in range(1, n + 1):\\n            if num not in visited and (num % i == 0 or i % num == 0):\\n                visited.add(num)\\n                backtrack(i + 1)\\n                visited.remove(num)\\n                \\n    backtrack(1)\\n    return res`,\n" +
"      javascript: `function countArrangement(n) {\\n    const visited = new Set();\\n    let res = 0;\\n    \\n    function backtrack(i) {\\n        if (i > n) {\\n            res++;\\n            return;\\n        }\\n        \\n        for (let num = 1; num <= n; num++) {\\n            if (!visited.has(num) && (num % i === 0 || i % num === 0)) {\\n                visited.add(num);\\n                backtrack(i + 1);\\n                visited.delete(num);\\n            }\\n        }\\n    }\\n    \\n    backtrack(1);\\n    return res;\\n}`\n" +
"    },\n" +
"    dryRun: [\n" +
"      { step: 'Check divisibility', notes: 'Only branch out if num % i == 0 OR i % num == 0.' }\n" +
"    ],\n" +
"    commonMistakes: [],\n" +
"    interviewNotes: [\n" +
"      { tip: 'Bitmask Optimization', description: 'Instead of using a Set for visited, use a bitmask (an integer where the nth bit represents if n is visited). It makes the checks O(1) and ultra-fast.' }\n" +
"    ],\n" +
"    practiceProblems: [],\n" +
"    relatedTopics: ['Math', 'Permutations']\n" +
"  }\n";

content = content.replace(/};\s*$/, `\n${backtrackingData}\n};\n`);
fs.writeFileSync(targetPath, content);
console.log('Successfully injected Backtracking data into algorithmContent.ts');
