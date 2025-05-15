
import React from 'react';
import { File, Users, Calendar, Clock } from "lucide-react";

interface ContractStatusCardProps {
  title: string;
  count: number;
  subtitle: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
}

const ContractStatusCard = ({ title, count, subtitle, bgColor, iconColor, icon }: ContractStatusCardProps) => {
  return (
    <div className={`rounded-lg p-5 ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-3xl font-bold mb-1">{count}</div>
          <h3 className="font-medium text-gray-700">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
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
        title="Total des contrats" 
        count={total} 
        subtitle="Nombre total de contrats" 
        bgColor="bg-purple-50" 
        iconColor="text-purple-400"
        icon={<File className="h-6 w-6" />}
      />
      <ContractStatusCard 
        title="Contrats actifs" 
        count={active} 
        subtitle="Employés actuellement sous contrat" 
        bgColor="bg-green-50" 
        iconColor="text-green-400"
        icon={<Users className="h-6 w-6" />} 
      />
      <ContractStatusCard 
        title="Contrats à venir" 
        count={pending} 
        subtitle="Nouveaux contrats en attente de démarrage" 
        bgColor="bg-blue-50" 
        iconColor="text-blue-400"
        icon={<Calendar className="h-6 w-6" />} 
      />
      <ContractStatusCard 
        title="Contrats expirés" 
        count={expired} 
        subtitle="Contrats arrivés à échéance" 
        bgColor="bg-red-50" 
        iconColor="text-red-400"
        icon={<Clock className="h-6 w-6" />} 
      />
    </div>
  );
};

export default ContractStatusCards;
