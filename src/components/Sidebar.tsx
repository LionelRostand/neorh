
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarFooter from "./sidebar/SidebarFooter";
import NavigationList from "./sidebar/NavigationList";
import { navItems } from "./sidebar/NavItems";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn(
      "h-screen fixed z-20 bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col justify-between",
      isOpen ? "w-64" : "w-16"
    )}>
      <div>
        <SidebarHeader isOpen={isOpen} onToggle={toggleSidebar} />
        <NavigationList navItems={navItems} isOpen={isOpen} />
      </div>
      
      <SidebarFooter isOpen={isOpen} />
    </div>
  );
};

export default Sidebar;
