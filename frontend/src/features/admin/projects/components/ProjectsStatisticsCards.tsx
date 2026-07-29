import React, { useMemo } from 'react';
import { FolderGit2, CheckCircle2, Archive, AlertCircle } from 'lucide-react';
import OverviewCard from '../../components/OverviewCard';

export default function ProjectsStatisticsCards({ projects = [] }) {
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const archived = projects.filter(p => p.status === 'archived').length;
    const failed = projects.filter(p => p.status === 'failed').length;

    return { total, active, archived, failed };
  }, [projects]);

  const cards = [
    { title: 'Total Projects', value: stats.total, change: 18.2, icon: FolderGit2 },
    { title: 'Active Projects', value: stats.active, change: 12.5, icon: CheckCircle2 },
    { title: 'Archived Projects', value: stats.archived, change: 2.1, icon: Archive },
    { title: 'Failed Projects', value: stats.failed, change: -5.4, icon: AlertCircle },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => (
        <OverviewCard 
          key={idx}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          onClick={() => {}}
        />
      ))}
    </div>
  );
}
