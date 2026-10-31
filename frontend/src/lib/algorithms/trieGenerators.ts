import type { VisualizationFrame, TrieVisualNode, TrieVisualEdge, TrieState } from '../../types/visualizer';

interface TreeNodeBuild {
  id: string;
  char: string;
  isEnd: boolean;
  depth: number;
  parentId?: string;
  children: Record<string, TreeNodeBuild>;
}

function computeTrieLayout(root: TreeNodeBuild): { nodes: TrieVisualNode[]; edges: TrieVisualEdge[] } {
  const nodes: TrieVisualNode[] = [];
  const edges: TrieVisualEdge[] = [];

  const traverse = (node: TreeNodeBuild, xOffset: number, span: number) => {
    const keys = Object.keys(node.children);
    const y = 50 + node.depth * 65;

    nodes.push({
      id: node.id,
      char: node.char,
      isEnd: node.isEnd,
      state: 'normal',
      depth: node.depth,
      x: xOffset,
      y,
      parentId: node.parentId
    });

    const numChildren = keys.length;
    keys.forEach((key, idx) => {
      const childSpan = span / Math.max(1, numChildren);
      const childX = xOffset - span / 2 + childSpan * (idx + 0.5);

      const child = node.children[key];
      edges.push({
        from: node.id,
        to: child.id,
        char: child.char,
        state: 'normal'
      });

      traverse(child, childX, childSpan);
    });
  };

  traverse(root, 340, 480);
  return { nodes, edges };
}

function pushTrieFrame(
  frames: VisualizationFrame[],
  trieState: TrieState,
  eventType: any,
  explanation: string
) {
  frames.push({
    elements: [],
    event: { type: eventType, explanation },
    trieState: JSON.parse(JSON.stringify(trieState))
  });
}

