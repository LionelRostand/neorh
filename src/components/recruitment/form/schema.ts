
import * as z from "zod";

export const recruitmentFormSchema = z.object({
  title: z.string().min(2, { message: "Le titre doit comporter au moins 2 caractères" }),
  department: z.string().min(1, { message: "Le département est requis" }),
  description: z.string().optional(),
  location: z.string().optional(),
  contractType: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['ouverte', 'en_cours', 'entretiens', 'offre', 'fermée'])
});

export type RecruitmentFormValues = z.infer<typeof recruitmentFormSchema>;
