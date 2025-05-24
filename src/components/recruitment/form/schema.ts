
import * as z from "zod";

export const recruitmentFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  department: z.string().min(1, "Le département est requis"),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  location: z.string().optional(),
  contractType: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  candidateName: z.string().optional(),
  nextStep: z.string().optional(),
});

export type RecruitmentFormValues = z.infer<typeof recruitmentFormSchema>;
