
// Main employee authentication service - exports all employee auth functionality
export { createEmployeeAccount } from './employee/employeeAccountService';
export { verifyAndCreateEmployeeLogin } from './employee/employeeVerificationService';
export { updateEmployeePassword } from './employee/employeePasswordService';

// Re-export types for convenience
export type { 
  EmployeePasswordData, 
  CreateEmployeeAccountResult, 
  VerifyEmployeeLoginResult, 
  UpdateEmployeePasswordResult 
} from '@/types/employeeAuth';
