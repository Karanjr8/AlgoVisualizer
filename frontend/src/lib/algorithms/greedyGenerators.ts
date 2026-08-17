import type { VisualElement, VisualizationFrame } from '../../types/visualizer';

const defaultElements: VisualElement[] = [
  { id: 'el-0', value: 10, state: 'normal' },
  { id: 'el-1', value: 20, state: 'normal' },
  { id: 'el-2', value: 30, state: 'normal' },
];

export function generateGreedyIntroFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { targetCoins: 18, coinChoices: [{ coin: 10, remaining: 18, status: 'exploring' }], coinsUsed: [] },
      event: { type: 'INIT', explanation: 'Target amount = 18. Available coin denominations = [1, 2, 5, 10].' }
    },
    {
      elements: defaultElements,
      greedyState: { targetCoins: 18, coinChoices: [{ coin: 10, remaining: 8, status: 'picked' }], coinsUsed: [10] },
      event: { type: 'SELECT', explanation: 'Picked largest coin ≤ 18: Coin 10. Remaining target = 8.' }
    },
    {
      elements: defaultElements,
      greedyState: { targetCoins: 18, coinChoices: [{ coin: 5, remaining: 3, status: 'picked' }], coinsUsed: [10, 5] },
      event: { type: 'SELECT', explanation: 'Picked largest coin ≤ 8: Coin 5. Remaining target = 3.' }
    },
    {
      elements: defaultElements,
      greedyState: { targetCoins: 18, coinChoices: [{ coin: 2, remaining: 1, status: 'picked' }], coinsUsed: [10, 5, 2] },
      event: { type: 'SELECT', explanation: 'Picked largest coin ≤ 3: Coin 2. Remaining target = 1.' }
    },
    {
      elements: defaultElements,
      greedyState: { targetCoins: 18, coinChoices: [{ coin: 1, remaining: 0, status: 'picked' }], coinsUsed: [10, 5, 2, 1] },
      event: { type: 'COMPLETE', explanation: 'Target 18 reached! Total coins used = 4 [10, 5, 2, 1].' }
    }
  ];
}

export function generateActivitySelectionFrames(): VisualizationFrame[] {
  const acts = [
    { id: 'A', name: 'A', start: 1, end: 3, status: 'normal' },
    { id: 'B', name: 'B', start: 2, end: 5, status: 'normal' },
    { id: 'C', name: 'C', start: 4, end: 6, status: 'normal' },
    { id: 'D', name: 'D', start: 6, end: 7, status: 'normal' },
  ];

  return [
    {
      elements: defaultElements,
      greedyState: { activities: acts.map(a => ({ ...a, selected: false, discarded: false })) },
      event: { type: 'INIT', explanation: 'Activity Selection: Activities sorted by finish time.' }
    },
    {
      elements: defaultElements,
      greedyState: { activities: [
        { ...acts[0], selected: true },
        { ...acts[1], discarded: false },
        { ...acts[2], discarded: false },
        { ...acts[3], discarded: false },
      ] },
      event: { type: 'SELECT', explanation: 'Selected Activity A [1,3] (earliest finish time). Last finish = 3.' }
    },
    {
      elements: defaultElements,
      greedyState: { activities: [
        { ...acts[0], selected: true },
        { ...acts[1], discarded: true },
        { ...acts[2], discarded: false },
        { ...acts[3], discarded: false },
      ] },
      event: { type: 'ELIMINATE', explanation: 'Activity B [2,5] starts at 2 < 3. Conflicting! Discarded B.' }
    },
    {
      elements: defaultElements,
      greedyState: { activities: [
        { ...acts[0], selected: true },
        { ...acts[1], discarded: true },
        { ...acts[2], selected: true },
        { ...acts[3], discarded: false },
      ] },
      event: { type: 'SELECT', explanation: 'Activity C [4,6] starts at 4 ≥ 3. Non-conflicting! Selected C. Last finish = 6.' }
    },
    {
      elements: defaultElements,
      greedyState: { activities: [
        { ...acts[0], selected: true },
        { ...acts[1], discarded: true },
        { ...acts[2], selected: true },
        { ...acts[3], selected: true },
      ] },
      event: { type: 'COMPLETE', explanation: 'Activity D [6,7] starts at 6 ≥ 6. Selected D. Maximum non-conflicting activities = 3 [A, C, D].' }
    }
  ];
}

