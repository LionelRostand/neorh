
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaveAllocationForm from "./LeaveAllocationForm";
import NewLeaveRequestForm from "../NewLeaveRequestForm";

interface LeaveUnifiedAllocationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  employeeId?: string;
  canAllocateSimple?: boolean;
}

const LeaveUnifiedAllocationForm: React.FC<LeaveUnifiedAllocationFormProps> = ({
  open,
  onClose,
  onSuccess,
  employeeId,
  canAllocateSimple = true,
}) => {
  const [activeTab, setActiveTab] = useState<string>("simple");

  // Gérer la fermeture du dialog
  const handleDialogClose = () => {
    onClose();
    // Réinitialiser à l'onglet par défaut à la fermeture
    setActiveTab("simple");
  };

  // Gérer le succès de l'action
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  // Déterminer l'onglet par défaut en fonction des permissions
  React.useEffect(() => {
    if (open) {
      setActiveTab(canAllocateSimple ? "simple" : "period");
    }
  }, [open, canAllocateSimple]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Attribution de congés</DialogTitle>
          <DialogDescription>
            Choisissez le type d'attribution que vous souhaitez effectuer
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {canAllocateSimple && (
              <TabsTrigger value="simple">Attribution simple</TabsTrigger>
            )}
            <TabsTrigger value="period" className={canAllocateSimple ? "" : "col-span-2"}>
              Attribution sur période
            </TabsTrigger>
          </TabsList>

          {canAllocateSimple && (
            <TabsContent value="simple" className="mt-4">
              <LeaveAllocationForm
                open={open && activeTab === "simple"}
                onClose={handleDialogClose}
                onSuccess={handleSuccess}
                employeeId={employeeId}
                embedded={true}
              />
            </TabsContent>
          )}

          <TabsContent value="period" className="mt-4">
            <NewLeaveRequestForm
              open={open && activeTab === "period"}
              onClose={handleDialogClose}
              onSuccess={handleSuccess}
              employeeId={employeeId}
              isAllocation={true}
              embedded={true}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveUnifiedAllocationForm;
