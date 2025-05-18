
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { RecruitmentFormValues } from "../schema";

const TitleField = () => {
  const form = useFormContext<RecruitmentFormValues>();

  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Titre du poste</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Développeur Frontend" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TitleField;
