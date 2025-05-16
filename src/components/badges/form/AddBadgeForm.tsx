
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/types/firebase";
import { Form } from "@/components/ui/form";
import { badgeFormSchema, BadgeFormValues } from "./FormSchema";
import { BasicInfoSection } from "./BasicInfoSection";
import { EmployeeSection } from "./EmployeeSection";
import { TypeSection } from "./TypeSection";
import { DateSection } from "./DateSection";
import { StatusSection } from "./StatusSection";
import { NotesSection } from "./NotesSection";
import { FormActions } from "./FormActions";

interface AddBadgeFormProps {
  onSubmit: (data: BadgeFormValues) => void;
  onCancel: () => void;
  employees: Employee[];
  isLoading: boolean;
}

export function AddBadgeForm({
  onSubmit,
  onCancel,
  employees,
  isLoading,
}: AddBadgeFormProps) {
  const form = useForm<BadgeFormValues>({
    resolver: zodResolver(badgeFormSchema),
    defaultValues: {
      status: "active",
      issueDate: new Date(),
    },
  });

  const handleSubmit = (data: BadgeFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicInfoSection form={form} />
        <EmployeeSection form={form} employees={employees} isLoading={isLoading} />
        <TypeSection form={form} isLoading={isLoading} />
        <DateSection form={form} />
        <StatusSection form={form} isLoading={isLoading} />
        <NotesSection form={form} />
        <FormActions onCancel={onCancel} />
      </form>
    </Form>
  );
}
