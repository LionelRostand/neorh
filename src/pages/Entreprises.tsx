
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
import NewCompanyDialog from "@/components/companies/NewCompanyDialog";
import { db } from "@/lib/firebase";
import { collection, getDocs, DocumentData } from "firebase/firestore";

interface Company {
  id?: string;
  name: string;
  industry: string;
  type: string;
  registrationDate: string;
  status: string;
  logo?: {
    binary: Uint8Array;
    type: string;
    name: string;
  };
  logoUrl?: string;
}

const Entreprises = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      
      const companiesCollection = collection(db, "hr_companies");
      const snapshot = await getDocs(companiesCollection);
      
      const companiesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        
        // Traiter le logo binaire s'il existe
        let logoUrl = data.logoUrl;
        if (data.logo && data.logo.binary) {
          // Convertir le binaire en base64 pour l'affichage
          const binary = data.logo.binary;
          const bytes = new Uint8Array(binary);
          let binaryString = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binaryString += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binaryString);
          logoUrl = `data:${data.logo.type};base64,${base64}`;
        }
        
        return {
          id: doc.id,
          ...data,
          logoUrl: logoUrl
        } as Company;
      });
      
      setCompanies(companiesData);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des entreprises",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleNewCompany = () => {
    setIsNewCompanyDialogOpen(true);
  };

  const handleDetails = (id: string) => {
    // This is now handled by CompanyActions component
    console.log(`Viewing details for company ${id}`);
  };

  const handleEdit = (id: string) => {
    // This is now handled by CompanyActions component
    console.log(`Editing company ${id}`);
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
              loading={loading}
              onDetails={handleDetails}
              onEdit={handleEdit}
              onSuccess={fetchCompanies}
            />
          </div>
        </CardContent>
      </Card>
      
      <NewCompanyDialog 
        open={isNewCompanyDialogOpen}
        onOpenChange={setIsNewCompanyDialogOpen}
        onSuccess={fetchCompanies}
      />
    </div>
  );
};

export default Entreprises;
