import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className={`w-full overflow-x-auto bg-card border border-border rounded-2xl ${className}`}>
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead className={`text-xs text-muted-foreground uppercase bg-muted border-b border-border ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }) {
  return (
    <tbody className={`divide-y divide-border ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', onClick, hover = true }) {
  return (
    <tr 
      onClick={onClick}
      className={`
        ${hover ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-[250ms] ease-out' : ''} 
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
