import { useState, useCallback } from 'react';
import type { WalletInfo } from '@/types/safe';
import { connectToMetaMask } from '@/utils/safe';

export function useWallet() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
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

  const disconnect = useCallback(() => {
    setWalletInfo(null);
    setIsConnected(false);
    setError(null);
  }, []);

  return {
    walletInfo,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
  };
}
