
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BadgeFormValues } from "./FormSchema";

interface NotesSectionProps {
  form: UseFormReturn<BadgeFormValues>;
}

export function NotesSection({ form }: NotesSectionProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes (optionnel)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Informations supplémentaires..."
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
