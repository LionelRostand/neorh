
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import EmployeesProfiles from '@/components/employees/EmployeesProfiles';
import { toast } from "@/components/ui/use-toast";
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';
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

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border rounded-lg">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total des employés</p>
              <p className="text-3xl font-bold">{totalEmployees}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border rounded-lg">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">En poste</p>
              <p className="text-3xl font-bold">{activeEmployees}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border rounded-lg">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">En congés</p>
              <p className="text-3xl font-bold">{onLeaveEmployees}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border rounded-lg">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
              <XCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactifs</p>
              <p className="text-3xl font-bold">{inactiveEmployees}</p>
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
