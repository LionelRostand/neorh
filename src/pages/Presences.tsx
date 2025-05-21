
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PresenceKiosk } from "@/components/presence/PresenceKiosk";
import { PresenceRegistry } from "@/components/presence/PresenceRegistry";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { usePresenceData } from '@/hooks/presence';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Presences = () => {
  const { presenceRecords } = usePresenceData();
  
  const handleExport = () => {
    // Création du document PDF
    const doc = new jsPDF();
    const currentDate = format(new Date(), "dd MMMM yyyy", { locale: fr });
    
    // Titre et en-tête
    doc.setFontSize(18);
    doc.text("Registre des présences", 14, 22);
    doc.setFontSize(11);
    doc.text(`Exporté le ${currentDate}`, 14, 30);
    
    // Conversion des données pour le tableau
    const tableData = presenceRecords.map(record => [
      record.employeeName,
      record.employeeId,
      record.badgeId || '-',
      record.date,
      record.timeIn || '-',
      record.timeOut || '-',
      record.duration || '-',
      record.status === 'present' ? 'Présent' : 
      record.status === 'absent' ? 'Absent' :
      record.status === 'late' ? 'Retard' : 'Départ anticipé'
    ]);
    
    // Création du tableau
    autoTable(doc, {
      head: [['Employé', 'ID', 'Badge', 'Date', 'Entrée', 'Sortie', 'Durée', 'Statut']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 245, 255] }
    });
    
    // Téléchargement du PDF
    doc.save(`registre-presences-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Présences</h1>
          <p className="text-muted-foreground">Suivi des entrées et sorties des employés</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>
      
      <Tabs defaultValue="kiosk" className="w-full">
        <TabsList className="w-full max-w-[600px] bg-white dark:bg-gray-800">
          <TabsTrigger value="kiosk" className="flex-1">Borne de présence</TabsTrigger>
          <TabsTrigger value="registry" className="flex-1">Registre des présences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kiosk" className="pt-4">
          <PresenceKiosk />
        </TabsContent>
        
        <TabsContent value="registry" className="pt-4">
          <PresenceRegistry />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Presences;
