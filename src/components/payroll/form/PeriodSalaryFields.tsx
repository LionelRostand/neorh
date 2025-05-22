
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { type UseFormReturn } from "react-hook-form";
import { type PayslipFormValues } from "./types";

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
            <FormMessage />
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
                placeholder={
                  contractsLoading 
                    ? "Chargement..." 
                    : salaryValue || "Sélectionnez un employé pour afficher le salaire"
                }
                {...field}
                value={salaryValue}
                disabled
                className={salaryValue === "Aucun contrat actif trouvé" || salaryValue === "Erreur lors de la récupération du salaire" ? "text-red-500" : ""}
              />
            </FormControl>
            {(salaryValue === "Aucun contrat actif trouvé" || salaryValue === "Erreur lors de la récupération du salaire") && (
              <p className="text-xs text-red-500 mt-1">
                Aucun salaire trouvé pour cet employé. Vérifiez son contrat actif.
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PeriodSalaryFields;
