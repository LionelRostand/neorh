
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Employee } from '@/types/employee';
import { Calendar, Building2, Mail, Phone, Edit, X, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const ViewEmployeeDialog: React.FC<ViewEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee
}) => {
  const [activeTab, setActiveTab] = useState("informations");
  
  if (!employee) return null;
  
  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'onLeave':
        return <Badge className="bg-amber-500 hover:bg-amber-600">En congé</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500 hover:bg-red-600">Inactif</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <div className="flex justify-between items-start p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.photoUrl} alt={employee.name} />
              <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              {getStatusBadge(employee.status)}
              <span className="text-lg font-medium mt-1">Employé</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Fermer
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Exporter PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="informations" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 bg-gray-50 border-b">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="competences">Compétences</TabsTrigger>
            <TabsTrigger value="horaires">Horaires</TabsTrigger>
            <TabsTrigger value="conges">Congés</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations" className="p-6 focus:outline-none">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-semibold">Informations de l'employé</h3>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium mb-4">Informations personnelles</h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="font-medium">{employee.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Email personnel</p>
                    <p className="font-medium">{employee.email || 'Non spécifié'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Email professionnel</p>
                    <p className="font-medium">Non spécifié</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{employee.phone || 'Non spécifié'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Date de naissance</p>
                    <p className="font-medium">Non spécifié</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Informations professionnelles</h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Poste</p>
                    <p className="font-medium">{employee.position || 'Non spécifié'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Département</p>
                    <p className="font-medium">{employee.department || 'Non spécifié'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Date d'embauche</p>
                    <p className="font-medium">{employee.startDate || '15 mai 2025'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-medium">{employee.status === 'active' ? 'Active' : 
                      employee.status === 'onLeave' ? 'En congé' : 
                      employee.status === 'inactive' ? 'Inactif' : 'Inconnu'}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="p-6">
            <h3 className="text-xl font-semibold mb-4">Documents</h3>
            <p className="text-gray-500">Aucun document disponible pour cet employé.</p>
          </TabsContent>
          
          <TabsContent value="competences" className="p-6">
            <h3 className="text-xl font-semibold mb-4">Compétences</h3>
            <p className="text-gray-500">Aucune compétence enregistrée pour cet employé.</p>
          </TabsContent>
          
          <TabsContent value="horaires" className="p-6">
            <h3 className="text-xl font-semibold mb-4">Horaires</h3>
            <p className="text-gray-500">Aucun horaire défini pour cet employé.</p>
          </TabsContent>
          
          <TabsContent value="conges" className="p-6">
            <h3 className="text-xl font-semibold mb-4">Congés</h3>
            <p className="text-gray-500">Aucun congé enregistré pour cet employé.</p>
          </TabsContent>
          
          <TabsContent value="evaluations" className="p-6">
            <h3 className="text-xl font-semibold mb-4">Évaluations</h3>
            <p className="text-gray-500">Aucune évaluation disponible pour cet employé.</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeDialog;
