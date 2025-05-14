
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileText, Check, X } from "lucide-react";

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const StatusCard = ({ title, count, icon, bgColor, iconColor }: StatusCardProps) => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-4xl font-bold">{count}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

interface TimesheetStatusCardsProps {
  drafts: number;
  submitted: number;
  approved: number;
  rejected: number;
}

const TimesheetStatusCards = ({ 
  drafts = 0, 
  submitted = 0, 
  approved = 0, 
  rejected = 0 
}: TimesheetStatusCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatusCard 
        title="En cours" 
        count={drafts} 
        icon={<Clock className="h-6 w-6" />} 
        bgColor="bg-blue-100" 
        iconColor="text-blue-500" 
      />
      <StatusCard 
        title="Soumis" 
        count={submitted} 
        icon={<FileText className="h-6 w-6" />} 
        bgColor="bg-yellow-100" 
        iconColor="text-yellow-500" 
      />
      <StatusCard 
        title="Validés" 
        count={approved} 
        icon={<Check className="h-6 w-6" />} 
        bgColor="bg-green-100" 
        iconColor="text-green-500" 
      />
      <StatusCard 
        title="Rejetés" 
        count={rejected} 
        icon={<X className="h-6 w-6" />} 
        bgColor="bg-red-100" 
        iconColor="text-red-500" 
      />
    </div>
  );
};

export default TimesheetStatusCards;
