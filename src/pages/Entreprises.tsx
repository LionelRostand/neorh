
import { useState, useMemo } from "react";
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
import NewCompanyDialog from "@/components/companies/NewCompanyDialog";
import { useCompaniesData } from "@/hooks/useCompaniesData";

const Entreprises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  
  const { companies, isLoading, error, refetch } = useCompaniesData();
  
  const handleNewCompany = () => {
    setIsNewCompanyDialogOpen(true);
  };

  // Count companies by status
  const countByStatus = useMemo(() => ({
    active: companies.filter(c => c.status === 'active').length,
    pending: companies.filter(c => c.status === 'pending').length,
    inactive: companies.filter(c => c.status === 'inactive').length,
    total: companies.length
  }), [companies]);

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => 
    companies.filter(company => {
      const searchLower = searchTerm.toLowerCase();
      return (
        company.name?.toLowerCase().includes(searchLower) || 
        company.industry?.toLowerCase().includes(searchLower) ||
        company.type?.toLowerCase().includes(searchLower)
      );
    }), [companies, searchTerm]);

  console.log("Entreprises rendues:", filteredCompanies.length);

  // Si une erreur se produit, afficher un message
  if (error) {
    console.error("Erreur lors du chargement des entreprises:", error);
    toast({
      title: "Erreur de chargement",
      description: "Impossible de charger les données des entreprises",
      variant: "destructive"
    });
  }

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
              loading={isLoading}
              onSuccess={refetch}
            />
          </div>
        </CardContent>
      </Card>
      
      <NewCompanyDialog 
        open={isNewCompanyDialogOpen}
        onOpenChange={setIsNewCompanyDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Entreprises;
