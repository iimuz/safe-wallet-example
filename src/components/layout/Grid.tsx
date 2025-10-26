import { ReactNode } from 'react';
import './Grid.css';

interface GridProps {
  children: ReactNode;
  columns?: number;
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Grid({ children, columns = 2, gap = 'medium', className = '' }: GridProps) {
  return (
    <div
      className={`grid grid-gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${columns === 1 ? '100%' : '300px'}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}
