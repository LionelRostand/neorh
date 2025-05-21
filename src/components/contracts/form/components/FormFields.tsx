
import React from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { ContractFormValues } from '../schema';
import { Employee } from '@/types/employee';
import { Department } from '@/types/firebase';
import EmployeeField from '../fields/EmployeeField';
import ContractTypeField from '../fields/ContractTypeField';
import PositionField from '../fields/PositionField';
import DateFields from '../fields/DateFields';
import DepartmentField from '../fields/DepartmentField';
import SalaryField from '../fields/SalaryField';

interface FormFieldsProps {
  control: Control<ContractFormValues>;
  setValue: UseFormSetValue<ContractFormValues>;
  watch: UseFormWatch<ContractFormValues>;
  employees: Employee[];
  departments: Department[];
  employeeName?: string;
}

const FormFields: React.FC<FormFieldsProps> = ({ 
  control, 
  setValue, 
  watch, 
  employees, 
  departments,
  employeeName
}) => {
  return (
    <div className="space-y-4">
      {/* Employee selection */}
      <EmployeeField
        control={control}
        employees={employees}
        employeeName={watch('employeeName')}
        setValue={(id, name) => {
          setValue('employeeId', id);
          setValue('employeeName', name);
        }}
      />
      
      {/* Contract type selection */}
      <ContractTypeField control={control} setValue={setValue} />
      
      {/* Position */}
      <PositionField control={control} />
      
      {/* Department */}
      <DepartmentField 
        control={control} 
        departments={departments.map(dept => ({ 
          id: dept.id || '', 
          name: dept.name,
          description: dept.description
        }))}
      />
      
      {/* Dates */}
      <DateFields
        control={control}
        watch={watch}
        setValue={setValue}
        contractType={watch('type')}
      />
      
      {/* Salary */}
      <SalaryField control={control} />
      
      {/* Convention collective */}
      <div className="space-y-2">
        <label htmlFor="conventionCollective" className="text-sm font-medium">
          Convention Collective
        </label>
        <input
          id="conventionCollective"
          className="w-full p-2 border rounded"
          {...control.register('conventionCollective')}
        />
      </div>
    </div>
  );
};

export default FormFields;