export function generateFractionalKnapsackFrames(): VisualizationFrame[] {
  const items = [
    { id: '1', weight: 10, value: 60, ratio: 6.0, takenFraction: 0 },
    { id: '2', weight: 20, value: 100, ratio: 5.0, takenFraction: 0 },
    { id: '3', weight: 30, value: 120, ratio: 4.0, takenFraction: 0 },
  ];

  return [
    {
      elements: defaultElements,
      greedyState: { knapsackItems: items, maxCapacity: 50, currentCapacity: 50, totalValue: 0 },
      event: { type: 'INIT', explanation: 'Knapsack Capacity W = 50. Items sorted by value/weight ratio descending.' }
    },
    {
      elements: defaultElements,
      greedyState: { knapsackItems: [
        { ...items[0], takenFraction: 1, active: true },
        items[1], items[2]
      ], maxCapacity: 50, currentCapacity: 40, totalValue: 60 },
      event: { type: 'SELECT', explanation: 'Took 100% of Item 1 (Ratio 6.0). Added value 60. Remaining capacity = 40.' }
    },
    {
      elements: defaultElements,
      greedyState: { knapsackItems: [
        { ...items[0], takenFraction: 1 },
        { ...items[1], takenFraction: 1, active: true },
        items[2]
      ], maxCapacity: 50, currentCapacity: 20, totalValue: 160 },
      event: { type: 'SELECT', explanation: 'Took 100% of Item 2 (Ratio 5.0). Added value 100. Remaining capacity = 20.' }
    },
    {
      elements: defaultElements,
      greedyState: { knapsackItems: [
        { ...items[0], takenFraction: 1 },
        { ...items[1], takenFraction: 1 },
        { ...items[2], takenFraction: 0.67, active: true }
      ], maxCapacity: 50, currentCapacity: 0, totalValue: 240 },
      event: { type: 'COMPLETE', explanation: 'Took 66.7% (20/30kg) of Item 3 (Ratio 4.0). Added value 80. Total Value = 240.0!' }
    }
  ];
}

export function generateJobSequencingFrames(): VisualizationFrame[] {
  const jobs = [
    { id: 'J4', profit: 100, deadline: 1, status: 'pending' as const },
    { id: 'J2', profit: 80, deadline: 1, status: 'pending' as const },
    { id: 'J1', profit: 70, deadline: 4, status: 'pending' as const },
    { id: 'J3', profit: 30, deadline: 1, status: 'pending' as const },
  ];

  return [
    {
      elements: defaultElements,
      greedyState: { jobs, timeSlots: [{ slot: 1 }, { slot: 2 }, { slot: 3 }, { slot: 4 }] },
      event: { type: 'INIT', explanation: 'Job Sequencing: Jobs sorted by profit descending [J4:100, J2:80, J1:70, J3:30].' }
    },
    {
      elements: defaultElements,
      greedyState: {
        jobs: [{ ...jobs[0], status: 'scheduled', slotAssigned: 1 }, jobs[1], jobs[2], jobs[3]],
        timeSlots: [{ slot: 1, jobId: 'J4', profit: 100 }, { slot: 2 }, { slot: 3 }, { slot: 4 }]
      },
      event: { type: 'SELECT', explanation: 'Scheduled J4 (profit 100) in Slot 1 (latest free slot ≤ 1).' }
    },
    {
      elements: defaultElements,
      greedyState: {
        jobs: [{ ...jobs[0], status: 'scheduled', slotAssigned: 1 }, { ...jobs[1], status: 'skipped' }, jobs[2], jobs[3]],
        timeSlots: [{ slot: 1, jobId: 'J4', profit: 100 }, { slot: 2 }, { slot: 3 }, { slot: 4 }]
      },
      event: { type: 'ELIMINATE', explanation: 'J2 (deadline 1) has no free slots ≤ 1. Skipped J2.' }
    },
    {
      elements: defaultElements,
      greedyState: {
        jobs: [{ ...jobs[0], status: 'scheduled', slotAssigned: 1 }, { ...jobs[1], status: 'skipped' }, { ...jobs[2], status: 'scheduled', slotAssigned: 4 }, jobs[3]],
        timeSlots: [{ slot: 1, jobId: 'J4', profit: 100 }, { slot: 2 }, { slot: 3 }, { slot: 4, jobId: 'J1', profit: 70 }]
      },
      event: { type: 'SELECT', explanation: 'Scheduled J1 (profit 70) in Slot 4 (latest free slot ≤ 4).' }
    },
    {
      elements: defaultElements,
      greedyState: {
        jobs: [{ ...jobs[0], status: 'scheduled', slotAssigned: 1 }, { ...jobs[1], status: 'skipped' }, { ...jobs[2], status: 'scheduled', slotAssigned: 4 }, { ...jobs[3], status: 'skipped' }],
        timeSlots: [{ slot: 1, jobId: 'J4', profit: 100 }, { slot: 2 }, { slot: 3 }, { slot: 4, jobId: 'J1', profit: 70 }]
      },
      event: { type: 'COMPLETE', explanation: 'Job Scheduling Complete! Total Scheduled Jobs = 2, Total Profit = 170.' }
    }
  ];
}

