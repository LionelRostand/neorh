
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-red-500 font-medium">{error}</p>
    </div>
  );
};

export default ErrorState;
