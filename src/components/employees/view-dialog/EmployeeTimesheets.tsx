
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/hooks/useFirestore';
import { Timesheet } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';

// Helper function to format date
const formatDate = (date: string): string => {
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Date invalide';
  }
};

interface EmployeeTimesheetsProps {
  employeeId: string;
}

const EmployeeTimesheets: React.FC<EmployeeTimesheetsProps> = ({ employeeId }) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  
  const timesheetsCollection = useFirestore<Timesheet>('hr_timesheet');
  
  useEffect(() => {
    // Marque le composant comme monté
    isMounted.current = true;
    
    const fetchTimesheets = async () => {
      if (!employeeId) {
        setTimesheets([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Search for timesheets related to this employee
        const result = await timesheetsCollection.search('employeeId', employeeId);
        
        // Ne met à jour l'état que si le composant est toujours monté
        if (isMounted.current) {
          // Trier côté client
          const sortedDocs = [...result.docs].sort((a, b) => {
            // Tri par date de soumission décroissante
            const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
            const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
            return dateB - dateA;
          });
          
          console.log(`Fetched ${sortedDocs.length} timesheets for employee ${employeeId}`);
          setTimesheets(sortedDocs);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des feuilles de temps:', err);
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error('Erreur inconnue'));
          // Affichage d'un toast pour informer l'utilisateur
          toast({
            title: "Erreur de recherche",
            description: "Impossible de récupérer les feuilles de temps.",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    fetchTimesheets();
    
    // Nettoyage pour éviter les mises à jour sur des composants démontés
    return () => {
      isMounted.current = false;
    };
  }, [employeeId, timesheetsCollection]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Feuilles de temps</h3>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Feuilles de temps</h3>
        <div className="p-4 text-red-500 border border-red-300 rounded-md">
          Erreur: {error.message}
        </div>
      </div>
    );
  }

  if (!timesheets || timesheets.length === 0) {
    return (
      <div className="space-y-6 text-center py-10">
        <div className="flex justify-center">
          <FileText className="h-16 w-16 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold">Aucune feuille de temps</h3>
        <p className="text-gray-500">
          Aucune feuille de temps n'est disponible pour cet employé.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Feuilles de temps</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Période</TableHead>
            <TableHead>Projet</TableHead>
            <TableHead>Heures</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Soumis le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.map((timesheet) => (
            <TableRow key={timesheet.id}>
              <TableCell>
                {timesheet.weekStartDate && timesheet.weekEndDate 
                  ? `${formatDate(timesheet.weekStartDate)} - ${formatDate(timesheet.weekEndDate)}` 
                  : 'Non défini'}
              </TableCell>
              <TableCell>{timesheet.projectId || 'Non assigné'}</TableCell>
              <TableCell>{timesheet.hours || 0}h</TableCell>
              <TableCell>
                <Badge 
                  variant={timesheet.status === 'approved' ? 'default' : 
                          timesheet.status === 'rejected' ? 'destructive' : 
                          'outline'}
                >
                  {timesheet.status === 'submitted' ? 'En attente' : 
                   timesheet.status === 'approved' ? 'Approuvé' : 
                   timesheet.status === 'rejected' ? 'Rejeté' : 'Brouillon'}
                </Badge>
              </TableCell>
              <TableCell>
                {timesheet.submittedAt ? formatDate(timesheet.submittedAt) : 'Non soumis'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTimesheets;
