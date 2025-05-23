
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Employee } from "@/types/employee";

interface EmployeeAnniversariesProps {
  employees?: Employee[];
  isLoading?: boolean;
}

const EmployeeAnniversaries = ({ employees = [], isLoading = false }: EmployeeAnniversariesProps) => {
  // Fonction pour obtenir les anniversaires d'embauche
  const getUpcomingAnniversaries = () => {
    const today = new Date();
    
    if (!employees || employees.length === 0) {
      return [
        { id: "1", name: "Alexandre Martin", startDate: "2020-05-12", department: "Développement" },
        { id: "2", name: "Julie Dubois", startDate: "2021-05-20", department: "Design" },
        { id: "3", name: "Thomas Bernard", startDate: "2019-05-28", department: "Marketing" }
      ];
    }
    
    return employees
      .filter(emp => emp.startDate && emp.status === 'active')
      .sort((a, b) => {
        const dateA = new Date(a.startDate || '');
        const dateB = new Date(b.startDate || '');
        
        const nextAnnivA = new Date(today.getFullYear(), dateA.getMonth(), dateA.getDate());
        const nextAnnivB = new Date(today.getFullYear(), dateB.getMonth(), dateB.getDate());
        
        if (nextAnnivA < today) nextAnnivA.setFullYear(today.getFullYear() + 1);
        if (nextAnnivB < today) nextAnnivB.setFullYear(today.getFullYear() + 1);
        
        return nextAnnivA.getTime() - nextAnnivB.getTime();
      })
      .slice(0, 5);
  };

  const anniversaries = getUpcomingAnniversaries();
  
  const formatAnniversaryDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date invalide";
      
      const now = new Date();
      const thisYearAnniversary = new Date(now.getFullYear(), date.getMonth(), date.getDate());
      
      if (thisYearAnniversary < now) {
        thisYearAnniversary.setFullYear(now.getFullYear() + 1);
      }
      
      const timeLeft = formatDistanceToNow(thisYearAnniversary, { locale: fr, addSuffix: true });
      const years = now.getFullYear() - date.getFullYear() + (thisYearAnniversary > now ? 1 : 0);
      
      return `${timeLeft} (${years} ans)`;
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return "Date invalide";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          ANNIVERSAIRES D'EMBAUCHE
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {anniversaries.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun anniversaire d'embauche à venir</p>
            ) : (
              anniversaries.map((employee) => (
                <div key={employee.id} className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.department && `${employee.department} • `}
                      {formatAnniversaryDate(employee.startDate || '')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeAnniversaries;
