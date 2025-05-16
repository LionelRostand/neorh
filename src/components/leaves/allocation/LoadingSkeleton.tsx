
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton: React.FC = () => {
  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b">
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingSkeleton;
