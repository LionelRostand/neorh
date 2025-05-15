
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Check, AlertCircle, Info } from "lucide-react";

interface LeaveStatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const LeaveStatusCard = ({ title, count, icon, textColor, bgColor, borderColor }: LeaveStatusCardProps) => {
  return (
    <Card className={`border ${borderColor} rounded-lg`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-medium ${textColor}`}>{title}</p>
            <h3 className="text-3xl font-bold mt-1">{count}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {count === 0 ? `Aucun congé ${title.toLowerCase()}` : 
               count === 1 ? `1 congé ${title.toLowerCase()}` : 
               `${count} congés ${title.toLowerCase()}`}
            </p>
          </div>
          <div className={`p-2 rounded-full ${bgColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
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
        icon={<Clock className="h-5 w-5 text-yellow-600" />} 
        textColor="text-yellow-700"
        bgColor="bg-yellow-100" 
        borderColor="border-yellow-500" 
      />
      <LeaveStatusCard 
        title="Approuvés" 
        count={approved} 
        icon={<Check className="h-5 w-5 text-green-600" />} 
        textColor="text-green-700"
        bgColor="bg-green-100" 
        borderColor="border-green-500" 
      />
      <LeaveStatusCard 
        title="Refusés" 
        count={rejected} 
        icon={<AlertCircle className="h-5 w-5 text-red-600" />} 
        textColor="text-red-700"
        bgColor="bg-red-100" 
        borderColor="border-red-500" 
      />
      <LeaveStatusCard 
        title="Total" 
        count={total} 
        icon={<Info className="h-5 w-5 text-blue-600" />} 
        textColor="text-blue-700"
        bgColor="bg-blue-100" 
        borderColor="border-blue-500" 
      />
    </div>
  );
};

export default LeaveStatusCards;
