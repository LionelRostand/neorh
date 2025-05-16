
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { BadgeFormSchema, BadgeFormValues } from "./FormSchema";
import { BasicInfoSection } from "./BasicInfoSection";
import { EmployeeSection } from "./EmployeeSection";
import { TypeSection } from "./TypeSection";
import { StatusSection } from "./StatusSection";
import { DateSection } from "./DateSection";
import { NotesSection } from "./NotesSection";
import { FormActions } from "./FormActions";
import { Employee } from "@/types/employee";

interface AddBadgeFormProps {
  onSubmit: (data: BadgeFormValues) => void;
  onCancel: () => void;
  employees: Employee[];
  isLoading: boolean;
  generatedBadgeNumber: string;
  defaultValues?: BadgeFormValues;
  isEditMode?: boolean;
}

export function AddBadgeForm({
  onSubmit,
  onCancel,
  employees,
  isLoading,
  generatedBadgeNumber,
  defaultValues,
  isEditMode = false,
}: AddBadgeFormProps) {
  const form = useForm<BadgeFormValues>({
    resolver: zodResolver(BadgeFormSchema),
    defaultValues: defaultValues || {
      number: generatedBadgeNumber,
      employeeId: "",
      type: "standard",
      status: "active",
      issueDate: new Date(),
      expiryDate: undefined,
      notes: "",
    },
  });

  const handleSubmit = (data: BadgeFormValues) => {
    onSubmit({
      ...data,
      number: generatedBadgeNumber, // Assurer que le numéro reste celui généré
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicInfoSection form={form} />
        <EmployeeSection form={form} employees={employees} isLoading={isLoading} />
        <TypeSection form={form} />
        <StatusSection form={form} />
        <DateSection form={form} />
        <NotesSection form={form} />
        <FormActions
          onCancel={onCancel}
          isLoading={isLoading}
          submitLabel={isEditMode ? "Mettre à jour" : "Créer le badge"}
        />
      </form>
    </Form>
  );
}
