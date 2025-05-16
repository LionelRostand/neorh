
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LoadingSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingSkeleton;
