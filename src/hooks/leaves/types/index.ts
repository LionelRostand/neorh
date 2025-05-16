
export interface LeaveAllocation {
  id?: string;
  employeeId: string;
  year: number;
  paidLeavesTotal: number;
  paidLeavesUsed: number;
  rttTotal: number;
  rttUsed: number;
  updatedAt: string;
  updatedBy?: string;
}
