
import React, { useEffect, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import { RecruitmentFormValues } from "../schema";

const DepartmentField = () => {
  const form = useFormContext<RecruitmentFormValues>();
  const { departments, isLoading: loadingDepartments } = useDepartmentsData();
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("");

  // Mettre à jour le nom du département affiché quand la valeur change
  useEffect(() => {
    const currentDeptId = form.getValues("department");
    if (currentDeptId && departments) {
      const deptName = departments.find(dept => dept.id === currentDeptId)?.name;
      if (deptName) {
        setSelectedDepartmentName(deptName);
      }
    }
  }, [form, departments]);

  return (
    <FormField
      control={form.control}
      name="department"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Département</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              // Mettre à jour le nom affiché
              const deptName = departments.find(dept => dept.id === value)?.name;
              if (deptName) {
                setSelectedDepartmentName(deptName);
              }
            }}
            value={field.value}
            disabled={loadingDepartments}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département">
                  {selectedDepartmentName || "Sélectionner un département"}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments && departments.length > 0 ? (
                departments.map((dept) => (
                  <SelectItem 
                    key={dept.id} 
                    value={dept.id || ""} 
                  >
                    {dept.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  {loadingDepartments ? "Chargement..." : "Aucun département trouvé"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DepartmentField;
