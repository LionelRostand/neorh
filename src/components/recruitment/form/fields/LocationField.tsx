
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { RecruitmentFormValues } from "../schema";

const LocationField = () => {
  const form = useFormContext<RecruitmentFormValues>();

  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Lieu</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Paris, France" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
