
import React from "react";
import { Form } from "@/components/ui/form";
import { Project } from "@/types/project";
import { useProjectForm } from "./hooks/useProjectForm";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { DateFields } from "./fields/DateFields";
import { StatusAndBudgetFields } from "./fields/StatusAndBudgetFields";
import { FormActions } from "./FormActions";

type ProjectFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<Project>;
};

export function ProjectForm({ onSuccess, onCancel, initialData }: ProjectFormProps) {
  const { form, onSubmit, isSubmitting } = useProjectForm({
    initialData,
    onSuccess,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <BasicInfoFields form={form} />
        <DateFields form={form} />
        <StatusAndBudgetFields form={form} />
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
