
import React from 'react';
import { Check, Clock, AlertCircle, Info } from "lucide-react";
import BadgeStatCard from './BadgeStatCard';

interface BadgeStatsProps {
  active: number;
  pending: number;
  inactive: number;
  coverage: number;
}

const BadgeStatusCards = ({ active, pending, inactive, coverage }: BadgeStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BadgeStatCard 
        title="Badges actifs"
        value={active}
        icon={<Check className="h-5 w-5 text-green-600" />}
        textColor="text-green-700"
        bgColor="bg-green-100"
        borderColor="border-green-500"
        description={active === 0 ? "Aucun badge actif" : 
                    active === 1 ? "1 badge actif" : 
                    `${active} badges actifs`}
      />
      
      <BadgeStatCard 
        title="Badges en attente"
        value={pending}
        icon={<Clock className="h-5 w-5 text-yellow-600" />}
        textColor="text-yellow-700"
        bgColor="bg-yellow-100"
        borderColor="border-yellow-500"
        description={pending === 0 ? "Aucun badge en attente" : 
                    pending === 1 ? "1 badge en attente" : 
                    `${pending} badges en attente`}
      />
      
      <BadgeStatCard 
        title="Badges inactifs"
        value={inactive}
        icon={<AlertCircle className="h-5 w-5 text-red-600" />}
        textColor="text-red-700"
        bgColor="bg-red-100"
        borderColor="border-red-500"
        description={inactive === 0 ? "Aucun badge inactif" : 
                    inactive === 1 ? "1 badge inactif" : 
                    `${inactive} badges inactifs`}
      />
      
      <BadgeStatCard 
        title="Couverture"
        value={coverage}
        icon={<Info className="h-5 w-5 text-blue-600" />}
        textColor="text-blue-700"
        bgColor="bg-blue-100"
        borderColor="border-blue-500"
        description={coverage === 0 ? "Aucune couverture" : 
                    `${Math.floor(coverage / 50)} sur ${Math.ceil(coverage / 25)} employés`}
      />
    </div>
  );
};

export default BadgeStatusCards;
