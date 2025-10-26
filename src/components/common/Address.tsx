import './Address.css';

interface AddressProps {
  value: string;
  short?: boolean;
  copyable?: boolean;
}

export function Address({ value, short = false, copyable = true }: AddressProps) {
  const displayValue = short
    ? `${value.slice(0, 6)}...${value.slice(-4)}`
    : value;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <span className="address-container">
      <code className="address">{displayValue}</code>
      {copyable && (
        <button
          onClick={handleCopy}
          className="address-copy-btn"
          title="Copy address"
          type="button"
        >
          📋
        </button>
      )}
    </span>
  );
}
