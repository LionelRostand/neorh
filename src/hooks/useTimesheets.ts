
import { useState, useEffect, useCallback, useRef } from 'react';
import { useFirestore } from './firestore';
import { Timesheet } from '@/lib/constants';
import { SearchOptions } from './firestore/searchOperations';
import { showErrorToast } from '@/utils/toastUtils';

export const useTimesheets = (employeeId: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const hasLoadedRef = useRef(false);
  const previousEmployeeId = useRef(employeeId);
  
  const { search } = useFirestore<Timesheet>('hr_timesheet');
  
  // Fonction de chargement des données, exposée pour permettre le rafraîchissement
  const fetchTimesheets = useCallback(async (forceRefresh = false) => {
    // Si l'ID employé est le même et qu'on a déjà chargé les données une fois, ne pas recharger
    // sauf si on force le rafraîchissement
    if (!forceRefresh && 
        hasLoadedRef.current && 
        employeeId === previousEmployeeId.current && 
        timesheets.length > 0) {
      console.log('Utilisation du cache pour les feuilles de temps, ID employé inchangé:', employeeId);
      return;
    }
    
    if (!employeeId) {
      setIsLoading(false);
      setTimesheets([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    console.log(`Tentative de récupération des feuilles de temps pour l'employé: ${employeeId}`);
    previousEmployeeId.current = employeeId;
    
    try {
      // Utiliser une recherche simple sans tri pour éviter les erreurs d'index
      const searchOptions: SearchOptions = {};
      
      const result = await search('employeeId', employeeId, searchOptions);
      console.log('Résultats de recherche des feuilles de temps:', result);
      
      // Vérifier que le composant est toujours monté avant de mettre à jour l'état
      if (!isMounted.current) return;
      
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
      
      // Marquer comme chargé pour éviter les requêtes redondantes
      hasLoadedRef.current = true;
      
    } catch (err) {
      console.error('Erreur lors de la récupération des feuilles de temps:', err);
      const fetchError = err instanceof Error ? err : new Error('Échec de récupération des feuilles de temps');
      
      // Vérifier si le composant est toujours monté avant de mettre à jour l'état
      if (!isMounted.current) return;
      
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
      // Vérifier que le composant est toujours monté avant de mettre à jour l'état
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [employeeId, search, timesheets.length]);
  
  // Nettoyer lors du démontage du composant
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Charger les données au chargement du composant
  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);
  
  // Fonction pour forcer le rafraîchissement
  const refreshTimesheets = useCallback(() => {
    return fetchTimesheets(true);
  }, [fetchTimesheets]);
  
  return {
    timesheets,
    isLoading,
    error,
    refreshTimesheets
  };
};
