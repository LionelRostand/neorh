
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, Key, Network, Clock, Calendar, FileText, Briefcase,
  FolderOpen, Building2, LineChart, Award, GraduationCap, Wallet, 
  Users as UsersGroup, BarChart3, Bell, Settings
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
};

const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
    description: "Vue d'ensemble des KPIs RH et statistiques"
  },
  {
    title: "Employés",
    href: "/employes",
    icon: <Users className="h-5 w-5" />,
    description: "Gestion des profils et informations des employés"
  },
  {
    title: "Badges et accès",
    href: "/badges",
    icon: <Key className="h-5 w-5" />,
    description: "Gestion des badges et droits d'accès"
  },
  {
    title: "Hiérarchie",
    href: "/hierarchie",
    icon: <Network className="h-5 w-5" />,
    description: "Visualisation de l'organigramme de l'entreprise"
  },
  {
    title: "Présences",
    href: "/presences",
    icon: <Clock className="h-5 w-5" />,
    description: "Suivi des présences quotidiennes"
  },
  {
    title: "Feuilles de temps",
    href: "/feuilles-de-temps",
    icon: <FileText className="h-5 w-5" />,
    description: "Gestion du temps travaillé"
  },
  {
    title: "Congés",
    href: "/conges",
    icon: <Calendar className="h-5 w-5" />,
    description: "Gestion des demandes de congés et absences"
  },
  {
    title: "Contrats",
    href: "/contrats",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Gestion des contrats de travail"
  },
  {
    title: "Documents RH",
    href: "/documents",
    icon: <FolderOpen className="h-5 w-5" />,
    description: "Archives des documents administratifs"
  },
  {
    title: "Départements",
    href: "/departements",
    icon: <Building2 className="h-5 w-5" />,
    description: "Administration des services de l'entreprise"
  },
  {
    title: "Évaluations",
    href: "/evaluations",
    icon: <LineChart className="h-5 w-5" />,
    description: "Processus d'évaluation des employés"
  },
  {
    title: "Formations",
    href: "/formations",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Plan de développement des compétences"
  },
  {
    title: "Salaires",
    href: "/salaires",
    icon: <Wallet className="h-5 w-5" />,
    description: "Administration des rémunérations"
  },
  {
    title: "Recrutement",
    href: "/recrutement",
    icon: <UsersGroup className="h-5 w-5" />,
    description: "Processus de recrutement"
  },
  {
    title: "Entreprises",
    href: "/entreprises",
    icon: <Building2 className="h-5 w-5" />,
    description: "Administration des entités juridiques"
  },
  {
    title: "Rapports",
    href: "/rapports",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Génération de rapports analytiques RH"
  },
  {
    title: "Alertes",
    href: "/alertes",
    icon: <Bell className="h-5 w-5" />,
    description: "Système de notifications et d'alertes RH"
  },
  {
    title: "Paramètres",
    href: "/parametres",
    icon: <Settings className="h-5 w-5" />,
    description: "Configuration générale du module RH"
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={cn(
      "h-screen fixed z-20 bg-sidebar text-sidebar-foreground transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4 flex justify-between items-center">
        {isOpen && <h2 className="font-bold text-xl text-sidebar-foreground">HRPanel</h2>}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-sidebar-foreground hover:bg-sidebar-accent rounded-md p-1"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </button>
      </div>

      <nav className="mt-6 h-[calc(100vh-5rem)] overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center p-2 rounded-md transition-colors relative",
                  location.pathname === item.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="min-w-6">{item.icon}</div>
                {isOpen && <span className="ml-2">{item.title}</span>}
              </Link>
              
              {!isOpen && hoveredItem === item.href && (
                <div className="absolute left-16 bg-gray-800 text-white p-2 rounded-md z-50 w-56">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-300">{item.description}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
