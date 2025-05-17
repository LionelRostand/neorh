
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarNavItem from "./SidebarNavItem";
import { navItems } from "./navItems";

interface SidebarNavigationProps {
  isOpen: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isOpen }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="mt-2 h-[calc(100vh-10rem)] overflow-y-auto">
      <ul className="space-y-0 px-2">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
            isOpen={isOpen}
            isHovered={hoveredItem === item.href}
            onMouseEnter={() => setHoveredItem(item.href)}
            onMouseLeave={() => setHoveredItem(null)}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNavigation;
