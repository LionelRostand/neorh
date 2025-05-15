
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import { generateEmployeePdf } from '@/utils/pdfExport';
import { toast } from '@/components/ui/use-toast';
import EmployeeHeader from './view-dialog/EmployeeHeader';
import EmployeeTabs from './view-dialog/EmployeeTabs';

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const ViewEmployeeDialog: React.FC<ViewEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee
}) => {
  const [activeTab, setActiveTab] = useState("informations");
  
  if (!employee) return null;
  
  const handleExportPDF = () => {
    try {
      generateEmployeePdf(employee, activeTab);
      toast({
        title: "Exportation réussie",
        description: "Le document PDF a été généré avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'exportation PDF:", error);
      toast({
        title: "Erreur d'exportation",
        description: "Impossible de générer le document PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh]">
        <EmployeeHeader 
          employee={employee} 
          onClose={() => onOpenChange(false)} 
          onExportPDF={handleExportPDF}
        />
        <EmployeeTabs 
          employee={employee}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeDialog;
