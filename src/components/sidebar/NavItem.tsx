
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  item: {
    title: string;
    href: string;
    icon: React.ReactNode;
    description: string;
  };
  isOpen: boolean;
}

const NavItem = ({ item, isOpen }: NavItemProps) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isActive = location.pathname === item.href;

  return (
    <li key={item.href}>
      <Link
        to={item.href}
        className={cn(
          "flex items-center p-2 rounded-md transition-colors relative",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        onMouseEnter={() => setHoveredItem(item.href)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <div className="min-w-6">{item.icon}</div>
        {isOpen && <span className="ml-2">{item.title}</span>}
      </Link>
      
      {!isOpen && hoveredItem === item.href && (
        <div className="absolute left-16 bg-gray-800 text-white p-2 rounded-md z-50 w-80 shadow-lg">
          <p className="font-medium">{item.title}</p>
          <p className="text-sm text-gray-300">{item.description}</p>
        </div>
      )}
    </li>
  );
};

export default NavItem;
