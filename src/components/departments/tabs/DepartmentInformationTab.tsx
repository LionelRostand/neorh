
import React from 'react';
import DepartmentForm from './form/DepartmentForm';
import { Department } from '@/types/firebase';
import { DepartmentFormValues } from './schema/departmentSchema';

interface DepartmentInformationTabProps {
  department: Department | null;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DepartmentFormValues) => Promise<void>;
}

const DepartmentInformationTab: React.FC<DepartmentInformationTabProps> = ({
  department,
  isLoading,
  onOpenChange,
  onSubmit,
}) => {
  return (
    <DepartmentForm 
      department={department}
      isLoading={isLoading}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
    />
  );
};

export { DepartmentFormValues };
export default DepartmentInformationTab;
