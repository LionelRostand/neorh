
import React from "react";
import { Badge } from "@/components/ui/badge";

interface LeaveTypeBadgeProps {
  type: string;
}

const LeaveTypeBadge = ({ type }: LeaveTypeBadgeProps) => {
  const getLeaveTypeLabel = (type: string): string => {
    switch (type) {
      case 'paid': return 'Congé payé';
      case 'rtt': return 'RTT';
      case 'sick': return 'Congé Maladie';
      case 'family': return 'Congé Familial';
      case 'maternity': return 'Congé Maternité';
      case 'paternity': return 'Congé Paternité';
      case 'annual': return 'Congé annuel';
      default: return type;
    }
  };
  
  return <Badge>{getLeaveTypeLabel(type)}</Badge>;
};

export default LeaveTypeBadge;
