
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import { generateEmployeePdfWithDocuments } from '@/utils/pdfExport';
import { toast } from '@/components/ui/use-toast';
import EmployeeHeader from './EmployeeHeader';
import EmployeeTabs from './EmployeeTabs';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useDepartmentsData } from '@/hooks/useDepartmentsData';

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
  const { departments } = useDepartmentsData();
  
  if (!employee) return null;
  
  // Chercher le nom du département correspondant à l'ID du département de l'employé
  let processedEmployee = { ...employee };
  
  if (employee.departmentId && departments?.length > 0) {
    const department = departments.find(d => d.id === employee.departmentId);
    if (department) {
      processedEmployee.department = department.name;
    }
  }
  
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      // Find the company data if available
      const employeeCompany = employee.companyId ? 
        companies.find(c => c.id === employee.companyId) : undefined;
      
      // Create a copy of the employee object to avoid modifying the original
      const employeeCopy = { ...employee };
      
      // Find department name if available
      if (employee.departmentId && departments.length > 0) {
        const department = departments.find(d => d.id === employee.departmentId);
        if (department) {
          // Set department name for PDF
          employeeCopy.department = department.name;
        }
      }
      
      // Make sure company name is also shown in the PDF
      if (employeeCompany) {
        employeeCopy.companyId = employeeCompany.name;
      }
      
      await generateEmployeePdfWithDocuments(employeeCopy, activeTab, { company: employeeCompany });
      
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
          employee={processedEmployee} 
          onClose={() => onOpenChange(false)} 
          onExportPDF={handleExportPDF}
          isExporting={isExporting}
        />
        <EmployeeTabs 
          employee={processedEmployee}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRefresh={onRefresh}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeDialog;
