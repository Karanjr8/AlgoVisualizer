import { useState, useEffect, useCallback, useRef } from 'react';
import type { AlgorithmEventType, VisualizationFrame } from '../types/visualizer';
import type { LearningFocusMode } from '../store/useVisualizerStore';

const MILESTONE_EVENT_TYPES: AlgorithmEventType[] = [
  'INIT',
  'PASS_COMPLETE',
  'COMPLETE',
  'FOUND',
  'DIVIDE',
  'EXTRACT',
  'PIVOT',
];

function isMilestoneFrame(frame: VisualizationFrame | undefined): boolean {
  if (!frame) return false;
  if (frame.context?.isMilestone !== undefined) return frame.context.isMilestone;
  return MILESTONE_EVENT_TYPES.includes(frame.event.type);
}

export const useSimulation = (
  frames: VisualizationFrame[],
  speedMs: number,
  mode: LearningFocusMode,
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prevFrames, setPrevFrames] = useState(frames);
  const skipMilestonePauseRef = useRef(false);

  if (frames !== prevFrames) {
    setPrevFrames(frames);
    setCurrentIndex(0);
    setIsPlaying(false);
  }

  const nextStep = useCallback(() => {
    if (mode === 'execution') {
      setCurrentIndex((prev) => Math.min(prev + 1, frames.length - 1));
      return;
    }

    setCurrentIndex((prev) => {
      let nextIdx = prev + 1;
      while (nextIdx < frames.length - 1 && !isMilestoneFrame(frames[nextIdx])) {
        nextIdx++;
      }
      return Math.min(nextIdx, frames.length - 1);
    });
  }, [frames, mode]);

  const prevStep = useCallback(() => {
    if (mode === 'execution') {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    setCurrentIndex((prev) => {
      let prevIdx = prev - 1;
      if (prevIdx > 0 && isMilestoneFrame(frames[prevIdx])) prevIdx--;
      while (prevIdx > 0 && !isMilestoneFrame(frames[prevIdx])) {
        prevIdx--;
      }
      return Math.max(prevIdx, 0);
    });
  }, [frames, mode]);

  const play = useCallback(() => {
    skipMilestonePauseRef.current = true;
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= frames.length - 1) {
          setIsPlaying(false);
          return prev;
        }

        const next =
          mode === 'intuition'
            ? (() => {
                let nextIdx = prev + 1;
                while (nextIdx < frames.length - 1 && !isMilestoneFrame(frames[nextIdx])) {
                  nextIdx++;
                }
                return Math.min(nextIdx, frames.length - 1);
              })()
            : prev + 1;

        if (next >= frames.length - 1) {
          setIsPlaying(false);
        } else if (
          mode === 'intuition' &&
          isMilestoneFrame(frames[next]) &&
          !skipMilestonePauseRef.current
        ) {
          setIsPlaying(false);
        }

        skipMilestonePauseRef.current = false;
        return next;
      });
    }, speedMs);

    return () => clearInterval(timer);
  }, [isPlaying, speedMs, frames, mode]);

  return {
    currentFrame: frames[currentIndex] || null,
    currentIndex,
    totalFrames: frames.length,
    isPlaying,
    play,
    pause,
    nextStep,
    prevStep,
    reset,
    setCurrentIndex,
  };
};
