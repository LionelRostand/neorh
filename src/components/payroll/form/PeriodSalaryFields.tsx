
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { type UseFormReturn } from "react-hook-form";
import { type PayslipFormValues } from "./usePayslipForm";

interface PeriodSalaryFieldsProps {
  form: UseFormReturn<PayslipFormValues>;
  periods: { id: string; label: string }[];
  salaryValue: string;
  contractsLoading: boolean;
}

const PeriodSalaryFields: React.FC<PeriodSalaryFieldsProps> = ({
  form,
  periods,
  salaryValue,
  contractsLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="period"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Période</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la période" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="annualSalary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salaire brut annuel</FormLabel>
            <FormControl>
              <Input 
                placeholder={contractsLoading ? "Chargement..." : "Salaire brut annuel récupéré depuis le contrat"} 
                {...field}
                value={salaryValue}
                disabled
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default PeriodSalaryFields;
