
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LeaveAllocation } from '@/hooks/leaves'; // Updated import path
import { Check, X, Calendar, Plus, Minus } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';

interface LeaveAllocationManagerProps {
  allocation: LeaveAllocation | null;
  isLoading: boolean;
  onUpdate: (updates: Partial<LeaveAllocation>) => Promise<boolean>;
  employeeId: string;
}

const LeaveAllocationManager: React.FC<LeaveAllocationManagerProps> = ({
  allocation,
  isLoading,
  onUpdate,
  employeeId
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [paidLeavesTotal, setPaidLeavesTotal] = useState(allocation?.paidLeavesTotal || 25);
  const [rttTotal, setRttTotal] = useState(allocation?.rttTotal || 12);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Vérifier si l'utilisateur est un administrateur ou un manager
  const canEdit = Boolean((user && user.isAdmin) || (user && user.role === 'manager'));

  const handleSave = async () => {
    if (!allocation) return;
    
    setIsSaving(true);
    const success = await onUpdate({
      paidLeavesTotal,
      rttTotal,
      updatedBy: user?.uid
    });
    
    if (success) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const resetForm = () => {
    setPaidLeavesTotal(allocation?.paidLeavesTotal || 25);
    setRttTotal(allocation?.rttTotal || 12);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-2">
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Allocation de congés</CardTitle>
        <CardDescription>
          Gérer les jours de congés disponibles pour l'année {allocation?.year || new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paidLeaves">Congés payés disponibles</Label>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setPaidLeavesTotal(prev => Math.max(0, prev - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    id="paidLeaves" 
                    type="number" 
                    value={paidLeavesTotal} 
                    onChange={e => setPaidLeavesTotal(Math.max(0, parseInt(e.target.value) || 0))} 
                    className="max-w-20 text-center"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setPaidLeavesTotal(prev => prev + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">jours</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 text-blue-800 rounded-md px-3 py-1 text-lg font-medium">
                    {allocation?.paidLeavesTotal || 25}
                  </div>
                  <span className="text-sm text-gray-500">jours</span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Utilisés: {allocation?.paidLeavesUsed || 0} jours
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rtt">RTT disponibles</Label>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setRttTotal(prev => Math.max(0, prev - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    id="rtt" 
                    type="number" 
                    value={rttTotal} 
                    onChange={e => setRttTotal(Math.max(0, parseInt(e.target.value) || 0))} 
                    className="max-w-20 text-center"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setRttTotal(prev => prev + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">jours</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="bg-amber-100 text-amber-800 rounded-md px-3 py-1 text-lg font-medium">
                    {allocation?.rttTotal || 12}
                  </div>
                  <span className="text-sm text-gray-500">jours</span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Utilisés: {allocation?.rttUsed || 0} jours
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {canEdit && (
          <>
            {isEditing ? (
              <div className="flex w-full justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  disabled={isSaving}
                >
                  <X className="mr-1 h-4 w-4" />
                  Annuler
                </Button>
                
                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-emerald-500 hover:bg-emerald-600" disabled={isSaving}>
                      <Check className="mr-1 h-4 w-4" />
                      Enregistrer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer les modifications</AlertDialogTitle>
                      <AlertDialogDescription>
                        Vous allez modifier l'allocation de congés pour cet employé. Cette action mettra à jour le nombre de jours disponibles.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSave}>Confirmer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="ml-auto"
              >
                <Calendar className="mr-1 h-4 w-4" />
                Modifier l'allocation
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default LeaveAllocationManager;
