import { useSafe } from '@/hooks/useSafe';

export function WalletConnect() {
  const { walletInfo, isConnected, isLoading, connectWallet, disconnect } = useSafe();

  if (isConnected && walletInfo) {
    return (
      <div className="wallet-info">
        <div className="wallet-details">
          <h3>Connected Wallet</h3>
          <div className="info-row">
            <span className="label">Address:</span>
            <span className="value address">{walletInfo.address}</span>
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
        <button onClick={disconnect} className="btn btn-secondary">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <h3>Connect Your Wallet</h3>
      <p>Connect MetaMask to get started with Safe Account Abstraction</p>
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Connecting...' : 'Connect MetaMask'}
      </button>
    </div>
  );
}
