
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useLeaveAllocation, useEmployeeLeaveData, useLeaveTypeLabels } from './leaves';
import { HR } from '@/lib/constants/collections';

// Re-export LeaveAllocation interface for backward compatibility
export type { LeaveAllocation } from './leaves';

export const useEmployeeLeaves = (employeeId: string) => {
  // Reference to track if the hook is mounted
  const isMountedRef = useRef(true);
  // Reference to control data loading state
  const dataLoadedRef = useRef(false);
  // Reference to prevent multiple fetches for the same employee ID
  const lastFetchedIdRef = useRef<string>("");

  // Use our smaller hooks with stabilized inputs
  const { 
    leaves,
    loading: leavesLoading,
    error,
    totalDays,
    fetchLeaves
  } = useEmployeeLeaveData(employeeId);

  const {
    allocation,
    loading: allocationLoading,
    fetchAllocation,
    updateLeaveAllocation
  } = useLeaveAllocation(employeeId);

  const {
    getLeaveTypeLabel
  } = useLeaveTypeLabels();

  // Use useEffect to control initial loading, only once
  useEffect(() => {
    // Mark component as mounted
    isMountedRef.current = true;
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      dataLoadedRef.current = false;
      lastFetchedIdRef.current = "";
    };
  }, []);

  // Fix pour éviter les boucles infinies - Ne charger que si nécessaire
  useEffect(() => {
    // Éviter les appels multiples pour le même employé ou si l'ID est vide
    if (!employeeId || employeeId === lastFetchedIdRef.current || !isMountedRef.current || dataLoadedRef.current) {
      return;
    }

    // Journalisation pour débogage
    console.log(`[useEmployeeLeaves] Chargement initial des données pour l'employé: ${employeeId}`);
    
    // Marquer comme déjà chargé pour éviter les appels répétés
    lastFetchedIdRef.current = employeeId;
    dataLoadedRef.current = true;
    
    // Charger les congés et allocations en parallèle
    Promise.all([
      fetchLeaves(),
      fetchAllocation()
    ]).catch(err => {
      console.error(`[useEmployeeLeaves] Erreur lors du chargement:`, err);
      // En cas d'erreur, réinitialiser pour permettre une nouvelle tentative
      dataLoadedRef.current = false;
    });
  }, [employeeId, fetchLeaves, fetchAllocation]);

  // Fonction pour recharger manuellement les données (uniquement sur demande explicite)
  const refetch = useCallback(() => {
    if (!employeeId || !isMountedRef.current) {
      return;
    }
    
    console.log(`[useEmployeeLeaves] Rechargement manuel pour l'employé: ${employeeId}`);
    
    // Charger les congés et allocations en parallèle
    Promise.all([
      fetchLeaves(),
      fetchAllocation()
    ]).catch(err => {
      console.error(`[useEmployeeLeaves] Erreur lors du rechargement:`, err);
    });
  }, [employeeId, fetchLeaves, fetchAllocation]);

  // Valeurs dérivées mémorisées pour éviter les re-rendus inutiles
  const paidLeavesRemaining = useMemo(() => {
    return allocation ? allocation.paidLeavesTotal - allocation.paidLeavesUsed : 0;
  }, [allocation]);

  const rttRemaining = useMemo(() => {
    return allocation ? allocation.rttTotal - allocation.rttUsed : 0;
  }, [allocation]);

  return {
    leaves,
    loading: leavesLoading || allocationLoading,
    error,
    totalDays,
    allocation,
    allocationLoading,
    getLeaveTypeLabel,
    refetch,
    updateLeaveAllocation,
    paidLeavesRemaining,
    paidLeavesTotal: allocation?.paidLeavesTotal || 0,
    rttRemaining,
    rttTotal: allocation?.rttTotal || 0
  };
};
