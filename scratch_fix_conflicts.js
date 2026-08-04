const fs = require('fs');
const path = require('path');

function fixConflicts(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                fixConflicts(fullPath);
            }
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('<<<<<<< HEAD')) {
                console.log('Fixing:', fullPath);
                // Matches from <<<<<<< HEAD to ======= and from ======= to >>>>>>> commit-hash
                // It replaces the whole block with the incoming changes (Group 2)
                const newContent = content.replace(/<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]+/g, '$2');
                fs.writeFileSync(fullPath, newContent);
            }
        }
    }
}
fixConflicts(path.join(__dirname, 'frontend', 'src'));
console.log("Done.");
