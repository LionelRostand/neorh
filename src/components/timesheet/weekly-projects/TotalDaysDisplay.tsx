
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { WeeklyProjectTime } from "../types";

interface TotalDaysDisplayProps {
  projects: WeeklyProjectTime[];
}

const TotalDaysDisplay: React.FC<TotalDaysDisplayProps> = ({ projects }) => {
  const totalDays = projects.reduce((sum, p) => sum + p.days, 0);
  const isOverLimit = totalDays > 5;
  
  return (
    <TableRow className="bg-gray-50">
      <TableCell colSpan={2} className="font-bold">
        Total
      </TableCell>
      <TableCell colSpan={2} className={isOverLimit ? 'font-bold text-red-600' : 'font-bold'}>
        {totalDays} / 5 jours
      </TableCell>
    </TableRow>
  );
};

export default TotalDaysDisplay;
