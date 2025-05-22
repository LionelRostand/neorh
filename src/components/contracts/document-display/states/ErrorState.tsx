
import React from "react";

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );
};

export default ErrorState;
