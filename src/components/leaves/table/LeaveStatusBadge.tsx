
import React from "react";
import { Badge } from "@/components/ui/badge";

interface LeaveStatusBadgeProps {
  status: string;
}

const LeaveStatusBadge = ({ status }: LeaveStatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>;
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 border-green-300">Approuvé</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 border-red-300">Refusé</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
};

export default LeaveStatusBadge;
