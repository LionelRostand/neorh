
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../types';

// Storage key for form data
const FORM_STORAGE_KEY = 'employeeFormData';

export function usePersistForm(form: UseFormReturn<EmployeeFormValues>) {
  // Load form data from localStorage on initial render
  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        
        // Convert the date if it exists
        if (parsedData.birthDate) {
          parsedData.birthDate = new Date(parsedData.birthDate);
        }
        
        form.reset(parsedData);
      } catch (error) {
        console.error("Erreur lors du chargement des données du formulaire:", error);
      }
    }
  }, [form]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Clear form data
  const clearFormData = () => {
    localStorage.removeItem(FORM_STORAGE_KEY);
  };

  return { clearFormData };
}
