import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'main' | 'quest' | 'side' | 'quick' | 'xp' | 'level' | 'streak';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'side', className = '' }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'main':
        return 'bg-accent-primary/20 text-accent-primary border-accent-primary/50';
      case 'quest':
        return 'bg-accent-secondary/20 text-accent-secondary border-accent-secondary/50';
      case 'quick':
        return 'bg-accent-warning/20 text-accent-warning border-accent-warning/50';
      case 'xp':
        return 'bg-accent-primary/10 text-accent-primary border-transparent';
      case 'level':
        return 'bg-accent-secondary/10 text-accent-secondary border-transparent';
      case 'streak':
        return 'bg-orange-500/20 text-orange-400 border-transparent';
      case 'side':
      default:
        return 'bg-base-border/50 text-text-secondary border-base-border';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center gap-1
        font-pixel text-[10px] uppercase
        px-2 py-1 rounded border
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
