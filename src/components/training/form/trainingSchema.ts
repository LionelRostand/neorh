
import { z } from "zod";

export const trainingTypes = [
  { value: "technical", label: "Technique" },
  { value: "soft_skills", label: "Compétences douces" },
  { value: "management", label: "Management" },
  { value: "compliance", label: "Conformité" },
  { value: "security", label: "Sécurité" },
  { value: "other", label: "Autre" },
];

export const trainingSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.string().min(1, "Le type est requis"),
  organization: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["planifiée", "complétée", "annulée"]),
  startDate: z.date({
    required_error: "La date de début est requise",
  }),
  endDate: z.date().optional(),
  employees: z.array(z.string()).default([])
});

export type TrainingFormValues = z.infer<typeof trainingSchema>;
