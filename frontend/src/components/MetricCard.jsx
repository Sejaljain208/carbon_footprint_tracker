import React from 'react';
import { TrendingUp, TrendingDown, ArrowUp } from 'lucide-react';

export const MetricCard = ({ title, value, change, unit = '', icon: Icon, trend = 'up' }) => {
  const isPositive = trend === 'up' && change > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
            {unit && <span className="text-lg text-gray-500 dark:text-gray-400"> {unit}</span>}
          </h3>
          {change !== undefined && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${
              isPositive ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              <TrendIcon size={16} />
              {Math.abs(change)}% vs last week
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Icon className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};
