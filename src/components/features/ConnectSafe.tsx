import { useState } from 'react';
import { useSafeContext } from '@/hooks/useSafeContext';
import { Card, Button, Input, MessageBox } from '@/components/common';

export function ConnectSafe() {
  const { isWalletConnected, isLoading, connectToSafe, error } = useSafeContext();
  const [safeAddress, setSafeAddress] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!safeAddress.trim()) {
      setValidationError('Please enter a Safe address');
      return;
    }

    if (!safeAddress.startsWith('0x') || safeAddress.length !== 42) {
      setValidationError('Invalid Ethereum address format');
      return;
    }

    setValidationError('');
    try {
      await connectToSafe(safeAddress);
    } catch (err) {
      console.error('Failed to connect to Safe:', err);
    }
  };

  if (!isWalletConnected) {
    return (
      <Card title="Connect to Existing Safe">
        <MessageBox type="warning">Please connect your wallet first</MessageBox>
      </Card>
    );
  }

  return (
    <Card title="Connect to Existing Safe">
      <form onSubmit={handleConnect}>
        <Input
          label="Safe Address"
          value={safeAddress}
          onChange={(e) => {
            setSafeAddress(e.target.value);
            setValidationError('');
          }}
          placeholder="0x..."
          error={validationError}
        />
        <Button type="submit" isLoading={isLoading} disabled={!safeAddress.trim()}>
          Connect to Safe
        </Button>
      </form>

      {error && <MessageBox type="error">{error}</MessageBox>}
    </Card>
  );
}
