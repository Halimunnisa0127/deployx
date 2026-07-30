import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from '../../../components/common/Card';

export default function DeploymentTrendChart({ data = [] }) {
  if (!data.length) return null;

  return (
    <Card className="p-5 sm:p-6 bg-slate-900/60 border-slate-800/80 shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">Deployment Trend</h3>
        <p className="text-sm text-slate-400">Past 7 days</p>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Line type="monotone" dataKey="deployments" stroke="#818cf8" strokeWidth={3} dot={{ fill: '#818cf8', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
