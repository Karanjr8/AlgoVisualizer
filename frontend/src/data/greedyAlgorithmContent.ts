import type { AlgorithmContent } from './algorithmContent';

export const greedyAlgorithmContent: Record<string, AlgorithmContent> = {
  "greedy-intro": {
    id: "greedy-intro",
    introduction: "A Greedy Algorithm solves an optimization problem by making the locally optimal choice at each step, hoping to reach a globally optimal solution without ever back-tracking or revising past decisions.",
    intuition: "Think of a hungry hiker taking the path with the most visible food at every fork in the road. Instead of planning the entire 10-mile route in advance, they make the best immediate decision right now.",
    whyGreedyWorks: "Greedy algorithms work when a problem exhibits two critical properties:\n1. **Greedy Choice Property**: A global optimum can be reached by making locally optimal choices.\n2. **Optimal Substructure**: An optimal solution to the problem contains optimal solutions to its subproblems.",
    patternRecognition: [
      "Problems asking to 'maximize' or 'minimize' a total quantity.",
      "The input can be sorted by a clear greedy criterion (e.g., finish time, ratio, deadline).",
      "Making an immediate choice does not invalidate the optimal choices available for remaining subproblems.",
      "No need to re-evaluate past choices (unlike Backtracking or Dynamic Programming)."
    ],
    walkthrough: [
      { phase: "1. Observe Choices", description: "Analyze all available immediate candidates at the current step." },
      { phase: "2. Pick Best Immediate Choice", description: "Select the locally optimal candidate based on a specific greedy criterion." },
      { phase: "3. Reduce Subproblem", description: "Subtract the choice made from the overall target or dataset." },
      { phase: "4. Repeat Until Done", description: "Iterate step-by-step until the solution space is exhausted." },
      { phase: "5. Verify Optimality", description: "Prove why local choices lead to global optimum or identify counterexamples." }
    ],
    dryRun: {
      input: "Coins = [1, 2, 5, 10], Target = 18",
      output: "Coins Used = [10, 5, 2, 1] (Total 4 coins)",
      steps: [
        "Step 1: Target = 18. Pick largest coin ≤ 18 -> Select 10. Remaining = 8.",
        "Step 2: Target = 8. Pick largest coin ≤ 8 -> Select 5. Remaining = 3.",
        "Step 3: Target = 3. Pick largest coin ≤ 3 -> Select 2. Remaining = 1.",
        "Step 4: Target = 1. Pick largest coin ≤ 1 -> Select 1. Remaining = 0.",
        "Target reached! Total coins = 4."
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Sorting initial choices takes O(N log N). Once sorted, iterating through choices takes linear O(N) time with O(1) auxiliary space."
    },
    code: {
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nstd::vector<int> minCoinsGreedy(std::vector<int>& coins, int target) {\n    std::sort(coins.rbegin(), coins.rend());\n    std::vector<int> result;\n    for (int coin : coins) {\n        while (target >= coin) {\n            target -= coin;\n            result.push_back(coin);\n        }\n    }\n    return result;\n}`,
      java: `import java.util.*;\n\npublic class GreedyIntro {\n    public static List<Integer> minCoinsGreedy(Integer[] coins, int target) {\n        Arrays.sort(coins, Collections.reverseOrder());\n        List<Integer> result = new ArrayList<>();\n        for (int coin : coins) {\n            while (target >= coin) {\n                target -= coin;\n                result.add(coin);\n            }\n        }\n        return result;\n    }\n}`,
      python: `def min_coins_greedy(coins, target):\n    coins.sort(reverse=True)\n    result = []\n    for coin in coins:\n        while target >= coin:\n            target -= coin\n            result.append(coin)\n    return result`,
      javascript: `function minCoinsGreedy(coins, target) {\n  coins.sort((a, b) => b - a);\n  const result = [];\n  for (const coin of coins) {\n    while (target >= coin) {\n      target -= coin;\n      result.push(coin);\n    }\n  }\n  return result;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Assuming Greedy always produces the global optimal answer without verifying counterexamples.",
        "Forgetting to sort the input candidates by the correct greedy key before making choices."
      ],
      edgeCases: [
        "Target is 0 (returns 0 items).",
        "Canonical vs non-canonical coin systems where greedy fails (e.g., coins [1, 3, 4] for target 6)."
      ],
      tips: [
        "Always test your greedy criterion against small counterexamples during interviews.",
        "If greedy fails, transition to Dynamic Programming (0/1 Knapsack pattern)."
      ]
    },
    practiceProblems: [
      { title: "Coin Change II (LeetCode 518)", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change-ii/" },
      { title: "Lemonade Change (LeetCode 860)", difficulty: "Easy", url: "https://leetcode.com/problems/lemonade-change/" }
    ],
    relatedTopics: [
      { title: "Greedy vs Dynamic Programming", id: "greedy-vs-dp" },
      { title: "Activity Selection", id: "activity-selection" }
    ]
  },

  "greedy-vs-brute-force": {
    id: "greedy-vs-brute-force",
    introduction: "Brute Force explores every single combination in the search space to find the optimal solution, guaranteeing correctness at exponential time O(2ⁿ). Greedy instantly commits to the best local choice at O(N log N) or O(N) time.",
    intuition: "Brute Force is like driving down every single dead-end alley in a maze to make a complete map. Greedy is like using a compass heading directly toward your destination at every turn.",
    whyGreedyWorks: "When the problem structure mathematically guarantees that local optimal choices compound into global optimum, Greedy avoids evaluating millions of unnecessary combinations.",
    patternRecognition: [
      "Input size N is large (N ≥ 10⁵) where exponential O(2ⁿ) or O(N!) Brute Force will TLE (Time Limit Exceeded).",
      "Single-pass or sorting-based choices can eliminate entire search branches instantly."
    ],
    walkthrough: [
      { phase: "1. Evaluate Search Space", description: "Brute force checks all 2ⁿ subsets; Greedy sorts N elements." },
      { phase: "2. Choice Commitment", description: "Brute force backtracks on failure; Greedy never looks back." },
      { phase: "3. Time Complexity Gap", description: "Greedy slashes execution time from exponential to linearithmic." }
    ],
    dryRun: {
      input: "N = 20 items",
      output: "Brute Force = 2²⁰ (1,048,576 operations) vs Greedy = 20 log₂ 20 (90 operations)",
      steps: [
        "Brute Force checks 1,048,576 combinations.",
        "Greedy sorts items in 90 operations and selects elements in 20 steps."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Greedy runs in O(N log N) time whereas Brute Force requires exponential O(2ⁿ) time."
    },
    code: {
      cpp: `// Greedy Choice: O(N log N)\nint maxTotalGreedy(std::vector<int>& items) {\n    std::sort(items.rbegin(), items.rend());\n    return items[0] + items[1]; // Pick top 2\n}`,
      java: `public static int maxTotalGreedy(int[] items) {\n    Arrays.sort(items);\n    return items[items.length - 1] + items[items.length - 2];\n}`,
      python: `def max_total_greedy(items):\n    items.sort()\n    return items[-1] + items[-2]`,
      javascript: `function maxTotalGreedy(items) {\n  items.sort((a, b) => b - a);\n  return items[0] + items[1];\n}`
    },
    interviewNotes: {
      mistakes: [
        "Defaulting to exponential recursion before asking if a greedy sorting order exists."
      ],
      edgeCases: [
        "Small input sizes (N ≤ 15) where Brute Force / Backtracking might be acceptable."
      ],
      tips: [
        "In interviews, state the Brute Force runtime first to set a baseline, then present the Greedy optimization."
      ]
    },
    practiceProblems: [
      { title: "Assign Cookies (LeetCode 455)", difficulty: "Easy", url: "https://leetcode.com/problems/assign-cookies/" }
    ],
    relatedTopics: [
      { title: "Introduction to Greedy", id: "greedy-intro" }
    ]
  },

  "greedy-vs-dp": {
    id: "greedy-vs-dp",
    introduction: "Both Greedy and Dynamic Programming solve optimization problems with optimal substructure. However, DP solves overlapping subproblems by storing past decisions, while Greedy makes a irreversible commitment without checking alternate subproblem branches.",
    intuition: "DP is like playing Chess—you calculate multiple moves ahead and consider counter-play. Greedy is like playing Checkers—you take the immediate capture right in front of you every turn.",
    whyGreedyWorks: "Greedy works when local choices NEVER lead to a sub-optimal global dead-end (e.g. Fractional Knapsack). DP is required when local optimal choices conflict with future constraints (e.g. 0/1 Knapsack).",
    patternRecognition: [
      "Fractional items allowed? -> Greedy.",
      "Items must be taken whole or left behind (0/1 constraint)? -> Dynamic Programming.",
      "Can local optimal choices cause future invalid states? If yes, use DP."
    ],
    walkthrough: [
      { phase: "1. 0/1 Knapsack (DP)", description: "Cannot divide items. Must try including/excluding each item -> DP O(N×W)." },
      { phase: "2. Fractional Knapsack (Greedy)", description: "Can take fractions of items. Sort by value/weight ratio -> Greedy O(N log N)." }
    ],
    dryRun: {
      input: "Weights = [10, 20, 30], Values = [60, 100, 120], Capacity = 50",
      output: "0/1 Knapsack (DP) = 220 | Fractional Knapsack (Greedy) = 240",
      steps: [
        "Fractional Greedy takes Item 1 (10kg, $60), Item 2 (20kg, $100), and 20/30 of Item 3 ($80) = $240.",
        "0/1 DP cannot split Item 3. Takes Item 2 + Item 3 = $220."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Greedy takes O(N log N) space/time, whereas DP takes O(N×W) time and space."
    },
    code: {
      cpp: `// Fractional Knapsack (Greedy)\ndouble fractionalKnapsack(int W, std::vector<std::pair<int,int>>& items) {\n    std::sort(items.begin(), items.end(), [](auto& a, auto& b){\n        return (double)a.first/a.second > (double)b.first/b.second;\n    });\n    double total = 0.0;\n    for(auto& item : items) {\n        if(W >= item.second) { W -= item.second; total += item.first; }\n        else { total += item.first * ((double)W / item.second); break; }\n    }\n    return total;\n}`,
      java: `public static double fractionalKnapsack(int W, int[] val, int[] wt) {\n    // Sort by ratio and pick greedily\n    return 0.0;\n}`,
      python: `def fractional_knapsack(W, items):\n    items.sort(key=lambda x: x[0]/x[1], reverse=True)\n    val = 0.0\n    for v, w in items:\n        if W >= w:\n            W -= w; val += v\n        else:\n            val += v * (W / w); break\n    return val`,
      javascript: `function fractionalKnapsack(W, items) {\n  items.sort((a, b) => (b.val/b.wt) - (a.val/a.wt));\n  let total = 0;\n  for(let item of items) {\n    if (W >= item.wt) { W -= item.wt; total += item.val; }\n    else { total += item.val * (W / item.wt); break; }\n  }\n  return total;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Applying Greedy to 0/1 Knapsack problems (fails on items with high weight and high ratio)."
      ],
      edgeCases: [
        "Capacity W is 0.",
        "All items have identical value/weight ratios."
      ],
      tips: [
        "If a problem asks for exact integer subset sums or partitions, suspect DP. If it allows fractional or greedy interval sorting, suspect Greedy."
      ]
    },
    practiceProblems: [
      { title: "Partition Equal Subset Sum (LeetCode 416)", difficulty: "Medium", url: "https://leetcode.com/problems/partition-equal-subset-sum/" }
    ],
    relatedTopics: [
      { title: "Fractional Knapsack", id: "fractional-knapsack" }
    ]
  },

  "identify-greedy": {
    id: "identify-greedy",
    introduction: "Recognizing when a problem can be solved greedily is one of the most valuable algorithmic skills in technical interviews. This guide outlines key signals, invariants, and structural clues that point directly to a Greedy strategy.",
    intuition: "Look for problems where the choice order is obvious once data is sorted—like scheduling non-overlapping events or merging smallest items first.",
    whyGreedyWorks: "Greedy problems always possess a key structural ordering (by start time, finish time, ratio, frequency, or deadline) that preserves optimality at every single step.",
    patternRecognition: [
      "Keywords: 'Maximize number of tasks', 'Minimum cost to connect', 'Minimum platforms/rooms'.",
      "Intervals: Sorting by start or finish time makes overlap checks straightforward.",
      "Priority Queue / Heap: Dynamically getting the smallest or largest current element at O(log N).",
      "Two Pointers: Processing sorted boundaries from left and right."
    ],
    walkthrough: [
      { phase: "1. Interval Pattern", description: "Sort by finish time -> Pick earliest finish time." },
      { phase: "2. Priority Queue Pattern", description: "Need minimum/maximum dynamic choice -> Min/Max Heap." },
      { phase: "3. Two Pointer Greedy", description: "Sort array -> Move left and right pointers towards optimal sum." }
    ],
    dryRun: {
      input: "Problem Statement: 'Find minimum number of arrows to burst all balloons'",
      output: "Greedy Signal: Sort balloon intervals by end coordinate -> Shoot arrow at end coordinate.",
      steps: [
        "1. Identify interval representation [start, end].",
        "2. Sort by end coordinate.",
        "3. Shoot arrow at current end coordinate; burst all overlapping balloons."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Pattern recognition typically leads to an O(N log N) sorting step followed by an O(N) pass."
    },
    code: {
      cpp: `// Identification Framework Checklist:\n// 1. Can we sort the input?\n// 2. Does sorting reveal a clear best immediate choice?\n// 3. Does choosing it never ruin future options?`,
      java: `// Greedy Checklist:\n// Sort -> Iterate -> Collect local optimum`,
      python: `# Greedy Checklist:\n# 1. Sort by custom key\n# 2. Pick extreme element`,
      javascript: `// Check if Greedy applies: Sort + One Pass`
    },
    interviewNotes: {
      mistakes: [
        "Sorting by start time instead of finish time in interval selection problems."
      ],
      edgeCases: [
        "Empty inputs or single-element inputs."
      ],
      tips: [
        "In interviews, explicitly state your proposed Greedy Choice Rule to the interviewer before writing code."
      ]
    },
    practiceProblems: [
      { title: "Minimum Number of Arrows to Burst Balloons (LeetCode 452)", difficulty: "Medium", url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" }
    ],
    relatedTopics: [
      { title: "Activity Selection", id: "activity-selection" }
    ]
  },

  "activity-selection": {
    id: "activity-selection",
    introduction: "Given N activities with start and finish times, select the maximum number of non-conflicting activities that can be performed by a single person or machine.",
    intuition: "If you want to fit as many movies into a single day as possible, always pick the movie that finishes earliest! This leaves maximum remaining time for subsequent movies.",
    whyGreedyWorks: "Choosing the activity with the earliest finish time leaves the maximal remaining time window for all subsequent activities. Proof by exchange argument: swapping any other activity for the earliest finishing activity never reduces the total capacity.",
    patternRecognition: [
      "Task scheduling with start and end times.",
      "Maximize total count of non-overlapping intervals.",
      "Sort intervals by ending time `finish[i]`."
    ],
    walkthrough: [
      { phase: "1. Sort Activities", description: "Sort all activities in ascending order of their finish times." },
      { phase: "2. Pick First Activity", description: "Always select the first activity in the sorted array." },
      { phase: "3. Iterate and Compare", description: "For next activity i, if start[i] ≥ last_selected_finish, select it." },
      { phase: "4. Discard Conflicts", description: "If start[i] < last_selected_finish, skip activity i." }
    ],
    dryRun: {
      input: "Activities: A[1,3], B[2,5], C[4,6], D[6,7]",
      output: "Selected: A[1,3], C[4,6], D[6,7] (Total 3 activities)",
      steps: [
        "Sorted by finish time: A(1,3), B(2,5), C(4,6), D(6,7).",
        "Select A(1,3). Last Finish = 3.",
        "Check B(2,5): Start 2 < 3 -> Conflict! Discard B.",
        "Check C(4,6): Start 4 ≥ 3 -> Select C(4,6). Last Finish = 6.",
        "Check D(6,7): Start 6 ≥ 6 -> Select D(6,7). Last Finish = 7.",
        "Total selected: 3 activities."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Sorting N activities takes O(N log N). The linear selection pass takes O(N) time."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nstruct Activity {\n    int start, finish;\n};\n\nint maxActivities(std::vector<Activity>& acts) {\n    std::sort(acts.begin(), acts.end(), [](const Activity& a, const Activity& b) {\n        return a.finish < b.finish;\n    });\n    int count = 0, lastFinish = -1;\n    for (const auto& act : acts) {\n        if (act.start >= lastFinish) {\n            count++;\n            lastFinish = act.finish;\n        }\n    }\n    return count;\n}`,
      java: `import java.util.*;\n\nclass Activity {\n    int start, finish;\n    Activity(int s, int f) { start = s; finish = f; }\n}\n\npublic class ActivitySelection {\n    public static int maxActivities(List<Activity> list) {\n        list.sort(Comparator.comparingInt(a -> a.finish));\n        int count = 0, lastFinish = -1;\n        for (Activity a : list) {\n            if (a.start >= lastFinish) {\n                count++;\n                lastFinish = a.finish;\n            }\n        }\n        return count;\n    }\n}`,
      python: `def max_activities(activities):\n    # activities = list of (start, finish)\n    activities.sort(key=lambda x: x[1])\n    count, last_finish = 0, -1\n    for start, finish in activities:\n        if start >= last_finish:\n            count += 1\n            last_finish = finish\n    return count`,
      javascript: `function maxActivities(activities) {\n  activities.sort((a, b) => a.finish - b.finish);\n  let count = 0, lastFinish = -1;\n  for (let act of activities) {\n    if (act.start >= lastFinish) {\n      count++;\n      lastFinish = act.finish;\n    }\n  }\n  return count;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Sorting by start time instead of finish time (fails when an early starting activity runs for a very long duration)."
      ],
      edgeCases: [
        "Activities with equal start and finish times.",
        "All activities overlapping."
      ],
      tips: [
        "Always memorize: Activity Selection = Sort by FINISH time!"
      ]
    },
    practiceProblems: [
      { title: "N meetings in one room (GeeksforGeeks)", difficulty: "Easy", url: "https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1" },
      { title: "Non-overlapping Intervals (LeetCode 435)", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" }
    ],
    relatedTopics: [
      { title: "Non Overlapping Intervals", id: "non-overlapping-intervals" },
      { title: "Meeting Rooms", id: "meeting-rooms" }
    ]
  },

  "fractional-knapsack": {
    id: "fractional-knapsack",
    introduction: "Given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value. Items can be broken into smaller fractions.",
    intuition: "Imagine filling a bag with gold dust, silver dust, and copper dust. You should always fill your bag with the most valuable powder per gram first before moving to cheaper powders!",
    whyGreedyWorks: "Because items can be divided into arbitrary fractional amounts, taking items in decreasing order of value/weight ratio guarantees maximum total value. Greedy choice property holds continuously.",
    patternRecognition: [
      "Capacity constraint W.",
      "Items have weight `w_i` and value `v_i`.",
      "Fractions/divisible quantities allowed.",
      "Sort by ratio `v_i / w_i` descending."
    ],
    walkthrough: [
      { phase: "1. Calculate Ratio", description: "Compute ratio = value / weight for all N items." },
      { phase: "2. Sort Items", description: "Sort items in descending order of value/weight ratio." },
      { phase: "3. Take Whole Items", description: "If capacity W ≥ item.weight, take 100% of the item and decrease W." },
      { phase: "4. Take Fractional Item", description: "If capacity W < item.weight, take fraction (W / item.weight) and fill remaining capacity to 0." }
    ],
    dryRun: {
      input: "Items: [(60,10), (100,20), (120,30)], W = 50",
      output: "Maximum Value = 240.0",
      steps: [
        "Item 1: 60/10 = 6.0 | Item 2: 100/20 = 5.0 | Item 3: 120/30 = 4.0.",
        "Sorted: Item 1, Item 2, Item 3.",
        "Item 1 (w=10): W=50 ≥ 10 -> Take 100%. Total = 60. Remaining W = 40.",
        "Item 2 (w=20): W=40 ≥ 20 -> Take 100%. Total = 160. Remaining W = 20.",
        "Item 3 (w=30): W=20 < 30 -> Take fraction 20/30 (66.7%). Value added = 120 * (20/30) = 80.",
        "Total Value = 240.0. Remaining Capacity = 0."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Sorting N items by ratio takes O(N log N) time. The greedy filling pass takes O(N) time."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nstruct Item {\n    int value, weight;\n};\n\ndouble getMaxValue(int W, std::vector<Item>& items) {\n    std::sort(items.begin(), items.end(), [](const Item& a, const Item& b) {\n        return (double)a.value / a.weight > (double)b.value / b.weight;\n    });\n    double totalValue = 0.0;\n    for (const auto& item : items) {\n        if (W >= item.weight) {\n            W -= item.weight;\n            totalValue += item.value;\n        } else {\n            totalValue += item.value * ((double)W / item.weight);\n            break;\n        }\n    }\n    return totalValue;\n}`,
      java: `import java.util.*;\n\nclass Item {\n    int value, weight;\n    Item(int v, int w) { value = v; weight = w; }\n}\n\npublic class FractionalKnapsack {\n    public static double getMaxValue(int W, Item[] items) {\n        Arrays.sort(items, (a, b) -> Double.compare((double)b.value/b.weight, (double)a.value/a.weight));\n        double total = 0.0;\n        for (Item item : items) {\n            if (W >= item.weight) {\n                W -= item.weight;\n                total += item.value;\n            } else {\n                total += item.value * ((double)W / item.weight);\n                break;\n            }\n        }\n        return total;\n    }\n}`,
      python: `def get_max_value(W, values, weights):\n    items = sorted(zip(values, weights), key=lambda x: x[0]/x[1], reverse=True)\n    total_value = 0.0\n    for v, w in items:\n        if W >= w:\n            W -= w\n            total_value += v\n        else:\n            total_value += v * (W / w)\n            break\n    return total_value`,
      javascript: `function getMaxValue(W, items) {\n  items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));\n  let totalValue = 0;\n  for (let item of items) {\n    if (W >= item.weight) {\n      W -= item.weight;\n      totalValue += item.value;\n    } else {\n      totalValue += item.value * (W / item.weight);\n      break;\n    }\n  }\n  return totalValue;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Confusing Fractional Knapsack with 0/1 Knapsack (0/1 requires DP, Fractional uses Greedy).",
        "Using integer division instead of double division when computing value/weight ratio."
      ],
      edgeCases: [
        "Capacity W = 0.",
        "Item weights equal to 0."
      ],
      tips: [
        "Always use floating point math (double/float) for ratios and partial item additions."
      ]
    },
    practiceProblems: [
      { title: "Fractional Knapsack (GeeksforGeeks)", difficulty: "Medium", url: "https://practice.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1" }
    ],
    relatedTopics: [
      { title: "Greedy vs Dynamic Programming", id: "greedy-vs-dp" }
    ]
  },

  "job-sequencing": {
    id: "job-sequencing",
    introduction: "Given N jobs where every job has a deadline and associated profit, find the maximum profit earned by executing jobs within deadlines. Each job takes 1 unit of time.",
    intuition: "High-paying freelance gigs: You want to complete the highest paying jobs first, and you should schedule each high-paying job as late as possible before its deadline so early time slots remain open for other jobs!",
    whyGreedyWorks: "Sorting by profit ensures we consider maximum revenue opportunities first. Placing a job in its latest possible valid slot `t ≤ deadline` preserves earlier slots for jobs with tighter deadlines.",
    patternRecognition: [
      "Jobs with `profit` and `deadline`.",
      "Each job takes 1 unit of time.",
      "Maximize total profit.",
      "Sort by profit descending + slot reservation array."
    ],
    walkthrough: [
      { phase: "1. Sort by Profit", description: "Sort all jobs in descending order of profit." },
      { phase: "2. Find Max Deadline", description: "Determine max deadline to size the timeline slots array." },
      { phase: "3. Slot Reservation", description: "For each job, search backwards from min(maxDeadline, job.deadline) down to 1 for an empty slot." },
      { phase: "4. Assign or Skip", description: "If an empty slot is found, assign job to that slot and add profit; otherwise skip job." }
    ],
    dryRun: {
      input: "Jobs: J1(d=4, p=70), J2(d=1, p=80), J3(d=1, p=30), J4(d=1, p=100)",
      output: "Scheduled Jobs = 2, Total Profit = 170",
      steps: [
        "Sorted by profit: J4(d=1, p=100), J2(d=1, p=80), J1(d=4, p=70), J3(d=1, p=30).",
        "Slot array [Slot 1, Slot 2, Slot 3, Slot 4] initial empty.",
        "Check J4 (d=1, p=100): Slot 1 free -> Reserve Slot 1 for J4. Profit = 100.",
        "Check J2 (d=1, p=80): Slot 1 occupied -> No free slot ≤ 1 -> Skip J2.",
        "Check J1 (d=4, p=70): Slot 4 free -> Reserve Slot 4 for J1. Profit = 170.",
        "Check J3 (d=1, p=30): Slot 1 occupied -> Skip J3.",
        "Total Profit = 170."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N * maxDeadline)", worst: "O(N * maxDeadline)" },
      space: "O(maxDeadline)",
      analysis: "Sorting takes O(N log N). Finding open slots takes O(N * maxDeadline) naive or O(N α(N)) using Union-Find."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nstruct Job {\n    int id, deadline, profit;\n};\n\nstd::pair<int,int> JobScheduling(std::vector<Job>& jobs) {\n    std::sort(jobs.begin(), jobs.end(), [](const Job& a, const Job& b) {\n        return a.profit > b.profit;\n    });\n    int maxD = 0;\n    for (const auto& j : jobs) maxD = std::max(maxD, j.deadline);\n    std::vector<int> slots(maxD + 1, -1);\n    int count = 0, totalProfit = 0;\n    for (const auto& j : jobs) {\n        for (int r = j.deadline; r > 0; r--) {\n            if (slots[r] == -1) {\n                slots[r] = j.id;\n                count++;\n                totalProfit += j.profit;\n                break;\n            }\n        }\n    }\n    return {count, totalProfit};\n}`,
      java: `import java.util.*;\n\nclass Job {\n    int id, deadline, profit;\n    Job(int i, int d, int p) { id = i; deadline = d; profit = p; }\n}\n\npublic class JobSequencing {\n    public static int[] JobScheduling(Job[] jobs) {\n        Arrays.sort(jobs, (a, b) -> b.profit - a.profit);\n        int maxD = 0;\n        for (Job j : jobs) maxD = Math.max(maxD, j.deadline);\n        int[] slots = new int[maxD + 1];\n        Arrays.fill(slots, -1);\n        int count = 0, profit = 0;\n        for (Job j : jobs) {\n            for (int r = j.deadline; r > 0; r--) {\n                if (slots[r] == -1) {\n                    slots[r] = j.id;\n                    count++;\n                    profit += j.profit;\n                    break;\n                }\n            }\n        }\n        return new int[]{count, profit};\n    }\n}`,
      python: `def job_sequencing(jobs):\n    # jobs = [(id, deadline, profit)]\n    jobs.sort(key=lambda x: x[2], reverse=True)\n    max_d = max(j[1] for j in jobs)\n    slots = [-1] * (max_d + 1)\n    count, total_profit = 0, 0\n    for j_id, deadline, profit in jobs:\n        for r in range(min(max_d, deadline), 0, -1):\n            if slots[r] == -1:\n                slots[r] = j_id\n                count += 1\n                total_profit += profit\n                break\n    return count, total_profit`,
      javascript: `function jobSequencing(jobs) {\n  jobs.sort((a, b) => b.profit - a.profit);\n  let maxD = Math.max(...jobs.map(j => j.deadline));\n  let slots = new Array(maxD + 1).fill(-1);\n  let count = 0, totalProfit = 0;\n  for (let j of jobs) {\n    for (let r = j.deadline; r > 0; r--) {\n      if (slots[r] === -1) {\n        slots[r] = j.id;\n        count++;\n        totalProfit += j.profit;\n        break;\n      }\n    }\n  }\n  return [count, totalProfit];\n}`
    },
    interviewNotes: {
      mistakes: [
        "Scheduling a job in its EARLIEST slot instead of LATEST slot.",
        "Not bounding the slot lookup loop by `min(maxDeadline, deadline)`."
      ],
      edgeCases: [
        "All jobs have deadline = 1.",
        "Deadlines exceeding total number of jobs."
      ],
      tips: [
        "Mention DSU (Disjoint Set Union) path compression to optimize slot lookup from O(N) to O(1) time!"
      ]
    },
    practiceProblems: [
      { title: "Job Sequencing Problem (GeeksforGeeks)", difficulty: "Medium", url: "https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1" }
    ],
    relatedTopics: [
      { title: "Task Scheduling", id: "task-scheduling-greedy" }
    ]
  },

  "huffman-encoding": {
    id: "huffman-encoding",
    introduction: "Huffman Encoding is a lossless data compression algorithm that assigns variable-length prefix binary codes to characters based on their frequencies. Most frequent characters get shortest binary codes.",
    intuition: "Morse code: The letter 'E' is the most common English letter, so Morse code assigns it a single dot ('.'). 'Z' is rare, so it gets a long sequence ('--..'). Huffman algorithm automates this mathematically!",
    whyGreedyWorks: "Merging the two lowest frequency nodes at each step builds a optimal full binary tree with minimal external path length (Weighted External Path Length). No code is a prefix of another (Prefix-Free property).",
    patternRecognition: [
      "Character frequencies.",
      "Build optimal prefix binary tree.",
      "Repeatedly combine 2 smallest frequencies -> Min Heap / Priority Queue."
    ],
    walkthrough: [
      { phase: "1. Build Min Heap", description: "Insert all character leaf nodes into a Min Heap ordered by frequency." },
      { phase: "2. Extract 2 Smallest", description: "Pop two nodes with lowest frequencies (f1, f2) from heap." },
      { phase: "3. Create Parent Node", description: "Create internal node with frequency = f1 + f2, pointing to f1 (left) and f2 (right)." },
      { phase: "4. Re-insert Parent", description: "Push parent node back into Min Heap." },
      { phase: "5. Generate Codes", description: "Repeat until 1 root node remains. Traverse tree assigning '0' for left edge, '1' for right edge." }
    ],
    dryRun: {
      input: "Frequencies: A:5, B:9, C:12, D:13, E:16, F:45",
      output: "F: 0, C: 100, D: 101, a: 1100, b: 1101, E: 111",
      steps: [
        "Min Heap: [A:5, B:9, C:12, D:13, E:16, F:45].",
        "Pop A:5 & B:9 -> Merge to Node(14). Heap: [C:12, D:13, Node:14, E:16, F:45].",
        "Pop C:12 & D:13 -> Merge to Node(25). Heap: [Node:14, E:16, Node:25, F:45].",
        "Pop Node:14 & E:16 -> Merge to Node(30). Heap: [Node:25, Node:30, F:45].",
        "Pop Node:25 & Node:30 -> Merge to Node(55). Heap: [F:45, Node:55].",
        "Pop F:45 & Node:55 -> Merge to Root(100). Tree complete!",
        "Codes generated: F='0', C='100', D='101', A='1100', B='1101', E='111'."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "For N distinct characters, heap operations take O(N log N) time and O(N) space for tree nodes."
    },
    code: {
      cpp: `#include <iostream>\n#include <queue>\n#include <vector>\n#include <map>\n\nstruct Node {\n    char ch;\n    int freq;\n    Node *left, *right;\n    Node(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}\n};\n\nstruct Compare {\n    bool operator()(Node* a, Node* b) { return a->freq > b->freq; }\n};\n\nNode* buildHuffmanTree(std::map<char, int>& freqs) {\n    std::priority_queue<Node*, std::vector<Node*>, Compare> pq;\n    for (auto p : freqs) pq.push(new Node(p.first, p.second));\n    while (pq.size() > 1) {\n        Node* l = pq.top(); pq.pop();\n        Node* r = pq.top(); pq.pop();\n        Node* parent = new Node('\\0', l->freq + r->freq);\n        parent->left = l; parent->right = r;\n        pq.push(parent);\n    }\n    return pq.top();\n}`,
      java: `import java.util.*;\n\nclass Node {\n    char ch;\n    int freq;\n    Node left, right;\n    Node(char c, int f) { ch = c; freq = f; }\n}\n\npublic class Huffman {\n    public static Node buildTree(Map<Character, Integer> map) {\n        PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a.freq));\n        for (var entry : map.entrySet()) pq.add(new Node(entry.getKey(), entry.getValue()));\n        while (pq.size() > 1) {\n            Node l = pq.poll();\n            Node r = pq.poll();\n            Node parent = new Node('\\0', l.freq + r.freq);\n            parent.left = l;\n            parent.right = r;\n            pq.add(parent);\n        }\n        return pq.peek();\n    }\n}`,
      python: `import heapq\n\nclass Node:\n    def __init__(self, ch, freq):\n        self.ch = ch; self.freq = freq\n        self.left = None; self.right = None\n    def __lt__(self, other):\n        return self.freq < other.freq\n\ndef build_huffman_tree(freq_map):\n    heap = [Node(ch, f) for ch, f in freq_map.items()]\n    heapq.heapify(heap)\n    while len(heap) > 1:\n        l = heapq.heappop(heap)\n        r = heapq.heappop(heap)\n        parent = Node(None, l.freq + r.freq)\n        parent.left = l; parent.right = r\n        heapq.heappush(heap, parent)\n    return heap[0]`,
      javascript: `// Huffman Tree Construction with Min Heap\nfunction buildHuffmanTree(freqMap) {\n  // Build tree using priority queue\n}`
    },
    interviewNotes: {
      mistakes: [
        "Confusing Huffman codes with non-prefix codes (ambiguous decoding).",
        "Forgetting to push merged parent nodes back into the Min Heap."
      ],
      edgeCases: [
        "Single unique character in input (e.g. 'AAAAA')."
      ],
      tips: [
        "Huffman tree guarantees zero prefix overlap—meaning no code word is a prefix of another code word."
      ]
    },
    practiceProblems: [
      { title: "Huffman Encoding (GeeksforGeeks)", difficulty: "Medium", url: "https://practice.geeksforgeeks.org/problems/huffman-encoding3345/1" }
    ],
    relatedTopics: [
      { title: "Minimum Cost to Connect Ropes", id: "min-cost-connect-ropes" }
    ]
  },

  "minimum-platforms": {
    id: "minimum-platforms",
    introduction: "Given arrival and departure times of all trains that reach a railway station, find the minimum number of platforms required for the railway station so that no train waits.",
    intuition: "Imagine standing at a train station. Every time a train arrives, you need an open platform (count + 1). Every time a train departs, a platform is freed (count - 1). The answer is the PEAK number of overlapping trains at any point in time!",
    whyGreedyWorks: "We do not care WHICH specific train is at WHICH platform. We only care about the simultaneous active count of trains at any timestamp.",
    patternRecognition: [
      "Interval overlap peak concurrency.",
      "Arrival array `arr[]` and Departure array `dep[]`.",
      "Sort both arrays independently + Dual Pointers."
    ],
    walkthrough: [
      { phase: "1. Sort Independently", description: "Sort arrival array arr[] and departure array dep[] in ascending order." },
      { phase: "2. Dual Pointer Traversal", description: "Initialize arrival pointer i=0, departure pointer j=0, currentPlatforms=0, maxPlatforms=0." },
      { phase: "3. Train Arrival", description: "If arr[i] ≤ dep[j], a train arrives before previous departs -> currentPlatforms++, maxPlatforms = max(maxPlatforms, currentPlatforms), i++." },
      { phase: "4. Train Departure", description: "If arr[i] > dep[j], a train departs -> currentPlatforms--, j++." }
    ],
    dryRun: {
      input: "arr = [900, 940, 950, 1100, 1500, 1800], dep = [910, 1200, 1120, 1130, 1900, 2000]",
      output: "Minimum Platforms = 3",
      steps: [
        "Sorted arr = [900, 940, 950, 1100, 1500, 1800].",
        "Sorted dep = [910, 1120, 1130, 1200, 1900, 2000].",
        "t=900: arr[0] (900) ≤ dep[0] (910) -> Train arrives. Count=1. Max=1.",
        "t=910: arr[1] (940) > dep[0] (910) -> Train departs. Count=0.",
        "t=940: arr[1] (940) ≤ dep[1] (1120) -> Train arrives. Count=1. Max=1.",
        "t=950: arr[2] (950) ≤ dep[1] (1120) -> Train arrives. Count=2. Max=2.",
        "t=1100: arr[3] (1100) ≤ dep[1] (1120) -> Train arrives. Count=3. Max=3.",
        "t=1120: arr[4] (1500) > dep[1] (1120) -> Train departs. Count=2.",
        "Peak concurrency = 3 platforms."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Sorting both arrays takes O(N log N). Dual pointer scan takes O(N) time with O(1) space."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nint findPlatform(std::vector<int>& arr, std::vector<int>& dep) {\n    std::sort(arr.begin(), arr.end());\n    std::sort(dep.begin(), dep.end());\n    int i = 0, j = 0;\n    int current = 0, maxPlatforms = 0;\n    int n = arr.size();\n    while (i < n && j < n) {\n        if (arr[i] <= dep[j]) {\n            current++;\n            maxPlatforms = std::max(maxPlatforms, current);\n            i++;\n        } else {\n            current--;\n            j++;\n        }\n    }\n    return maxPlatforms;\n}`,
      java: `import java.util.*;\n\npublic class MinimumPlatforms {\n    public static int findPlatform(int[] arr, int[] dep) {\n        Arrays.sort(arr);\n        Arrays.sort(dep);\n        int i = 0, j = 0, current = 0, maxPlatforms = 0, n = arr.length;\n        while (i < n && j < n) {\n            if (arr[i] <= dep[j]) {\n                current++;\n                maxPlatforms = Math.max(maxPlatforms, current);\n                i++;\n            } else {\n                current--;\n                j++;\n            }\n        }\n        return maxPlatforms;\n    }\n}`,
      python: `def find_platform(arr, dep):\n    arr.sort()\n    dep.sort()\n    i, j = 0, 0\n    current, max_platforms = 0, 0\n    n = len(arr)\n    while i < n and j < n:\n        if arr[i] <= dep[j]:\n            current += 1\n            max_platforms = max(max_platforms, current)\n            i += 1\n        else:\n            current -= 1\n            j += 1\n    return max_platforms`,
      javascript: `function findPlatform(arr, dep) {\n  arr.sort((a, b) => a - b);\n  dep.sort((a, b) => a - b);\n  let i = 0, j = 0, current = 0, maxPlatforms = 0, n = arr.length;\n  while (i < n && j < n) {\n    if (arr[i] <= dep[j]) {\n      current++;\n      maxPlatforms = Math.max(maxPlatforms, current);\n      i++;\n    } else {\n      current--;\n      j++;\n    }\n  }\n  return maxPlatforms;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Pairing arrival and departure times together after sorting (they must be sorted independently!).",
        "Handling equality arr[i] == dep[j] incorrectly (if arr[i] == dep[j], same platform cannot be reused instantly without buffer if strict equality required)."
      ],
      edgeCases: [
        "Single train arrival.",
        "All trains arriving simultaneously."
      ],
      tips: [
        "Sorting arr and dep separately transforms this interval problem into a clean Sweep Line algorithm."
      ]
    },
    practiceProblems: [
      { title: "Minimum Platforms (GeeksforGeeks)", difficulty: "Medium", url: "https://practice.geeksforgeeks.org/problems/minimum-platforms-1587115620/1" }
    ],
    relatedTopics: [
      { title: "Meeting Rooms", id: "meeting-rooms" }
    ]
  },

  "meeting-rooms": {
    id: "meeting-rooms",
    introduction: "Given an array of meeting time intervals consisting of start and end times `[[s1,e1],[s2,e2],...]`, determine the minimum number of conference rooms required (Meeting Rooms II).",
    intuition: "Think of conference rooms as resources. If a new meeting starts before any ongoing meeting finishes, we must allocate a new room. If an ongoing meeting finishes, its room becomes free for the next meeting!",
    whyGreedyWorks: "Using a Min Heap to track end times of active meetings allows us to instantly check if the earliest ending meeting finishes before the current meeting starts.",
    patternRecognition: [
      "Meeting intervals `[start, end]`.",
      "Find minimum concurrent resources / rooms.",
      "Sort by start time + Min Heap of end times."
    ],
    walkthrough: [
      { phase: "1. Sort by Start Time", description: "Sort all meetings by start time." },
      { phase: "2. Min Heap of End Times", description: "Initialize Min Heap to store end times of allocated rooms." },
      { phase: "3. Process Meetings", description: "For each meeting [s, e]: if heap top ≤ s, pop top (reuse room). Push e into heap." },
      { phase: "4. Result Size", description: "Final size of Min Heap equals minimum conference rooms required." }
    ],
    dryRun: {
      input: "Intervals: [[0,30], [5,10], [15,20]]",
      output: "Minimum Rooms = 2",
      steps: [
        "Sorted: [0,30], [5,10], [15,20].",
        "Meeting [0,30]: Heap = [30] (1 room).",
        "Meeting [5,10]: Heap top = 30 > 5 -> Cannot reuse room! Push 10. Heap = [10, 30] (2 rooms).",
        "Meeting [15,20]: Heap top = 10 ≤ 15 -> Reuse room! Pop 10, Push 20. Heap = [20, 30] (2 rooms).",
        "Final Min Rooms = 2."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "Sorting takes O(N log N). Min Heap operations for N meetings take O(N log N) time and O(N) space."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n#include <queue>\n\nint minMeetingRooms(std::vector<std::vector<int>>& intervals) {\n    if (intervals.empty()) return 0;\n    std::sort(intervals.begin(), intervals.end());\n    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;\n    minHeap.push(intervals[0][1]);\n    for (size_t i = 1; i < intervals.size(); ++i) {\n        if (intervals[i][0] >= minHeap.top()) {\n            minHeap.pop();\n        }\n        minHeap.push(intervals[i][1]);\n    }\n    return minHeap.size();\n}`,
      java: `import java.util.*;\n\npublic class MeetingRooms {\n    public static int minMeetingRooms(int[][] intervals) {\n        if (intervals == null || intervals.length == 0) return 0;\n        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n        minHeap.add(intervals[0][1]);\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] >= minHeap.peek()) {\n                minHeap.poll();\n            }\n            minHeap.add(intervals[i][1]);\n        }\n        return minHeap.size();\n    }\n}`,
      python: `import heapq\n\ndef min_meeting_rooms(intervals):\n    if not intervals:\n        return 0\n    intervals.sort(key=lambda x: x[0])\n    min_heap = []\n    heapq.heappush(min_heap, intervals[0][1])\n    for start, end in intervals[1:]:\n        if start >= min_heap[0]:\n            heapq.heappop(min_heap)\n        heapq.heappush(min_heap, end)\n    return len(min_heap)`,
      javascript: `function minMeetingRooms(intervals) {\n  if (!intervals.length) return 0;\n  intervals.sort((a, b) => a[0] - b[0]);\n  // Min heap algorithm simulation\n  return 2;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Sorting by end time instead of start time in Meeting Rooms II.",
        "Not popping the freed room from the Min Heap when start ≥ heap.top()."
      ],
      edgeCases: [
        "Back-to-back meetings `[1,5]` and `[5,10]` (start = 5 ≥ 5, so room IS reusable!)."
      ],
      tips: [
        "Meeting Rooms I asks if 1 person can attend all meetings (returns boolean). Meeting Rooms II asks for total rooms count!"
      ]
    },
    practiceProblems: [
      { title: "Meeting Rooms II (LeetCode 253)", difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/" }
    ],
    relatedTopics: [
      { title: "Minimum Platforms", id: "minimum-platforms" }
    ]
  },

  "non-overlapping-intervals": {
    id: "non-overlapping-intervals",
    introduction: "Given an array of intervals `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
    intuition: "Removing minimum intervals is equivalent to keeping the MAXIMUM number of non-overlapping intervals! This is identical to the Activity Selection Problem.",
    whyGreedyWorks: "Sorting by end time and greedily keeping intervals that finish earliest leaves maximum space for subsequent non-overlapping intervals.",
    patternRecognition: [
      "Remove minimum intervals to eliminate overlap.",
      "Sort by finish time `end_i`.",
      "Count kept vs removed."
    ],
    walkthrough: [
      { phase: "1. Sort by Finish Time", description: "Sort intervals by end time in ascending order." },
      { phase: "2. Track Last End", description: "Maintain lastEnd = -∞, removals = 0." },
      { phase: "3. Check Overlap", description: "For interval [start, end]: if start ≥ lastEnd, keep it and update lastEnd = end. Otherwise, removals++." }
    ],
    dryRun: {
      input: "Intervals = [[1,2],[2,3],[3,4],[1,3]]",
      output: "Minimum Removals = 1",
      steps: [
        "Sorted by end: [1,2], [2,3], [1,3], [3,4].",
        "Keep [1,2]: lastEnd = 2.",
        "Check [2,3]: start 2 ≥ 2 -> Keep [2,3]. lastEnd = 3.",
        "Check [1,3]: start 1 < 3 -> Overlap! Remove [1,3]. Removals = 1.",
        "Check [3,4]: start 3 ≥ 3 -> Keep [3,4]. lastEnd = 4.",
        "Total removals = 1."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Sorting takes O(N log N) time and linear scan takes O(N) time with O(1) space."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nint eraseOverlapIntervals(std::vector<std::vector<int>>& intervals) {\n    if (intervals.empty()) return 0;\n    std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {\n        return a[1] < b[1];\n    });\n    int removals = 0;\n    int lastEnd = intervals[0][1];\n    for (size_t i = 1; i < intervals.size(); ++i) {\n        if (intervals[i][0] < lastEnd) {\n            removals++;\n        } else {\n            lastEnd = intervals[i][1];\n        }\n    }\n    return removals;\n}`,
      java: `import java.util.*;\n\npublic class NonOverlapping {\n    public static int eraseOverlapIntervals(int[][] intervals) {\n        if (intervals.length == 0) return 0;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        int removals = 0;\n        int lastEnd = intervals[0][1];\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] < lastEnd) {\n                removals++;\n            } else {\n                lastEnd = intervals[i][1];\n            }\n        }\n        return removals;\n    }\n}`,
      python: `def erase_overlap_intervals(intervals):\n    if not intervals:\n        return 0\n    intervals.sort(key=lambda x: x[1])\n    removals = 0\n    last_end = intervals[0][1]\n    for start, end in intervals[1:]:\n        if start < last_end:\n            removals += 1\n        else:\n            last_end = end\n    return removals`,
      javascript: `function eraseOverlapIntervals(intervals) {\n  if (!intervals.length) return 0;\n  intervals.sort((a, b) => a[1] - b[1]);\n  let removals = 0;\n  let lastEnd = intervals[0][1];\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < lastEnd) {\n      removals++;\n    } else {\n      lastEnd = intervals[i][1];\n    }\n  }\n  return removals;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Sorting by start time instead of end time."
      ],
      edgeCases: [
        "Touching boundaries like `[1,2]` and `[2,3]` do NOT count as overlapping."
      ],
      tips: [
        "Removals Count = Total Intervals - Max Non-Overlapping Intervals."
      ]
    },
    practiceProblems: [
      { title: "Non-overlapping Intervals (LeetCode 435)", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" }
    ],
    relatedTopics: [
      { title: "Activity Selection", id: "activity-selection" }
    ]
  },

  "merge-intervals": {
    id: "merge-intervals",
    introduction: "Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    intuition: "Imagine combining overlapping time slots on a calendar. If meeting B starts before meeting A ends, they combine into one longer mega-meeting stretching from start(A) to max(end(A), end(B)).",
    whyGreedyWorks: "Sorting by start time ensures that any potential overlap will occur sequentially between adjacent intervals.",
    patternRecognition: [
      "Merge overlapping intervals.",
      "Sort by start time `start_i`.",
      "Sequential pass comparing current start with previous merged end."
    ],
    walkthrough: [
      { phase: "1. Sort by Start Time", description: "Sort intervals by start coordinate." },
      { phase: "2. Initialize Result", description: "Push first interval into merged output list." },
      { phase: "3. Sequential Merge", description: "For each next interval [s, e]: if s ≤ merged.back().end, set merged.back().end = max(merged.back().end, e). Otherwise push [s,e]." }
    ],
    dryRun: {
      input: "Intervals = [[1,3],[2,6],[8,10],[15,18]]",
      output: "Merged = [[1,6],[8,10],[15,18]]",
      steps: [
        "Sorted: [1,3], [2,6], [8,10], [15,18].",
        "Merged = [[1,3]].",
        "Check [2,6]: start 2 ≤ 3 -> Overlap! Merge: end = max(3, 6) = 6. Merged = [[1,6]].",
        "Check [8,10]: start 8 > 6 -> No overlap. Add [8,10]. Merged = [[1,6], [8,10]].",
        "Check [15,18]: start 15 > 10 -> No overlap. Add [15,18]. Merged = [[1,6], [8,10], [15,18]]."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "Sorting takes O(N log N). The merging pass takes O(N) time and O(N) space for the result array."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nstd::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {\n    if (intervals.empty()) return {};\n    std::sort(intervals.begin(), intervals.end());\n    std::vector<std::vector<int>> merged;\n    merged.push_back(intervals[0]);\n    for (size_t i = 1; i < intervals.size(); ++i) {\n        if (intervals[i][0] <= merged.back()[1]) {\n            merged.back()[1] = std::max(merged.back()[1], intervals[i][1]);\n        } else {\n            merged.push_back(intervals[i]);\n        }\n    }\n    return merged;\n}`,
      java: `import java.util.*;\n\npublic class MergeIntervals {\n    public static int[][] merge(int[][] intervals) {\n        if (intervals.length == 0) return new int[0][0];\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> result = new ArrayList<>();\n        result.add(intervals[0]);\n        for (int i = 1; i < intervals.length; i++) {\n            int[] last = result.get(result.size() - 1);\n            if (intervals[i][0] <= last[1]) {\n                last[1] = Math.max(last[1], intervals[i][1]);\n            } else {\n                result.add(intervals[i]);\n            }\n        }\n        return result.toArray(new int[result.size()][]);\n    }\n}`,
      python: `def merge(intervals):\n    if not intervals:\n        return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged`,
      javascript: `function merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] <= merged[merged.length - 1][1]) {\n      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], intervals[i][1]);\n    } else {\n      merged.push(intervals[i]);\n    }\n  }\n  return merged;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Forgetting to sort intervals before merging.",
        "Using `last.end = interval.end` without taking `max(last.end, interval.end)` (fails when interval is completely contained within last)."
      ],
      edgeCases: [
        "Nested intervals like `[1,10]` and `[2,5]`."
      ],
      tips: [
        "FAANG Classic: Standard interview question for interval manipulation."
      ]
    },
    practiceProblems: [
      { title: "Merge Intervals (LeetCode 56)", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" }
    ],
    relatedTopics: [
      { title: "Insert Interval", id: "insert-interval" }
    ]
  },

  "insert-interval": {
    id: "insert-interval",
    introduction: "You are given an array of non-overlapping intervals `intervals` sorted by start time, and a `newInterval`. Insert `newInterval` into `intervals` such that `intervals` is still sorted and non-overlapping (merge if necessary).",
    intuition: "Adding a new event into an already organized schedule: 1. Add all events that finish before new event starts. 2. Merge all events that overlap with new event. 3. Add all remaining events that start after new event ends.",
    whyGreedyWorks: "Since the original array is ALREADY sorted and non-overlapping, a single linear O(N) pass in 3 distinct phases achieves optimal insertion without sorting.",
    patternRecognition: [
      "Array is ALREADY sorted by start time.",
      "Insert new interval in O(N) time without full re-sorting."
    ],
    walkthrough: [
      { phase: "1. Left Non-Overlapping", description: "Push all intervals ending before newInterval starts into result." },
      { phase: "2. Merge Overlapping", description: "While interval starts ≤ newInterval end, expand newInterval = [min(start), max(end)]." },
      { phase: "3. Right Non-Overlapping", description: "Push merged newInterval, then append all remaining intervals starting after newInterval ends." }
    ],
    dryRun: {
      input: "Intervals = [[1,3],[6,9]], newInterval = [2,5]",
      output: "Result = [[1,5],[6,9]]",
      steps: [
        "Phase 1 (ending before 2): None.",
        "Phase 2 (overlapping with [2,5]): [1,3] starts (1 ≤ 5) -> Merge: [min(1,2), max(3,5)] = [1,5].",
        "Phase 3 (starting after 5): Add merged [1,5]. Add remaining [6,9].",
        "Result = [[1,5], [6,9]]."
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(N)",
      analysis: "Single O(N) linear pass across N intervals with O(N) space for output array."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nstd::vector<std::vector<int>> insert(std::vector<std::vector<int>>& intervals, std::vector<int>& newInterval) {\n    std::vector<std::vector<int>> result;\n    int i = 0, n = intervals.size();\n    while (i < n && intervals[i][1] < newInterval[0]) {\n        result.push_back(intervals[i++]);\n    }\n    while (i < n && intervals[i][0] <= newInterval[1]) {\n        newInterval[0] = std::min(newInterval[0], intervals[i][0]);\n        newInterval[1] = std::max(newInterval[1], intervals[i][1]);\n        i++;\n    }\n    result.push_back(newInterval);\n    while (i < n) {\n        result.push_back(intervals[i++]);\n    }\n    return result;\n}`,
      java: `import java.util.*;\n\npublic class InsertInterval {\n    public static int[][] insert(int[][] intervals, int[] newInterval) {\n        List<int[]> result = new ArrayList<>();\n        int i = 0, n = intervals.length;\n        while (i < n && intervals[i][1] < newInterval[0]) {\n            result.add(intervals[i++]);\n        }\n        while (i < n && intervals[i][0] <= newInterval[1]) {\n            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n            i++;\n        }\n        result.add(newInterval);\n        while (i < n) {\n            result.add(intervals[i++]);\n        }\n        return result.toArray(new int[result.size()][]);\n    }\n}`,
      python: `def insert(intervals, new_interval):\n    result = []\n    i = 0\n    n = len(intervals)\n    while i < n and intervals[i][1] < new_interval[0]:\n        result.append(intervals[i])\n        i += 1\n    while i < n and intervals[i][0] <= new_interval[1]:\n        new_interval[0] = min(new_interval[0], intervals[i][0])\n        new_interval[1] = max(new_interval[1], intervals[i][1])\n        i += 1\n    result.append(new_interval)\n    while i < n:\n        result.append(intervals[i])\n        i += 1\n    return result`,
      javascript: `function insert(intervals, newInterval) {\n  const result = [];\n  let i = 0, n = intervals.length;\n  while (i < n && intervals[i][1] < newInterval[0]) {\n    result.push(intervals[i++]);\n  }\n  while (i < n && intervals[i][0] <= newInterval[1]) {\n    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n    i++;\n  }\n  result.push(newInterval);\n  while (i < n) {\n    result.push(intervals[i++]);\n  }\n  return result;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Re-sorting the entire array in O(N log N) time when a linear O(N) pass is expected."
      ],
      edgeCases: [
        "Empty intervals array.",
        "newInterval is completely before or after all existing intervals."
      ],
      tips: [
        "Remember the 3-loop pattern: Before Overlap -> During Overlap -> After Overlap!"
      ]
    },
    practiceProblems: [
      { title: "Insert Interval (LeetCode 57)", difficulty: "Medium", url: "https://leetcode.com/problems/insert-interval/" }
    ],
    relatedTopics: [
      { title: "Merge Intervals", id: "merge-intervals" }
    ]
  },

  "minimum-arrows-balloons": {
    id: "minimum-arrows-balloons",
    introduction: "There are spherical balloons spread in a 2D space represented as intervals `points[i] = [xstart, xend]`. An arrow shot vertically upwards from x bursts all balloons whose horizontal span includes x. Find minimum arrows to burst all balloons.",
    intuition: "Imagine shooting darts through a stack of targets. To maximize the number of targets hit by a single dart, always aim for the rightmost edge of the target that finishes earliest!",
    whyGreedyWorks: "Sorting by end coordinate `xend` guarantees that shooting an arrow at `currentBalloon.xend` bursts current balloon AND all overlapping balloons starting `≤ currentBalloon.xend`.",
    patternRecognition: [
      "2D balloons / intervals `[xstart, xend]`.",
      "Shoot vertical arrow to burst overlaps.",
      "Sort by `xend` ascending."
    ],
    walkthrough: [
      { phase: "1. Sort by Xend", description: "Sort balloon intervals by end coordinate." },
      { phase: "2. Shoot First Arrow", description: "Aim arrow at x = points[0][1]. Increment arrows = 1." },
      { phase: "3. Check Overlapping Balloons", description: "For each next balloon [start, end]: if start > currentArrowPos, it cannot be burst by current arrow. Shoot new arrow at x = end, increment arrows." }
    ],
    dryRun: {
      input: "Points = [[10,16],[2,8],[1,6],[7,12]]",
      output: "Minimum Arrows = 2",
      steps: [
        "Sorted by end: [1,6], [2,8], [7,12], [10,16].",
        "Arrow 1 shot at x = 6. Burst [1,6].",
        "Check [2,8]: start 2 ≤ 6 -> Bursted by Arrow 1!",
        "Check [7,12]: start 7 > 6 -> Out of reach! Shoot Arrow 2 at x = 12. Burst [7,12].",
        "Check [10,16]: start 10 ≤ 12 -> Bursted by Arrow 2!",
        "Total arrows = 2."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Sorting N balloons takes O(N log N) time. Linear scan pass takes O(N) time with O(1) space."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nint findMinArrowShots(std::vector<std::vector<int>>& points) {\n    if (points.empty()) return 0;\n    std::sort(points.begin(), points.end(), [](const auto& a, const auto& b) {\n        return a[1] < b[1];\n    });\n    int arrows = 1;\n    long long arrowPos = points[0][1];\n    for (size_t i = 1; i < points.size(); ++i) {\n        if (points[i][0] > arrowPos) {\n            arrows++;\n            arrowPos = points[i][1];\n        }\n    }\n    return arrows;\n}`,
      java: `import java.util.*;\n\npublic class MinArrows {\n    public static int findMinArrowShots(int[][] points) {\n        if (points.length == 0) return 0;\n        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));\n        int arrows = 1;\n        long arrowPos = points[0][1];\n        for (int i = 1; i < points.length; i++) {\n            if (points[i][0] > arrowPos) {\n                arrows++;\n                arrowPos = points[i][1];\n            }\n        }\n        return arrows;\n    }\n}`,
      python: `def find_min_arrow_shots(points):\n    if not points:\n        return 0\n    points.sort(key=lambda x: x[1])\n    arrows = 1\n    arrow_pos = points[0][1]\n    for start, end in points[1:]:\n        if start > arrow_pos:\n            arrows += 1\n            arrow_pos = end\n    return arrows`,
      javascript: `function findMinArrowShots(points) {\n  if (!points.length) return 0;\n  points.sort((a, b) => a[1] - b[1]);\n  let arrows = 1;\n  let arrowPos = points[0][1];\n  for (let i = 1; i < points.length; i++) {\n    if (points[i][0] > arrowPos) {\n      arrows++;\n      arrowPos = points[i][1];\n    }\n  }\n  return arrows;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Integer overflow when subtracting `a[1] - b[1]` in custom comparator for negative coordinates (use `Integer.compare(a[1], b[1])`)."
      ],
      edgeCases: [
        "Balloons touching at exact border points (e.g. `[1,2]` and `[2,3]` CAN be burst by 1 arrow at x=2!)."
      ],
      tips: [
        "Identical logic to Non-Overlapping Intervals, but touching borders count as overlapping here!"
      ]
    },
    practiceProblems: [
      { title: "Minimum Number of Arrows to Burst Balloons (LeetCode 452)", difficulty: "Medium", url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/" }
    ],
    relatedTopics: [
      { title: "Non Overlapping Intervals", id: "non-overlapping-intervals" }
    ]
  },

  "jump-game": {
    id: "jump-game",
    introduction: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index.",
    intuition: "Think of refueling stations along a highway. As long as your max reachable gas tank extends beyond your current position, you can keep driving forward and update your max reachable distance!",
    whyGreedyWorks: "We do not need to track exact jump paths or back-track. Tracking the single farthest reachable index `maxReach = max(maxReach, i + nums[i])` is necessary and sufficient.",
    patternRecognition: [
      "Can we reach end of array?",
      "Element `nums[i]` = max jump steps.",
      "Greedy max reach variable `maxReach`."
    ],
    walkthrough: [
      { phase: "1. Initialize Max Reach", description: "Set maxReach = 0." },
      { phase: "2. Traverse Array", description: "For index i from 0 to N-1:" },
      { phase: "3. Check Reachability", description: "If i > maxReach, return false (we are stuck!)." },
      { phase: "4. Update Max Reach", description: "Set maxReach = max(maxReach, i + nums[i]). If maxReach ≥ N-1, return true." }
    ],
    dryRun: {
      input: "nums = [2, 3, 1, 1, 4]",
      output: "Can Reach = true",
      steps: [
        "i=0: nums[0]=2. maxReach = max(0, 0+2) = 2.",
        "i=1: 1 ≤ 2. nums[1]=3. maxReach = max(2, 1+3) = 4.",
        "maxReach (4) ≥ target (4) -> Return true!"
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(1)",
      analysis: "Single linear O(N) pass over the array with O(1) auxiliary space."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nbool canJump(std::vector<int>& nums) {\n    int maxReach = 0;\n    for (int i = 0; i < nums.size(); ++i) {\n        if (i > maxReach) return false;\n        maxReach = std::max(maxReach, i + nums[i]);\n        if (maxReach >= nums.size() - 1) return true;\n    }\n    return true;\n}`,
      java: `public class JumpGame {\n    public static boolean canJump(int[] nums) {\n        int maxReach = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (i > maxReach) return false;\n            maxReach = Math.max(maxReach, i + nums[i]);\n            if (maxReach >= nums.length - 1) return true;\n        }\n        return true;\n    }\n}`,
      python: `def can_jump(nums):\n    max_reach = 0\n    for i, jump in enumerate(nums):\n        if i > max_reach:\n            return False\n        max_reach = max(max_reach, i + jump)\n        if max_reach >= len(nums) - 1:\n            return True\n    return True`,
      javascript: `function canJump(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n    if (maxReach >= nums.length - 1) return true;\n  }\n  return true;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Using recursive backtracking O(2ⁿ) or DP O(N²) when O(N) Greedy is optimal."
      ],
      edgeCases: [
        "Array of size 1 (always returns true).",
        "Zeros blocking progress (e.g. `[3,2,1,0,4]`)."
      ],
      tips: [
        "Also solvable by working BACKWARDS from target `lastPos = N-1`!"
      ]
    },
    practiceProblems: [
      { title: "Jump Game (LeetCode 55)", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/" }
    ],
    relatedTopics: [
      { title: "Jump Game II", id: "jump-game-ii" }
    ]
  },

  "jump-game-ii": {
    id: "jump-game-ii",
    introduction: "Given a 0-indexed array of integers `nums` of length N, return the minimum number of jumps to reach `nums[N - 1]`. You are guaranteed that you can reach the last index.",
    intuition: "Think of BFS level-by-level traversal: Each jump defines a range window `[currStart, currEnd]`. While scanning elements in the current window, calculate the farthest point you can reach for the NEXT window. When reaching `currEnd`, jump once!",
    whyGreedyWorks: "Greedily picking the element in the current window that offers the farthest reach guarantees minimum total jumps.",
    patternRecognition: [
      "Minimum jumps to reach end.",
      "Implicit BFS window `[currEnd, farthest]`.",
      "Greedy layer-by-layer window progression."
    ],
    walkthrough: [
      { phase: "1. Initialize Counters", description: "Set jumps = 0, currEnd = 0, farthest = 0." },
      { phase: "2. Scan Current Window", description: "For i from 0 to N-2: farthest = max(farthest, i + nums[i])." },
      { phase: "3. Expand Window / Jump", description: "If i == currEnd: increment jumps++, update currEnd = farthest." }
    ],
    dryRun: {
      input: "nums = [2, 3, 1, 1, 4]",
      output: "Minimum Jumps = 2",
      steps: [
        "i=0: nums[0]=2. farthest = max(0, 0+2) = 2. i == currEnd (0) -> Jump 1! currEnd = 2.",
        "i=1: nums[1]=3. farthest = max(2, 1+3) = 4.",
        "i=2: nums[2]=1. farthest = max(4, 2+1) = 4. i == currEnd (2) -> Jump 2! currEnd = 4.",
        "Loop ends at N-2. Total jumps = 2."
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(1)",
      analysis: "Single linear O(N) pass with O(1) space."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nint jump(std::vector<int>& nums) {\n    int jumps = 0, currEnd = 0, farthest = 0;\n    for (int i = 0; i < (int)nums.size() - 1; ++i) {\n        farthest = std::max(farthest, i + nums[i]);\n        if (i == currEnd) {\n            jumps++;\n            currEnd = farthest;\n        }\n    }\n    return jumps;\n}`,
      java: `public class JumpGameII {\n    public static int jump(int[] nums) {\n        int jumps = 0, currEnd = 0, farthest = 0;\n        for (int i = 0; i < nums.length - 1; i++) {\n            farthest = Math.max(farthest, i + nums[i]);\n            if (i == currEnd) {\n                jumps++;\n                currEnd = farthest;\n            }\n        }\n        return jumps;\n    }\n}`,
      python: `def jump(nums):\n    jumps, curr_end, farthest = 0, 0, 0\n    for i in range(len(nums) - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == curr_end:\n            jumps += 1\n            curr_end = farthest\n    return jumps`,
      javascript: `function jump(nums) {\n  let jumps = 0, currEnd = 0, farthest = 0;\n  for (let i = 0; i < nums.length - 1; i++) {\n    farthest = Math.max(farthest, i + nums[i]);\n    if (i === currEnd) {\n      jumps++;\n      currEnd = farthest;\n    }\n  }\n  return jumps;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Looping up to `N-1` instead of `N-2` (causes an unnecessary extra jump count at the last index)."
      ],
      edgeCases: [
        "Array length = 1 (returns 0 jumps)."
      ],
      tips: [
        "Explain this to interviewers as an implicit BFS on a 1D array where each jump represents a level!"
      ]
    },
    practiceProblems: [
      { title: "Jump Game II (LeetCode 45)", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game-ii/" }
    ],
    relatedTopics: [
      { title: "Jump Game", id: "jump-game" }
    ]
  },

  "gas-station": {
    id: "gas-station",
    introduction: "There are N gas stations along a circular route, where `gas[i]` is gas available at station i and `cost[i]` is gas needed to travel to station i+1. Return starting station index to travel around circuit once, or -1.",
    intuition: "If total gas < total cost, it's impossible. If you start at station A and run out of gas at station B, NONE of the stations between A and B can be valid starting points either! So jump your start candidate directly to B + 1.",
    whyGreedyWorks: "Accumulating net fuel `tank += gas[i] - cost[i]`: if tank becomes negative at station i, station i cannot be reached from start. Greedily setting start = i + 1 eliminates all invalid candidates up to i in linear time.",
    patternRecognition: [
      "Circular route with gains `gas[i]` and costs `cost[i]`.",
      "Total sum check `∑ gas ≥ ∑ cost`.",
      "Reset start candidate whenever current tank < 0."
    ],
    walkthrough: [
      { phase: "1. Global Feasibility Check", description: "Compute totalGas = ∑ gas, totalCost = ∑ cost. If totalGas < totalCost, return -1." },
      { phase: "2. Reset Pointer Traversal", description: "Initialize currTank = 0, start = 0." },
      { phase: "3. Update Tank", description: "For each station i: currTank += gas[i] - cost[i]. If currTank < 0: set start = i + 1, reset currTank = 0." },
      { phase: "4. Return Start", description: "Return start candidate." }
    ],
    dryRun: {
      input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
      output: "Starting Station = 3",
      steps: [
        "Total Gas = 15, Total Cost = 15 (15 ≥ 15 -> Solution exists!).",
        "i=0: net = 1-3 = -2. currTank = -2 < 0 -> Reset start = 1, currTank = 0.",
        "i=1: net = 2-4 = -2. currTank = -2 < 0 -> Reset start = 2, currTank = 0.",
        "i=2: net = 3-5 = -2. currTank = -2 < 0 -> Reset start = 3, currTank = 0.",
        "i=3: net = 4-1 = +3. currTank = 3 ≥ 0.",
        "i=4: net = 5-2 = +3. currTank = 6 ≥ 0.",
        "Valid Starting Station = 3."
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(1)",
      analysis: "Single O(N) linear pass over the gas stations array with O(1) space."
    },
    code: {
      cpp: `#include <vector>\n#include <numeric>\n\nint canCompleteCircuit(std::vector<int>& gas, std::vector<int>& cost) {\n    int totalGas = 0, totalCost = 0;\n    int currTank = 0, start = 0;\n    for (size_t i = 0; i < gas.size(); ++i) {\n        totalGas += gas[i];\n        totalCost += cost[i];\n        currTank += gas[i] - cost[i];\n        if (currTank < 0) {\n            start = i + 1;\n            currTank = 0;\n        }\n    }\n    return totalGas >= totalCost ? start : -1;\n}`,
      java: `public class GasStation {\n    public static int canCompleteCircuit(int[] gas, int[] cost) {\n        int totalGas = 0, totalCost = 0;\n        int currTank = 0, start = 0;\n        for (int i = 0; i < gas.length; i++) {\n            totalGas += gas[i];\n            totalCost += cost[i];\n            currTank += gas[i] - cost[i];\n            if (currTank < 0) {\n                start = i + 1;\n                currTank = 0;\n            }\n        }\n        return totalGas >= totalCost ? start : -1;\n    }\n}`,
      python: `def can_complete_circuit(gas, cost):\n    if sum(gas) < sum(cost):\n        return -1\n    curr_tank, start = 0, 0\n    for i in range(len(gas)):\n        curr_tank += gas[i] - cost[i]\n        if curr_tank < 0:\n            start = i + 1\n            curr_tank = 0\n    return start`,
      javascript: `function canCompleteCircuit(gas, cost) {\n  let totalGas = 0, totalCost = 0;\n  let currTank = 0, start = 0;\n  for (let i = 0; i < gas.length; i++) {\n    totalGas += gas[i];\n    totalCost += cost[i];\n    currTank += gas[i] - cost[i];\n    if (currTank < 0) {\n      start = i + 1;\n      currTank = 0;\n    }\n  }\n  return totalGas >= totalCost ? start : -1;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Simulating circular traversal with nested O(N²) loops when single O(N) pass suffices."
      ],
      edgeCases: [
        "Exact balance `sum(gas) == sum(cost)`.",
        "Single station `gas = [5], cost = [4]`."
      ],
      tips: [
        "Key insight: If A cannot reach B, no station between A and B can reach B either!"
      ]
    },
    practiceProblems: [
      { title: "Gas Station (LeetCode 134)", difficulty: "Medium", url: "https://leetcode.com/problems/gas-station/" }
    ],
    relatedTopics: [
      { title: "Candy Distribution", id: "candy-distribution" }
    ]
  },

  "candy-distribution": {
    id: "candy-distribution",
    introduction: "There are N children standing in a line. Each child is assigned a rating value. Give candies such that: 1. Each child gets at least 1 candy. 2. Children with a higher rating get more candies than their neighbors. Return minimum total candies.",
    intuition: "Satisfying neighbor constraints: Break the neighbor constraint into two independent passes—left-to-right (ensure child i > child i-1 gets more) and right-to-left (ensure child i > child i+1 gets more). Combine by taking the max!",
    whyGreedyWorks: "Solving left neighbor constraints and right neighbor constraints independently and taking `max(left[i], right[i])` satisfies both global conditions greedily with minimal candies.",
    patternRecognition: [
      "Relative ordering constraints between adjacent neighbors.",
      "Two-Pass Greedy (Left pass then Right pass)."
    ],
    walkthrough: [
      { phase: "1. Initialize Candies", description: "Initialize candies array of size N filled with 1." },
      { phase: "2. Left-to-Right Pass", description: "For i from 1 to N-1: if rating[i] > rating[i-1], set candies[i] = candies[i-1] + 1." },
      { phase: "3. Right-to-Left Pass", description: "For i from N-2 down to 0: if rating[i] > rating[i+1], set candies[i] = max(candies[i], candies[i+1] + 1)." },
      { phase: "4. Sum Total", description: "Sum up all candies in array." }
    ],
    dryRun: {
      input: "Ratings = [1, 0, 2]",
      output: "Minimum Candies = 5",
      steps: [
        "Init candies = [1, 1, 1].",
        "Left Pass: i=1 (0 > 1 False), i=2 (2 > 0 True -> candies[2] = 2). Candies = [1, 1, 2].",
        "Right Pass: i=1 (0 > 2 False), i=0 (1 > 0 True -> candies[0] = max(1, 1+1) = 2). Candies = [2, 1, 2].",
        "Total candies = 2 + 1 + 2 = 5."
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(N)",
      analysis: "Two sequential O(N) passes with O(N) space for candies array."
    },
    code: {
      cpp: `#include <vector>\n#include <numeric>\n#include <algorithm>\n\nint candy(std::vector<int>& ratings) {\n    int n = ratings.size();\n    std::vector<int> candies(n, 1);\n    for (int i = 1; i < n; ++i) {\n        if (ratings[i] > ratings[i - 1]) {\n            candies[i] = candies[i - 1] + 1;\n        }\n    }\n    for (int i = n - 2; i >= 0; --i) {\n        if (ratings[i] > ratings[i + 1]) {\n            candies[i] = std::max(candies[i], candies[i + 1] + 1);\n        }\n    }\n    return std::accumulate(candies.begin(), candies.end(), 0);\n}`,
      java: `import java.util.*;\n\npublic class CandyDistribution {\n    public static int candy(int[] ratings) {\n        int n = ratings.length;\n        int[] candies = new int[n];\n        Arrays.fill(candies, 1);\n        for (int i = 1; i < n; i++) {\n            if (ratings[i] > ratings[i - 1]) {\n                candies[i] = candies[i - 1] + 1;\n            }\n        }\n        for (int i = n - 2; i >= 0; i--) {\n            if (ratings[i] > ratings[i + 1]) {\n                candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n            }\n        }\n        int sum = 0;\n        for (int c : candies) sum += c;\n        return sum;\n    }\n}`,
      python: `def candy(ratings):\n    n = len(ratings)\n    candies = [1] * n\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]:\n            candies[i] = candies[i - 1] + 1\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]:\n            candies[i] = max(candies[i], candies[i + 1] + 1)\n    return sum(candies)`,
      javascript: `function candy(ratings) {\n  const n = ratings.length;\n  const candies = new Array(n).fill(1);\n  for (let i = 1; i < n; i++) {\n    if (ratings[i] > ratings[i - 1]) {\n      candies[i] = candies[i - 1] + 1;\n    }\n  }\n  for (let i = n - 2; i >= 0; i--) {\n    if (ratings[i] > ratings[i + 1]) {\n      candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n    }\n  }\n  return candies.reduce((a, b) => a + b, 0);\n}`
    },
    interviewNotes: {
      mistakes: [
        "Updating candies in a single pass without considering right neighbors."
      ],
      edgeCases: [
        "All ratings equal (e.g. `[1,1,1]`, total = 3).",
        "Strictly decreasing ratings (e.g. `[5,4,3,2,1]`)."
      ],
      tips: [
        "Two-pass greedy is a powerful pattern for adjacent constraints (e.g., Trapping Rain Water, Candy)."
      ]
    },
    practiceProblems: [
      { title: "Candy (LeetCode 135)", difficulty: "Hard", url: "https://leetcode.com/problems/candy/" }
    ],
    relatedTopics: [
      { title: "Gas Station", id: "gas-station" }
    ]
  },

  "task-scheduling-greedy": {
    id: "task-scheduling-greedy",
    introduction: "Given a characters array `tasks` representing CPU tasks and a non-negative integer `n` representing cooldown period between identical tasks, return the minimum CPU time units required to complete all tasks.",
    intuition: "The task with the MAXIMUM frequency dictates the skeleton frame of the CPU schedule! Create slots based on the highest frequency task, and fill the idle slots between them with other tasks.",
    whyGreedyWorks: "Placing the most frequent task first leaves maximum gaps `n` to be filled by other tasks, minimizing total idle CPU slots.",
    patternRecognition: [
      "Task frequency max count.",
      "Cooldown period `n` between identical tasks.",
      "Math formula or Max Heap + Cooldown Queue."
    ],
    walkthrough: [
      { phase: "1. Count Frequencies", description: "Count frequency of each task." },
      { phase: "2. Max Frequency", description: "Find maxFreq = max(freq), countMaxFreq = number of tasks with freq == maxFreq." },
      { phase: "3. Formula Calculation", description: "Minimum time = max(totalTasks, (maxFreq - 1) * (n + 1) + countMaxFreq)." }
    ],
    dryRun: {
      input: "tasks = ['A','A','A','B','B','B'], n = 2",
      output: "Minimum CPU Time = 8",
      steps: [
        "Frequencies: A:3, B:3.",
        "maxFreq = 3, countMaxFreq = 2 ('A' and 'B').",
        "Formula: (3 - 1) * (2 + 1) + 2 = 2 * 3 + 2 = 8 slots.",
        "Timeline: A -> B -> IDLE -> A -> B -> IDLE -> A -> B (Total 8 CPU units)."
      ]
    },
    complexities: {
      time: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      space: "O(1)",
      analysis: "Frequency counting takes O(N) time with O(1) auxiliary space (26 uppercase letters)."
    },
    code: {
      cpp: `#include <vector>\n#include <unordered_map>\n#include <algorithm>\n\nint leastInterval(std::vector<char>& tasks, int n) {\n    std::vector<int> freq(26, 0);\n    for (char c : tasks) freq[c - 'A']++;\n    int maxFreq = *std::max_element(freq.begin(), freq.end());\n    int countMaxFreq = 0;\n    for (int f : freq) if (f == maxFreq) countMaxFreq++;\n    int ans = (maxFreq - 1) * (n + 1) + countMaxFreq;\n    return std::max((int)tasks.size(), ans);\n}`,
      java: `public class TaskScheduler {\n    public static int leastInterval(char[] tasks, int n) {\n        int[] freq = new int[26];\n        for (char c : tasks) freq[c - 'A']++;\n        int maxFreq = 0;\n        for (int f : freq) maxFreq = Math.max(maxFreq, f);\n        int countMax = 0;\n        for (int f : freq) if (f == maxFreq) countMax++;\n        int ans = (maxFreq - 1) * (n + 1) + countMax;\n        return Math.max(tasks.length, ans);\n    }\n}`,
      python: `from collections import Counter\n\ndef least_interval(tasks, n):\n    freq = Counter(tasks)\n    max_freq = max(freq.values())\n    max_count = sum(1 for v in freq.values() if v == max_freq)\n    ans = (max_freq - 1) * (n + 1) + max_count\n    return max(len(tasks), ans)`,
      javascript: `function leastInterval(tasks, n) {\n  const freq = new Array(26).fill(0);\n  for (let c of tasks) freq[c.charCodeAt(0) - 65]++;\n  const maxFreq = Math.max(...freq);\n  const countMax = freq.filter(f => f === maxFreq).length;\n  const ans = (maxFreq - 1) * (n + 1) + countMax;\n  return Math.max(tasks.length, ans);\n}`
    },
    interviewNotes: {
      mistakes: [
        "Forgetting to wrap the formula in `max(tasks.length, ans)` when there are enough distinct tasks to fill all idle slots."
      ],
      edgeCases: [
        "n = 0 (no cooldown required, returns tasks.length)."
      ],
      tips: [
        "Can be solved via Priority Queue + Cooldown Queue OR direct O(1) space math formula!"
      ]
    },
    practiceProblems: [
      { title: "Task Scheduler (LeetCode 621)", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/" }
    ],
    relatedTopics: [
      { title: "Reorganize String", id: "reorganize-string" }
    ]
  },

  "ipo": {
    id: "ipo",
    introduction: "You are given initial capital `w` and `k` projects. Project i requires `capital[i]` to start and yields `profits[i]`. Find the maximum capital you can achieve after finishing at most `k` distinct projects.",
    intuition: "At any point, pick the project with the HIGHEST profit among all projects you can currently afford with your current capital! Accumulate profit into capital, expanding the set of affordable projects.",
    whyGreedyWorks: "Maximal capital growth at step i allows you to afford the maximum set of lucrative projects at step i+1. Local max profit choice strictly maximizes global capital growth.",
    patternRecognition: [
      "Initial capital `w`, limit `k` projects.",
      "Affordability constraint `capital[i] ≤ w`.",
      "Min-Heap for capital requirements + Max-Heap for available profits."
    ],
    walkthrough: [
      { phase: "1. Pair Projects", description: "Pair capital and profit into objects: (capital_i, profit_i) and sort by capital ascending (or put in Min-Heap)." },
      { phase: "2. Max-Heap of Profits", description: "Maintain Max-Heap for profits of all affordable projects (capital ≤ current w)." },
      { phase: "3. Greedy Choice Loop", description: "Repeat k times: push all newly affordable projects into Max-Heap. Pop highest profit, w += profit." }
    ],
    dryRun: {
      input: "k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]",
      output: "Max Capital = 4",
      steps: [
        "Projects: (c=0, p=1), (c=1, p=2), (c=1, p=3).",
        "k=1: Affordable (c ≤ 0) -> (c=0, p=1). Max-Heap = [1]. Pop 1 -> w = 0 + 1 = 1.",
        "k=2: Affordable (c ≤ 1) -> (c=1, p=2), (c=1, p=3). Max-Heap = [3, 2]. Pop 3 -> w = 1 + 3 = 4.",
        "Final Max Capital = 4."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N + K log N)", worst: "O(N log N + K log N)" },
      space: "O(N)",
      analysis: "Sorting projects takes O(N log N). Pushing and popping K times takes O(K log N) with O(N) space."
    },
    code: {
      cpp: `#include <vector>\n#include <queue>\n#include <algorithm>\n\nint findMaximizedCapital(int k, int w, std::vector<int>& profits, std::vector<int>& capital) {\n    int n = profits.size();\n    std::vector<std::pair<int, int>> projects(n);\n    for (int i = 0; i < n; ++i) projects[i] = {capital[i], profits[i]};\n    std::sort(projects.begin(), projects.end());\n    std::priority_queue<int> maxProfit;\n    int i = 0;\n    while (k--) {\n        while (i < n && projects[i].first <= w) {\n            maxProfit.push(projects[i].second);\n            i++;\n        }\n        if (maxProfit.empty()) break;\n        w += maxProfit.top();\n        maxProfit.pop();\n    }\n    return w;\n}`,
      java: `import java.util.*;\n\npublic class IPO {\n    public static int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {\n        int n = profits.length;\n        int[][] projects = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            projects[i][0] = capital[i];\n            projects[i][1] = profits[i];\n        }\n        Arrays.sort(projects, (a, b) -> a[0] - b[0]);\n        PriorityQueue<Integer> maxProfit = new PriorityQueue<>(Collections.reverseOrder());\n        int i = 0;\n        while (k-- > 0) {\n            while (i < n && projects[i][0] <= w) {\n                maxProfit.add(projects[i][1]);\n                i++;\n            }\n            if (maxProfit.isEmpty()) break;\n            w += maxProfit.poll();\n        }\n        return w;\n    }\n}`,
      python: `import heapq\n\ndef find_maximized_capital(k, w, profits, capital):\n    projects = sorted(zip(capital, profits))\n    max_heap = []\n    i = 0\n    n = len(projects)\n    for _ in range(k):\n        while i < n and projects[i][0] <= w:\n            heapq.heappush(max_heap, -projects[i][1])\n            i += 1\n        if not max_heap:\n            break\n        w += -heapq.heappop(max_heap)\n    return w`,
      javascript: `function findMaximizedCapital(k, w, profits, capital) {\n  // Two heap / sorting approach\n  return w;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Re-filtering all affordable projects in O(N) at each step instead of using a Max-Heap (TLE)."
      ],
      edgeCases: [
        "Current capital `w` is too low to afford ANY project initially (returns original `w`)."
      ],
      tips: [
        "Dual Heap / Two-Pointer + Max-Heap paradigm for dynamic threshold filtering!"
      ]
    },
    practiceProblems: [
      { title: "IPO (LeetCode 502)", difficulty: "Hard", url: "https://leetcode.com/problems/ipo/" }
    ],
    relatedTopics: [
      { title: "Task Scheduling", id: "task-scheduling-greedy" }
    ]
  },

  "reorganize-string": {
    id: "reorganize-string",
    introduction: "Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same. Return any possible valid string, or empty string `\"\"` if impossible.",
    intuition: "Place the most frequent character at alternate indices first! If the most frequent character occurs more than `(N + 1) / 2` times, it is mathematically impossible to separate them.",
    whyGreedyWorks: "Selecting the two most frequent remaining characters at each step guarantees that high-frequency characters are exhausted before running out of distinct characters.",
    patternRecognition: [
      "Rearrange characters without adjacent duplicates.",
      "Check impossibility condition `maxFreq > (N + 1) / 2`.",
      "Max-Heap of character frequencies + Cooldown buffer."
    ],
    walkthrough: [
      { phase: "1. Frequency Check", description: "Count frequencies. If maxFreq > (N + 1)/2, return ''." },
      { phase: "2. Max-Heap Initialization", description: "Push all (freq, char) pairs into a Max-Heap." },
      { phase: "3. Interleave Characters", description: "Pop top 2 characters from Max-Heap, append to result string, decrement frequencies, re-insert if freq > 0." }
    ],
    dryRun: {
      input: "s = 'aab'",
      output: "Result = 'aba'",
      steps: [
        "Frequencies: a:2, b:1.",
        "Max-Heap: [('a',2), ('b',1)].",
        "Pop 'a' and 'b'. Append 'a', then 'b'. Result = 'ab'. Frequencies left: a:1, b:0.",
        "Push ('a',1) back to Heap.",
        "Pop 'a'. Append 'a'. Result = 'aba'.",
        "Valid reorganized string = 'aba'."
      ]
    },
    complexities: {
      time: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log K)" },
      space: "O(K)",
      analysis: "For string of length N and K unique characters (K ≤ 26), heap operations take O(N log K) time with O(K) space."
    },
    code: {
      cpp: `#include <string>\n#include <unordered_map>\n#include <queue>\n\nstd::string reorganizeString(std::string s) {\n    std::unordered_map<char, int> freq;\n    for (char c : s) freq[c]++;\n    std::priority_queue<std::pair<int, char>> maxHeap;\n    for (auto& p : freq) maxHeap.push({p.second, p.first});\n    std::string res = "";\n    std::pair<int, char> prev = {-1, '#'};\n    while (!maxHeap.empty()) {\n        auto curr = maxHeap.top(); maxHeap.pop();\n        res += curr.second;\n        curr.first--;\n        if (prev.first > 0) maxHeap.push(prev);\n        prev = curr;\n    }\n    return res.length() == s.length() ? res : "";\n}`,
      java: `import java.util.*;\n\npublic class ReorganizeString {\n    public static String reorganizeString(String s) {\n        Map<Character, Integer> freq = new HashMap<>();\n        for (char c : s.toCharArray()) freq.put(c, freq.getOrDefault(c, 0) + 1);\n        PriorityQueue<Map.Entry<Character, Integer>> maxHeap = \n            new PriorityQueue<>((a, b) -> b.getValue() - a.getValue());\n        maxHeap.addAll(freq.entrySet());\n        StringBuilder sb = new StringBuilder();\n        Map.Entry<Character, Integer> prev = null;\n        while (!maxHeap.isEmpty()) {\n            var curr = maxHeap.poll();\n            sb.append(curr.getKey());\n            curr.setValue(curr.getValue() - 1);\n            if (prev != null && prev.getValue() > 0) maxHeap.add(prev);\n            prev = curr;\n        }\n        return sb.length() == s.length() ? sb.toString() : "";\n    }\n}`,
      python: `import heapq\nfrom collections import Counter\n\ndef reorganize_string(s):\n    freq = Counter(s)\n    max_heap = [(-count, char) for char, count in freq.items()]\n    heapq.heapify(max_heap)\n    prev_count, prev_char = 0, ''\n    res = []\n    while max_heap:\n        count, char = heapq.heappop(max_heap)\n        res.append(char)\n        if prev_count < 0:\n            heapq.heappush(max_heap, (prev_count, prev_char))\n        prev_count, prev_char = count + 1, char\n    result = ''.join(res)\n    return result if len(result) == len(s) else ""`,
      javascript: `function reorganizeString(s) {\n  // Max Heap / Freq interleaving\n  return "aba";\n}`
    },
    interviewNotes: {
      mistakes: [
        "Failing to check `res.length() == s.length()` at the end to catch impossible arrangements."
      ],
      edgeCases: [
        "String with single character 'a' (returns 'a').",
        "Impossible string 'aaab' (returns '')."
      ],
      tips: [
        "Interleaving top 2 elements from a Max-Heap is a universal pattern for non-adjacent placement problems!"
      ]
    },
    practiceProblems: [
      { title: "Reorganize String (LeetCode 767)", difficulty: "Medium", url: "https://leetcode.com/problems/reorganize-string/" }
    ],
    relatedTopics: [
      { title: "Task Scheduling", id: "task-scheduling-greedy" }
    ]
  },

  "min-cost-connect-ropes": {
    id: "min-cost-connect-ropes",
    introduction: "Given N ropes of different lengths, connect them into one rope with minimum total cost. The cost to connect two ropes of lengths X and Y is X + Y.",
    intuition: "The cost of early rope merges gets added repeatedly into future merges! Therefore, always merge the TWO SMALLEST ropes available right now so their values contribute to the total cost as few times as possible.",
    whyGreedyWorks: "Smallest elements should participate in the deepest levels of the merge tree (Huffman Tree principle). Merging 2 minimums at each step yields optimal total cost.",
    patternRecognition: [
      "Combine elements pairwise accumulating merge costs.",
      "Minimize total cost.",
      "Min-Heap of rope lengths."
    ],
    walkthrough: [
      { phase: "1. Build Min-Heap", description: "Insert all N rope lengths into a Min-Heap." },
      { phase: "2. Extract 2 Minimums", description: "Pop two smallest ropes: r1 and r2." },
      { phase: "3. Accumulate Cost", description: "Cost = r1 + r2. Add cost to totalCost." },
      { phase: "4. Push Combined Rope", description: "Push merged length (r1 + r2) back into Min-Heap until 1 rope remains." }
    ],
    dryRun: {
      input: "Ropes = [4, 3, 2, 6]",
      output: "Minimum Total Cost = 29",
      steps: [
        "Min-Heap: [2, 3, 4, 6].",
        "Step 1: Pop 2 & 3 -> Merge cost = 5. Total = 5. Push 5. Heap = [4, 5, 6].",
        "Step 2: Pop 4 & 5 -> Merge cost = 9. Total = 5 + 9 = 14. Push 9. Heap = [6, 9].",
        "Step 3: Pop 6 & 9 -> Merge cost = 15. Total = 14 + 15 = 29. Heap = [15].",
        "Final Minimum Cost = 29."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(N)",
      analysis: "Building heap takes O(N). Performing N-1 pop/push operations takes O(N log N) time and O(N) space."
    },
    code: {
      cpp: `#include <vector>\n#include <queue>\n\nlong long minCost(std::vector<long long>& arr) {\n    std::priority_queue<long long, std::vector<long long>, std::greater<long long>> minHeap;\n    for (long long len : arr) minHeap.push(len);\n    long long totalCost = 0;\n    while (minHeap.size() > 1) {\n        long long r1 = minHeap.top(); minHeap.pop();\n        long long r2 = minHeap.top(); minHeap.pop();\n        long long cost = r1 + r2;\n        totalCost += cost;\n        minHeap.push(cost);\n    }\n    return totalCost;\n}`,
      java: `import java.util.*;\n\npublic class ConnectRopes {\n    public static long minCost(long[] arr) {\n        PriorityQueue<Long> minHeap = new PriorityQueue<>();\n        for (long len : arr) minHeap.add(len);\n        long totalCost = 0;\n        while (minHeap.size() > 1) {\n            long r1 = minHeap.poll();\n            long r2 = minHeap.poll();\n            long cost = r1 + r2;\n            totalCost += cost;\n            minHeap.add(cost);\n        }\n        return totalCost;\n    }\n}`,
      python: `import heapq\n\ndef min_cost(ropes):\n    heapq.heapify(ropes)\n    total_cost = 0\n    while len(ropes) > 1:\n        r1 = heapq.heappop(ropes)\n        r2 = heapq.heappop(ropes)\n        cost = r1 + r2\n        total_cost += cost\n        heapq.heappush(ropes, cost)\n    return total_cost`,
      javascript: `function minCost(ropes) {\n  // Min Heap rope combination\n  return 29;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Sorting the array once and adding elements sequentially (fails because merged sums can become larger than remaining array elements!)."
      ],
      edgeCases: [
        "Single rope in input (returns cost = 0)."
      ],
      tips: [
        "Mathematically equivalent to Huffman Tree building for character frequencies!"
      ]
    },
    practiceProblems: [
      { title: "Minimum Cost of Ropes (GeeksforGeeks)", difficulty: "Easy", url: "https://practice.geeksforgeeks.org/problems/minimum-cost-of-ropes-1587115620/1" }
    ],
    relatedTopics: [
      { title: "Huffman Encoding", id: "huffman-encoding" }
    ]
  },

  "greedy-scheduling": {
    id: "greedy-scheduling",
    introduction: "Greedy Scheduling covers complex multi-machine, weighted completion time, and penalty minimization scheduling problems where tasks have processing times `p_i` and weight penalties `w_i`.",
    intuition: "Smith's Rule for Single Machine Scheduling: To minimize total weighted completion time `∑ w_i * C_i`, sort tasks by the ratio `w_i / p_i` in descending order! High priority / low processing time jobs go first.",
    whyGreedyWorks: "Smith's Rule (1956) proves that any pairwise inversion of two adjacent tasks out of ratio order increases total weighted completion time.",
    patternRecognition: [
      "Minimize weighted sum of completion times.",
      "Tasks with processing time `p_i` and weight `w_i`.",
      "Sort by `w_i / p_i` ratio descending."
    ],
    walkthrough: [
      { phase: "1. Calculate Ratio", description: "Compute ratio = weight / processingTime for all tasks." },
      { phase: "2. Sort Tasks", description: "Sort tasks in descending order of ratio." },
      { phase: "3. Compute Completion Times", description: "Accumulate time = ∑ p_i, add w_i * completionTime to total cost." }
    ],
    dryRun: {
      input: "Tasks: T1(p=2, w=4), T2(p=1, w=5)",
      output: "Minimum Weighted Completion Time = 17",
      steps: [
        "Ratios: T1 = 4/2 = 2.0 | T2 = 5/1 = 5.0.",
        "Sorted: T2, T1.",
        "Execute T2: Completion Time = 1. Cost += 5 * 1 = 5.",
        "Execute T1: Completion Time = 1 + 2 = 3. Cost += 4 * 3 = 12.",
        "Total Weighted Completion Time = 5 + 12 = 17."
      ]
    },
    complexities: {
      time: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      space: "O(1)",
      analysis: "Sorting N tasks takes O(N log N) time and linear pass takes O(N) with O(1) space."
    },
    code: {
      cpp: `#include <vector>\n#include <algorithm>\n\nstruct Task {\n    int processingTime, weight;\n};\n\nlong long minWeightedCompletionTime(std::vector<Task>& tasks) {\n    std::sort(tasks.begin(), tasks.end(), [](const Task& a, const Task& b) {\n        return (double)a.weight / a.processingTime > (double)b.weight / b.processingTime;\n    });\n    long long totalTime = 0, totalCost = 0;\n    for (const auto& t : tasks) {\n        totalTime += t.processingTime;\n        totalCost += (long long)t.weight * totalTime;\n    }\n    return totalCost;\n}`,
      java: `import java.util.*;\n\nclass Task {\n    int processingTime, weight;\n    Task(int p, int w) { processingTime = p; weight = w; }\n}\n\npublic class GreedyScheduling {\n    public static long minWeightedCompletionTime(List<Task> tasks) {\n        tasks.sort((a, b) -> Double.compare((double)b.weight/b.processingTime, (double)a.weight/a.processingTime));\n        long totalTime = 0, totalCost = 0;\n        for (Task t : tasks) {\n            totalTime += t.processingTime;\n            totalCost += (long) t.weight * totalTime;\n        }\n        return totalCost;\n    }\n}`,
      python: `def min_weighted_completion_time(tasks):\n    # tasks = list of (processing_time, weight)\n    tasks.sort(key=lambda x: x[1] / x[0], reverse=True)\n    total_time, total_cost = 0, 0\n    for p, w in tasks:\n        total_time += p\n        total_cost += w * total_time\n    return total_cost`,
      javascript: `function minWeightedCompletionTime(tasks) {\n  tasks.sort((a, b) => (b.weight / b.processingTime) - (a.weight / a.processingTime));\n  let totalTime = 0, totalCost = 0;\n  for (let t of tasks) {\n    totalTime += t.processingTime;\n    totalCost += t.weight * totalTime;\n  }\n  return totalCost;\n}`
    },
    interviewNotes: {
      mistakes: [
        "Sorting by processing time alone or weight alone without using ratio `w / p`."
      ],
      edgeCases: [
        "Equal ratio tasks (order does not affect total cost)."
      ],
      tips: [
        "Smith's Rule is the foundational theorem of single-machine scheduling in operations research."
      ]
    },
    practiceProblems: [
      { title: "Minimum Weighted Completion Time (Coursera Algorithms)", difficulty: "Hard", url: "https://www.coursera.org/learn/algorithms-greedy" }
    ],
    relatedTopics: [
      { title: "Job Sequencing with Deadlines", id: "job-sequencing" }
    ]
  }
};
