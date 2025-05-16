
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Building2, Users, ChartBar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EmployeesHierarchy from "@/components/hierarchy/EmployeesHierarchy";
import DepartmentsHierarchy from "@/components/hierarchy/DepartmentsHierarchy";
import HierarchyStatCard from "@/components/hierarchy/HierarchyStatCard";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import { useEmployeeData } from "@/hooks/useEmployeeData";

const Hierarchie = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [viewMode, setViewMode] = useState<"employees" | "departments">("employees");
  const [showAssociatedDepts, setShowAssociatedDepts] = useState(false);
  const { toast } = useToast();
  const { departments, isLoading: isLoadingDepartments } = useDepartmentsData();
  const { employees } = useEmployeeData();
  
  // Calculate statistics for the hierarchy view - memoize calculations to prevent unnecessary recalculations
  const totalDepartments = departments?.length || 0;
  
  const managerCount = employees?.filter(emp => 
    employees.some(other => other.managerId === emp.id)
  ).length || 0;
  
  const employeeCount = employees?.length || 0;
  
  // Calculate vacant positions (if a department has no manager)
  const vacantPositions = departments?.filter(dept => 
    !employees?.some(emp => emp.id === dept.managerId)
  ).length || 0;

  const handleExportImport = useCallback(() => {
    toast({
      title: "Fonctionnalité d'export/import",
      description: "Cette fonctionnalité sera disponible prochainement.",
    });
  }, [toast]);

  const handlePrintHierarchy = useCallback(() => {
    toast({
      title: "Impression de l'organigramme",
      description: "L'impression de l'organigramme sera disponible prochainement.",
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Organigramme de l'Entreprise</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HierarchyStatCard 
          title="Total des départements" 
          value={totalDepartments} 
          icon={<ChartBar className="h-5 w-5" />} 
          bgColor="bg-blue-50"
          textColor="text-blue-700"
          borderColor="border-blue-100"
          iconColor="text-blue-500"
        />
        <HierarchyStatCard 
          title="Responsables" 
          value={managerCount} 
          icon={<ChartBar className="h-5 w-5" />} 
          bgColor="bg-indigo-50"
          textColor="text-indigo-700"
          borderColor="border-indigo-100"
          iconColor="text-indigo-500"
        />
        <HierarchyStatCard 
          title="Employés" 
          value={employeeCount} 
          icon={<ChartBar className="h-5 w-5" />} 
          bgColor="bg-green-50"
          textColor="text-green-700"
          borderColor="border-green-100"
          iconColor="text-green-500"
        />
        <HierarchyStatCard 
          title="Postes vacants" 
          value={vacantPositions} 
          icon={<ChartBar className="h-5 w-5" />} 
          bgColor="bg-yellow-50"
          textColor="text-yellow-700"
          borderColor="border-yellow-100"
          iconColor="text-yellow-500"
        />
      </div>

      {/* View Type Toggle */}
      <div className="flex items-center space-x-2">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <Button
            variant={viewMode === "employees" ? "default" : "ghost"}
            className={`flex items-center ${viewMode === "employees" ? "" : "text-gray-600 bg-transparent"}`}
            onClick={() => setViewMode("employees")}
          >
            <Users className="h-4 w-4 mr-2" />
            Hiérarchie des Employés
          </Button>
          <Button
            variant={viewMode === "departments" ? "default" : "ghost"}
            className={`flex items-center ${viewMode === "departments" ? "" : "text-gray-600 bg-transparent"}`}
            onClick={() => setViewMode("departments")}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Hiérarchie des Départements
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium">Structure Hiérarchique</h2>
          {viewMode === "employees" && (
            <>
              <Select 
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                disabled={isLoadingDepartments}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments && departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAssociatedDepts(!showAssociatedDepts)}
                className={showAssociatedDepts ? "bg-indigo-50 text-indigo-700 border-indigo-300" : ""}
              >
                <Building2 className="h-4 w-4 mr-2" />
                {showAssociatedDepts ? "Masquer départements" : "Montrer départements"}
              </Button>
            </>
          )}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrintHierarchy}>
            <Download className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" onClick={handleExportImport}>
            <FileText className="h-4 w-4 mr-2" />
            Exporter / Importer
          </Button>
        </div>
      </div>

      {/* Hierarchy Chart */}
      <div className="border rounded-lg bg-white p-6 overflow-x-auto">
        {viewMode === "employees" ? (
          <EmployeesHierarchy 
            departmentFilter={selectedDepartment} 
            showDepartments={showAssociatedDepts}
          />
        ) : (
          <DepartmentsHierarchy />
        )}
      </div>
    </div>
  );
};

export default Hierarchie;
