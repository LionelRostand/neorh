
import React from 'react';

interface LeaveStatusBadgeProps {
  status: string;
}

const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'approved':
      return (
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-green-700">Approuvé</span>
        </div>
      );
    case 'rejected':
      return (
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span className="text-red-700">Refusé</span>
        </div>
      );
    case 'pending':
    default:
      return (
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
          <span className="text-yellow-700">En attente</span>
        </div>
      );
  }
};

export default LeaveStatusBadge;
