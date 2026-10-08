'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface PixelButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-accent-secondary text-white hover:shadow-neon-purple-lg border-2 border-transparent';
      case 'danger':
        return 'bg-accent-danger text-white border-2 border-transparent';
      case 'ghost':
        return 'bg-transparent border-2 border-base-border text-text-primary hover:bg-base-panel';
      case 'primary':
      default:
        return 'bg-accent-primary text-[#2B1D12] hover:shadow-neon-green-lg font-pixel border-2 border-transparent';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-[10px] px-3 py-1.5';
      case 'lg':
        return 'text-base px-6 py-3';
      case 'md':
      default:
        return 'text-xs px-4 py-2';
    }
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center
        uppercase font-pixel rounded-sm
        transition-colors duration-200
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};
