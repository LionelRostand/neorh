
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DocumentsLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map((_, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between mt-4 pt-4 border-t">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsLoadingSkeleton;
