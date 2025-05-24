
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import ChangePasswordForm from "./ChangePasswordForm";
import AccountSettings from "./account/AccountSettings";
import EmployeePasswordManager from "./account/EmployeePasswordManager";
import RoleManager from "./account/RoleManager";

const ParametresCompte = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <AccountSettings />
      
      <RoleManager />
      
      <ChangePasswordForm />

      {user?.isAdmin && <EmployeePasswordManager />}
    </div>
  );
};

export default ParametresCompte;
