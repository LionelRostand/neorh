
import React from 'react';

interface EmployeeAvatarProps {
  employeeId?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmployeeAvatar = ({ name = 'Inconnu', size = 'md', className = '', employeeId }: EmployeeAvatarProps) => {
  const sizes = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };
  
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase() || '?';

  return (
    <div 
      className={`bg-gray-100 rounded-full flex items-center justify-center text-gray-500 ${sizes[size]} ${className}`}
    >
      {initials}
    </div>
  );
};

export default EmployeeAvatar;
