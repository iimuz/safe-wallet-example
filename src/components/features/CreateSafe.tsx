import { useState } from 'react';
import { useSafeContext } from '@/hooks/useSafeContext';
import { Card, Button, MessageBox, Address } from '@/components/common';

export function CreateSafe() {
  const { isWalletConnected, isLoading, createSafe, error } = useSafeContext();
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

  if (!isWalletConnected) {
    return (
      <Card title="Create Safe Account">
        <MessageBox type="warning">Please connect your wallet first</MessageBox>
      </Card>
    );
  }

  return (
    <Card title="Create New Safe Account">
      <MessageBox type="info" title="Configuration:">
        <ul>
          <li>1 Owner (your connected wallet)</li>
          <li>Threshold: 1/1 (only 1 signature required)</li>
        </ul>
      </MessageBox>

      <Button onClick={handleCreateSafe} isLoading={isLoading}>
        Create Safe Account
      </Button>

      {createdAddress && (
        <MessageBox type="success" title="Safe Created Successfully!">
          <div className="info-row">
            <span className="label">Safe Address:</span>
            <Address value={createdAddress} />
          </div>
        </MessageBox>
      )}

      {error && <MessageBox type="error">{error}</MessageBox>}
    </Card>
  );
}
