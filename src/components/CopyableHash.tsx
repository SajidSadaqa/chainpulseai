import React, { useState } from 'react';

interface CopyableHashProps {
  value: string;
  label: string;
  prefixChars?: number;
  suffixChars?: number;
}

export const CopyableHash: React.FC<CopyableHashProps> = ({
  value,
  label,
  prefixChars = 10,
  suffixChars = 8,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isLong = value.length > prefixChars + suffixChars + 3;
  const displayValue =
    expanded || !isLong
      ? value
      : `${value.slice(0, prefixChars)}...${value.slice(-suffixChars)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
      }}
    >
      <code
        title={value}
        style={{
          backgroundColor: '#edf2f7',
          color: '#1a202c',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '13px',
          wordBreak: 'break-all',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}
      >
        {displayValue}
      </code>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy full ${label}`}
        style={{
          padding: '4px 10px',
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '6px',
          border: '1px solid #cbd5e0',
          backgroundColor: copied ? '#276749' : '#ffffff',
          color: copied ? '#ffffff' : '#2d3748',
          cursor: 'pointer',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label={expanded ? `Truncate ${label}` : `Show full ${label}`}
          style={{
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f7fafc',
            color: '#2b6cb0',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {expanded ? 'Shorten' : 'Full'}
        </button>
      )}
    </div>
  );
};