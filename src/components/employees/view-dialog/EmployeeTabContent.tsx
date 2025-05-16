
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import EditEmployeeDialog from '../EditEmployeeDialog';
import EmployeeDocuments from './EmployeeDocuments';
import EmployeeLeaves from './EmployeeLeaves';
import EmployeeEvaluations from './EmployeeEvaluations';
import EmployeeSkills from './EmployeeSkills';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employee.photoUrl} alt={employee.name} />
              <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
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
