import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type Safe from '@safe-global/protocol-kit';
import type { SafeContextType, SafeInfo, WalletInfo, TransactionData } from '@/types/safe';
import {
  connectToMetaMask,
  createSafeAccount,
  connectToExistingSafe,
  getSafeInfo,
  sendSafeTransaction,
} from '@/utils/safe';

const SafeContext = createContext<SafeContextType | undefined>(undefined);

export function SafeProvider({ children }: { children: ReactNode }) {
  const [safeSdk, setSafeSdk] = useState<Safe | null>(null);
  const [safeInfo, setSafeInfo] = useState<SafeInfo | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const wallet = await connectToMetaMask();
      setWalletInfo(wallet);
      setIsConnected(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSafe = useCallback(async (): Promise<string> => {
    if (!walletInfo) {
      throw new Error('Please connect wallet first');
    }

    setIsLoading(true);
    setError(null);
    try {
      const safe = await createSafeAccount(walletInfo.address);
      setSafeSdk(safe);

      const info = await getSafeInfo(safe);
      setSafeInfo(info);

      return info.address;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create Safe';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [walletInfo]);

  const connectToSafe = useCallback(async (safeAddress: string) => {
    if (!isConnected) {
      throw new Error('Please connect wallet first');
    }

    setIsLoading(true);
    setError(null);
    try {
      const safe = await connectToExistingSafe(safeAddress);
      setSafeSdk(safe);

      const info = await getSafeInfo(safe);
      setSafeInfo(info);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect to Safe';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  const refreshSafeInfo = useCallback(async () => {
    if (!safeSdk) {
      throw new Error('No Safe connected');
    }

    setIsLoading(true);
    setError(null);
    try {
      const info = await getSafeInfo(safeSdk);
      setSafeInfo(info);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh Safe info';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [safeSdk]);

  const sendTransaction = useCallback(
    async (tx: TransactionData): Promise<string> => {
      if (!safeSdk) {
        throw new Error('No Safe connected');
      }

      setIsLoading(true);
      setError(null);
      try {
        const txHash = await sendSafeTransaction(
          safeSdk,
          tx.to,
          tx.value,
          tx.data
        );

        // Refresh Safe info after transaction
        await refreshSafeInfo();

        return txHash;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send transaction';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [safeSdk, refreshSafeInfo]
  );

  const disconnect = useCallback(() => {
    setSafeSdk(null);
    setSafeInfo(null);
    setWalletInfo(null);
    setIsConnected(false);
    setError(null);
  }, []);

  const value: SafeContextType = {
    safeSdk,
    safeInfo,
    walletInfo,
    isConnected,
    isLoading,
    error,
    connectWallet,
    createSafe,
    connectToSafe,
    refreshSafeInfo,
    sendTransaction,
    disconnect,
  };

  return <SafeContext.Provider value={value}>{children}</SafeContext.Provider>;
}

export function useSafe() {
  const context = useContext(SafeContext);
  if (context === undefined) {
    throw new Error('useSafe must be used within a SafeProvider');
  }
  return context;
}
