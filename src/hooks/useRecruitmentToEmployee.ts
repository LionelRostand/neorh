
import { useState } from 'react';
import { collection, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { RecruitmentPost } from '@/types/recruitment';
import { Employee } from '@/types/firebase';

export const useRecruitmentToEmployee = () => {
  const [converting, setConverting] = useState(false);

  const convertToEmployee = async (recruitmentPost: RecruitmentPost) => {
    if (!recruitmentPost.candidateName) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun candidat n'est associé à cette offre"
      });
      return false;
    }

    setConverting(true);

    try {
      // Parse name
      const nameParts = recruitmentPost.candidateName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create new employee record
      const employeeData: Omit<Employee, 'id'> = {
        firstName,
        lastName,
        email: '',  // Would need to be filled in later
        phone: '',  // Would need to be filled in later
        department: recruitmentPost.department,
        position: recruitmentPost.title,
        status: 'active',
        hireDate: new Date().toISOString()
      };

      const employeesRef = collection(db, 'hr_employees');
      const newEmployeeRef = await addDoc(employeesRef, employeeData);
      const employeeId = newEmployeeRef.id;

      // Update recruitment post
      const postRef = doc(db, 'hr_recruitment', recruitmentPost.id);
      await updateDoc(postRef, {
        status: 'fermée',
        updatedAt: new Date().toISOString(),
        employeeId: employeeId
      });

      toast({
        title: "Conversion réussie",
        description: `${recruitmentPost.candidateName} a été ajouté comme employé`
      });

      setConverting(false);
      return true;
    } catch (error) {
      console.error("Error converting to employee:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de convertir le candidat en employé"
      });
      
      setConverting(false);
      return false;
    }
  };

  return {
    converting,
    convertToEmployee
  };
};

export default useRecruitmentToEmployee;
