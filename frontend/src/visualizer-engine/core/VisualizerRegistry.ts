import { IVisualizerEngine, SupportedDataStructure } from '../types/core';
import { ArrayEngine } from '../engines/array/ArrayEngine';
import { LinkedListEngine } from '../engines/linked-list/LinkedListEngine';
import { StackQueueEngine } from '../engines/stack-queue/StackQueueEngine';
import { TreeEngine } from '../engines/tree/TreeEngine';
import { GraphEngine } from '../engines/graph/GraphEngine';
import { HashTableEngine } from '../engines/hash-table/HashTableEngine';
import { HeapEngine } from '../engines/heap/HeapEngine';
import { TrieEngine } from '../engines/trie/TrieEngine';
import { RecursionEngine } from '../engines/recursion/RecursionEngine';
import { DPEngine } from '../engines/dynamic-programming/DPEngine';
import { DSUEngine } from '../engines/disjoint-set/DSUEngine';
import { SegmentTreeEngine } from '../engines/segment-tree/SegmentTreeEngine';
import { FenwickTreeEngine } from '../engines/fenwick-tree/FenwickTreeEngine';

class VisualizerRegistry {
  private engines: Map<SupportedDataStructure, IVisualizerEngine> = new Map();
  private algorithmMap: Map<string, { structure: SupportedDataStructure; defaultOperation: string }> = new Map();

  constructor() {
    this.registerEngines();
    this.mapAlgorithms();
  }

  private registerEngines(): void {
    this.engines.set('array', new ArrayEngine());
    this.engines.set('linked-list', new LinkedListEngine());
    this.engines.set('stack-queue', new StackQueueEngine());
    this.engines.set('tree', new TreeEngine());
    this.engines.set('graph', new GraphEngine());
    this.engines.set('hash-table', new HashTableEngine());
    this.engines.set('heap', new HeapEngine());
    this.engines.set('trie', new TrieEngine());
    this.engines.set('recursion', new RecursionEngine());
    this.engines.set('dynamic-programming', new DPEngine());
    this.engines.set('disjoint-set', new DSUEngine());
    this.engines.set('segment-tree', new SegmentTreeEngine());
    this.engines.set('fenwick-tree', new FenwickTreeEngine());
  }

