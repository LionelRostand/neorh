
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, Clock, AlertCircle, Info } from "lucide-react";

interface StatusCardProps {
  title: string;
  count: number;
  description: string;
  icon: React.ReactNode;
  borderColor: string;
  iconBgColor: string;
}

const StatusCard = ({ title, count, description, icon, borderColor, iconBgColor }: StatusCardProps) => {
  return (
    <Card className={`border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
      <div className="p-4 flex justify-between items-start">
        <div>
          <h3 className={`text-sm font-medium ${title === "Formations actives" ? "text-green-700" : 
            title === "Formations en attente" ? "text-amber-700" : 
            title === "Formations expirées" ? "text-red-700" : "text-blue-700"}`}>
            {title}
          </h3>
          <p className="text-3xl font-bold mt-1">{count}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-2 rounded-full ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

interface TrainingStatusCardsProps {
  active: number;
  pending: number;
  expired: number;
  coverage: number;
}

const TrainingStatusCards = ({
  active = 0,
  pending = 0,
  expired = 0,
  coverage = 0
}: TrainingStatusCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatusCard
        title="Formations actives"
        count={active}
        description={active === 1 ? "1 formation active" : 
          active === 0 ? "Aucune formation active" : `${active} formations actives`}
        icon={<Check className="h-5 w-5 text-green-600" />}
        borderColor="border-green-500"
        iconBgColor="bg-green-100"
      />
      <StatusCard
        title="Formations en attente"
        count={pending}
        description={pending === 1 ? "1 formation en attente" : 
          pending === 0 ? "Aucune formation en attente" : `${pending} formations en attente`}
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        borderColor="border-amber-500"
        iconBgColor="bg-amber-100"
      />
      <StatusCard
        title="Formations expirées"
        count={expired}
        description={expired === 1 ? "1 formation expirée" : 
          expired === 0 ? "Aucune formation expirée" : `${expired} formations expirées`}
        icon={<AlertCircle className="h-5 w-5 text-red-600" />}
        borderColor="border-red-500"
        iconBgColor="bg-red-100"
      />
      <StatusCard
        title="Couverture"
        count={coverage}
        description="Couverture des formations"
        icon={<Info className="h-5 w-5 text-blue-600" />}
        borderColor="border-blue-500"
        iconBgColor="bg-blue-100"
      />
    </div>
  );
};

export default TrainingStatusCards;
