
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema, ContractFormValues } from '../schema';
import { toast } from '@/components/ui/use-toast';
import useFirestore from '@/hooks/useFirestore';
import { useDepartmentsData } from '@/hooks/useDepartmentsData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { Contract } from '@/lib/constants';
import { generateContractPdf, saveContractAsDocument } from '@/utils/pdf';
import { ContractData } from '@/utils/pdf/types/contractTypes';

interface UseContractFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useContractForm = ({ onSuccess, onCancel }: UseContractFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { departments } = useDepartmentsData();
  const { employees } = useEmployeeData();
  const { companies } = useCompaniesData();
  
  const contractsCollection = useFirestore<Contract>('hr_contracts');
  const documentsCollection = useFirestore('hr_documents');
  
  // Initialize form
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: '',
      employeeName: '',
      position: '',
      type: 'CDI',
      startDate: new Date(),
      departmentId: '',
      salary: '',
    },
  });
  
  const handleSubmit = async (data: ContractFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Données du formulaire:", data);
      
      // Find department name
      const department = departments.find(dep => dep.id === data.departmentId);
      
      // Create contract object - omit undefined values
      const contract: Partial<Contract> = {
        employeeId: data.employeeId,
        employeeName: data.employeeName || '',
        type: data.type,
        position: data.position,
        startDate: data.startDate.toISOString(),
        departmentId: data.departmentId,
        status: 'pending_signature',
        signedByEmployee: false,
        signedByEmployer: false
      };
      
      // Only add endDate if it exists
      if (data.endDate) {
        contract.endDate = data.endDate.toISOString();
      }
      
      if (department?.name) {
        contract.departmentName = department.name;
      }
      
      console.log("Création du contrat:", contract);
      
      // First, explicitly add the contract to Firestore
      const result = await contractsCollection.add(contract as Contract);
      
      // Check if result exists
      if (!result) {
        throw new Error("Erreur lors de la création du contrat");
      }
      
      // Get the ID from the result
      const contractId = result.id;
      
      if (!contractId) {
        throw new Error("Impossible d'obtenir l'ID du contrat créé");
      }
      
      console.log("Contrat créé avec l'ID:", contractId);
      
      // Find employee for company ID
      const employee = employees.find(e => e.id === data.employeeId);
      let company = null;
      
      if (employee?.companyId) {
        company = companies.find(c => c.id === employee.companyId);
      }
      
      // Ensure all required fields are present
      const contractData: ContractData = {
        id: contractId,
        employeeId: data.employeeId,
        employeeName: data.employeeName || '',
        position: data.position,
        type: data.type,
        startDate: data.startDate,
        departmentId: data.departmentId,
        departmentName: department?.name || '',
        salary: data.salary,
        status: 'pending_signature',
        signedByEmployee: false,
        signedByEmployer: false
      };
      
      // Add endDate and conventionCollective only if they exist
      if (data.endDate) {
        contractData.endDate = data.endDate;
      }
      
      if (data.conventionCollective) {
        contractData.conventionCollective = data.conventionCollective;
      }
      
      // Generate PDF
      const pdfResult = generateContractPdf(contractData, company || undefined);
      
      // Save contract as document for HR Documents and Employee profile
      await saveContractAsDocument(
        contractData,
        pdfResult,
        documentsCollection
      );
      
      toast({
        title: 'Contrat créé',
        description: 'Le contrat a été généré avec succès et est disponible dans la section Documents',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création du contrat',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit,
    employees,
    departments
  };
};
