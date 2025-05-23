
import React from "react";
import { Event } from "./types";
import { EventIcon } from "./EventIcon";

interface EventItemProps {
  event: Event;
}

export const EventItem = ({ event }: EventItemProps) => {
  return (
    <li className="flex space-x-3 border-b pb-3 last:border-0">
      <div className="mt-0.5">
        <EventIcon type={event.type} />
      </div>
      <div>
        <h4 className="font-medium">{event.title}</h4>
        <p className="text-sm text-gray-500">{event.description}</p>
        <p className="text-xs font-medium text-blue-600 mt-1">{event.date}</p>
      </div>
    </li>
  );
};
