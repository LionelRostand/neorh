
import { Employee } from "@/types/firebase";

export type Permission = {
  id?: string;
  menuName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  employeeId: string;
};

export const MENU_ITEMS = [
  "Tableau de bord",
  "Employés",
  "Badges et accès",
  "Hiérarchie",
  "Présences",
  "Feuilles de temps",
  "Congés",
  "Contrats",
  "Documents RH",
  "Départements",
  "Évaluations",
  "Formations",
  "Salaires",
  "Recrutement",
  "Entreprises",
  "Rapports",
  "Paramètres"
];
