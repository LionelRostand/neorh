
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const EventsLoading = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex space-x-3 border-b pb-3 last:border-0">
          <Skeleton className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <Skeleton className="h-5 w-48 mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};
