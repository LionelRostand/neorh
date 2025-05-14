
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  date: string;
  type: 'work' | 'birthday';
  image?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const EmployeeAnniversaries = () => {
  // Données d'exemple pour les anniversaires
  const anniversaries: Employee[] = [
    {
      id: 1,
      name: "Jean Dupont",
      position: "Développeur",
      department: "Informatique",
      date: "15 Mai",
      type: "birthday"
    },
    {
      id: 2,
      name: "Marie Martin",
      position: "Responsable RH",
      department: "Ressources Humaines",
      date: "18 Mai",
      type: "work"
    },
    {
      id: 3,
      name: "Thomas Bernard",
      position: "Designer",
      department: "Marketing",
      date: "22 Mai",
      type: "birthday"
    },
    {
      id: 4,
      name: "Sophie Petit",
      position: "Comptable",
      department: "Finance",
      date: "25 Mai",
      type: "work"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anniversaires à venir</CardTitle>
        <CardDescription>Anniversaires professionnels et personnels</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {anniversaries.map(employee => (
            <li key={employee.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={employee.image} alt={employee.name} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{employee.name}</h4>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-medium">{employee.date}</span>
                <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {employee.type === 'birthday' ? 'Anniversaire' : 'Ancienneté'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EmployeeAnniversaries;
