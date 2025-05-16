
import React from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 p-4 border rounded-md">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 p-6 border rounded-md">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-36" />
            </div>
            <Skeleton className="h-6 w-32 mt-6" />
            <div className="flex items-start gap-2">
              <Skeleton className="h-4 w-4 mt-0.5" />
              <div className="w-full">
                <Skeleton className="h-4 w-full max-w-xs mb-1" />
                <Skeleton className="h-4 w-full max-w-xs mb-1" />
                <Skeleton className="h-4 w-full max-w-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>

      <div className="flex flex-col items-center justify-center py-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-2" />
        <p className="text-emerald-700">Chargement des informations...</p>
      </div>
    </div>
  );
};

export default CompanyDetailsSkeleton;
