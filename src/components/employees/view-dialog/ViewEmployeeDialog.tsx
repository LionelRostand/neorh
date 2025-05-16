
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import { generateEmployeePdfWithDocuments } from '@/utils/pdfExport';
import { toast } from '@/components/ui/use-toast';
import EmployeeHeader from './EmployeeHeader';
import EmployeeTabs from './EmployeeTabs';

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onRefresh?: () => void;
}

const ViewEmployeeDialog: React.FC<ViewEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState("informations");
  const [isExporting, setIsExporting] = useState(false);
  
  if (!employee) return null;
  
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await generateEmployeePdfWithDocuments(employee, activeTab);
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
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh]">
        <EmployeeHeader 
          employee={employee} 
          onClose={() => onOpenChange(false)} 
          onExportPDF={handleExportPDF}
          isExporting={isExporting}
        />
        <EmployeeTabs 
          employee={employee}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRefresh={onRefresh}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeDialog;
