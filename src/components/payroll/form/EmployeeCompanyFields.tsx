
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { type UseFormReturn } from "react-hook-form";
import { type PayslipFormValues } from "./usePayslipForm";

interface EmployeeCompanyFieldsProps {
  form: UseFormReturn<PayslipFormValues>;
  employees: { id: string; name: string }[];
  companies: { id?: string; name: string }[];
  employeesLoading: boolean;
  companiesLoading: boolean;
}

const EmployeeCompanyFields: React.FC<EmployeeCompanyFieldsProps> = ({
  form,
  employees,
  companies,
  employeesLoading,
  companiesLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="employee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employé</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={employeesLoading}
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
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entreprise</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={companiesLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id || ""}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};

export default EmployeeCompanyFields;
