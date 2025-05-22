
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Document } from "@/lib/constants";
import DocumentFilter from "@/components/documents/DocumentFilter";
import DocumentList from "@/components/documents/DocumentList";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";
import useFirestore from "@/hooks/useFirestore";

const DocumentsRH = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // Utiliser une référence pour éviter les appels multiples
  const fetchInProgress = useRef(false);
  const hasLoadedDocuments = useRef(false);
  
  // Use the collection hook to access the documents collection
  const documentsCollection = useFirestore<Document>("hr_documents");

  // Contract stats
  const [contractStats, setContractStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0
  });

  const fetchDocuments = useCallback(async () => {
    // Vérifier si une requête est déjà en cours
    if (fetchInProgress.current) {
      console.log("Requête de documents déjà en cours, annulation du doublon");
      return;
    }
    
    try {
      fetchInProgress.current = true;
      setLoading(true);
      
      console.log("Chargement des documents...");
      const result = await documentsCollection.getAll();
      
      if (result.docs) {
        const fetchedDocs = result.docs.map(doc => ({
          id: doc.id || '',
          title: doc.title || 'Document sans nom',
          category: doc.category || 'other',
          fileUrl: doc.fileUrl || '',
          fileType: doc.fileType || 'application/pdf',
          uploadDate: doc.uploadDate || new Date().toISOString(),
          status: doc.status || 'active',
          employeeId: doc.employeeId,
          employeeName: doc.employeeName,
          contractId: doc.contractId,
          description: doc.description,
          signedByEmployee: doc.signedByEmployee || false,
          signedByEmployer: doc.signedByEmployer || false
        }));
        
        console.log(`${fetchedDocs.length} documents chargés avec succès`);
        setDocuments(fetchedDocs);
        hasLoadedDocuments.current = true;
        
        // Calculer les statistiques des contrats
        const contracts = fetchedDocs.filter(doc => doc.category === 'contracts');
        setContractStats({
          total: contracts.length,
          active: contracts.filter(doc => doc.status === 'active').length,
          pending: contracts.filter(doc => doc.status === 'pending' || doc.status === 'pending_signature').length,
          expired: contracts.filter(doc => doc.status === 'expired').length
        });
      }
      
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [documentsCollection]);

  useEffect(() => {
    // Ne charger les documents qu'une seule fois au montage du composant
    if (!hasLoadedDocuments.current) {
      fetchDocuments();
    }
  }, [fetchDocuments]);

  // Fonction pour rafraîchir la liste des documents (utilisée après suppression)
  const handleRefresh = () => {
    hasLoadedDocuments.current = false;
    fetchDocuments();
  };

  // Filter documents based on search term and active tab
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "contracts") return doc.category === "contracts" && matchesSearch;
    if (activeTab === "paystubs") return doc.category === "paystubs" && matchesSearch;
    if (activeTab === "certificates") return doc.category === "certificates" && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="w-full h-full p-0 m-0">
      <div className="flex justify-between items-center p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des documents</h1>
          <p className="text-muted-foreground">Consultez et gérez tous les documents RH</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Nouveau document
        </Button>
      </div>

      {/* Contract Status Cards */}
      <div className="px-4 md:px-6">
        <ContractStatusCards
          total={contractStats.total}
          active={contractStats.active}
          pending={contractStats.pending}
          expired={contractStats.expired}
        />
      </div>

      <div className="bg-white border rounded-lg m-4 md:m-6 p-4 w-auto">
        <DocumentFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <DocumentList 
          documents={filteredDocuments} 
          loading={loading}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default DocumentsRH;
