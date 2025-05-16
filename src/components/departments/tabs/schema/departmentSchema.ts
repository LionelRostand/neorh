
import * as z from 'zod';

// Define colors
export const DEPARTMENT_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#EF4444', // red
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6B7280', // gray
  '#111827', // dark
];

// Define the form schema with zod
export const departmentFormSchema = z.object({
  name: z.string().min(1, { message: 'Le nom du département est requis' }),
  description: z.string().optional(),
  managerId: z.string().optional(),
  companyId: z.string().optional(),
  color: z.string().optional(),
  parentDepartmentId: z.string().optional(), // Added parent department field
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
