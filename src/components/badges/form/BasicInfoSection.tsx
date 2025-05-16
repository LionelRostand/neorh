
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BadgeFormValues } from "./FormSchema";

interface BasicInfoSectionProps {
  form: UseFormReturn<BadgeFormValues>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <FormField
      control={form.control}
      name="number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Numéro de badge</FormLabel>
          <FormControl>
            <Input 
              placeholder="Ex: B-12345" 
              {...field} 
              className="bg-gray-50"
              readOnly
              disabled
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
