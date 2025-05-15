
import React from 'react';
import { User } from 'lucide-react';

const EmployeeEmptyState: React.FC = () => {
  return (
    <div className="text-center py-10">
      <User className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium">Aucun employé trouvé</h3>
      <p className="mt-1 text-gray-500">
        Aucun employé ne correspond à vos critères de recherche.
      </p>
    </div>
  );
};

export default EmployeeEmptyState;
