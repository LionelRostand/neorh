
import React from 'react';
import { Check, Clock, AlertCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CompanyStatusCardProps {
  title: string;
  count: number;
  subtitle: string;
  borderColor: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const CompanyStatusCard = ({ 
  title, 
  count, 
  subtitle, 
  borderColor,
  icon,
  iconBgColor
}: CompanyStatusCardProps) => {
  return (
    <Card className={`border-l-4 ${borderColor} bg-white hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{count}</h3>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-2 rounded-full ${iconBgColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CompanyStatusCardsProps {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}

const CompanyStatusCards = ({ 
  total = 0, 
  active = 0, 
  pending = 0,
  inactive = 0
}: CompanyStatusCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <CompanyStatusCard 
        title="Entreprises actives" 
        count={active} 
        subtitle={active === 0 ? "Aucune entreprise active" : 
                 active === 1 ? "1 entreprise active" : 
                 `${active} entreprises actives`} 
        borderColor="border-green-500"
        iconBgColor="bg-green-100"
        icon={<Check className="h-5 w-5 text-green-600" />}
      />
      <CompanyStatusCard 
        title="Entreprises en attente" 
        count={pending} 
        subtitle={pending === 0 ? "Aucune entreprise en attente" : 
                 pending === 1 ? "1 entreprise en attente" : 
                 `${pending} entreprises en attente`} 
        borderColor="border-yellow-500"
        iconBgColor="bg-yellow-100"
        icon={<Clock className="h-5 w-5 text-yellow-600" />} 
      />
      <CompanyStatusCard 
        title="Entreprises inactives" 
        count={inactive} 
        subtitle={inactive === 0 ? "Aucune entreprise inactive" : 
                 inactive === 1 ? "1 entreprise inactive" : 
                 `${inactive} entreprises inactives`} 
        borderColor="border-red-500"
        iconBgColor="bg-red-100"
        icon={<AlertCircle className="h-5 w-5 text-red-600" />} 
      />
      <CompanyStatusCard 
        title="Couverture" 
        count={total > 0 ? Math.round((active / total) * 100) : 0} 
        subtitle={total === 0 ? "Aucune couverture" : "Couverture des entreprises"} 
        borderColor="border-blue-500"
        iconBgColor="bg-blue-100"
        icon={<Info className="h-5 w-5 text-blue-600" />} 
      />
    </div>
  );
};

export default CompanyStatusCards;
