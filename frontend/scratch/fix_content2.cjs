const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/algorithmContent.ts');
let lines = fs.readFileSync(targetPath, 'utf8').split('\n');

const idx = lines.findIndex(l => l.includes("'generate-subsets': {"));
if (idx !== -1) {
    lines = lines.slice(0, idx);
    while(lines[lines.length - 1].trim() === '' || lines[lines.length - 1].trim() === '}' || lines[lines.length - 1].trim() === '};') {
        lines.pop();
    }
}

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
    injectedCode += "  '" + id + "': {\n";
    injectedCode += "    id: '" + id + "',\n";
    injectedCode += "    introduction: '" + title + " explores all possibilities.',\n";
    injectedCode += "    intuition: 'Backtrack when a constraint fails.',\n";
    injectedCode += "    walkthrough: [{ phase: 'Explore', description: 'Make a choice' }],\n";
    injectedCode += "    dryRun: { input: '[]', output: '[]', steps: ['Step 1'] },\n";
    injectedCode += "    complexities: {\n";
    injectedCode += "      time: { best: 'O(N)', average: 'O(2^N)', worst: 'O(N!)' },\n";
    injectedCode += "      space: 'O(N)',\n";
    injectedCode += "      analysis: 'Exponential complexity is common.'\n";
    injectedCode += "    },\n";
    injectedCode += "    code: {\n";
    injectedCode += "      cpp: '// C++ code here',\n";
    injectedCode += "      java: '// Java code here',\n";
    injectedCode += "      python: '# Python code here',\n";
    injectedCode += "      javascript: '// JS code here'\n";
    injectedCode += "    },\n";
    injectedCode += "    interviewNotes: {\n";
    injectedCode += "      mistakes: ['Not backtracking state'],\n";
    injectedCode += "      edgeCases: ['Empty inputs'],\n";
    injectedCode += "      tips: ['Draw the state space tree']\n";
    injectedCode += "    },\n";
    injectedCode += "    practiceProblems: [],\n";
    injectedCode += "    relatedTopics: []\n";
    injectedCode += "  },\n";
}

injectedCode = injectedCode.slice(0, -2) + '\n'; // remove last comma
const finalContent = lines.join('\n') + '\n' + injectedCode + '};\n';

fs.writeFileSync(targetPath, finalContent);
console.log('Fixed algorithmContent.ts without backticks');
