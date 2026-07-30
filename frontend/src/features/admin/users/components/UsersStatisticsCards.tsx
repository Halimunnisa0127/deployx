import React, { useMemo } from 'react';
import { Users, UserCheck, UserX, UserPlus } from 'lucide-react';
import OverviewCard from '../../components/OverviewCard';

export default function UsersStatisticsCards({ users = [] }) {
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    
    // For mock new users, just randomly set it based on total
    const newUsers = Math.floor(total * 0.3);

    return { total, active, suspended, newUsers };
  }, [users]);

  const cards = [
    { title: 'Total Users', value: stats.total, change: 12.5, icon: Users },
    { title: 'Active Users', value: stats.active, change: 8.2, icon: UserCheck },
    { title: 'Suspended Users', value: stats.suspended, change: -2.1, icon: UserX },
    { title: 'New Users (30 Days)', value: stats.newUsers, change: 15.4, icon: UserPlus },
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
