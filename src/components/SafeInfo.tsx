import { useSafe } from '@/hooks/useSafe';

export function SafeInfo() {
  const { safeInfo, isLoading, refreshSafeInfo } = useSafe();

  if (!safeInfo) {
    return null;
  }

  return (
    <div className="card safe-info">
      <div className="card-header">
        <h2>Safe Information</h2>
        <button
          onClick={refreshSafeInfo}
          disabled={isLoading}
          className="btn btn-small"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="info-section">
        <div className="info-row">
          <span className="label">Safe Address:</span>
          <span className="value address">{safeInfo.address}</span>
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
              <span className="address">{owner}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
