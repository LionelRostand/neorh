
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { RecruitmentFormValues } from "../schema";

const NextStepField = () => {
  const form = useFormContext<RecruitmentFormValues>();

  return (
    <FormField
      control={form.control}
      name="nextStep"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Prochaine étape (optionnel)</FormLabel>
          <FormControl>
            <Input 
              placeholder="Ex: Entretien technique, Validation manager..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NextStepField;
