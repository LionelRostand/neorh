
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";

const EmptyProjectsRow: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
        Aucun projet ajouté pour cette semaine
      </TableCell>
    </TableRow>
  );
};

export default EmptyProjectsRow;
