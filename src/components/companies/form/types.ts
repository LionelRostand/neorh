
import { z } from "zod";

// Schéma de validation pour le formulaire
export const companyFormSchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis"),
  industry: z.string().optional(),
  email: z.string().email("Format d'email invalide").optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
  type: z.string().default("client"),
  status: z.string().default("active"),
  registrationDate: z.string().default(() => new Date().toISOString().split('T')[0]),
  logoUrl: z.string().optional()
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export interface CompanyFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}
