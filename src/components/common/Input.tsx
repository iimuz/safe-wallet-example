import { InputHTMLAttributes, ReactNode } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-container">
        {leftIcon && <div className="input-icon input-icon-left">{leftIcon}</div>}
        <input
          id={inputId}
          className={`input ${error ? 'input-error' : ''} ${leftIcon ? 'input-with-left-icon' : ''} ${rightIcon ? 'input-with-right-icon' : ''}`}
          {...props}
        />
        {rightIcon && <div className="input-icon input-icon-right">{rightIcon}</div>}
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
}
