
import React, { useState } from 'react';
import BadgesHeader from '@/components/badges/BadgesHeader';
import BadgesContent from '@/components/badges/BadgesContent';
import { AddBadgeDialog } from '@/components/badges/AddBadgeDialog';
import { useBadges } from '@/hooks/badges/useBadges';
import { useEmployeeData } from '@/hooks/useEmployeeData';

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

  return (
    <div className="p-4 md:p-6">
      <BadgesHeader onAddBadge={handleAddBadge} />
      
      <BadgesContent 
        badges={badges}
        loading={loading}
        badgeStats={badgeStats}
        employees={employees}
        isLoadingEmployees={isLoadingEmployees}
        onRefresh={handleRefreshBadges}
      />

      <AddBadgeDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        employees={employees}
        onSuccess={handleRefreshBadges}
        isLoadingEmployees={isLoadingEmployees}
      />
    </div>
  );
};

export default Badges;
