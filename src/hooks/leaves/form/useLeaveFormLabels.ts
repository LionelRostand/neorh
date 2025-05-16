
/**
 * Hook to provide labels and helper text for the form
 */
export function useLeaveFormLabels() {
  // Determine the title of the form
  const getDialogTitle = () => {
    return "Attribution de congés sur période";
  };
  
  // Texte d'aide pour l'allocation
  const getPaidLeaveHelperText = () => {
    return "Au-delà de 5 jours, les jours restants seront conservés pour la prochaine période";
  };
  
  const getRttHelperText = () => {
    return "Les jours de RTT doivent être utilisés dans la période courante";
  };

  // Générer le libellé du champ d'allocation en fonction du type
  const getPaidLeaveAllocationLabel = () => {
    return "Nombre de jours de Congé payé à attribuer";
  };
  
  const getRttAllocationLabel = () => {
    return "Nombre de jours de RTT à attribuer";
  };

  return {
    getDialogTitle,
    getPaidLeaveHelperText,
    getRttHelperText,
    getPaidLeaveAllocationLabel,
    getRttAllocationLabel
  };
}
