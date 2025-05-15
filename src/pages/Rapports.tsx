
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useEmployeeStats } from "@/hooks/useEmployeeStats";
import { useDepartmentStats } from "@/hooks/useDepartmentStats";
import { useAbsenceStats } from "@/hooks/useAbsenceStats";
import { useRecruitmentStats } from "@/hooks/useRecruitmentStats";
import { Loader2 } from "lucide-react";

const Rapports = () => {
  const [activeTab, setActiveTab] = useState("employee");
  
  // Use our custom hooks to fetch data
  const { employeeData, isLoading: isLoadingEmployees } = useEmployeeStats();
  const { departmentData, isLoading: isLoadingDepartments } = useDepartmentStats();
  const { absenceData, isLoading: isLoadingAbsences } = useAbsenceStats();
  const { recruitmentData, isLoading: isLoadingRecruitment } = useRecruitmentStats();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rapports</h1>
        <p className="text-gray-500">Analysez les données et générez des rapports RH personnalisés.</p>
      </div>

      <Tabs defaultValue="employee" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="employee">Employés</TabsTrigger>
          <TabsTrigger value="department">Départements</TabsTrigger>
          <TabsTrigger value="absence">Absences</TabsTrigger>
          <TabsTrigger value="recruitment">Recrutement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des effectifs</CardTitle>
              <CardDescription>Nombre d'employés actifs et inactifs par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoadingEmployees ? (
                  <LoadingIndicator />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={employeeData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip />
                      <Legend />
                      <Bar dataKey="actif" name="Employés actifs" fill="#4f46e5" />
                      <Bar dataKey="inactif" name="Employés inactifs" fill="#94a3b8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par département</CardTitle>
              <CardDescription>Distribution des employés par département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoadingDepartments ? (
                  <LoadingIndicator />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="absence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des absences</CardTitle>
              <CardDescription>Types d'absences par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoadingAbsences ? (
                  <LoadingIndicator />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={absenceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {absenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recruitment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de recrutement</CardTitle>
              <CardDescription>Candidats et embauches par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoadingRecruitment ? (
                  <LoadingIndicator />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={recruitmentData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="candidats" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="embauches" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rapports;
