
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UseFormReturn } from "react-hook-form";
import { type PayslipFormValues } from "./usePayslipForm";

interface OvertimeFieldsProps {
  form: UseFormReturn<PayslipFormValues>;
}

const OvertimeFields: React.FC<OvertimeFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="overtimeHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heures supplémentaires</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nombre d'heures supplémentaires"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="overtimeRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Majoration (%)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Selon le Code du travail français : 25% pour les 8 premières heures, 50% au-delà
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};

export default OvertimeFields;
