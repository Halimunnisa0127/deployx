import React from 'react';

export default function RoleBadge({ role }) {
  const normalizedRole = (role || '').toLowerCase();
  
  const styles = {
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    developer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    viewer: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const badgeStyle = styles[normalizedRole] || styles.viewer;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${badgeStyle}`}>
      {role}
    </span>
  );
}
