
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Lock, User, Database } from "lucide-react";

const ParametresTabs = () => {
  return (
    <TabsList className="grid w-full grid-cols-5">
      <TabsTrigger value="general">
        <Settings className="h-4 w-4 mr-2" />
        Général
      </TabsTrigger>
      <TabsTrigger value="notifications">
        <Bell className="h-4 w-4 mr-2" />
        Notifications
      </TabsTrigger>
      <TabsTrigger value="security">
        <Lock className="h-4 w-4 mr-2" />
        Sécurité
      </TabsTrigger>
      <TabsTrigger value="account">
        <User className="h-4 w-4 mr-2" />
        Compte
      </TabsTrigger>
      <TabsTrigger value="database">
        <Database className="h-4 w-4 mr-2" />
        Base de données
      </TabsTrigger>
    </TabsList>
  );
};

export default ParametresTabs;
