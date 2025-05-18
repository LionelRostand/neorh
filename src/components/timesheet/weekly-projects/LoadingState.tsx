
import React, { useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { LoadingStateProps } from "../types";

const LoadingState: React.FC<LoadingStateProps> = ({ loadingProgress }) => {
  return (
    <div className="p-8">
      <div className="flex flex-col items-center justify-center py-8 space-y-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground text-center">Récupération des données de la feuille de temps...</p>
        <div className="w-full max-w-md">
          <Progress value={loadingProgress} className="h-2 mb-2" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
