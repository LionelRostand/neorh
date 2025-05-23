
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { badgeFormSchema, BadgeFormValues } from "./FormSchema";
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
    resolver: zodResolver(badgeFormSchema),
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

  // Synchroniser le numéro de badge généré avec le formulaire
  useEffect(() => {
    if (generatedBadgeNumber && !isEditMode) {
      form.setValue("number", generatedBadgeNumber);
    }
  }, [generatedBadgeNumber, form, isEditMode]);

  // Assurer que le numéro de badge reste celui généré automatiquement
  const handleSubmit = (data: BadgeFormValues) => {
    onSubmit({
      ...data,
      number: generatedBadgeNumber,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicInfoSection form={form} generatedBadgeNumber={generatedBadgeNumber} />
        <EmployeeSection form={form} employees={employees} isLoading={isLoading} />
        <TypeSection form={form} isLoading={isLoading} />
        <StatusSection form={form} isLoading={isLoading} />
        <DateSection form={form} />
        <NotesSection form={form} />
        <FormActions
          onCancel={onCancel}
          submitLabel={isEditMode ? "Mettre à jour" : "Créer le badge"}
        />
      </form>
    </Form>
  );
}
