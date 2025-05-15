
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { Badge } from "@/lib/constants";

interface BadgeTableProps {
  badges: Badge[];
  loading: boolean;
}

const BadgeTable = ({ badges, loading }: BadgeTableProps) => {
  // Function to render appropriate badge UI for each status
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Chargement des badges...</p>
      </div>
    );
  }

  return (
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
  );
};

export default BadgeTable;
