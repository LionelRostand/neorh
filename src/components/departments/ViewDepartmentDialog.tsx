
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Department } from '@/types/firebase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Eye, Users, Banknote } from 'lucide-react';

interface ViewDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

const ViewDepartmentDialog: React.FC<ViewDepartmentDialogProps> = ({
  open,
  onOpenChange,
  department
}) => {
  if (!department) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" /> Détails du département
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* En-tête avec le nom du département et sa couleur */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{department.name}</h2>
              {department.color && (
                <div 
                  className="w-8 h-8 rounded-full" 
                  style={{ backgroundColor: department.color }}
                  title={`Couleur: ${department.color}`}
                />
              )}
            </div>
            
            <Separator />
            
            {/* Description */}
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-600">
                {department.description || "Aucune description fournie"}
              </p>
            </div>
            
            <Separator />
            
            {/* Informations additionnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <h4 className="font-medium">Responsable</h4>
                  <p className="text-sm text-gray-600">{department.managerId || "Non assigné"}</p>
                </div>
              </div>
              
              {department.budget !== undefined && (
                <div className="flex items-start gap-2">
                  <Banknote className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <h4 className="font-medium">Budget</h4>
                    <p className="text-sm text-gray-600">
                      {typeof department.budget === 'number' 
                        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(department.budget)
                        : "Non défini"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {department.objectives && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium mb-2">Objectifs</h3>
                  <p className="text-gray-600">{department.objectives}</p>
                </div>
              </>
            )}
            
            {/* ID du département pour référence */}
            <Separator />
            <div className="pt-2">
              <p className="text-xs text-gray-400">ID: {department.id}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDepartmentDialog;
