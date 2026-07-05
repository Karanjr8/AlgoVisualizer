const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'src', 'data', 'algorithmContent.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const lines = content.split('\n');

// Find the line that says "  bubble: {"
const bubbleIndex = lines.findIndex(line => line.includes("bubble: {"));

// Find where "tree-levelorder" closes cleanly
// The clean close is at line 485 "  }" followed by line 486 ","
// Let's just find the first "  bubble: {" and clear everything from the previous comma to bubble.
if (bubbleIndex !== -1) {
    // We want to keep everything up to line 486 (the comma).
    // Let's trace back from bubbleIndex to find the ","
    let commaIndex = bubbleIndex - 1;
    while(commaIndex > 0 && lines[commaIndex].trim() !== ",") {
        commaIndex--;
    }
    
    if (commaIndex > 0) {
        // We want to delete from commaIndex + 1 up to bubbleIndex - 1
        lines.splice(commaIndex + 1, bubbleIndex - commaIndex - 1);
        content = lines.join('\n');
        fs.writeFileSync(targetPath, content, 'utf8');
        console.log("Successfully cleaned up the garbage before bubble.");
    } else {
        console.log("Could not find the comma before bubble.");
    }
} else {
    console.log("Could not find bubble: {");
}
