
import { useState, useEffect } from 'react';
import { Project } from '@/types/project';

// Données de démonstration pour les projets
const demoProjects: Project[] = [
  {
    id: '1',
    name: 'Développement site e-commerce',
    description: 'Création d\'une plateforme e-commerce pour TechStore',
    client: 'TechStore SAS',
    manager: { id: '101', name: 'Marie Dubois', photoURL: '/placeholder.svg' },
    status: 'active',
    startDate: '2025-04-15',
    endDate: '2025-07-30',
    budget: 25000,
    budgetSpent: 12000,
    progress: 45,
    createdAt: '2025-04-10',
    updatedAt: '2025-05-16'
  },
  {
    id: '2',
    name: 'Migration ERP',
    description: 'Migration vers un nouveau système ERP',
    client: 'Logistiques International',
    manager: { id: '102', name: 'Thomas Martin', photoURL: '/placeholder.svg' },
    status: 'pending',
    startDate: '2025-06-01',
    endDate: '2025-12-31',
    budget: 75000,
    budgetSpent: 0,
    progress: 0,
    createdAt: '2025-04-28',
    updatedAt: '2025-04-28'
  },
  {
    id: '3',
    name: 'Application mobile',
    description: 'Développement d\'une application mobile cross-platform',
    client: 'HealthCare Plus',
    manager: { id: '103', name: 'Sophie Bernard', photoURL: '/placeholder.svg' },
    status: 'completed',
    startDate: '2024-11-10',
    endDate: '2025-04-30',
    budget: 45000,
    budgetSpent: 45000,
    progress: 100,
    createdAt: '2024-10-20',
    updatedAt: '2025-05-01'
  },
  {
    id: '4',
    name: 'Mise à jour infrastructure IT',
    description: 'Renouvellement de l\'infrastructure IT et migration cloud',
    client: 'Assurances Métropole',
    manager: { id: '104', name: 'Antoine Lefebvre', photoURL: '/placeholder.svg' },
    status: 'active',
    startDate: '2025-03-01',
    endDate: '2025-08-15',
    budget: 120000,
    budgetSpent: 70000,
    progress: 60,
    createdAt: '2025-02-15',
    updatedAt: '2025-05-10'
  },
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // Simule un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      setProjects(demoProjects);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue lors du chargement des projets'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects
  };
};
