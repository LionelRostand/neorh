
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeStatusStats } from '@/hooks/useEmployeeStats';
import EmployeesProfiles from '@/components/employees/EmployeesProfiles';
import EmployeeStatsCards from '@/components/employees/EmployeeStatsCards';
import EmployeeActions from '@/components/employees/EmployeeActions';
import EmployeeHeader from '@/components/employees/EmployeeHeader';
import { AddEmployeeDialog } from '@/components/employees/AddEmployeeDialog';

const Employes = () => {
  const { employees, isLoading, error, departmentStats, statusStats, refetch } = useEmployeeData();
  const { activeEmployees, onLeaveEmployees, inactiveEmployees, totalEmployees } = useEmployeeStatusStats(employees);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Report error if one occurs
  React.useEffect(() => {
    if (error) {
      console.error("Employee data fetch error:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données des employés",
        variant: "destructive"
      });
    }
  }, [error]);

  // Define refresh callback
  const handleRefresh = useCallback(() => {
    console.log("Employes: Manual refresh requested");
    refetch();
  }, [refetch]);

  return (
    <div className="p-4 md:p-6">
      <EmployeeHeader />

      <EmployeeStatsCards 
        activeEmployees={activeEmployees}
        onLeaveEmployees={onLeaveEmployees}
        inactiveEmployees={inactiveEmployees}
        totalEmployees={totalEmployees}
      />

      <EmployeeActions onAddEmployee={() => setIsAddDialogOpen(true)} />

      <Card className="mb-6">
        <CardContent className="p-4">
          <EmployeesProfiles 
            employees={employees} 
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
        </CardContent>
      </Card>

      <AddEmployeeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default Employes;
