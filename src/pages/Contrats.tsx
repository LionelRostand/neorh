
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, File, Check, Clock, AlertCircle, Info } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "@/components/ui/use-toast";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";
import { Contract } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

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
          employeeName: doc.employeeName || 'Employé inconnu',
          position: doc.position || 'Non spécifié',
          type: doc.type || 'CDI',
          startDate: doc.startDate || '',
          endDate: doc.endDate || '',
          status: doc.status || 'draft'
        } as Contract));
        
        setContracts(typedContracts);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des contrats:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les contrats"
      });
    } finally {
      setLoading(false);
    }
  };

  // Compter les contrats par statut
  const countByStatus = {
    active: contracts.filter(c => c.status === 'active').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    total: contracts.length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200">À venir</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200">Expiré</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const handleNewContract = () => {
    toast({
      title: "Information",
      description: "Cette fonctionnalité sera bientôt disponible"
    });
  };

  const handleDetails = (id: string) => {
    toast({
      title: "Détails",
      description: `Affichage des détails pour le contrat ${id}`
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Modifier",
      description: `Modification du contrat ${id}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des contrats</h1>
        </div>
        <Button 
          onClick={handleNewContract} 
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Nouveau contrat
        </Button>
      </div>

      <ContractStatusCards
        total={countByStatus.total}
        active={countByStatus.active}
        pending={countByStatus.pending}
        expired={countByStatus.expired}
      />

      <Card>
        <CardContent className="p-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Liste des contrats</h2>
            
            <div className="py-4">
              <div className="relative w-full max-w-sm">
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">Chargement...</TableCell>
                    </TableRow>
                  ) : contracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">Aucun contrat trouvé</TableCell>
                    </TableRow>
                  ) : (
                    contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                              {contract.employeeName?.charAt(0) || '?'}
                            </div>
                            <div className="font-medium">{contract.employeeName || 'Employé inconnu'}</div>
                          </div>
                        </TableCell>
                        <TableCell>{contract.position || 'Non spécifié'}</TableCell>
                        <TableCell>{contract.type}</TableCell>
                        <TableCell>{contract.startDate || '-'}</TableCell>
                        <TableCell>{contract.endDate || '—'}</TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => handleDetails(contract.id || '')}>
                              <File className="h-4 w-4 mr-1" /> Détails
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => handleEdit(contract.id || '')}>
                              <Edit className="h-4 w-4 mr-1" /> Modifier
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}

                  {/* Example row for demonstration when no contracts */}
                  {contracts.length === 0 && !loading && (
                    <>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">L</div>
                            <div className="font-medium">Lionel DJOSSA</div>
                          </div>
                        </TableCell>
                        <TableCell>PDG</TableCell>
                        <TableCell>CDI</TableCell>
                        <TableCell>03/05/2025</TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>{getStatusBadge('active')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <File className="h-4 w-4 mr-1" /> Détails
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <Edit className="h-4 w-4 mr-1" /> Modifier
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">?</div>
                            <div className="font-medium">Employé inconnu</div>
                          </div>
                        </TableCell>
                        <TableCell>Non spécifié</TableCell>
                        <TableCell>CDI</TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>{getStatusBadge('active')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <File className="h-4 w-4 mr-1" /> Détails
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <Edit className="h-4 w-4 mr-1" /> Modifier
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contrats;
