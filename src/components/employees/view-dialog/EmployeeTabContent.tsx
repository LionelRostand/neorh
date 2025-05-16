
import React from 'react';
import { Employee } from '@/types/employee';
import EmployeeLeaves from './EmployeeLeaves';

// Autres composants
export { default as InformationsTab } from './EmployeeInformations';
export { default as DocumentsTab } from './EmployeeDocuments';
export { default as CompetencesTab } from './EmployeeSkills';
export { default as EvaluationsTab } from './EmployeeEvaluations';

export const HorairesTab = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Horaires de travail</h3>
      <p className="text-gray-500">Fonctionnalité en cours de développement.</p>
    </div>
  );
};

export const CongesTab: React.FC<{ employee: Employee }> = ({ employee }) => {
  return <EmployeeLeaves employeeId={employee.id || ''} />;
};
