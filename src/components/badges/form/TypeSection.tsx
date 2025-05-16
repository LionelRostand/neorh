
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { badgeTypes } from "./FormSchema";
import { BadgeFormValues } from "./FormSchema";

interface TypeSectionProps {
  form: UseFormReturn<BadgeFormValues>;
  isLoading: boolean;
}

export function TypeSection({ form, isLoading }: TypeSectionProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Niveau d'accès</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un niveau d'accès" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {badgeTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
