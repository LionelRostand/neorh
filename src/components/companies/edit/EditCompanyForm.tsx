
import React from "react";
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
import { Save, X } from "lucide-react";
import CompanyLogoUpload from "../CompanyLogoUpload";
import { useLogoUpload } from "@/hooks/useLogoUpload";

// Schema for company form validation
export const companyFormSchema = z.object({
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

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface EditCompanyFormProps {
  companyId: string;
  initialData: CompanyFormValues;
  isUpdating: boolean;
  onSubmit: (data: CompanyFormValues, logoData: { binary: ArrayBuffer | null, type: string | null, name: string | null } | null) => Promise<void>;
  onCancel: () => void;
}

const EditCompanyForm = ({ 
  companyId, 
  initialData, 
  isUpdating, 
  onSubmit, 
  onCancel 
}: EditCompanyFormProps) => {
  const { 
    logoFile, 
    logoPreview, 
    setLogoPreview,
    isUploading, 
    handleLogoChange, 
    uploadLogo,
    resetLogo
  } = useLogoUpload();
  
  // Set initial logo if exists
  React.useEffect(() => {
    if (initialData.logoUrl) {
      setLogoPreview(initialData.logoUrl);
    }
  }, [initialData.logoUrl, setLogoPreview]);
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: initialData
  });

  const handleSubmit = async (data: CompanyFormValues) => {
    const logoData = await uploadLogo();
    await onSubmit(data, logoData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" /> Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isUpdating || isUploading}
          >
            <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCompanyForm;
