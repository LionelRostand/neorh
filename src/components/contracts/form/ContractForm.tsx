
import React from 'react';
import { Form } from '@/components/ui/form';
import { useContractForm } from './hooks/useContractForm';
import FormFields from './components/FormFields';
import FormFooter from './components/FormFooter';

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
        <FormFields 
          control={form.control}
          setValue={form.setValue}
          watch={form.watch}
          employees={employees}
          departments={departments}
          employeeName={form.watch('employeeName')}
        />
        
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
