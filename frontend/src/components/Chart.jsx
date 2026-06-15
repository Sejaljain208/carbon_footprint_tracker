import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const Chart = ({ type, data, dataKey, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={320}>
        {type === 'line' && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey || 'emission'}
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 5 }}
            />
          </LineChart>
        )}

        {type === 'bar' && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey || 'emission'} fill="#10b981" />
          </BarChart>
        )}

        {type === 'pie' && (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey || 'value'}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 4]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
