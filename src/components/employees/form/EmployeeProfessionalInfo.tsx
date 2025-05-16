
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from './types';
import { Company } from '@/types/company';
import { Department } from '@/types/firebase';
import { Employee } from '@/types/employee';
import { CompanyField } from './professional-info/CompanyField';
import { PositionField } from './professional-info/PositionField';
import { DepartmentField } from './professional-info/DepartmentField';
import { EmailField } from './professional-info/EmailField';
import { ManagerField } from './professional-info/ManagerField';

interface EmployeeProfessionalInfoProps {
  form: UseFormReturn<EmployeeFormValues>;
  companies: Company[];
  departments: Department[];
  managers: Employee[];
  isLoadingCompanies: boolean;
  isLoadingDepartments: boolean;
  isLoadingManagers: boolean;
}

export function EmployeeProfessionalInfo({ 
  form, 
  companies, 
  departments, 
  managers,
  isLoadingCompanies,
  isLoadingDepartments,
  isLoadingManagers
}: EmployeeProfessionalInfoProps) {
  return (
    <div className="space-y-4">
      <div className="text-md font-medium">Informations professionnelles</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanyField 
          form={form} 
          companies={companies} 
          isLoading={isLoadingCompanies} 
        />
        
        <PositionField form={form} />
        
        <DepartmentField 
          form={form} 
          departments={departments} 
          isLoading={isLoadingDepartments} 
        />
        
        <EmailField form={form} />
        
        <ManagerField 
          form={form} 
          managers={managers} 
          isLoading={isLoadingManagers} 
        />
      </div>
    </div>
  );
}
