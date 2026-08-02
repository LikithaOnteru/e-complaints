import React from 'react';
import { Complaint } from '../../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CategoryPieChartProps {
  complaints: Complaint[];
}

const COLORS = ['#2563eb', '#16a34a', '#0284c7', '#ca8a04', '#dc2626', '#9333ea', '#059669', '#64748b'];

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ complaints }) => {
  const categoryCounts: Record<string, number> = {};

  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const data = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
