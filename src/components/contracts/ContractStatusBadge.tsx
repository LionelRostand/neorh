
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
    case 'pending_signature':
      return <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200">En attente de signature</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200">Brouillon</Badge>;
    case 'signed':
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200">Signé</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
};

export default ContractStatusBadge;

