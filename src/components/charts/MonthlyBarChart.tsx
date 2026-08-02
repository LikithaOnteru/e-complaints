import React from 'react';
import { Complaint } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface MonthlyBarChartProps {
  complaints: Complaint[];
}

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ complaints }) => {
  // Aggregate by village
  const villageCounts: Record<string, { name: string; Total: number; Resolved: number }> = {};

  complaints.forEach(c => {
    if (!villageCounts[c.village]) {
      villageCounts[c.village] = { name: c.village, Total: 0, Resolved: 0 };
    }
    villageCounts[c.village].Total += 1;
    if (c.status === 'Resolved') {
      villageCounts[c.village].Resolved += 1;
    }
  });

  const data = Object.values(villageCounts);

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="Total" fill="#2563eb" radius={[6, 6, 0, 0]} name="Total Grievances" />
          <Bar dataKey="Resolved" fill="#16a34a" radius={[6, 6, 0, 0]} name="Resolved" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
