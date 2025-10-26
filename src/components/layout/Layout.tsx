import { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">Safe Account Abstraction</h1>
      <p className="header-subtitle">MetaMask Signer Example (1 Signer)</p>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        Built with{' '}
        <a
          href="https://docs.safe.global/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Safe Protocol Kit
        </a>
      </p>
    </footer>
  );
}
