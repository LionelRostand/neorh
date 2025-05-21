
import React from 'react';
import { Employee } from '@/types/employee';
import EmployeeLeaves from './EmployeeLeaves';
import EmployeeTimesheets from './EmployeeTimesheets';
import EmployeeHoraires from './EmployeeHoraires';

// Autres composants
export { default as InformationsTab } from './EmployeeInformations';
export { default as DocumentsTab } from './EmployeeDocuments';
export { default as CompetencesTab } from './EmployeeSkills';
export { default as EvaluationsTab } from './EmployeeEvaluations';

export const HorairesTab: React.FC<{ employee: Employee; onRefresh?: () => void }> = ({ 
  employee,
  onRefresh
}) => {
  return <EmployeeHoraires employee={employee} onRefresh={onRefresh} />;
};

export const FeuillesDeTempsTab: React.FC<{ employee: Employee }> = ({ employee }) => {
  return <EmployeeTimesheets employeeId={employee.id || ''} />;
};

export const CongesTab: React.FC<{ employee: Employee }> = ({ employee }) => {
  return <EmployeeLeaves employeeId={employee.id || ''} />;
};
