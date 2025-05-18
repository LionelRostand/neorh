
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import { RecruitmentFormValues } from "../schema";

const DepartmentField = () => {
  const form = useFormContext<RecruitmentFormValues>();
  const { departments, isLoading: loadingDepartments } = useDepartmentsData();

  return (
    <FormField
      control={form.control}
      name="department"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Département</FormLabel>
          <Select 
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={loadingDepartments}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments && departments.length > 0 ? (
                departments.map((dept) => (
                  <SelectItem 
                    key={dept.id} 
                    value={dept.id || `dept_${dept.name || Date.now()}`} // Ensure value is never empty
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
