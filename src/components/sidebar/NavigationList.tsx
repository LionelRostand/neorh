
import React from "react";
import NavItem from "./NavItem";
import { NavItem as NavItemType } from "./NavItems";

interface NavigationListProps {
  navItems: NavItemType[];
  isOpen: boolean;
}

const NavigationList = ({ navItems, isOpen }: NavigationListProps) => {
  return (
    <nav className="mt-6 h-[calc(100vh-10rem)] overflow-y-auto">
      <ul className="space-y-1 px-2">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} isOpen={isOpen} />
        ))}
      </ul>
    </nav>
  );
};

export default NavigationList;
