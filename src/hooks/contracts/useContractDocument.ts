
import { useState, useRef, useEffect, useCallback } from "react";
import { Document } from "@/lib/constants";
import useFirestore from "@/hooks/useFirestore";
import { toast } from "@/components/ui/use-toast";
import { HR } from "@/lib/constants/collections";

/**
 * Hook to fetch a contract document
 */
export const useContractDocument = (contractId: string | null, isOpen: boolean) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const documentsCollection = useFirestore<Document>(HR.DOCUMENTS);
  
  // Utilisation d'un ref pour le flag de fetching plutôt qu'un state pour éviter les re-renders
  const isFetchingRef = useRef(false);
  
  // Référence pour suivre la dernière date de mise à jour
  const lastFetchTime = useRef<number>(0);
  
  // Référence pour le contrat actuellement affiché
  const currentContractId = useRef<string | null>(null);

  // Création d'une fonction memoïsée pour éviter de créer une nouvelle fonction à chaque render
  const fetchContractDocument = useCallback(async (id: string, force = false) => {
    // Si on est déjà en train de récupérer des données, ne pas commencer une autre requête
    if (isFetchingRef.current && !force) {
      console.log("Une requête est déjà en cours, annulation de la nouvelle requête");
      return;
    }
    
    // Vérifier si c'est un nouveau contrat
    const isNewContract = currentContractId.current !== id;
    
    // Vérifier si on doit rafraîchir les données (soit nouveau contrat, soit forcer le rafraîchissement)
    if (!isNewContract && !force && Date.now() - lastFetchTime.current < 5000) {
      console.log("Données récentes disponibles, pas besoin de rafraîchir");
      return;
    }

    console.log("Début de la récupération du document de contrat pour l'ID:", id);
    
    setLoading(true);
    setError(null);
    isFetchingRef.current = true;
    currentContractId.current = id;
    
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
        setDocument(filteredDocs[0]);
        // Mettre à jour le moment du dernier fetch
        lastFetchTime.current = Date.now();
      } else {
        setError("Aucun document trouvé pour ce contrat.");
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
      // Marquer comme terminé dans tous les cas
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [documentsCollection]);

  // Rafraîchir périodiquement les données du document pour voir les mises à jour de signatures
  useEffect(() => {
    if (!isOpen || !contractId) {
      return;
    }

    // Charger initialement
    fetchContractDocument(contractId);
    
    // Rafraîchir périodiquement si c'est un document en attente de signature
    const intervalId = setInterval(() => {
      if (document?.status === 'pending_signature') {
        fetchContractDocument(contractId, true);
      }
    }, 5000); // Rafraîchir toutes les 5 secondes pour les documents en attente

    // Définir un timeout pour éviter le chargement infini
    const timeoutId = setTimeout(() => {
      if (loading && !document && !error) {
        console.log("Timeout de chargement atteint");
        setLoading(false);
        setError("Le chargement du document a pris trop de temps.");
      }
    }, 10000); // Timeout après 10 secondes

    // Fonction de nettoyage
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      isFetchingRef.current = false;
    };
  }, [contractId, isOpen, fetchContractDocument, document?.status, loading, document, error]);

  // Fonction pour forcer le rafraîchissement
  const refreshDocument = useCallback(() => {
    if (contractId) {
      fetchContractDocument(contractId, true);
    }
  }, [contractId, fetchContractDocument]);

  return { document, loading, error, refreshDocument };
};
