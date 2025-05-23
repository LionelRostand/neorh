
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "./events/useEvents";
import { EventItem } from "./events/EventItem";
import { EventsLoading } from "./events/EventsLoading";
import { EventsEmpty } from "./events/EventsEmpty";

const UpcomingEvents = () => {
  const { events, isLoading } = useEvents();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Événements à venir</CardTitle>
        <CardDescription>Calendrier des événements RH importants</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <EventsLoading />
        ) : events.length > 0 ? (
          <ul className="space-y-4">
            {events.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <EventsEmpty />
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
