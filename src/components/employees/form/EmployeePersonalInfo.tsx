
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from './types';
import { NameFields } from './personal-info/NameFields';
import { ContactFields } from './personal-info/ContactFields';
import { BirthDateField } from './personal-info/BirthDateField';

interface EmployeePersonalInfoProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function EmployeePersonalInfo({ form }: EmployeePersonalInfoProps) {
  return (
    <div className="space-y-4">
      <div className="text-md font-medium">Informations personnelles</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NameFields form={form} />
        <ContactFields form={form} />
        <BirthDateField form={form} />
      </div>
    </div>
  );
}
