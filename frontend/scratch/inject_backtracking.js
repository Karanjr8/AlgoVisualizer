const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'data', 'algorithmContent.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const backtrackingData = `
  'generate-subsets': {
    title: 'Generate Subsets (Power Set)',
    problem: 'Given an integer array of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',
    intuition: 'At each element, we have two choices: either include the element in the current subset, or exclude it. We branch out into two paths for every element, leading to 2^N possible subsets.',
    complexities: [
      { name: 'Time Complexity', value: 'O(N * 2^N)', description: 'There are 2^N subsets, and for each subset, it takes O(N) time to construct it (copying the array).' },
      { name: 'Space Complexity', value: 'O(N)', description: 'The recursion stack takes O(N) space, where N is the number of elements.' }
    ],
    code: {
      python: \`def subsets(nums):
    res = []
    
    def backtrack(idx, current):
        if idx == len(nums):
            res.append(current[:])
            return
            
        # Decision 1: Include nums[idx]
        current.append(nums[idx])
        backtrack(idx + 1, current)
        
        # Undo choice
        current.pop()
        
        # Decision 2: Exclude nums[idx]
        backtrack(idx + 1, current)
        
    backtrack(0, [])
    return res\`,
      java: \`class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(0, nums, new ArrayList<>(), res);
        return res;
    }
    
    private void backtrack(int idx, int[] nums, List<Integer> current, List<List<Integer>> res) {
        if (idx == nums.length) {
            res.add(new ArrayList<>(current));
            return;
        }
        
        // Include
        current.add(nums[idx]);
        backtrack(idx + 1, nums, current, res);
        
        // Undo and Exclude
        current.remove(current.size() - 1);
        backtrack(idx + 1, nums, current, res);
    }
}\`,
      cpp: \`class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> current;
        backtrack(0, nums, current, res);
        return res;
    }
    
    void backtrack(int idx, vector<int>& nums, vector<int>& current, vector<vector<int>>& res) {
        if (idx == nums.size()) {
            res.push_back(current);
            return;
        }
        
        current.push_back(nums[idx]);
        backtrack(idx + 1, nums, current, res);
        
        current.pop_back();
        backtrack(idx + 1, nums, current, res);
    }
};\`,
      javascript: \`function subsets(nums) {
    const res = [];
    
    function backtrack(idx, current) {
        if (idx === nums.length) {
            res.push([...current]);
            return;
        }
        
        current.push(nums[idx]);
        backtrack(idx + 1, current);
        
        current.pop();
        backtrack(idx + 1, current);
    }
    
    backtrack(0, []);
    return res;
}\`
    },
    dryRun: [
      { step: 'Start at index 0 with empty subset []', notes: 'Choices: include or exclude 1' },
      { step: 'Include 1', notes: 'current = [1]' },
      { step: 'Move to index 1', notes: 'Choices: include or exclude 2' },
      { step: 'Base Case Reached', notes: 'Record current subset' }
    ],
    commonMistakes: [
      { mistake: 'Not copying the subset', fix: 'Always push a copy of the current array into the result, e.g., current[:] or [...current].' },
      { mistake: 'Forgetting to pop', fix: 'After returning from the recursive call where you included the element, you must pop it out to backtrack.' }
    ],
    interviewNotes: [
      { tip: 'Bit Manipulation Alternative', description: 'Since there are 2^N subsets, you can use a loop from 0 to 2^N-1 and use the bits to decide which elements to include.' }
    ],
    practiceProblems: [
      { name: 'Subsets II', link: 'https://leetcode.com/problems/subsets-ii/' }
    ],
    relatedTopics: ['Bit Manipulation', 'Recursion']
  },

  'generate-subsequences': {
    title: 'Generate Subsequences',
    problem: 'Given a string, find all of its possible subsequences. A subsequence is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.',
    intuition: 'This is identical in structure to generating subsets of an array. For each character in the string, we have a choice to either pick it or drop it.',
    complexities: [
      { name: 'Time Complexity', value: 'O(2^N)', description: '2^N possible subsequences.' },
      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion depth is N.' }
    ],
    code: {
      python: \`def generate_subsequences(s):
    res = []
    
    def backtrack(idx, current):
        if idx == len(s):
            res.append(current)
            return
            
        # Include character
        backtrack(idx + 1, current + s[idx])
        
        # Exclude character
        backtrack(idx + 1, current)
        
    backtrack(0, "")
    return res\`,
      javascript: \`function subsequences(s) {
    const res = [];
    
    function backtrack(idx, current) {
        if (idx === s.length) {
            res.push(current);
            return;
        }
        
        backtrack(idx + 1, current + s[idx]);
        backtrack(idx + 1, current);
    }
    
    backtrack(0, "");
    return res;
}\`
    },
    dryRun: [
      { step: 'Start index 0', notes: 'Include/exclude first char' }
    ],
    commonMistakes: [
      { mistake: 'Strings vs Arrays', fix: 'In some languages strings are immutable, so appending creates a new copy automatically. Be mindful of space.' }
    ],
    interviewNotes: [],
    practiceProblems: [],
    relatedTopics: ['Subsets', 'String']
  },

  'generate-permutations': {
    title: 'Generate Permutations',
    problem: 'Given an array of distinct integers, return all the possible permutations. You can return the answer in any order.',
    intuition: 'At each position, any of the remaining unused elements can be placed. We can maintain a boolean array to track which elements are used, or we can simply swap elements in-place to explore different permutations.',
    complexities: [
      { name: 'Time Complexity', value: 'O(N * N!)', description: 'N! permutations, and copying each takes O(N).' },
      { name: 'Space Complexity', value: 'O(N)', description: 'In-place swap method uses O(N) stack space.' }
    ],
    code: {
      python: \`def permute(nums):
    res = []
    
    def backtrack(first):
        if first == len(nums):
            res.append(nums[:])
            return
            
        for i in range(first, len(nums)):
            nums[first], nums[i] = nums[i], nums[first]
            backtrack(first + 1)
            nums[first], nums[i] = nums[i], nums[first] # backtrack
            
    backtrack(0)
    return res\`,
      java: \`class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, res);
        return res;
    }
    
    private void backtrack(int[] nums, int first, List<List<Integer>> res) {
        if (first == nums.length) {
            List<Integer> current = new ArrayList<>();
            for (int n : nums) current.add(n);
            res.add(current);
            return;
        }
        
        for (int i = first; i < nums.length; i++) {
            swap(nums, first, i);
            backtrack(nums, first + 1, res);
            swap(nums, first, i);
        }
    }
    
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i]; nums[i] = nums[j]; nums[j] = temp;
    }
}\`,
      javascript: \`function permute(nums) {
    const res = [];
    
    function backtrack(first) {
        if (first === nums.length) {
            res.push([...nums]);
            return;
        }
        
        for (let i = first; i < nums.length; i++) {
            [nums[first], nums[i]] = [nums[i], nums[first]];
            backtrack(first + 1);
            [nums[first], nums[i]] = [nums[i], nums[first]];
        }
    }
    
    backtrack(0);
    return res;
}\`
    },
    dryRun: [
      { step: 'Start at first index 0', notes: 'Try swapping index 0 with 0, 1, 2...' },
      { step: 'Recurse to index 1', notes: 'Lock in index 0, try swapping index 1 with 1, 2...' }
    ],
    commonMistakes: [
      { mistake: 'Passing by reference', fix: 'Remember to copy the array when pushing to the results list.' }
    ],
    interviewNotes: [
      { tip: 'In-place swapping', description: 'The swapping method is highly preferred in interviews because it avoids the O(N) extra space needed for a "visited" array.' }
    ],
    practiceProblems: [
      { name: 'Permutations II', link: 'https://leetcode.com/problems/permutations-ii/' }
    ],
    relatedTopics: ['Recursion', 'Array']
  },

  'combination-sum': {
    title: 'Combination Sum',
    problem: 'Given an array of distinct integers and a target integer, return a list of all unique combinations where the chosen numbers sum to target. The same number may be chosen an unlimited number of times.',
    intuition: 'Similar to subsets, but we can reuse the same element. To prevent infinite loops and permutations, we decide whether to pick the current element (and stay at the same index) or skip the current element (and move to the next index).',
    complexities: [
      { name: 'Time Complexity', value: 'O(N^(T/M))', description: 'Where T is target and M is the minimal value in candidates.' },
      { name: 'Space Complexity', value: 'O(T/M)', description: 'Maximum depth of the recursion tree.' }
    ],
    code: {
      python: \`def combinationSum(candidates, target):
    res = []
    
    def backtrack(idx, current, current_sum):
        if current_sum == target:
            res.append(current[:])
            return
        if current_sum > target or idx >= len(candidates):
            return
            
        # Pick the element (stay at same index)
        current.append(candidates[idx])
        backtrack(idx, current, current_sum + candidates[idx])
        current.pop()
        
        # Skip the element
        backtrack(idx + 1, current, current_sum)
        
    backtrack(0, [], 0)
    return res\`,
      javascript: \`function combinationSum(candidates, target) {
    const res = [];
    
    function backtrack(idx, current, sum) {
        if (sum === target) {
            res.push([...current]);
            return;
        }
        if (sum > target || idx >= candidates.length) return;
        
        current.push(candidates[idx]);
        backtrack(idx, current, sum + candidates[idx]);
        current.pop();
        
        backtrack(idx + 1, current, sum);
    }
    
    backtrack(0, [], 0);
    return res;
}\`
    },
    dryRun: [
      { step: 'Check constraints', notes: 'If sum > target, prune this branch immediately.' }
    ],
    commonMistakes: [
      { mistake: 'Generating Permutations instead of Combinations', fix: 'Only explore elements from the CURRENT index onwards, never backwards.' }
    ],
    interviewNotes: [
      { tip: 'Sorting Optimization', description: 'Sorting the candidates first allows you to break early inside the loop if the sum exceeds the target.' }
    ],
    practiceProblems: [],
    relatedTopics: ['Pruning', 'Arrays']
  },

  'combination-sum-ii': {
    title: 'Combination Sum II',
    problem: 'Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations where the candidate numbers sum to target. Each number may only be used ONCE. The solution set must not contain duplicate combinations.',
    intuition: 'We must sort the array first. When exploring branches, if we skip an element, we must skip all subsequent identical elements at that level to avoid generating duplicate combinations.',
    complexities: [
      { name: 'Time Complexity', value: 'O(2^N)', description: 'Worst case explores all subsets.' },
      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion depth.' }
    ],
    code: {
      python: \`def combinationSum2(candidates, target):
    candidates.sort()
    res = []
    
    def backtrack(idx, current, target):
        if target == 0:
            res.append(current[:])
            return
        if target < 0:
            return
            
        for i in range(idx, len(candidates)):
            # Skip duplicates at the same tree level
            if i > idx and candidates[i] == candidates[i-1]:
                continue
            
            current.append(candidates[i])
            backtrack(i + 1, current, target - candidates[i])
            current.pop()
            
    backtrack(0, [], target)
    return res\`,
      javascript: \`function combinationSum2(candidates, target) {
    candidates.sort((a, b) => a - b);
    const res = [];
    
    function backtrack(idx, current, target) {
        if (target === 0) {
            res.push([...current]);
            return;
        }
        if (target < 0) return;
        
        for (let i = idx; i < candidates.length; i++) {
            if (i > idx && candidates[i] === candidates[i-1]) continue;
            
            current.push(candidates[i]);
            backtrack(i + 1, current, target - candidates[i]);
            current.pop();
        }
    }
    
    backtrack(0, [], target);
    return res;
}\`
    },
    dryRun: [
      { step: 'Sort candidates', notes: 'Required for grouping duplicates together.' },
      { step: 'Skip condition', notes: 'if (i > idx && arr[i] == arr[i-1]) continue;' }
    ],
    commonMistakes: [
      { mistake: 'Using a Set for deduplication', fix: 'Sets are slow and memory intensive. Sorting and skipping at the same tree level is the optimal way.' }
    ],
    interviewNotes: [],
    practiceProblems: [],
    relatedTopics: ['Pruning', 'Arrays']
  },

  'letter-combinations': {
    title: 'Letter Combinations of a Phone Number',
    problem: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. A mapping of digits to letters (just like on the telephone buttons) is given.',
    intuition: 'We map each digit to its corresponding letters. For each digit, we loop through its letters, append it to our current combination, and recursively process the next digit.',
    complexities: [
      { name: 'Time Complexity', value: 'O(4^N)', description: 'Where N is the length of digits. Max 4 letters per digit (7 and 9).' },
      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion depth is N.' }
    ],
    code: {
      python: \`def letterCombinations(digits):
    if not digits: return []
    
    phone = {"2":"abc", "3":"def", "4":"ghi", "5":"jkl", 
             "6":"mno", "7":"pqrs", "8":"tuv", "9":"wxyz"}
    res = []
    
    def backtrack(idx, current):
        if idx == len(digits):
            res.append(current)
            return
            
        for letter in phone[digits[idx]]:
            backtrack(idx + 1, current + letter)
            
    backtrack(0, "")
    return res\`,
      javascript: \`function letterCombinations(digits) {
    if (!digits) return [];
    
    const phone = {
        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"
    };
    const res = [];
    
    function backtrack(idx, current) {
        if (idx === digits.length) {
            res.push(current);
            return;
        }
        
        for (const char of phone[digits[idx]]) {
            backtrack(idx + 1, current + char);
        }
    }
    
    backtrack(0, "");
    return res;
}\`
    },
    dryRun: [
      { step: 'Check length', notes: 'If digits is empty, immediately return empty list.' }
    ],
    commonMistakes: [],
    interviewNotes: [],
    practiceProblems: [],
    relatedTopics: ['Hash Map', 'String']
  },

  'palindrome-partitioning': {
    title: 'Palindrome Partitioning',
    problem: 'Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.',
    intuition: 'Iterate through the string. At each step, extract a prefix. If the prefix is a palindrome, recursively partition the remaining suffix. If it is not a palindrome, prune the branch.',
    complexities: [
      { name: 'Time Complexity', value: 'O(N * 2^N)', description: '2^N possible partitions. Checking palindrome takes O(N).' },
      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion stack depth.' }
    ],
    code: {
      python: \`def partition(s):
    res = []
    
    def is_palindrome(start, end):
        while start < end:
            if s[start] != s[end]:
                return False
            start += 1
            end -= 1
        return True
        
    def backtrack(start, current):
        if start == len(s):
            res.append(current[:])
            return
            
        for end in range(start, len(s)):
            if is_palindrome(start, end):
                current.append(s[start:end+1])
                backtrack(end + 1, current)
                current.pop()
                
    backtrack(0, [])
    return res\`,
      javascript: \`function partition(s) {
    const res = [];
    
    function isPalindrome(left, right) {
        while (left < right) {
            if (s[left] !== s[right]) return false;
            left++; right--;
        }
        return true;
    }
    
    function backtrack(start, current) {
        if (start === s.length) {
            res.push([...current]);
            return;
        }
        
        for (let end = start; end < s.length; end++) {
            if (isPalindrome(start, end)) {
                current.push(s.slice(start, end + 1));
                backtrack(end + 1, current);
                current.pop();
            }
        }
    }
    
    backtrack(0, []);
    return res;
}\`
    },
    dryRun: [
      { step: 'Check prefix', notes: 'If prefix is palindrome, branch down.' }
    ],
    commonMistakes: [
      { mistake: 'String slicing overhead', fix: 'Avoid creating new strings for palindrome checks. Use pointer indices directly on the main string.' }
    ],
    interviewNotes: [
      { tip: 'DP Optimization', description: 'You can precompute all palindromes using DP in O(N^2) to make the check O(1) during backtracking.' }
    ],
    practiceProblems: [],
    relatedTopics: ['String', 'Dynamic Programming']
  },

  'word-search': {
    title: 'Word Search',
    problem: 'Given an m x n grid of characters and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    intuition: 'We iterate through each cell. If the cell matches the first letter of the word, we start a Depth First Search (DFS). During DFS, we mark the cell as visited, explore all 4 directions, and backtrack by unmarking the cell if no path works.',
    complexities: [
      { name: 'Time Complexity', value: 'O(N * M * 4^L)', description: 'Where L is the length of the word.' },
      { name: 'Space Complexity', value: 'O(L)', description: 'Recursion depth is the length of the word.' }
    ],
    code: {
      python: \`def exist(board, word):
    ROWS, COLS = len(board), len(board[0])
    
    def dfs(r, c, i):
        if i == len(word):
            return True
        if (r < 0 or c < 0 or 
            r >= ROWS or c >= COLS or 
            word[i] != board[r][c]):
            return False
            
        # Mark as visited
        temp = board[r][c]
        board[r][c] = '#'
        
        # Explore 4 directions
        res = (dfs(r+1, c, i+1) or
               dfs(r-1, c, i+1) or
               dfs(r, c+1, i+1) or
               dfs(r, c-1, i+1))
               
        # Backtrack
        board[r][c] = temp
        return res
        
    for r in range(ROWS):
        for c in range(COLS):
            if dfs(r, c, 0): return True
            
    return False\`,
      javascript: \`function exist(board, word) {
    const ROWS = board.length, COLS = board[0].length;
    
    function dfs(r, c, i) {
        if (i === word.length) return true;
        if (r < 0 || c < 0 || r >= ROWS || c >= COLS || board[r][c] !== word[i]) {
            return false;
        }
        
        const temp = board[r][c];
        board[r][c] = '#'; // Mark visited
        
        const found = dfs(r+1, c, i+1) || 
                      dfs(r-1, c, i+1) || 
                      dfs(r, c+1, i+1) || 
                      dfs(r, c-1, i+1);
                      
        board[r][c] = temp; // Backtrack
        return found;
    }
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    return false;
}\`
    },
    dryRun: [
      { step: 'Check bounds and match', notes: 'Fail immediately if out of bounds or letter mismatch.' },
      { step: 'In-place modification', notes: 'Temporarily change character to # to prevent cycles.' }
    ],
    commonMistakes: [
      { mistake: 'Using a visited set', fix: 'A visited set requires extra O(N*M) space and hashing overhead. In-place modification is much faster.' }
    ],
    interviewNotes: [],
    practiceProblems: [
      { name: 'Word Search II', link: 'https://leetcode.com/problems/word-search-ii/' }
    ],
    relatedTopics: ['Matrix', 'DFS']
  },

  'm-coloring': {
    title: 'M Coloring Problem',
    problem: 'Given an undirected graph and an integer M, determine if the graph can be colored with at most M colors such that no two adjacent vertices share the same color.',
    intuition: 'Try coloring the first vertex with color 1. Then recursively try to color the next vertex with color 1. If it violates the constraint (a neighbor has color 1), try color 2, etc. If no color works, backtrack.',
    complexities: [
      { name: 'Time Complexity', value: 'O(M^V)', description: 'For each of the V vertices, we try M colors.' },
      { name: 'Space Complexity', value: 'O(V)', description: 'To store the colors array and the recursion stack.' }
    ],
    code: {
      python: \`def graphColoring(graph, m, V):
    color = [0] * V
    
    def isSafe(node, c):
        for neighbor in range(V):
            if graph[node][neighbor] == 1 and color[neighbor] == c:
                return False
        return True
        
    def solve(node):
        if node == V:
            return True
            
        for c in range(1, m + 1):
            if isSafe(node, c):
                color[node] = c
                if solve(node + 1):
                    return True
                color[node] = 0 # backtrack
                
        return False
        
    return solve(0)\`,
      javascript: \`function graphColoring(graph, m, V) {
    const color = new Array(V).fill(0);
    
    function isSafe(node, c) {
        for (let i = 0; i < V; i++) {
            if (graph[node][i] === 1 && color[i] === c) {
                return false;
            }
        }
        return true;
    }
    
    function solve(node) {
        if (node === V) return true;
        
        for (let c = 1; c <= m; c++) {
            if (isSafe(node, c)) {
                color[node] = c;
                if (solve(node + 1)) return true;
                color[node] = 0; // backtrack
            }
        }
        return false;
    }
    
    return solve(0);
}\`
    },
    dryRun: [
      { step: 'Check safety', notes: 'Ensure no adjacent node has the same color before assigning.' }
    ],
    commonMistakes: [],
    interviewNotes: [],
    practiceProblems: [],
    relatedTopics: ['Graph', 'Constraints']
  },

  'restore-ip-addresses': {
    title: 'Restore IP Addresses',
    problem: 'A valid IP address consists of exactly four integers separated by single dots. Each integer is between 0 and 255 and cannot have leading zeros. Given a string s containing only digits, return all possible valid IP addresses that can be formed.',
    intuition: 'We need to place exactly 3 dots. At each step, we can grab 1, 2, or 3 digits. We check if the extracted segment is a valid integer (<= 255) and has no leading zeroes. If valid, recurse.',
    complexities: [
      { name: 'Time Complexity', value: 'O(1)', description: 'The maximum length of a valid IP string is 12. So the tree height is bounded.' },
      { name: 'Space Complexity', value: 'O(1)', description: 'Output list size is bounded, recursion stack is max 4.' }
    ],
    code: {
      python: \`def restoreIpAddresses(s):
    res = []
    
    def backtrack(i, dots, currentIP):
        if dots == 4 and i == len(s):
            res.append(currentIP[:-1])
            return
        if dots > 4:
            return
            
        for j in range(i, min(i + 3, len(s))):
            part = s[i:j+1]
            if int(part) <= 255 and (i == j or part[0] != "0"):
                backtrack(j + 1, dots + 1, currentIP + part + ".")
                
    backtrack(0, 0, "")
    return res\`,
      javascript: \`function restoreIpAddresses(s) {
    const res = [];
    
    function backtrack(i, dots, currentIP) {
        if (dots === 4 && i === s.length) {
            res.push(currentIP.slice(0, -1));
            return;
        }
        if (dots > 4) return;
        
        for (let j = i; j < Math.min(i + 3, s.length); j++) {
            const part = s.substring(i, j + 1);
            if (parseInt(part) <= 255 && (i === j || part[0] !== '0')) {
                backtrack(j + 1, dots + 1, currentIP + part + '.');
            }
        }
    }
    
    backtrack(0, 0, "");
    return res;
}\`
    },
    dryRun: [
      { step: 'Check bounds', notes: 'Ensure string part is <= 255.' },
      { step: 'Leading zero check', notes: '"01" is invalid, but "0" is valid.' }
    ],
    commonMistakes: [
      { mistake: 'Validating after generation', fix: 'Prune branches IMMEDIATELY if the number > 255 or has a leading zero.' }
    ],
    interviewNotes: [],
    practiceProblems: [],
    relatedTopics: ['String', 'Parsing']
  },

  'beautiful-arrangement': {
    title: 'Beautiful Arrangement',
    problem: 'Suppose you have n integers labeled 1 through n. A permutation of those n integers perm (1-indexed) is considered a beautiful arrangement if for every i (1 <= i <= n), either perm[i] is divisible by i, or i is divisible by perm[i]. Return the number of the beautiful arrangements.',
    intuition: 'We can generate permutations one position at a time. At position `i`, we iterate through all available unvisited numbers. If the divisibility condition holds, we place the number, mark it visited, and recurse to `i+1`.',
    complexities: [
      { name: 'Time Complexity', value: 'O(K)', description: 'Where K is the number of valid permutations.' },
      { name: 'Space Complexity', value: 'O(N)', description: 'Recursion depth is N.' }
    ],
    code: {
      python: \`def countArrangement(n):
    visited = set()
    res = 0
    
    def backtrack(i):
        nonlocal res
        if i > n:
            res += 1
            return
            
        for num in range(1, n + 1):
            if num not in visited and (num % i == 0 or i % num == 0):
                visited.add(num)
                backtrack(i + 1)
                visited.remove(num)
                
    backtrack(1)
    return res\`,
      javascript: \`function countArrangement(n) {
    const visited = new Set();
    let res = 0;
    
    function backtrack(i) {
        if (i > n) {
            res++;
            return;
        }
        
        for (let num = 1; num <= n; num++) {
            if (!visited.has(num) && (num % i === 0 || i % num === 0)) {
                visited.add(num);
                backtrack(i + 1);
                visited.delete(num);
            }
        }
    }
    
    backtrack(1);
    return res;
}\`
    },
    dryRun: [
      { step: 'Check divisibility', notes: 'Only branch out if num % i == 0 OR i % num == 0.' }
    ],
    commonMistakes: [],
    interviewNotes: [
      { tip: 'Bitmask Optimization', description: 'Instead of using a Set for visited, use a bitmask (an integer where the nth bit represents if n is visited). It makes the checks O(1) and ultra-fast.' }
    ],
    practiceProblems: [],
    relatedTopics: ['Math', 'Permutations']
  }
`;

content = content.replace(/};\s*$/, `\n${backtrackingData}\n};\n`);
fs.writeFileSync(targetPath, content);
console.log('Successfully injected Backtracking data into algorithmContent.ts');
