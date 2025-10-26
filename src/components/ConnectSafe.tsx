import { useState } from 'react';
import { useSafe } from '@/hooks/useSafe';

export function ConnectSafe() {
  const { isConnected, isLoading, connectToSafe, error } = useSafe();
  const [safeAddress, setSafeAddress] = useState('');

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!safeAddress.trim()) {
      return;
    }

    try {
      await connectToSafe(safeAddress);
    } catch (err) {
      console.error('Failed to connect to Safe:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="card">
        <h2>Connect to Existing Safe</h2>
        <p className="warning">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Connect to Existing Safe</h2>
      <form onSubmit={handleConnect}>
        <div className="form-group">
          <label htmlFor="safeAddress">Safe Address:</label>
          <input
            type="text"
            id="safeAddress"
            value={safeAddress}
            onChange={(e) => setSafeAddress(e.target.value)}
            placeholder="0x..."
            className="input"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !safeAddress.trim()}
          className="btn btn-primary"
        >
          {isLoading ? 'Connecting...' : 'Connect to Safe'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}
    </div>
  );
}
