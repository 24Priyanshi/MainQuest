import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4 border-2';
      case 'lg': return 'w-12 h-12 border-4';
      case 'md':
      default: return 'w-8 h-8 border-4';
    }
  };

  return (
    <div
      className={`
        rounded-full animate-spin
        border-base-border border-t-accent-primary
        ${getSizeClasses()}
        ${className}
      `}
    />
  );
};
