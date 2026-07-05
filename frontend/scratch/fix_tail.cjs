const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the literal string ",\\n" with ",\n"
content = content.replace(/,\\n/g, ',\\n');
// Replace the literal string "\\n};" with "\n};"
content = content.replace(/\\n};/g, '\\n};');
// Replace any other isolated literal "\\n" that shouldn't be there
// But wait, the python strings actually DO have literal \n in them!
// Because when I injected them, they were in backticks like:
// python: \`def solve(board):\\n    for r in range(9):...
// And node read them and wrote the literal "\n" to the file.
// If my Python strings contain literal "\n", that's PERFECTLY FINE in a JS template literal!
// The TS errors were around 3420: "';' expected".
// Wait, if Python strings contain `def serialize(root):\n    res = []` in the TS file, that's valid!
// Let's just fix `,\n` and `\n};`.
