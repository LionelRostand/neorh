
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Presence } from "@/types/presence";
import { PresenceStatusBadge } from "./PresenceStatusBadge";

interface PresenceTableProps {
  records: Presence[];
  isLoading: boolean;
  error: Error | null;
}

export const PresenceTable: React.FC<PresenceTableProps> = ({ records, isLoading, error }) => {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Badge</TableHead>
            <TableHead>Heure d'entrée</TableHead>
            <TableHead>Heure de sortie</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              Chargement des données...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
  
  if (error) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Badge</TableHead>
            <TableHead>Heure d'entrée</TableHead>
            <TableHead>Heure de sortie</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4 text-red-500">
              Erreur lors du chargement des données
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
  
  if (records.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Badge</TableHead>
            <TableHead>Heure d'entrée</TableHead>
            <TableHead>Heure de sortie</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              Aucun enregistrement de présence pour cette journée
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employé</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Badge</TableHead>
          <TableHead>Heure d'entrée</TableHead>
          <TableHead>Heure de sortie</TableHead>
          <TableHead>Durée</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map(record => (
          <TableRow key={record.id}>
            <TableCell className="font-medium">{record.employeeName}</TableCell>
            <TableCell>{record.employeeId}</TableCell>
            <TableCell>{record.badgeId || "-"}</TableCell>
            <TableCell>{record.timeIn || "-"}</TableCell>
            <TableCell>{record.timeOut || "-"}</TableCell>
            <TableCell>{record.duration || "-"}</TableCell>
            <TableCell>
              <PresenceStatusBadge status={record.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
