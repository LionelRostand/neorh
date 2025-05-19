
import React, { useState, useEffect, useCallback } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "@/components/ui/use-toast";
import { Contract } from "@/lib/constants";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";
import ContractSearch from "@/components/contracts/ContractSearch";
import ContractTable from "@/components/contracts/ContractTable";

const Contrats = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { getAll, isLoading, error } = useCollection<'hr_contracts'>();

  // Fonction pour récupérer les contrats
  const fetchContracts = useCallback(async () => {
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
  }, [getAll]);

  // Charger les contrats au chargement de la page
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Count contracts by status
  const countByStatus = {
    active: contracts.filter(c => c.status === 'active').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    total: contracts.length
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

  // Rafraîchir les contrats manuellement
  const handleRefresh = useCallback(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Filter contracts based on search term
  const filteredContracts = contracts.filter(contract => 
    contract.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contract.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des contrats</h1>
          <p className="text-muted-foreground">Gérez les contrats des employés</p>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Liste des contrats</h2>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                size="sm"
              >
                Rafraîchir
              </Button>
            </div>
            
            <ContractSearch 
              value={searchTerm}
              onChange={setSearchTerm}
            />

            <ContractTable 
              contracts={filteredContracts}
              loading={loading}
              onDetails={handleDetails}
              onEdit={handleEdit}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contrats;
