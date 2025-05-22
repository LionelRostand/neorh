
import { Employee } from '@/types/employee';
import { Company } from '@/types/company';
import { LeaveAllocation } from '@/hooks/leaves/types';

/**
 * Data structure for payslip generation
 */
export interface PayslipData {
  employee: Employee;
  company: Company;
  period: string;
  annualSalary: string;
  overtimeHours?: string;
  overtimeRate?: string;
  date?: Date;
  leaveAllocation?: LeaveAllocation;
}

/**
 * Social contribution calculation data
 */
export interface SocialContribution {
  name: string;
  base: number;
  rate: number;
  amount: number;
}

/**
 * Result of the payslip generation process
 */
export interface PayslipResult {
  fileName: string;
  pdfBlob: Blob;
  saveToFile: () => void;
}

/**
 * Leave balances structure
 */
export interface LeaveBalances {
  paidLeaves: {
    acquis: number;
    pris: number;
    restant: number;
  };
  rtt: {
    acquis: number;
    pris: number;
    restant: number;
  };
}
