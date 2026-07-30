import fs from 'fs';
import path from 'path';

const dir = 'c:/Full Stack/All Resume Projects/deployx/frontend/src/features/settings/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const replacements = [
  { from: /bg-slate-900\/60(?! dark:)/g, to: 'bg-white/60 dark:bg-slate-900/60' },
  { from: /border-slate-800\/80(?! dark:)/g, to: 'border-slate-200 dark:border-slate-800/80' },
  { from: /text-slate-100(?! dark:)/g, to: 'text-slate-900 dark:text-slate-100' },
  { from: /text-slate-400(?! dark:)/g, to: 'text-slate-500 dark:text-slate-400' },
  { from: /text-slate-300(?! dark:)/g, to: 'text-slate-700 dark:text-slate-300' },
  { from: /text-slate-200(?! dark:)/g, to: 'text-slate-800 dark:text-slate-200' },
  { from: /bg-slate-950(?![\/a-zA-Z-]| dark:)/g, to: 'bg-white dark:bg-slate-950' },
  { from: /bg-slate-950\/60(?! dark:)/g, to: 'bg-slate-50/60 dark:bg-slate-950/60' },
  { from: /bg-slate-950\/40(?! dark:)/g, to: 'bg-slate-50/40 dark:bg-slate-950/40' },
  { from: /border-slate-800(?![\/a-zA-Z-]| dark:)/g, to: 'border-slate-200 dark:border-slate-800' },
  { from: /bg-slate-900(?![\/a-zA-Z-]| dark:)/g, to: 'bg-white dark:bg-slate-900' },
  { from: /bg-slate-900\/80(?! dark:)/g, to: 'bg-slate-100/80 dark:bg-slate-900/80' },
  { from: /bg-slate-900\/50(?! dark:)/g, to: 'bg-slate-100/50 dark:bg-slate-900/50' },
  { from: /bg-indigo-950\/90(?! dark:)/g, to: 'bg-indigo-50/90 dark:bg-indigo-950/90' },
  { from: /bg-indigo-950\/80(?! dark:)/g, to: 'bg-indigo-50/80 dark:bg-indigo-950/80' },
  { from: /border-indigo-500\/40(?! dark:)/g, to: 'border-indigo-200 dark:border-indigo-500/40' },
  { from: /text-indigo-100(?! dark:)/g, to: 'text-indigo-900 dark:text-indigo-100' },
  { from: /text-indigo-300(?! dark:)/g, to: 'text-indigo-700 dark:text-indigo-300' },
  { from: /bg-rose-950\/80(?! dark:)/g, to: 'bg-rose-50/80 dark:bg-rose-950/80' },
  { from: /text-rose-300(?! dark:)/g, to: 'text-rose-700 dark:text-rose-300' },
  { from: /border-rose-500\/40(?! dark:)/g, to: 'border-rose-200 dark:border-rose-500/40' },
  { from: /border-rose-500\/30(?! dark:)/g, to: 'border-rose-200 dark:border-rose-500/30' },
  { from: /border-rose-500\/20(?! dark:)/g, to: 'border-rose-200 dark:border-rose-500/20' },
  { from: /bg-rose-950\/20(?! dark:)/g, to: 'bg-rose-50/20 dark:bg-rose-950/20' },
  { from: /bg-rose-950\/60(?! dark:)/g, to: 'bg-rose-50/60 dark:bg-rose-950/60' },
  { from: /bg-emerald-950\/80(?! dark:)/g, to: 'bg-emerald-50/80 dark:bg-emerald-950/80' },
  { from: /text-emerald-300(?! dark:)/g, to: 'text-emerald-700 dark:text-emerald-300' },
  { from: /border-emerald-500\/40(?! dark:)/g, to: 'border-emerald-200 dark:border-emerald-500/40' },
  { from: /bg-indigo-500\/20(?! dark:)/g, to: 'bg-indigo-100/50 dark:bg-indigo-500/20' },
  { from: /divide-slate-800\/80(?! dark:)/g, to: 'divide-slate-200 dark:divide-slate-800/80' },
  { from: /bg-slate-900 border border-slate-200 dark:border-slate-800/g, to: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800' }
];

for (const file of files) {
  if (file === 'UpgradePro.jsx') continue;
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  for (const {from, to} of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(filepath, content);
  console.log('Processed', file);
}
