
import React from 'react';
import { Control } from 'react-hook-form';
import { DepartmentFormValues } from '../../schema/departmentSchema';
import { NameField } from './fields/NameField';
import { DescriptionField } from './fields/DescriptionField';
import { ManagerField } from './fields/ManagerField';
import { CompanyField } from './fields/CompanyField';
import { ParentDepartmentField } from './fields/ParentDepartmentField';

interface BasicInfoSectionProps {
  control: Control<DepartmentFormValues>;
}

export function BasicInfoSection({ control }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <NameField control={control} />
      <DescriptionField control={control} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ManagerField control={control} />
        <CompanyField control={control} />
      </div>
      <ParentDepartmentField control={control} />
    </div>
  );
}
