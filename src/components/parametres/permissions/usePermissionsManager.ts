
import { useState, useEffect } from "react";
import { useFirestore } from "@/hooks/firestore";
import { Employee } from "@/types/firebase";
import { Permission, MENU_ITEMS } from "./types";
import { toast } from "@/components/ui/use-toast";

export const usePermissionsManager = () => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { getAll, add, update, search } = useFirestore<Permission>('permissions');
  const employeesFirestore = useFirestore<Employee>('employees');
  
  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        const employeesResult = await employeesFirestore.getAll();
        setEmployees(employeesResult.docs);
        
        if (employeesResult.docs.length > 0) {
          setSelectedEmployeeId(employeesResult.docs[0].id || "");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des employés",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEmployees();
  }, []);

  // Load permissions when employee is selected
  useEffect(() => {
    if (!selectedEmployeeId) return;
    
    const loadPermissions = async () => {
      try {
        setIsLoading(true);
        const permissionsResult = await search("employeeId", selectedEmployeeId, {
          orderByField: "menuName",
          orderDirection: "asc"
        });
        
        if (permissionsResult.docs.length > 0) {
          setPermissions(permissionsResult.docs);
        } else {
          // Create default permissions for new employee
          const defaultPermissions = MENU_ITEMS.map(menu => ({
            menuName: menu,
            canView: menu === "Tableau de bord", // Only dashboard view by default
            canCreate: false,
            canEdit: false,
            canDelete: false,
            employeeId: selectedEmployeeId
          }));
          setPermissions(defaultPermissions);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des permissions:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les permissions de l'employé",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPermissions();
  }, [selectedEmployeeId]);

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };
  
  const handlePermissionChange = (menuIndex: number, permissionType: keyof Omit<Permission, 'id' | 'menuName' | 'employeeId'>, value: boolean) => {
    setPermissions(prev => {
      const newPermissions = [...prev];
      newPermissions[menuIndex] = {
        ...newPermissions[menuIndex],
        [permissionType]: value
      };
      
      // If canView is unchecked, uncheck all other permissions
      if (permissionType === 'canView' && !value) {
        newPermissions[menuIndex].canCreate = false;
        newPermissions[menuIndex].canEdit = false;
        newPermissions[menuIndex].canDelete = false;
      }
      
      // If another permission is checked, ensure canView is also checked
      if (permissionType !== 'canView' && value) {
        newPermissions[menuIndex].canView = true;
      }
      
      return newPermissions;
    });
  };

  const savePermissions = async () => {
    if (!selectedEmployeeId) {
      toast({
        title: "Erreur",
        description: "Aucun employé sélectionné",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      for (const permission of permissions) {
        if (permission.id) {
          await update(permission.id, permission);
        } else {
          await add(permission);
        }
      }
      
      toast({
        title: "Succès",
        description: "Les permissions ont été enregistrées avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des permissions",
        variant: "destructive"
      });
      console.error("Error saving permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Employé inconnu";
  };

  return {
    selectedEmployeeId,
    employees,
    permissions,
    isLoading,
    handleEmployeeChange,
    handlePermissionChange,
    savePermissions,
    getEmployeeName
  };
};
