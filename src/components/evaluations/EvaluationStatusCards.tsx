
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
          <h3 className={`text-sm font-medium ${title === "Évaluations actives" ? "text-green-700" : 
            title === "Évaluations en attente" ? "text-amber-700" : 
            title === "Évaluations expirées" ? "text-red-700" : "text-blue-700"}`}>
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

interface EvaluationStatusCardsProps {
  active: number;
  pending: number;
  expired: number;
  coverage: number;
}

const EvaluationStatusCards = ({
  active = 0,
  pending = 0,
  expired = 0,
  coverage = 0
}: EvaluationStatusCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatusCard
        title="Évaluations actives"
        count={active}
        description={active === 1 ? "1 évaluation active" : 
          active === 0 ? "Aucune évaluation active" : `${active} évaluations actives`}
        icon={<Check className="h-5 w-5 text-green-600" />}
        borderColor="border-green-500"
        iconBgColor="bg-green-100"
      />
      <StatusCard
        title="Évaluations en attente"
        count={pending}
        description={pending === 1 ? "1 évaluation en attente" : 
          pending === 0 ? "Aucune évaluation en attente" : `${pending} évaluations en attente`}
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        borderColor="border-amber-500"
        iconBgColor="bg-amber-100"
      />
      <StatusCard
        title="Évaluations expirées"
        count={expired}
        description={expired === 1 ? "1 évaluation expirée" : 
          expired === 0 ? "Aucune évaluation expirée" : `${expired} évaluations expirées`}
        icon={<AlertCircle className="h-5 w-5 text-red-600" />}
        borderColor="border-red-500"
        iconBgColor="bg-red-100"
      />
      <StatusCard
        title="Couverture"
        count={coverage}
        description="Couverture des évaluations"
        icon={<Info className="h-5 w-5 text-blue-600" />}
        borderColor="border-blue-500"
        iconBgColor="bg-blue-100"
      />
    </div>
  );
};

export default EvaluationStatusCards;
