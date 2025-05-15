
import React, { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import * as z from "zod";

// Schema for the payslip form
const payslipFormSchema = z.object({
  employee: z.string().min(1, { message: "Veuillez sélectionner un employé" }),
  company: z.string().min(1, { message: "Veuillez sélectionner une entreprise" }),
  period: z.string().min(1, { message: "Veuillez sélectionner une période" }),
  annualSalary: z.string().optional(),
  overtimeHours: z.string().optional(),
  overtimeRate: z.string().default("25"),
});

type PayslipFormValues = z.infer<typeof payslipFormSchema>;

const Salaires = () => {
  const [activeTab, setActiveTab] = useState<string>("nouvelle");

  const form = useForm<PayslipFormValues>({
    resolver: zodResolver(payslipFormSchema),
    defaultValues: {
      employee: "",
      company: "",
      period: "",
      annualSalary: "",
      overtimeHours: "",
      overtimeRate: "25",
    },
  });

  function onSubmit(data: PayslipFormValues) {
    toast({
      title: "Fiche de paie générée",
      description: `Fiche de paie pour ${data.employee} - Période: ${data.period}`,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Fiches de Paie</h1>
        <p className="text-muted-foreground mt-2">
          Création et gestion des fiches de paie conformes au Code du travail français
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="nouvelle">Nouvelle fiche de paie</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nouvelle" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">Créer une nouvelle fiche de paie</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="employee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employé</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un employé" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="emp1">Jean Dupont</SelectItem>
                              <SelectItem value="emp2">Marie Martin</SelectItem>
                              <SelectItem value="emp3">Pierre Durand</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entreprise</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une entreprise" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="comp1">Tech Solutions SAS</SelectItem>
                              <SelectItem value="comp2">Marketing Pro SARL</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Période</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner la période" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mai2025">Mai 2025</SelectItem>
                              <SelectItem value="juin2025">Juin 2025</SelectItem>
                              <SelectItem value="juil2025">Juillet 2025</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="annualSalary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salaire brut annuel</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Salaire brut annuel récupéré depuis le contrat" 
                              {...field}
                              disabled 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="overtimeHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heures supplémentaires</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Nombre d'heures supplémentaires"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="overtimeRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Majoration (%)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Selon le Code du travail français : 25% pour les 8 premières heures, 50% au-delà
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Générer la fiche de paie
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historique" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Historique des fiches de paie</h2>
              <p className="text-muted-foreground">
                Aucune fiche de paie générée pour le moment.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Salaires;
