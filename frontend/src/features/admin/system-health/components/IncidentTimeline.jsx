import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Wrench,
  ShieldAlert,
  Activity,
  CheckCircle2,
} from "lucide-react";
import Badge from "../../../../components/ui/Badge";
import { Timeline, TimelineItem } from "../../../../components/ui";

const getEventIcon = (type) => {
  switch (type) {
    case "alert":
      return AlertCircle;
    case "outage":
      return ShieldAlert;
    case "maintenance":
      return Wrench;
    case "deployment":
      return Activity;
    default:
      return CheckCircle2;
  }
};

const getEventColor = (severity) => {
  switch (severity) {
    case "critical":
      return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    case "warning":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "info":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    default:
      return "text-slate-400 bg-slate-500/10 border-slate-500/20";
  }
};

export function TimelineEvent({ event, isLast }) {
  const Icon = getEventIcon(event.type);
  const colorClasses = getEventColor(event.severity);
  const formattedTime = formatDistanceToNow(new Date(event.timestamp), { addSuffix: true });

  return (
    <TimelineItem
      isLast={isLast}
      time={formattedTime}
      icon={<Icon className="w-5 h-5" />}
      iconContainerClassName={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 z-10 ${colorClasses}`}
    >
      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-border p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-foreground font-medium">{event.service}</h4>
          <Badge status={event.status} />
        </div>
        <p className="text-sm text-foreground">{event.description}</p>
        {event.duration && (
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Recovery duration:{" "}
            {event.duration}
          </div>
        )}
      </div>
    </TimelineItem>
  );
}

export default function IncidentTimeline({ events = [] }) {
  if (!events.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-foreground mb-6">Incident Timeline</h2>
      <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
        <Timeline>
          {events.map((event, idx) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isLast={idx === events.length - 1}
            />
          ))}
        </Timeline>
      </div>
    </div>
  );
}
