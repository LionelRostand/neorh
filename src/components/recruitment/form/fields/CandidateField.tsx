
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { RecruitmentFormValues } from "../schema";

const CandidateField = () => {
  const form = useFormContext<RecruitmentFormValues>();

  return (
    <FormField
      control={form.control}
      name="candidateName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom du candidat (optionnel)</FormLabel>
          <FormControl>
            <Input 
              placeholder="Nom et prénom du candidat"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CandidateField;
