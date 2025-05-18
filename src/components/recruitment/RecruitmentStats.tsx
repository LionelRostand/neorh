
import React from "react";
import { Briefcase, Clock, Check, Users, Calendar } from "lucide-react";
import { RecruitmentStatsData } from "@/types/recruitment";
import RecruitmentStatusCard from "./RecruitmentStatusCard";

interface RecruitmentStatsProps {
  stats: RecruitmentStatsData;
  isLoading?: boolean;
}

const RecruitmentStats: React.FC<RecruitmentStatsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-gray-100 animate-pulse h-24 rounded-md"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <RecruitmentStatusCard 
        title="Postes ouverts" 
        count={stats.openPositions} 
        icon={<Briefcase className="h-5 w-5 text-blue-600" />} 
        bgColor="bg-blue-100" 
        subtitle="Offres publiées"
      />
      <RecruitmentStatusCard 
        title="En cours" 
        count={stats.inProgress} 
        icon={<Clock className="h-5 w-5 text-amber-600" />} 
        bgColor="bg-amber-100" 
        subtitle="Processus actifs"
      />
      <RecruitmentStatusCard 
        title="Postes pourvus" 
        count={stats.filledPositions} 
        icon={<Check className="h-5 w-5 text-green-600" />} 
        bgColor="bg-green-100" 
        subtitle="Recrutements terminés"
      />
      <RecruitmentStatusCard 
        title="Candidatures" 
        count={stats.applications} 
        icon={<Users className="h-5 w-5 text-purple-600" />} 
        bgColor="bg-purple-100" 
        subtitle="Reçues au total"
      />
      <RecruitmentStatusCard 
        title="Entretiens" 
        count={stats.interviews} 
        icon={<Calendar className="h-5 w-5 text-indigo-600" />} 
        bgColor="bg-indigo-100" 
        subtitle="Programmés"
      />
    </div>
  );
};

export default RecruitmentStats;
