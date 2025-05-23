
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartmentsData } from "@/hooks/useDepartmentsData";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentChartData {
  name: string;
  value: number;
  color?: string;
}

const DepartmentDistributionChart = () => {
  const [chartData, setChartData] = useState<DepartmentChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { departments } = useDepartmentsData();
  const { employees } = useEmployeeData();

  useEffect(() => {
    if (departments && employees) {
      // Process department data for chart
      const departmentCounts = departments.map(dept => {
        // Count employees in each department
        const employeeCount = employees.filter(emp => 
          emp.departmentId === dept.id || emp.department === dept.name
        ).length;
        
        return {
          name: dept.name,
          value: employeeCount,
          color: dept.color
        };
      });

      // Sort by count (highest first) and take top 6
      const sortedData = departmentCounts
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
      
      setChartData(sortedData);
      setIsLoading(false);
    }
  }, [departments, employees]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Répartition par département</CardTitle>
          <CardDescription>Distribution des employés par département</CardDescription>
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
        <CardTitle>Répartition par département</CardTitle>
        <CardDescription>Distribution des employés par département</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
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
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]} 
                  fill="#3b82f6"
                  // Use department color if available
                  stroke={(data) => data?.color || "#3b82f6"}
                  fillOpacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Aucun département avec des employés</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentDistributionChart;
