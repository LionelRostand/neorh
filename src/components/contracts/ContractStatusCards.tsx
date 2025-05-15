
import React from 'react';
import { Calendar } from "lucide-react";

interface ContractStatusCardProps {
  title: string;
  count: number;
  bgColor: string;
  textColor: string;
  iconColor: string;
  borderColor?: string;
}

const ContractStatusCard = ({ title, count, bgColor, textColor, iconColor, borderColor }: ContractStatusCardProps) => {
  return (
    <div className={`relative rounded-lg p-5 ${bgColor} ${borderColor ? 'border border-' + borderColor : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-medium ${textColor}`}>{title}</h3>
          <p className="text-4xl font-bold mt-2">{count}</p>
        </div>
        <div className={`${iconColor}`}>
          <Calendar className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

interface ContractStatusCardsProps {
  draft: number;
  active: number;
  expired: number;
  total: number;
}

const ContractStatusCards = ({ 
  draft = 0, 
  active = 0, 
  expired = 0,
  total = 0
}: ContractStatusCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <ContractStatusCard 
        title="En attente" 
        count={draft} 
        bgColor="bg-blue-50" 
        textColor="text-blue-700" 
        iconColor="text-blue-400" 
      />
      <ContractStatusCard 
        title="Approuvés" 
        count={active} 
        bgColor="bg-green-50" 
        textColor="text-green-700" 
        iconColor="text-green-400" 
      />
      <ContractStatusCard 
        title="Refusés" 
        count={expired} 
        bgColor="bg-red-50" 
        textColor="text-red-700" 
        iconColor="text-red-400" 
      />
      <ContractStatusCard 
        title="Total" 
        count={total} 
        bgColor="bg-white" 
        textColor="text-gray-700" 
        iconColor="text-gray-400" 
        borderColor="gray-200"
      />
    </div>
  );
};

export default ContractStatusCards;
