import { ethers, BrowserProvider } from 'ethers';
import Safe, { SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';
import type { SafeInfo, NetworkInfo, WalletInfo } from '@/types/safe';

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Connect to MetaMask and get wallet info
 */
export async function connectToMetaMask(): Promise<WalletInfo> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  // Request account access
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  // Create provider and signer
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(address);

  return {
    address,
    balance: ethers.formatEther(balance),
    network: {
      chainId: network.chainId,
      name: network.name,
    },
  };
}

/**
 * Create EthersAdapter for Safe SDK
 */
export async function createEthAdapter(): Promise<EthersAdapter> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed.');
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });
}

/**
 * Create a new Safe account
 */
export async function createSafeAccount(ownerAddress: string): Promise<Safe> {
  const ethAdapter = await createEthAdapter();
  const safeFactory = await SafeFactory.create({ ethAdapter });

  const safeAccountConfig: SafeAccountConfig = {
    owners: [ownerAddress],
    threshold: 1,
  };

  const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
  return safeSdk;
}

/**
 * Connect to an existing Safe account
 */
export async function connectToExistingSafe(safeAddress: string): Promise<Safe> {
  const ethAdapter = await createEthAdapter();

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress,
  });

  return safeSdk;
}

/**
 * Get Safe account information
 */
export async function getSafeInfo(safeSdk: Safe): Promise<SafeInfo> {
  const provider = new BrowserProvider(window.ethereum);

  const address = await safeSdk.getAddress();
  const owners = await safeSdk.getOwners();
  const threshold = await safeSdk.getThreshold();
  const nonce = await safeSdk.getNonce();
  const balanceWei = await provider.getBalance(address);

  return {
    address,
    owners,
    threshold,
    nonce,
    balance: ethers.formatEther(balanceWei),
  };
}

/**
 * Send a transaction from Safe
 */
export async function sendSafeTransaction(
  safeSdk: Safe,
  to: string,
  value: string,
  data: string = '0x'
): Promise<string> {
  const valueInWei = ethers.parseEther(value);

  // Create transaction
  const safeTransaction = await safeSdk.createTransaction({
    transactions: [
      {
        to,
        value: valueInWei.toString(),
        data,
      },
    ],
  });

  // Sign transaction
  const signedTransaction = await safeSdk.signTransaction(safeTransaction);

  // Check threshold
  const threshold = await safeSdk.getThreshold();
  const signaturesCount = signedTransaction.signatures.size;

  if (signaturesCount < threshold) {
    throw new Error(
      `Not enough signatures. Need ${threshold}, but only have ${signaturesCount}`
    );
  }

  // Execute transaction
  const executeTxResponse = await safeSdk.executeTransaction(signedTransaction);
  const receipt = await executeTxResponse.transactionResponse?.wait();

  if (!receipt?.hash) {
    throw new Error('Transaction failed');
  }

  return receipt.hash;
}

// Declare window.ethereum type
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
