
import React from "react";

interface SidebarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="text-white hover:bg-green-600 rounded-md p-1"
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
  );
};

export default SidebarToggleButton;
