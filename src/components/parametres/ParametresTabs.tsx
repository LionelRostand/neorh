
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Shield, User, Database } from "lucide-react";

const ParametresTabs = () => {
  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="general" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Général
      </TabsTrigger>
      <TabsTrigger value="notifications" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Notifications
      </TabsTrigger>
      <TabsTrigger value="security" className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Sécurité
      </TabsTrigger>
      <TabsTrigger value="account" className="flex items-center gap-2">
        <User className="h-4 w-4" />
        Compte
      </TabsTrigger>
      <TabsTrigger value="database" className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        Base de données
      </TabsTrigger>
    </TabsList>
  );
};

export default ParametresTabs;
