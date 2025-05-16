
import React, { useEffect, useState } from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent } from "@/components/ui/card";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface EmployeeInformationsProps {
  employee: Employee;
}

const EmployeeInformations: React.FC<EmployeeInformationsProps> = ({ employee }) => {
  const [departmentName, setDepartmentName] = useState<string>(employee.department || 'Non spécifié');

  useEffect(() => {
    // Si nous avons déjà le nom du département, pas besoin de le récupérer
    if (employee.department && !employee.department.includes('dCij')) {
      return;
    }
    
    // Si nous avons l'ID du département, récupérer son nom
    if (employee.departmentId) {
      const fetchDepartmentName = async () => {
        try {
          const deptRef = doc(db, 'hr_departments', employee.departmentId);
          const deptSnap = await getDoc(deptRef);
          
          if (deptSnap.exists()) {
            const deptData = deptSnap.data();
            setDepartmentName(deptData.name || 'Non spécifié');
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du département:", error);
        }
      };
      
      fetchDepartmentName();
    }
  }, [employee.departmentId, employee.department]);

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
              <p className="text-sm text-gray-500">Email personnel</p>
              <p className="font-medium">{employee.personalEmail || employee.email || 'Non spécifié'}</p>
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
              <p className="font-medium">{departmentName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email professionnel</p>
              <p className="font-medium">{employee.professionalEmail || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date d'embauche</p>
              <p className="font-medium">{employee.startDate || 'Non spécifié'}</p>
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
