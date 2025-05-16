
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { Badge } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import BadgeStatusCards from "@/components/badges/BadgeStatusCards";
import BadgeTable from "@/components/badges/BadgeTable";

const Badges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [badgeStats, setBadgeStats] = useState({
    active: 0,
    pending: 0,
    inactive: 0,
    coverage: 0
  });
  
  // Utilisation de notre hook pour accéder à la collection des badges
  const badgesCollection = useCollection<'hr_badges'>();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const result = await badgesCollection.getAll();
        const data = result.docs || []; // Extract docs array from QueryResult with fallback
        
        if (data.length === 0) {
          // Si aucun badge n'existe encore, utilisons des données fictives
          const mockBadges: Badge[] = [
            {
              id: "1",
              number: "B2023-001",
              employeeId: "1",
              employeeName: "Thomas Dubois",
              type: "Standard",
              status: "active" as "active",
              issueDate: "15/03/2021",
              expiryDate: "15/03/2023"
            },
            {
              id: "2",
              number: "B2023-002",
              employeeId: "2",
              employeeName: "Sophie Martin",
              type: "Admin",
              status: "pending" as "pending",
              issueDate: "02/05/2022",
              expiryDate: "02/05/2024"
            },
            {
              id: "3",
              number: "B2023-003",
              employeeId: "3",
              employeeName: "Jean Bernard",
              type: "Standard",
              status: "inactive" as "inactive",
              issueDate: "10/11/2019",
              expiryDate: "10/11/2021"
            }
          ];
          setBadges(mockBadges);
          calculateStats(mockBadges);
        } else {
          setBadges(data as Badge[]);
          calculateStats(data as Badge[]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des badges:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les badges",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const calculateStats = (badgeData: Badge[]) => {
    const active = badgeData.filter(b => b.status === 'active').length;
    const pending = badgeData.filter(b => b.status === 'pending').length;
    const inactive = badgeData.filter(b => b.status === 'inactive' || b.status === 'lost').length;
    
    // Simulons un calcul de couverture (dans un cas réel, il faudrait comparer avec le nombre total d'employés)
    const coverage = badgeData.length > 0 ? Math.round((active / 2) * 100) : 0;
    
    setBadgeStats({
      active,
      pending,
      inactive,
      coverage
    });
  };

  const handleAddBadge = () => {
    // Cette fonction sera implémentée plus tard
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Badges et accès</h1>
          <p className="text-gray-500">Gestion des badges d'identification et des droits d'accès</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button size="sm" onClick={handleAddBadge}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau badge
          </Button>
        </div>
      </div>

      {/* Statistiques des badges avec les composants réutilisables */}
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
    </div>
  );
};

export default Badges;
