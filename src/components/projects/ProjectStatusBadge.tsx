
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProjectStatusBadgeProps {
  status: 'active' | 'pending' | 'completed' | 'canceled';
}

const statusConfig = {
  active: {
    label: 'Actif',
    className: 'bg-green-500 hover:bg-green-600'
  },
  pending: {
    label: 'En attente',
    className: 'bg-yellow-500 hover:bg-yellow-600'
  },
  completed: {
    label: 'Terminé',
    className: 'bg-blue-500 hover:bg-blue-600'
  },
  canceled: {
    label: 'Annulé',
    className: 'bg-red-500 hover:bg-red-600'
  }
};

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge className={cn('text-white', config.className)}>
      {config.label}
    </Badge>
  );
};

export default ProjectStatusBadge;
