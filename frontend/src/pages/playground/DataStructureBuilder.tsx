import { useState, useMemo } from 'react';
import { WorkspaceLayout } from '../../components/layout/WorkspaceLayout';
import { 
  Network, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  GitCommit, 
  FolderTree, 
  Zap, 
  Search,
  BookOpen,
  Info,
  Scale
} from 'lucide-react';

type MainTab = 'linked-list' | 'bst' | 'heap' | 'trie';
type ListType = 'singly' | 'doubly' | 'circular-singly' | 'circular-doubly';

// --- LINKED LIST INTERFACES ---
interface LLNode {
  id: string;
  val: number;
}

// --- BST INTERFACES ---
interface BSTNode {
  val: number;
  left?: BSTNode;
  right?: BSTNode;
}

interface PositionedBSTNode {
  val: number;
  x: number;
  y: number;
  left?: PositionedBSTNode;
  right?: PositionedBSTNode;
}



export const DataStructureBuilder = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('linked-list');

  // --- EDUCATIONAL EXPLANATION PANEL STATE ---
  const [opTitle, setOpTitle] = useState('Data Structure Construction Studio');
  const [whatHappened, setWhatHappened] = useState('Select a data structure tab and run operations to observe internal memory reference updates.');
  const [whyHappened, setWhyHappened] = useState('Data structures optimize trade-offs between memory overhead, search speed, and dynamic modification performance.');
  const [movedPointers, setMovedPointers] = useState('Initial state ready.');
  const [timeComplexity, setTimeComplexity] = useState('O(1)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [operationLog, setOperationLog] = useState<string[]>([
    'Playground initialized. Ready for operations.'
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setOperationLog(prev => [`[${time}] ${msg}`, ...prev.slice(0, 14)]);
  };

  // ==========================================
  // 1. LINKED LIST BUILDER STATE
  // ==========================================
  const [listType, setListType] = useState<ListType>('singly');
  const [llNodes, setLLNodes] = useState<LLNode[]>([
    { id: '1', val: 10 },
    { id: '2', val: 20 },
    { id: '3', val: 30 },
    { id: '4', val: 40 }
  ]);
  const [llInputValue, setLlInputValue] = useState('');
  const [llPosValue, setLlPosValue] = useState('');
  const [llActiveNodeId, setLlActiveNodeId] = useState<string | null>(null);
  const [reversalMarkers, setReversalMarkers] = useState<{ prev: number | null; curr: number | null; next: number | null } | null>(null);

  const handleLLInsertHead = () => {
    const val = parseInt(llInputValue, 10);
    if (isNaN(val)) return;
    const newId = Math.random().toString();
    const newNodes = [{ id: newId, val }, ...llNodes];
    setLLNodes(newNodes);
    setLlActiveNodeId(newId);
    setLlInputValue('');

    const firstVal = llNodes[0]?.val ?? 'NULL';
    setOpTitle(`Insert Node ${val} at Head`);
    setWhatHappened(`Created node [${val}]. Set new.next -> ${firstVal}. Updated head pointer to new node.`);
    setWhyHappened(`Inserting at the head of a linked list is instantaneous because the head reference is directly accessible.`);
    setMovedPointers(`head -> [${val}] | [${val}].next -> ${firstVal}`);
    setTimeComplexity('O(1)');
    setSpaceComplexity('O(1)');
    addLog(`Inserted node ${val} at Head of ${listType} list.`);
  };

  const handleLLInsertTail = () => {
    const val = parseInt(llInputValue, 10);
    if (isNaN(val)) return;
    const newId = Math.random().toString();
    const newNodes = [...llNodes, { id: newId, val }];
    setLLNodes(newNodes);
    setLlActiveNodeId(newId);
    setLlInputValue('');

    const lastVal = llNodes[llNodes.length - 1]?.val ?? 'NULL';
    setOpTitle(`Insert Node ${val} at Tail`);
    setWhatHappened(`Traversed to end of list. Set [${lastVal}].next -> [${val}]. Set [${val}].next -> ${listType.includes('circular') ? 'head' : 'NULL'}.`);
    setWhyHappened(`Tail insertion updates the former tail node's next reference to point to the new node.`);
    setMovedPointers(`[${lastVal}].next -> [${val}] | tail -> [${val}]`);
    setTimeComplexity(listType.includes('circular') ? 'O(1)' : 'O(N)');
    setSpaceComplexity('O(1)');
    addLog(`Inserted node ${val} at Tail of ${listType} list.`);
  };

  const handleLLInsertAtPos = () => {
    const val = parseInt(llInputValue, 10);
    const pos = parseInt(llPosValue, 10);
    if (isNaN(val) || isNaN(pos)) return;
    const idx = Math.max(0, Math.min(pos, llNodes.length));
    const newId = Math.random().toString();
    const newNodes = [...llNodes];
    newNodes.splice(idx, 0, { id: newId, val });
    setLLNodes(newNodes);
    setLlActiveNodeId(newId);
    setLlInputValue('');
    setLlPosValue('');

    const prevNodeVal = newNodes[idx - 1]?.val ?? 'head';
    const nextNodeVal = newNodes[idx + 1]?.val ?? 'NULL';
    setOpTitle(`Insert Node ${val} at Index ${idx}`);
    setWhatHappened(`Traversed to index ${idx}. Updated [${prevNodeVal}].next -> [${val}] and [${val}].next -> [${nextNodeVal}].`);
    setWhyHappened(`Inserting at position K requires updating adjacent pointers without memory reallocation or element shifting.`);
    setMovedPointers(`[${prevNodeVal}].next -> [${val}] | [${val}].next -> [${nextNodeVal}]`);
    setTimeComplexity('O(N)');
    setSpaceComplexity('O(1)');
    addLog(`Inserted node ${val} at index ${idx}.`);
  };

  const handleLLDelete = (id: string, val: number) => {
    const idx = llNodes.findIndex(n => n.id === id);
    const prevVal = llNodes[idx - 1]?.val ?? 'head';
    const nextVal = llNodes[idx + 1]?.val ?? 'NULL';
    setLLNodes(llNodes.filter(n => n.id !== id));

    setOpTitle(`Delete Node ${val}`);
    setWhatHappened(`Bypassed node [${val}]. Updated [${prevVal}].next -> [${nextVal}]. Garbage collector reclaims [${val}].`);
    setWhyHappened(`Deleting a linked list node involves bypassing its pointer references so it is no longer reachable.`);
    setMovedPointers(`[${prevVal}].next -> [${nextVal}]`);
    setTimeComplexity('O(N)');
    setSpaceComplexity('O(1)');
    addLog(`Deleted node ${val} from list.`);
  };

  const handleLLReverse = async () => {
    setOpTitle(`Reverse Linked List Pointers Step-by-Step`);
    setWhyHappened(`Reversing a list requires iteratively flipping each node's next pointer using three tracking markers: prev, curr, and next.`);
    setTimeComplexity('O(N)');
    setSpaceComplexity('O(1)');

    for (let i = 0; i < llNodes.length; i++) {
      setReversalMarkers({
        prev: i > 0 ? i - 1 : null,
        curr: i,
        next: i < llNodes.length - 1 ? i + 1 : null
      });
      setWhatHappened(`Step ${i + 1}: curr -> [${llNodes[i].val}]. Flipping pointer [${llNodes[i].val}].next to point backward.`);
      setMovedPointers(`curr.next -> prev (${i > 0 ? llNodes[i - 1].val : 'NULL'})`);
      await new Promise(r => setTimeout(r, 600));
    }

    setLLNodes([...llNodes].reverse());
    setReversalMarkers(null);
    addLog(`Reversed list pointers.`);
  };

  // ==========================================
  // 2. BINARY TREE / BST BUILDER STATE
  // ==========================================
  const [bstValues, setBstValues] = useState<number[]>([50, 30, 70, 20, 40, 60, 80]);
  const [bstInputValue, setBstInputValue] = useState('');
  const [bstPath, setBstPath] = useState<number[]>([]);
  const [bstComparisons, setBstComparisons] = useState<string[]>([]);
  const [heightBefore, setHeightBefore] = useState<number | null>(null);

  // Helper to build BST Object Tree
  const buildBSTObject = (vals: number[]): BSTNode | undefined => {
    if (vals.length === 0) return undefined;
    let root: BSTNode | undefined = undefined;

    const insert = (node: BSTNode | undefined, val: number): BSTNode => {
      if (!node) return { val };
      if (val < node.val) node.left = insert(node.left, val);
      else if (val > node.val) node.right = insert(node.right, val);
      return node;
    };

    vals.forEach(v => {
      root = insert(root, v);
    });
    return root;
  };

  // Helper to calculate tree depth/height
  const getTreeHeight = (node?: BSTNode): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  };

  const getLeafCount = (node?: BSTNode): number => {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    return getLeafCount(node.left) + getLeafCount(node.right);
  };

  const bstRoot = useMemo(() => buildBSTObject(bstValues), [bstValues]);
  const currentHeight = useMemo(() => getTreeHeight(bstRoot), [bstRoot]);
  const currentLeaves = useMemo(() => getLeafCount(bstRoot), [bstRoot]);
  const leftHeight = useMemo(() => getTreeHeight(bstRoot?.left), [bstRoot]);
  const rightHeight = useMemo(() => getTreeHeight(bstRoot?.right), [bstRoot]);
  const balanceFactor = leftHeight - rightHeight;

  const handleBSTInsert = async () => {
    const val = parseInt(bstInputValue, 10);
    if (isNaN(val) || bstValues.includes(val) || bstValues.length >= 15) return;
    setBstInputValue('');

    // Simulate step-by-step traversal
    const path: number[] = [];
    const comps: string[] = [];
    let curr = bstRoot;
    while (curr) {
      path.push(curr.val);
      if (val < curr.val) {
        comps.push(`${val} < ${curr.val} → Traverse Left`);
        curr = curr.left;
      } else {
        comps.push(`${val} > ${curr.val} → Traverse Right`);
        curr = curr.right;
      }
    }

    setBstPath(path);
    setBstComparisons(comps);

    setOpTitle(`Insert Node ${val} into BST`);
    setWhatHappened(`Traversed tree path: [${path.join(' → ')}]. Found empty spot and inserted node [${val}].`);
    setWhyHappened(`BST property requires values smaller than a node to go left and larger values to go right.`);
    setMovedPointers(`Inserted node [${val}] as child.`);
    setTimeComplexity('O(log N)');
    setSpaceComplexity('O(1)');

    await new Promise(r => setTimeout(r, 1200));
    setBstValues([...bstValues, val]);
    setBstPath([]);
    setBstComparisons([]);
    addLog(`Inserted node ${val} into BST.`);
  };

  const handleBSTDelete = (val: number) => {
    setBstValues(bstValues.filter(v => v !== val));
    setOpTitle(`Delete Node ${val} from BST`);
    setWhatHappened(`Located node [${val}]. Handled child reconnections and updated parent references.`);
    setWhyHappened(`Node deletion handles 3 cases: leaf removal, single child promotion, or two-children inorder successor replacement.`);
    setMovedPointers(`Reconnected BST parent references.`);
    setTimeComplexity('O(log N)');
    setSpaceComplexity('O(1)');
    addLog(`Deleted node ${val} from BST.`);
  };

  const handleBalanceTree = () => {
    setHeightBefore(currentHeight);
    const sorted = [...bstValues].sort((a, b) => a - b);
    
    const buildBalanced = (arr: number[]): number[] => {
      if (arr.length === 0) return [];
      const mid = Math.floor(arr.length / 2);
      return [arr[mid], ...buildBalanced(arr.slice(0, mid)), ...buildBalanced(arr.slice(mid + 1))];
    };

    const balancedVals = buildBalanced(sorted);
    setBstValues(balancedVals);

    const newH = Math.ceil(Math.log2(balancedVals.length + 1));
    setOpTitle(`Balance Tree (AVL / Red-Black Restructuring)`);
    setWhatHappened(`Converted BST to sorted sequence and rebuilt optimal balanced tree. Height reduced from ${currentHeight} to ${newH}.`);
    setWhyHappened(`Tree balancing prevents degenerate O(N) chain structures and restores optimal O(log N) operations.`);
    setMovedPointers(`Restructured all internal left/right node branches.`);
    setTimeComplexity('O(N log N)');
    setSpaceComplexity('O(N)');
    addLog(`Balanced BST. Height reduced to ${newH}.`);
  };

  // Position BST nodes for 2D rendering
  const layoutBST = (node?: BSTNode, x = 300, y = 50, level = 1): PositionedBSTNode | undefined => {
    if (!node) return undefined;
    const offset = Math.max(160 / Math.pow(1.8, level), 30);
    return {
      val: node.val,
      x,
      y,
      left: layoutBST(node.left, x - offset, y + 65, level + 1),
      right: layoutBST(node.right, x + offset, y + 65, level + 1)
    };
  };

  const positionedBST = useMemo(() => layoutBST(bstRoot), [bstRoot]);

  // Helper to render BST SVG edges and nodes recursively
  const renderBSTEdges = (node?: PositionedBSTNode) => {
    if (!node) return null;
    return (
      <g key={`edges-${node.val}`}>
        {node.left && (
          <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="rgba(168, 85, 247, 0.4)" strokeWidth="3" />
        )}
        {node.right && (
          <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="rgba(168, 85, 247, 0.4)" strokeWidth="3" />
        )}
        {renderBSTEdges(node.left)}
        {renderBSTEdges(node.right)}
      </g>
    );
  };

  const renderBSTNodes = (node?: PositionedBSTNode) => {
    if (!node) return null;
    const isHighlighted = bstPath.includes(node.val);
    return (
      <g key={`node-${node.val}`}>
        <circle
          cx={node.x}
          cy={node.y}
          r="22"
          className={`${isHighlighted ? 'fill-amber-400 stroke-amber-300 animate-pulse' : 'fill-card stroke-purple-500'} stroke-2 cursor-pointer hover:fill-purple-500/20 transition-all`}
          onClick={() => handleBSTDelete(node.val)}
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className={`text-xs font-black fill-foreground pointer-events-none`}
        >
          {node.val}
        </text>
        {renderBSTNodes(node.left)}
        {renderBSTNodes(node.right)}
      </g>
    );
  };

  // ==========================================
  // 3. HEAP BUILDER STATE (Dual View)
  // ==========================================
  const [heapArr, setHeapArr] = useState<number[]>([90, 70, 50, 20, 10, 40]);
  const [heapType, setHeapType] = useState<'max' | 'min'>('max');
  const [heapInputValue, setHeapInputValue] = useState('');
  const [heapSwappingIndices, setHeapSwappingIndices] = useState<[number, number] | null>(null);

  const handleHeapInsert = async () => {
    const val = parseInt(heapInputValue, 10);
    if (isNaN(val) || heapArr.length >= 12) return;
    setHeapInputValue('');

    const newHeap = [...heapArr, val];
    setHeapArr(newHeap);
    let idx = newHeap.length - 1;

    setOpTitle(`Insert ${val} into ${heapType.toUpperCase()}-Heap`);
    setWhatHappened(`Appended [${val}] at bottom of complete tree (index ${idx}). Initiating Sift-Up bubble process.`);
    setWhyHappened(`Heap property must be restored by swapping newly added node with its parent if order is violated.`);
    setTimeComplexity('O(log N)');
    setSpaceComplexity('O(1)');

    // Animate Sift Up
    while (idx > 0) {
      const pIdx = Math.floor((idx - 1) / 2);
      const isViolated = heapType === 'max' ? newHeap[idx] > newHeap[pIdx] : newHeap[idx] < newHeap[pIdx];
      if (isViolated) {
        setHeapSwappingIndices([idx, pIdx]);
        setMovedPointers(`Swapping index ${idx} (${newHeap[idx]}) with parent index ${pIdx} (${newHeap[pIdx]})`);
        await new Promise(r => setTimeout(r, 800));

        const tmp = newHeap[idx];
        newHeap[idx] = newHeap[pIdx];
        newHeap[pIdx] = tmp;
        setHeapArr([...newHeap]);
        idx = pIdx;
      } else {
        break;
      }
    }
    setHeapSwappingIndices(null);
    addLog(`Inserted ${val} into Heap.`);
  };

  const handleHeapExtractTop = async () => {
    if (heapArr.length === 0) return;
    const top = heapArr[0];
    const newHeap = [...heapArr];
    const last = newHeap.pop()!;

    setOpTitle(`Extract Top (${top}) from ${heapType.toUpperCase()}-Heap`);
    setWhatHappened(`Removed root [${top}]. Promoted last leaf element [${last}] to root. Initiating Heapify-Down.`);
    setWhyHappened(`Heap extract removes max/min root and restores structural heap invariants by sifting down.`);
    setTimeComplexity('O(log N)');
    setSpaceComplexity('O(1)');

    if (newHeap.length > 0) {
      newHeap[0] = last;
      setHeapArr([...newHeap]);
      let idx = 0;

      while (true) {
        let target = idx;
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;
        if (heapType === 'max') {
          if (left < newHeap.length && newHeap[left] > newHeap[target]) target = left;
          if (right < newHeap.length && newHeap[right] > newHeap[target]) target = right;
        } else {
          if (left < newHeap.length && newHeap[left] < newHeap[target]) target = left;
          if (right < newHeap.length && newHeap[right] < newHeap[target]) target = right;
        }

        if (target !== idx) {
          setHeapSwappingIndices([idx, target]);
          setMovedPointers(`Heap property violated: Swap root index ${idx} (${newHeap[idx]}) with child index ${target} (${newHeap[target]})`);
          await new Promise(r => setTimeout(r, 800));

          const tmp = newHeap[idx];
          newHeap[idx] = newHeap[target];
          newHeap[target] = tmp;
          setHeapArr([...newHeap]);
          idx = target;
        } else {
          break;
        }
      }
    } else {
      setHeapArr([]);
    }
    setHeapSwappingIndices(null);
    addLog(`Extracted top (${top}) from Heap.`);
  };

  // Helper to render Heap 2D Tree
  const getHeapNodePos = (idx: number) => {
    const level = Math.floor(Math.log2(idx + 1));
    const posInLevel = idx - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);
    const width = 560;
    const x = (width / (totalInLevel + 1)) * (posInLevel + 1);
    const y = 45 + level * 65;
    return { x, y };
  };

  // ==========================================
  // 4. TRIE PREFIX BUILDER STATE
  // ==========================================
  const [trieWords, setTrieWords] = useState<string[]>(['cat', 'car', 'care']);
  const [trieInputValue, setTrieInputValue] = useState('');
  const [trieSearchTerm, setTrieSearchTerm] = useState('');
  const [trieActivePath, setTrieActivePath] = useState<string[]>([]);
  const [trieSearchResult, setTrieSearchResult] = useState<string | null>(null);

  const handleTrieInsert = async () => {
    const word = trieInputValue.trim().toLowerCase();
    if (!word || trieWords.includes(word) || trieWords.length >= 7) return;
    setTrieInputValue('');

    setOpTitle(`Insert Word "${word.toUpperCase()}" into Trie`);
    setWhatHappened(`Sequentially created character nodes for "${word.toUpperCase()}". Reused shared prefix branches where applicable.`);
    setWhyHappened(`Tries store words by sharing common prefix nodes, reducing space complexity for dictionary operations.`);
    setTimeComplexity(`O(L) where L=${word.length}`);
    setSpaceComplexity(`O(L)`);

    // Animate character insertion
    const path: string[] = [];
    for (let i = 1; i <= word.length; i++) {
      path.push(word.substring(0, i));
      setTrieActivePath([...path]);
      await new Promise(r => setTimeout(r, 400));
    }

    setTrieWords([...trieWords, word]);
    setTrieActivePath([]);
    addLog(`Inserted word "${word}" into Trie.`);
  };

  const handleTrieSearch = async () => {
    const word = trieSearchTerm.trim().toLowerCase();
    if (!word) return;

    setOpTitle(`Search Prefix/Word "${word.toUpperCase()}" in Trie`);
    setTimeComplexity(`O(L) where L=${word.length}`);
    setSpaceComplexity('O(1)');

    const path: string[] = [];
    let matchesPrefix = true;
    for (let i = 1; i <= word.length; i++) {
      const sub = word.substring(0, i);
      const exists = trieWords.some(w => w.startsWith(sub));
      if (exists) {
        path.push(sub);
        setTrieActivePath([...path]);
        await new Promise(r => setTimeout(r, 450));
      } else {
        matchesPrefix = false;
        break;
      }
    }

    const isFullWord = trieWords.includes(word);
    if (isFullWord) {
      setTrieSearchResult(`✓ Exact Word "${word.toUpperCase()}" exists in Trie!`);
      setWhatHappened(`Found complete character sequence for "${word.toUpperCase()}" with end-of-word marker.`);
    } else if (matchesPrefix) {
      const count = trieWords.filter(w => w.startsWith(word)).length;
      setTrieSearchResult(`✓ Valid Prefix "${word.toUpperCase()}" (${count} words share this prefix)`);
      setWhatHappened(`Traversed prefix path for "${word.toUpperCase()}". ${count} words share this prefix subtree.`);
    } else {
      setTrieSearchResult(`✕ "${word.toUpperCase()}" does not exist in Trie`);
      setWhatHappened(`Prefix traversal failed. Path disconnected at step.`);
    }

    setTimeout(() => {
      setTrieActivePath([]);
    }, 2000);
  };

  const handleTrieDelete = (word: string) => {
    setTrieWords(trieWords.filter(w => w !== word));
    setOpTitle(`Delete Word "${word.toUpperCase()}" from Trie`);
    setWhatHappened(`Removed end-of-word marker for "${word.toUpperCase()}". Cleaned up unshared leaf character nodes.`);
    setWhyHappened(`Trie deletion removes unshared trailing character nodes while preserving prefix nodes shared by other words.`);
    setTimeComplexity(`O(L) where L=${word.length}`);
    setSpaceComplexity('O(1)');
    addLog(`Deleted word "${word}" from Trie.`);
  };

  const navLinks = [
    { id: 'structure-builder', label: 'Data Structure Builder', icon: <Network className="w-4 h-4" /> },
  ];

  return (
    <WorkspaceLayout navLinks={navLinks}>
      <div className="w-full space-y-8 text-left pb-16">
        
        {/* HERO HEADER */}
        <section className="w-full border border-border/80 bg-gradient-to-r from-card/90 via-card/50 to-purple-500/10 backdrop-blur-xl relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
                <Network className="w-3.5 h-3.5" /> Interactive Computer Science Lab
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                Data Structure Builder
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl font-medium">
                Observe internal memory references, pointer updates, 2D tree structures, Sift-Up heapify swaps, and Trie prefix character construction live as operations occur.
              </p>
            </div>
          </div>
        </section>

        {/* STRUCTURE SELECTOR TABS */}
        <section className="w-full bg-card/80 border border-border/80 p-1.5 rounded-2xl shadow-md grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'linked-list', name: '1. Linked List Lab', icon: <GitCommit className="w-4 h-4" /> },
            { id: 'bst', name: '2. Hierarchical BST Lab', icon: <FolderTree className="w-4 h-4" /> },
            { id: 'heap', name: '3. Synchronous Heap Lab', icon: <Scale className="w-4 h-4" /> },
            { id: 'trie', name: '4. Trie Prefix Lab', icon: <Sparkles className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MainTab)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </section>

        {/* MAIN WORKSPACE CANVAS + CONTROLS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls & Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* MODULE 1: LINKED LIST CONTROLS */}
            {activeTab === 'linked-list' && (
              <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-lg space-y-5">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <GitCommit className="w-4 h-4 text-purple-400" />
                  <h3 className="font-black text-base text-foreground">Linked List Configuration</h3>
                </div>

                {/* List Type Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Linked List Variant</label>
                  <select 
                    value={listType} 
                    onChange={(e) => { setListType(e.target.value as ListType); addLog(`Switched to ${e.target.value} list variant.`); }}
                    className="w-full bg-background border border-border rounded-xl p-3 text-xs font-bold text-foreground"
                  >
                    <option value="singly">Singly Linked List [data | next]</option>
                    <option value="doubly">Doubly Linked List [prev | data | next]</option>
                    <option value="circular-singly">Circular Singly List (tail.next = head)</option>
                    <option value="circular-doubly">Circular Doubly List (tail ⇄ head)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Node Data Value</label>
                  <input
                    type="number"
                    value={llInputValue}
                    onChange={(e) => setLlInputValue(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full bg-background border border-border rounded-xl p-3 font-bold text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleLLInsertHead} className="p-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-primary/90 cursor-pointer shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> Insert Head
                  </button>
                  <button onClick={handleLLInsertTail} className="p-3 bg-secondary text-secondary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-secondary/80 cursor-pointer shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> Insert Tail
                  </button>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Insert At Position (Index K)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={llPosValue}
                      onChange={(e) => setLlPosValue(e.target.value)}
                      placeholder="Index (0-N)"
                      className="w-full bg-background border border-border rounded-xl p-2.5 font-bold text-xs outline-none focus:border-primary"
                    />
                    <button onClick={handleLLInsertAtPos} className="px-4 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center justify-center cursor-pointer">
                      Insert
                    </button>
                  </div>
                </div>

                <button onClick={handleLLReverse} className="w-full p-3 bg-background border border-border text-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:border-purple-500 cursor-pointer shadow-sm">
                  <RotateCcw className="w-3.5 h-3.5 text-purple-400" /> Animate Pointer Reversal Step-by-Step
                </button>
              </div>
            )}

            {/* MODULE 2: BST CONTROLS */}
            {activeTab === 'bst' && (
              <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-lg space-y-5">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <FolderTree className="w-4 h-4 text-purple-400" />
                  <h3 className="font-black text-base text-foreground">BST Actions & Statistics</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Insert Node Value</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bstInputValue}
                      onChange={(e) => setBstInputValue(e.target.value)}
                      placeholder="e.g. 35"
                      className="w-full bg-background border border-border rounded-xl p-3 font-bold text-xs outline-none focus:border-primary"
                    />
                    <button onClick={handleBSTInsert} className="px-5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-primary/90 cursor-pointer shadow-sm shrink-0">
                      <Plus className="w-4 h-4" /> Insert
                    </button>
                  </div>
                </div>

                {/* Tree Live Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-0.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Tree Height</div>
                    <div className="text-sm font-black text-purple-400">{currentHeight}</div>
                  </div>
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-0.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Total Nodes</div>
                    <div className="text-sm font-black text-blue-400">{bstValues.length}</div>
                  </div>
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-0.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Leaf Nodes</div>
                    <div className="text-sm font-black text-emerald-400">{currentLeaves}</div>
                  </div>
                  <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-0.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Balance Factor</div>
                    <div className={`text-sm font-black ${Math.abs(balanceFactor) <= 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {balanceFactor > 0 ? `+${balanceFactor}` : balanceFactor}
                    </div>
                  </div>
                  {heightBefore !== null && (
                    <div className="col-span-2 p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs font-mono text-purple-400 font-bold text-center">
                      Height Before: {heightBefore} → Height After: {currentHeight}
                    </div>
                  )}
                </div>

                <button onClick={handleBalanceTree} className="w-full p-3.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 text-foreground font-black rounded-xl text-xs flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer shadow-sm">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Balance Tree (AVL Restructuring)
                </button>
              </div>
            )}

            {/* MODULE 3: HEAP CONTROLS */}
            {activeTab === 'heap' && (
              <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-lg space-y-5">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Scale className="w-4 h-4 text-purple-400" />
                  <h3 className="font-black text-base text-foreground">Heap Operations</h3>
                </div>

                <div className="flex gap-2 p-1 bg-background border border-border rounded-xl">
                  <button onClick={() => setHeapType('max')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${heapType === 'max' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground'}`}>
                    Max-Heap
                  </button>
                  <button onClick={() => setHeapType('min')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${heapType === 'min' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground'}`}>
                    Min-Heap
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Insert Value</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={heapInputValue}
                      onChange={(e) => setHeapInputValue(e.target.value)}
                      placeholder="e.g. 85"
                      className="w-full bg-background border border-border rounded-xl p-3 font-bold text-xs outline-none focus:border-primary"
                    />
                    <button onClick={handleHeapInsert} className="px-5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-primary/90 cursor-pointer shadow-sm shrink-0">
                      <Plus className="w-4 h-4" /> Insert
                    </button>
                  </div>
                </div>

                <button onClick={handleHeapExtractTop} className="w-full p-3.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-rose-500/20 cursor-pointer shadow-sm">
                  <Trash2 className="w-4 h-4" /> Extract Root ({heapArr[0] ?? 'N/A'}) & Heapify Down
                </button>
              </div>
            )}

            {/* MODULE 4: TRIE CONTROLS */}
            {activeTab === 'trie' && (
              <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-lg space-y-5">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="font-black text-base text-foreground">Trie Dictionary Actions</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Add Word</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trieInputValue}
                      onChange={(e) => setTrieInputValue(e.target.value)}
                      placeholder="e.g. card"
                      className="w-full bg-background border border-border rounded-xl p-3 font-bold text-xs outline-none focus:border-primary uppercase"
                    />
                    <button onClick={handleTrieInsert} className="px-5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-primary/90 cursor-pointer shadow-sm shrink-0">
                      <Plus className="w-4 h-4" /> Insert
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Search Word / Prefix</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trieSearchTerm}
                      onChange={(e) => setTrieSearchTerm(e.target.value)}
                      placeholder="e.g. ca"
                      className="w-full bg-background border border-border rounded-xl p-3 font-bold text-xs outline-none focus:border-primary uppercase"
                    />
                    <button onClick={handleTrieSearch} className="px-5 bg-secondary text-secondary-foreground font-bold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-secondary/80 cursor-pointer shrink-0">
                      <Search className="w-4 h-4" /> Search
                    </button>
                  </div>
                  {trieSearchResult && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-xs font-bold">
                      {trieSearchResult}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LIVE EDUCATIONAL EXPLANATION PANEL */}
            <div className="bg-card/90 border border-border/80 rounded-3xl p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <h3 className="font-black text-base text-foreground">Live CS Explanation</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                    Time: {timeComplexity}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono font-bold">
                    Space: {spaceComplexity}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-bold text-foreground text-sm">{opTitle}</div>
                  <div className="text-muted-foreground font-medium mt-1 leading-relaxed">{whatHappened}</div>
                </div>

                <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3 h-3" /> Why It Happened
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium">{whyHappened}</div>
                </div>

                <div className="p-3 bg-background/80 border border-border/60 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Pointers / Memory Reference Updates</div>
                  <div className="text-[11px] font-mono text-primary font-bold">{movedPointers}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual Canvas Workspace */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl min-h-[460px] flex flex-col justify-between relative overflow-hidden">
              
              <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[380px] relative">
                
                {/* 1. LINKED LIST CANVAS */}
                {activeTab === 'linked-list' && (
                  <div className="w-full flex flex-col items-center justify-center gap-8 my-auto">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {llNodes.map((node, idx) => {
                        const isReversingCurr = reversalMarkers?.curr === idx;
                        const isReversingPrev = reversalMarkers?.prev === idx;
                        const isReversingNext = reversalMarkers?.next === idx;

                        return (
                          <div key={node.id} className="flex items-center gap-3 relative">
                            {/* Marker Badges */}
                            {isReversingCurr && (
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-400 text-black font-black text-[9px] rounded-full uppercase shadow-md">
                                curr
                              </div>
                            )}
                            {isReversingPrev && (
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-400 text-white font-black text-[9px] rounded-full uppercase shadow-md">
                                prev
                              </div>
                            )}
                            {isReversingNext && (
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-400 text-white font-black text-[9px] rounded-full uppercase shadow-md">
                                next
                              </div>
                            )}

                            {/* Node Memory Block */}
                            <div className={`bg-background border-2 ${llActiveNodeId === node.id ? 'border-amber-400 animate-pulse' : 'border-primary/60'} rounded-2xl p-3 shadow-lg flex items-center gap-2 text-xs font-mono`}>
                              {(listType === 'doubly' || listType === 'circular-doubly') && (
                                <span className="px-2 py-1 bg-muted rounded-md text-[10px] text-muted-foreground font-bold">
                                  {idx === 0 ? (listType.includes('circular') ? 'tail' : 'null') : 'prev'}
                                </span>
                              )}
                              <span className="px-3 py-1 bg-primary/10 text-primary font-black text-sm rounded-lg">
                                {node.val}
                              </span>
                              <span className="px-2 py-1 bg-muted rounded-md text-[10px] text-muted-foreground font-bold">
                                {idx === llNodes.length - 1 ? (listType.includes('circular') ? 'head' : 'null') : 'next'}
                              </span>
                              <button onClick={() => handleLLDelete(node.id, node.val)} className="text-muted-foreground hover:text-rose-400 ml-1">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Pointer Arrow */}
                            {idx < llNodes.length - 1 && (
                              <div className="flex items-center text-primary">
                                <ArrowRight className="w-5 h-5 animate-pulse" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Circular List Curving Arrow Indicator */}
                    {listType.includes('circular') && llNodes.length > 1 && (
                      <div className="w-full max-w-md p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center text-xs font-mono text-purple-400 flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span>Curved Pointer: [Tail].next → [Head] ({llNodes[0]?.val})</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. BST HIERARCHICAL CANVAS */}
                {activeTab === 'bst' && (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <svg className="w-[600px] h-[320px] overflow-visible">
                      {renderBSTEdges(positionedBST)}
                      {renderBSTNodes(positionedBST)}
                    </svg>

                    {bstComparisons.length > 0 && (
                      <div className="mt-4 p-3 bg-background/90 border border-border/80 rounded-2xl text-xs font-mono text-amber-400 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>Traversal: {bstComparisons[bstComparisons.length - 1]}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. HEAP DUAL CANVAS (2D Tree + 1D Array) */}
                {activeTab === 'heap' && (
                  <div className="w-full space-y-8">
                    {/* 2D Heap Tree View */}
                    <div className="w-full flex flex-col items-center justify-center space-y-2">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">2D Heap Tree View</div>
                      <svg className="w-[560px] h-[220px] overflow-visible">
                        {heapArr.map((_, idx) => {
                          const leftIdx = 2 * idx + 1;
                          const rightIdx = 2 * idx + 2;
                          const pPos = getHeapNodePos(idx);
                          return (
                            <g key={`heap-lines-${idx}`}>
                              {leftIdx < heapArr.length && (
                                <line x1={pPos.x} y1={pPos.y} x2={getHeapNodePos(leftIdx).x} y2={getHeapNodePos(leftIdx).y} stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2.5" />
                              )}
                              {rightIdx < heapArr.length && (
                                <line x1={pPos.x} y1={pPos.y} x2={getHeapNodePos(rightIdx).x} y2={getHeapNodePos(rightIdx).y} stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2.5" />
                              )}
                            </g>
                          );
                        })}

                        {heapArr.map((val, idx) => {
                          const pos = getHeapNodePos(idx);
                          const isSwapping = heapSwappingIndices?.includes(idx);
                          return (
                            <g key={`heap-node-${idx}`}>
                              <circle
                                cx={pos.x}
                                cy={pos.y}
                                r="20"
                                className={`${isSwapping ? 'fill-amber-400 stroke-amber-300 animate-bounce' : 'fill-card stroke-purple-500'} stroke-2`}
                              />
                              <text x={pos.x} y={pos.y + 4} textAnchor="middle" className="text-xs font-black fill-foreground pointer-events-none">
                                {val}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Synchronous 1D Array Representation */}
                    <div className="w-full space-y-2 text-center border-t border-border/60 pt-4">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Synchronous 1D Heap Array Representation</div>
                      <div className="flex items-center justify-center gap-2 overflow-x-auto p-2">
                        {heapArr.map((val, idx) => {
                          const isSwapping = heapSwappingIndices?.includes(idx);
                          return (
                            <div key={idx} className={`px-4 py-2.5 ${isSwapping ? 'bg-amber-400/20 border-amber-400' : 'bg-background border-border'} border rounded-xl text-center font-mono shadow-sm`}>
                              <div className="text-sm font-black text-primary">{val}</div>
                              <div className="text-[10px] text-muted-foreground">[{idx}]</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TRIE PREFIX CANVAS */}
                {activeTab === 'trie' && (
                  <div className="w-full space-y-6 flex flex-col items-center justify-center my-auto">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trie Dictionary Words</div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {trieWords.map((w, idx) => (
                        <div key={idx} className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl text-xs font-mono font-bold uppercase flex items-center gap-2">
                          <span>{w}*</span>
                          <button onClick={() => handleTrieDelete(w)} className="hover:text-rose-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Trie Tree Graph Visualizer */}
                    <div className="p-6 bg-background/60 border border-border/80 rounded-3xl w-full max-w-xl text-center space-y-4">
                      <div className="text-xs font-bold text-primary uppercase">Prefix Tree Nodes</div>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary text-primary font-black text-xs flex items-center justify-center">
                          ROOT
                        </div>
                        {trieWords.map((word) => {
                          const isPathActive = trieActivePath.some(p => word.startsWith(p));
                          return (
                            <div key={word} className={`p-3 rounded-2xl border text-xs font-mono font-bold flex items-center gap-1.5 ${isPathActive ? 'bg-amber-400/20 border-amber-400 text-amber-400 animate-pulse' : 'bg-card border-border/80 text-foreground'}`}>
                              {word.toUpperCase()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Bottom Scrollable Operation Log History */}
            <div className="bg-card/90 border border-border/80 rounded-3xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-primary" /> Operation History Log
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">{operationLog.length} entries</span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1 font-mono text-[11px] text-muted-foreground">
                {operationLog.map((log, idx) => (
                  <div key={idx} className="hover:text-foreground">{log}</div>
                ))}
              </div>
            </div>

          </div>

        </section>

      </div>
    </WorkspaceLayout>
  );
};
