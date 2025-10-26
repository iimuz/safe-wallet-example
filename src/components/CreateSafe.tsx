import { useState } from 'react';
import { useSafe } from '@/hooks/useSafe';

export function CreateSafe() {
  const { isConnected, isLoading, createSafe, error } = useSafe();
  const [createdAddress, setCreatedAddress] = useState<string | null>(null);

  const handleCreateSafe = async () => {
    try {
      setCreatedAddress(null);
      const address = await createSafe();
      setCreatedAddress(address);
    } catch (err) {
      console.error('Failed to create Safe:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="card">
        <h2>Create Safe Account</h2>
        <p className="warning">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Create New Safe Account</h2>
      <div className="info-box">
        <p>
          <strong>Configuration:</strong>
        </p>
        <ul>
          <li>1 Owner (your connected wallet)</li>
          <li>Threshold: 1/1 (only 1 signature required)</li>
        </ul>
      </div>

      <button
        onClick={handleCreateSafe}
        disabled={isLoading}
        className="btn btn-primary"
      >
        {isLoading ? 'Creating Safe...' : 'Create Safe Account'}
      </button>

      {createdAddress && (
        <div className="success-box">
          <h3>Safe Created Successfully!</h3>
          <div className="info-row">
            <span className="label">Safe Address:</span>
            <span className="value address">{createdAddress}</span>
          </div>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}
    </div>
  );
}
