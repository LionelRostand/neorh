
import React from 'react';
import { Employee } from '@/types/employee';

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
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h4 className="text-lg font-medium mb-4">Informations personnelles</h4>
        <div className="space-y-4">
          <PersonalInfoField label="Nom" value={employee.name} />
          <PersonalInfoField label="Email personnel" value={employee.email} />
          <PersonalInfoField label="Email professionnel" value={undefined} />
          <PersonalInfoField label="Téléphone" value={employee.phone} />
          <PersonalInfoField label="Date de naissance" value={undefined} />
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
            value={employee.status === 'active' ? 'Active' : 
              employee.status === 'onLeave' ? 'En congé' : 
              employee.status === 'inactive' ? 'Inactif' : 'Inconnu'} 
          />
        </div>
      </div>
    </div>
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

export const DocumentsTab: React.FC = () => (
  <EmptyTab 
    title="Documents" 
    message="Aucun document disponible pour cet employé." 
  />
);

export const CompetencesTab: React.FC = () => (
  <EmptyTab 
    title="Compétences" 
    message="Aucune compétence enregistrée pour cet employé." 
  />
);

export const HorairesTab: React.FC = () => (
  <EmptyTab 
    title="Horaires" 
    message="Aucun horaire défini pour cet employé." 
  />
);

export const CongesTab: React.FC = () => (
  <EmptyTab 
    title="Congés" 
    message="Aucun congé enregistré pour cet employé." 
  />
);

export const EvaluationsTab: React.FC = () => (
  <EmptyTab 
    title="Évaluations" 
    message="Aucune évaluation disponible pour cet employé." 
  />
);
