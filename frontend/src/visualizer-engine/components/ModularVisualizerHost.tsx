import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { visualizerRegistry } from '../core/VisualizerRegistry';
import { ExecutionTimeline } from '../core/ExecutionTimeline';
import { PlaybackController } from '../core/PlaybackController';
import { EventDispatcher } from '../core/EventDispatcher';
import { TimelineSnapshot, PlaybackStatus } from '../types/core';

// Renderers
import { ArrayVisualizerRenderer } from '../renderers/ArrayVisualizerRenderer';
import { LinkedListVisualizerRenderer } from '../renderers/LinkedListVisualizerRenderer';
import { StackQueueVisualizerRenderer } from '../renderers/StackQueueVisualizerRenderer';
import { TreeVisualizerRenderer } from '../renderers/TreeVisualizerRenderer';
import { GraphVisualizerRenderer } from '../renderers/GraphVisualizerRenderer';
import { HashTableVisualizerRenderer } from '../renderers/HashTableVisualizerRenderer';
import { HeapVisualizerRenderer } from '../renderers/HeapVisualizerRenderer';
import { TrieVisualizerRenderer } from '../renderers/TrieVisualizerRenderer';
import { RecursionVisualizerRenderer } from '../renderers/RecursionVisualizerRenderer';
import { DPVisualizerRenderer } from '../renderers/DPVisualizerRenderer';
import { DSUVisualizerRenderer } from '../renderers/DSUVisualizerRenderer';
import { SegmentTreeVisualizerRenderer } from '../renderers/SegmentTreeVisualizerRenderer';
import { FenwickTreeVisualizerRenderer } from '../renderers/FenwickTreeVisualizerRenderer';

// Icons
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  algorithmId?: string;
  initialAlgorithm?: string;
  customInitialInput?: any;
}

