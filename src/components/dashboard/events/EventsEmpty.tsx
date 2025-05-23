
import React from "react";
import { CalendarCheck2 } from "lucide-react";

export const EventsEmpty = () => {
  return (
    <div className="text-center py-6">
      <CalendarCheck2 className="mx-auto h-10 w-10 text-gray-300 mb-3" />
      <p className="text-gray-500">Aucun événement à venir</p>
    </div>
  );
};
