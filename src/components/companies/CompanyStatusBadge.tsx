
import React from "react";
import { Badge } from "@/components/ui/badge";

interface CompanyStatusBadgeProps {
  status: string;
}

const CompanyStatusBadge = ({ status }: CompanyStatusBadgeProps) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">Active</Badge>;
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200">En attente</Badge>;
    case 'inactive':
      return <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200">Inactive</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
};

export default CompanyStatusBadge;
