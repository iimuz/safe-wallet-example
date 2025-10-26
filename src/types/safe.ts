import type Safe from '@safe-global/protocol-kit';

export interface SafeInfo {
  address: string;
  owners: string[];
  threshold: number;
  nonce: number;
  balance: string;
}

export interface NetworkInfo {
  chainId: bigint;
  name: string;
}

export interface WalletInfo {
  address: string;
  balance: string;
  network: NetworkInfo;
}

export interface TransactionData {
  to: string;
  value: string;
  data?: string;
}

export interface SafeContextType {
  safeSdk: Safe | null;
  safeInfo: SafeInfo | null;
  walletInfo: WalletInfo | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  createSafe: () => Promise<string>;
  connectToSafe: (safeAddress: string) => Promise<void>;
  refreshSafeInfo: () => Promise<void>;
  sendTransaction: (tx: TransactionData) => Promise<string>;
  disconnect: () => void;
}
