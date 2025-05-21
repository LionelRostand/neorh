
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TrainingFormValues } from "../trainingSchema";
import { X } from "lucide-react";

interface EmployeesSectionProps {
  form: UseFormReturn<TrainingFormValues>;
  employees: Array<{ id: string; name: string }>;
  selectedEmployeeIds: string[];
  removeEmployee: (id: string) => void;
}

export const EmployeesSection = ({ 
  form, 
  employees, 
  selectedEmployeeIds, 
  removeEmployee 
}: EmployeesSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="employees"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Employé *</FormLabel>
          <div className="grid grid-cols-1">
            <Select
              onValueChange={(value) => {
                const currentValues = field.value || [];
                if (!currentValues.includes(value)) {
                  field.onChange([...currentValues, value]);
                }
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedEmployeeIds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedEmployeeIds.map((id) => {
                const emp = employees.find((e) => e.id === id);
                return (
                  <div
                    key={id}
                    className="bg-blue-50 text-blue-700 text-sm px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    {emp?.name || id}
                    <button
                      type="button"
                      onClick={() => removeEmployee(id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
