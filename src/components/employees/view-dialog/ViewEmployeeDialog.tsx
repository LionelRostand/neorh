
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import { generateEmployeePdfWithDocuments } from '@/utils/pdfExport';
import { toast } from '@/components/ui/use-toast';
import EmployeeHeader from './EmployeeHeader';
import EmployeeTabs from './EmployeeTabs';
import { useCompaniesData } from '@/hooks/useCompaniesData';

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
  const { companies } = useCompaniesData();
  
  if (!employee) return null;
  
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      // Find the company data if available
      const employeeCompany = employee.companyId ? 
        companies.find(c => c.id === employee.companyId) : undefined;
      
      await generateEmployeePdfWithDocuments(employee, activeTab, { company: employeeCompany });
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
