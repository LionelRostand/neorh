
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';
import { AllocationCounterProps } from './types';

const AllocationCounter: React.FC<AllocationCounterProps> = ({
  id,
  value,
  onChange,
  isEditing,
  label,
  used,
  total,
  colorClass
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onChange(Math.max(0, value - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input 
            id={id} 
            type="number" 
            value={value} 
            onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))} 
            className="max-w-20 text-center"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onChange(value + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500">jours</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div className={`${colorClass} rounded-md px-3 py-1 text-lg font-medium`}>
            {total}
          </div>
          <span className="text-sm text-gray-500">jours</span>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Utilisés: {used} jours
      </p>
    </div>
  );
};

export default AllocationCounter;
