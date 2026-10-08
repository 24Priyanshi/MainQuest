import React from 'react';

interface DifficultyStarsProps {
  difficulty: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const DifficultyStars: React.FC<DifficultyStarsProps> = ({
  difficulty,
  size = 'md',
  className = '',
}) => {
  const maxStars = 5;
  const clampedDifficulty = Math.min(Math.max(difficulty, 1), 5);
  
  const sizeClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass} ${className}`}>
      {[...Array(maxStars)].map((_, i) => (
        <span
          key={i}
          className={i < clampedDifficulty ? 'text-accent-warning' : 'text-base-border'}
        >
          {i < clampedDifficulty ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};
