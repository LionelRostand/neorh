
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building, Save, X, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import useFirestore from "@/hooks/useFirestore";
import CompanyLogoUpload from "./CompanyLogoUpload";
import { useLogoUpload } from "@/hooks/useLogoUpload";

// Schéma de validation pour le formulaire
const companyFormSchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis"),
  industry: z.string().optional(),
  email: z.string().email("Format d'email invalide").optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  type: z.string(),
  status: z.string(),
  registrationDate: z.string()
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface EditCompanyDialogProps {
  companyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditCompanyDialog = ({ companyId, open, onOpenChange, onSuccess }: EditCompanyDialogProps) => {
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  
  const { getById, update, isLoading } = useFirestore<CompanyFormValues>("hr_companies");
  const { 
    logoFile, 
    logoPreview, 
    setLogoPreview,
    isUploading, 
    handleLogoChange, 
    uploadLogo,
    resetLogo
  } = useLogoUpload();
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      industry: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      description: "",
      logoUrl: "",
      type: "client",
      status: "active",
      registrationDate: new Date().toISOString().split('T')[0]
    }
  });

  // Charger les données de l'entreprise
  useEffect(() => {
    const fetchCompany = async () => {
      if (companyId && open) {
        setIsLoadingCompany(true);
        try {
          const company = await getById(companyId);
          if (company) {
            // Reset form with company data
            form.reset({
              name: company.name || "",
              industry: company.industry || "",
              email: company.email || "",
              phone: company.phone || "",
              website: company.website || "",
              address: company.address || "",
              city: company.city || "",
              postalCode: company.postalCode || "",
              country: company.country || "",
              description: company.description || "",
              logoUrl: company.logoUrl || "",
              type: company.type || "client",
              status: company.status || "active",
              registrationDate: company.registrationDate || new Date().toISOString().split('T')[0]
            });
            
            // Set logo preview if exists
            if (company.logoUrl) {
              setLogoPreview(company.logoUrl);
            }
          }
        } catch (error) {
          setLoadError(error instanceof Error ? error : new Error('Erreur lors du chargement des données'));
          toast({
            title: "Erreur",
            description: "Impossible de charger les données de l'entreprise",
            variant: "destructive"
          });
        } finally {
          setIsLoadingCompany(false);
        }
      }
    };

    fetchCompany();
  }, [companyId, open, getById, form, setLogoPreview]);

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      // Uploader le logo si présent
      if (logoFile) {
        const logoUrl = await uploadLogo();
        if (logoUrl) {
          data.logoUrl = logoUrl;
        }
      }

      await update(companyId, data);
      toast({
        title: "Succès",
        description: "L'entreprise a été mise à jour avec succès"
      });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'entreprise:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'entreprise",
        variant: "destructive"
      });
    }
  };

  if (isLoadingCompany) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-2 text-gray-600">Chargement des informations...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loadError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-red-500">Impossible de charger les informations de l'entreprise</p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-4">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-6">
          <Building className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-bold">Modifier l'entreprise</h2>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-2/3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full md:w-1/3">
                <FormLabel>Logo de l'entreprise</FormLabel>
                <CompanyLogoUpload 
                  logoPreview={logoPreview}
                  onLogoChange={handleLogoChange}
                  onReset={resetLogo}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur d'activité</FormLabel>
                  <FormControl>
                    <Input placeholder="Secteur d'activité" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Code postal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input placeholder="Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description de l'entreprise" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4 mr-2" /> Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || isUploading}
              >
                <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