  private mapAlgorithms(): void {
    // Array, Sorting, Searching
    const arrayAlgos = [
      { id: 'bubble', op: 'bubble-sort' },
      { id: 'selection', op: 'selection-sort' },
      { id: 'insertion', op: 'insertion-sort' },
      { id: 'linear-search', op: 'search-linear' },
      { id: 'binary-search', op: 'search-binary' },
      { id: 'first-occurrence', op: 'search-binary' },
      { id: 'last-occurrence', op: 'search-binary' },
      { id: 'search-insert-position', op: 'search-binary' },
      { id: 'jump-search', op: 'search-linear' },
      { id: 'interpolation-search', op: 'search-binary' },
      { id: 'exponential-search', op: 'search-binary' },
      { id: 'array-traversal', op: 'traverse' },
    ];
    arrayAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'array', defaultOperation: a.op }));

    // Linked List
    const llAlgos = [
      { id: 'singly-linked-list', op: 'traverse' },
      { id: 'doubly-linked-list', op: 'traverse' },
      { id: 'circular-linked-list', op: 'traverse' },
      { id: 'll-insertions', op: 'insert-head' },
      { id: 'll-deletions', op: 'delete-head' },
      { id: 'll-reversal', op: 'reverse' },
      { id: 'll-detect-cycle', op: 'slow-fast-pointers' },
      { id: 'll-middle-node', op: 'slow-fast-pointers' },
      { id: 'linked-list', op: 'traverse' },
    ];
    llAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'linked-list', defaultOperation: a.op }));

    // Stack & Queue
    const sqAlgos = [
      { id: 'stack', op: 'push' },
      { id: 'queue', op: 'enqueue' },
      { id: 'circular-queue', op: 'circular-enqueue' },
      { id: 'deque', op: 'deque-push-front' },
    ];
    sqAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'stack-queue', defaultOperation: a.op }));

    // Trees & BST & AVL
    const treeAlgos = [
      { id: 'binary-tree', op: 'explore-tree' },
      { id: 'tree-types', op: 'show-types' },
      { id: 'bst', op: 'search' },
      { id: 'bst-search', op: 'search' },
      { id: 'bst-insert', op: 'insert' },
      { id: 'bst-delete', op: 'delete' },
      { id: 'avl-tree', op: 'avl-balance' },
      { id: 'morris-traversal', op: 'morris-traversal' },
      { id: 'lca', op: 'find-lca' },
      { id: 'tree-diameter', op: 'tree-diameter' },
      { id: 'balanced-tree', op: 'check-balance' },
      { id: 'tree-views', op: 'tree-views' },
      { id: 'serialize-tree', op: 'serialize' },
      { id: 'deserialize-tree', op: 'deserialize' },
      { id: 'tree-inorder', op: 'inorder' },
      { id: 'tree-preorder', op: 'preorder' },
      { id: 'tree-postorder', op: 'postorder' },
      { id: 'tree-levelorder', op: 'levelorder' },
      { id: 'tree-traversal', op: 'inorder' },
      { id: 'dfs-tree', op: 'preorder' },
      { id: 'height-of-tree', op: 'check-balance' },
    ];
    treeAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'tree', defaultOperation: a.op }));

    // Graphs
    const graphAlgos = [
      { id: 'graph-representation', op: 'bfs' },
      { id: 'bfs', op: 'bfs' },
      { id: 'dfs', op: 'dfs' },
      { id: 'dijkstra', op: 'dijkstra' },
      { id: 'prim', op: 'prim' },
      { id: 'topological-sort', op: 'topological-sort' },
      { id: 'cycle-detection', op: 'cycle-detection' },
    ];
    graphAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'graph', defaultOperation: a.op }));

    // Hash Table
    const hashAlgos = [
      { id: 'hash-table', op: 'put' },
      { id: 'hash-map', op: 'put' },
      { id: 'separate-chaining', op: 'set-method-chaining' },
      { id: 'open-addressing', op: 'set-method-linear' },
    ];
    hashAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'hash-table', defaultOperation: a.op }));

    // Heap
    const heapAlgos = [
      { id: 'heap', op: 'extract' },
      { id: 'heap-intro', op: 'insert' },
      { id: 'kth-largest', op: 'insert' },
      { id: 'min-max-heap', op: 'toggle-min-max' },
    ];
    heapAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'heap', defaultOperation: a.op }));

    // Trie
    const trieAlgos = [
      { id: 'trie', op: 'search' },
      { id: 'trie-intro', op: 'insert' },
      { id: 'trie-insert', op: 'insert' },
      { id: 'trie-search', op: 'search' },
      { id: 'trie-prefix-search', op: 'prefix-search' },
    ];
    trieAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'trie', defaultOperation: a.op }));

    // Recursion & Backtracking
    const recAlgos = [
      { id: 'factorial', op: 'factorial' },
      { id: 'fibonacci', op: 'fibonacci' },
      { id: 'tower-of-hanoi', op: 'tower-of-hanoi' },
      { id: 'n-queens', op: 'n-queens' },
    ];
    recAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'recursion', defaultOperation: a.op }));

    // Dynamic Programming
    const dpAlgos = [
      { id: 'dp-intro', op: 'climbing-stairs' },
      { id: 'climbing-stairs', op: 'climbing-stairs' },
      { id: 'fibonacci-dp', op: 'fibonacci-dp' },
      { id: '01-knapsack', op: '01-knapsack' },
      { id: 'coin-change', op: 'coin-change' },
      { id: 'lcs', op: 'lcs' },
    ];
    dpAlgos.forEach((a) => this.algorithmMap.set(a.id, { structure: 'dynamic-programming', defaultOperation: a.op }));

    // Disjoint Set (DSU)
    this.algorithmMap.set('disjoint-set', { structure: 'disjoint-set', defaultOperation: 'union' });
    this.algorithmMap.set('union-find', { structure: 'disjoint-set', defaultOperation: 'union' });

    // Segment Tree
    this.algorithmMap.set('segment-tree-intro', { structure: 'segment-tree', defaultOperation: 'range-query' });
    this.algorithmMap.set('segment-tree', { structure: 'segment-tree', defaultOperation: 'range-query' });

    // Fenwick Tree (BIT)
    this.algorithmMap.set('fenwick-tree-intro', { structure: 'fenwick-tree', defaultOperation: 'prefix-query' });
    this.algorithmMap.set('binary-indexed-tree', { structure: 'fenwick-tree', defaultOperation: 'prefix-query' });
  }

  public getEngine(structure: SupportedDataStructure): IVisualizerEngine {
    const engine = this.engines.get(structure);
    if (!engine) {
      throw new Error(`Visualizer engine for "${structure}" is not registered.`);
    }
    return engine;
  }

  public getEngineForAlgorithm(algoId: string): { engine: IVisualizerEngine; defaultOperation: string; structure: SupportedDataStructure } {
    const mapping = this.algorithmMap.get(algoId);
    if (mapping) {
      return {
        engine: this.getEngine(mapping.structure),
        defaultOperation: mapping.defaultOperation,
        structure: mapping.structure,
      };
    }

    // Default fallback to array engine
    return {
      engine: this.getEngine('array'),
      defaultOperation: 'traverse',
      structure: 'array',
    };
  }

  public getAllEngines(): IVisualizerEngine[] {
    return Array.from(this.engines.values());
  }
}

export const visualizerRegistry = new VisualizerRegistry();
