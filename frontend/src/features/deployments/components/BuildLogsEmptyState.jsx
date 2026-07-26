import React from 'react';
import { Terminal, SearchX } from 'lucide-react';
import EmptyState from '../../../components/common/EmptyState';

export default function BuildLogsEmptyState({ reason = 'no_logs', searchQuery }) {
  if (reason === 'no_matches') {
    return (
      <EmptyState
        card={false}
        icon={<SearchX className="w-6 h-6 text-slate-400" />}
        title="No matching log entries"
        description={`No lines matched your log search term "${searchQuery}". Try clearing the search query.`}
      />
    );
  }

  return (
    <EmptyState
      card={false}
      icon={<Terminal className="w-6 h-6 text-indigo-400" />}
      title="No Build Logs"
      description="Logs will appear after deployment starts."
    />
  );
}
