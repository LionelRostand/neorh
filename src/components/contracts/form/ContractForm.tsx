
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";

import EmployeeField from "./fields/EmployeeField";
import DepartmentField from "./fields/DepartmentField";
import PositionField from "./fields/PositionField";
import ContractTypeField from "./fields/ContractTypeField";
import SalaryField from "./fields/SalaryField";
import DateFields from "./fields/DateFields";
import FormFooter from "./components/FormFooter";
import { contractFormSchema, ContractFormValues } from "./schema";

interface ContractFormProps {
  onCancel: () => void;
  onSubmit: (data: ContractFormValues) => void;
  isSubmitting?: boolean;
}

export default function ContractForm({ onCancel, onSubmit, isSubmitting = false }: ContractFormProps) {
  const { employees } = useEmployeeData();
  const { departments } = useDepartmentsData();

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      position: "",
      salary: "",
      type: "CDI",
    },
  });

  const handleSubmit = (values: ContractFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <EmployeeField form={form} employees={employees} />
        <DepartmentField form={form} departments={departments} />
        <PositionField form={form} />
        <ContractTypeField form={form} />
        <SalaryField form={form} />
        <DateFields form={form} />
        <FormFooter onCancel={onCancel} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
