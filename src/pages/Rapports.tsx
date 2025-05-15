
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Rapports = () => {
  const [activeTab, setActiveTab] = useState("employee");

  // Sample data for charts
  const employeeData = [
    { name: 'Jan', actif: 45, inactif: 12 },
    { name: 'Fév', actif: 48, inactif: 10 },
    { name: 'Mar', actif: 52, inactif: 8 },
    { name: 'Avr', actif: 55, inactif: 7 },
    { name: 'Mai', actif: 58, inactif: 7 },
    { name: 'Jun', actif: 60, inactif: 8 },
  ];

  const departmentData = [
    { name: 'RH', value: 15 },
    { name: 'IT', value: 25 },
    { name: 'Marketing', value: 18 },
    { name: 'Finance', value: 22 },
    { name: 'R&D', value: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rapports</h1>
        <p className="text-gray-500">Analysez les données et générez des rapports RH personnalisés.</p>
      </div>

      <Tabs defaultValue="employee" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employeeData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actif" name="Employés actifs" fill="#4f46e5" />
                    <Bar dataKey="inactif" name="Employés inactifs" fill="#94a3b8" />
                  </BarChart>
                </ResponsiveContainer>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="absence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'absence</CardTitle>
              <CardDescription>Données à venir</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Les données pour ce rapport sont en cours de préparation.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recruitment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de recrutement</CardTitle>
              <CardDescription>Données à venir</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Les données pour ce rapport sont en cours de préparation.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rapports;
