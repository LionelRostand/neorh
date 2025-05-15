
import React from 'react';
import { Check, Clock, AlertCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContractStatusCardProps {
  title: string;
  count: number;
  subtitle: string;
  borderColor: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const ContractStatusCard = ({ 
  title, 
  count, 
  subtitle, 
  borderColor,
  icon,
  iconBgColor
}: ContractStatusCardProps) => {
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

interface ContractStatusCardsProps {
  total: number;
  active: number;
  pending: number;
  expired: number;
}

const ContractStatusCards = ({ 
  total = 0, 
  active = 0, 
  pending = 0,
  expired = 0
}: ContractStatusCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <ContractStatusCard 
        title="Contrats actifs" 
        count={active} 
        subtitle={active === 0 ? "Aucun contrat actif" : 
                 active === 1 ? "1 contrat actif" : 
                 `${active} contrats actifs`} 
        borderColor="border-green-500"
        iconBgColor="bg-green-100"
        icon={<Check className="h-5 w-5 text-green-600" />}
      />
      <ContractStatusCard 
        title="Contrats en attente" 
        count={pending} 
        subtitle={pending === 0 ? "Aucun contrat en attente" : 
                 pending === 1 ? "1 contrat en attente" : 
                 `${pending} contrats en attente`} 
        borderColor="border-yellow-500"
        iconBgColor="bg-yellow-100"
        icon={<Clock className="h-5 w-5 text-yellow-600" />} 
      />
      <ContractStatusCard 
        title="Contrats expirés" 
        count={expired} 
        subtitle={expired === 0 ? "Aucun contrat expiré" : 
                 expired === 1 ? "1 contrat expiré" : 
                 `${expired} contrats expirés`} 
        borderColor="border-red-500"
        iconBgColor="bg-red-100"
        icon={<AlertCircle className="h-5 w-5 text-red-600" />} 
      />
      <ContractStatusCard 
        title="Couverture" 
        count={total > 0 ? Math.round((active / total) * 100) : 0} 
        subtitle={total === 0 ? "Aucune couverture" : "Couverture des contrats"} 
        borderColor="border-blue-500"
        iconBgColor="bg-blue-100"
        icon={<Info className="h-5 w-5 text-blue-600" />} 
      />
    </div>
  );
};

export default ContractStatusCards;
