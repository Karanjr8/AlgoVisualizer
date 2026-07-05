const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/algorithmContent.ts');
let lines = fs.readFileSync(targetPath, 'utf8').split('\n');

// Find where 'generate-subsets' was added
const idx = lines.findIndex(l => l.includes("'generate-subsets': {"));
if (idx !== -1) {
    // Delete everything from generate-subsets to the end of the file
    lines = lines.slice(0, idx);
    // Remove trailing commas or brackets
    while(lines[lines.length - 1].trim() === '' || lines[lines.length - 1].trim() === '}' || lines[lines.length - 1].trim() === '};') {
        lines.pop();
    }
}

// Ensure the last element has a comma before we inject new ones
if (!lines[lines.length - 1].endsWith(',')) {
    lines[lines.length - 1] += ',';
}

const algorithms = [
    'generate-subsets', 'generate-subsequences', 'generate-permutations',
    'combination-sum', 'combination-sum-ii', 'letter-combinations',
    'palindrome-partitioning', 'word-search', 'm-coloring',
    'restore-ip-addresses', 'beautiful-arrangement'
];

let injectedCode = '';

for (const id of algorithms) {
    const title = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    injectedCode += \`
  '\${id}': {
    id: '\${id}',
    introduction: 'Introduction to \${title}',
    intuition: 'Intuition for \${title}',
    walkthrough: [{ phase: 'Phase 1', description: 'Step 1' }],
    dryRun: { input: 'Example Input', output: 'Example Output', steps: ['Step 1'] },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(N)',
      analysis: 'Time and space complexity analysis.'
    },
    code: {
      cpp: '// C++ Code',
      java: '// Java Code',
      python: '# Python Code',
      javascript: '// JavaScript Code'
    },
    interviewNotes: {
      mistakes: ['Common mistake 1'],
      edgeCases: ['Edge case 1'],
      tips: ['Interview tip 1']
    },
    practiceProblems: [],
    relatedTopics: []
  },\`;
}

// Remove trailing comma from the last injected item
injectedCode = injectedCode.slice(0, -1);

const finalContent = lines.join('\n') + '\n' + injectedCode + '\n};\n';
fs.writeFileSync(targetPath, finalContent);
console.log('Successfully fixed algorithmContent.ts');
