
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import ChangePasswordForm from "./ChangePasswordForm";
import AccountSettings from "./account/AccountSettings";
import EmployeePasswordManager from "./account/EmployeePasswordManager";

const ParametresCompte = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <AccountSettings />
      
      <ChangePasswordForm />

      {user?.isAdmin && <EmployeePasswordManager />}
    </div>
  );
};

export default ParametresCompte;
