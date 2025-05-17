
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FileText, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  title: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ title }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
};

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
  title: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, title }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Réessayer
        </Button>
      </div>
      <div className="p-4 text-red-500 border border-red-300 rounded-md">
        Erreur: {error.message}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  onRefresh: () => void;
  title: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh, title }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Rafraîchir
        </Button>
      </div>
      <div className="space-y-6 text-center py-10">
        <div className="flex justify-center">
          <FileText className="h-16 w-16 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold">Aucune feuille de temps</h3>
        <p className="text-gray-500">
          Aucune feuille de temps n'est disponible pour cet employé.
        </p>
      </div>
    </div>
  );
};
