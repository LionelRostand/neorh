
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BadgeStatusCards from '@/components/badges/BadgeStatusCards';
import BadgeTable from '@/components/badges/BadgeTable';
import { ViewBadgeDialog } from '@/components/badges/ViewBadgeDialog';
import { EditBadgeDialog } from '@/components/badges/EditBadgeDialog';
import { DeleteBadgeDialog } from '@/components/badges/DeleteBadgeDialog';
import { Badge } from '@/types/firebase';
import { Employee } from '@/types/employee';

interface BadgesContentProps {
  badges: Badge[];
  loading: boolean;
  employees: Employee[];
  isLoadingEmployees: boolean;
  onRefresh: () => void;
  badgeStats: {
    active: number;
    pending: number;
    inactive: number;
    coverage: number;
  }
}

const BadgesContent = ({ 
  badges, 
  loading, 
  badgeStats,
  employees,
  isLoadingEmployees,
  onRefresh 
}: BadgesContentProps) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleViewBadge = (badge: Badge) => {
    console.log("View badge clicked:", badge);
    setSelectedBadge(badge);
    setViewDialogOpen(true);
  };

  const handleEditBadge = (badge: Badge) => {
    console.log("Edit badge clicked:", badge);
    setSelectedBadge(badge);
    setEditDialogOpen(true);
  };

  const handleDeleteBadge = (badge: Badge) => {
    console.log("Delete badge clicked:", badge);
    setSelectedBadge(badge);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <BadgeStatusCards 
        active={badgeStats.active} 
        pending={badgeStats.pending}
        inactive={badgeStats.inactive}
        coverage={badgeStats.coverage}
      />

      <Card>
        <CardHeader>
          <CardTitle>Gestion des badges</CardTitle>
          <CardDescription>
            Liste des badges attribués aux employés pour l'accès aux installations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BadgeTable 
            badges={badges} 
            loading={loading} 
            onView={handleViewBadge}
            onEdit={handleEditBadge}
            onDelete={handleDeleteBadge}
          />
        </CardContent>
      </Card>

      {/* Dialogs pour voir/modifier/supprimer */}
      <ViewBadgeDialog 
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        badge={selectedBadge}
      />

      <EditBadgeDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        badge={selectedBadge}
        employees={employees}
        isLoadingEmployees={isLoadingEmployees}
        onSuccess={onRefresh}
      />

      <DeleteBadgeDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        badge={selectedBadge}
        onSuccess={onRefresh}
      />
    </>
  );
};

export default BadgesContent;
