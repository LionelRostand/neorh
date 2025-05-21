
import React, { useEffect } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { ContractFormValues } from '../schema';
import EmployeeField from '../fields/EmployeeField';
import PositionField from '../fields/PositionField';
import ContractTypeField from '../fields/ContractTypeField';
import DateFields from '../fields/DateFields';
import DepartmentField from '../fields/DepartmentField';
import SalaryField from '../fields/SalaryField';
import { ConventionCollectiveField } from '../fields/ConventionCollectiveField';
import { Department } from '@/types/firebase';
import { Employee } from '@/types/employee';

interface FormFieldsProps {
  control: Control<ContractFormValues>;
  setValue: UseFormSetValue<ContractFormValues>;
  watch: UseFormWatch<ContractFormValues>;
  employees: Employee[];
  departments: Department[];
  employeeName: string;
}

const FormFields = ({
  control,
  setValue,
  watch,
  employees,
  departments,
  employeeName
}: FormFieldsProps) => {
  const contractType = watch('type');
  const selectedEmployeeId = watch('employeeId');
  
  // Auto-fill employee name when employeeId changes
  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find(emp => emp.id === selectedEmployeeId);
      if (employee) {
        setValue('employeeName', employee.name);
      }
    }
  }, [selectedEmployeeId, employees, setValue]);
  
  return (
    <div className="space-y-4">
      <EmployeeField 
        control={control} 
        employees={employees}
        setValue={(id, name) => {
          setValue('employeeId', id);
          setValue('employeeName', name);
        }}
        employeeName={employeeName} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PositionField control={control} />
        <ContractTypeField control={control} setValue={setValue} />
      </div>
      
      <DateFields 
        control={control} 
        watch={watch}
        setValue={setValue}
        contractType={contractType}
      />
      
      <DepartmentField control={control} departments={departments} />
      
      <SalaryField control={control} />

      <ConventionCollectiveField control={control} />
    </div>
  );
};

export default FormFields;
