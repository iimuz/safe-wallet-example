import { SafeProvider } from '@/hooks/useSafeContext';
import { Layout, Section, Grid } from '@/components/layout';
import {
  WalletConnect,
  CreateSafe,
  ConnectSafe,
  SafeInfo,
  SendTransaction,
} from '@/components/features';
import './App.css';

function AppContent() {
  return (
    <Layout>
      <Section>
        <WalletConnect />
      </Section>

      <Section>
        <Grid>
          <CreateSafe />
          <ConnectSafe />
        </Grid>
      </Section>

      <Section>
        <SafeInfo />
      </Section>

      <Section>
        <SendTransaction />
      </Section>
    </Layout>
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
