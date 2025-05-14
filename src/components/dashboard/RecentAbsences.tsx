
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Absence {
  id: number;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending' | 'rejected';
}

const RecentAbsences = () => {
  // Données d'exemple pour les absences
  const absences: Absence[] = [
    {
      id: 1,
      employeeName: "Éric Martin",
      type: "Congés payés",
      startDate: "10 Mai 2025",
      endDate: "17 Mai 2025",
      status: "approved"
    },
    {
      id: 2,
      employeeName: "Camille Dubois",
      type: "Maladie",
      startDate: "12 Mai 2025",
      endDate: "14 Mai 2025",
      status: "approved"
    },
    {
      id: 3,
      employeeName: "Pierre Lefevre",
      type: "RTT",
      startDate: "15 Mai 2025",
      endDate: "15 Mai 2025",
      status: "pending"
    },
    {
      id: 4,
      employeeName: "Julie Moreau",
      type: "Congés sans solde",
      startDate: "20 Mai 2025",
      endDate: "24 Mai 2025",
      status: "rejected"
    }
  ];

  const getStatusBadge = (status: Absence['status']) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Absences récentes</CardTitle>
        <CardDescription>Suivi des dernières absences des employés</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {absences.map(absence => (
            <div key={absence.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{absence.employeeName}</p>
                <p className="text-sm text-gray-500">{absence.type}</p>
                <p className="text-xs mt-1">
                  {absence.startDate === absence.endDate 
                    ? absence.startDate 
                    : `${absence.startDate} - ${absence.endDate}`}
                </p>
              </div>
              <div>
                {getStatusBadge(absence.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAbsences;