export const ModularVisualizerHost: React.FC<Props> = ({ algorithmId, initialAlgorithm, customInitialInput }) => {
  const activeAlgoId = algorithmId || initialAlgorithm || 'bubble';

  // 1. Resolve Engine
  const { engine, defaultOperation, structure } = useMemo(
    () => visualizerRegistry.getEngineForAlgorithm(activeAlgoId),
    [activeAlgoId]
  );

  // 2. Local State
  const [activeOp, setActiveOp] = useState<string>(defaultOperation);
  const [opParams, setOpParams] = useState<Record<string, any>>({});
  const [currentSnapshot, setCurrentSnapshot] = useState<TimelineSnapshot | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [speedMs, setSpeedMs] = useState<number>(600);

  // 3. Infrastructure references
  const timelineRef = useRef<ExecutionTimeline>(new ExecutionTimeline());
  const dispatcherRef = useRef<EventDispatcher>(new EventDispatcher());
  const controllerRef = useRef<PlaybackController>(
    new PlaybackController(timelineRef.current, dispatcherRef.current)
  );

  // 4. Initialize and run algorithm operation
  const runOperation = useCallback(
    (opName: string, params: Record<string, any> = {}) => {
      controllerRef.current.pause();

      const initialState = engine.generateInitialState(customInitialInput);
      const snapshots = engine.executeOperation(opName, params, initialState);

      timelineRef.current.setSnapshots(snapshots);
      const initialSnap = timelineRef.current.getCurrentSnapshot();
      setCurrentSnapshot(initialSnap);
      setActiveOp(opName);
      setPlaybackStatus('idle');
    },
    [engine, customInitialInput]
  );

  useEffect(() => {
    // Subscribe to dispatcher events
    const unsubStep = dispatcherRef.current.on('stepChanged', (snap: TimelineSnapshot) => {
      setCurrentSnapshot(snap);
    });
    const unsubStatus = dispatcherRef.current.on('statusChanged', (status: PlaybackStatus) => {
      setPlaybackStatus(status);
    });

    runOperation(defaultOperation, opParams);

    return () => {
      unsubStep();
      unsubStatus();
      controllerRef.current.destroy();
    };
  }, [activeAlgoId, defaultOperation, runOperation]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    controllerRef.current.seek(idx);
  };

  // 5. Select appropriate renderer based on structure
  const renderDataStructure = () => {
    if (!currentSnapshot) {
      return <div className="py-20 text-muted-foreground font-mono text-sm">Initializing visualizer...</div>;
    }

    const state = currentSnapshot.state;

    switch (structure) {
      case 'array':
        return <ArrayVisualizerRenderer state={state} />;
      case 'linked-list':
        return <LinkedListVisualizerRenderer state={state} />;
      case 'stack-queue':
        return <StackQueueVisualizerRenderer state={state} />;
      case 'tree':
        return <TreeVisualizerRenderer state={state} />;
      case 'graph':
        return <GraphVisualizerRenderer state={state} />;
      case 'hash-table':
        return <HashTableVisualizerRenderer state={state} />;
      case 'heap':
        return <HeapVisualizerRenderer state={state} />;
      case 'trie':
        return <TrieVisualizerRenderer state={state} />;
      case 'recursion':
        return <RecursionVisualizerRenderer state={state} />;
      case 'dynamic-programming':
        return <DPVisualizerRenderer state={state} />;
      case 'disjoint-set':
        return <DSUVisualizerRenderer state={state} />;
      case 'segment-tree':
        return <SegmentTreeVisualizerRenderer state={state} />;
      case 'fenwick-tree':
        return <FenwickTreeVisualizerRenderer state={state} />;
      default:
        return <ArrayVisualizerRenderer state={state} />;
    }
  };

  const totalSteps = timelineRef.current.getTotalSteps();
  const currentStep = timelineRef.current.getCurrentIndex();

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* 1. Specialized Interactive Operations Bar */}
      <div className="w-full bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mr-1 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Operations:
          </span>

          {engine.meta.supportedOperations.map((op) => {
            const isActive = activeOp === op;
            return (
              <button
                key={op}
                onClick={() => runOperation(op, opParams)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                    : 'bg-background/60 border-border/70 text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                {op.replace(/-/g, ' ')}
              </button>
            );
          })}
        </div>

        {/* Input Parameters if needed */}
        {(structure === 'array' || structure === 'linked-list' || structure === 'stack-queue' || structure === 'tree' || structure === 'hash-table') && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={structure === 'hash-table' ? 'key or value' : 'Value (e.g. 42)'}
              value={opParams.value ?? opParams.target ?? ''}
              onChange={(e) => setOpParams({ ...opParams, value: e.target.value, target: e.target.value })}
              className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-mono w-32 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={() => runOperation(activeOp, opParams)}
              className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Execute
            </button>
          </div>
        )}
      </div>

      {/* 2. Primary Authentic Visualizer Canvas */}
      <div className="w-full min-h-[300px] flex items-center justify-center p-2 sm:p-4 relative">
        {renderDataStructure()}
      </div>

      {/* 3. Universal Modular Playback Navigation & Timeline Bar */}
      <div className="w-full bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        {/* Progress Slider */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs font-mono font-bold text-muted-foreground w-12 text-left">
            {currentStep + 1} / {Math.max(1, totalSteps)}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={handleSeek}
            className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-xs font-mono font-semibold text-muted-foreground">
            {totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0}%
          </span>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Left: Step Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => controllerRef.current.reset()}
              title="Reset"
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => controllerRef.current.stepBackward()}
              title="Previous Step"
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => controllerRef.current.togglePlay()}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-primary/20 hover:brightness-110 transition-all cursor-pointer"
            >
              {playbackStatus === 'playing' ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </>
              )}
            </button>
            <button
              onClick={() => controllerRef.current.stepForward()}
              title="Next Step"
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Speed Slider */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <Sliders className="w-3.5 h-3.5" />
              <span>Speed:</span>
            </div>
            <input
              type="range"
              min={100}
              max={1500}
              step={50}
              value={1600 - speedMs}
              onChange={(e) => {
                const inverted = 1600 - Number(e.target.value);
                setSpeedMs(inverted);
                controllerRef.current.setSpeed(inverted);
              }}
              className="w-24 sm:w-28 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs font-mono font-bold text-foreground w-12 text-right">
              {(1000 / speedMs).toFixed(1)}x
            </span>
          </div>
        </div>
      </div>

      {/* 4. Live Synchronized Operation Explanation */}
      {currentSnapshot && (
        <div className="w-full bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-4 sm:p-5 shadow-md flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1 text-left min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/15 text-primary uppercase">
                {currentSnapshot.event.type}
              </span>
              <span className="text-sm font-bold text-foreground truncate">
                {currentSnapshot.event.description}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {currentSnapshot.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
