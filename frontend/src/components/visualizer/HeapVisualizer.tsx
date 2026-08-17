import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, RotateCcw, Shuffle, Plus, 
  ArrowDown, ArrowUp, Zap, HelpCircle, Layers, Check, RefreshCw, 
  Info, Cpu, Lightbulb, Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';

export type HeapType = 'max' | 'min';
export type VisualizerMode = 'heap' | 'priority-queue' | 'interview';

export interface PriorityItem {
  id: string;
  value: string;
  priority: number;
}

export interface HeapStep {
  heap: number[];
  pqItems?: PriorityItem[];
  heapType: HeapType;
  currentNode?: number;
  comparedNodes?: number[];
  swappingNodes?: [number, number];
  sortedNodes?: number[];
  explanation: string;
  actionType: 'INIT' | 'COMPARE' | 'SWAP' | 'NO_SWAP' | 'INSERT' | 'EXTRACT_ROOT' | 'MOVE_LAST_TO_ROOT' | 'HEAPIFY' | 'RESTORED' | 'BUILD_HEAP' | 'HEAP_SORT';
  activeFormula?: string;
  activeOpKey?: 'insert' | 'extract' | 'peek' | 'build' | 'heapsort';
  question?: {
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

interface Props {
  initialHeap?: number[];
  initialType?: HeapType;
}

export const HeapVisualizer: React.FC<Props> = ({
  initialHeap = [90, 75, 80, 50, 60, 45, 70, 20, 30],
  initialType = 'max',
}) => {
  const [heapType, setHeapType] = useState<HeapType>(initialType);
  const [mode, setMode] = useState<VisualizerMode>('heap');
  const [heap, setHeap] = useState<number[]>(initialHeap);
  
  // Priority Queue state
  const [pqItems, setPqItems] = useState<PriorityItem[]>([
    { id: '1', value: 'Emergency Surgery', priority: 95 },
    { id: '2', value: 'ICU Monitoring', priority: 85 },
    { id: '3', value: 'Fracture Care', priority: 70 },
    { id: '4', value: 'Fever Checkup', priority: 40 },
    { id: '5', value: 'Routine Exam', priority: 25 },
    { id: '6', value: 'Medication Refill', priority: 60 },
  ]);

  // Visualizer step controls
  const [steps, setSteps] = useState<HeapStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 1.5x, 2x
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Input states
  const [newValueInput, setNewValueInput] = useState<string>('85');
  const [pqTaskInput, setPqTaskInput] = useState<string>('Lab Test');
  const [pqPriorityInput, setPqPriorityInput] = useState<string>('78');

  // Interview state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Current step frame
  const currentStep = useMemo<HeapStep>(() => {
    if (steps.length > 0 && currentStepIdx < steps.length) {
      return steps[currentStepIdx];
    }
    return {
      heap,
      pqItems,
      heapType,
      explanation: 'Ready. Choose an operation or insert/extract nodes to visualize.',
      actionType: 'INIT'
    };
  }, [steps, currentStepIdx, heap, pqItems, heapType]);

  // Generate steps for Insert
  const generateInsertSteps = (val: number, currentArr: number[], type: HeapType) => {
    const arr = [...currentArr, val];
    const newSteps: HeapStep[] = [];

    newSteps.push({
      heap: [...arr],
      heapType: type,
      currentNode: arr.length - 1,
      explanation: `Inserted ${val} at the end of the heap (index ${arr.length - 1}).`,
      actionType: 'INSERT',
      activeOpKey: 'insert',
      activeFormula: `New element placed at index i = ${arr.length - 1}.`
    });

    let i = arr.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      const violates = type === 'max' ? arr[i] > arr[parent] : arr[i] < arr[parent];

      newSteps.push({
        heap: [...arr],
        heapType: type,
        currentNode: i,
        comparedNodes: [parent],
        explanation: `Comparing node at index ${i} (${arr[i]}) with parent at index ${parent} (${arr[parent]}). ${
          violates ? `Violates ${type}-heap property!` : `Heap property holds (${arr[i]} ${type === 'max' ? '≤' : '≥'} ${arr[parent]}).`
        }`,
        actionType: 'COMPARE',
        activeOpKey: 'insert',
        activeFormula: `Parent index = ⌊(${i} - 1) / 2⌋ = ${parent}`,
        question: violates && newSteps.length === 2 ? {
          id: `insert-q-${i}`,
          prompt: `Why must we swap node index ${i} (${arr[i]}) with parent index ${parent} (${arr[parent]})?`,
          options: [
            `Because ${arr[i]} violates the ${type}-heap invariant relative to parent ${arr[parent]}`,
            `Because array elements must be kept in strictly increasing order`,
            `To keep the tree height balanced`
          ],
          correctIndex: 0,
          explanation: `In a ${type} heap, every parent node must be ${type === 'max' ? '≥' : '≤'} its children. Since ${arr[i]} ${type === 'max' ? '>' : '<'} ${arr[parent]}, bubble up is required.`
        } : undefined
      });

      if (violates) {
        newSteps.push({
          heap: [...arr],
          heapType: type,
          swappingNodes: [i, parent],
          explanation: `Swapping ${arr[i]} (index ${i}) with ${arr[parent]} (index ${parent}).`,
          actionType: 'SWAP',
          activeOpKey: 'insert'
        });

        // Perform swap
        const temp = arr[i];
        arr[i] = arr[parent];
        arr[parent] = temp;

        i = parent;

        newSteps.push({
          heap: [...arr],
          heapType: type,
          currentNode: i,
          explanation: `Bubble up moved ${val} up to index ${i}.`,
          actionType: 'RESTORED',
          activeOpKey: 'insert'
        });
      } else {
        break;
      }
    }

    newSteps.push({
      heap: [...arr],
      heapType: type,
      explanation: `Insertion complete! ${type.toUpperCase()}-heap property is fully satisfied.`,
      actionType: 'RESTORED',
      activeOpKey: 'insert'
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setHeap(arr);
  };

  // Generate steps for Extract Root (Min/Max)
  const generateExtractSteps = (currentArr: number[], type: HeapType) => {
    if (currentArr.length === 0) return;
    const arr = [...currentArr];
    const newSteps: HeapStep[] = [];
    const rootVal = arr[0];

    newSteps.push({
      heap: [...arr],
      heapType: type,
      currentNode: 0,
      explanation: `Extracted root value ${rootVal} (index 0).`,
      actionType: 'EXTRACT_ROOT',
      activeOpKey: 'extract',
      activeFormula: `Root element is always at array index 0.`
    });

    if (arr.length === 1) {
      arr.pop();
      newSteps.push({
        heap: [],
        heapType: type,
        explanation: 'Heap is now empty.',
        actionType: 'RESTORED',
        activeOpKey: 'extract'
      });
      setSteps(newSteps);
      setCurrentStepIdx(0);
      setHeap([]);
      return;
    }

    const lastVal = arr.pop()!;
    arr[0] = lastVal;

    newSteps.push({
      heap: [...arr],
      heapType: type,
      currentNode: 0,
      explanation: `Moved last element ${lastVal} from end of array to root (index 0). Now heapifying down...`,
      actionType: 'MOVE_LAST_TO_ROOT',
      activeOpKey: 'extract',
      activeFormula: `Replaced index 0 with last element ${lastVal}.`
    });

    // Heapify Down from root
    let idx = 0;
    const n = arr.length;

    while (idx < n) {
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      let target = idx;

      const validChildren: number[] = [];
      if (left < n) validChildren.push(left);
      if (right < n) validChildren.push(right);

      if (validChildren.length > 0) {
        newSteps.push({
          heap: [...arr],
          heapType: type,
          currentNode: idx,
          comparedNodes: validChildren,
          explanation: `Comparing current node at index ${idx} (${arr[idx]}) with children: ${
            left < n ? `Left child index ${left} (${arr[left]})` : ''
          } ${right < n ? `| Right child index ${right} (${arr[right]})` : ''}.`,
          actionType: 'COMPARE',
          activeOpKey: 'extract',
          activeFormula: `Left = 2(${idx}) + 1 = ${left}, Right = 2(${idx}) + 2 = ${right}`,
          question: newSteps.length === 3 ? {
            id: `extract-q-${idx}`,
            prompt: `What is the time complexity of extracting the root element from a Heap of size N?`,
            options: [`O(log N)`, `O(N)`, `O(1)`],
            correctIndex: 0,
            explanation: `Extracting the root takes O(1) time, but restoring the heap invariant via heapify-down requires traversing down tree height O(log N).`
          } : undefined
        });
      }

      if (left < n) {
        if (type === 'max' ? arr[left] > arr[target] : arr[left] < arr[target]) {
          target = left;
        }
      }

      if (right < n) {
        if (type === 'max' ? arr[right] > arr[target] : arr[right] < arr[target]) {
          target = right;
        }
      }

      if (target !== idx) {
        newSteps.push({
          heap: [...arr],
          heapType: type,
          currentNode: idx,
          comparedNodes: [target],
          swappingNodes: [idx, target],
          explanation: `Node at index ${idx} (${arr[idx]}) violates heap property. Swapping with ${
            type === 'max' ? 'larger' : 'smaller'
          } child at index ${target} (${arr[target]}).`,
          actionType: 'SWAP',
          activeOpKey: 'extract'
        });

        const tmp = arr[idx];
        arr[idx] = arr[target];
        arr[target] = tmp;

        idx = target;

        newSteps.push({
          heap: [...arr],
          heapType: type,
          currentNode: idx,
          explanation: `Moved node down to index ${idx}. Continuing heapify down...`,
          actionType: 'HEAPIFY',
          activeOpKey: 'extract'
        });
      } else {
        break;
      }
    }

    newSteps.push({
      heap: [...arr],
      heapType: type,
      explanation: `Extraction complete! ${type.toUpperCase()}-heap property is restored.`,
      actionType: 'RESTORED',
      activeOpKey: 'extract'
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setHeap(arr);
  };

  // Generate steps for Build Heap (Bottom-up O(n))
  const generateBuildHeapSteps = (currentArr: number[], type: HeapType) => {
    const arr = [...currentArr];
    const newSteps: HeapStep[] = [];
    const n = arr.length;

    newSteps.push({
      heap: [...arr],
      heapType: type,
      explanation: `Build Heap starting bottom-up. Processing all non-leaf internal nodes from index ⌊N/2⌋ - 1 (${Math.floor(n/2) - 1}) down to 0.`,
      actionType: 'BUILD_HEAP',
      activeOpKey: 'build',
      activeFormula: `Start index = ⌊${n} / 2⌋ - 1 = ${Math.floor(n/2) - 1}`
    });

    const startIdx = Math.floor(n / 2) - 1;

    for (let i = startIdx; i >= 0; i--) {
      let idx = i;
      newSteps.push({
        heap: [...arr],
        heapType: type,
        currentNode: idx,
        explanation: `Running Heapify Down on subtree rooted at index ${idx} (value ${arr[idx]}).`,
        actionType: 'HEAPIFY',
        activeOpKey: 'build'
      });

      while (idx < n) {
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        let target = idx;

        if (left < n && (type === 'max' ? arr[left] > arr[target] : arr[left] < arr[target])) {
          target = left;
        }
        if (right < n && (type === 'max' ? arr[right] > arr[target] : arr[right] < arr[target])) {
          target = right;
        }

        if (target !== idx) {
          newSteps.push({
            heap: [...arr],
            heapType: type,
            currentNode: idx,
            comparedNodes: [left, right].filter(c => c < n),
            swappingNodes: [idx, target],
            explanation: `Subtree at index ${idx} (${arr[idx]}) violates heap property. Swapping with child at index ${target} (${arr[target]}).`,
            actionType: 'SWAP',
            activeOpKey: 'build'
          });

          const tmp = arr[idx];
          arr[idx] = arr[target];
          arr[target] = tmp;

          idx = target;
        } else {
          break;
        }
      }
    }

    newSteps.push({
      heap: [...arr],
      heapType: type,
      explanation: `Build Heap complete! Total time complexity is O(N) because most nodes are near the leaves and travel very short distances.`,
      actionType: 'RESTORED',
      activeOpKey: 'build'
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setHeap(arr);
  };

  // Generate steps for Heap Sort
  const generateHeapSortSteps = (currentArr: number[]) => {
    const arr = [...currentArr];
    const newSteps: HeapStep[] = [];
    const n = arr.length;

    // Step 1: Build Max Heap
    newSteps.push({
      heap: [...arr],
      heapType: 'max',
      explanation: 'Heap Sort Step 1: Building a Max-Heap out of the input array.',
      actionType: 'HEAP_SORT',
      activeOpKey: 'heapsort'
    });

    // Simple max heap build
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      let idx = i;
      while (idx < n) {
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        let target = idx;
        if (left < n && arr[left] > arr[target]) target = left;
        if (right < n && arr[right] > arr[target]) target = right;

        if (target !== idx) {
          const tmp = arr[idx];
          arr[idx] = arr[target];
          arr[target] = tmp;
          idx = target;
        } else break;
      }
    }

    newSteps.push({
      heap: [...arr],
      heapType: 'max',
      explanation: 'Max-Heap constructed! Now repeatedly extracting max element to the end of the array.',
      actionType: 'HEAP_SORT',
      activeOpKey: 'heapsort'
    });

    const sorted: number[] = [];

    for (let size = n - 1; size > 0; size--) {
      newSteps.push({
        heap: [...arr],
        heapType: 'max',
        currentNode: 0,
        comparedNodes: [size],
        swappingNodes: [0, size],
        sortedNodes: [...sorted],
        explanation: `Swapping root max element (${arr[0]}) with element at end of heap (index ${size}, value ${arr[size]}).`,
        actionType: 'SWAP',
        activeOpKey: 'heapsort'
      });

      const tmp = arr[0];
      arr[0] = arr[size];
      arr[size] = tmp;
      sorted.push(size);

      // Heapify down root for reduced heap size
      let idx = 0;
      while (idx < size) {
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        let target = idx;
        if (left < size && arr[left] > arr[target]) target = left;
        if (right < size && arr[right] > arr[target]) target = right;

        if (target !== idx) {
          newSteps.push({
            heap: [...arr],
            heapType: 'max',
            currentNode: idx,
            comparedNodes: [target],
            swappingNodes: [idx, target],
            sortedNodes: [...sorted],
            explanation: `Heapifying root in reduced heap (size ${size}). Swapping index ${idx} (${arr[idx]}) with index ${target} (${arr[target]}).`,
            actionType: 'SWAP',
            activeOpKey: 'heapsort'
          });

          const swapTmp = arr[idx];
          arr[idx] = arr[target];
          arr[target] = swapTmp;
          idx = target;
        } else break;
      }
    }
    sorted.push(0);

    newSteps.push({
      heap: [...arr],
      heapType: 'max',
      sortedNodes: [...sorted],
      explanation: `Heap Sort completed! The array is now fully sorted in ascending order with O(N log N) time and O(1) auxiliary space.`,
      actionType: 'RESTORED',
      activeOpKey: 'heapsort'
    });

    setSteps(newSteps);
    setCurrentStepIdx(0);
    setHeap(arr);
  };

  // Priority Queue Handlers
  const handlePqInsert = () => {
    if (!pqTaskInput.trim()) return;
    const prio = parseInt(pqPriorityInput) || 50;
    const newItem: PriorityItem = {
      id: Date.now().toString(),
      value: pqTaskInput.trim(),
      priority: prio
    };
    const newItems = [...pqItems, newItem];
    setPqItems(newItems);

    // Sync numeric heap values from priorities
    const numericHeap = newItems.map(item => item.priority);
    setHeap(numericHeap);
    generateInsertSteps(prio, pqItems.map(i => i.priority), 'max');
  };

  const handlePqExtract = () => {
    if (pqItems.length === 0) return;
    generateExtractSteps(pqItems.map(i => i.priority), 'max');
    const sortedPq = [...pqItems].sort((a, b) => b.priority - a.priority);
    sortedPq.shift();
    setPqItems(sortedPq);
  };

  // Auto-play timer effect
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(300, 1200 / speed);
      timerRef.current = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          setCurrentStepIdx(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, steps.length, speed]);

  const handleRandomize = () => {
    const size = 7 + Math.floor(Math.random() * 4);
    const newArr: number[] = [];
    for (let i = 0; i < size; i++) {
      newArr.push(Math.floor(Math.random() * 90) + 10);
    }
    setHeap(newArr);
    setSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleAnswerQuestion = (qId: string, optionIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    const currentQ = currentStep.question;
    if (currentQ && currentQ.id === qId) {
      if (optionIdx === currentQ.correctIndex) {
        setScore(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }));
      } else {
        setScore(s => ({ ...s, total: s.total + 1 }));
      }
    }
  };

  // Helper calculations for Binary Tree Coordinates
  const displayHeap = currentStep.heap;
  const treeNodes = useMemo(() => {
    const nodes: { id: number; val: number; x: number; y: number; level: number; parentId?: number }[] = [];
    const n = displayHeap.length;
    if (n === 0) return nodes;

    const containerWidth = 800;
    const levelHeight = 65;

    for (let i = 0; i < n; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const positionInLevel = i - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);
      const sectorWidth = containerWidth / totalInLevel;
      const x = sectorWidth * positionInLevel + sectorWidth / 2;
      const y = (level + 0.8) * levelHeight;

      nodes.push({
        id: i,
        val: displayHeap[i],
        x,
        y,
        level,
        parentId: i > 0 ? Math.floor((i - 1) / 2) : undefined
      });
    }
    return nodes;
  }, [displayHeap]);

  return (
    <div className="w-full bg-card/60 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* 1. Header Toolbar & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Heap & Priority Queue Lab
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase border border-primary/20">
                Interactive Visualizer
              </span>
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              Simultaneous Binary Tree + Array dual representation with animated Heapify.
            </p>
          </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-background/80 border border-border rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setHeapType('max')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                heapType === 'max' ? "bg-amber-500 text-white shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowUp className="w-3.5 h-3.5" /> Max-Heap
            </button>
            <button
              onClick={() => setHeapType('min')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                heapType === 'min' ? "bg-blue-500 text-white shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowDown className="w-3.5 h-3.5" /> Min-Heap
            </button>
          </div>

          <div className="bg-background/80 border border-border rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setMode('heap')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                mode === 'heap' ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Layers className="w-3.5 h-3.5" /> Heap Standard
            </button>
            <button
              onClick={() => setMode('priority-queue')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                mode === 'priority-queue' ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Cpu className="w-3.5 h-3.5" /> Priority Queue
            </button>
            <button
              onClick={() => setMode('interview')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                mode === 'interview' ? "bg-indigo-600 text-white shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Interview Mode
            </button>
          </div>
        </div>
      </div>

      {/* 2. Above-The-Fold Live Explanation Panel & Quick Complexity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Explanation Banner */}
        <div className="lg:col-span-8 bg-gradient-to-r from-amber-500/10 via-background to-blue-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 shadow-inner">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Live Operation Log</span>
              {currentStep.activeFormula && (
                <span className="text-[11px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {currentStep.activeFormula}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>
        </div>

        {/* Dynamic Complexity Card */}
        <div className="lg:col-span-4 bg-background/90 border border-border rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-primary" /> Time Complexities
          </span>
          <div className="grid grid-cols-3 gap-2 text-center mt-2">
            <div className={cn("p-1.5 rounded-lg border text-xs font-mono transition-all", currentStep.activeOpKey === 'insert' ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold" : "bg-card border-border")}>
              <div className="text-[10px] text-muted-foreground">Insert</div>
              O(log N)
            </div>
            <div className={cn("p-1.5 rounded-lg border text-xs font-mono transition-all", currentStep.activeOpKey === 'extract' ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold" : "bg-card border-border")}>
              <div className="text-[10px] text-muted-foreground">Extract</div>
              O(log N)
            </div>
            <div className={cn("p-1.5 rounded-lg border text-xs font-mono transition-all", currentStep.activeOpKey === 'build' ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold" : "bg-card border-border")}>
              <div className="text-[10px] text-muted-foreground">Build</div>
              O(N)
            </div>
          </div>
        </div>
      </div>

      {/* 3. Priority Queue Custom Task Creator (If Priority Queue mode active) */}
      {mode === 'priority-queue' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-4 flex flex-wrap items-center gap-3"
        >
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-4 h-4" /> PQ Task Dispatcher:
          </span>
          <input
            type="text"
            value={pqTaskInput}
            onChange={e => setPqTaskInput(e.target.value)}
            placeholder="Task Description"
            className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-medium focus:outline-none focus:border-indigo-500 w-40 text-foreground"
          />
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground font-bold">Priority:</span>
            <input
              type="number"
              value={pqPriorityInput}
              onChange={e => setPqPriorityInput(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono focus:outline-none focus:border-indigo-500 w-20 text-foreground"
            />
          </div>
          <button
            onClick={handlePqInsert}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1 shadow"
          >
            <Plus className="w-3.5 h-3.5" /> Enqueue Task
          </button>
          <button
            onClick={handlePqExtract}
            className="px-4 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Dequeue Highest Priority
          </button>
        </motion.div>
      )}

      {/* 4. MAIN DUAL VISUALIZATION CANVAS (TREE + ARRAY SIMULTANEOUSLY) */}
      <div className="bg-background/90 border border-border/80 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-6 shadow-inner">
        
        {/* Color Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs gap-3 border-b border-border/60 pb-3">
          <span className="font-bold text-muted-foreground uppercase tracking-wider">Visual Language Legend:</span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400 inline-block shadow-sm" />
              <span className="text-muted-foreground font-medium">Current Node</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-blue-400 inline-block shadow-sm" />
              <span className="text-muted-foreground font-medium">Compared Child</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400 inline-block shadow-sm" />
              <span className="text-muted-foreground font-medium">Target / Swapped</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400 inline-block shadow-sm" />
              <span className="text-muted-foreground font-medium">Sorted (HeapSort)</span>
            </div>
          </div>
        </div>

        {/* TREE REPRESENTATION CANVAS */}
        <div className="relative w-full h-[320px] sm:h-[360px] flex justify-center items-start overflow-x-auto custom-scrollbar">
          <div className="relative w-[800px] h-full shrink-0">
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {treeNodes.map(node => {
                if (node.parentId === undefined) return null;
                const parent = treeNodes.find(n => n.id === node.parentId);
                if (!parent) return null;

                const isChildCompared = currentStep.comparedNodes?.includes(node.id);
                const isSwappingEdge = currentStep.swappingNodes?.includes(node.id) && currentStep.swappingNodes?.includes(parent.id);

                return (
                  <line
                    key={`edge-${node.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={isSwappingEdge ? '#10b981' : isChildCompared ? '#3b82f6' : 'currentColor'}
                    strokeWidth={isSwappingEdge ? 3.5 : isChildCompared ? 2.5 : 1.5}
                    className={cn(
                      "transition-all duration-300",
                      isSwappingEdge ? "opacity-100 text-emerald-500" : isChildCompared ? "opacity-100 text-blue-500" : "text-border"
                    )}
                  />
                );
              })}
            </svg>

            {/* Tree Nodes */}
            <AnimatePresence>
              {treeNodes.map(node => {
                const isCurrent = currentStep.currentNode === node.id;
                const isCompared = currentStep.comparedNodes?.includes(node.id);
                const isSwapping = currentStep.swappingNodes?.includes(node.id);
                const isSorted = currentStep.sortedNodes?.includes(node.id);
                const isHovered = hoveredIdx === node.id;

                // Sync hover relationship
                const isParentOfHovered = hoveredIdx !== null && Math.floor((hoveredIdx - 1) / 2) === node.id;
                const isLeftChildOfHovered = hoveredIdx !== null && 2 * hoveredIdx + 1 === node.id;
                const isRightChildOfHovered = hoveredIdx !== null && 2 * hoveredIdx + 2 === node.id;

                return (
                  <motion.div
                    key={`tree-node-${node.id}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, x: node.x - 24, y: node.y - 24 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onMouseEnter={() => setHoveredIdx(node.id)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={cn(
                      "absolute w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center font-mono font-bold text-sm z-10 cursor-pointer shadow-lg transition-all duration-300",
                      isSwapping
                        ? "bg-emerald-500 text-white border-emerald-400 scale-125 shadow-emerald-500/40"
                        : isCurrent
                        ? "bg-amber-500 text-white border-amber-400 scale-110 shadow-amber-500/40 ring-4 ring-amber-500/20"
                        : isCompared
                        ? "bg-blue-500 text-white border-blue-400 scale-110 shadow-blue-500/40 ring-4 ring-blue-500/20"
                        : isSorted
                        ? "bg-purple-600 text-white border-purple-400 opacity-60"
                        : isHovered
                        ? "bg-primary text-primary-foreground border-primary scale-115 shadow-xl ring-4 ring-primary/20"
                        : isParentOfHovered
                        ? "bg-amber-500/20 text-amber-400 border-amber-500 ring-2 ring-amber-500/40"
                        : isLeftChildOfHovered || isRightChildOfHovered
                        ? "bg-blue-500/20 text-blue-400 border-blue-500 ring-2 ring-blue-500/40"
                        : "bg-card border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    <span>{node.val}</span>
                    <span className="text-[9px] opacity-70 font-semibold -mt-0.5">[{node.id}]</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* UNDERLYING ARRAY REPRESENTATION (SYNCHRONIZED WITH TREE) */}
        <div className="border-t border-border/80 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" /> Underlying Sequential Array Representation
            </span>
            {hoveredIdx !== null && (
              <span className="text-xs font-mono text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Active Index i = {hoveredIdx} | Parent = ⌊({hoveredIdx}-1)/2⌋ = {Math.floor((hoveredIdx - 1) / 2)} | Left = 2({hoveredIdx})+1 = {2 * hoveredIdx + 1} | Right = 2({hoveredIdx})+2 = {2 * hoveredIdx + 2}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 custom-scrollbar justify-center sm:justify-start">
            {displayHeap.map((val, idx) => {
              const isCurrent = currentStep.currentNode === idx;
              const isCompared = currentStep.comparedNodes?.includes(idx);
              const isSwapping = currentStep.swappingNodes?.includes(idx);
              const isSorted = currentStep.sortedNodes?.includes(idx);
              const isHovered = hoveredIdx === idx;

              const isParentOfHovered = hoveredIdx !== null && Math.floor((hoveredIdx - 1) / 2) === idx;
              const isChildOfHovered = hoveredIdx !== null && (2 * hoveredIdx + 1 === idx || 2 * hoveredIdx + 2 === idx);

              return (
                <div
                  key={`arr-cell-${idx}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex flex-col items-center cursor-pointer transition-all duration-300"
                >
                  <motion.div
                    layout
                    className={cn(
                      "w-12 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-bold text-base shadow-sm transition-all duration-300",
                      isSwapping
                        ? "bg-emerald-500 text-white border-emerald-400 scale-110 shadow-emerald-500/30"
                        : isCurrent
                        ? "bg-amber-500 text-white border-amber-400 scale-105 shadow-amber-500/30"
                        : isCompared
                        ? "bg-blue-500 text-white border-blue-400 scale-105 shadow-blue-500/30"
                        : isSorted
                        ? "bg-purple-600 text-white border-purple-400 opacity-60"
                        : isHovered
                        ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md"
                        : isParentOfHovered
                        ? "bg-amber-500/20 text-amber-400 border-amber-500"
                        : isChildOfHovered
                        ? "bg-blue-500/20 text-blue-400 border-blue-500"
                        : "bg-card border-border text-foreground hover:border-primary/40"
                    )}
                  >
                    <span>{val}</span>
                  </motion.div>
                  <span className={cn(
                    "text-[10px] font-mono mt-1 font-bold",
                    isHovered ? "text-primary" : "text-muted-foreground"
                  )}>
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. INTERVIEW QUIZ POPUP (IF INTERVIEW MODE ACTIVE) */}
        {mode === 'interview' && currentStep.question && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border-2 border-indigo-500/50 rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Heap Mastery Challenge Question:
              </span>
              <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
                Score: {score.correct} / {score.total}
              </span>
            </div>

            <p className="text-sm font-bold text-foreground">
              {currentStep.question.prompt}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentStep.question.options.map((opt, oIdx) => {
                const qId = currentStep.question!.id;
                const chosen = userAnswers[qId];
                const isSelected = chosen === oIdx;
                const isCorrect = oIdx === currentStep.question!.correctIndex;

                return (
                  <button
                    key={oIdx}
                    disabled={chosen !== undefined}
                    onClick={() => handleAnswerQuestion(qId, oIdx)}
                    className={cn(
                      "p-3 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between",
                      chosen !== undefined
                        ? isCorrect
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                          : isSelected
                          ? "bg-rose-500/20 border-rose-500 text-rose-400 font-bold"
                          : "bg-background/40 border-border opacity-50"
                        : "bg-background border-border hover:border-indigo-500 hover:bg-indigo-500/10 text-foreground"
                    )}
                  >
                    <span>{opt}</span>
                    {chosen !== undefined && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {userAnswers[currentStep.question.id] !== undefined && (
              <p className="text-xs text-muted-foreground bg-background p-3 rounded-xl border border-border">
                💡 <strong>Explanation:</strong> {currentStep.question.explanation}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* 6. CONTROL PANEL & OPERATION ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border pt-4">
        
        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Add Value Input */}
          <div className="flex items-center gap-1 bg-background border border-border rounded-xl p-1">
            <input
              type="number"
              value={newValueInput}
              onChange={e => setNewValueInput(e.target.value)}
              className="w-16 px-2 py-1 bg-transparent text-xs font-mono focus:outline-none text-foreground font-bold"
              placeholder="Value"
            />
            <button
              onClick={() => {
                const val = parseInt(newValueInput);
                if (!isNaN(val)) generateInsertSteps(val, heap, heapType);
              }}
              className="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Insert
            </button>
          </div>

          <button
            onClick={() => generateExtractSteps(heap, heapType)}
            disabled={heap.length === 0}
            className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Extract Root
          </button>

          <button
            onClick={() => generateBuildHeapSteps(heap, heapType)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1 shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Build Heap O(N)
          </button>

          <button
            onClick={() => generateHeapSortSteps(heap)}
            className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1 shadow"
          >
            <Sparkles className="w-3.5 h-3.5" /> Heap Sort
          </button>

          <button
            onClick={handleRandomize}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            title="Randomize Heap"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Playback Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background border border-border rounded-xl p-1">
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIdx(0); }}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              title="Reset Timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIdx(prev => Math.max(0, prev - 1)); }}
              disabled={currentStepIdx === 0}
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              title="Step Backward"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(p => !p)}
              disabled={steps.length === 0 || currentStepIdx >= steps.length - 1}
              className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1 shadow"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1)); }}
              disabled={steps.length === 0 || currentStepIdx >= steps.length - 1}
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              title="Step Forward"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <select
            value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl bg-background border border-border text-xs font-mono font-bold text-foreground focus:outline-none"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x</option>
          </select>
        </div>
      </div>
    </div>
  );
};
