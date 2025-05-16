
import { LeaveAllocation } from "@/hooks/leaves";

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

export interface AllocationCounterProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  isEditing: boolean;
  label: string;
  used: number;
  total: number;
  colorClass: string;
  iconBgClass: string;
  iconColorClass: string;
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSaving: boolean;
}

export { type AllocationFormValues } from "./hooks/useLeaveAllocationForm";
