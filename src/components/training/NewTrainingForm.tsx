
import React from "react";
import { Form } from "@/components/ui/form";
import { BasicInfoSection } from "./form/sections/BasicInfoSection";
import { EmployeesSection } from "./form/sections/EmployeesSection";
import { DateSection } from "./form/sections/DateSection";
import { DescriptionSection } from "./form/sections/DescriptionSection";
import { FormActions } from "./form/FormActions";
import { useTrainingForm } from "./form/useTrainingForm";

interface NewTrainingFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

const NewTrainingForm = ({ onCancel, onSuccess }: NewTrainingFormProps) => {
  const { 
    form, 
    handleSubmit, 
    isSubmitting, 
    selectedEmployeeIds, 
    removeEmployee, 
    employees 
  } = useTrainingForm(onSuccess, onCancel);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <BasicInfoSection form={form} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <EmployeesSection 
            form={form} 
            employees={employees} 
            selectedEmployeeIds={selectedEmployeeIds}
            removeEmployee={removeEmployee}
          />
        </div>
        
        <DateSection form={form} />
        <DescriptionSection form={form} />
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default NewTrainingForm;
