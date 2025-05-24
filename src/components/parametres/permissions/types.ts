
import { Employee } from "@/types/firebase";
import { navItems } from "@/components/sidebar/NavItems";

export type Permission = {
  id?: string;
  menuName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  employeeId: string;
};

// Utilise directement les menus de la sidebar, en excluant les paramètres
export const MENU_ITEMS = navItems
  .filter(item => item.title !== "Paramètres")
  .map(item => item.title);
