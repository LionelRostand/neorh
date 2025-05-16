
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Department } from '@/types/firebase';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { useManagersData } from '@/hooks/useManagersData';

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, { message: 'Le nom du département est requis' }),
  description: z.string().optional(),
  managerId: z.string().optional(),
  companyId: z.string().optional(),
  color: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSuccess?: () => void;
}

const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#EF4444', // red
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#6B7280', // gray
  '#111827', // dark
];

const EditDepartmentDialog: React.FC<EditDepartmentDialogProps> = ({
  open,
  onOpenChange,
  department,
  onSuccess
}) => {
  const { update, isLoading } = useFirestore<Department>('hr_departments');
  const [activeTab, setActiveTab] = useState("informations");
  const { companies } = useCompaniesData();
  const { managers } = useManagersData?.() || { managers: [] };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || '',
      description: department?.description || '',
      managerId: department?.managerId || '',
      companyId: '',
      color: department?.color || COLORS[0],
    }
  });

  // Update form values when department changes
  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name || '',
        description: department.description || '',
        managerId: department.managerId || '',
        companyId: '',
        color: department.color || COLORS[0],
      });
    }
  }, [department, form]);

  const onSubmit = async (values: FormValues) => {
    if (!department?.id) return;
    
    try {
      const success = await update(department.id, values);
      
      if (success) {
        toast({
          title: "Département modifié",
          description: "Le département a été mis à jour avec succès"
        });
        
        if (onSuccess) onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du département:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du département"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le département</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="employes">Employés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du département</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du département" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Description du département" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="managerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsable</FormLabel>
                      <FormControl>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...field}
                        >
                          <option value="">Aucun responsable</option>
                          {managers && managers.map(manager => (
                            <option key={manager.id} value={manager.id}>
                              {manager.firstName} {manager.lastName}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise</FormLabel>
                      <FormControl>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...field}
                        >
                          <option value="">Sélectionner une entreprise</option>
                          {companies.map(company => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          className="flex space-x-2" 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          {COLORS.map((color) => (
                            <FormItem key={color} className="space-y-0">
                              <FormControl>
                                <RadioGroupItem 
                                  value={color} 
                                  id={color}
                                  className="sr-only"
                                />
                              </FormControl>
                              <label
                                htmlFor={color}
                                className={`block h-8 w-8 rounded-full cursor-pointer border-2 ${
                                  field.value === color ? 'border-black' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4 mr-2" /> Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check className="h-4 w-4 mr-2" /> Enregistrer
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="employes">
            <div className="py-4">
              <p className="text-muted-foreground text-center py-6">
                La gestion des employés sera implémentée dans une prochaine version.
              </p>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4 mr-2" /> Annuler
                </Button>
                <Button 
                  onClick={() => setActiveTab("informations")} 
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Retour aux informations
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
