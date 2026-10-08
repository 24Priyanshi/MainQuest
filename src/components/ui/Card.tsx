'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'main' | 'danger';
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  hoverable = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'highlight':
        return 'border-accent-secondary shadow-neon-purple';
      case 'main':
        return 'border-accent-primary shadow-neon-green';
      case 'danger':
        return 'border-accent-danger';
      case 'default':
      default:
        return 'border-base-border';
    }
  };

  const hoverClasses = hoverable
    ? 'hover:border-accent-secondary/50 cursor-pointer transition-colors duration-200'
    : '';

  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable ? { whileHover: { scale: 1.02 } } : {};

  return (
    <Component
      className={`
        bg-base-panel border-2 rounded-lg p-4
        ${getVariantClasses()}
        ${hoverClasses}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
};
