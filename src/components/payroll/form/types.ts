
import { z } from "zod";
import { payslipFormSchema } from "./schema";

export type PayslipFormValues = z.infer<typeof payslipFormSchema>;

export interface Period {
  id: string;
  label: string;
}
