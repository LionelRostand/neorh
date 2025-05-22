
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
      <p className="text-gray-600">Chargement du contrat...</p>
    </div>
  );
};

export default LoadingState;
