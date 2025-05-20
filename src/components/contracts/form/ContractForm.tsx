
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { schema, ContractFormValues } from './schema';
import { toast } from '@/components/ui/use-toast';
import FormFooter from './components/FormFooter';
import EmployeeField from './fields/EmployeeField';
import ContractTypeField from './fields/ContractTypeField';
import PositionField from './fields/PositionField';
import DateFields from './fields/DateFields';
import DepartmentField from './fields/DepartmentField';
import SalaryField from './fields/SalaryField';
import useFirestore from '@/hooks/useFirestore';
import { useDepartmentsData } from '@/hooks/useDepartmentsData';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { Contract } from '@/lib/constants';
import { generateContractPdf, saveContractAsDocument } from '@/utils/pdf/generateContractPdf';

interface ContractFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ onSuccess, onCancel }) => {
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
        status: 'active',
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
      
      if (result.id) {
        // Generate PDF with company info if available
        const contractId = result.id;
        
        // Ensure all required fields are present
        const contractData = {
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
          status: 'pending_signature' as const,
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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Employee selection */}
          <EmployeeField
            control={form.control}
            employees={employees}
            employeeName={form.watch('employeeName')}
            setValue={(id, name) => {
              form.setValue('employeeId', id);
              form.setValue('employeeName', name);
            }}
          />
          
          {/* Contract type selection */}
          <ContractTypeField control={form.control} setValue={form.setValue} />
          
          {/* Position */}
          <PositionField control={form.control} />
          
          {/* Department */}
          <DepartmentField 
            control={form.control} 
            departments={departments.map(dept => ({ 
              id: dept.id || '', 
              name: dept.name,
              description: dept.description
            }))}
          />
          
          {/* Dates */}
          <DateFields
            control={form.control}
            watch={form.watch}
            setValue={form.setValue}
            contractType={form.watch('type')}
          />
          
          {/* Salary */}
          <SalaryField control={form.control} />
          
          {/* Convention collective */}
          <div className="space-y-2">
            <label htmlFor="conventionCollective" className="text-sm font-medium">
              Convention Collective
            </label>
            <input
              id="conventionCollective"
              className="w-full p-2 border rounded"
              {...form.register('conventionCollective')}
            />
          </div>
        </div>
        
        <FormFooter
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          submitLabel="Créer le contrat"
        />
      </form>
    </Form>
  );
};

export default ContractForm;
