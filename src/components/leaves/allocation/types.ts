
import { LeaveAllocation } from "@/hooks/useEmployeeLeaves";

export interface LeaveAllocationManagerProps {
  allocation: LeaveAllocation | null;
  isLoading: boolean;
  onUpdate: (updates: Partial<LeaveAllocation>) => Promise<boolean>;
  employeeId: string;
}

export interface ManagerActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  setShowConfirmDialog: (show: boolean) => void;
  showConfirmDialog: boolean;
}
