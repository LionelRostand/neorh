
import React from "react";

const LoginLogo = () => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-2">
        <div className="text-[#2ECC71] text-4xl">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 5.83L31.67 12.5V25.83L20 32.5L8.33 25.83V12.5L20 5.83Z" stroke="#2ECC71" strokeWidth="3" fill="#2ECC71" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-gray-800">NEORH</span>
      </div>
    </div>
  );
};

export default LoginLogo;
