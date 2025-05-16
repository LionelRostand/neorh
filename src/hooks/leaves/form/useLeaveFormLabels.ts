
/**
 * Hook pour gérer les libellés dans le formulaire de congés
 */
export function useLeaveFormLabels() {
  // Obtenir le libellé du formulaire en fonction du type d'opération
  const getDialogTitle = (isAllocation = false): string => {
    return isAllocation ? "Attribution de congés" : "Demande de congés";
  };

  // Texte d'aide pour le champ d'allocation de congés payés
  const getPaidLeaveHelperText = () => {
    return "Nombre de jours de congés payés à attribuer";
  };

  // Texte d'aide pour le champ d'allocation de RTT
  const getRttHelperText = () => {
    return "Nombre de jours de RTT à attribuer";
  };

  // Libellé pour le champ d'allocation de congés payés
  const getPaidLeaveAllocationLabel = () => {
    return "Jours de congés payés";
  };

  // Libellé pour le champ d'allocation de RTT
  const getRttAllocationLabel = () => {
    return "Jours de RTT";
  };

  // Libellé pour le champ de type de congé
  const getLeaveTypeLabel = () => {
    return "Type de congé";
  };

  // Options de type de congé
  const getLeaveTypeOptions = () => {
    return [
      { value: "paid", label: "Congé payé" },
      { value: "rtt", label: "RTT" },
      { value: "sick", label: "Maladie" },
      { value: "maternity", label: "Maternité" },
      { value: "paternity", label: "Paternité" },
      { value: "other", label: "Autre" }
    ];
  };

  return {
    getDialogTitle,
    getPaidLeaveHelperText,
    getRttHelperText,
    getPaidLeaveAllocationLabel,
    getRttAllocationLabel,
    getLeaveTypeLabel,
    getLeaveTypeOptions
  };
}
