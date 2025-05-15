
import React from "react";
import { Loader2 } from "lucide-react";

const CompanyDetailsSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      <p className="mt-2 text-gray-600">Chargement des informations...</p>
    </div>
  );
};

export default CompanyDetailsSkeleton;
