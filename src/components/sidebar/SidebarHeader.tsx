
import React from "react";

interface SidebarHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SidebarHeader = ({ isOpen, onToggle }: SidebarHeaderProps) => {
  return (
    <div className="p-4 flex justify-between items-center">
      {isOpen && <h2 className="font-bold text-xl text-sidebar-foreground">NEORH</h2>}
      <button 
        onClick={onToggle} 
        className="text-sidebar-foreground hover:bg-sidebar-accent rounded-md p-1"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default SidebarHeader;
