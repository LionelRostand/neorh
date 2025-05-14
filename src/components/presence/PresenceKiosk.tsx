
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, LogIn, LogOut } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

export const PresenceKiosk = () => {
  const [badgeId, setBadgeId] = useState<string>("");
  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yyyy");
  const formattedTime = format(currentDate, "HH:mm");
  
  const handleEntry = () => {
    if (!badgeId.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un identifiant employé ou un numéro de badge",
        variant: "destructive",
      });
      return;
    }
    
    // Logique pour enregistrer l'entrée
    toast({
      title: "Entrée enregistrée",
      description: `Entrée enregistrée pour le badge ${badgeId} à ${formattedTime}`,
    });
    setBadgeId("");
  };
  
  const handleExit = () => {
    if (!badgeId.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un identifiant employé ou un numéro de badge",
        variant: "destructive",
      });
      return;
    }
    
    // Logique pour enregistrer la sortie
    toast({
      title: "Sortie enregistrée",
      description: `Sortie enregistrée pour le badge ${badgeId} à ${formattedTime}`,
    });
    setBadgeId("");
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-blue-500 text-white p-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight">Borne de Présence</h3>
            <p className="text-blue-100">Validation des entrées et sorties</p>
          </div>
          <div className="flex justify-end items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-lg">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="badge-id" className="text-base">
              Identifiant employé ou badge
            </label>
            <Input 
              id="badge-id"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              placeholder="ID employé ou numéro de badge (ex: B-12345)"
              className="text-base"
            />
          </div>
          
          <div className="flex gap-4">
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
        </CardContent>
      </Card>
    </div>
  );
};
