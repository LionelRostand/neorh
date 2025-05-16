
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AllocationCounterProps } from "./types";

const AllocationCounter: React.FC<AllocationCounterProps> = memo(({
  id,
  value,
  onChange,
  isEditing,
  label,
  used,
  total,
  colorClass,
  iconBgClass,
  iconColorClass,
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
    <Card className="border rounded-lg shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            {isEditing ? (
              <div className="flex items-center space-x-2 mt-2">
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
                  className="h-9 text-center w-16"
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
              <>
                <h4 className="text-2xl font-bold mt-1">{value - used}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  disponibles sur {total} jours
                </p>
                <p className="text-xs text-gray-500">
                  ({used} jours utilisés)
                </p>
              </>
            )}
          </div>
          <div className={`p-2 rounded-full ${iconBgClass}`}>
            <Calendar className={`h-5 w-5 ${iconColorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AllocationCounter.displayName = "AllocationCounter";

export default AllocationCounter;
