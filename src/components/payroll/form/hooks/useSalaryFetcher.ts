
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";
import { PayslipFormValues } from "../types";

export const useSalaryFetcher = (
  form: UseFormReturn<PayslipFormValues>,
  contracts: any[] | undefined
) => {
  const [salaryValue, setSalaryValue] = useState<string>("");
  
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

  return { salaryValue };
};
