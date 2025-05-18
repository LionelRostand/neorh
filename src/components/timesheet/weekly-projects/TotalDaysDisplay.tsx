
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { WeeklyProjectTime } from "../types";

interface TotalDaysDisplayProps {
  projects?: WeeklyProjectTime[];
  currentDays?: number;
  maxDays?: number;
}

const TotalDaysDisplay: React.FC<TotalDaysDisplayProps> = ({ projects, currentDays, maxDays = 5 }) => {
  // Calculate total days based on either direct value or by summing projects
  const totalDays = currentDays !== undefined 
    ? currentDays
    : projects?.reduce((sum, p) => sum + p.days, 0) || 0;
  
  const isOverLimit = totalDays > maxDays;
  
  return (
    <div className={`font-medium text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}>
      {totalDays} / {maxDays} jours
    </div>
  );
};

export default TotalDaysDisplay;
