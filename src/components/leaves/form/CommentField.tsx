
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
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
              {...field}
              className="resize-none"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
