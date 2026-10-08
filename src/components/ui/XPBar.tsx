'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface XPBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({
  current,
  max,
  showLabel = true,
  size = 'md',
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-2';
      case 'lg': return 'h-4';
      case 'md':
      default: return 'h-3';
    }
  };

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-accent-primary font-pixel text-[10px]">
          <span>XP</span>
          <span>{current} / {max}</span>
        </div>
      )}
      <div className={`w-full bg-base border border-base-border rounded-full overflow-hidden ${getSizeClasses()}`}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-accent-primary shadow-neon-green rounded-full"
          />
        ) : (
          <div
            style={{ width: `${percentage}%` }}
            className="h-full bg-accent-primary shadow-neon-green rounded-full"
          />
        )}
      </div>
    </div>
  );
};
