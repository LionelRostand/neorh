
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Department } from '@/types/firebase';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from '@/components/ui/use-toast';
import DepartmentInformationTab, { DepartmentFormValues } from './tabs/DepartmentInformationTab';
import DepartmentEmployeesTab from './tabs/DepartmentEmployeesTab';

interface EditDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSuccess?: () => void;
}

const EditDepartmentDialog: React.FC<EditDepartmentDialogProps> = ({
  open,
  onOpenChange,
  department,
  onSuccess
}) => {
  const { update, isLoading } = useFirestore<Department>('hr_departments');
  const [activeTab, setActiveTab] = useState("informations");
  
  const handleSubmit = async (values: DepartmentFormValues) => {
    if (!department?.id) return;
    
    try {
      const success = await update(department.id, values);
      
      if (success) {
        toast({
          title: "Département modifié",
          description: "Le département a été mis à jour avec succès"
        });
        
        if (onSuccess) onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du département:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du département"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le département</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="employes">Employés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations">
            <DepartmentInformationTab
              department={department}
              isLoading={isLoading}
              onOpenChange={onOpenChange}
              onSubmit={handleSubmit}
            />
          </TabsContent>
          
          <TabsContent value="employes">
            <DepartmentEmployeesTab
              onOpenChange={onOpenChange}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
