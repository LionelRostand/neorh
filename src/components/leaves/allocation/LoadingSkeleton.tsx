
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton: React.FC = () => {
  return (
    <Card className="border rounded-lg shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-4 w-1/2 bg-gray-200 rounded" />
          <Skeleton className="h-8 w-full bg-gray-200 rounded" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-gray-200 rounded" />
              <Skeleton className="h-10 w-full bg-gray-200 rounded" />
              <Skeleton className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-gray-200 rounded" />
              <Skeleton className="h-10 w-full bg-gray-200 rounded" />
              <Skeleton className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingSkeleton;
