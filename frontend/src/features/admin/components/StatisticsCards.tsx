import React from 'react';
import { Users, FolderGit2, Rocket, Globe, Server, Activity } from 'lucide-react';
import OverviewCard from './OverviewCard';

export default function StatisticsCards({ stats }) {
  if (!stats) return null;
  
  const cards = [
    { title: 'Total Users', value: stats.totalUsers?.value, change: stats.totalUsers?.change, icon: Users },
    { title: 'Total Projects', value: stats.totalProjects?.value, change: stats.totalProjects?.change, icon: FolderGit2 },
    { title: 'Total Deployments', value: stats.totalDeployments?.value, change: stats.totalDeployments?.change, icon: Rocket },
    { title: 'Active Domains', value: stats.activeDomains?.value, change: stats.activeDomains?.change, icon: Globe },
    { title: 'Active Servers', value: stats.activeServers?.value, change: stats.activeServers?.change, icon: Server },
    { title: 'Platform Uptime', value: stats.platformUptime?.value, change: stats.platformUptime?.change, icon: Activity }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
