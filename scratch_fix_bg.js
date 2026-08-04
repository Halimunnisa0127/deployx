const fs = require('fs');
const path = require('path');

function replaceColor(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceColor(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('bg-slate-900/60')) {
                console.log('Updating:', fullPath);
                const newContent = content.replace(/bg-slate-900\/60/g, 'bg-slate-900');
                fs.writeFileSync(fullPath, newContent);
            }
        }
    }
}

replaceColor(path.join(__dirname, 'frontend', 'src', 'features', 'admin', 'system-health'));
replaceColor(path.join(__dirname, 'frontend', 'src', 'components', 'common'));
console.log('Done.');
