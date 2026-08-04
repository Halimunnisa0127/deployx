import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-800/80 p-8 max-w-md w-full mx-auto ${className}`}>
      {children}
    </div>
  );
};
