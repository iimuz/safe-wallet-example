import { ethers } from 'ethers';
import Safe, { SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';

/**
 * Create a new Safe account using MetaMask as the signer
 * This example demonstrates how to:
 * 1. Connect to MetaMask
 * 2. Create an EthersAdapter
 * 3. Deploy a new Safe account with 1 signer
 */
export async function createSafeWithMetaMask(): Promise<string> {
  try {
    // Check if MetaMask is installed
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension.');
    }

    console.log('Connecting to MetaMask...');

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create provider and signer from MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    console.log('Connected to account:', signerAddress);

    // Create EthersAdapter
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    console.log('Creating Safe Factory...');

    // Create SafeFactory
    const safeFactory = await SafeFactory.create({ ethAdapter });

    // Configure Safe with 1 owner and threshold of 1
    const safeAccountConfig: SafeAccountConfig = {
      owners: [signerAddress],
      threshold: 1, // Only 1 signature required
    };

    console.log('Deploying Safe account...');
    console.log('Safe configuration:', safeAccountConfig);

    // Deploy Safe
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

    const safeAddress = await safeSdk.getAddress();

    console.log('Safe deployed successfully!');
    console.log('Safe Address:', safeAddress);
    console.log('Owner:', signerAddress);
    console.log('Threshold: 1/1');

    return safeAddress;
  } catch (error) {
    console.error('Error creating Safe:', error);
    throw error;
  }
}

/**
 * Connect to an existing Safe account
 */
export async function connectToSafe(safeAddress: string): Promise<Safe> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed.');
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    console.log('Connecting to Safe at:', safeAddress);

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    const owners = await safeSdk.getOwners();
    const threshold = await safeSdk.getThreshold();

    console.log('Connected to Safe successfully!');
    console.log('Owners:', owners);
    console.log('Threshold:', threshold);

    return safeSdk;
  } catch (error) {
    console.error('Error connecting to Safe:', error);
    throw error;
  }
}

/**
 * Get Safe account information
 */
export async function getSafeInfo(safeSdk: Safe) {
  const safeAddress = await safeSdk.getAddress();
  const owners = await safeSdk.getOwners();
  const threshold = await safeSdk.getThreshold();
  const nonce = await safeSdk.getNonce();
  const balance = await safeSdk.getBalance();

  return {
    address: safeAddress,
    owners,
    threshold,
    nonce,
    balance: ethers.formatEther(balance),
  };
}

// For browser usage
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.createSafeWithMetaMask = createSafeWithMetaMask;
  // @ts-ignore
  window.connectToSafe = connectToSafe;
  // @ts-ignore
  window.getSafeInfo = getSafeInfo;
}
