
import React from 'react';
import { User } from 'lucide-react';

interface EmptyEmployeeStateProps {
  message?: string;
  subMessage?: string;
}

const EmptyEmployeeState: React.FC<EmptyEmployeeStateProps> = ({ 
  message = "Aucun employé trouvé",
  subMessage = "Aucun employé ne correspond à vos critères de recherche."
}) => {
  return (
    <div className="text-center py-10">
      <User className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium">{message}</h3>
      <p className="mt-1 text-gray-500">{subMessage}</p>
    </div>
  );
};

export default EmptyEmployeeState;
