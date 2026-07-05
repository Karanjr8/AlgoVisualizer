const fs = require('fs');
const path = require('path');
const data = require('./backtracking_data2.json');

const targetPath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(targetPath, 'utf8');

let injectedCode = '';
for (const [key, obj] of Object.entries(data)) {
    injectedCode += "  '" + key + "': " + JSON.stringify(obj, null, 2) + ",\n";
}

const startIdx = content.indexOf("'palindrome-partitioning':");
if (startIdx !== -1) {
    const preContent = content.slice(0, startIdx);
    
    // We want to replace everything from palindrome-partitioning to the end
    // But algorithmContent ends with `};`
    let postContent = "\n};\n";
    
    // Ensure we slice out the trailing comma if we attach to the end
    injectedCode = injectedCode.slice(0, -2);
    
    fs.writeFileSync(targetPath, preContent + injectedCode + postContent);
    console.log('Injected Batch 2');
}
