import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-lg rounded-2xl p-8 max-w-md w-full mx-auto ${className}`}>
      {children}
    </div>
  );
};
