
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton: React.FC = () => {
  return (
    <>
      <Skeleton className="h-8 w-1/4 mb-6" />
      
      <Card className="border rounded-lg shadow-sm mb-6">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border rounded-lg shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-8 w-1/4 mb-1" />
            <Skeleton className="h-3 w-2/5" />
          </CardContent>
        </Card>
        
        <Card className="border rounded-lg shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-8 w-1/4 mb-1" />
            <Skeleton className="h-3 w-2/5" />
          </CardContent>
        </Card>
        
        <Card className="border rounded-lg shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-8 w-1/4 mb-1" />
            <Skeleton className="h-3 w-2/5" />
          </CardContent>
        </Card>
      </div>
      
      <Card className="border rounded-lg shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="h-5 w-1/3 mb-4" />
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </>
  );
};

export default LoadingSkeleton;
