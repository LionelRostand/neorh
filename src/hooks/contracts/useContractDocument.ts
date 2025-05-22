
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
  // Référence pour suivre si une recherche a déjà été effectuée pour cet ID
  const searchCompletedRef = useRef<Record<string, boolean>>({});

  // Création d'une fonction memoïsée pour éviter de créer une nouvelle fonction à chaque render
  const fetchContractDocument = useCallback(async (id: string) => {
    // Si on a déjà cherché ce document sans le trouver, ne pas réessayer
    if (searchCompletedRef.current[id] === true) {
      console.log("Recherche déjà effectuée pour ce contrat, pas de document trouvé");
      setLoading(false);
      setError("Aucun document trouvé pour ce contrat.");
      return;
    }
    
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
        // Marquer comme recherche complétée sans résultat
        searchCompletedRef.current[id] = true;
        setError("Aucun document trouvé pour ce contrat.");
        
        // Afficher un contrat fictif pour l'exemple en cas d'absence de document réel
        // Cela évite l'écran de chargement infini
        setDocument(null);
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
      // Marquer comme terminé dans tous les cas pour éviter un chargement infini
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

    // Définir un timeout pour éviter le chargement infini
    const timeoutId = setTimeout(() => {
      if (loading && !document && !error) {
        console.log("Timeout de chargement atteint");
        setLoading(false);
        setError("Le chargement du document a pris trop de temps.");
      }
    }, 10000); // Timeout après 10 secondes

    fetchContractDocument(contractId);

    // Fonction de nettoyage pour annuler le timeout et les requêtes
    return () => {
      clearTimeout(timeoutId);
      isFetchingRef.current = false;
    };
  }, [contractId, isOpen, fetchContractDocument, loading, document, error]);

  return { document, loading, error };
};
