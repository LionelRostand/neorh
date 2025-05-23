
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusData {
  name: string;
  value: number;
  color: string;
}

const EmployeeStatusChart = () => {
  const [chartData, setChartData] = useState<StatusData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  
  // Define status colors
  const statusColors = {
    active: "#3b82f6",
    onLeave: "#f59e0b",
    inactive: "#ef4444"
  };

  // Map status values to display names
  const statusNames = {
    active: "CDI",
    onLeave: "En congé",
    inactive: "CDD/Autre"
  };

  useEffect(() => {
    if (employees) {
      // Process employee statuses for chart
      const statusCounts: Record<string, number> = {};
      
      // Count employees by status
      employees.forEach(emp => {
        const status = emp.status || 'inactive';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      // Transform to chart data format
      const data: StatusData[] = Object.entries(statusCounts).map(([status, count]) => ({
        name: statusNames[status as keyof typeof statusNames] || status,
        value: count,
        color: statusColors[status as keyof typeof statusColors] || "#bfdbfe"
      }));
      
      setChartData(data);
      setIsLoading(false);
    }
  }, [employees]);

  if (isLoading || isLoadingEmployees) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Répartition par statut</CardTitle>
          <CardDescription>Distribution des employés selon leur type de contrat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] mt-4 flex items-center justify-center">
            <Skeleton className="h-[200px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par statut</CardTitle>
        <CardDescription>Distribution des employés selon leur type de contrat</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} employés`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeStatusChart;
