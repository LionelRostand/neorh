
import { useState, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";
import { PayslipFormValues } from "../types";

/**
 * Hook pour récupérer le salaire d'un employé depuis son contrat actif
 * Tente d'extraire le salaire spécifiquement de l'Article 4 - Rémunération
 */
export const useSalaryFetcher = (
  form: UseFormReturn<PayslipFormValues>,
  contracts: any[] | undefined
) => {
  const [salaryValue, setSalaryValue] = useState<string>("");
  const previousEmployeeId = useRef<string>("");
  const isFetchingRef = useRef(false);
  const fetchAttemptedRef = useRef(false);
  
  // Fonction pour extraire le salaire depuis le contenu du document du contrat
  const extractSalaryFromDocument = async (contractId: string): Promise<string | null> => {
    try {
      // Récupérer le document lié au contrat
      const docsQuery = query(
        collection(db, HR.DOCUMENTS),
        where("contractId", "==", contractId),
        where("category", "==", "contracts"),
        limit(1)
      );
      
      const docsSnapshot = await getDocs(docsQuery);
      
      if (!docsSnapshot.empty) {
        const documentData = docsSnapshot.docs[0].data();
        const content = documentData.content;
        
        // Si le contenu est disponible et contient un texte
        if (content) {
          // Rechercher l'Article 4 - Rémunération
          const remunerationMatch = content.match(/Article 4 - R[ée]mun[ée]ration[\s\S]*?(\d[\d\s]*(?:\.|,)\d+)[\s\S]*?(?:euros|€)/i);
          
          if (remunerationMatch && remunerationMatch[1]) {
            // Nettoyer le texte trouvé pour obtenir le montant
            const amount = remunerationMatch[1].replace(/\s/g, '');
            return `${amount} €`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de l'extraction du salaire depuis le document:", error);
      return null;
    }
  };
  
  // Effectuer une seule tentative de récupération du salaire par employé
  useEffect(() => {
    const employeeId = form.getValues("employee");
    
    // Éviter les appels répétés pour le même employé ou si déjà en cours de récupération
    if (!employeeId || 
        employeeId === previousEmployeeId.current || 
        isFetchingRef.current ||
        (employeeId === previousEmployeeId.current && fetchAttemptedRef.current)) {
      return;
    }
    
    // Indiquer le chargement
    setSalaryValue("Chargement du salaire...");
    isFetchingRef.current = true;
    previousEmployeeId.current = employeeId;
    fetchAttemptedRef.current = true;
    
    // Chercher le contrat actif pour l'employé sélectionné
    const fetchEmployeeSalary = async () => {
      try {
        // D'abord essayer de trouver le salaire dans les contrats chargés
        if (contracts && contracts.length > 0) {
          const employeeContract = contracts.find(
            (contract) => contract.employeeId === employeeId && contract.status === "active"
          );
          
          if (employeeContract) {
            if (employeeContract.id) {
              // Tenter d'extraire le salaire depuis l'Article 4 du document du contrat
              const extractedSalary = await extractSalaryFromDocument(employeeContract.id);
              
              if (extractedSalary) {
                setSalaryValue(extractedSalary);
                form.setValue("annualSalary", extractedSalary);
                isFetchingRef.current = false;
                return;
              }
            }
            
            // Si on n'a pas pu extraire depuis le document, utiliser le salaire du contrat
            if (employeeContract.salary) {
              const formattedSalary = typeof employeeContract.salary === 'number' 
                ? `${employeeContract.salary} €` 
                : employeeContract.salary.includes('€') ? employeeContract.salary : `${employeeContract.salary} €`;
              setSalaryValue(formattedSalary);
              form.setValue("annualSalary", formattedSalary);
              isFetchingRef.current = false;
              return;
            }
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
          const contractId = querySnapshot.docs[0].id;
          
          // Tenter d'extraire le salaire depuis l'Article 4 du document du contrat
          if (contractId) {
            const extractedSalary = await extractSalaryFromDocument(contractId);
            
            if (extractedSalary) {
              setSalaryValue(extractedSalary);
              form.setValue("annualSalary", extractedSalary);
              isFetchingRef.current = false;
              return;
            }
          }
          
          // Fallback: utiliser le salaire du contrat
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
  }, [form, form.watch("employee"), contracts]);

  return { salaryValue };
};
