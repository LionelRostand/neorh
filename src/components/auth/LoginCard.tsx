
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginCardProps {
  children: React.ReactNode;
}

const LoginCard = ({ children }: LoginCardProps) => {
  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default LoginCard;
