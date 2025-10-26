import { useState, useCallback } from 'react';
import type Safe from '@safe-global/protocol-kit';
import type { SafeInfo, TransactionData } from '@/types/safe';
import {
  createSafeAccount,
  connectToExistingSafe,
  getSafeInfo,
  sendSafeTransaction,
} from '@/utils/safe';

export function useSafeOperations() {
  const [safeSdk, setSafeSdk] = useState<Safe | null>(null);
  const [safeInfo, setSafeInfo] = useState<SafeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSafe = useCallback(async (ownerAddress: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const safe = await createSafeAccount(ownerAddress);
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
  }, []);

  const connectToSafe = useCallback(async (safeAddress: string) => {
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
  }, []);

  const refreshInfo = useCallback(async () => {
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
        const txHash = await sendSafeTransaction(safeSdk, tx.to, tx.value, tx.data);

        // Refresh Safe info after transaction
        await refreshInfo();

        return txHash;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send transaction';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [safeSdk, refreshInfo]
  );

  const reset = useCallback(() => {
    setSafeSdk(null);
    setSafeInfo(null);
    setError(null);
  }, []);

  return {
    safeSdk,
    safeInfo,
    isLoading,
    error,
    createSafe,
    connectToSafe,
    refreshInfo,
    sendTransaction,
    reset,
  };
}
