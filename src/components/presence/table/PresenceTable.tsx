
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
      <TableRow>
        <TableCell colSpan={7} className="text-center py-4">
          Chargement des données...
        </TableCell>
      </TableRow>
    );
  }
  
  if (error) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-4 text-red-500">
          Erreur lors du chargement des données
        </TableCell>
      </TableRow>
    );
  }
  
  if (records.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-4">
          Aucun enregistrement de présence pour cette journée
        </TableCell>
      </TableRow>
    );
  }
  
  return (
    <>
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
    </>
  );
};
