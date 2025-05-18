
import React from "react";
import { 
  LayoutDashboard, Users, Key, Network, Clock, Calendar, FileText, Briefcase,
  FolderOpen, Building2, LineChart, Award, GraduationCap, Wallet, 
  Users as UsersGroup, BarChart3, Settings, Projector
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
};

export const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/",
    icon: <LayoutDashboard className="h-5 w-5" />,
    description: "Vue d'ensemble des indicateurs clés RH : effectifs, absences récentes, statistiques d'embauche et de turnover. Présente des graphiques sur l'évolution des effectifs, la répartition par département et les tendances d'absentéisme."
  },
  {
    title: "Employés",
    href: "/employes",
    icon: <Users className="h-5 w-5" />,
    description: "Gestion complète des profils des employés incluant informations personnelles, professionnelles, compétences, et documents associés. Permet d'ajouter, modifier et archiver des profils avec historique complet des changements."
  },
  {
    title: "Badges et accès",
    href: "/badges",
    icon: <Key className="h-5 w-5" />,
    description: "Gestion des badges d'identification et droits d'accès aux locaux. Permet de générer des badges personnalisés, suivre les accès accordés et configurer les niveaux de sécurité par zone."
  },
  {
    title: "Hiérarchie",
    href: "/hierarchie",
    icon: <Network className="h-5 w-5" />,
    description: "Visualisation de l'organigramme de l'entreprise avec représentation interactive des liens hiérarchiques. Facilite la compréhension de la structure organisationnelle et des chaînes de responsabilité."
  },
  {
    title: "Présences",
    href: "/presences",
    icon: <Clock className="h-5 w-5" />,
    description: "Suivi quotidien des présences avec système de pointage. Enregistre les heures d'arrivée/départ, génère des rapports de présence et identifie les tendances d'absentéisme."
  },
  {
    title: "Feuilles de temps",
    href: "/feuilles-de-temps",
    icon: <FileText className="h-5 w-5" />,
    description: "Gestion du temps de travail par employé et par projet. Facilite la saisie des heures, l'approbation par les managers et l'exportation des données pour la paie."
  },
  {
    title: "Congés",
    href: "/conges",
    icon: <Calendar className="h-5 w-5" />,
    description: "Gestion complète du processus de demande et validation des congés. Inclut un calendrier partagé des absences, le suivi des soldes et l'historique des demandes."
  },
  {
    title: "Contrats",
    href: "/contrats",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Administration des contrats de travail avec suivi des échéances, historique des avenants et alertes de fin de contrat. Permet la génération de documents contractuels personnalisés."
  },
  {
    title: "Documents RH",
    href: "/documents",
    icon: <FolderOpen className="h-5 w-5" />,
    description: "Bibliothèque numérique pour tous les documents administratifs du personnel. Organise les fichiers par catégories avec système de recherche avancée et contrôle des droits d'accès."
  },
  {
    title: "Départements",
    href: "/departements",
    icon: <Building2 className="h-5 w-5" />,
    description: "Administration des unités organisationnelles avec définition des responsables, budgets alloués et objectifs. Permet l'affectation d'employés et le suivi des performances par département."
  },
  {
    title: "Projets",
    href: "/projets",
    icon: <Projector className="h-5 w-5" />,
    description: "Gestion des projets de l'entreprise avec suivi des ressources allouées, des délais et des budgets. Permet d'assigner des employés aux projets et de suivre l'avancement."
  },
  {
    title: "Évaluations",
    href: "/evaluations",
    icon: <LineChart className="h-5 w-5" />,
    description: "Gestion du processus d'évaluation des performances avec formulaires personnalisables, suivi des objectifs et historique des entretiens. Facilite le feedback continu entre managers et employés."
  },
  {
    title: "Formations",
    href: "/formations",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Planification et suivi des formations avec catalogue des cours disponibles, gestion des inscriptions et suivi des certifications. Permet d'identifier les besoins en compétences."
  },
  {
    title: "Salaires",
    href: "/salaires",
    icon: <Wallet className="h-5 w-5" />,
    description: "Administration des rémunérations avec historique des évolutions salariales, primes et avantages. Génère des bulletins de paie et des rapports sur la masse salariale."
  },
  {
    title: "Recrutement",
    href: "/recrutement",
    icon: <UsersGroup className="h-5 w-5" />,
    description: "Gestion du processus de recrutement de la définition du poste à l'intégration. Inclut publication d'offres, suivi des candidatures et planification des entretiens."
  },
  {
    title: "Entreprises",
    href: "/entreprises",
    icon: <Building2 className="h-5 w-5" />,
    description: "Gestion des entités juridiques du groupe avec leurs spécificités légales et administratives. Permet d'adapter les processus RH selon la réglementation applicable."
  },
  {
    title: "Rapports",
    href: "/rapports",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Génération d'analyses RH avec graphiques et tableaux personnalisables. Couvre divers indicateurs comme le turnover, l'absentéisme et les coûts salariaux avec export multiformat."
  },
  {
    title: "Paramètres",
    href: "/parametres", 
    icon: <Settings className="h-5 w-5" />,
    description: "Configuration du module RH avec personnalisation des workflows, droits d'accès et règles spécifiques à l'organisation. Permet d'adapter le système aux processus internes."
  },
];
