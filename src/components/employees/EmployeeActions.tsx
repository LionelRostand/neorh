
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmployeeActionsProps {
  onAddEmployee: () => void;
}

const EmployeeActions: React.FC<EmployeeActionsProps> = ({ onAddEmployee }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      <h2 className="text-xl font-semibold">Liste des Employés</h2>
      <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
        <Button variant="outline" className="flex items-center">
          <span className="mr-2">Exporter / Importer</span>
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={onAddEmployee}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Employé
        </Button>
      </div>
    </div>
  );
};

export default EmployeeActions;
