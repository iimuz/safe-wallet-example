import { ethers } from 'ethers';
import Safe, { SafeTransactionDataPartial } from '@safe-global/protocol-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';

/**
 * Example: Send a transaction from Safe account
 *
 * This demonstrates how to:
 * 1. Create a transaction
 * 2. Sign it with the owner
 * 3. Execute it through the Safe
 */

async function sendTransactionFromSafe(
  safeAddress: string,
  destinationAddress: string,
  amount: string
) {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || 'https://rpc.sepolia.org';

    if (!privateKey) {
      throw new Error('Please set PRIVATE_KEY environment variable.');
    }

    console.log('🔗 Connecting to Safe...');

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: wallet,
    });

    // Connect to Safe
    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    console.log('✅ Connected to Safe:', safeAddress);

    // Check Safe balance
    const safeBalance = await safeSdk.getBalance();
    console.log('💰 Safe Balance:', ethers.formatEther(safeBalance), 'ETH');

    const amountInWei = ethers.parseEther(amount);

    if (safeBalance < amountInWei) {
      throw new Error(
        `Insufficient balance. Safe has ${ethers.formatEther(safeBalance)} ETH, ` +
        `but trying to send ${amount} ETH`
      );
    }

    // Create transaction
    console.log('📝 Creating transaction...');
    const safeTransactionData: SafeTransactionDataPartial = {
      to: destinationAddress,
      value: amountInWei.toString(),
      data: '0x', // Empty data for simple ETH transfer
    };

    const safeTransaction = await safeSdk.createTransaction({
      transactions: [safeTransactionData],
    });

    console.log('📋 Transaction Details:');
    console.log('  To:', destinationAddress);
    console.log('  Value:', amount, 'ETH');
    console.log('  Nonce:', safeTransaction.data.nonce);

    // Sign transaction
    console.log('✍️  Signing transaction...');
    const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction);

    // Check if we have enough signatures
    const threshold = await safeSdk.getThreshold();
    const signaturesCount = signedSafeTransaction.signatures.size;

    console.log(`📊 Signatures: ${signaturesCount}/${threshold}`);

    if (signaturesCount < threshold) {
      throw new Error(
        `Not enough signatures. Need ${threshold}, but only have ${signaturesCount}`
      );
    }

    // Execute transaction
    console.log('🚀 Executing transaction...');
    console.log('   This may take a few moments...');

    const executeTxResponse = await safeSdk.executeTransaction(signedSafeTransaction);
    const receipt = await executeTxResponse.transactionResponse?.wait();

    console.log('');
    console.log('✅ Transaction executed successfully!');
    console.log('');
    console.log('📋 Transaction Receipt:');
    console.log('  Transaction Hash:', receipt?.hash);
    console.log('  Block Number:', receipt?.blockNumber);
    console.log('  Gas Used:', receipt?.gasUsed.toString());
    console.log('');

    // Check new balance
    const newBalance = await safeSdk.getBalance();
    console.log('💰 New Safe Balance:', ethers.formatEther(newBalance), 'ETH');

    return receipt?.hash;
  } catch (error) {
    console.error('❌ Error sending transaction:', error);
    throw error;
  }
}

/**
 * Example: Create and propose a transaction (for multi-sig)
 * This creates a transaction but doesn't execute it immediately.
 * Other owners can sign it later.
 */
async function proposeTransaction(
  safeAddress: string,
  destinationAddress: string,
  amount: string
) {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || 'https://rpc.sepolia.org';

    if (!privateKey) {
      throw new Error('Please set PRIVATE_KEY environment variable.');
    }

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

    console.log('📝 Creating transaction proposal...');

    const safeTransactionData: SafeTransactionDataPartial = {
      to: destinationAddress,
      value: ethers.parseEther(amount).toString(),
      data: '0x',
    };

    const safeTransaction = await safeSdk.createTransaction({
      transactions: [safeTransactionData],
    });

    // Sign transaction
    const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction);

    console.log('✅ Transaction proposal created and signed');
    console.log('');
    console.log('📋 Transaction Details:');
    console.log('  To:', destinationAddress);
    console.log('  Value:', amount, 'ETH');
    console.log('  Nonce:', safeTransaction.data.nonce);
    console.log('  Signatures:', signedSafeTransaction.signatures.size);
    console.log('');
    console.log('⏳ This transaction needs to be signed by other owners');
    console.log('   and then executed.');

    return signedSafeTransaction;
  } catch (error) {
    console.error('❌ Error creating transaction proposal:', error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log('Usage:');
    console.log('  Send transaction:');
    console.log('    npm run send <safe-address> <destination-address> <amount-in-eth>');
    console.log('');
    console.log('  Example:');
    console.log('    npm run send 0x123... 0x456... 0.1');
    return;
  }

  const [safeAddress, destinationAddress, amount] = args;

  await sendTransactionFromSafe(safeAddress, destinationAddress, amount);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { sendTransactionFromSafe, proposeTransaction };
