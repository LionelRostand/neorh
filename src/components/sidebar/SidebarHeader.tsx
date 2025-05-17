
import React from "react";
import SidebarToggleButton from "./SidebarToggleButton";

interface SidebarHeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className="p-4 flex justify-between items-center">
      {isOpen && <h2 className="font-bold text-xl text-white">NEORH</h2>}
      <SidebarToggleButton isOpen={isOpen} onClick={toggleSidebar} />
    </div>
  );
};

export default SidebarHeader;
