
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";

/**
 * Saves a generated payslip to Firestore
 */
export const savePayslipToFirestore = async (
  employee: any,
  company: any,
  periodLabel: string, 
  fileUrl: string,
  pdfBlob: Blob
) => {
  try {
    // Create a document reference in HR_PAYSLIPS collection
    const payslipRef = await addDoc(collection(db, HR.PAYSLIPS), {
      employeeId: employee.id,
      employeeName: employee.name,
      companyId: company.id,
      companyName: company.name,
      period: periodLabel,
      createdAt: serverTimestamp(),
      fileUrl: fileUrl || "",
      status: "completed"
    });
    
    // Create a document reference in HR_DOCUMENTS collection
    await addDoc(collection(db, HR.DOCUMENTS), {
      title: `Fiche de paie - ${employee.name} - ${periodLabel}`,
      category: "paystubs",
      fileUrl: fileUrl || "",
      uploadDate: serverTimestamp(),
      status: "active",
      employeeId: employee.id,
      employeeName: employee.name,
      companyId: company.id,
      description: `Fiche de paie pour la période ${periodLabel}`
    });

    console.log("Fiche de paie sauvegardée avec succès", payslipRef.id);
    return payslipRef.id;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la fiche de paie:", error);
    throw error;
  }
};
