
import React from "react";
import { Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface DateRangeDisplayProps {
  startDate: string;
  endDate: string;
}

const DateRangeDisplay = ({ startDate, endDate }: DateRangeDisplayProps) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start) + 1; // +1 car on compte le jour de début

    const formattedStart = format(start, 'dd/MM/yyyy');
    const formattedEnd = format(end, 'dd/MM/yyyy');
    
    return (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span>
          {formattedStart} - {formattedEnd} ({days} jour{days > 1 ? 's' : ''})
        </span>
      </div>
    );
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span>Dates non valides</span>
      </div>
    );
  }
};

export default DateRangeDisplay;
