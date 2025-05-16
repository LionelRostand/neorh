
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

interface DepartmentEmployeesTabProps {
  onOpenChange: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const DepartmentEmployeesTab: React.FC<DepartmentEmployeesTabProps> = ({
  onOpenChange,
  setActiveTab,
}) => {
  return (
    <div className="py-4">
      <p className="text-muted-foreground text-center py-6">
        La gestion des employés sera implémentée dans une prochaine version.
      </p>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4 mr-2" /> Annuler
        </Button>
        <Button 
          onClick={() => setActiveTab("informations")} 
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Retour aux informations
        </Button>
      </DialogFooter>
    </div>
  );
};

export default DepartmentEmployeesTab;
