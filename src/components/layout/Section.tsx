import { ReactNode } from 'react';
import './Section.css';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className = '' }: SectionProps) {
  return <section className={`section ${className}`}>{children}</section>;
}
