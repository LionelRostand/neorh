
import { z } from 'zod';

export const employeeFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
  email: z.string().email({
    message: "Email invalide",
  }),
  phone: z.string().min(10, {
    message: "Numéro de téléphone invalide",
  }),
  birthDate: z.date({
    required_error: "La date de naissance est requise",
  }),
  streetNumber: z.string().min(1, {
    message: "Le numéro de rue est requis",
  }),
  streetName: z.string().min(2, {
    message: "Le nom de rue est requis",
  }),
  city: z.string().min(2, {
    message: "La ville est requise",
  }),
  postalCode: z.string().min(5, {
    message: "Le code postal est requis",
  }),
  department: z.string().min(1, {
    message: "Le département est requis",
  }),
  company: z.string().min(1, {
    message: "L'entreprise est requise",
  }),
  position: z.string().min(2, {
    message: "Le poste est requis",
  }),
  professionalEmail: z.string().email({
    message: "Email professionnel invalide",
  }).optional(),
  managerId: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
