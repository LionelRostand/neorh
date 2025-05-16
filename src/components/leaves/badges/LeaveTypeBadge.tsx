
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LeaveTypeBadgeProps {
  type: string;
}

const LeaveTypeBadge: React.FC<LeaveTypeBadgeProps> = ({ type }) => {
  switch (type) {
    case 'paid':
    case 'annual':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Congés payés</Badge>;
    case 'rtt':
      return <Badge className="bg-green-100 text-green-800 border-green-300">RTT</Badge>;
    case 'sick':
      return <Badge className="bg-red-100 text-red-800 border-red-300">Maladie</Badge>;
    case 'maternity':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Maternité</Badge>;
    case 'paternity':
      return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Paternité</Badge>;
    case 'family':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Familial</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Autre</Badge>;
  }
};

export default LeaveTypeBadge;
