import { useMemo } from "react";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import OverviewCard from "../../components/OverviewCard";

export default function UsersStatisticsCards({ users = [] }) {
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "active" || u.isActive === true).length;
    const suspended = users.filter((u) => u.status === "suspended" || u.isActive === false).length;
    
    const now = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const newUsers = users.filter(
      (u) => u.joinedAt && now - new Date(u.joinedAt).getTime() <= thirtyDaysMs
    ).length;

    return { total, active, suspended, newUsers };
  }, [users]);

  const cards = [
    { title: "Total Users", value: stats.total, change: 0, icon: Users },
    {
      title: "Active Users",
      value: stats.active,
      change: 0,
      icon: UserCheck,
    },
    {
      title: "Suspended Users",
      value: stats.suspended,
      change: 0,
      icon: UserX,
    },
    {
      title: "New Users (30 Days)",
      value: stats.newUsers,
      change: 0,
      icon: UserPlus,
    },
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
