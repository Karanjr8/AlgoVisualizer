const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

const jsonFile = process.argv[2];
const data = JSON.parse(fs.readFileSync(path.join(__dirname, jsonFile), 'utf8'));

let jsonStr = JSON.stringify(data, null, 2);
let lines = jsonStr.split('\n');
lines.shift(); // remove {
lines.pop();   // remove }
jsonStr = lines.join('\n');

// The file ends with }; optionally followed by newlines
// We will trim the end, remove the last 2 characters (};) and append our content
content = content.trimEnd();
if (content.endsWith('};')) {
    content = content.slice(0, -2);
    const newContent = content + ',\n' + jsonStr + '\n};\n';
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Injected ' + jsonFile + ' successfully!');
} else {
    console.log('Error: File does not end with };');
}
