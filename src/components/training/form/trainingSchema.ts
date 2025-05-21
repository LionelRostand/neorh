
import { z } from "zod";

export const trainingSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.string().min(1, "Le type est requis"),
  organization: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date({ required_error: "La date de début est requise" }),
  endDate: z.date().optional(),
  description: z.string().optional(),
  employees: z.array(z.string()).min(1, "Au moins un employé est requis"),
});

export type TrainingFormValues = z.infer<typeof trainingSchema>;

export const trainingTypes = [
  { value: "technique", label: "Technique" },
  { value: "management", label: "Management" },
  { value: "communication", label: "Communication" },
  { value: "securite", label: "Sécurité" },
  { value: "informatique", label: "Informatique" },
  { value: "langue", label: "Langue" },
  { value: "autre", label: "Autre" },
];
