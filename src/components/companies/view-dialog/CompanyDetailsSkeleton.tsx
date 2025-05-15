
import React from "react";
import { Loader2 } from "lucide-react";

const CompanyDetailsSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-64">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-2" />
      <p className="text-gray-600">Chargement des informations...</p>
    </div>
  );
};

export default CompanyDetailsSkeleton;
