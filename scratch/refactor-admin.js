const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '../frontend/src/features/admin');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(adminDir);
let changedFiles = 0;

const classReplacements = [
  // Backgrounds
  { regex: /\bbg-white\b/g, replacement: 'bg-card text-card-foreground' },
  { regex: /\bdark:bg-slate-900(?:\/\d+)?\b/g, replacement: '' },
  { regex: /\bbg-slate-(?:50|100|200|300|400|500|600|700|800|900)(?:\/\d+)?\b/g, replacement: '' },
  { regex: /\bdark:hover:bg-slate-(?:50|100|200|300|400|500|600|700|800|900)(?:\/\d+)?\b/g, replacement: '' },
  { regex: /\bhover:bg-slate-(?:50|100|200|300|400|500|600|700|800|900)(?:\/\d+)?\b/g, replacement: '' },
  { regex: /\bbg-black\b/g, replacement: '' },
  { regex: /\bdark:bg-black\b/g, replacement: '' },

  // Borders
  { regex: /\bborder-slate-(?:50|100|200|300|400|500|600|700|800|900)(?:\/\d+)?\b/g, replacement: 'border-border' },
  { regex: /\bdark:border-slate-(?:50|100|200|300|400|500|600|700|800|900)(?:\/\d+)?\b/g, replacement: '' },

  // Text colors
  { regex: /\btext-slate-(?:50|100|200|300|400|500|600|700|800|900)(?:\/\d+)?\b/g, replacement: 'text-theme-secondary' },
  { regex: /\bdark:text-slate-(?:50|100|200|300|400|500|600|700|800|900)(?:\/\d+)?\b/g, replacement: '' },
  { regex: /\bdark:text-white\b/g, replacement: 'text-theme-heading' },
  { regex: /\btext-white\b/g, replacement: 'text-theme-heading' },
  
  // Shadows
  { regex: /\bdark:shadow-(?:sm|md|lg|xl|2xl)\b/g, replacement: '' },
  
  // Custom Card wrapper replacements (replace the card-like div styling with Card standard)
  { regex: /className="([^"]*)bg-card text-card-foreground[^"]*border-border([^"]*)"/g, replacement: 'className="$1bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-xl text-theme-body$2"' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  classReplacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  // Clean up extra spaces in className attributes
  content = content.replace(/className="([^"]+)"/g, (match, classes) => {
    const cleaned = classes.replace(/\s+/g, ' ').trim();
    return `className="${cleaned}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`\nFinished! Updated ${changedFiles} files.`);
