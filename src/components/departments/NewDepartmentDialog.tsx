import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFirestore } from "@/hooks/useFirestore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Department } from "@/types/firebase";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useManagersData } from "@/hooks/useManagersData";
import { useCompaniesData } from "@/hooks/useCompaniesData";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import { HR } from "@/lib/constants/collections";

// Schema for the department form
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  description: z.string().optional(),
  managerId: z.string().optional(),
  companyId: z.string().optional(),
  color: z.string().default("Bleu"),
  parentDepartmentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface NewDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const COLORS = [
  { label: "Bleu", value: "#1EAEDB" },
  { label: "Rouge", value: "#ea384c" },
  { label: "Vert", value: "#2ecc71" },
  { label: "Violet", value: "#9b87f5" },
  { label: "Orange", value: "#f39c12" },
];

const NewDepartmentDialog = ({ open, onOpenChange, onSuccess }: NewDepartmentDialogProps) => {
  const { toast } = useToast();
  const { add } = useFirestore<Department>(HR.DEPARTMENTS);
  const { managers, isLoading: isLoadingManagers } = useManagersData();
  const { companies, isLoading: isLoadingCompanies } = useCompaniesData();
  const { departments, isLoading: isLoadingDepartments } = useDepartmentsData();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      managerId: "",
      companyId: "",
      color: "#1EAEDB",
      parentDepartmentId: "none",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const departmentData: Partial<Department> = {
        name: values.name,
        description: values.description || "",
        managerId: values.managerId || "",
        companyId: values.companyId || "",
        color: values.color,
        parentDepartmentId: values.parentDepartmentId === "none" ? "" : values.parentDepartmentId,
      };

      await add(departmentData as Department);
      toast({
        title: "Succès",
        description: "Le département a été créé avec succès",
      });
      form.reset();
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
      toast({
        title: "Erreur",
        description: `Impossible de créer le département: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <h2 className="text-lg font-bold mb-2">Nouveau département</h2>
        
        <Tabs defaultValue="informations">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="employes">Employés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FormLabel>ID</FormLabel>
                    <Input value="Généré automatiquement" disabled />
                  </div>
                
                  <div className="col-span-2">
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
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Description du département" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="managerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsable</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingManagers}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Aucun responsable" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {managers.map((manager) => (
                                <SelectItem key={manager.id} value={manager.id || "no-manager"}>
                                  {manager.name || "Manager sans nom"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entreprise</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingCompanies}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Aucune entreprise" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companies.map((company) => (
                                <SelectItem key={company.id} value={company.id || "no-company"}>
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="parentDepartmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Département parent</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingDepartments}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Aucun département parent" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Aucun (département racine)</SelectItem>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id || "dept-unknown"}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Couleur</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisir une couleur" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COLORS.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  <div className="flex items-center">
                                    <div 
                                      className="w-4 h-4 rounded-full mr-2" 
                                      style={{ backgroundColor: color.value }}
                                    ></div>
                                    {color.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => onOpenChange(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit"
                    style={{ backgroundColor: "#00a67a" }}
                  >
                    Créer
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="employes">
            <div className="text-center py-8">
              <p className="text-gray-500">
                Vous pourrez ajouter des employés au département après sa création.
              </p>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                style={{ backgroundColor: "#00a67a" }}
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                Créer
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewDepartmentDialog;
