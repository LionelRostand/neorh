
import React from 'react';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface AllocationCounterProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  isEditing: boolean;
  label: string;
  used: number;
  total: number;
  colorClass: string;
  iconBgClass: string;
  iconColorClass: string;
}

const AllocationCounter: React.FC<AllocationCounterProps> = ({
  id,
  value,
  onChange,
  isEditing,
  label,
  used,
  total,
  colorClass,
  iconBgClass,
  iconColorClass
}) => {
  // Calculer le nombre de jours restants
  const remaining = total - used;
  
  // Calculer le pourcentage d'utilisation
  const percentUsed = total > 0 ? Math.round((used / total) * 100) : 0;
  
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <Calendar className={`h-5 w-5 ${iconColorClass}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{label}</h4>
          <div className="mt-2">
            {isEditing ? (
              <div className="flex items-center">
                <Input
                  id={id}
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                  className="w-20 text-center"
                />
                <span className="ml-2 text-sm text-gray-500">jours</span>
              </div>
            ) : (
              <div className="flex items-baseline space-x-1">
                <span className={`text-xl font-semibold ${colorClass}`}>{remaining}</span>
                <span className="text-sm text-gray-500">/ {total} jours restants</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {!isEditing && (
        <div className="mt-3">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                percentUsed > 80 ? 'bg-red-500' : 
                percentUsed > 50 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${percentUsed}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Utilisé: {used} jours</span>
            <span>{percentUsed}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationCounter;
