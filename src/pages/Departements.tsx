
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Department } from "@/types/firebase";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import NewDepartmentDialog from "@/components/departments/NewDepartmentDialog";
import EditDepartmentDialog from "@/components/departments/EditDepartmentDialog";
import DeleteDepartmentConfirmDialog from "@/components/departments/DeleteDepartmentConfirmDialog";
import ViewDepartmentDialog from "@/components/departments/ViewDepartmentDialog";
import DepartmentsHeader from "@/components/departments/DepartmentsHeader";
import DepartmentsStats from "@/components/departments/DepartmentsStats";
import DepartmentsTable from "@/components/departments/DepartmentsTable";
import DepartmentsDebugInfo from "@/components/departments/DepartmentsDebugInfo";

const Departements = () => {
  const { toast } = useToast();
  const { departments, isLoading, error, refetch } = useDepartmentsData();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0
  });

  // Update stats when departments change
  useEffect(() => {
    if (departments) {
      setStats({
        total: departments.length,
        active: departments.length, // Assuming all departments are active for now
        pending: 0,
        expired: 0
      });
    }
  }, [departments]);

  // Debug pour voir ce qui se passe avec les données
  useEffect(() => {
    console.log("Departments page - Current state:", { 
      departmentsCount: departments?.length,
      isLoading,
      hasError: !!error
    });
  }, [departments, isLoading, error]);

  const handleNewDepartment = () => {
    setIsNewDialogOpen(true);
  };

  const handleEdit = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setSelectedDepartment(department);
      setIsEditDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Département non trouvé"
      });
    }
  };

  const handleDelete = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setSelectedDepartment(department);
      setIsDeleteDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Département non trouvé"
      });
    }
  };

  const handleView = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (department) {
      setSelectedDepartment(department);
      setIsViewDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Département non trouvé"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with title and button */}
      <DepartmentsHeader onNewDepartment={handleNewDepartment} />

      {/* Status Cards */}
      <DepartmentsStats stats={stats} />

      {/* Departments table */}
      <DepartmentsTable
        departments={departments}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Debug info */}
      <DepartmentsDebugInfo count={departments.length} />

      {/* Dialogs */}
      <NewDepartmentDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onSuccess={refetch}
      />

      <EditDepartmentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        department={selectedDepartment}
        onSuccess={refetch}
      />

      <DeleteDepartmentConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        department={selectedDepartment}
        onSuccess={refetch}
      />

      <ViewDepartmentDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        department={selectedDepartment}
      />
    </div>
  );
};

export default Departements;
