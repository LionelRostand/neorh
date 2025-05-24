
export interface EmployeePasswordData {
  employeeId: string;
  email: string;
  password: string;
}

export interface CreateEmployeeAccountResult {
  success: boolean;
  error?: string;
  userId?: string;
}

export interface VerifyEmployeeLoginResult {
  success: boolean;
  error?: string;
  message?: string;
  isNewAccount?: boolean;
  defaultPassword?: string;
}

export interface UpdateEmployeePasswordResult {
  success: boolean;
  error?: string;
}
