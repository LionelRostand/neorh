
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import EmployeesProfiles from '@/components/employees/EmployeesProfiles';
import { toast } from "@/components/ui/use-toast";
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Check, Clock, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Employes = () => {
  const { employees, isLoading, error, departmentStats, statusStats } = useEmployeeData();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données des employés",
        variant: "destructive"
      });
    }
  }, [error]);

  // Calculer les statistiques pour les cartes
  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(emp => emp.status === 'active')?.length || 0;
  const onLeaveEmployees = employees?.filter(emp => emp.status === 'onLeave')?.length || 0;
  const inactiveEmployees = employees?.filter(emp => emp.status === 'inactive')?.length || 0;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des Employés</h1>
      </div>

      {/* Cartes de statistiques avec le nouveau style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border border-green-500 rounded-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-700">Employés actifs</p>
                <h3 className="text-3xl font-bold mt-1">{activeEmployees}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {activeEmployees === 0 ? "Aucun employé actif" : 
                   activeEmployees === 1 ? "1 employé actif" : 
                   `${activeEmployees} employés actifs`}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-yellow-500 rounded-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-yellow-700">En congés</p>
                <h3 className="text-3xl font-bold mt-1">{onLeaveEmployees}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {onLeaveEmployees === 0 ? "Aucun employé en congé" : 
                   onLeaveEmployees === 1 ? "1 employé en congé" : 
                   `${onLeaveEmployees} employés en congé`}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-500 rounded-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-700">Inactifs</p>
                <h3 className="text-3xl font-bold mt-1">{inactiveEmployees}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {inactiveEmployees === 0 ? "Aucun employé inactif" : 
                   inactiveEmployees === 1 ? "1 employé inactif" : 
                   `${inactiveEmployees} employés inactifs`}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-500 rounded-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-700">Total</p>
                <h3 className="text-3xl font-bold mt-1">{totalEmployees}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {totalEmployees === 0 ? "Aucun employé" : 
                   totalEmployees === 1 ? "1 employé au total" : 
                   `${totalEmployees} employés au total`}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold">Liste des Employés</h2>
        <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
          <Button variant="outline" className="flex items-center">
            <span className="mr-2">Exporter / Importer</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <span className="mr-2">+</span>
            Nouvel Employé
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <EmployeesProfiles 
            employees={employees} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Employes;
