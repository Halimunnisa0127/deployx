const fs = require('fs');
const path = require('path');

const dir = 'c:/Full Stack/All Resume Projects/deployx/frontend/src/features/dashboard/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Section Titles
    const h2Regex = /<h2 className="text-(base|sm|lg)( sm:text-(base|lg))? font-(bold|extrabold) text-slate-900 dark:text-slate-100 tracking-tight">/g;
    if (h2Regex.test(content)) {
        content = content.replace(h2Regex, '<h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">');
        modified = true;
    }

    // Dashboard Hero Page Title equivalent
    if (file === 'DashboardHero.jsx') {
        const heroRegex = /<h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">/g;
        if (heroRegex.test(content)) {
            content = content.replace(heroRegex, '<h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">');
            modified = true;
        }
    }

    // QuickActions Card h3 elements (Body text / Action titles)
    if (file === 'QuickActionsCard.jsx') {
        const h3Regex = /<h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">/g;
        if (h3Regex.test(content)) {
            content = content.replace(h3Regex, '<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">');
            modified = true;
        }
    }

    // StatCards.jsx - Card Titles & Primary Numbers
    if (file === 'StatCards.jsx') {
        const cardTitleRegex = /<span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors">/g;
        if (cardTitleRegex.test(content)) {
            content = content.replace(cardTitleRegex, '<span className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-slate-50 transition-colors">');
            modified = true;
        }

        const primaryNumberRegex = /<div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">/g;
        if (primaryNumberRegex.test(content)) {
            content = content.replace(primaryNumberRegex, '<div className="text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight transition-colors">');
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
