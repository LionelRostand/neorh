
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { 
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <div className={`stats-card ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
        <div className="p-2 rounded-full bg-blue-100 text-blue-600">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div className={`flex items-center text-sm ${
              trend.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>
                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 ml-1">vs. dernier mois</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
