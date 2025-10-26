import { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    isLoading ? 'btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <span className="spinner" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
