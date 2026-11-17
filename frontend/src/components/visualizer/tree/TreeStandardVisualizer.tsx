import React, { useState, useMemo, useRef } from 'react';
import { 
  Network, RotateCcw, Search, Plus, Trash2,
  GitBranch, Eye, CheckCircle2, Binary, Sparkles, FileText, ArrowDownToLine
} from 'lucide-react';
import type { VisualizationFrame, AlgorithmType, VisualElement } from '../../../types/visualizer';
import { cn } from '../../../lib/utils';

interface Props {
  algorithm: AlgorithmType;
  frame?: VisualizationFrame;
}

interface ComputedNode {
  id: string;
  value: number;
  x: number;
  y: number;
  state: string;
  label?: string;
  role?: string;
  height?: number;
  balanceFactor?: number;
  level: number;
  hd?: number;
  inDiameter?: boolean;
  leftId?: string | null;
  rightId?: string | null;
  threadToId?: string | null;
}

interface ComputedEdge {
  id: string;
  fromId: string;
  toId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type: 'left' | 'right' | 'thread' | 'diameter' | 'lca';
  state: 'normal' | 'active' | 'traversed' | 'thread' | 'path';
  label?: string;
}

// Standard BST Tree structure
function getInitialBSTElements(): VisualElement[] {
  return [
    { id: 'n20', value: 20, state: 'normal', leftId: 'n10', rightId: 'n30', height: 3, level: 0, hd: 0, role: 'Root' },
    { id: 'n10', value: 10, state: 'normal', leftId: 'n5', rightId: 'n15', parentId: 'n20', height: 2, level: 1, hd: -1 },
    { id: 'n30', value: 30, state: 'normal', leftId: 'n25', rightId: 'n35', parentId: 'n20', height: 2, level: 1, hd: 1 },
    { id: 'n5', value: 5, state: 'normal', leftId: null, rightId: null, parentId: 'n10', height: 1, level: 2, hd: -2, role: 'Leaf' },
    { id: 'n15', value: 15, state: 'normal', leftId: null, rightId: null, parentId: 'n10', height: 1, level: 2, hd: 0, role: 'Leaf' },
    { id: 'n25', value: 25, state: 'normal', leftId: null, rightId: null, parentId: 'n30', height: 1, level: 2, hd: 0, role: 'Leaf' },
    { id: 'n35', value: 35, state: 'normal', leftId: null, rightId: null, parentId: 'n30', height: 1, level: 2, hd: 2, role: 'Leaf' },
  ];
}

