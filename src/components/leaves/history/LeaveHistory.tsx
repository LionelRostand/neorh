
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leave } from '@/lib/constants';
import { Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeaveHistoryRowProps {
  leave: Leave;
  formatDate: (date: string) => string;
}

const LeaveHistoryRow: React.FC<LeaveHistoryRowProps> = ({ leave, formatDate }) => {
  // Style en fonction du statut
  const getBadgeVariant = () => {
    switch (leave.status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  // Style en fonction du type
  const getLeaveTypeStyle = () => {
    switch (leave.type) {
      case 'paid':
        return 'text-blue-600';
      case 'rtt':
        return 'text-emerald-600';
      case 'sick':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  // Convertir les types en français
  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case 'paid': return 'Congé payé';
      case 'rtt': return 'RTT';
      case 'sick': return 'Congé Maladie';
      case 'family': return 'Congé Familial';
      case 'maternity': return 'Congé Maternité';
      case 'paternity': return 'Congé Paternité';
      default: return type || 'Autre';
    }
  };

  // Convertir les statuts en français
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Refusé';
      case 'pending': return 'En attente';
      default: return status || 'Inconnu';
    }
  };

  // Calculer le nombre de jours
  const calculateDays = () => {
    if (!leave.startDate || !leave.endDate) return 0;
    
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car on compte le jour de début
  };

  const days = calculateDays();

  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex justify-between items-start">
        <div>
          <div className={`font-medium ${getLeaveTypeStyle()}`}>
            {getLeaveTypeLabel(leave.type)}
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(leave.startDate || '')} - {formatDate(leave.endDate || '')} ({days} jour{days > 1 ? 's' : ''})
          </div>
          {leave.comment && (
            <p className="text-sm text-gray-500 mt-1">"{leave.comment}"</p>
          )}
        </div>
        <Badge className={`${getBadgeVariant()} font-normal`}>
          {getStatusLabel(leave.status)}
        </Badge>
      </div>
    </div>
  );
};

export const ErrorState: React.FC = () => (
  <div className="flex flex-col items-center py-6">
    <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
    <h4 className="text-lg font-medium">Erreur de chargement</h4>
    <p className="text-gray-500 text-center mt-2">
      Impossible de charger l'historique des congés. Veuillez réessayer plus tard.
    </p>
  </div>
);

export const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center py-6">
    <Calendar className="h-10 w-10 text-gray-400 mb-2" />
    <p className="text-gray-500 text-center">
      Aucun congé n'a été enregistré pour cet employé.
    </p>
  </div>
);

interface LeaveHistoryProps {
  leaves: Leave[];
  formatDate: (date: string) => string;
}

export const LeaveHistory: React.FC<LeaveHistoryProps> = ({ leaves, formatDate }) => {
  return (
    <Card className="border rounded-lg shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Historique des demandes</CardTitle>
      </CardHeader>
      <CardContent>
        {leaves && leaves.length > 0 ? (
          <div className="divide-y">
            {leaves.map((leave, index) => (
              <LeaveHistoryRow 
                key={leave.id || index} 
                leave={leave} 
                formatDate={formatDate} 
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
};
