import { SafeProvider } from '@/hooks/useSafe';
import { WalletConnect } from '@/components/WalletConnect';
import { CreateSafe } from '@/components/CreateSafe';
import { ConnectSafe } from '@/components/ConnectSafe';
import { SafeInfo } from '@/components/SafeInfo';
import { SendTransaction } from '@/components/SendTransaction';
import './App.css';

function AppContent() {
  return (
    <div className="app">
      <header className="header">
        <h1>Safe Account Abstraction</h1>
        <p className="subtitle">MetaMask Signer Example (1 Signer)</p>
      </header>

      <main className="main">
        <section className="section">
          <WalletConnect />
        </section>

        <section className="section">
          <div className="grid">
            <CreateSafe />
            <ConnectSafe />
          </div>
        </section>

        <section className="section">
          <SafeInfo />
        </section>

        <section className="section">
          <SendTransaction />
        </section>
      </main>

      <footer className="footer">
        <p>
          Built with{' '}
          <a href="https://docs.safe.global/" target="_blank" rel="noopener noreferrer">
            Safe Protocol Kit
          </a>
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <SafeProvider>
      <AppContent />
    </SafeProvider>
  );
}

export default App;
