import React, { ReactNode } from 'react';
import { PixelButton } from './PixelButton';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-base-panel border-2 border-base-border rounded-lg ${className}`}>
      {icon && (
        <div className="mb-4 text-text-secondary opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-text-primary font-pixel text-sm mb-2">{title}</h3>
      <p className="text-text-secondary font-body max-w-sm mb-6">{description}</p>
      {action && (
        <PixelButton onClick={action.onClick} variant="primary">
          {action.label}
        </PixelButton>
      )}
    </div>
  );
};