export function generateHuffmanEncodingFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: {
        huffmanNodes: [
          { id: 'A', label: 'A', freq: 5 }, { id: 'B', label: 'B', freq: 9 },
          { id: 'C', label: 'C', freq: 12 }, { id: 'D', label: 'D', freq: 13 },
          { id: 'E', label: 'E', freq: 16 }, { id: 'F', label: 'F', freq: 45 }
        ]
      },
      event: { type: 'INIT', explanation: 'Huffman Encoding: Character frequencies inserted into Min-Heap.' }
    },
    {
      elements: defaultElements,
      greedyState: {
        huffmanNodes: [
          { id: 'C', label: 'C', freq: 12 }, { id: 'D', label: 'D', freq: 13 },
          { id: 'AB', label: 'A+B', freq: 14, isMerged: true }, { id: 'E', label: 'E', freq: 16 }, { id: 'F', label: 'F', freq: 45 }
        ]
      },
      event: { type: 'MERGE', explanation: 'Popped 2 smallest (A:5, B:9). Merged into parent Node(14).' }
    },
    {
      elements: defaultElements,
      greedyState: {
        huffmanNodes: [
          { id: 'AB', label: 'A+B', freq: 14 }, { id: 'E', label: 'E', freq: 16 },
          { id: 'CD', label: 'C+D', freq: 25, isMerged: true }, { id: 'F', label: 'F', freq: 45 }
        ]
      },
      event: { type: 'MERGE', explanation: 'Popped 2 smallest (C:12, D:13). Merged into parent Node(25).' }
    },
    {
      elements: defaultElements,
      greedyState: {
        huffmanCodes: { 'F': '0', 'C': '100', 'D': '101', 'A': '1100', 'B': '1101', 'E': '111' }
      },
      event: { type: 'COMPLETE', explanation: 'Huffman Tree constructed! Binary prefix codes assigned to all characters.' }
    }
  ];
}

export function generateMinimumPlatformsFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { platformsCount: 0, maxPlatforms: 0, activeTrains: [] },
      event: { type: 'INIT', explanation: 'Minimum Platforms: Arrival and departure times sorted independently.' }
    },
    {
      elements: defaultElements,
      greedyState: { platformsCount: 1, maxPlatforms: 1, activeTrains: ['Train 1'] },
      event: { type: 'INSERT', explanation: 't=900: Train 1 arrives. Allocated Platform 1. Current = 1, Max = 1.' }
    },
    {
      elements: defaultElements,
      greedyState: { platformsCount: 2, maxPlatforms: 2, activeTrains: ['Train 1', 'Train 2'] },
      event: { type: 'INSERT', explanation: 't=940: Train 2 arrives before Train 1 departs. Allocated Platform 2. Current = 2, Max = 2.' }
    },
    {
      elements: defaultElements,
      greedyState: { platformsCount: 3, maxPlatforms: 3, activeTrains: ['Train 1', 'Train 2', 'Train 3'] },
      event: { type: 'INSERT', explanation: 't=950: Train 3 arrives. Peak concurrency reached! Allocated Platform 3. Current = 3, Max = 3.' }
    },
    {
      elements: defaultElements,
      greedyState: { platformsCount: 2, maxPlatforms: 3, activeTrains: ['Train 2', 'Train 3'] },
      event: { type: 'EXTRACT', explanation: 't=1120: Train 1 departs. Platform 1 freed. Current = 2.' }
    },
    {
      elements: defaultElements,
      greedyState: { platformsCount: 0, maxPlatforms: 3, activeTrains: [] },
      event: { type: 'COMPLETE', explanation: 'All trains processed! Minimum platforms required = 3.' }
    }
  ];
}

