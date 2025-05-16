
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Department } from '@/types/firebase';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from '@/components/ui/use-toast';

// Define the form schema with zod
const formSchema = z.object({
  name: z.string().min(1, { message: 'Le nom du département est requis' }),
  description: z.string().optional(),
  managerId: z.string().optional(),
  budget: z.number().optional(),
  objectives: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSuccess?: () => void;
}

const EditDepartmentDialog: React.FC<EditDepartmentDialogProps> = ({
  open,
  onOpenChange,
  department,
  onSuccess
}) => {
  const { update, isLoading } = useFirestore<Department>('hr_departments');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || '',
      description: department?.description || '',
      managerId: department?.managerId || '',
      budget: department?.budget || 0,
      objectives: department?.objectives || '',
    }
  });

  // Update form values when department changes
  React.useEffect(() => {
    if (department) {
      form.reset({
        name: department.name || '',
        description: department.description || '',
        managerId: department.managerId || '',
        budget: department.budget || 0,
        objectives: department.objectives || '',
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le département</DialogTitle>
          <DialogDescription>
            Modifiez les informations du département et cliquez sur Enregistrer pour confirmer les changements.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
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
                  <FormLabel>ID Manager</FormLabel>
                  <FormControl>
                    <Input placeholder="ID du manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Budget du département" 
                      {...field}
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectifs</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Objectifs du département" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
