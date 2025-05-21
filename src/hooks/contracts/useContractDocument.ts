
import { useState, useRef, useEffect, useCallback } from "react";
import { Document } from "@/lib/constants";
import useFirestore from "@/hooks/useFirestore";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook to fetch a contract document
 */
export const useContractDocument = (contractId: string | null, isOpen: boolean) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const documentsCollection = useFirestore<Document>("hr_documents");
  
  // Utilisation d'un ref pour le flag de fetching plutôt qu'un state pour éviter les re-renders
  const isFetchingRef = useRef(false);
  // Cache pour les documents déjà chargés
  const documentsCache = useRef<Record<string, Document>>({});

  // Création d'une fonction memoïsée pour éviter de créer une nouvelle fonction à chaque render
  const fetchContractDocument = useCallback(async (id: string) => {
    // Si on est déjà en train de récupérer des données, ne pas commencer une autre requête
    if (isFetchingRef.current) {
      console.log("Une requête est déjà en cours, annulation de la nouvelle requête");
      return;
    }

    // Vérifier si le document est dans le cache
    if (documentsCache.current[id]) {
      console.log("Document trouvé dans le cache, pas besoin de refaire la requête");
      setDocument(documentsCache.current[id]);
      setLoading(false);
      return;
    }

    console.log("Début de la récupération du document de contrat pour l'ID:", id);
    
    setLoading(true);
    setError(null);
    isFetchingRef.current = true;
    
    try {
      // Chercher le document associé au contrat
      const result = await documentsCollection.search({
        field: 'contractId',
        value: id
      });
      
      console.log("Résultat de la recherche:", result);
      
      // Filtrer manuellement pour la catégorie 'contracts'
      const filteredDocs = result.docs ? result.docs.filter(doc => doc.category === 'contracts') : [];
      console.log("Documents filtrés:", filteredDocs);
      
      if (filteredDocs && filteredDocs.length > 0) {
        // Mettre en cache le document
        documentsCache.current[id] = filteredDocs[0];
        setDocument(filteredDocs[0]);
      } else {
        setError("Aucun document trouvé pour ce contrat.");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du document:", err);
      setError("Erreur lors du chargement du contrat.");
      toast({
        title: "Erreur",
        description: "Impossible de charger le document du contrat",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [documentsCollection]);

  // Effect pour charger le document quand le contractId change
  useEffect(() => {
    // Ne rien faire si le dialog n'est pas ouvert ou s'il n'y a pas d'ID
    if (!isOpen || !contractId) {
      return;
    }

    fetchContractDocument(contractId);

    // Fonction de nettoyage pour potentiellement annuler des requêtes
    return () => {
      // Pour le moment, nous mettons juste le flag à false
      isFetchingRef.current = false;
    };
  }, [contractId, isOpen, fetchContractDocument]); // Dépendances explicites et minimales

  return { document, loading, error };
};
