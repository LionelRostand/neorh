
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Document } from "@/lib/constants";
import { handleDocumentDownload } from "@/utils/documents/documentDownload";

interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  companyId: string;
  companyName: string;
  period: string;
  createdAt: Date;
  fileUrl: string;
  status: string;
}

// Convert Payslip to Document format for consistent handling
const payslipToDocument = (payslip: Payslip): Document => {
  return {
    id: payslip.id,
    title: `Fiche de paie - ${payslip.period}`,
    category: 'paystubs',
    fileUrl: payslip.fileUrl || '',
    fileType: 'application/pdf',
    uploadDate: payslip.createdAt ? payslip.createdAt.toISOString() : new Date().toISOString(),
    status: 'active',
    employeeId: payslip.employeeId,
    employeeName: payslip.employeeName,
    description: `Fiche de paie pour la période ${payslip.period}`
  };
};

const PayrollHistory: React.FC = () => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        setIsLoading(true);
        const payslipsQuery = query(
          collection(db, HR.PAYSLIPS),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(payslipsQuery);
        const payslipsData: Payslip[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          payslipsData.push({
            id: doc.id,
            employeeId: data.employeeId || "",
            employeeName: data.employeeName || "Employé inconnu",
            companyId: data.companyId || "",
            companyName: data.companyName || "Entreprise inconnue",
            period: data.period || "",
            createdAt: data.createdAt?.toDate() || new Date(),
            fileUrl: data.fileUrl || "",
            status: data.status || "completed"
          });
        });
        
        setPayslips(payslipsData);
      } catch (error) {
        console.error("Erreur lors du chargement des fiches de paie:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des fiches de paie",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayslips();
  }, []);
  
  const filteredPayslips = payslips.filter(
    (payslip) =>
      payslip.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payslip.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Historique des fiches de paie</h2>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par employé, période ou entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredPayslips.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {searchTerm ? "Aucun résultat trouvé" : "Aucune fiche de paie générée"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Essayez avec un autre terme de recherche"
                : "Les fiches de paie générées apparaîtront ici."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayslips.map((payslip) => (
              <div
                key={payslip.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-medium">{payslip.employeeName}</h3>
                    <Badge variant="outline" className="ml-2">
                      {payslip.period}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span>{payslip.companyName}</span>
                    <span className="mx-2">•</span>
                    <span>Généré le {formatDate(payslip.createdAt)}</span>
                  </div>
                </div>
                <button
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                  title="Télécharger"
                  onClick={() => handleDocumentDownload(payslipToDocument(payslip))}
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PayrollHistory;
