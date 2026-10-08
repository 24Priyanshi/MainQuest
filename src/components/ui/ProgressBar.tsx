'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  variant?: 'green' | 'purple' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'purple',
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max(progress, 0), 100);

  const getVariantClasses = () => {
    switch (variant) {
      case 'green': return 'bg-accent-primary shadow-neon-green';
      case 'warning': return 'bg-accent-warning';
      case 'danger': return 'bg-accent-danger';
      case 'purple':
      default: return 'bg-accent-secondary shadow-neon-purple';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'md':
      default: return 'h-2.5';
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-end text-text-secondary text-xs">
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-base border border-base-border rounded-full overflow-hidden ${getSizeClasses()}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${getVariantClasses()}`}
        />
      </div>
    </div>
  );
};
