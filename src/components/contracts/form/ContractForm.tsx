
import React from 'react';
import { Form } from '@/components/ui/form';
import { useContractForm } from './hooks/useContractForm';
import FormFooter from './components/FormFooter';
import PositionField from './fields/PositionField';
import ContractTypeField from './fields/ContractTypeField';
import DateFields from './fields/DateFields';
import DepartmentField from './fields/DepartmentField';
import SalaryField from './fields/SalaryField';
import StatusField from './fields/StatusField';
import EmployeeField from './fields/EmployeeField';
import ConventionCollectiveField from './fields/ConventionCollectiveField';

interface ContractFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSuccess, onCancel }) => {
  const { form, isSubmitting, handleSubmit, employees, departments } = useContractForm({ 
    onSuccess, 
    onCancel 
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <EmployeeField 
            control={form.control} 
            employees={employees} 
            setValue={(id, name) => {
              form.setValue("employeeId", id);
              form.setValue("employeeName", name);
            }}
          />
          <PositionField control={form.control} />
          <ContractTypeField control={form.control} />
          <DateFields 
            control={form.control} 
            watch={form.watch} 
            setValue={form.setValue} 
            contractType={form.watch('type')}
          />
          <DepartmentField 
            control={form.control} 
            departments={departments} 
          />
          <SalaryField control={form.control} />
          <ConventionCollectiveField control={form.control} />
          <StatusField control={form.control} />
        </div>
        
        <FormFooter
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          submitLabel="Créer le contrat"
        />
      </form>
    </Form>
  );
};

export default ContractForm;
