
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, UseFormSetValue } from "react-hook-form";
import { ContractFormValues } from "../schema";
import { CONTRACT_TYPES } from "../constants";

interface ContractTypeFieldProps {
  control: Control<ContractFormValues>;
  setValue: UseFormSetValue<ContractFormValues>;
}

export default function ContractTypeField({ control, setValue }: ContractTypeFieldProps) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de contrat</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              // If CDD is selected, ensure endDate is required
              if (value === 'CDD' || value === 'Interim' || value === 'Stage') {
                setValue('endDate', new Date(new Date().setMonth(new Date().getMonth() + 3)));
              }
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {CONTRACT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
