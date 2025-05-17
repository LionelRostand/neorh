
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "./types";
import { AlertTriangle } from "lucide-react";

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  isOpen: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ 
  item, 
  isActive, 
  isOpen, 
  isHovered,
  onMouseEnter,
  onMouseLeave
}) => {
  // Vérifier si l'icône est disponible ou si nous devons afficher une icône de remplacement
  const iconToRender = item.icon || <AlertTriangle className="text-yellow-400" />;
  
  return (
    <li>
      <Link
        to={item.href}
        className={cn(
          "flex items-center p-2 rounded-md transition-colors relative",
          isActive
            ? "bg-green-600 text-white"
            : "text-white hover:bg-green-600"
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="min-w-6">{iconToRender}</div>
        {isOpen && <span className="ml-2">{item.title}</span>}
      </Link>
      
      {!isOpen && isHovered && (
        <div className="absolute left-16 bg-gray-800 text-white p-2 rounded-md z-50 w-80 shadow-lg">
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-gray-300">{item.description}</p>
        </div>
      )}
    </li>
  );
};

export default SidebarNavItem;
