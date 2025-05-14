
// Mock data structure for demonstration
export interface MockEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'onLeave' | 'terminated';
  hireDate: string;
  avatarUrl?: string;
}

// Mock data for demonstration
export const MOCK_EMPLOYEES: MockEmployee[] = [
  {
    id: "1",
    firstName: "Thomas",
    lastName: "Dubois",
    email: "thomas.dubois@example.com",
    phone: "06 12 34 56 78",
    department: "Développement",
    position: "Développeur Frontend",
    status: "active",
    hireDate: "15/03/2021",
    avatarUrl: ""
  },
  {
    id: "2",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@example.com",
    phone: "06 23 45 67 89",
    department: "Design",
    position: "UX Designer",
    status: "active",
    hireDate: "02/05/2022",
  },
  {
    id: "3",
    firstName: "Jean",
    lastName: "Bernard",
    email: "jean.bernard@example.com",
    phone: "06 34 56 78 90",
    department: "Marketing",
    position: "Responsable Contenu",
    status: "onLeave",
    hireDate: "10/11/2019",
  },
  {
    id: "4",
    firstName: "Marie",
    lastName: "Petit",
    email: "marie.petit@example.com",
    phone: "06 45 67 89 01",
    department: "Ressources Humaines",
    position: "Directrice RH",
    status: "active",
    hireDate: "07/07/2020",
  },
  {
    id: "5",
    firstName: "Alexandre",
    lastName: "Leroy",
    email: "alexandre.leroy@example.com",
    phone: "06 56 78 90 12",
    department: "Support Client",
    position: "Responsable Support",
    status: "terminated",
    hireDate: "14/02/2018",
  },
  {
    id: "6",
    firstName: "Émilie",
    lastName: "Moreau",
    email: "emilie.moreau@example.com",
    phone: "06 67 89 01 23",
    department: "Développement",
    position: "Développeur Backend",
    status: "active",
    hireDate: "23/09/2021",
  },
  {
    id: "7",
    firstName: "Philippe",
    lastName: "Girard",
    email: "philippe.girard@example.com",
    phone: "06 78 90 12 34",
    department: "Ventes",
    position: "Responsable Commercial",
    status: "active",
    hireDate: "01/12/2019",
  },
  {
    id: "8",
    firstName: "Claire",
    lastName: "Lefebvre",
    email: "claire.lefebvre@example.com",
    phone: "06 89 01 23 45",
    department: "Finance",
    position: "Comptable",
    status: "active",
    hireDate: "17/04/2022",
  },
  {
    id: "9",
    firstName: "Lucas",
    lastName: "Roux",
    email: "lucas.roux@example.com",
    phone: "06 90 12 34 56",
    department: "Design",
    position: "Graphiste",
    status: "onLeave",
    hireDate: "08/06/2021",
  },
  {
    id: "10",
    firstName: "Camille",
    lastName: "Fournier",
    email: "camille.fournier@example.com",
    phone: "06 01 23 45 67",
    department: "Développement",
    position: "Dev Ops",
    status: "active",
    hireDate: "29/01/2020",
  },
  {
    id: "11",
    firstName: "Antoine",
    lastName: "Garnier",
    email: "antoine.garnier@example.com",
    phone: "06 12 34 56 78",
    department: "Produit",
    position: "Chef de Produit",
    status: "active",
    hireDate: "12/07/2019",
  },
  {
    id: "12",
    firstName: "Julie",
    lastName: "Vincent",
    email: "julie.vincent@example.com",
    phone: "06 23 45 67 89",
    department: "Marketing",
    position: "Responsable Marketing",
    status: "active",
    hireDate: "03/03/2021",
  },
  {
    id: "13",
    firstName: "Nicolas",
    lastName: "Mercier",
    email: "nicolas.mercier@example.com",
    phone: "06 34 56 78 90",
    department: "Support Client",
    position: "Agent Support",
    status: "terminated",
    hireDate: "19/08/2018",
  }
];
