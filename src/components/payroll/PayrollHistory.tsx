
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PayrollHistory: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Historique des fiches de paie</h2>
        <p className="text-muted-foreground">
          Aucune fiche de paie générée pour le moment.
        </p>
      </CardContent>
    </Card>
  );
};

export default PayrollHistory;
