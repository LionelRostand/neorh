
import React, { useState, useEffect } from "react";
import { useCollection } from "@/hooks/useCollection";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/lib/constants";
import DocumentFilter from "@/components/documents/DocumentFilter";
import DocumentList from "@/components/documents/DocumentList";
import ContractStatusCards from "@/components/contracts/ContractStatusCards";

const DocumentsRH = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // Use the collection hook to access the documents collection
  const documentsCollection = useCollection<'hr_documents'>();

  // Contract stats
  const [contractStats, setContractStats] = useState({
    total: 1,
    active: 0,
    pending: 0,
    expired: 0
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // In a real scenario, we would fetch from Firestore
        // For now, we'll use mock data
        setDocuments([
          {
            id: "1",
            title: "Bulletin de paie - mai 2025",
            category: "paystubs",
            fileUrl: "/documents/1",
            fileType: "application/pdf",
            uploadDate: "2025-05-15",
            status: "active",
            employeeId: "emp1",
            employeeName: "Lionel DJOSSA"
          },
          {
            id: "2",
            title: "Document sans titre",
            category: "other",
            fileUrl: "/documents/2",
            fileType: "unknown",
            uploadDate: "2025-05-14",
            status: "active"
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des documents</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Nouveau document
        </Button>
      </div>

      {/* Contract Status Cards */}
      <ContractStatusCards
        total={contractStats.total}
        active={contractStats.active}
        pending={contractStats.pending}
        expired={contractStats.expired}
      />

      <div className="bg-white border rounded-lg p-4">
        <DocumentFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <DocumentList documents={filteredDocuments} />
      </div>
    </div>
  );
};

export default DocumentsRH;
