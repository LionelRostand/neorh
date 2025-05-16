
export interface LeaveFormValues {
  employeeId: string;
  type: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  comment: string;
  daysAllocated?: number;
  isAllocation?: boolean; // To differentiate between leave request and allocation
}
