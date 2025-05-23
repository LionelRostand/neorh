
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

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
  // Vérifier si le salaire provient de l'Article 4 du contrat
  const isSalaryFromContract = salaryValue && 
    !["Chargement du salaire...", "Aucun contrat actif trouvé", "Erreur lors de la récupération du salaire", "Salaire non spécifié dans le contrat"].includes(salaryValue);

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
            <FormLabel className="flex items-center gap-2">
              Salaire brut annuel
              {isSalaryFromContract && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Récupéré de l'Article 4 - Rémunération du contrat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </FormLabel>
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
                className={salaryValue === "Aucun contrat actif trouvé" || salaryValue === "Erreur lors de la récupération du salaire" ? "text-red-500" : isSalaryFromContract ? "text-green-700 font-medium" : ""}
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
