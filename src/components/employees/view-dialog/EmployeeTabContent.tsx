
import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import EditEmployeeDialog from '../EditEmployeeDialog';
import EmployeeDocuments from './EmployeeDocuments';
import EmployeeLeaves from './EmployeeLeaves';
import EmployeeEvaluations from './EmployeeEvaluations';
import EmployeeSkills from './EmployeeSkills';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PersonalInfoFieldProps {
  label: string;
  value: string | undefined;
}

const PersonalInfoField: React.FC<PersonalInfoFieldProps> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || 'Non spécifié'}</p>
  </div>
);

interface InformationTabProps {
  employee: Employee;
}

export const InformationsTab: React.FC<InformationTabProps> = ({ employee }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  
  // Fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!employee.departmentId) return;
      
      try {
        // First, get department to find company ID
        const departmentRef = doc(db, 'hr_departments', employee.departmentId);
        const departmentSnap = await getDoc(departmentRef);
        
        if (!departmentSnap.exists()) return;
        
        const departmentData = departmentSnap.data();
        const companyId = departmentData?.companyId;
        
        if (!companyId) return;
        
        // Then get company
        const companyRef = doc(db, 'hr_companies', companyId);
        const companySnap = await getDoc(companyRef);
        
        if (companySnap.exists()) {
          setCompanyName(companySnap.data().name || '');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'entreprise:", error);
      }
    };
    
    fetchCompanyDetails();
  }, [employee.departmentId]);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if the photo URL exists and is valid
  const hasValidPhoto = employee.photoUrl && employee.photoUrl.trim() !== '';

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-semibold">Informations personnelles</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Pencil className="h-4 w-4" />
          Modifier
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-24 w-24 border-2 border-gray-200">
              {hasValidPhoto ? (
                <AvatarImage 
                  src={employee.photoUrl} 
                  alt={employee.name} 
                  className="object-cover h-full w-full"
                />
              ) : null}
              <AvatarFallback className="text-xl bg-gray-100">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-lg font-medium">{employee.name}</h4>
              <p className="text-sm text-gray-500">{employee.position}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <PersonalInfoField label="Nom" value={employee.name} />
            <PersonalInfoField label="Email personnel" value={employee.personalEmail} />
            <PersonalInfoField label="Email professionnel" value={employee.professionalEmail} />
            <PersonalInfoField label="Téléphone" value={employee.phone} />
            <PersonalInfoField label="Date de naissance" value={employee.birthDate} />
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-4">Informations professionnelles</h4>
          <div className="space-y-4">
            <PersonalInfoField label="Poste" value={employee.position} />
            <PersonalInfoField label="Département" value={employee.department} />
            <PersonalInfoField label="Entreprise" value={companyName} />
            <PersonalInfoField label="Date d'embauche" value={employee.startDate || '15 mai 2025'} />
            <PersonalInfoField 
              label="Statut" 
              value={employee.status === 'active' ? 'Actif' : 
                employee.status === 'onLeave' ? 'En congé' : 
                employee.status === 'inactive' ? 'Inactif' : 'Inconnu'} 
            />
          </div>
        </div>
      </div>

      <EditEmployeeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        employee={employee}
      />
    </>
  );
};

interface EmptyTabProps {
  title: string;
  message: string;
}

export const EmptyTab: React.FC<EmptyTabProps> = ({ title, message }) => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </>
  );
};

export const DocumentsTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <EmployeeDocuments employee={employee} />
);

export const CompetencesTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <EmployeeSkills employee={employee} />
);

export const HorairesTab: React.FC = () => (
  <EmptyTab 
    title="Horaires" 
    message="Aucun horaire défini pour cet employé." 
  />
);

export const CongesTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <EmployeeLeaves employee={employee} />
);

export const EvaluationsTab: React.FC<{ employee: Employee }> = ({ employee }) => (
  <EmployeeEvaluations employee={employee} />
);
