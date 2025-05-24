
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Employee } from '@/types/employee';
import EmployeeInformations from './EmployeeInformations';
import EmployeeDocuments from './EmployeeDocuments';
import EmployeeTimesheets from './EmployeeTimesheets';
import EmployeeLeaves from './EmployeeLeaves';
import EmployeeEvaluations from './EmployeeEvaluations';
import EmployeeTrainings from './EmployeeTrainings';
import EmployeeSkills from './EmployeeSkills';
import EmployeeRolesAndAuth from './EmployeeRolesAndAuth';

interface EmployeeTabContentProps {
  employee: Employee;
  onRefresh?: () => void;
}

const EmployeeTabContent: React.FC<EmployeeTabContentProps> = ({ 
  employee, 
  onRefresh 
}) => {
  return (
    <>
      <TabsContent value="informations" className="space-y-4">
        <EmployeeInformations employee={employee} />
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <EmployeeDocuments employee={employee} />
      </TabsContent>

      <TabsContent value="timesheets" className="space-y-4">
        <EmployeeTimesheets employeeId={employee.id} />
      </TabsContent>

      <TabsContent value="leaves" className="space-y-4">
        <EmployeeLeaves employeeId={employee.id} />
      </TabsContent>

      <TabsContent value="evaluations" className="space-y-4">
        <EmployeeEvaluations employee={employee} />
      </TabsContent>

      <TabsContent value="trainings" className="space-y-4">
        <EmployeeTrainings employee={employee} />
      </TabsContent>

      <TabsContent value="skills" className="space-y-4">
        <EmployeeSkills employee={employee} onRefresh={onRefresh} />
      </TabsContent>

      <TabsContent value="roles" className="space-y-4">
        <EmployeeRolesAndAuth employee={employee} onRefresh={onRefresh} />
      </TabsContent>
    </>
  );
};

export default EmployeeTabContent;
