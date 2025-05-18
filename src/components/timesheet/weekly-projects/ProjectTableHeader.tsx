
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProjectTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Projet</TableHead>
        <TableHead>Nom</TableHead>
        <TableHead>Jours (max 5)</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ProjectTableHeader;
