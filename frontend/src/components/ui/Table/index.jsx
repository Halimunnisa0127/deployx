import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className={`w-full overflow-x-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl ${className}`}>
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead className={`text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-800/70 ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }) {
  return (
    <tbody className={`divide-y divide-slate-800/60 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', onClick, hover = true }) {
  return (
    <tr 
      onClick={onClick}
      className={`
        ${hover ? 'hover:bg-slate-800/30 transition-colors' : ''} 
        ${onClick ? 'cursor-pointer' : ''} 
        ${className}
      `}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return (
    <th className={`px-4 py-3 font-semibold ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-4 py-4 ${className}`}>
      {children}
    </td>
  );
}

export default Table;
