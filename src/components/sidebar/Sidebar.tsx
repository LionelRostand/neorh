
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={cn(
      "h-screen fixed z-20 flex flex-col justify-between transition-all duration-300",
      isOpen ? "w-64" : "w-16",
      "bg-green-500 text-white" // Couleur verte comme dans l'image
    )}>
      <div>
        <SidebarHeader isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
        <SidebarNavigation isOpen={isOpen} />
      </div>
      
      <SidebarFooter isOpen={isOpen} />
    </div>
  );
};

export default Sidebar;
