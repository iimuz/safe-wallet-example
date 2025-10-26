import { useState } from 'react';
import { useSafeContext } from '@/hooks/useSafeContext';
import { Card, Button, Input, MessageBox, Address } from '@/components/common';

export function SendTransaction() {
  const { safeInfo, isLoading, sendTransaction, error } = useSafeContext();
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    to?: string;
    value?: string;
  }>({});

  const validate = () => {
    const errors: typeof validationErrors = {};

    if (!to.trim()) {
      errors.to = 'Recipient address is required';
    } else if (!to.startsWith('0x') || to.length !== 42) {
      errors.to = 'Invalid Ethereum address format';
    }

    if (!value.trim()) {
      errors.value = 'Amount is required';
    } else if (isNaN(Number(value)) || Number(value) <= 0) {
      errors.value = 'Amount must be a positive number';
    } else if (safeInfo && Number(value) > Number(safeInfo.balance)) {
      errors.value = 'Insufficient balance';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setTxHash(null);
      const hash = await sendTransaction({ to, value });
      setTxHash(hash);
      setTo('');
      setValue('');
    } catch (err) {
      console.error('Failed to send transaction:', err);
    }
  };

  if (!safeInfo) {
    return (
      <Card title="Send Transaction">
        <MessageBox type="warning">
          Please create or connect to a Safe first
        </MessageBox>
      </Card>
    );
  }

  const safeBalance = Number(safeInfo.balance);
  const canSendTransaction = safeBalance > 0;

  return (
    <Card title="Send Transaction">
      {!canSendTransaction && (
        <MessageBox type="warning" title="Warning:">
          <p>Your Safe has 0 ETH balance.</p>
          <p>Send some ETH to your Safe address before creating transactions.</p>
        </MessageBox>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Recipient Address"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setValidationErrors((prev) => ({ ...prev, to: undefined }));
          }}
          placeholder="0x..."
          disabled={!canSendTransaction}
          error={validationErrors.to}
        />

        <Input
          label="Amount (ETH)"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setValidationErrors((prev) => ({ ...prev, value: undefined }));
          }}
          placeholder="0.1"
          disabled={!canSendTransaction}
          error={validationErrors.value}
          helperText={`Available: ${safeBalance.toFixed(4)} ETH`}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!canSendTransaction || !to.trim() || !value.trim()}
        >
          Send Transaction
        </Button>
      </form>

      {txHash && (
        <MessageBox type="success" title="Transaction Sent!">
          <div className="info-row">
            <span className="label">Transaction Hash:</span>
            <Address value={txHash} />
          </div>
        </MessageBox>
      )}

      {error && <MessageBox type="error">{error}</MessageBox>}
    </Card>
  );
}
