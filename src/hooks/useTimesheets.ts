
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from './firestore';
import { Timesheet } from '@/lib/constants';
import { SearchOptions } from './firestore/searchOperations';
import { showErrorToast } from '@/utils/toastUtils';

export const useTimesheets = (employeeId: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { search } = useFirestore<Timesheet>('hr_timesheet');
  
  // Fonction de chargement des données, exposée pour permettre le rafraîchissement
  const fetchTimesheets = useCallback(async () => {
    if (!employeeId) {
      setIsLoading(false);
      setTimesheets([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    console.log(`Tentative de récupération des feuilles de temps pour l'employé: ${employeeId}`);
    
    try {
      // Utiliser une recherche simple sans tri pour éviter les erreurs d'index
      const searchOptions: SearchOptions = {};
      
      const result = await search('employeeId', employeeId, searchOptions);
      console.log('Résultats de recherche des feuilles de temps:', result);
      
      if (result.docs && result.docs.length > 0) {
        // Trier côté client pour éviter les erreurs d'index Firebase
        const sortedDocs = [...result.docs].sort((a, b) => {
          if (a.weekStartDate && b.weekStartDate) {
            return new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime();
          }
          return 0;
        });
        setTimesheets(sortedDocs);
      } else {
        // Si aucun résultat, utiliser un tableau vide plutôt que des données fictives
        // pour mieux refléter l'état réel des données
        console.log('Aucune feuille de temps trouvée pour cet employé');
        setTimesheets([]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des feuilles de temps:', err);
      const fetchError = err instanceof Error ? err : new Error('Échec de récupération des feuilles de temps');
      
      // Vérifier si l'erreur concerne un index manquant
      const errorMessage = fetchError.message || '';
      const isIndexError = errorMessage.includes('index') || errorMessage.includes('composite');
      
      if (isIndexError) {
        console.warn("Erreur d'index Firebase détectée, chargement des données de secours");
        showErrorToast(`Erreur d'index Firebase. Chargement des données temporaires.`);
        
        // Charger des données fictives pour le développement seulement en cas d'erreur d'index
        setTimesheets([
          {
            id: "1",
            employeeId: employeeId,
            weekStartDate: "2025-05-10",
            weekEndDate: "2025-05-16",
            hours: 40,
            status: "approved",
            submittedAt: "2025-05-16T18:00:00",
            dailyEntries: [
              { date: "2025-05-10", hours: 1, projectId: "PROJ-001", notes: "Développement" },
              { date: "2025-05-11", hours: 0.5, projectId: "PROJ-002", notes: "Tests" },
              { date: "2025-05-12", hours: 1, projectId: "PROJ-001", notes: "Réunion" }
            ]
          },
          {
            id: "2",
            employeeId: employeeId,
            weekStartDate: "2025-05-03", 
            weekEndDate: "2025-05-09",
            hours: 35,
            status: "submitted",
            submittedAt: "2025-05-09T17:00:00"
          }
        ]);
      } else {
        setError(fetchError);
        showErrorToast(`Erreur de chargement des feuilles de temps: ${fetchError.message}`);
        // Même en cas d'erreur, afficher un tableau vide plutôt qu'un état null
        setTimesheets([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, search]);
  
  // Charger les données au chargement du composant
  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);
  
  return {
    timesheets,
    isLoading,
    error,
    refreshTimesheets: fetchTimesheets // Exposer la fonction pour permettre le rafraîchissement
  };
};
