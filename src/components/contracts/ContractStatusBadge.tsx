
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ContractStatusBadgeProps {
  status: string;
}

const ContractStatusBadge = ({ status }: ContractStatusBadgeProps) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">Actif</Badge>;
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200">À venir</Badge>;
    case 'expired':
      return <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200">Expiré</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
};

export default ContractStatusBadge;
