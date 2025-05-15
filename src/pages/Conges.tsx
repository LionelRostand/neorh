
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Filter, Plus, Check, X } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import LeaveStatusCards from "@/components/leaves/LeaveStatusCards";
import { Leave } from "@/lib/constants"; // Import the Leave type from constants instead

const Conges = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAll, isLoading, error } = useCollection<'hr_leaves'>(); // Use the correct collection key

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const result = await getAll();
      if (result.docs) {
        // Ensure we map the data to match the Leave type
        const typedLeaves = result.docs.map(doc => ({
          id: doc.id || '',
          employeeId: doc.employeeId || '',
          type: doc.type || '',
          startDate: doc.startDate || '',
          endDate: doc.endDate || '',
          status: doc.status || ''
        } as Leave));
        
        setLeaves(typedLeaves);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des congés:", error);
      showErrorToast("Impossible de charger les demandes de congés");
    } finally {
      setLoading(false);
    }
  };

  // Compter les congés par statut
  const countByStatus = {
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
    total: leaves.length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Refusé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const handleNewRequest = () => {
    showSuccessToast("Cette fonctionnalité sera bientôt disponible");
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return "-";
    if (!endDate || startDate === endDate) {
      return `${startDate} - 0 jour`;
    }
    return `${startDate} - ${endDate}`;
  };

  const handleApprove = (id: string) => {
    showSuccessToast("Demande approuvée");
  };

  const handleReject = (id: string) => {
    showErrorToast("Demande refusée");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Congés</h1>
          <p className="text-gray-500">Gestion des demandes de congés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtres
          </Button>
          <Button variant="default" className="gap-2 bg-emerald-500 hover:bg-emerald-600" onClick={handleNewRequest}>
            <Plus className="h-4 w-4" /> Nouvelle demande
          </Button>
        </div>
      </div>

      <LeaveStatusCards
        pending={countByStatus.pending}
        approved={countByStatus.approved}
        rejected={countByStatus.rejected}
        total={countByStatus.total}
      />

      <Card>
        <CardContent className="p-0">
          <div className="p-4 flex justify-between items-center border-b">
            <div className="relative w-full max-w-sm">
              <Input 
                placeholder="Rechercher..." 
                className="pl-8"
              />
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <Button variant="outline" className="gap-2">
                Tous les statuts <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Demande</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">Chargement...</TableCell>
                </TableRow>
              ) : leaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">Aucune demande de congé trouvée</TableCell>
                </TableRow>
              ) : (
                <>
                  {/* Exemple de ligne pour la démo */}
                  <TableRow>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          <span>?</span>
                        </div>
                        <div>
                          <div className="font-medium">Employé inconnu</div>
                          <div className="text-xs text-gray-500">Non spécifié</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Congés payés</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>- 0 jour</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge("pending")}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 h-8" onClick={() => handleApprove("1")}>
                          <Check className="h-4 w-4 mr-1" /> Approuver
                        </Button>
                        <Button variant="ghost" className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 h-8" onClick={() => handleReject("1")}>
                          <X className="h-4 w-4 mr-1" /> Refuser
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Conges;

