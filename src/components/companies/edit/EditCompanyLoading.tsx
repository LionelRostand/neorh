
import React from 'react';
import { Loader } from "lucide-react";

const EditCompanyLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader className="h-8 w-8 animate-spin text-blue-500 mb-4" />
      <p className="text-gray-600 text-center">Chargement des informations de l'entreprise...</p>
      <p className="text-gray-400 text-sm mt-2">Veuillez patienter un instant</p>
    </div>
  );
};

export default EditCompanyLoading;
