
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertCircle } from "lucide-react";

interface CompanyStatusBadgeProps {
  status: string;
}

const CompanyStatusBadge = ({ status }: CompanyStatusBadgeProps) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200 flex items-center gap-1 px-2 py-1">
          <Check className="h-3 w-3" />
          <span>Active</span>
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 flex items-center gap-1 px-2 py-1">
          <Clock className="h-3 w-3" />
          <span>En attente</span>
        </Badge>
      );
    case 'inactive':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200 flex items-center gap-1 px-2 py-1">
          <AlertCircle className="h-3 w-3" />
          <span>Inactive</span>
        </Badge>
      );
    default:
      return <Badge>Inconnu</Badge>;
  }
};

export default CompanyStatusBadge;
