
import React from 'react';
import { Control } from 'react-hook-form';
import { DepartmentFormValues } from '../../schema/departmentSchema';
import { NameField } from './fields/NameField';
import { DescriptionField } from './fields/DescriptionField';
import { ManagerField } from './fields/ManagerField';
import { CompanyField } from './fields/CompanyField';

interface BasicInfoSectionProps {
  control: Control<DepartmentFormValues>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ control }) => {
  return (
    <>
      <NameField control={control} />
      <DescriptionField control={control} />
      <ManagerField control={control} />
      <CompanyField control={control} />
    </>
  );
};