export function generateMeetingRoomsFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { meetingRooms: [{ roomId: 1 }, { roomId: 2 }] },
      event: { type: 'INIT', explanation: 'Meeting Rooms II: Sort meetings by start time. Use Min-Heap of end times.' }
    },
    {
      elements: defaultElements,
      greedyState: { meetingRooms: [{ roomId: 1, currentMeeting: '[0,30]' }] },
      event: { type: 'SELECT', explanation: 'Meeting [0,30] starts at 0. Assigned to Room 1. Heap = [30].' }
    },
    {
      elements: defaultElements,
      greedyState: { meetingRooms: [{ roomId: 1, currentMeeting: '[0,30]' }, { roomId: 2, currentMeeting: '[5,10]' }] },
      event: { type: 'SELECT', explanation: 'Meeting [5,10] starts at 5 < 30. Room 1 busy! Assigned to new Room 2. Heap = [10, 30].' }
    },
    {
      elements: defaultElements,
      greedyState: { meetingRooms: [{ roomId: 1, currentMeeting: '[0,30]' }, { roomId: 2, currentMeeting: '[15,20]' }] },
      event: { type: 'SELECT', explanation: 'Meeting [15,20] starts at 15 ≥ 10. Room 2 freed! Reused Room 2. Heap = [20, 30].' }
    },
    {
      elements: defaultElements,
      greedyState: { meetingRooms: [{ roomId: 1 }, { roomId: 2 }] },
      event: { type: 'COMPLETE', explanation: 'All meetings processed. Minimum rooms required = 2.' }
    }
  ];
}

export function generateNonOverlappingIntervalsFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { intervals: [
        { id: '1', start: 1, end: 2, status: 'normal' },
        { id: '2', start: 2, end: 3, status: 'normal' },
        { id: '3', start: 1, end: 3, status: 'normal' },
        { id: '4', start: 3, end: 4, status: 'normal' }
      ] },
      event: { type: 'INIT', explanation: 'Sort intervals by finish time: [1,2], [2,3], [1,3], [3,4].' }
    },
    {
      elements: defaultElements,
      greedyState: { intervals: [
        { id: '1', start: 1, end: 2, status: 'selected' },
        { id: '2', start: 2, end: 3, status: 'selected' },
        { id: '3', start: 1, end: 3, status: 'removed' },
        { id: '4', start: 3, end: 4, status: 'selected' }
      ] },
      event: { type: 'COMPLETE', explanation: 'Removed 1 overlapping interval [1,3]. Remaining non-overlapping = 3.' }
    }
  ];
}

export function generateMergeIntervalsFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: {
        intervals: [
          { id: '1', start: 1, end: 3, status: 'normal' },
          { id: '2', start: 2, end: 6, status: 'normal' },
          { id: '3', start: 8, end: 10, status: 'normal' },
          { id: '4', start: 15, end: 18, status: 'normal' }
        ],
        mergedIntervals: []
      },
      event: { type: 'INIT', explanation: 'Merge Intervals: Sort by start time.' }
    },
    {
      elements: defaultElements,
      greedyState: {
        mergedIntervals: [{ start: 1, end: 6 }, { start: 8, end: 10 }, { start: 15, end: 18 }]
      },
      event: { type: 'COMPLETE', explanation: 'Merged overlapping intervals [1,3] & [2,6] into [1,6]. Output = [[1,6],[8,10],[15,18]].' }
    }
  ];
}

export function generateInsertIntervalFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: {
        intervals: [
          { id: '1', start: 1, end: 3, status: 'normal' },
          { id: '2', start: 6, end: 9, status: 'normal' }
        ],
        mergedIntervals: [{ start: 1, end: 5 }, { start: 6, end: 9 }]
      },
      event: { type: 'COMPLETE', explanation: 'Inserted newInterval [2,5]. Merged with [1,3] to produce [1,5]. Output = [[1,5],[6,9]].' }
    }
  ];
}

