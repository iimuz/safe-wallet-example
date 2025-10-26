import { useState } from 'react';
import { useSafe } from '@/hooks/useSafe';

export function SendTransaction() {
  const { safeInfo, isLoading, sendTransaction, error } = useSafe();
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!to.trim() || !value.trim()) {
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
      <div className="card">
        <h2>Send Transaction</h2>
        <p className="warning">Please create or connect to a Safe first</p>
      </div>
    );
  }

  const safeBalance = Number(safeInfo.balance);
  const canSendTransaction = safeBalance > 0;

  return (
    <div className="card">
      <h2>Send Transaction</h2>

      {!canSendTransaction && (
        <div className="warning-box">
          <p>
            <strong>Warning:</strong> Your Safe has 0 ETH balance.
          </p>
          <p>
            Send some ETH to your Safe address ({safeInfo.address}) before creating transactions.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="to">Recipient Address:</label>
          <input
            type="text"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="input"
            disabled={!canSendTransaction}
          />
        </div>

        <div className="form-group">
          <label htmlFor="value">Amount (ETH):</label>
          <input
            type="text"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0.1"
            className="input"
            disabled={!canSendTransaction}
          />
          <small className="form-help">
            Available: {safeBalance.toFixed(4)} ETH
          </small>
        </div>

        <button
          type="submit"
          disabled={isLoading || !canSendTransaction || !to.trim() || !value.trim()}
          className="btn btn-primary"
        >
          {isLoading ? 'Sending...' : 'Send Transaction'}
        </button>
      </form>

      {txHash && (
        <div className="success-box">
          <h3>Transaction Sent!</h3>
          <div className="info-row">
            <span className="label">Transaction Hash:</span>
            <span className="value address">{txHash}</span>
          </div>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}
    </div>
  );
}
