
import React from 'react';
import { File, Users, Calendar, Clock, Check, AlertCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContractStatusCardProps {
  title: string;
  count: number;
  subtitle: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ReactNode;
  iconBgColor: string;
}

const ContractStatusCard = ({ 
  title, 
  count, 
  subtitle, 
  bgColor, 
  borderColor,
  textColor,
  icon,
  iconBgColor
}: ContractStatusCardProps) => {
  return (
    <Card className={`border ${borderColor} ${bgColor}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-medium ${textColor}`}>{title}</p>
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
        bgColor="bg-white" 
        borderColor="border-green-500"
        textColor="text-green-700"
        iconBgColor="bg-green-100"
        icon={<Check className="h-5 w-5 text-green-600" />}
      />
      <ContractStatusCard 
        title="Contrats en attente" 
        count={pending} 
        subtitle={pending === 0 ? "Aucun contrat en attente" : 
                 pending === 1 ? "1 contrat en attente" : 
                 `${pending} contrats en attente`} 
        bgColor="bg-white" 
        borderColor="border-yellow-500"
        textColor="text-yellow-700"
        iconBgColor="bg-yellow-100"
        icon={<Clock className="h-5 w-5 text-yellow-600" />} 
      />
      <ContractStatusCard 
        title="Contrats expirés" 
        count={expired} 
        subtitle={expired === 0 ? "Aucun contrat expiré" : 
                 expired === 1 ? "1 contrat expiré" : 
                 `${expired} contrats expirés`} 
        bgColor="bg-white" 
        borderColor="border-red-500"
        textColor="text-red-700"
        iconBgColor="bg-red-100"
        icon={<AlertCircle className="h-5 w-5 text-red-600" />} 
      />
      <ContractStatusCard 
        title="Couverture" 
        count={total > 0 ? Math.round((active / total) * 100) : 0} 
        subtitle={total === 0 ? "Aucune couverture" : "Couverture des contrats"} 
        bgColor="bg-white" 
        borderColor="border-blue-500"
        textColor="text-blue-700"
        iconBgColor="bg-blue-100"
        icon={<Info className="h-5 w-5 text-blue-600" />} 
      />
    </div>
  );
};

export default ContractStatusCards;
