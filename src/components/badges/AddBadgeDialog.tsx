
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useFirestore } from "@/hooks/useFirestore";
import { Employee } from "@/types/employee";
import { Badge } from "@/types/firebase";
import { toast } from "@/components/ui/use-toast";
import { HR } from "@/lib/constants/collections";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddBadgeForm } from "./form/AddBadgeForm";
import { BadgeFormValues } from "./form/FormSchema";

interface AddBadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onSuccess: () => void;
  isLoadingEmployees: boolean;
}

export function AddBadgeDialog({
  open,
  onOpenChange,
  employees,
  onSuccess,
  isLoadingEmployees,
}: AddBadgeDialogProps) {
  const [generatedBadgeNumber, setGeneratedBadgeNumber] = useState("");
  
  // Using the HR.BADGES constant for collection name
  const { add, isLoading, getAll } = useFirestore<Badge>(HR.BADGES);

  // Generate badge number when dialog opens
  useEffect(() => {
    if (open) {
      generateBadgeNumber();
    }
  }, [open]);

  // Generate a badge number in the format B-XXXXX
  const generateBadgeNumber = async () => {
    try {
      // Get existing badges to ensure uniqueness
      const existingBadges = await getAll();
      const existingNumbers = existingBadges.docs?.map(badge => badge.number) || [];
      
      // Generate a unique number
      let newNumber;
      do {
        // Generate random 5-digit number
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        newNumber = `B-${randomNum}`;
      } while (existingNumbers.includes(newNumber));
      
      setGeneratedBadgeNumber(newNumber);
      console.log("Badge number generated:", newNumber);
    } catch (error) {
      console.error("Error generating badge number:", error);
      // Fallback to a timestamp-based number if there's an error
      const timestamp = new Date().getTime().toString().slice(-5);
      setGeneratedBadgeNumber(`B-${timestamp}`);
    }
  };

  const handleSubmit = async (data: BadgeFormValues) => {
    try {
      // Find selected employee to get their name
      const selectedEmployee = employees.find(
        (emp) => emp.id === data.employeeId
      );
      
      const employeeName = selectedEmployee ? selectedEmployee.name : "Unknown employee";

      // Prepare badge object to add to Firestore
      const badge: Partial<Badge> = {
        number: generatedBadgeNumber, // Use the generated number, not the one from the form
        employeeId: data.employeeId,
        type: data.type,
        status: data.status as "active" | "inactive" | "lost" | "pending",
        issueDate: format(data.issueDate, "dd/MM/yyyy"),
        notes: data.notes || "",
        employeeName
      };
      
      // Add expiration date only if defined and valid
      if (data.expiryDate && data.expiryDate instanceof Date) {
        badge.expiryDate = format(data.expiryDate, "dd/MM/yyyy");
      }

      console.log("Badge to create:", badge);

      // Add document to Firestore
      await add(badge as Badge);
      toast({
        title: "Badge created",
        description: `Badge ${generatedBadgeNumber} has been successfully created for ${employeeName}`,
      });
      
      // Close dialog and refresh data
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating badge:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the badge",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new badge</DialogTitle>
          <DialogDescription>
            Fill in the information to create an access badge
          </DialogDescription>
        </DialogHeader>
        <AddBadgeForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          employees={employees}
          isLoading={isLoading || isLoadingEmployees}
          generatedBadgeNumber={generatedBadgeNumber}
        />
      </DialogContent>
    </Dialog>
  );
}
