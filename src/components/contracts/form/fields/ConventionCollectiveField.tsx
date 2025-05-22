
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ContractFormValues } from "../schema";

interface ConventionCollectiveFieldProps {
  control: Control<ContractFormValues>;
}

export const ConventionCollectiveField: React.FC<ConventionCollectiveFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="conventionCollective"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Convention collective applicable</FormLabel>
          <FormControl>
            <Input 
              placeholder="Ex: Convention Collective Nationale des Bureaux d'Études Techniques (SYNTEC)" 
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
