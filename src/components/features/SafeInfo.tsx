import { useSafeContext } from '@/hooks/useSafeContext';
import { Card, Button, Address } from '@/components/common';

export function SafeInfo() {
  const { safeInfo, isLoading, refreshSafeInfo } = useSafeContext();

  if (!safeInfo) {
    return null;
  }

  return (
    <Card
      title="Safe Information"
      action={
        <Button
          size="small"
          variant="ghost"
          onClick={refreshSafeInfo}
          isLoading={isLoading}
        >
          {isLoading ? 'Refreshing...' : '🔄 Refresh'}
        </Button>
      }
    >
      <div className="info-section">
        <div className="info-row">
          <span className="label">Safe Address:</span>
          <Address value={safeInfo.address} />
        </div>

        <div className="info-row">
          <span className="label">Balance:</span>
          <span className="value balance">{Number(safeInfo.balance).toFixed(4)} ETH</span>
        </div>

        <div className="info-row">
          <span className="label">Nonce:</span>
          <span className="value">{safeInfo.nonce}</span>
        </div>

        <div className="info-row">
          <span className="label">Threshold:</span>
          <span className="value">
            {safeInfo.threshold}/{safeInfo.owners.length}
          </span>
        </div>
      </div>

      <div className="info-section">
        <h3>Owners ({safeInfo.owners.length})</h3>
        <ul className="owners-list">
          {safeInfo.owners.map((owner, index) => (
            <li key={owner}>
              <span className="owner-index">{index + 1}.</span>
              <Address value={owner} short />
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
