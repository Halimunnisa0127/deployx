import React from 'react';

export default function UserAvatar({ name, className = "w-8 h-8" }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  // Generating a deterministic color based on the name string
  const colors = [
    'bg-indigo-500/20 text-indigo-400',
    'bg-emerald-500/20 text-emerald-400',
    'bg-sky-500/20 text-sky-400',
    'bg-purple-500/20 text-purple-400',
    'bg-rose-500/20 text-rose-400',
    'bg-amber-500/20 text-amber-400'
  ];
  
  const charIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const colorClass = colors[charIndex];

  return (
    <div className={`${className} rounded-full flex items-center justify-center font-bold text-sm ${colorClass} border border-slate-700/50`}>
      {initial}
    </div>
  );
}
