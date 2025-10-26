import { ethers } from 'ethers';
import Safe, { SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';

/**
 * Node.js example: Create a Safe account using a private key
 *
 * This example is for testing/development purposes.
 * In production, NEVER hardcode private keys!
 *
 * Usage:
 * 1. Set your private key as an environment variable: PRIVATE_KEY
 * 2. Set your RPC URL as an environment variable: RPC_URL
 * 3. Run: npm run dev
 */

async function createSafeWithPrivateKey() {
  try {
    // Get configuration from environment variables
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || 'https://rpc.sepolia.org';

    if (!privateKey) {
      throw new Error(
        'Please set PRIVATE_KEY environment variable.\n' +
        'Example: PRIVATE_KEY=0x... npm run dev'
      );
    }

    console.log('🔗 Connecting to network:', rpcUrl);

    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const signerAddress = await wallet.getAddress();

    // Get network info
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(signerAddress);

    console.log('📊 Network Information:');
    console.log('  Chain ID:', network.chainId.toString());
    console.log('  Network:', network.name);
    console.log('');
    console.log('👤 Signer Information:');
    console.log('  Address:', signerAddress);
    console.log('  Balance:', ethers.formatEther(balance), 'ETH');
    console.log('');

    if (balance === 0n) {
      console.warn('⚠️  Warning: Account has 0 ETH balance. You need ETH for gas fees.');
      console.warn('   Get testnet ETH from a faucet before deploying Safe.');
      return;
    }

    // Create EthersAdapter
    console.log('🔧 Creating EthersAdapter...');
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: wallet,
    });

    // Create SafeFactory
    console.log('🏭 Creating Safe Factory...');
    const safeFactory = await SafeFactory.create({ ethAdapter });

    // Configure Safe with 1 owner and threshold of 1
    const safeAccountConfig: SafeAccountConfig = {
      owners: [signerAddress],
      threshold: 1, // Only 1 signature required
    };

    console.log('⚙️  Safe Configuration:');
    console.log('  Owners:', safeAccountConfig.owners);
    console.log('  Threshold:', safeAccountConfig.threshold);
    console.log('');

    console.log('🚀 Deploying Safe account...');
    console.log('   This may take a few moments...');

    // Deploy Safe
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
    const safeAddress = await safeSdk.getAddress();

    console.log('');
    console.log('✅ Safe deployed successfully!');
    console.log('');
    console.log('📋 Safe Details:');
    console.log('  Safe Address:', safeAddress);
    console.log('  Owner:', signerAddress);
    console.log('  Threshold: 1/1');
    console.log('');
    console.log('🔗 Next Steps:');
    console.log('  1. Send some ETH to your Safe address:', safeAddress);
    console.log('  2. Use the Safe address to interact with dApps');
    console.log('  3. Execute transactions through your Safe');
    console.log('');

    // Get Safe info
    const nonce = await safeSdk.getNonce();
    const safeBalance = await safeSdk.getBalance();

    console.log('📊 Safe Status:');
    console.log('  Nonce:', nonce.toString());
    console.log('  Balance:', ethers.formatEther(safeBalance), 'ETH');

    return safeAddress;
  } catch (error) {
    console.error('❌ Error creating Safe:', error);
    throw error;
  }
}

/**
 * Connect to an existing Safe
 */
async function connectToExistingSafe(safeAddress: string) {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || 'https://rpc.sepolia.org';

    if (!privateKey) {
      throw new Error('Please set PRIVATE_KEY environment variable.');
    }

    console.log('🔗 Connecting to Safe at:', safeAddress);

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: wallet,
    });

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    // Get Safe information
    const owners = await safeSdk.getOwners();
    const threshold = await safeSdk.getThreshold();
    const nonce = await safeSdk.getNonce();
    const balance = await safeSdk.getBalance();

    console.log('✅ Connected to Safe successfully!');
    console.log('');
    console.log('📋 Safe Information:');
    console.log('  Address:', safeAddress);
    console.log('  Owners:', owners);
    console.log('  Threshold:', threshold, '/', owners.length);
    console.log('  Nonce:', nonce.toString());
    console.log('  Balance:', ethers.formatEther(balance), 'ETH');

    return safeSdk;
  } catch (error) {
    console.error('❌ Error connecting to Safe:', error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'connect' && args[1]) {
    // Connect to existing Safe
    await connectToExistingSafe(args[1]);
  } else {
    // Create new Safe
    await createSafeWithPrivateKey();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { createSafeWithPrivateKey, connectToExistingSafe };
