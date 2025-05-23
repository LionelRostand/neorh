
import React, { useState } from 'react';
import BadgesHeader from '@/components/badges/BadgesHeader';
import BadgesContent from '@/components/badges/BadgesContent';
import BadgeDialogs from '@/components/badges/BadgeDialogs';
import { useBadges } from '@/hooks/badges/useBadges';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { printBadges } from '@/components/badges/PrintBadgesService';

const Badges = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { badges, loading, badgeStats, fetchBadges } = useBadges();
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();

  const handleAddBadge = () => {
    setIsAddDialogOpen(true);
  };

  const handleRefreshBadges = async () => {
    await fetchBadges();
  };

  const handlePrintBadges = () => {
    printBadges(badges);
  };

  return (
    <div className="p-4 md:p-6">
      <BadgesHeader 
        onAddBadge={handleAddBadge}
        onPrintBadges={handlePrintBadges} 
      />
      
      <BadgesContent 
        badges={badges}
        loading={loading}
        badgeStats={badgeStats}
        employees={employees}
        isLoadingEmployees={isLoadingEmployees}
        onRefresh={handleRefreshBadges}
      />

      <BadgeDialogs 
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        employees={employees}
        onSuccess={handleRefreshBadges}
        isLoadingEmployees={isLoadingEmployees}
      />
    </div>
  );
};

export default Badges;
