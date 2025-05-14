
import { MOCK_EMPLOYEES } from '@/data/mockEmployees';

// Simulate fetching employees from an API
export const fetchEmployees = async () => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For now, we'll use mock data
  // In a real app, this would be replaced with an actual API call:
  // const response = await fetch('/api/employees');
  // const data = await response.json();
  
  return MOCK_EMPLOYEES;
};
