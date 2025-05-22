
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useCompaniesData } from "@/hooks/useCompaniesData";
import useContractsList from "@/hooks/contracts/useContractsList";
import { toast } from "@/components/ui/use-toast";
import { payslipFormSchema } from "./schema";
import { generatePayslipPdf } from "@/utils/pdf/generatePayslipPdf";
import { PayslipFormValues } from "./types";
import { useSalaryFetcher } from "./hooks/useSalaryFetcher";
import { generateMonthlyPeriods } from "./utils/periodUtils";
import { savePayslipToFirestore } from "./services/payslipService";
import { useEmployeeLeaves } from "@/hooks/useEmployeeLeaves";

export { type PayslipFormValues } from "./types";

export const usePayslipForm = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Data loading hooks
  const { employees, isLoading: employeesLoading } = useEmployeeData();
  const { companies, isLoading: companiesLoading } = useCompaniesData();
  const { contracts, loading: contractsLoading } = useContractsList();

  // Employee leave allocation state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const { allocation } = useEmployeeLeaves(selectedEmployeeId);

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

  // Watch for employee changes to fetch leave allocation
  const employeeId = form.watch("employee");
  if (employeeId !== selectedEmployeeId) {
    setSelectedEmployeeId(employeeId);
  }

  // Get the periods for the dropdown
  const periods = generateMonthlyPeriods();

  // Use the salary fetcher hook
  const { salaryValue } = useSalaryFetcher(form, contracts);

  // Form submission handler
  const onSubmit = async (data: PayslipFormValues) => {
    try {
      setIsGenerating(true);
      
      // Get full employee and company data
      const employee = employees.find(e => e.id === data.employee);
      const company = companies.find(c => c.id === data.company);
      
      if (!employee || !company) {
        toast({
          title: "Erreur",
          description: "Employé ou entreprise non trouvé(e)",
          variant: "destructive",
        });
        return;
      }
      
      // Get period label for display
      const periodLabel = periods.find(p => p.id === data.period)?.label || data.period;
      
      // Generate PDF with leave allocation data
      const payslipPdf = generatePayslipPdf({
        employee,
        company,
        period: periodLabel,
        annualSalary: data.annualSalary,
        overtimeHours: data.overtimeHours,
        overtimeRate: data.overtimeRate,
        date: new Date(),
        leaveAllocation: allocation,
      });
      
      // Save to Firestore (we would normally upload the PDF to storage first, but we'll skip that for now)
      await savePayslipToFirestore(
        employee,
        company,
        periodLabel,
        "", // In a real app, this would be the URL to the uploaded PDF
        payslipPdf.pdfBlob
      );
      
      // Save the PDF
      payslipPdf.saveToFile();
      
      // Show success toast
      toast({
        title: "Fiche de paie générée",
        description: `Fiche de paie pour ${employee.name} - Période: ${periodLabel}`,
      });
      
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la fiche de paie",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
    contractsLoading,
    isGenerating
  };
};
