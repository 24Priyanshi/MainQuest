'use client';

import React from 'react';

interface PixelBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'danger' | 'success';
}

export const PixelBorder: React.FC<PixelBorderProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'highlight':
        return 'border-2 border-accent-secondary shadow-neon-purple';
      case 'danger':
        return 'border-2 border-accent-danger';
      case 'success':
        return 'border-2 border-accent-primary shadow-neon-green';
      case 'default':
      default:
        return 'border-2 border-base-border';
    }
  };

  return (
    <div className={`rounded-sm ${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
};
