
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { LeaveFormValues } from "./types";

interface CommentFieldProps {
  form: UseFormReturn<LeaveFormValues>;
}

export function CommentField({ form }: CommentFieldProps) {
  return (
    <FormField
      control={form.control}
      name="comment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Motif (optionnel)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Entrez votre motif ici..." 
              className="resize-none" 
              {...field} 
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
