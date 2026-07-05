const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/algorithms/backtrackingGenerators.ts');
let content = fs.readFileSync(filePath, 'utf8');

const toAppend = `
export function generateGenericBacktrackingFrames(title: string): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements: VisualElement[] = [{ id: 'b', value: 0, state: 'normal', displayValue: '...' }];
  pushFrame(frames, [], elements, 'INIT', \`Starting \${title}\`, title, 1);
  pushFrame(frames, [], elements, 'COMPLETE', \`Finished \${title}\`, title, 1);
  return frames;
}
`;

fs.writeFileSync(filePath, content + toAppend, 'utf8');
console.log('Appended to backtrackingGenerators.ts');
