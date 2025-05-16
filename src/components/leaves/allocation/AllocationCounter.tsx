
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

interface AllocationCounterProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  isEditing: boolean;
  label: string;
  used: number;
  total: number;
  colorClass: string;
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
}) => {
  const handleIncrement = () => {
    onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > used) {
      onChange(value - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= used) {
      onChange(newValue);
    }
  };

  return (
    <div className="p-4 rounded-lg border">
      <div className="flex justify-between items-center mb-2">
        <div className={`px-2 py-1 rounded text-sm ${colorClass}`}>{label}</div>
        <div className="text-sm text-gray-500">{used} utilisés</div>
      </div>
      {isEditing ? (
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={value <= used}
            className="h-8 w-8"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            id={id}
            type="number"
            min={used}
            value={value}
            onChange={handleChange}
            className="h-9 text-center"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            className="h-8 w-8"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold">{total - used}</span>
          <span className="text-sm text-gray-500 mb-1">
            sur {total} jours
          </span>
        </div>
      )}
    </div>
  );
};

export default AllocationCounter;
