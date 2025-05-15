
import React from 'react';
import { Calendar } from "lucide-react";

interface LeaveStatusCardProps {
  title: string;
  count: number;
  bgColor: string;
  textColor: string;
  iconColor: string;
  borderColor?: string;
}

const LeaveStatusCard = ({ title, count, bgColor, textColor, iconColor, borderColor }: LeaveStatusCardProps) => {
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

interface LeaveStatusCardsProps {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

const LeaveStatusCards = ({ 
  pending = 0, 
  approved = 0, 
  rejected = 0,
  total = 0
}: LeaveStatusCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <LeaveStatusCard 
        title="En attente" 
        count={pending} 
        bgColor="bg-blue-50" 
        textColor="text-blue-700" 
        iconColor="text-blue-400" 
      />
      <LeaveStatusCard 
        title="Approuvés" 
        count={approved} 
        bgColor="bg-green-50" 
        textColor="text-green-700" 
        iconColor="text-green-400" 
      />
      <LeaveStatusCard 
        title="Refusés" 
        count={rejected} 
        bgColor="bg-red-50" 
        textColor="text-red-700" 
        iconColor="text-red-400" 
      />
      <LeaveStatusCard 
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

export default LeaveStatusCards;
