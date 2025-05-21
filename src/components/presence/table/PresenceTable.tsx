
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Presence } from '@/types/presence';
import { PresenceStatusBadge } from './PresenceStatusBadge';

interface PresenceTableProps {
  records: Presence[];
  isLoading: boolean;
  error: Error | null;
}

export const PresenceTable: React.FC<PresenceTableProps> = ({ records, isLoading, error }) => {
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Erreur: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Chargement des données...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Aucune présence enregistrée pour cette période.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Identifiant</TableHead>
            <TableHead>Badge</TableHead>
            <TableHead>Horaire prévu</TableHead>
            <TableHead>Heure entrée</TableHead>
            <TableHead>Heure sortie</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.employeeName}</TableCell>
              <TableCell>{record.employeeId}</TableCell>
              <TableCell>{record.badgeId || '-'}</TableCell>
              <TableCell>
                {record.scheduledStart && record.scheduledEnd ? 
                  `${record.scheduledStart} - ${record.scheduledEnd}` : 
                  'Non défini'}
              </TableCell>
              <TableCell>{record.timeIn || '-'}</TableCell>
              <TableCell>{record.timeOut || '-'}</TableCell>
              <TableCell>{record.duration || '-'}</TableCell>
              <TableCell>
                <PresenceStatusBadge status={record.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
