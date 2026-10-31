/**
 * Core types for the modular AlgoVis Visualizer Engine.
 * Shared playback, execution, snapshot, and event contracts.
 */

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface ExecutionEvent {
  id: string;
  type: string;
  description: string;
  targetIds?: string[];
  highlightLine?: number;
  metadata?: Record<string, any>;
}

export interface TimelineSnapshot<TState = any> {
  stepIndex: number;
  totalSteps: number;
  event: ExecutionEvent;
  state: TState;
  explanation: string;
  pseudocodeLine?: number;
  timeComplexitySnapshot?: string;
  spaceComplexitySnapshot?: string;
}

export interface PlaybackOptions {
  speed: number; // in milliseconds per step (e.g., 200 - 2000ms)
  loop?: boolean;
  onStepChange?: (snapshot: TimelineSnapshot) => void;
  onStatusChange?: (status: PlaybackStatus) => void;
}

export type SupportedDataStructure =
  | 'array'
  | 'linked-list'
  | 'stack-queue'
  | 'tree'
  | 'graph'
  | 'hash-table'
  | 'heap'
  | 'trie'
  | 'recursion'
  | 'dynamic-programming'
  | 'disjoint-set'
  | 'segment-tree'
  | 'fenwick-tree';

export interface EngineMeta {
  id: string;
  name: string;
  dataStructure: SupportedDataStructure;
  category: string;
  supportedOperations: string[];
  defaultInput?: any;
}

export interface IVisualizerEngine<TState = any> {
  meta: EngineMeta;
  generateInitialState(input?: any): TState;
  executeOperation(operation: string, params: any, currentState: TState): TimelineSnapshot<TState>[];
}
