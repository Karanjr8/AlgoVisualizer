const fs = require('fs');
const path = require('path');
const data = require('./backtracking_data.json');

const targetPath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(targetPath, 'utf8');

let injectedCode = '';
for (const [key, obj] of Object.entries(data)) {
    injectedCode += "  '" + key + "': " + JSON.stringify(obj, null, 2) + ",\n";
}

const startIdx = content.indexOf("'generate-subsets':");
if (startIdx !== -1) {
    const preContent = content.slice(0, startIdx);
    let postContent = content.slice(startIdx);
    const postIdx = postContent.indexOf("'palindrome-partitioning':");
    if (postIdx !== -1) {
        fs.writeFileSync(targetPath, preContent + injectedCode + postContent.slice(postIdx));
        console.log('Injected Batch 1');
    }
}
