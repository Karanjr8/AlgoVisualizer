import { create } from 'zustand';
import type { AlgorithmType, VisualElement } from '../types/visualizer';

export type LearningFocusMode = 'intuition' | 'execution' | 'interview';
export type DatasetType = 'random' | 'best-case' | 'worst-case' | 'reverse-sorted' | 'nearly-sorted' | 'duplicates-heavy' | 'custom';

interface VisualizerState {
  initialElements: VisualElement[];
  speed: number;
  algorithm: AlgorithmType;
  searchTarget: number | null;
  mode: LearningFocusMode;
  datasetType: DatasetType;
  language: 'javascript' | 'python' | 'cpp' | 'java';
  setInitialElements: (elements: VisualElement[]) => void;
  setSpeed: (speed: number) => void;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  setSearchTarget: (target: number) => void;
  setMode: (mode: LearningFocusMode) => void;
  setDatasetType: (type: DatasetType) => void;
  setLanguage: (language: 'javascript' | 'python' | 'cpp' | 'java') => void;
}

export const useVisualizerStore = create<VisualizerState>((set) => ({
  initialElements: [],
  speed: 1000,
  algorithm: 'bubble',
  searchTarget: null,
  mode: 'execution',
  datasetType: 'random',
  language: 'cpp',
  setInitialElements: (initialElements) =>
    set({
      initialElements,
      searchTarget:
        initialElements.length > 0
          ? initialElements[Math.floor(Math.random() * initialElements.length)].value
          : null,
    }),
  setSpeed: (speed) => set({ speed }),
  setAlgorithm: (algorithm) => set({ algorithm }),
  setSearchTarget: (searchTarget) => set({ searchTarget }),
  setMode: (mode) => set({ mode }),
  setDatasetType: (datasetType) => set({ datasetType }),
  setLanguage: (language) => set({ language }),
}));
