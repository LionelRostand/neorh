
import React from 'react';

interface PresenceStatusBadgeProps {
  status: string;
}

export const PresenceStatusBadge: React.FC<PresenceStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return "bg-green-100 text-green-800";
      case 'absent': return "bg-gray-100 text-gray-800";
      case 'late': return "bg-amber-100 text-amber-800";
      case 'early-leave': return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return "Présent";
      case 'absent': return "Absent";
      case 'late': return "Retard";
      case 'early-leave': return "Départ anticipé";
      default: return status;
    }
  };
  
  return (
    <span className={`py-1 px-2 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusText(status)}
    </span>
  );
};
