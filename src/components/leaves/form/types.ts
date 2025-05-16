
export interface LeaveFormValues {
  employeeId: string;
  type: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  comment: string;
  daysAllocated?: number;
  paidDaysAllocated?: number;
  rttDaysAllocated?: number;
  isAllocation?: boolean; // Pour différencier entre demande de congé et allocation
}
