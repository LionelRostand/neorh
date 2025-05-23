
import React from 'react';
import { AddBadgeDialog } from '@/components/badges/AddBadgeDialog';
import { Employee } from '@/types/employee';

interface BadgeDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  employees: Employee[];
  onSuccess: () => void;
  isLoadingEmployees: boolean;
}

const BadgeDialogs: React.FC<BadgeDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  employees,
  onSuccess,
  isLoadingEmployees
}) => {
  return (
    <AddBadgeDialog 
      open={isAddDialogOpen}
      onOpenChange={setIsAddDialogOpen}
      employees={employees}
      onSuccess={onSuccess}
      isLoadingEmployees={isLoadingEmployees}
    />
  );
};

export default BadgeDialogs;
