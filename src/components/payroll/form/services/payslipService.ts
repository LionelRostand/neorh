
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HR } from "@/lib/constants/collections";

/**
 * Check if a payslip already exists for the given employee and period
 */
const checkExistingPayslip = async (employeeId: string, period: string) => {
  try {
    const payslipsQuery = query(
      collection(db, HR.PAYSLIPS),
      where("employeeId", "==", employeeId),
      where("period", "==", period)
    );
    
    const snapshot = await getDocs(payslipsQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking existing payslip:", error);
    return false;
  }
};

/**
 * Saves a generated payslip to Firestore only if it doesn't already exist
 */
export const savePayslipToFirestore = async (
  employee: any,
  company: any,
  periodLabel: string, 
  fileUrl: string,
  pdfBlob: Blob
) => {
  try {
    // Check if payslip already exists
    const exists = await checkExistingPayslip(employee.id, periodLabel);
    if (exists) {
      console.log(`Fiche de paie déjà existante pour ${employee.name} - ${periodLabel}`);
      throw new Error(`Une fiche de paie existe déjà pour ${employee.name} pour la période ${periodLabel}`);
    }

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
    
    // Check if document already exists in HR_DOCUMENTS
    const documentsQuery = query(
      collection(db, HR.DOCUMENTS),
      where("employeeId", "==", employee.id),
      where("title", "==", `Fiche de paie - ${employee.name} - ${periodLabel}`)
    );
    
    const docSnapshot = await getDocs(documentsQuery);
    
    if (docSnapshot.empty) {
      // Create a document reference in HR_DOCUMENTS collection only if it doesn't exist
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
    }

    console.log("Fiche de paie sauvegardée avec succès", payslipRef.id);
    return payslipRef.id;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la fiche de paie:", error);
    throw error;
  }
};