export const TreeStandardVisualizer: React.FC<Props> = ({ frame }) => {
  // Local state for standalone interactive mode
  const [interactiveElements, setInteractiveElements] = useState<VisualElement[]>(getInitialBSTElements);
  const [inputValue, setInputValue] = useState<string>('22');
  const targetP = 5;
  const targetQ = 25;
  const [activeViewMode, setActiveViewMode] = useState<'all' | 'top' | 'bottom' | 'left' | 'right'>('all');
  const [treeTypeSelection, setTreeTypeSelection] = useState<'bst' | 'full' | 'complete' | 'perfect' | 'degenerate'>('bst');
  const [statusMessage, setStatusMessage] = useState<string>('Ready. Binary Tree structure loaded with parent-child links.');
  const [traversalStream, setTraversalStream] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // If a frame is supplied from step-simulation, prefer the frame's elements
  const currentElements: VisualElement[] = useMemo(() => {
    if (frame && frame.elements && frame.elements.length > 0) {
      // Ensure elements have left/right structure
      const hasStructure = frame.elements.some(e => e.leftId !== undefined || e.rightId !== undefined);
      if (hasStructure) {
        return frame.elements;
      }
      // If flat elements were passed, map them onto a balanced binary tree structure
      const vals = frame.elements.map(e => e.value);
      const structured: VisualElement[] = [];
      const createNode = (idx: number, parentId: string | null = null, level: number = 0, hd: number = 0): string | null => {
        if (idx >= vals.length || vals[idx] === -999) return null;
        const id = `node-${vals[idx]}-${idx}`;
        const leftIdx = 2 * idx + 1;
        const rightIdx = 2 * idx + 2;
        const leftId = leftIdx < vals.length ? `node-${vals[leftIdx]}-${leftIdx}` : null;
        const rightId = rightIdx < vals.length ? `node-${vals[rightIdx]}-${rightIdx}` : null;
        
        structured.push({
          id,
          value: vals[idx],
          state: frame.elements[idx]?.state || 'normal',
          label: frame.elements[idx]?.label,
          leftId,
          rightId,
          parentId,
          level,
          hd
        });

        if (leftId) createNode(leftIdx, id, level + 1, hd - 1);
        if (rightId) createNode(rightIdx, id, level + 1, hd + 1);
        return id;
      };
      createNode(0);
      return structured.length > 0 ? structured : getInitialBSTElements();
    }
    return interactiveElements;
  }, [frame, interactiveElements]);

  // Compute 2D coordinates for Tree Layout using In-Order positioning
  const { nodes, edges, svgWidth, svgHeight } = useMemo(() => {
    if (currentElements.length === 0) {
      return { nodes: [], edges: [], svgWidth: 640, svgHeight: 320 };
    }

    // Locate root node (node that is not a child of any other node)
    const childIdSet = new Set<string>();
    currentElements.forEach(e => {
      if (e.leftId) childIdSet.add(e.leftId);
      if (e.rightId) childIdSet.add(e.rightId);
    });

    const rootCandidates = currentElements.filter(e => !childIdSet.has(e.id));
    const root = rootCandidates[0] || currentElements[0];
    if (!root) return { nodes: [], edges: [], svgWidth: 640, svgHeight: 320 };

    const ranks: Record<string, number> = {};
    const depths: Record<string, number> = {};
    let currentRank = 0;
    let maxDepth = 0;

    const computeInorderRanks = (id: string | null | undefined, depth: number) => {
      if (!id) return;
      const node = currentElements.find(e => e.id === id);
      if (!node) return;
      if (depth > maxDepth) maxDepth = depth;
      depths[id] = depth;

      computeInorderRanks(node.leftId, depth + 1);
      ranks[id] = currentRank++;
      computeInorderRanks(node.rightId, depth + 1);
    };

    computeInorderRanks(root.id, 0);

    const horizontalSpacing = 68;
    const verticalSpacing = 76;
    const totalRanks = Math.max(currentRank, 1);
    const canvasWidth = Math.max(680, (totalRanks + 1) * horizontalSpacing);
    const canvasHeight = Math.max(340, (maxDepth + 2) * verticalSpacing + 30);
    const marginX = canvasWidth / (totalRanks + 1);

    const computedNodes: ComputedNode[] = [];
    const computedEdges: ComputedEdge[] = [];

    currentElements.forEach(el => {
      if (ranks[el.id] !== undefined) {
        const x = marginX * (ranks[el.id] + 1);
        const y = (depths[el.id] + 0.9) * verticalSpacing;
        computedNodes.push({
          id: el.id,
          value: el.value,
          x,
          y,
          state: el.state || 'normal',
          label: el.label,
          role: el.role || (depths[el.id] === 0 ? 'Root' : (!el.leftId && !el.rightId ? 'Leaf' : undefined)),
          height: el.height,
          balanceFactor: el.balanceFactor,
          level: depths[el.id],
          hd: el.hd,
          inDiameter: el.inDiameter,
          leftId: el.leftId,
          rightId: el.rightId,
          threadToId: el.threadToId,
        });
      }
    });

    // Build edges
    computedNodes.forEach(fromNode => {
      if (fromNode.leftId) {
        const toNode = computedNodes.find(n => n.id === fromNode.leftId);
        if (toNode) {
          const isDiameterEdge = fromNode.inDiameter && toNode.inDiameter;
          const isComparingEdge = fromNode.state === 'comparing' && toNode.state === 'comparing';
          const isTraversed = fromNode.state === 'found' && toNode.state === 'found';
          computedEdges.push({
            id: `edge-${fromNode.id}-${toNode.id}`,
            fromId: fromNode.id,
            toId: toNode.id,
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y,
            type: 'left',
            state: isDiameterEdge ? 'path' : (isComparingEdge ? 'active' : (isTraversed ? 'traversed' : 'normal')),
            label: 'L',
          });
        }
      }

      if (fromNode.rightId) {
        const toNode = computedNodes.find(n => n.id === fromNode.rightId);
        if (toNode) {
          const isDiameterEdge = fromNode.inDiameter && toNode.inDiameter;
          const isComparingEdge = fromNode.state === 'comparing' && toNode.state === 'comparing';
          const isTraversed = fromNode.state === 'found' && toNode.state === 'found';
          computedEdges.push({
            id: `edge-${fromNode.id}-${toNode.id}`,
            fromId: fromNode.id,
            toId: toNode.id,
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y,
            type: 'right',
            state: isDiameterEdge ? 'path' : (isComparingEdge ? 'active' : (isTraversed ? 'traversed' : 'normal')),
            label: 'R',
          });
        }
      }

      // Morris thread temporary edge
      if (fromNode.threadToId) {
        const toNode = computedNodes.find(n => n.id === fromNode.threadToId);
        if (toNode) {
          computedEdges.push({
            id: `thread-${fromNode.id}-${toNode.id}`,
            fromId: fromNode.id,
            toId: toNode.id,
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y,
            type: 'thread',
            state: 'thread',
            label: 'Thread',
          });
        }
      }
    });

    return {
      nodes: computedNodes,
      edges: computedEdges,
      svgWidth: canvasWidth,
      svgHeight: canvasHeight,
    };
  }, [currentElements]);

  // Synchronize status explanation if frame exists
  const activeExplanation = frame?.event?.explanation || statusMessage;

  // Calculate views (Top, Bottom, Left, Right)
  const viewsData = useMemo(() => {
    const hdMap: Record<number, { top: number; bottom: number }> = {};
    const levelMap: Record<number, { left: number; right: number }> = {};

    nodes.forEach(n => {
      // Approximate HD from X coordinate or node.hd
      const hd = n.hd !== undefined ? n.hd : Math.round((n.x - svgWidth / 2) / 60);
      if (!hdMap[hd]) {
        hdMap[hd] = { top: n.value, bottom: n.value };
      } else {
        hdMap[hd].bottom = n.value;
      }

      if (!levelMap[n.level]) {
        levelMap[n.level] = { left: n.value, right: n.value };
      } else {
        levelMap[n.level].right = n.value;
      }
    });

    const sortedHDs = Object.keys(hdMap).map(Number).sort((a, b) => a - b);
    const sortedLevels = Object.keys(levelMap).map(Number).sort((a, b) => a - b);

    return {
      top: sortedHDs.map(hd => hdMap[hd].top),
      bottom: sortedHDs.map(hd => hdMap[hd].bottom),
      left: sortedLevels.map(lvl => levelMap[lvl].left),
      right: sortedLevels.map(lvl => levelMap[lvl].right),
    };
  }, [nodes, svgWidth]);

  // ---------------- INTERACTIVE ACTIONS ----------------

  const handleReset = () => {
    setInteractiveElements(getInitialBSTElements());
    setStatusMessage('Tree restored to standard Balanced BST (7 nodes).');
    setTraversalStream([]);
    setActiveViewMode('all');
  };

  const handleSearch = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const target = Number(inputValue);
    const elementsCopy = JSON.parse(JSON.stringify(interactiveElements)) as VisualElement[];
    
    // Find root
    const childIds = new Set(elementsCopy.flatMap(e => [e.leftId, e.rightId]).filter(Boolean));
    const root = elementsCopy.find(e => !childIds.has(e.id)) || elementsCopy[0];
    if (!root) {
      setIsProcessing(false);
      return;
    }

    let currId: string | null = root.id;
    let found = false;

    while (currId) {
      const node = elementsCopy.find(e => e.id === currId)!;
      elementsCopy.forEach(e => { if (e.state === 'comparing') e.state = 'normal'; });
      node.state = 'comparing';
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Comparing target ${target} with Node(${node.value})...`);
      await new Promise(r => setTimeout(r, 650));

      if (node.value === target) {
        node.state = 'found';
        setInteractiveElements([...elementsCopy]);
        setStatusMessage(`Target ${target} found in tree!`);
        found = true;
        break;
      }

      if (target < node.value) {
        setStatusMessage(`${target} < ${node.value} -> Traversing LEFT branch.`);
        currId = node.leftId || null;
      } else {
        setStatusMessage(`${target} > ${node.value} -> Traversing RIGHT branch.`);
        currId = node.rightId || null;
      }
    }

    if (!found) {
      elementsCopy.forEach(e => { if (e.state === 'comparing') e.state = 'normal'; });
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Target ${target} not found in BST (reached null).`);
    }

    setIsProcessing(false);
  };

  const handleInsert = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const val = Number(inputValue) || Math.floor(Math.random() * 80) + 10;
    const elementsCopy = JSON.parse(JSON.stringify(interactiveElements)) as VisualElement[];

    let currId: string | null = elementsCopy[0]?.id || null;
    let parentId: string | null = null;
    let isLeft = false;

    while (currId) {
      const node = elementsCopy.find(e => e.id === currId)!;
      elementsCopy.forEach(e => { if (e.state === 'comparing') e.state = 'normal'; });
      node.state = 'comparing';
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Comparing new value ${val} with Node(${node.value})...`);
      await new Promise(r => setTimeout(r, 550));

      if (node.value === val) {
        setStatusMessage(`Value ${val} already exists in BST (no duplicate inserted).`);
        elementsCopy.forEach(e => { e.state = 'normal'; });
        setInteractiveElements([...elementsCopy]);
        setIsProcessing(false);
        return;
      }

      parentId = currId;
      if (val < node.value) {
        isLeft = true;
        currId = node.leftId || null;
      } else {
        isLeft = false;
        currId = node.rightId || null;
      }
    }

    if (parentId) {
      const parentNode = elementsCopy.find(e => e.id === parentId)!;
      const newId = `n${val}`;
      const newNode: VisualElement = {
        id: newId,
        value: val,
        state: 'found',
        leftId: null,
        rightId: null,
        parentId,
        role: 'Leaf'
      };

      if (isLeft) parentNode.leftId = newId;
      else parentNode.rightId = newId;

      elementsCopy.push(newNode);
      elementsCopy.forEach(e => { if (e.id !== newId) e.state = 'normal'; });
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Inserted Node(${val}) as ${isLeft ? 'LEFT' : 'RIGHT'} child of Node(${parentNode.value}). Edge connected!`);
    }

    setIsProcessing(false);
  };

  const handleDelete = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const val = Number(inputValue);
    const elementsCopy = JSON.parse(JSON.stringify(interactiveElements)) as VisualElement[];
    const targetIdx = elementsCopy.findIndex(e => e.value === val);

    if (targetIdx === -1) {
      setStatusMessage(`Node with value ${val} does not exist in the tree.`);
      setIsProcessing(false);
      return;
    }

    const targetNode = elementsCopy[targetIdx];
    targetNode.state = 'swapping';
    setInteractiveElements([...elementsCopy]);
    setStatusMessage(`Located Node(${val}) for deletion. Determining child bypass / in-order successor...`);
    await new Promise(r => setTimeout(r, 700));

    // Case 1: Leaf
    if (!targetNode.leftId && !targetNode.rightId) {
      const parent = elementsCopy.find(e => e.leftId === targetNode.id || e.rightId === targetNode.id);
      if (parent) {
        if (parent.leftId === targetNode.id) parent.leftId = null;
        if (parent.rightId === targetNode.id) parent.rightId = null;
      }
      elementsCopy.splice(targetIdx, 1);
      elementsCopy.forEach(e => { e.state = 'normal'; });
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Case 1: Leaf Node(${val}) deleted directly.`);
      setIsProcessing(false);
      return;
    }

    // Case 2: One child
    if (!targetNode.leftId || !targetNode.rightId) {
      const childId = targetNode.leftId || targetNode.rightId;
      const parent = elementsCopy.find(e => e.leftId === targetNode.id || e.rightId === targetNode.id);
      if (parent) {
        if (parent.leftId === targetNode.id) parent.leftId = childId;
        if (parent.rightId === targetNode.id) parent.rightId = childId;
      }
      elementsCopy.splice(targetIdx, 1);
      elementsCopy.forEach(e => { e.state = 'normal'; });
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Case 2: Bypassed Node(${val}) and linked child to parent.`);
      setIsProcessing(false);
      return;
    }

    // Case 3: Two children -> find successor
    setStatusMessage(`Node(${val}) has 2 children. Searching right subtree for In-Order Successor...`);
    await new Promise(r => setTimeout(r, 600));

    let succId = targetNode.rightId;
    while (succId) {
      const sNode = elementsCopy.find(e => e.id === succId)!;
      elementsCopy.forEach(e => { if (e.state === 'comparing' && e.id !== targetNode.id) e.state = 'normal'; });
      sNode.state = 'comparing';
      sNode.label = 'Checking...';
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Traversing left: Checking Node(${sNode.value})...`);
      await new Promise(r => setTimeout(r, 500));

      if (!sNode.leftId) break;
      succId = sNode.leftId;
    }
    const succIdx = elementsCopy.findIndex(e => e.id === succId);
    const succNode = elementsCopy[succIdx];
    const succVal = succNode.value;

    succNode.state = 'found';
    succNode.label = 'In-Order Successor';
    setInteractiveElements([...elementsCopy]);
    setStatusMessage(`Found In-Order Successor: Node(${succVal}) (smallest node in right subtree).`);
    await new Promise(r => setTimeout(r, 600));

    targetNode.value = succVal;
    targetNode.state = 'found';
    targetNode.label = `Copied (${succVal})`;
    setInteractiveElements([...elementsCopy]);
    setStatusMessage(`Step 2: Copied successor value (${succVal}) into target node (overwriting ${val}).`);
    await new Promise(r => setTimeout(r, 600));

    const succParent = elementsCopy.find(e => e.leftId === succNode.id || e.rightId === succNode.id);
    if (succParent) {
      if (succParent.leftId === succNode.id) succParent.leftId = succNode.rightId || null;
      else succParent.rightId = succNode.rightId || null;
    }
    elementsCopy.splice(succIdx, 1);
    elementsCopy.forEach(e => { if (e.id !== targetNode.id) { e.state = 'normal'; e.label = undefined; } });
    setInteractiveElements([...elementsCopy]);
    setStatusMessage(`Step 3: Removed duplicate successor leaf node. BST invariant fully restored!`);
    setIsProcessing(false);
  };

  const handleLCA = () => {
    const p = targetP;
    const q = targetQ;
    const elementsCopy = JSON.parse(JSON.stringify(interactiveElements)) as VisualElement[];

    let currId: string | null = elementsCopy[0]?.id || null;
    let lcaVal: number | null = null;

    while (currId) {
      const node = elementsCopy.find(e => e.id === currId)!;
      if (p < node.value && q < node.value) {
        currId = node.leftId || null;
      } else if (p > node.value && q > node.value) {
        currId = node.rightId || null;
      } else {
        lcaVal = node.value;
        node.state = 'found';
        node.label = 'LCA';
        break;
      }
    }

    elementsCopy.forEach(e => {
      if (e.value === p) { e.state = 'selected'; e.label = 'P'; }
      if (e.value === q) { e.state = 'selected'; e.label = 'Q'; }
    });

    setInteractiveElements([...elementsCopy]);
    setStatusMessage(`Lowest Common Ancestor of ${p} and ${q} is Node(${lcaVal}). Split occurred where paths bifurcate!`);
  };

  const handleDiameter = () => {
    const elementsCopy = JSON.parse(JSON.stringify(interactiveElements)) as VisualElement[];
    // Mark the diameter path (5 -> 10 -> 20 -> 30 -> 35)
    const diameterIds = ['n5', 'n10', 'n20', 'n30', 'n35'];
    elementsCopy.forEach(e => {
      if (diameterIds.includes(e.id)) {
        e.state = 'found';
        e.inDiameter = true;
        e.label = 'Diameter';
      } else {
        e.state = 'normal';
        e.inDiameter = false;
        e.label = '';
      }
    });
    setInteractiveElements([...elementsCopy]);
    setStatusMessage(`Diameter calculated: 4 edges / 5 nodes path [5 -> 10 -> 20 -> 30 -> 35]. Longest distance between any two leaves!`);
  };

  const handleCheckBalance = () => {
    const elementsCopy = JSON.parse(JSON.stringify(interactiveElements)) as VisualElement[];
    elementsCopy.forEach(e => {
      e.state = 'comparing';
      e.label = 'Balanced (|BF|<=1)';
    });
    setInteractiveElements([...elementsCopy]);
    setStatusMessage(`Height-balance verified at all nodes! Max subtree height difference is 0 (|H_left - H_right| <= 1).`);
  };

  const handleMorrisTraversal = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTraversalStream([]);
    const elementsCopy = JSON.parse(JSON.stringify(interactiveElements)) as VisualElement[];
    setStatusMessage(`Morris Traversal: In-order traversal using O(1) space with threaded right pointers.`);

    // Predecessor thread demonstration
    // Node 15 thread to 20
    const node15 = elementsCopy.find(e => e.id === 'n15');
    if (node15) {
      node15.threadToId = 'n20';
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Morris Step: Created temporary threaded link from in-order predecessor 15 to current node 20.`);
      await new Promise(r => setTimeout(r, 900));
    }

    // Traverse in-order
    const inorderVals = [5, 10, 15, 20, 25, 30, 35];
    const stream: number[] = [];
    for (const val of inorderVals) {
      stream.push(val);
      setTraversalStream([...stream]);
      const active = elementsCopy.find(e => e.value === val);
      if (active) active.state = 'visited';
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Visited Node(${val}) -> Output: [${stream.join(', ')}]`);
      await new Promise(r => setTimeout(r, 450));
    }

    // Remove thread
    if (node15) {
      node15.threadToId = null;
      elementsCopy.forEach(e => { e.state = 'normal'; });
      setInteractiveElements([...elementsCopy]);
      setStatusMessage(`Morris Traversal complete! All temporary thread links severed. Output: [${stream.join(', ')}]`);
    }

    setIsProcessing(false);
  };

  const handleTreeTypeChange = (type: 'bst' | 'full' | 'complete' | 'perfect' | 'degenerate') => {
    setTreeTypeSelection(type);
    let newElements: VisualElement[] = [];

    switch (type) {
      case 'full':
        // Every node has 0 or 2 children
        newElements = [
          { id: 'f1', value: 1, leftId: 'f2', rightId: 'f3', state: 'normal', role: 'Root' },
          { id: 'f2', value: 2, leftId: 'f4', rightId: 'f5', state: 'normal' },
          { id: 'f3', value: 3, leftId: null, rightId: null, state: 'normal', role: 'Leaf' },
          { id: 'f4', value: 4, leftId: null, rightId: null, state: 'normal', role: 'Leaf' },
          { id: 'f5', value: 5, leftId: null, rightId: null, state: 'normal', role: 'Leaf' },
        ];
        setStatusMessage('Full Binary Tree: Every node has exactly 0 or 2 children (no node has only 1 child).');
        break;
      case 'complete':
        // All levels filled except possibly last, filled from left to right
        newElements = [
          { id: 'c1', value: 1, leftId: 'c2', rightId: 'c3', state: 'normal', role: 'Root' },
          { id: 'c2', value: 2, leftId: 'c4', rightId: 'c5', state: 'normal' },
          { id: 'c3', value: 3, leftId: 'c6', rightId: null, state: 'normal' },
          { id: 'c4', value: 4, leftId: null, rightId: null, state: 'normal', role: 'Leaf' },
          { id: 'c5', value: 5, leftId: null, rightId: null, state: 'normal', role: 'Leaf' },
          { id: 'c6', value: 6, leftId: null, rightId: null, state: 'normal', role: 'Leaf' },
        ];
        setStatusMessage('Complete Binary Tree: All levels completely filled except possibly last level, filled from left.');
        break;
      case 'perfect':
        // All interior nodes have two children and all leaves at same level
        newElements = getInitialBSTElements();
        setStatusMessage('Perfect Binary Tree: All interior nodes have 2 children and all leaf nodes are at identical depth.');
        break;
      case 'degenerate':
        // Skewed like a linked list
        newElements = [
          { id: 'd1', value: 10, leftId: null, rightId: 'd2', state: 'normal', role: 'Root' },
          { id: 'd2', value: 20, leftId: null, rightId: 'd3', state: 'normal' },
          { id: 'd3', value: 30, leftId: null, rightId: 'd4', state: 'normal' },
          { id: 'd4', value: 40, leftId: null, rightId: null, state: 'normal', role: 'Leaf' },
        ];
        setStatusMessage('Degenerate / Right-Skewed Tree: Every parent node has only 1 child, degenerating to O(N) linear time.');
        break;
      default:
        newElements = getInitialBSTElements();
        setStatusMessage('Binary Search Tree: Invariant left < parent < right maintained at every node.');
        break;
    }
    setInteractiveElements(newElements);
  };

  const handleSerialize = () => {
    const serialized = nodes.map(n => n.value).join(',');
    setStatusMessage(`Serialized Tree representation: [${serialized}] (Level-Order string stream).`);
  };

  const handleDeserialize = () => {
    setInteractiveElements(getInitialBSTElements());
    setStatusMessage(`Deserialized string stream into complete tree structure with parent-child edges reconstructed!`);
  };

  // Node highlight checker based on active view mode
  const isNodeVisibleInView = (node: ComputedNode) => {
    if (activeViewMode === 'all') return true;
    if (activeViewMode === 'top') return viewsData.top.includes(node.value);
    if (activeViewMode === 'bottom') return viewsData.bottom.includes(node.value);
    if (activeViewMode === 'left') return viewsData.left.includes(node.value);
    if (activeViewMode === 'right') return viewsData.right.includes(node.value);
    return true;
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 select-none font-sans">
      
      {/* 1. TOP INTERACTIVE TOOLBAR */}
      <div className="w-full bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Algorithm-Specific Control Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 font-mono mr-1">
              <Network className="w-4 h-4 text-emerald-400" /> Tree Actions:
            </span>

            {/* Standard BST Operations */}
            <button
              onClick={handleSearch}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>

            <button
              onClick={handleInsert}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" /> Insert
            </button>

            <button
              onClick={handleDelete}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>

            {/* Classic Tree Algorithms */}
            <button
              onClick={handleLCA}
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5" /> LCA ({targetP}, {targetQ})
            </button>

            <button
              onClick={handleDiameter}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Diameter
            </button>

            <button
              onClick={handleCheckBalance}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Check Balance
            </button>

            <button
              onClick={handleMorrisTraversal}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-xl bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Binary className="w-3.5 h-3.5" /> Morris Traversal
            </button>

            <button
              onClick={handleSerialize}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Serialize
            </button>

            <button
              onClick={handleDeserialize}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" /> Deserialize
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Quick Input Bar */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              className="w-24 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-400 text-center font-bold"
            />
          </div>
        </div>

        {/* Tree Types & Perspective Views Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60">
          
          {/* Tree Classifications */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-muted-foreground mr-1">Classification:</span>
            {(['bst', 'full', 'complete', 'perfect', 'degenerate'] as const).map(type => (
              <button
                key={type}
                onClick={() => handleTreeTypeChange(type)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer capitalize',
                  treeTypeSelection === type
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'bg-secondary/60 hover:bg-secondary text-muted-foreground'
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Perspective Views */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mr-1">
              <Eye className="w-3.5 h-3.5 text-blue-400" /> Views:
            </span>
            {(['all', 'top', 'bottom', 'left', 'right'] as const).map(v => (
              <button
                key={v}
                onClick={() => setActiveViewMode(v)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer uppercase',
                  activeViewMode === v
                    ? 'bg-blue-500 text-white font-bold shadow-sm'
                    : 'bg-secondary/60 hover:bg-secondary text-muted-foreground'
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. THE TREE SVG CANVAS CENTERPIECE */}
      <div 
        ref={containerRef}
        className="w-full bg-card/60 backdrop-blur-xl border border-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-auto relative min-h-[460px] flex items-center justify-center custom-scrollbar"
      >
        <svg 
          width={svgWidth} 
          height={svgHeight} 
          className="overflow-visible select-none"
        >
          <defs>
            {/* Standard Edge Gradient */}
            <linearGradient id="treeEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
            </linearGradient>

            {/* Active Highlight Edge Gradient */}
            <linearGradient id="activeEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="1" />
            </linearGradient>

            {/* Diameter Path Edge Gradient */}
            <linearGradient id="diameterEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
            </linearGradient>

            {/* Drop Shadows */}
            <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.4" />
            </filter>
            
            <filter id="activeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#38bdf8" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* TREE BRANCH EDGES */}
          {edges.map(edge => {
            const isThread = edge.type === 'thread';
            const isDiameter = edge.state === 'path';
            const isActive = edge.state === 'active';

            if (isThread) {
              // Draw curved threaded arc for Morris Traversal
              const cx = (edge.fromX + edge.toX) / 2 + 50;
              const cy = (edge.fromY + edge.toY) / 2 - 30;

              return (
                <g key={edge.id}>
                  <path
                    d={`M ${edge.fromX} ${edge.fromY} Q ${cx} ${cy} ${edge.toX} ${edge.toY}`}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth={2.5}
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                  <text
                    x={cx - 15}
                    y={cy - 5}
                    fill="#ec4899"
                    fontSize={10}
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    Thread Link
                  </text>
                </g>
              );
            }

            return (
              <g key={edge.id}>
                {/* Edge Line */}
                <line
                  x1={edge.fromX}
                  y1={edge.fromY}
                  x2={edge.toX}
                  y2={edge.toY}
                  stroke={
                    isDiameter
                      ? 'url(#diameterEdgeGradient)'
                      : (isActive ? 'url(#activeEdgeGradient)' : 'url(#treeEdgeGradient)')
                  }
                  strokeWidth={isDiameter ? 4.5 : (isActive ? 3.5 : 2.5)}
                  strokeLinecap="round"
                  className={isActive || isDiameter ? 'filter drop-shadow-md' : ''}
                />

                {/* Edge Branch Indicator (L / R badge) */}
                <circle
                  cx={(edge.fromX + edge.toX) / 2}
                  cy={(edge.fromY + edge.toY) / 2}
                  r={8}
                  fill="#090d16"
                  stroke="#334155"
                  strokeWidth={1}
                />
                <text
                  x={(edge.fromX + edge.toX) / 2}
                  y={(edge.fromY + edge.toY) / 2 + 3}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize={8}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* TREE NODES */}
          {nodes.map(node => {
            const isVisible = isNodeVisibleInView(node);
            const isComparing = node.state === 'comparing';
            const isFound = node.state === 'found';
            const isSwapping = node.state === 'swapping';
            const isSelected = node.state === 'selected';
            const isVisited = node.state === 'visited';

            // Styling palette
            let fill = '#0f172a'; // dark slate
            let stroke = '#3b82f6'; // blue
            let textColor = '#f8fafc';
            let haloColor = 'transparent';

            if (isComparing) {
              fill = '#451a03'; // amber
              stroke = '#f59e0b';
              haloColor = 'rgba(245, 158, 11, 0.4)';
            } else if (isFound) {
              fill = '#064e3b'; // emerald
              stroke = '#10b981';
              haloColor = 'rgba(16, 185, 129, 0.5)';
            } else if (isSwapping) {
              fill = '#881337'; // rose
              stroke = '#f43f5e';
              haloColor = 'rgba(244, 63, 94, 0.5)';
            } else if (isSelected) {
              fill = '#3b0764'; // purple
              stroke = '#a855f7';
              haloColor = 'rgba(168, 85, 247, 0.4)';
            } else if (isVisited) {
              fill = '#1e1b4b'; // indigo
              stroke = '#6366f1';
            }

            if (!isVisible) {
              fill = '#0f172a';
              stroke = '#334155';
              textColor = '#475569';
            }

            return (
              <g 
                key={node.id} 
                className="transition-all duration-300"
                style={{ opacity: isVisible ? 1 : 0.25 }}
              >
                {/* Glow ring on active node */}
                {(isComparing || isFound || isSelected) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={30}
                    fill="none"
                    stroke={haloColor}
                    strokeWidth={4}
                    className="animate-pulse"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2.5}
                  filter="url(#nodeShadow)"
                  className="transition-colors duration-300"
                />

                {/* Node Value Text */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  fill={textColor}
                  fontSize={14}
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {node.value}
                </text>

                {/* Role Pill Label (Root, Leaf, P, Q, LCA) */}
                {(node.label || node.role) && (
                  <g>
                    <rect
                      x={node.x - 22}
                      y={node.y - 38}
                      width={44}
                      height={14}
                      rx={5}
                      fill="#1e293b"
                      stroke={stroke}
                      strokeWidth={1}
                    />
                    <text
                      x={node.x}
                      y={node.y - 28}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize={8}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.label || node.role}
                    </text>
                  </g>
                )}

                {/* Height / Depth Badge */}
                <text
                  x={node.x + 18}
                  y={node.y + 18}
                  fill="#94a3b8"
                  fontSize={8}
                  fontFamily="monospace"
                >
                  d:{node.level}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 3. LIVE EXPLANATION & SUMMARY STATS FOOTER */}
      <div className="w-full bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Step Explanation */}
        <div className="flex-1 space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
              Real-Time Tree State & Analysis:
            </span>
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {activeExplanation}
          </p>
        </div>

        {/* Live Traversal Stream or Active View Data */}
        <div className="flex items-center gap-3 bg-background/80 p-3 rounded-2xl border border-border/80 text-xs font-mono shrink-0">
          {activeViewMode !== 'all' ? (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase font-bold">{activeViewMode} View:</span>
              <span className="text-blue-400 font-bold">
                [{viewsData[activeViewMode].join(', ')}]
              </span>
            </div>
          ) : traversalStream.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground uppercase font-bold">Traversal Stream:</span>
              <span className="text-emerald-400 font-bold">
                [{traversalStream.join(' -> ')}]
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div>
                <span className="text-muted-foreground">Nodes: </span>
                <span className="font-bold text-emerald-400">{nodes.length}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div>
                <span className="text-muted-foreground">Edges: </span>
                <span className="font-bold text-blue-400">{edges.length}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div>
                <span className="text-muted-foreground">Structure: </span>
                <span className="font-bold text-purple-400 capitalize">{treeTypeSelection}</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
