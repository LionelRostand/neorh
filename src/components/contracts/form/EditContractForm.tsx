
import React from "react";
import { Contract } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editContractSchema, EditContractFormValues } from "./editSchema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import EmployeeNameField from "./fields/EmployeeNameField";
import PositionField from "./fields/PositionField";
import ContractTypeField from "./fields/ContractTypeField";
import StatusField from "./fields/StatusField";
import DateField from "./fields/DateField";

interface EditContractFormProps {
  contract: Contract | null;
  onSubmit: (data: EditContractFormValues) => Promise<void>;
  onCancel: () => void;
}

export default function EditContractForm({ 
  contract, 
  onSubmit, 
  onCancel 
}: EditContractFormProps) {
  // Initialize form with contract data
  const form = useForm<EditContractFormValues>({
    resolver: zodResolver(editContractSchema),
    defaultValues: {
      employeeName: contract?.employeeName || '',
      position: contract?.position || '',
      type: contract?.type || 'CDI',
      startDate: contract?.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
      endDate: contract?.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
      status: contract?.status || 'draft'
    },
    // Update form values when contract changes
    values: contract ? {
      employeeName: contract.employeeName || '',
      position: contract.position || '',
      type: contract.type || 'CDI',
      startDate: contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '',
      endDate: contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '',
      status: contract.status || 'draft'
    } : undefined
  });

  const handleSubmit = async (data: EditContractFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <EmployeeNameField control={form.control} />
        <PositionField control={form.control} />
        <ContractTypeField control={form.control} />

        <div className="grid grid-cols-2 gap-4">
          <DateField 
            control={form.control} 
            name="startDate" 
            label="Date de début" 
          />
          <DateField 
            control={form.control} 
            name="endDate" 
            label="Date de fin" 
            required={false} 
          />
        </div>

        <StatusField control={form.control} />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type="submit">Enregistrer les modifications</Button>
        </div>
      </form>
    </Form>
  );
}
