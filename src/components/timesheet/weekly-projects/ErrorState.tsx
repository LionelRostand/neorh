
import React from 'react';
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorStateProps } from "../types";

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="p-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Impossible de charger les données</h2>
        <p className="text-gray-500 max-w-lg mx-auto">{error.message}</p>
        <Button onClick={onRetry}>
          Réessayer
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
