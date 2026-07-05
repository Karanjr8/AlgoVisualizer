const fs = require('fs');
const path = require('path');

const replaceInFile = (file, regex, replacement) => {
  const p = path.join(__dirname, 'src', file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(p, content);
};

// TreeRenderer
replaceInFile('components/visualizer/TreeRenderer.tsx', /Search, IterationCcw/g, '');
replaceInFile('components/visualizer/TreeRenderer.tsx', /, Search, IterationCcw/g, '');

// SideControls
replaceInFile('components/visualizer/SideControls.tsx', /import { cn } from '\.\.\/\.\.\/lib\/utils';\r?\n?/g, '');
replaceInFile('components/visualizer/SideControls.tsx', /import { cn } from '\.\.\/\.\.\/lib\/utils';/g, '');

// Profile
replaceInFile('pages/Profile.tsx', /Target,\s*/g, '');
replaceInFile('pages/Profile.tsx', /BookOpen,\s*/g, '');
replaceInFile('pages/Profile.tsx', /const progress = [^;]+;/g, '');
replaceInFile('pages/Profile.tsx', /const rightPanel = [\s\S]+?(?=return)/g, '');

// Intro Pages
replaceInFile('pages/RecursionIntro.tsx', /const rightPanel = [\s\S]+?(?=return)/g, '');
replaceInFile('pages/SearchingIntro.tsx', /const rightPanel = [\s\S]+?(?=return)/g, '');
replaceInFile('pages/SlidingWindowIntro.tsx', /const rightPanel = [\s\S]+?(?=return)/g, '');
replaceInFile('pages/SortingIntro.tsx', /const rightPanel = [\s\S]+?(?=return)/g, '');
replaceInFile('pages/TwoPointersIntro.tsx', /const rightPanel = [\s\S]+?(?=return)/g, '');

// Visualizer
replaceInFile('pages/Visualizer.tsx', /useState,\s*useRef,\s*/g, '');
replaceInFile('pages/Visualizer.tsx', /const scrollTo = [^;]+;/g, '');

// recursionArray
replaceInFile('lib/algorithms/recursionArray.ts', /VisualizerElement/g, 'VisualElement');
replaceInFile('lib/algorithms/recursionArray.ts', /highlightIndices:\s*indices,\r?\n/g, '');

// ExplanationPanel
const exPath = path.join(__dirname, 'src/components/visualizer/ExplanationPanel.tsx');
let ex = fs.readFileSync(exPath, 'utf8');
if (!ex.includes('CALL:')) {
  ex = ex.replace("UPDATE_BEST: 'text-amber-500'", "UPDATE_BEST: 'text-amber-500',\n  CALL: 'text-indigo-500',\n  RETURN: 'text-violet-500',\n  BASE_CASE: 'text-emerald-500'");
  fs.writeFileSync(exPath, ex);
}

console.log("Fixes applied");
