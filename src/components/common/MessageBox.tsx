import { ReactNode } from 'react';
import './MessageBox.css';

interface MessageBoxProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}

export function MessageBox({ type, title, children, className = '' }: MessageBoxProps) {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div className={`message-box message-box-${type} ${className}`}>
      <div className="message-box-icon">{icons[type]}</div>
      <div className="message-box-content">
        {title && <div className="message-box-title">{title}</div>}
        <div className="message-box-body">{children}</div>
      </div>
    </div>
  );
}
