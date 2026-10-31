import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { TrieVisualizerState, TrieNode } from '../../types/ds-states';

export class TrieEngine implements IVisualizerEngine<TrieVisualizerState> {
  public meta: EngineMeta = {
    id: 'trie-engine',
    name: 'Trie (Prefix Tree) Engine',
    dataStructure: 'trie',
    category: 'Tree Structures & Strings',
    supportedOperations: ['insert', 'search', 'prefix-search', 'delete', 'clear'],
    defaultInput: ['cat', 'car', 'cart', 'dog'],
  };

  public generateInitialState(input?: string[]): TrieVisualizerState {
    const rawWords = Array.isArray(input) && input.length > 0 ? input : this.meta.defaultInput;
    const root: TrieNode = {
      id: 'root',
      char: 'ROOT',
      isEndOfWord: false,
      children: {},
      state: 'default',
      depth: 0,
    };

    const nodes: Record<string, TrieNode> = { root };

    for (const word of rawWords) {
      let curr = 'root';
      for (let i = 0; i < word.length; i++) {
        const char = word[i].toLowerCase();
        if (!nodes[curr].children[char]) {
          const childId = `trie-${curr}-${char}`;
          nodes[childId] = {
            id: childId,
            char,
            isEndOfWord: i === word.length - 1,
            children: {},
            state: 'default',
            depth: nodes[curr].depth + 1,
          };
          nodes[curr].children[char] = childId;
        } else if (i === word.length - 1) {
          nodes[nodes[curr].children[char]].isEndOfWord = true;
        }
        curr = nodes[curr].children[char];
      }
    }

    return {
      nodes,
      rootId: 'root',
      currentSearchPrefix: '',
      matchedWords: [...rawWords],
      message: `Trie initialized with ${rawWords.length} words: [${rawWords.join(', ')}].`,
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: TrieVisualizerState
  ): TimelineSnapshot<TrieVisualizerState>[] {
    switch (operation) {
      case 'insert':
        return this.runInsert(currentState, String(params.word ?? 'care'));
      case 'search':
        return this.runSearch(currentState, String(params.word ?? 'cart'));
      case 'prefix-search':
        return this.runPrefixSearch(currentState, String(params.prefix ?? 'ca'));
      case 'delete':
        return this.runDelete(currentState, String(params.word ?? 'cat'));
      case 'clear':
        return [
          {
            stepIndex: 0,
            totalSteps: 1,
            event: { id: 'clear', type: 'CLEAR', description: 'Reset Trie' },
            state: this.generateInitialState([]),
            explanation: 'Cleared all nodes in Trie.',
            pseudocodeLine: 1,
          },
        ];
      default:
        return this.runSearch(currentState, 'car');
    }
  }

  // ================= INSERT =================
  private runInsert(state: TrieVisualizerState, word: string): TimelineSnapshot<TrieVisualizerState>[] {
    const snapshots: TimelineSnapshot<TrieVisualizerState>[] = [];
    const cleanWord = word.toLowerCase().trim();
    if (!cleanWord) return [];

    const nodes: Record<string, TrieNode> = JSON.parse(JSON.stringify(state.nodes));
    let curr = 'root';

    snapshots.push({
      stepIndex: 0,
      totalSteps: cleanWord.length + 2,
      event: { id: 'ins-init', type: 'INSERT_INIT', description: `Inserting word "${cleanWord}"` },
      state: { ...state, message: `Start inserting "${cleanWord}" from ROOT.` },
      explanation: 'Trie insertion traces or creates nodes character by character.',
      pseudocodeLine: 1,
    });

    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      const isEnd = i === cleanWord.length - 1;

      if (!nodes[curr].children[char]) {
        const childId = `trie-${curr}-${char}`;
        nodes[childId] = {
          id: childId,
          char,
          isEndOfWord: isEnd,
          children: {},
          state: 'inserted',
          depth: nodes[curr].depth + 1,
        };
        nodes[curr].children[char] = childId;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: cleanWord.length + 2,
          event: { id: `create-${char}`, type: 'CREATE_NODE', description: `Created new node '${char}'` },
          state: {
            ...state,
            nodes: JSON.parse(JSON.stringify(nodes)),
            message: `Created new node for character '${char}'. Linked from node '${nodes[curr].char}'.`,
          },
          explanation: `Child branch for '${char}' did not exist. Created new TrieNode.`,
          pseudocodeLine: 2,
        });

        curr = childId;
      } else {
        curr = nodes[curr].children[char];
        if (isEnd) nodes[curr].isEndOfWord = true;

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: cleanWord.length + 2,
          event: { id: `traverse-${char}`, type: 'TRAVERSE_CHAR', description: `Shared prefix '${char}' found` },
          state: {
            ...state,
            nodes: JSON.parse(JSON.stringify(nodes)),
            message: `Character '${char}' already exists. Reusing prefix branch.`,
          },
          explanation: `Prefix sharing: Tries share common prefixes among words to save space.`,
          pseudocodeLine: 3,
        });
      }
    }

    nodes[curr].state = 'end-of-word';
    const updatedWords = Array.from(new Set([...state.matchedWords, cleanWord]));

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'ins-complete', type: 'INSERT_COMPLETE', description: `Marked end of word for "${cleanWord}"` },
      state: {
        ...state,
        nodes,
        matchedWords: updatedWords,
        message: `Word "${cleanWord}" successfully inserted into Trie! Marked isEndOfWord = true.`,
      },
      explanation: 'Insertion completed in O(L) time, where L is word length.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  // ================= SEARCH =================
  private runSearch(state: TrieVisualizerState, word: string): TimelineSnapshot<TrieVisualizerState>[] {
    const snapshots: TimelineSnapshot<TrieVisualizerState>[] = [];
    const cleanWord = word.toLowerCase().trim();
    let curr = 'root';
    let found = true;

    snapshots.push({
      stepIndex: 0,
      totalSteps: cleanWord.length + 2,
      event: { id: 'search-init', type: 'SEARCH_INIT', description: `Searching for word "${cleanWord}"` },
      state: { ...state, message: `Searching Trie for full word "${cleanWord}"...` },
      explanation: 'Search walks from root, checking for each character child sequentially.',
      pseudocodeLine: 1,
    });

    for (let i = 0; i < cleanWord.length; i++) {
      const char = cleanWord[i];
      const childId = state.nodes[curr]?.children[char];

      if (!childId) {
        found = false;
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: snapshots.length + 1,
          event: { id: `miss-${char}`, type: 'CHAR_NOT_FOUND', description: `Branch for '${char}' does not exist` },
          state: { ...state, message: `Character '${char}' not found after prefix "${cleanWord.slice(0, i)}". Word does not exist.` },
          explanation: 'Missing character branch terminates search in failure: false.',
          pseudocodeLine: 2,
        });
        break;
      }

      const activeNodes: Record<string, TrieNode> = JSON.parse(JSON.stringify(state.nodes));
      activeNodes[childId].state = 'matched';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: cleanWord.length + 2,
        event: { id: `match-${char}`, type: 'CHAR_MATCH', description: `Matched '${char}'` },
        state: {
          ...state,
          nodes: activeNodes,
          message: `Matched character '${char}' at depth ${i + 1}.`,
        },
        explanation: `Node for '${char}' exists. Advance to next character.`,
        pseudocodeLine: 3,
      });

      curr = childId;
    }

    if (found) {
      const isWord = state.nodes[curr]?.isEndOfWord;
      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: snapshots.length + 1,
        event: { id: 'search-result', type: isWord ? 'WORD_FOUND' : 'PREFIX_ONLY', description: isWord ? 'Word Found' : 'Prefix only' },
        state: {
          ...state,
          message: isWord
            ? `Word "${cleanWord}" found in Trie! (isEndOfWord == true).`
            : `Prefix "${cleanWord}" exists, but it is NOT marked as a complete word.`,
        },
        explanation: isWord ? 'All characters matched and node has isEndOfWord set.' : 'Prefix exists but isEndOfWord is false.',
        pseudocodeLine: 4,
      });
    }

    return snapshots;
  }

  // ================= PREFIX SEARCH (STARTS WITH) =================
  private runPrefixSearch(state: TrieVisualizerState, prefix: string): TimelineSnapshot<TrieVisualizerState>[] {
    const snapshots: TimelineSnapshot<TrieVisualizerState>[] = [];
    const cleanPrefix = prefix.toLowerCase().trim();
    let curr = 'root';
    let exists = true;

    for (let i = 0; i < cleanPrefix.length; i++) {
      const char = cleanPrefix[i];
      const childId = state.nodes[curr]?.children[char];
      if (!childId) {
        exists = false;
        break;
      }
      curr = childId;
    }

    const matchingWords = exists
      ? state.matchedWords.filter((w) => w.startsWith(cleanPrefix))
      : [];

    snapshots.push({
      stepIndex: 0,
      totalSteps: 1,
      event: { id: 'prefix-res', type: 'PREFIX_SEARCH', description: `Prefix "${cleanPrefix}"` },
      state: {
        ...state,
        currentSearchPrefix: cleanPrefix,
        message: exists
          ? `Prefix "${cleanPrefix}" found! Matching autocomplete words: [${matchingWords.join(', ')}].`
          : `Prefix "${cleanPrefix}" does not exist in Trie.`,
      },
      explanation: 'Autocomplete & prefix matching inspects subtrees under prefix endpoint in O(P) time.',
      pseudocodeLine: 2,
    });

    return snapshots;
  }

  // ================= DELETE WORD =================
  private runDelete(state: TrieVisualizerState, word: string): TimelineSnapshot<TrieVisualizerState>[] {
    const cleanWord = word.toLowerCase().trim();
    const updatedWords = state.matchedWords.filter((w) => w !== cleanWord);
    const fresh = this.generateInitialState(updatedWords);

    return [
      {
        stepIndex: 0,
        totalSteps: 1,
        event: { id: 'del-word', type: 'DELETE_WORD', description: `Deleted "${cleanWord}"` },
        state: { ...fresh, message: `Deleted word "${cleanWord}" from Trie.` },
        explanation: 'Word removed and unshared branch pruned.',
        pseudocodeLine: 1,
      },
    ];
  }
}
