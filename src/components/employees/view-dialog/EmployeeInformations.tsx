
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from "@/components/ui/card";

interface EmployeeInformationsProps {
  employee: Employee;
}

const EmployeeInformations: React.FC<EmployeeInformationsProps> = ({ employee }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Informations personnelles</h3>
      
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-medium">{employee.name || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{employee.email || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium">{employee.phone || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p className="font-medium">{employee.birthDate || 'Non spécifié'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h3 className="text-xl font-semibold mb-4">Informations professionnelles</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Poste</p>
              <p className="font-medium">{employee.position || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Département</p>
              <p className="font-medium">{employee.department || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date d'embauche</p>
              <p className="font-medium">{employee.hireDate || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p className="font-medium">
                {employee.status === 'active' ? 'Actif' : 
                 employee.status === 'onLeave' ? 'En congé' : 
                 employee.status === 'inactive' ? 'Inactif' : 'Non spécifié'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeInformations;