export function generateGenericTrieFrames(title: string): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];

  const treeRoot: TreeNodeBuild = {
    id: 'root',
    char: 'ROOT',
    isEnd: false,
    depth: 0,
    children: {}
  };

  const getSnapshot = (
    activePath: string[] = [],
    actionText: string = '',
    explanationText: string = '',
    searchResult: TrieState['searchResult'] = null
  ): TrieState => {
    const layout = computeTrieLayout(treeRoot);
    layout.nodes.forEach(n => {
      if (activePath.includes(n.id)) {
        if (searchResult?.found === false && n.id === activePath[activePath.length - 1]) {
          n.state = 'failed';
        } else if (searchResult?.found === true && n.id === activePath[activePath.length - 1]) {
          n.state = 'terminal';
        } else {
          n.state = 'current';
        }
      } else if (n.isEnd) {
        n.state = 'terminal';
      }
    });

    layout.edges.forEach(e => {
      if (activePath.includes(e.from) && activePath.includes(e.to)) {
        e.state = 'active';
      }
    });

    return {
      nodes: layout.nodes,
      edges: layout.edges,
      activePath,
      actionText,
      explanationText,
      searchResult
    };
  };

  // STEP 1 — INIT
  pushTrieFrame(
    frames,
    getSnapshot(['root'], `Trie Initialization`, `Initialized empty Trie with Root node. Ready to demonstrate ${title}.`),
    'INIT',
    `Initial Trie Root node created.`
  );

  // STEP 2 — Insert "CAT"
  treeRoot.children['c'] = { id: 'c-1', char: 'c', isEnd: false, depth: 1, parentId: 'root', children: {} };
  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1'], `Insert "CAT": Created character node 'c'`, `Inserting "CAT" (Character 1/3): Created root → c branch.`),
    'INSERT',
    `Created node 'c' at depth 1.`
  );

  treeRoot.children['c'].children['a'] = { id: 'a-1', char: 'a', isEnd: false, depth: 2, parentId: 'c-1', children: {} };
  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1'], `Insert "CAT": Extended path to character 'a'`, `Inserting "CAT" (Character 2/3): Grown edge c → a.`),
    'INSERT',
    `Created node 'a' at depth 2.`
  );

  treeRoot.children['c'].children['a'].children['t'] = { id: 't-1', char: 't', isEnd: true, depth: 3, parentId: 'a-1', children: {} };
  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1', 't-1'], `Insert "CAT": Created terminal node 't'`, `Inserting "CAT" (Character 3/3): Created terminal node 't'. Marked isEndOfWord = true (Gold Ring).`),
    'INSERT',
    `Completed word "CAT"! Marked 't' as terminal.`
  );

  // STEP 3 — Insert "CAR" (Prefix Sharing Demonstration)
  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1'], `Insert "CAR": Inspecting prefix "ca"`, `Prefix Reuse: "ca" already exists in Trie! Reusing path root → c → a without creating duplicate nodes.`),
    'CHECK_CONDITION',
    `Reusing existing prefix path "ca".`
  );

  treeRoot.children['c'].children['a'].children['r'] = { id: 'r-1', char: 'r', isEnd: true, depth: 3, parentId: 'a-1', children: {} };
  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1', 'r-1'], `Insert "CAR": Branched new character 'r' from 'a'`, `Branched from shared node 'a' to create new child 'r'. Marked 'r' as terminal node for "CAR".`),
    'INSERT',
    `Completed word "CAR"! Shared prefix "ca" with "CAT".`
  );

  // STEP 4 — Insert "CARE"
  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1', 'r-1'], `Insert "CARE": Reusing prefix "car"`, `Reusing path root → c → a → r for "CARE".`),
    'CHECK_CONDITION',
    `Reusing path "car".`
  );

  treeRoot.children['c'].children['a'].children['r'].children['e'] = { id: 'e-1', char: 'e', isEnd: true, depth: 4, parentId: 'r-1', children: {} };
  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1', 'r-1', 'e-1'], `Insert "CARE": Extended path to 'e'`, `Extended path r → e. Marked 'e' as terminal node for "CARE".`),
    'INSERT',
    `Completed word "CARE"!`
  );

  // STEP 5 — Insert "DOG"
  treeRoot.children['d'] = { id: 'd-1', char: 'd', isEnd: false, depth: 1, parentId: 'root', children: {} };
  treeRoot.children['d'].children['o'] = { id: 'o-1', char: 'o', isEnd: false, depth: 2, parentId: 'd-1', children: {} };
  treeRoot.children['d'].children['o'].children['g'] = { id: 'g-1', char: 'g', isEnd: true, depth: 3, parentId: 'o-1', children: {} };

  pushTrieFrame(
    frames,
    getSnapshot(['root', 'd-1', 'o-1', 'g-1'], `Insert "DOG": Created new root branch root → d → o → g`, `Created independent branch root → d → o → g. Marked 'g' as terminal node.`),
    'INSERT',
    `Completed word "DOG"!`
  );

  // STEP 6 — Search Demonstration: Search "CAR"
  pushTrieFrame(
    frames,
    getSnapshot(['root'], `Search "CAR": Starting at Root`, `Exact Search ("CAR"): Initiating search from Root.`),
    'SEARCH',
    `Searching for "CAR"...`
  );

  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1', 'r-1'], `Search "CAR": Matched path root → c → a → r`, `Traversed path root → c → a → r. Checking if node 'r' is terminal...`),
    'SEARCH',
    `Matched characters 'c', 'a', 'r'.`
  );

  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1', 'r-1'], `Search "CAR": EXACT MATCH FOUND!`, `Node 'r' has isEndOfWord = true. Search for "CAR" SUCCESSFUL!`, { found: true, type: 'exact' }),
    'FOUND',
    `Exact Match Found for "CAR"!`
  );

  // STEP 7 — Prefix Search Demonstration: startsWith("CA")
  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1'], `Prefix Search "CA": Matched root → c → a`, `Prefix Search ("CA"): Matched characters 'c' and 'a'. Subtree exists!`, { found: true, type: 'prefix' }),
    'FOUND',
    `Prefix "CA" Found in Trie!`
  );

  // STEP 8 — Delete Demonstration: Delete "CAT"
  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1', 't-1'], `Delete "CAT": Locating node 't'`, `Deletion ("CAT"): Located node 't'. Removing terminal marker...`),
    'SELECT',
    `Locating node 't' for deletion.`
  );

  // Unmark terminal
  treeRoot.children['c'].children['a'].children['t'].isEnd = false;
  // Delete node 't' from tree
  delete treeRoot.children['c'].children['a'].children['t'];

  pushTrieFrame(
    frames,
    getSnapshot(['root', 'c-1', 'a-1'], `Delete "CAT": Pruned leaf node 't'`, `Pruned node 't' (no children). Retained shared prefix "ca" for "CAR" and "CARE".`),
    'ELIMINATE',
    `Deleted node 't'. Shared prefix "ca" preserved for other words!`
  );

  // COMPLETE
  pushTrieFrame(
    frames,
    getSnapshot([], `Trie Operations Complete`, `Trie visualizer finished. All node creations, prefix sharing, searches, and deletions fully demonstrated.`),
    'COMPLETE',
    `Trie operations complete!`
  );

  return frames;
}
