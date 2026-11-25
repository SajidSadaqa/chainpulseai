import React, { useState, useEffect } from 'react';
import { Card, PageHeader, Badge, LoadingState } from '../components/UI';
import { CopyableHash } from '../components/CopyableHash';
import {
  BlockchainNetworkId,
  BlockchainNetworkSummary,
  BlockchainLookupResponse,
  fetchBlockchainSummary,
  searchBlockchainTransaction,
  SAMPLE_ETH_TX_HASH,
  SAMPLE_BTC_TX_HASH,
  SAMPLE_NOT_FOUND_HASH,
  SAMPLE_PROVIDER_ERROR_HASH,
} from '../api/client';

export const BlockchainPage: React.FC = () => {
  const [network, setNetwork] = useState<BlockchainNetworkId>('ethereum');
  const [summary, setSummary] = useState<BlockchainNetworkSummary | null>(null);
  const [hashInput, setHashInput] = useState<string>(SAMPLE_ETH_TX_HASH);
  const [searching, setSearching] = useState<boolean>(false);
  const [result, setResult] = useState<BlockchainLookupResponse | null>(null);

  useEffect(() => {
    let active = true;
    const targetNet: BlockchainNetworkId = network === 'unsupported' ? 'ethereum' : network;
    fetchBlockchainSummary(targetNet).then((data) => {
      if (active) setSummary(data);
    });
    return () => {
      active = false;
    };
  }, [network]);

  const runSearch = async (targetHash: string, targetNetwork: BlockchainNetworkId) => {
    setSearching(true);
    const res = await searchBlockchainTransaction(targetHash, targetNetwork);
    setResult(res);
    setSearching(false);
  };

  useEffect(() => {
    runSearch(SAMPLE_ETH_TX_HASH, 'ethereum');
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(hashInput, network);
  };

  const applyPreset = (presetHash: string, presetNet: BlockchainNetworkId) => {
    setNetwork(presetNet);
    setHashInput(presetHash);
    runSearch(presetHash, presetNet);
  };

  const getStatusBadgeType = (status: 'Confirmed' | 'Pending' | 'Failed') => {
    if (status === 'Confirmed') return 'success';
    if (status === 'Failed') return 'error';
    return 'warning';
  };

  return (
    <div>
      <PageHeader
        title="Public Blockchain Explorer"
        subtitle="Read-only transaction lookup and network summary with clear domain labels and units."
      />

      {/* Read-Only Scope Banner */}
      <div
        role="note"
        style={{
          backgroundColor: '#ebf8ff',
          border: '1px solid #90cdf4',
          color: '#2c5282',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '18px',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span>
          <strong>Public Read-Only Explorer:</strong> واجهة لقراءة البيانات العامة فقط — لا يوجد ربط محافظ (Wallet Login) ولا إرسال معاملات ولا تخزين مفاتيح خاصة.
        </span>
        <Badge type="info" text="Read-Only Scope" />
      </div>

      {/* WEB-601: Network Selector & Summary Cards */}
      <Card
        title="ملخص الشبكة النشطة (Network Summary)"
        subtitle={
          summary
            ? `${summary.chainDescriptor} | Last Updated: ${new Date(summary.updatedAt).toLocaleTimeString()}`
            : 'Loading network telemetry...'
        }
      >
        <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <label htmlFor="network-select" style={{ fontWeight: 600, fontSize: '14px', color: '#2d3748' }}>
            اختر الشبكة (Network):
          </label>
          <select
            id="network-select"
            value={network}
            onChange={(e) => setNetwork(e.target.value as BlockchainNetworkId)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e0',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              color: '#1a202c',
            }}
          >
            <option value="ethereum">Ethereum Mainnet (ETH)</option>
            <option value="bitcoin">Bitcoin Mainnet (BTC)</option>
            <option value="unsupported">Arbitrum / Polygon (Unsupported Test)</option>
          </select>
        </div>

        {summary && (
          <div aria-label="Network Summary Metrics" className="kpi-grid" style={{ marginBottom: 0 }}>
            <div style={{ backgroundColor: '#f7fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#4a5568', fontWeight: 600 }}>Active Network</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', margin: '4px 0' }}>
                {network === 'unsupported' ? 'Unsupported Chain' : summary.networkName}
              </div>
              <div style={{ fontSize: '12px', color: '#4a5568' }}>Unit: Public Mainnet</div>
            </div>

            <div style={{ backgroundColor: '#f7fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#4a5568', fontWeight: 600 }}>Latest Block</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', margin: '4px 0' }}>
                {summary.latestBlock}
              </div>
              <div style={{ fontSize: '12px', color: '#4a5568' }}>Unit: {summary.blockUnit}</div>
            </div>

            <div style={{ backgroundColor: '#f7fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#4a5568', fontWeight: 600 }}>Network Fee Rate</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', margin: '4px 0' }}>
                {summary.baseFeeValue} {summary.baseFeeUnit}
              </div>
              <div style={{ fontSize: '12px', color: '#4a5568' }}>Unit: {summary.baseFeeUnit}</div>
            </div>

            <div style={{ backgroundColor: '#f7fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#4a5568', fontWeight: 600 }}>Throughput &amp; Sync</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c', margin: '4px 0' }}>
                {summary.throughputValue} {summary.throughputUnit}
              </div>
              <div style={{ fontSize: '12px', color: '#4a5568' }}>
                Updated: {new Date(summary.updatedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* WEB-602: Transaction Search Form */}
      <Card
        title="البحث عن معاملة عامة (Transaction Search)"
        subtitle="Enter a public transaction hash or use the quick presets below to test valid and error states"
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label htmlFor="tx-hash-input" style={{ fontSize: '14px', fontWeight: 600, color: '#2d3748' }}>
            Transaction Hash (معرّف المعاملة):
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              id="tx-hash-input"
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060"
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e0',
                fontSize: '13px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 18px',
                backgroundColor: '#2b6cb0',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Search Transaction
            </button>
          </div>
        </form>

        {/* Quick Demo Presets for Review & Error State Testing */}
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #edf2f7' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568', marginBottom: '8px' }}>
            أزرار اختبار سريعة (للمراجعة مع ماري وساجد):
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => applyPreset(SAMPLE_ETH_TX_HASH, 'ethereum')}
              style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #276749', backgroundColor: '#def7ec', color: '#03543f', cursor: 'pointer', fontWeight: 600 }}
            >
              Valid ETH Tx
            </button>
            <button
              type="button"
              onClick={() => applyPreset(SAMPLE_BTC_TX_HASH, 'bitcoin')}
              style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #276749', backgroundColor: '#def7ec', color: '#03543f', cursor: 'pointer', fontWeight: 600 }}
            >
              Valid BTC Tx
            </button>
            <button
              type="button"
              onClick={() => applyPreset('0x123_invalid_hash', 'ethereum')}
              style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #975a16', backgroundColor: '#fef3c7', color: '#92400e', cursor: 'pointer', fontWeight: 600 }}
            >
              Invalid Hash
            </button>
            <button
              type="button"
              onClick={() => applyPreset(SAMPLE_NOT_FOUND_HASH, 'ethereum')}
              style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #4a5568', backgroundColor: '#edf2f7', color: '#2d3748', cursor: 'pointer', fontWeight: 600 }}
            >
              Not Found Tx
            </button>
            <button
              type="button"
              onClick={() => applyPreset(SAMPLE_PROVIDER_ERROR_HASH, 'ethereum')}
              style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #9b2c2c', backgroundColor: '#fde8e8', color: '#9b1c1c', cursor: 'pointer', fontWeight: 600 }}
            >
              Provider Error
            </button>
            <button
              type="button"
              onClick={() => applyPreset(SAMPLE_ETH_TX_HASH, 'unsupported')}
              style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #9b2c2c', backgroundColor: '#fde8e8', color: '#9b1c1c', cursor: 'pointer', fontWeight: 600 }}
            >
              Unsupported Network
            </button>
          </div>
        </div>
      </Card>

      {searching && <LoadingState />}

      {/* WEB-603: Specific Error States */}
      {!searching && result && result.errorCode && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fff5f5',
            border: '1px solid #feb2b2',
            borderRadius: '10px',
            padding: '18px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <Badge type="error" text={result.errorCode} />
            <strong style={{ color: '#9b2c2c', fontSize: '16px' }}>{result.errorTitle}</strong>
          </div>
          <p style={{ margin: '0 0 12px 0', color: '#742a2a', fontSize: '14px' }}>{result.errorMessage}</p>
          <button
            type="button"
            onClick={() => applyPreset(SAMPLE_ETH_TX_HASH, 'ethereum')}
            style={{
              padding: '6px 14px',
              backgroundColor: '#9b2c2c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset to Valid Sample Transaction
          </button>
        </div>
      )}

      {/* WEB-602 & WEB-604: Transaction Details Result Layout */}
      {!searching && result && result.tx && (
        <Card
          title="تفاصيل المعاملة (Transaction Details)"
          subtitle={`Network: ${result.tx.networkName} | Recorded Timestamp: ${result.tx.timestampUtc}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #edf2f7', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#4a5568', fontSize: '14px' }}>Status (حالة المعاملة):</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge type={getStatusBadgeType(result.tx.status)} text={result.tx.status} />
                <span style={{ fontSize: '13px', color: '#4a5568' }}>({result.tx.confirmations} Block Confirmations)</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #edf2f7', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#4a5568', fontSize: '14px' }}>Transaction Hash:</span>
              <CopyableHash value={result.tx.hash} label="Transaction Hash" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #edf2f7', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#4a5568', fontSize: '14px' }}>Block Height (رقم البلوك):</span>
              <span style={{ fontWeight: 'bold', color: '#1a202c' }}>{result.tx.blockHeight}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #edf2f7', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#4a5568', fontSize: '14px' }}>From (المرسل):</span>
              <CopyableHash value={result.tx.fromAddress} label="Sender Address" prefixChars={8} suffixChars={6} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #edf2f7', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#4a5568', fontSize: '14px' }}>To (المستلم):</span>
              <CopyableHash value={result.tx.toAddress} label="Recipient Address" prefixChars={8} suffixChars={6} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #edf2f7', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#4a5568', fontSize: '14px' }}>Amount Transferred (المبلغ):</span>
              <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#22543d' }}>
                {result.tx.amountValue} {result.tx.amountUnit}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#4a5568', fontSize: '14px' }}>Network Fee Paid (رسوم الشبكة):</span>
              <span style={{ fontWeight: 600, color: '#2d3748' }}>
                {result.tx.feeValue} {result.tx.feeUnit}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};