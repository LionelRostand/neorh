
import { generatePayslipPdf as generatePayslip } from './payslip';
import { PayslipData } from './payslip/types';

// Re-export the payslip generator with the same interface for backward compatibility
export const generatePayslipPdf = (data: PayslipData) => {
  return generatePayslip(data);
};

// Re-export the types
export type { PayslipData } from './payslip/types';
