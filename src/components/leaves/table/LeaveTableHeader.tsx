
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LeaveTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Employé</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Période</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead>Responsable</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default LeaveTableHeader;
