
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFirestore } from "@/hooks/firestore";
import { Timesheet } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";

export const useTimesheetData = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);
  
  // Using useFirestore to directly access the hr_timesheet collection
  const timesheetCollection = useFirestore<Timesheet>('hr_timesheet');

  // Memoize the fetch function to avoid recreation on each render
  const fetchTimesheets = useCallback(async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    try {
      console.log('Fetching all timesheets in useTimesheetData');
      // Get all timesheets from the hr_timesheet collection
      const result = await timesheetCollection.getAll();
      
      if (isMounted.current) {
        if (result.docs && result.docs.length > 0) {
          console.log('Fetched timesheets in useTimesheetData:', result.docs);
          
          // Filter out incomplete timesheet objects
          const validTimesheets = result.docs.filter(doc => {
            // Check if the timesheet has at least some basic required fields
            return doc && doc.id && (doc.status || doc.weekStartDate || doc.employeeId);
          });
          
          setTimesheets(validTimesheets as Timesheet[]);
        } else {
          console.log('No timesheets found in useTimesheetData, using mock data');
          // If no data is found, fall back to mock data
          setTimesheets([
            {
              id: "1",
              employeeId: "1",
              date: "2025-05-10",
              taskDescription: "Développement frontend",
              hoursWorked: 8,
              weekStartDate: "2025-05-10",
              weekEndDate: "2025-05-16",
              hours: 40,
              status: "approved",
              submittedAt: "2025-05-10T18:00:00",
              approvedBy: "Manager1",
              approvedAt: "2025-05-11T09:30:00"
            },
            {
              id: "2",
              employeeId: "2",
              date: "2025-05-11",
              projectId: "PROJ-001",
              taskDescription: "Réunion client",
              hoursWorked: 2,
              weekStartDate: "2025-05-10",
              weekEndDate: "2025-05-16",
              hours: 35,
              status: "submitted",
              submittedAt: "2025-05-11T17:45:00"
            },
            {
              id: "3",
              employeeId: "1",
              date: "2025-05-12",
              projectId: "PROJ-002",
              taskDescription: "Tests d'intégration",
              hoursWorked: 6,
              weekStartDate: "2025-05-10",
              weekEndDate: "2025-05-16",
              hours: 38,
              status: "draft"
            }
          ]);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des feuilles de temps:", error);
      if (isMounted.current) {
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les feuilles de temps",
          variant: "destructive"
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [timesheetCollection]);

  useEffect(() => {
    // Set isMounted to true when the component mounts
    isMounted.current = true;
    
    // Fetch timesheets only once at mount
    fetchTimesheets();
    
    // Clean up function to prevent memory leaks
    return () => {
      isMounted.current = false;
    };
  }, [fetchTimesheets]); // Only depend on the memoized fetchTimesheets

  // Calculate counts by status
  const countByStatus = {
    draft: timesheets.filter(t => t.status === 'draft').length,
    submitted: timesheets.filter(t => t.status === 'submitted').length,
    approved: timesheets.filter(t => t.status === 'approved').length,
    rejected: timesheets.filter(t => t.status === 'rejected').length
  };

  const refreshTimesheets = useCallback(async () => {
    if (isMounted.current) {
      await fetchTimesheets();
    }
  }, [fetchTimesheets]);

  return {
    timesheets,
    loading,
    countByStatus,
    refreshTimesheets
  };
};
