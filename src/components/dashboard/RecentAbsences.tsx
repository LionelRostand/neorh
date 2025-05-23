import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection } from "@/hooks/useCollection";
import { Leave } from "@/types/firebase";
import { HR } from "@/lib/constants/collections";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const RecentAbsences = () => {
  const [recentLeaves, setRecentLeaves] = useState<Leave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAll } = useCollection(HR.LEAVES);
  const { employees } = useEmployeeData();

  useEffect(() => {
    const fetchRecentLeaves = async () => {
      try {
        const result = await getAll();
        
        if (result.docs) {
          // Filter out allocations, sort by start date (newest first), and limit to 4
          const leavesData = result.docs
            .filter(leave => leave.type !== 'allocation')
            .sort((a, b) => {
              // If dates are not available, keep the original order
              if (!a.startDate || !b.startDate) return 0;
              return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
            })
            .slice(0, 4);
          
          setRecentLeaves(leavesData);
        } else {
          // Pas de données trouvées, définir un tableau vide
          setRecentLeaves([]);
        }
      } catch (error) {
        console.error("Error fetching recent leaves:", error);
        // En cas d'erreur, définir un tableau vide pour éviter les chargements infinis
        setRecentLeaves([]);
      } finally {
        // Toujours terminer le chargement, même en cas d'erreur
        setIsLoading(false);
      }
    };

    // Exécuter seulement une fois, ne pas dépendre de getAll qui pourrait changer
    if (isLoading) {
      fetchRecentLeaves();
    }
  }, [getAll, isLoading]);

  const getStatusBadge = (status: Leave['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Refusé</Badge>;
      default:
        return null;
    }
  };

  const getEmployeeName = (employeeId: string) => {
    if (!employees) return "Employé inconnu";
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return "Employé inconnu";
    
    // Use the 'name' property instead of firstName and lastName
    return employee.name;
  };

  const getLeaveTypeLabel = (type: string): string => {
    switch (type) {
      case 'paid': return 'Congé payé';
      case 'rtt': return 'RTT';
      case 'sick': return 'Congé Maladie';
      case 'family': return 'Congé Familial';
      case 'maternity': return 'Congé Maternité';
      case 'paternity': return 'Congé Paternité';
      case 'other': return 'Autre congé';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  // Définir un timeout pour le chargement - ne pas attendre indéfiniment
  useEffect(() => {
    const timer = setTimeout(() => {
      // Si après 5 secondes, on est toujours en chargement, forcer la fin du chargement
      if (isLoading) {
        console.warn("Timeout dépassé pour le chargement des absences récentes");
        setIsLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Absences récentes</CardTitle>
          <CardDescription>Suivi des dernières absences des employés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(index => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Absences récentes</CardTitle>
        <CardDescription>Suivi des dernières absences des employés</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLeaves.length > 0 ? (
            recentLeaves.map(leave => (
              <div key={leave.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{getEmployeeName(leave.employeeId)}</p>
                  <p className="text-sm text-gray-500">{getLeaveTypeLabel(leave.type)}</p>
                  <p className="text-xs mt-1">
                    {leave.startDate === leave.endDate 
                      ? formatDate(leave.startDate) 
                      : `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`}
                  </p>
                </div>
                <div>
                  {getStatusBadge(leave.status)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              Aucune absence récente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAbsences;
