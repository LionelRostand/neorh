
import React, { useState, useEffect } from "react";
import { useCollection } from "@/hooks/useCollection";
import { File, MoreHorizontal, Calendar, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "@/lib/constants";

const DocumentsRH = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // Use the collection hook to access the documents collection
  const documentsCollection = useCollection<'hr_documents'>();

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

      {/* Document Filter Tabs */}
      <div className="bg-white border rounded-lg p-4">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
            <TabsTrigger value="all" className="text-sm">Tous les documents</TabsTrigger>
            <TabsTrigger value="contracts" className="text-sm">Contrats</TabsTrigger>
            <TabsTrigger value="paystubs" className="text-sm">Fiches de paie</TabsTrigger>
            <TabsTrigger value="certificates" className="text-sm">Certifications</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
          {filteredDocuments.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              Aucun document trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  return (
    <Card className="overflow-hidden border">
      <div className="p-4 flex flex-col">
        <div className="flex justify-center items-center mb-4">
          <File size={40} className="text-gray-400" />
        </div>
        <h3 className="font-medium text-center mb-1">{document.title}</h3>
        <div className="text-center text-gray-500 text-sm">
          {document.fileType === "application/pdf" ? (
            <span className="inline-block bg-gray-100 px-2 py-1 rounded">APPLICATION/PDF</span>
          ) : (
            <span className="inline-block bg-gray-100 px-2 py-1 rounded">UNKNOWN</span>
          )}
        </div>
      </div>
      <div className="border-t flex justify-between items-center py-2 px-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Calendar size={18} />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </Card>
  );
};

export default DocumentsRH;
