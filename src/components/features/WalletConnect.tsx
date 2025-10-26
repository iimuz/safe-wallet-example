import { useSafeContext } from '@/hooks/useSafeContext';
import { Button, Address } from '@/components/common';

export function WalletConnect() {
  const { walletInfo, isWalletConnected, isLoading, connectWallet, disconnectWallet } =
    useSafeContext();

  if (isWalletConnected && walletInfo) {
    return (
      <div className="wallet-info">
        <div className="wallet-details">
          <h3>Connected Wallet</h3>
          <div className="info-row">
            <span className="label">Address:</span>
            <Address value={walletInfo.address} short />
          </div>
          <div className="info-row">
            <span className="label">Balance:</span>
            <span className="value">{Number(walletInfo.balance).toFixed(4)} ETH</span>
          </div>
          <div className="info-row">
            <span className="label">Network:</span>
            <span className="value">
              {walletInfo.network.name} (Chain ID: {walletInfo.network.chainId.toString()})
            </span>
          </div>
        </div>
        <Button variant="secondary" onClick={disconnectWallet}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <h3>Connect Your Wallet</h3>
      <p>Connect MetaMask to get started with Safe Account Abstraction</p>
      <Button onClick={connectWallet} isLoading={isLoading}>
        Connect MetaMask
      </Button>
    </div>
  );
}
