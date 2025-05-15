
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, AlertCircle, Info } from 'lucide-react';

interface EmployeeStatsCardsProps {
  activeEmployees: number;
  onLeaveEmployees: number;
  inactiveEmployees: number;
  totalEmployees: number;
}

const EmployeeStatsCards: React.FC<EmployeeStatsCardsProps> = ({
  activeEmployees,
  onLeaveEmployees,
  inactiveEmployees,
  totalEmployees
}) => {
  return (
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
  );
};

export default EmployeeStatsCards;
