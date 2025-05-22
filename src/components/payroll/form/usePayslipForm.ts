
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useCompaniesData } from "@/hooks/useCompaniesData";
import useContractsList from "@/hooks/contracts/useContractsList";
import { toast } from "@/components/ui/use-toast";
import { payslipFormSchema } from "./schema";
import { generatePayslipPdf } from "@/utils/pdf/generatePayslipPdf";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";

export type PayslipFormValues = z.infer<typeof payslipFormSchema>;

export const usePayslipForm = () => {
  const [salaryValue, setSalaryValue] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  
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
    if (!employeeId) {
      setSalaryValue("");
      form.setValue("annualSalary", "");
      return;
    }
    
    // Show loading state
    setSalaryValue("Chargement du salaire...");
    
    // Find active contract for the selected employee
    const fetchEmployeeSalary = async () => {
      try {
        // First try to find the salary in the loaded contracts
        if (contracts && contracts.length > 0) {
          const employeeContract = contracts.find(
            (contract) => contract.employeeId === employeeId && contract.status === "active"
          );
          
          if (employeeContract && employeeContract.salary) {
            const formattedSalary = typeof employeeContract.salary === 'number' 
              ? `${employeeContract.salary} €` 
              : employeeContract.salary.includes('€') ? employeeContract.salary : `${employeeContract.salary} €`;
            setSalaryValue(formattedSalary);
            form.setValue("annualSalary", formattedSalary);
            return;
          }
        }
        
        // If not found in loaded contracts, query the database directly
        const contractsQuery = query(
          collection(db, HR.CONTRACTS),
          where("employeeId", "==", employeeId),
          where("status", "==", "active")
        );
        
        const querySnapshot = await getDocs(contractsQuery);
        
        if (!querySnapshot.empty) {
          const contractData = querySnapshot.docs[0].data();
          
          if (contractData.salary) {
            const formattedSalary = typeof contractData.salary === 'number' 
              ? `${contractData.salary} €` 
              : contractData.salary.includes('€') ? contractData.salary : `${contractData.salary} €`;
            setSalaryValue(formattedSalary);
            form.setValue("annualSalary", formattedSalary);
          } else {
            setSalaryValue("Salaire non spécifié dans le contrat");
            form.setValue("annualSalary", "");
          }
        } else {
          setSalaryValue("Aucun contrat actif trouvé");
          form.setValue("annualSalary", "");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du salaire:", error);
        setSalaryValue("Erreur lors de la récupération du salaire");
        form.setValue("annualSalary", "");
      }
    };
    
    fetchEmployeeSalary();
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

  // Save payslip document to Firestore
  const savePayslipToFirestore = async (
    employee,
    company,
    periodLabel, 
    fileUrl,
    pdfBlob
  ) => {
    try {
      // Create a document reference in HR_PAYSLIPS collection
      const payslipRef = await addDoc(collection(db, HR.PAYSLIPS), {
        employeeId: employee.id,
        employeeName: employee.name,
        companyId: company.id,
        companyName: company.name,
        period: periodLabel,
        createdAt: serverTimestamp(),
        fileUrl: fileUrl || "",
        status: "completed"
      });
      
      // Create a document reference in HR_DOCUMENTS collection
      await addDoc(collection(db, HR.DOCUMENTS), {
        title: `Fiche de paie - ${employee.name} - ${periodLabel}`,
        category: "paystubs",
        fileUrl: fileUrl || "",
        uploadDate: serverTimestamp(),
        status: "active",
        employeeId: employee.id,
        employeeName: employee.name,
        companyId: company.id,
        description: `Fiche de paie pour la période ${periodLabel}`
      });

      console.log("Fiche de paie sauvegardée avec succès", payslipRef.id);
      return payslipRef.id;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la fiche de paie:", error);
      throw error;
    }
  };

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
      
      // Generate PDF
      const payslipPdf = generatePayslipPdf({
        employee,
        company,
        period: periodLabel,
        annualSalary: data.annualSalary,
        overtimeHours: data.overtimeHours,
        overtimeRate: data.overtimeRate,
        date: new Date(),
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
