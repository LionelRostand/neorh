import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Plus, FileText, Edit, Trash, Check, AlertCircle, Clock } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { Badge } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

// Types pour les badges - now using the same interface from constants.ts
// This local interface is no longer needed as we're using the Badge from constants.ts

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
        const data = result.docs; // Extract docs array from QueryResult
        
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <BadgeUI className="bg-green-500">Actif</BadgeUI>;
      case 'inactive':
        return <BadgeUI className="bg-gray-500">Inactif</BadgeUI>;
      case 'pending':
        return <BadgeUI className="bg-yellow-500">En attente</BadgeUI>;
      case 'lost':
        return <BadgeUI className="bg-red-500">Perdu</BadgeUI>;
      default:
        return <BadgeUI>Inconnu</BadgeUI>;
    }
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

      {/* Statistiques des badges - Nouvellement ajouté */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Badge actif */}
        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-700">Badges actifs</p>
                <h3 className="text-3xl font-bold mt-1">{badgeStats.active}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {badgeStats.active === 0 ? "Aucun badge actif" : 
                   badgeStats.active === 1 ? "1 badge actif" : 
                   `${badgeStats.active} badges actifs`}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge en attente */}
        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-yellow-700">Badges en attente</p>
                <h3 className="text-3xl font-bold mt-1">{badgeStats.pending}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {badgeStats.pending === 0 ? "Aucun badge en attente" : 
                   badgeStats.pending === 1 ? "1 badge en attente" : 
                   `${badgeStats.pending} badges en attente`}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge inactif */}
        <Card className="border-l-4 border-red-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-700">Badges inactifs</p>
                <h3 className="text-3xl font-bold mt-1">{badgeStats.inactive}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {badgeStats.inactive === 0 ? "Aucun badge inactif" : 
                   badgeStats.inactive === 1 ? "1 badge inactif" : 
                   `${badgeStats.inactive} badges inactifs`}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Couverture */}
        <Card className="border-l-4 border-blue-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-700">Couverture</p>
                <h3 className="text-3xl font-bold mt-1">{badgeStats.coverage}%</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {badgeStats.coverage === 0 ? "Aucune couverture" : 
                   `${Math.floor(badgeStats.coverage / 50)} sur ${Math.ceil(badgeStats.coverage / 25)} employés`}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des badges</CardTitle>
          <CardDescription>
            Liste des badges attribués aux employés pour l'accès aux installations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Chargement des badges...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Employé</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'émission</TableHead>
                  <TableHead>Date d'expiration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {badges.map((badge) => (
                  <TableRow key={badge.id}>
                    <TableCell>{badge.number}</TableCell>
                    <TableCell>{badge.employeeName}</TableCell>
                    <TableCell>{badge.type}</TableCell>
                    <TableCell>{getStatusBadge(badge.status)}</TableCell>
                    <TableCell>{badge.issueDate}</TableCell>
                    <TableCell>{badge.expiryDate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Badges;
