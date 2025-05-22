
import { useState, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";
import { PayslipFormValues } from "../types";

export const useSalaryFetcher = (
  form: UseFormReturn<PayslipFormValues>,
  contracts: any[] | undefined
) => {
  const [salaryValue, setSalaryValue] = useState<string>("");
  const previousEmployeeId = useRef<string>("");
  const isFetchingRef = useRef(false);
  
  // Update salary when employee selection changes
  useEffect(() => {
    const employeeId = form.getValues("employee");
    
    // Éviter les appels répétés pour le même employé
    if (!employeeId || employeeId === previousEmployeeId.current || isFetchingRef.current) {
      return;
    }
    
    // Show loading state
    setSalaryValue("Chargement du salaire...");
    isFetchingRef.current = true;
    previousEmployeeId.current = employeeId;
    
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
            isFetchingRef.current = false;
            return;
          }
        }
        
        // Si nécessaire, chercher dans Firestore mais de façon optimisée
        const contractsQuery = query(
          collection(db, HR.CONTRACTS),
          where("employeeId", "==", employeeId),
          where("status", "==", "active"),
          limit(1) // Limiter à un seul résultat
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
      } finally {
        isFetchingRef.current = false;
      }
    };
    
    fetchEmployeeSalary();
  }, [form.watch("employee"), contracts, form]);

  return { salaryValue };
};
