
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusData {
  name: string;
  value: number;
  color: string;
}

const EmployeeStatusChart = () => {
  // Données d'exemple pour le statut des employés
  const data: StatusData[] = [
    { name: "CDI", value: 65, color: "#3b82f6" },
    { name: "CDD", value: 15, color: "#60a5fa" }, 
    { name: "Stage", value: 10, color: "#93c5fd" },
    { name: "Intérim", value: 7, color: "#bfdbfe" },
    { name: "Freelance", value: 3, color: "#dbeafe" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par statut</CardTitle>
        <CardDescription>Distribution des employés selon leur type de contrat</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} employés`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeStatusChart;
