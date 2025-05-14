
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DepartmentData {
  name: string;
  value: number;
}

const DepartmentDistributionChart = () => {
  // Données d'exemple pour la répartition par département
  const data: DepartmentData[] = [
    { name: "Informatique", value: 32 },
    { name: "Marketing", value: 18 },
    { name: "RH", value: 12 },
    { name: "Finance", value: 15 },
    { name: "Ventes", value: 22 },
    { name: "R&D", value: 16 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par département</CardTitle>
        <CardDescription>Distribution des employés par département</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} employés`, "Effectif"]} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentDistributionChart;
