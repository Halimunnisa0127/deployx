import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-card shadow-lg rounded-2xl border border-border p-8 max-w-md w-full mx-auto ${className}`}>
      {children}
    </div>
  );
};
