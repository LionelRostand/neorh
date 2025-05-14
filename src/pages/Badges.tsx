
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Plus, FileText, Edit, Trash } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { Badge } from "@/lib/constants";

// Types pour les badges
interface BadgeData {
  id?: string;
  number: string;
  employeeId: string;
  employeeName: string;
  type: string;
  status: 'active' | 'inactive' | 'lost';
  issueDate: string;
  expiryDate: string;
}

const Badges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Utilisation de notre hook pour accéder à la collection des badges
  const badgesCollection = useCollection<'hr_badges'>();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const result = await badgesCollection.getAll();
        const data = result.docs; // Extract docs array from QueryResult
        
        if (data.length === 0) {
          // Si aucun badge n'existe encore, utilisons des données fictives
          setBadges([
            {
              id: "1",
              number: "B2023-001",
              employeeId: "1",
              employeeName: "Thomas Dubois",
              type: "Standard",
              status: "active",
              issueDate: "15/03/2021",
              expiryDate: "15/03/2023"
            },
            {
              id: "2",
              number: "B2023-002",
              employeeId: "2",
              employeeName: "Sophie Martin",
              type: "Admin",
              status: "active",
              issueDate: "02/05/2022",
              expiryDate: "02/05/2024"
            },
            {
              id: "3",
              number: "B2023-003",
              employeeId: "3",
              employeeName: "Jean Bernard",
              type: "Standard",
              status: "inactive",
              issueDate: "10/11/2019",
              expiryDate: "10/11/2021"
            }
          ]);
        } else {
          setBadges(data as Badge[]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des badges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const handleAddBadge = () => {
    // Cette fonction sera implémentée plus tard
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <BadgeUI className="bg-green-500">Actif</BadgeUI>;
      case 'inactive':
        return <BadgeUI className="bg-gray-500">Inactif</BadgeUI>;
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
