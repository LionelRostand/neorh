
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Titre et actions */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-1/4" />
        <Skeleton className="h-9 w-36" />
      </div>
      
      {/* Manager de l'allocation */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-9 w-20" />
          </div>
          <Skeleton className="h-4 w-40 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      </div>
      
      {/* Historique */}
      <Card>
        <CardHeader className="pb-0">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="py-4 border-b">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <div className="py-4 border-b">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingSkeleton;
