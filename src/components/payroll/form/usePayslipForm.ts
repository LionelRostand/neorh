
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useCompaniesData } from "@/hooks/useCompaniesData";
import useContractsList from "@/hooks/contracts/useContractsList";
import { toast } from "@/components/ui/use-toast";
import { payslipFormSchema } from "./schema";

export type PayslipFormValues = z.infer<typeof payslipFormSchema>;

export const usePayslipForm = () => {
  const [salaryValue, setSalaryValue] = useState<string>("");
  
  // Data loading hooks
  const { employees, isLoading: employeesLoading } = useEmployeeData();
  const { companies, isLoading: companiesLoading } = useCompaniesData();
  const { contracts, loading: contractsLoading } = useContractsList();

  // Initialize form with zod resolver
  const form = useForm<PayslipFormValues>({
    resolver: zodResolver(payslipFormSchema),
    defaultValues: {
      employee: "",
      company: "",
      period: "",
      annualSalary: "",
      overtimeHours: "",
      overtimeRate: "25",
    },
  });

  // Update salary when employee selection changes
  useEffect(() => {
    const employeeId = form.getValues("employee");
    if (employeeId && contracts && contracts.length > 0) {
      // Search for the active contract for the selected employee
      const employeeContract = contracts.find(
        (contract) => contract.employeeId === employeeId && contract.status === "active"
      );
      
      if (employeeContract && employeeContract.salary) {
        const formattedSalary = typeof employeeContract.salary === 'number' 
          ? `${employeeContract.salary} €` 
          : `${employeeContract.salary}`;
        setSalaryValue(formattedSalary);
        form.setValue("annualSalary", formattedSalary);
      } else {
        setSalaryValue("Aucun contrat actif trouvé");
        form.setValue("annualSalary", "");
      }
    } else {
      setSalaryValue("");
      form.setValue("annualSalary", "");
    }
  }, [form.watch("employee"), contracts, form]);

  // Generate periods for the dropdown
  const generateMonthlyPeriods = () => {
    const periods = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Generate periods for current and next year
    for (let year = currentYear; year <= currentYear + 1; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1);
        const monthName = date.toLocaleDateString('fr-FR', { month: 'long' });
        const periodId = `${year}-${month + 1}`;
        const periodLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
        periods.push({ id: periodId, label: periodLabel });
      }
    }
    return periods;
  };

  const periods = generateMonthlyPeriods();

  // Form submission handler
  const onSubmit = (data: PayslipFormValues) => {
    // Get full names for the toast display
    const employeeName = employees.find(e => e.id === data.employee)?.name || data.employee;
    const periodLabel = periods.find(p => p.id === data.period)?.label || data.period;
    
    toast({
      title: "Fiche de paie générée",
      description: `Fiche de paie pour ${employeeName} - Période: ${periodLabel}`,
    });
  };

  return {
    form,
    onSubmit,
    employees,
    companies,
    periods,
    salaryValue,
    employeesLoading,
    companiesLoading,
    contractsLoading
  };
};
