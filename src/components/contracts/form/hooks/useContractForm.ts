
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
import { generateContractPdf, saveContractAsDocument, ContractData } from '@/utils/pdf';

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
      conventionCollective: 'Convention Collective Nationale applicable à l\'entreprise'
    },
  });
  
  const handleSubmit = async (data: ContractFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Find department name
      const department = departments.find(dep => dep.id === data.departmentId);
      
      // Create contract object
      const contract: Contract = {
        employeeId: data.employeeId,
        employeeName: data.employeeName || '',
        type: data.type,
        position: data.position,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString(),
        departmentId: data.departmentId,
        status: 'pending_signature',
        signedByEmployee: false,
        signedByEmployer: false
      };
      
      if (department?.name) {
        contract.departmentName = department.name;
      }
      
      // Add contract to Firestore
      const result = await contractsCollection.add(contract);
      
      // Find employee for company ID
      const employee = employees.find(e => e.id === data.employeeId);
      let company = null;
      
      if (employee?.companyId) {
        company = companies.find(c => c.id === employee.companyId);
      }
      
      // Vérifier que nous avons bien un ID de contrat avant de continuer
      // Fix: Vérifier si result existe et a un ID
      if (result && result.id) {
        // Generate PDF with company info if available
        const contractId = result.id;
        
        // Ensure all required fields are present
        const contractData: ContractData = {
          id: contractId,
          employeeId: data.employeeId,
          employeeName: data.employeeName || '',
          position: data.position,
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
          departmentId: data.departmentId,
          departmentName: department?.name || '',
          salary: data.salary,
          conventionCollective: data.conventionCollective,
          status: 'pending_signature',
          signedByEmployee: false,
          signedByEmployer: false
        };
        
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
      } else {
        // Afficher une erreur si nous n'avons pas pu obtenir l'ID du contrat
        console.error('Erreur: Impossible d\'obtenir l\'ID du contrat créé');
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la création du contrat',
          variant: 'destructive',
        });
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
