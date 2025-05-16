
import { z } from 'zod';

export const editEmployeeFormSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  phone: z.string().optional(),
  position: z.string().min(1, { message: "Le poste est requis" }),
  department: z.string(),
  status: z.enum(['active', 'inactive', 'onLeave']),
  startDate: z.date().optional(),
  photoUrl: z.string().optional(),
  managerId: z.string().optional(),
  professionalEmail: z.string().optional(),
});

export type EmployeeEditFormValues = z.infer<typeof editEmployeeFormSchema>;
