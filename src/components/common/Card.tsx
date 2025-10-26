import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  className?: string;
}

export function Card({ children, title, action, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header">
          {title && <h2 className="card-title">{title}</h2>}
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
}
