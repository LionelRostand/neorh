
import * as z from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(2, "Le nom du projet doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["active", "pending", "completed", "canceled"]).default("pending"),
  budget: z.preprocess(
    // Convert empty string to undefined, otherwise parse as number
    (val) => val === "" ? undefined : Number(val),
    z.number().optional()
  ),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
