import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useCompaniesData } from "@/hooks/useCompaniesData";
import useContractsList from "@/hooks/contracts/useContractsList";

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

const PayslipForm: React.FC = () => {
  // Récupération des données des employés
  const { employees, isLoading: employeesLoading } = useEmployeeData();
  
  // Récupération des données des entreprises
  const { companies, isLoading: companiesLoading } = useCompaniesData();
  
  // Récupération des contrats pour le salaire
  const { contracts, loading: contractsLoading } = useContractsList();
  
  // État pour le salaire annuel
  const [salaryValue, setSalaryValue] = useState<string>("");

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

  // Récupération du salaire à partir du contrat de l'employé sélectionné
  useEffect(() => {
    const employeeId = form.getValues("employee");
    if (employeeId && contracts && contracts.length > 0) {
      // Rechercher le contrat actif pour l'employé sélectionné
      const employeeContract = contracts.find(
        (contract) => contract.employeeId === employeeId && contract.status === "active"
      );
      
      if (employeeContract && employeeContract.salary) {
        const formattedSalary = typeof employeeContract.salary === 'number' 
          ? `${employeeContract.salary} €` 
          : `${employeeContract.salary}`;
        setSalaryValue(formattedSalary);
        form.setValue("annualSalary", formattedSalary);
      } else {
        setSalaryValue("Aucun contrat actif trouvé");
        form.setValue("annualSalary", "");
      }
    } else {
      setSalaryValue("");
      form.setValue("annualSalary", "");
    }
  }, [form.watch("employee"), contracts, form]);

  // Générer les périodes mensuelles pour l'année en cours et la suivante
  const generateMonthlyPeriods = () => {
    const periods = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Générer les périodes pour l'année en cours et la suivante
    for (let year = currentYear; year <= currentYear + 1; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1);
        const monthName = date.toLocaleDateString('fr-FR', { month: 'long' });
        const periodId = `${year}-${month + 1}`;
        const periodLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
        periods.push({ id: periodId, label: periodLabel });
      }
    }
    return periods;
  };

  const periods = generateMonthlyPeriods();

  function onSubmit(data: PayslipFormValues) {
    // Récupérer les noms complets pour l'affichage du toast
    const employeeName = employees.find(e => e.id === data.employee)?.name || data.employee;
    const periodLabel = periods.find(p => p.id === data.period)?.label || data.period;
    
    toast({
      title: "Fiche de paie générée",
      description: `Fiche de paie pour ${employeeName} - Période: ${periodLabel}`,
    });
  }

  return (
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
                  value={field.value}
                  disabled={employeesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
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
                  value={field.value}
                  disabled={companiesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une entreprise" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id || ""}>
                        {company.name}
                      </SelectItem>
                    ))}
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
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la période" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.label}
                      </SelectItem>
                    ))}
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
                    placeholder={contractsLoading ? "Chargement..." : "Salaire brut annuel récupéré depuis le contrat"} 
                    {...field}
                    value={salaryValue}
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
  );
};

export default PayslipForm;
