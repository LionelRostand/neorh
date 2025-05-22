
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import PayslipForm from "./PayslipForm";

const PayrollFormCard: React.FC = () => {
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-6 text-emerald-700">Créer une nouvelle fiche de paie</h2>
        <PayslipForm />
      </CardContent>
    </Card>
  );
};

export default PayrollFormCard;
