
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  FileText, 
  Clock, 
  Calendar, 
  Award, 
  BookOpen, 
  Star,
  Shield
} from 'lucide-react';
import { Employee } from '@/types/employee';
import EmployeeTabContent from './EmployeeTabContent';

interface EmployeeTabsProps {
  employee: Employee;
  activeTab: string;
  onTabChange: (value: string) => void;
  onRefresh?: () => void;
}

const EmployeeTabs: React.FC<EmployeeTabsProps> = ({ 
  employee, 
  activeTab, 
  onTabChange, 
  onRefresh 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-8">
        <TabsTrigger value="informations" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Infos
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Documents
        </TabsTrigger>
        <TabsTrigger value="timesheets" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Temps
        </TabsTrigger>
        <TabsTrigger value="leaves" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Congés
        </TabsTrigger>
        <TabsTrigger value="evaluations" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Évaluations
        </TabsTrigger>
        <TabsTrigger value="trainings" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Formations
        </TabsTrigger>
        <TabsTrigger value="skills" className="flex items-center gap-2">
          <Award className="h-4 w-4" />
          Compétences
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Rôles
        </TabsTrigger>
      </TabsList>
      
      <EmployeeTabContent employee={employee} onRefresh={onRefresh} />
    </Tabs>
  );
};

export default EmployeeTabs;
