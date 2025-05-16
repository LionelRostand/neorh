
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, LogIn, LogOut } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { usePresenceData } from '@/hooks/usePresenceData';

export const PresenceKiosk = () => {
  const [badgeId, setBadgeId] = useState<string>("");
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yyyy");
  const formattedTime = format(currentDate, "HH:mm");
  
  const { addPresenceRecord } = usePresenceData();
  
  const handleEntry = async () => {
    if (!badgeId.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un identifiant employé ou un numéro de badge",
        variant: "destructive",
      });
      return;
    }
    
    // Extraction de l'ID employé à partir du badge (format: B-12345)
    const employeeId = badgeId.startsWith('B-') ? badgeId.substring(2) : badgeId;
    
    // Créer et enregistrer l'entrée
    const record = {
      employeeId,
      badgeId: badgeId.startsWith('B-') ? badgeId : `B-${badgeId}`,
      employeeName: `Employé ${employeeId}`, // Idéalement, récupérer le nom réel depuis la base de données
      timestamp: new Date().toISOString(), // Format ISO pour stockage
      eventType: 'entry' as const
    };
    
    const success = await addPresenceRecord(record);
    
    if (success) {
      toast({
        title: "Entrée enregistrée",
        description: `Entrée enregistrée pour le badge ${badgeId} à ${formattedTime}`,
      });
      setBadgeId("");
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'entrée. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };
  
  const handleExit = async () => {
    if (!badgeId.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un identifiant employé ou un numéro de badge",
        variant: "destructive",
      });
      return;
    }
    
    // Extraction de l'ID employé à partir du badge (format: B-12345)
    const employeeId = badgeId.startsWith('B-') ? badgeId.substring(2) : badgeId;
    
    // Créer et enregistrer la sortie
    const record = {
      employeeId,
      badgeId: badgeId.startsWith('B-') ? badgeId : `B-${badgeId}`,
      employeeName: `Employé ${employeeId}`, // Idéalement, récupérer le nom réel depuis la base de données
      timestamp: new Date().toISOString(), // Format ISO pour stockage
      eventType: 'exit' as const
    };
    
    const success = await addPresenceRecord(record);
    
    if (success) {
      toast({
        title: "Sortie enregistrée",
        description: `Sortie enregistrée pour le badge ${badgeId} à ${formattedTime}`,
      });
      setBadgeId("");
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la sortie. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="w-full max-w-md overflow-hidden rounded-lg shadow-lg">
        {/* En-tête bleu */}
        <div className="bg-blue-500 text-white p-4">
          <h3 className="text-xl font-bold">Borne de Présence</h3>
          <p className="text-sm text-blue-100">Validation des entrées et sorties</p>
          
          <div className="flex justify-end items-center mt-2 gap-3">
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        
        {/* Contenu */}
        <div className="bg-white p-4 space-y-4">
          <div>
            <label htmlFor="badge-id" className="block text-gray-700 mb-2">
              Identifiant employé ou badge
            </label>
            <Input 
              id="badge-id"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              placeholder="ID employé ou numéro de badge (ex: B-12345)"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleEntry}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Entrée
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleExit}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sortie
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
