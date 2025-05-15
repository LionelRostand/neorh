
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import CompanyStatusCards from "@/components/companies/CompanyStatusCards";
import CompanySearch from "@/components/companies/CompanySearch";
import CompanyTable from "@/components/companies/CompanyTable";
import useFirestore from "@/hooks/useFirestore";

interface Company {
  id?: string;
  name: string;
  industry: string;
  type: string;
  registrationDate: string;
  status: string;
}

const Entreprises = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use the Firestore hook to fetch company data from hr_companies collection
  const { getAll, isLoading, error } = useFirestore<Company>("hr_companies");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const result = await getAll();
        // Check if result exists and has docs property before setting state
        if (result && result.docs) {
          setCompanies(result.docs);
        } else {
          setCompanies([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données des entreprises",
          variant: "destructive"
        });
        setCompanies([]);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des entreprises: " + error.message,
        variant: "destructive"
      });
    }
  }, [error]);

  const handleNewCompany = () => {
    toast({
      title: "Information",
      description: "Cette fonctionnalité sera bientôt disponible"
    });
  };

  const handleDetails = (id: string) => {
    toast({
      title: "Détails",
      description: `Affichage des détails pour l'entreprise ${id}`
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Modifier",
      description: `Modification de l'entreprise ${id}`
    });
  };

  // Count companies by status
  const countByStatus = {
    active: companies.filter(c => c.status === 'active').length,
    pending: companies.filter(c => c.status === 'pending').length,
    inactive: companies.filter(c => c.status === 'inactive').length,
    total: companies.length
  };

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des entreprises</h1>
          <p className="text-muted-foreground">Gérez vos entreprises et leurs informations</p>
        </div>
        <Button 
          onClick={handleNewCompany} 
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Nouvelle entreprise
        </Button>
      </div>

      <CompanyStatusCards
        total={countByStatus.total}
        active={countByStatus.active}
        pending={countByStatus.pending}
        inactive={countByStatus.inactive}
      />

      <Card>
        <CardContent className="p-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Liste des entreprises</h2>
            
            <CompanySearch 
              value={searchTerm}
              onChange={setSearchTerm}
            />

            <CompanyTable 
              companies={filteredCompanies}
              loading={isLoading || loading}
              onDetails={handleDetails}
              onEdit={handleEdit}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Entreprises;
