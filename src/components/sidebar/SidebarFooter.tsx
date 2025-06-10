
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  isOpen: boolean;
}

const SidebarFooter = ({ isOpen }: SidebarFooterProps) => {
  return (
    <div className={cn(
      "p-4 text-center text-sidebar-foreground/90 border-t border-sidebar-border",
      isOpen ? "" : "text-xs -rotate-90 whitespace-nowrap"
    )}>
      <p className={cn(
        "font-medium animate-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x",
        !isOpen && "mt-12"
      )}>
        NEOTECH-CONSULTING 2025
      </p>
    </div>
  );
};

export default SidebarFooter;
