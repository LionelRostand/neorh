
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from '@/types/employee';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from 'lucide-react';

interface EmployeeInformationsProps {
  employee: Employee;
}

const EmployeeInformations: React.FC<EmployeeInformationsProps> = ({ employee }) => {
  // Extract first and last name from the employee name property
  const nameParts = employee.name ? employee.name.split(' ') : ['', ''];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Non spécifié';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  const getStatusLabel = (status: string | undefined): string => {
    if (!status) return "Inconnu";
    
    switch (status) {
      case "active": return "Actif";
      case "inactive": return "Inactif";
      case "onLeave": return "Congé";
      case "actif": return "Actif";
      case "inactif": return "Inactif";
      case "congé": return "Congé";
      default: return status;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Section Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo de profil */}
            <div className="flex flex-col items-center space-y-4">
              {employee.photoUrl ? (
                <Avatar className="h-32 w-32">
                  <AvatarImage src={employee.photoUrl} alt={`${firstName} ${lastName}`} />
                  <AvatarFallback className="text-2xl">
                    {firstName.charAt(0)}{lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-32 w-32 bg-gray-100">
                  <AvatarFallback className="text-2xl">
                    <User className="h-16 w-16 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="text-center">
                <h3 className="font-semibold text-lg">{employee.name || 'Non spécifié'}</h3>
                <p className="text-sm text-gray-600">{employee.position || 'Poste non défini'}</p>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nom</label>
                <p className="mt-1 text-sm font-medium">{employee.name || 'Non spécifié'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email personnel</label>
                <p className="mt-1 text-sm">{employee.personalEmail || 'Non spécifié'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                <p className="mt-1 text-sm">{employee.phone || 'Non spécifié'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                <p className="mt-1 text-sm">{formatDate(employee.birthDate)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Informations professionnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Poste</label>
              <p className="mt-1 text-sm font-medium">{employee.position || 'Non spécifié'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Département</label>
              <p className="mt-1 text-sm">{employee.department || 'Non spécifié'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Entreprise</label>
              <p className="mt-1 text-sm">{employee.companyId || 'Non spécifié'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email professionnel</label>
              <p className="mt-1 text-sm">{employee.professionalEmail || employee.email || 'Non spécifié'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Date d'embauche</label>
              <p className="mt-1 text-sm">{formatDate(employee.startDate)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Statut</label>
              <p className="mt-1 text-sm font-medium">{getStatusLabel(employee.status)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeInformations;
