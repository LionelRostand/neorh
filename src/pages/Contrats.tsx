
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Filter, Plus, Check, X } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";
import { Contract } from "@/types/firebase";

const Contrats = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAll, isLoading, error } = useCollection<'hr_contracts'>();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const result = await getAll();
      if (result.docs) {
        const typedContracts = result.docs.map(doc => ({
          id: doc.id || '',
          employeeId: doc.employeeId || '',
          type: doc.type || '',
          startDate: doc.startDate || '',
          endDate: doc.endDate || '',
          status: doc.status || '',
          terms: doc.terms || '',
          salary: doc.salary || 0,
          benefits: doc.benefits || '',
          documents: doc.documents || []
        } as Contract));
        
        setContracts(typedContracts);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des contrats:", error);
      showErrorToast("Impossible de charger les contrats");
    } finally {
      setLoading(false);
    }
  };

  // Compter les contrats par statut
  const countByStatus = {
    draft: contracts.filter(c => c.status === 'draft').length,
    active: contracts.filter(c => c.status === 'active').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    total: contracts.length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approuvé</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Refusé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const handleNewContract = () => {
    showSuccessToast("Cette fonctionnalité sera bientôt disponible");
  };

  const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate) return "-";
    if (!endDate) {
      return `${startDate} - 0 jour`;
    }
    return `${startDate} - ${endDate}`;
  };

  const handleApprove = (id: string) => {
    showSuccessToast("Contrat approuvé");
  };

  const handleReject = (id: string) => {
    showErrorToast("Contrat refusé");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Contrats</h1>
          <p className="text-gray-500">Gestion des contrats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filtres
          </Button>
          <Button variant="default" className="gap-2 bg-emerald-500 hover:bg-emerald-600" onClick={handleNewContract}>
            <Plus className="h-4 w-4" /> Nouvelle demande
          </Button>
        </div>
      </div>

      <ContractStatusCards
        draft={countByStatus.draft}
        active={countByStatus.active}
        expired={countByStatus.expired}
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
              ) : contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">Aucun contrat trouvé</TableCell>
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
                    <TableCell>Contrat payés</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>- 0 jour</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge("draft")}</TableCell>
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

export default Contrats;
