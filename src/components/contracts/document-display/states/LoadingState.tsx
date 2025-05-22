
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  const [dots, setDots] = useState("");
  
  // Animation des points pour montrer que le chargement est en cours
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
      <p className="text-gray-600 text-lg font-medium">Chargement du contrat{dots}</p>
      <p className="text-gray-400 text-sm mt-2">Cela peut prendre quelques instants</p>
    </div>
  );
};

export default LoadingState;
