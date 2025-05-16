
import React from "react";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";

interface DepartmentsStatsProps {
  stats: {
    total: number;
    active: number;
    pending: number;
    expired: number;
  };
}

const DepartmentsStats: React.FC<DepartmentsStatsProps> = ({ stats }) => {
  return (
    <ContractStatusCards
      total={stats.total}
      active={stats.active}
      pending={stats.pending}
      expired={stats.expired}
    />
  );
};

export default DepartmentsStats;
