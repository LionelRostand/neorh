
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  isOpen: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isOpen }) => {
  return (
    <div className={cn(
      "p-4 text-center border-t border-green-400 bg-green-500 text-white",
      isOpen ? "" : "text-xs -rotate-90 whitespace-nowrap"
    )}>
      <p className={cn("font-medium", !isOpen && "mt-12")}>
        NEOTECH-CONSULTING 2025
      </p>
    </div>
  );
};

export default SidebarFooter;
