
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BadgeStatusCards from '@/components/badges/BadgeStatusCards';
import BadgeTable from '@/components/badges/BadgeTable';
import { Badge } from '@/types/firebase';

interface BadgesContentProps {
  badges: Badge[];
  loading: boolean;
  badgeStats: {
    active: number;
    pending: number;
    inactive: number;
    coverage: number;
  }
}

const BadgesContent = ({ badges, loading, badgeStats }: BadgesContentProps) => {
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
          <BadgeTable badges={badges} loading={loading} />
        </CardContent>
      </Card>
    </>
  );
};

export default BadgesContent;
