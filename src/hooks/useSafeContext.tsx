import { createContext, useContext, ReactNode } from 'react';
import { useWallet } from './useWallet';
import { useSafeOperations } from './useSafeOperations';
import type { TransactionData } from '@/types/safe';

interface SafeContextValue {
  // Wallet
  walletInfo: ReturnType<typeof useWallet>['walletInfo'];
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;

  // Safe
  safeInfo: ReturnType<typeof useSafeOperations>['safeInfo'];
  safeSdk: ReturnType<typeof useSafeOperations>['safeSdk'];
  createSafe: () => Promise<string>;
  connectToSafe: (address: string) => Promise<void>;
  refreshSafeInfo: () => Promise<void>;
  sendTransaction: (tx: TransactionData) => Promise<string>;

  // State
  isLoading: boolean;
  error: string | null;
}

const SafeContext = createContext<SafeContextValue | undefined>(undefined);

export function SafeProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  const safe = useSafeOperations();

  const createSafe = async (): Promise<string> => {
    if (!wallet.walletInfo) {
      throw new Error('Please connect wallet first');
    }
    return safe.createSafe(wallet.walletInfo.address);
  };

  const connectToSafe = async (address: string) => {
    if (!wallet.isConnected) {
      throw new Error('Please connect wallet first');
    }
    return safe.connectToSafe(address);
  };

  const disconnectWallet = () => {
    wallet.disconnect();
    safe.reset();
  };

  const value: SafeContextValue = {
    // Wallet
    walletInfo: wallet.walletInfo,
    isWalletConnected: wallet.isConnected,
    connectWallet: wallet.connect,
    disconnectWallet,

    // Safe
    safeInfo: safe.safeInfo,
    safeSdk: safe.safeSdk,
    createSafe,
    connectToSafe,
    refreshSafeInfo: safe.refreshInfo,
    sendTransaction: safe.sendTransaction,

    // State
    isLoading: wallet.isLoading || safe.isLoading,
    error: wallet.error || safe.error,
  };

  return <SafeContext.Provider value={value}>{children}</SafeContext.Provider>;
}

export function useSafeContext() {
  const context = useContext(SafeContext);
  if (context === undefined) {
    throw new Error('useSafeContext must be used within a SafeProvider');
  }
  return context;
}