export function generateMinimumArrowsFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: {
        balloons: [
          { id: '1', start: 1, end: 6, bursted: true, arrowIndex: 1 },
          { id: '2', start: 2, end: 8, bursted: true, arrowIndex: 1 },
          { id: '3', start: 7, end: 12, bursted: true, arrowIndex: 2 },
          { id: '4', start: 10, end: 16, bursted: true, arrowIndex: 2 }
        ],
        arrows: [{ id: 1, pos: 6 }, { id: 2, pos: 12 }]
      },
      event: { type: 'COMPLETE', explanation: 'Shot 2 arrows (at x=6 and x=12). All balloons bursted!' }
    }
  ];
}

export function generateJumpGameFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { jumpArray: [2, 3, 1, 1, 4], currentIndex: 0, maxReach: 2 },
      event: { type: 'INIT', explanation: 'Jump Game: Track farthest reachable index maxReach.' }
    },
    {
      elements: defaultElements,
      greedyState: { jumpArray: [2, 3, 1, 1, 4], currentIndex: 1, maxReach: 4 },
      event: { type: 'UPDATE_BEST', explanation: 'i=1: maxReach updated to max(2, 1+3) = 4.' }
    },
    {
      elements: defaultElements,
      greedyState: { jumpArray: [2, 3, 1, 1, 4], currentIndex: 1, maxReach: 4 },
      event: { type: 'COMPLETE', explanation: 'maxReach (4) ≥ last index (4). Reached end!' }
    }
  ];
}

export function generateJumpGameIIFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { jumpArray: [2, 3, 1, 1, 4], currentIndex: 0, currentWindow: [0, 0], nextWindowEnd: 2, jumpCount: 0 },
      event: { type: 'INIT', explanation: 'Jump Game II: BFS layer-by-layer window traversal.' }
    },
    {
      elements: defaultElements,
      greedyState: { jumpArray: [2, 3, 1, 1, 4], currentIndex: 2, currentWindow: [1, 2], nextWindowEnd: 4, jumpCount: 2 },
      event: { type: 'COMPLETE', explanation: 'Reached last index in 2 jumps!' }
    }
  ];
}

export function generateGasStationFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: {
        gasStations: [
          { gas: 1, cost: 3, net: -2 },
          { gas: 2, cost: 4, net: -2 },
          { gas: 3, cost: 5, net: -2 },
          { gas: 4, cost: 1, net: +3 },
          { gas: 5, cost: 2, net: +3 }
        ],
        currentTank: 0,
        startIndex: 3
      },
      event: { type: 'COMPLETE', explanation: 'Starting station = 3. Completed full circular tour with net fuel surplus.' }
    }
  ];
}

export function generateCandyDistributionFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: {
        candies: [2, 1, 2],
        leftPassCandies: [1, 1, 2],
        rightPassCandies: [2, 1, 1],
        passPhase: 'complete'
      },
      event: { type: 'COMPLETE', explanation: 'Left Pass + Right Pass complete! Total minimum candies = 5.' }
    }
  ];
}

export function generateTaskSchedulingGreedyFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { heapItems: [{ label: 'A', val: 3 }, { label: 'B', val: 3 }] },
      event: { type: 'COMPLETE', explanation: 'Task Scheduler: Formula (maxFreq-1)*(n+1) + maxCount = 8 CPU units.' }
    }
  ];
}

export function generateIPOGreedyFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { ipoCapital: 4, ipoProfits: [1, 3] },
      event: { type: 'COMPLETE', explanation: 'IPO: Max-Heap picked projects with profit 1 and 3. Final capital = 4.' }
    }
  ];
}

export function generateReorganizeStringFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { reorganizeChar: 'a', reorganizeResult: 'aba' },
      event: { type: 'COMPLETE', explanation: 'Reorganized string = "aba" (no adjacent duplicates).' }
    }
  ];
}

export function generateMinCostConnectRopesFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { ropes: [2, 3, 4, 6], currentMergeCost: 5, totalCost: 29 },
      event: { type: 'COMPLETE', explanation: 'Min-Heap merged 2 smallest ropes iteratively. Total Minimum Cost = 29.' }
    }
  ];
}

export function generateGreedySchedulingFrames(): VisualizationFrame[] {
  return [
    {
      elements: defaultElements,
      greedyState: { totalCost: 17 },
      event: { type: 'COMPLETE', explanation: 'Smith\'s Rule: Sorted tasks by ratio w/p descending. Minimum Weighted Completion Time = 17.' }
    }
  ];
}
