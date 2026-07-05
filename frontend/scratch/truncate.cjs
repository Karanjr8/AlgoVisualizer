const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'src', 'data', 'algorithmContent.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const oldBinaryTreeIndex = content.lastIndexOf("  'binary-tree': {");
if (oldBinaryTreeIndex !== -1 && oldBinaryTreeIndex > 5000) {
  content = content.substring(0, oldBinaryTreeIndex) + "\n};\n";
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log("Successfully truncated duplicates.");
} else {
  console.log("Could not find the old duplicate.");
}
