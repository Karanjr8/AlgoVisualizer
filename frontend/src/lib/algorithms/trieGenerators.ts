import type { VisualElement, VisualizationFrame } from '../../types/visualizer';

export function generateGenericTrieFrames(title: string): VisualizationFrame[] {
  const elements: VisualElement[] = [
    { id: 'root', value: 0, state: 'normal', displayValue: 'root' },
    { id: 'c', value: 1, state: 'selected', displayValue: 'c' },
    { id: 'a', value: 2, state: 'selected', displayValue: 'a' },
    { id: 't', value: 3, state: 'sorted', displayValue: 't [isEnd]' }
  ];

  return [
    {
      elements,
      event: {
        type: 'INIT',
        explanation: `${title}: Initial Trie Prefix Tree structure.`
      }
    },
    {
      elements: elements.map(e => ({ ...e, state: 'comparing' })),
      event: {
        type: 'COMPARE',
        explanation: `Traversing Trie character nodes from Root downwards.`
      }
    },
    {
      elements: elements.map(e => ({ ...e, state: 'sorted' })),
      event: {
        type: 'COMPLETE',
        explanation: `${title}: Operation complete.`
      }
    }
  ];
}
