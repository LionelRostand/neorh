
import React, { useState, useEffect } from "react";
import { useCollection } from "@/hooks/useCollection";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import EmployeeAvatar from "@/components/common/EmployeeAvatar";
import { Contract } from "@/lib/constants";

const DocumentsRH = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Use the collection hook to access the contracts collection
  const contractsCollection = useCollection<'hr_contracts'>();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        // In a real scenario, we would fetch from Firestore
        // For now, we'll use mock data
        setContracts([
          {
            id: "1",
            employeeId: "emp1",
            employeeName: "Lionel DJOSSA",
            position: "PDG",
            type: "CDI",
            startDate: "2025-05-03",
            status: 'active'
          },
          {
            id: "2",
            employeeId: "emp2",
            employeeName: "Employé inconnu",
            position: "Non spécifié",
            type: "CDI",
            startDate: "2025-05-01",
            status: 'active'
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les contrats",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Status cards data
  const statusCards = [
    {
      title: "Total des contrats",
      count: contracts.length,
      description: "Nombre total de contrats",
      icon: "📄",
      bgColor: "bg-purple-50"
    },
    {
      title: "Contrats actifs",
      count: contracts.filter(c => c.status === 'active').length,
      description: "Employés actuellement sous contrat",
      icon: "👤",
      bgColor: "bg-green-50"
    },
    {
      title: "Contrats à venir",
      count: contracts.filter(c => c.status === 'pending').length,
      description: "Nouveaux contrats en attente de démarrage",
      icon: "📅",
      bgColor: "bg-blue-50"
    },
    {
      title: "Contrats expirés",
      count: contracts.filter(c => c.status === 'expired').length,
      description: "Contrats arrivés à échéance",
      icon: "📦",
      bgColor: "bg-red-50"
    }
  ];

  const filteredContracts = contracts.filter(contract => 
    contract.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des contrats</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Nouveau contrat
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card, index) => (
          <Card key={index} className={`${card.bgColor}`}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <h3 className="text-3xl font-bold mt-2">{card.count}</h3>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className="text-2xl">{card.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contracts List Section */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Liste des contrats</h2>
        
        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, poste ou type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Contracts Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Début</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="flex items-center gap-2">
                  <EmployeeAvatar name={contract.employeeName} size="sm" />
                  <span>{contract.employeeName}</span>
                </TableCell>
                <TableCell>{contract.position}</TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "—"}</TableCell>
                <TableCell>
                  {contract.status === 'active' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Actif
                    </span>
                  )}
                  {contract.status === 'expired' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Expiré
                    </span>
                  )}
                  {contract.status === 'pending' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      À venir
                    </span>
                  )}
                  {contract.status === 'draft' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Brouillon
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Détails</Button>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredContracts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucun contrat trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentsRH;
