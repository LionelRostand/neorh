
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
        "font-medium animate-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient-x",
        !isOpen && "mt-12"
      )}>
        NEOTECH-CONSULTING 2025
      </p>
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default SidebarFooter;
