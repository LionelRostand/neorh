
import React from 'react';
import { Form } from '@/components/ui/form';
import { useContractForm } from './hooks/useContractForm';
import FormFooter from './components/FormFooter';
import EmployeeNameField from './fields/EmployeeNameField';
import PositionField from './fields/PositionField';
import ContractTypeField from './fields/ContractTypeField';
import DateFields from './fields/DateFields';
import DepartmentField from './fields/DepartmentField';
import SalaryField from './fields/SalaryField';
import ConventionCollectiveField from './fields/ConventionCollectiveField';
import StatusField from './fields/StatusField';

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
          <EmployeeNameField control={form.control} />
          <PositionField control={form.control} />
          <ContractTypeField control={form.control} />
          <DateFields control={form.control} />
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
