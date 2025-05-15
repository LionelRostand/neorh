
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import EmployeeAvatar from "@/components/common/EmployeeAvatar";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";

interface Contract {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  position: string;
  type: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'expired' | 'pending';
}

const Departements = () => {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractStats, setContractStats] = useState({
    total: 2,
    active: 2,
    pending: 0,
    expired: 0
  });

  // Simuler le chargement des contrats
  useEffect(() => {
    // Simuler des données de contrats
    const mockContracts: Contract[] = [
      {
        id: "1",
        employeeId: "emp1",
        employeeName: "Lionel DJOSSA",
        position: "PDG",
        type: "CDI",
        startDate: "03/05/2025",
        status: 'active'
      },
      {
        id: "2",
        employeeId: "emp2",
        employeeName: "Employé inconnu",
        position: "Non spécifié",
        type: "CDI",
        startDate: "",
        status: 'active'
      }
    ];

    setContracts(mockContracts);
  }, []);

  const handleNewContract = () => {
    toast({
      title: "Nouveau contrat",
      description: "La création d'un nouveau contrat sera disponible prochainement."
    });
  };

  const handleDetails = (contractId: string) => {
    toast({
      title: "Détails du contrat",
      description: `Affichage des détails du contrat ${contractId} à venir.`
    });
  };

  const handleEdit = (contractId: string) => {
    toast({
      title: "Modifier le contrat",
      description: `Modification du contrat ${contractId} à venir.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with title and button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des contrats</h1>
        <Button onClick={handleNewContract}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau
        </Button>
      </div>

      {/* Contract Status Cards */}
      <ContractStatusCards
        total={contractStats.total}
        active={contractStats.active}
        pending={contractStats.pending}
        expired={contractStats.expired}
      />

      {/* Contracts table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Liste des contrats</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Employé</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Poste</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Début</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Fin</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 mr-3">
                        <AspectRatio ratio={1/1} className="bg-gray-100 rounded-full overflow-hidden">
                          <EmployeeAvatar 
                            employeeId={contract.employeeId} 
                            name={contract.employeeName}
                            className="h-full w-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{contract.employeeName}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{contract.position}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{contract.type}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{contract.startDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{contract.endDate || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {contract.status === 'active' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Actif
                      </span>
                    )}
                    {contract.status === 'pending' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        À venir
                      </span>
                    )}
                    {contract.status === 'expired' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Expiré
                      </span>
                    )}
                    {contract.status === 'draft' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Brouillon
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDetails(contract.id)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(contract.id)}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Departements;
