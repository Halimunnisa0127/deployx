import React from 'react';

export default function FloatingBadge({ icon: Icon, text, positionClasses, delay = "0s", duration = "6s" }) {
  return (
    <div
      className={`absolute flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-blue-500/20 dark:border-blue-500/30 bg-white/90 dark:bg-[#0F172A]/80 backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)] text-slate-800 dark:text-white font-medium text-xs sm:text-sm z-20 cursor-pointer hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300 ease-out ${positionClasses}`}
      style={{
        animation: `floatBadge ${duration} ease-in-out infinite`,
        animationDelay: delay,
      }}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
      <span className="whitespace-nowrap">{text}</span>
    </div>
  );
}
