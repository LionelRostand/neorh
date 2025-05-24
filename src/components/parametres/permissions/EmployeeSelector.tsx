
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee } from "@/types/employee";
import { UserCog } from "lucide-react";

interface EmployeeSelectorProps {
  employees: Employee[];
  selectedEmployeeId: string;
  onEmployeeChange: (employeeId: string) => void;
  isLoading: boolean;
}

const EmployeeSelector = ({ 
  employees, 
  selectedEmployeeId, 
  onEmployeeChange, 
  isLoading 
}: EmployeeSelectorProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="employee-select" className="block text-sm font-medium mb-2 flex items-center gap-2">
        <UserCog className="h-4 w-4" /> Sélectionner un employé
      </label>
      <Select 
        value={selectedEmployeeId || "no-selection"} 
        onValueChange={onEmployeeChange}
        disabled={isLoading || employees.length === 0}
      >
        <SelectTrigger className="w-full md:w-80">
          <SelectValue placeholder="Sélectionner un employé" />
        </SelectTrigger>
        <SelectContent>
          {employees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id || "employee-unknown"}>
              {employee.name} - {employee.position || "Sans poste"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmployeeSelector;
