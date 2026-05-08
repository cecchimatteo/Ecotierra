
// Screen 5: Purchase Order Detail View
function PODetailScreen({ poId, onNavigate }) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [showAudit, setShowAudit] = React.useState(false);

  const po = {
    id: poId || 'PO-2025-0092',
    supplier: 'El Paraíso Estate',
    status: 'CONFIRMED',
    fixStatus: 'IN_PROGRESS',
    variety: 'Gesha',
    type: 'Washed',
    qty: 1200,
    unit: 'KG',
    diff: '+22.0',
    futures: 'ICE Jul-25',
    delivery: '2025-05-10',
    qcStatus: 'PASS',
    certs: ['Organic', 'SHB'],
    allIn: null, // calculated live
  };

  const fixHistory = [
    { id: 'FIX-2025-0031', type: 'GTC', level: '385.50', status: 'EXPIRED', ts: 'Apr 28 14:02', vol: 0, price: null },
    { id: 'FIX-2025-0029', type: 'Market', level: '—', status: 'APPROVED', ts: 'Apr 22 09:18', vol: 600, price: '381.25' },
  ];

  const lots = [
    { id: 'L-2025-0441', date: 'May 3', weight: 312, qc: 'PASS', stage: 'Milling' },
    { id: 'L-2025-0440', date: 'Apr 29', weight: 288, qc: 'PASS', stage: 'Warehoused' },
  ];

  const gateChecks = [
    { label: 'Contract signed & uploaded', done: true },
    { label: 'Supplier banking verified', done: true },
    { label: 'QC gate: Receiving QC passed', done: true },
    { label: 'Min. volume threshold met (≥ 1 lot)', done: true },
    { label: 'Invoice issued (≥ 1 linked invoice)', done: false },
    { label: 'NY market hours — fixation window open', done: false },
  ];

  const allGatesPassed = gateChecks.every(g => g.done);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'fixation', label: 'Fixation' },
    { id: 'lots', label: 'Lots' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <PageShell
      title={po.id}
      breadcrumb={<span style={{ cursor: 'pointer', color: 'var(--color-secondary)' }} onClick={() => onNavigate('po-list')}>← Purchase Orders</span>}
      actions={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <StatusPill status={po.status} />
          <ActionButton variant="ghost" small>Print / PDF</ActionButton>
          <ActionButton variant="secondary" small onClick={() => onNavigate('receive-lot')}>Receive Lot</ActionButton>
        </div>
      }
    >
      {/* Header summary strip */}
      <div style={{
        background: 'var(--color-primary)',
        borderRadius: 10,
        padding: '16px 24px',
        display: 'flex', gap: 32, flexWrap: 'wrap',
        marginBottom: 20, color: '#fff',
      }}>
        {[
          { label: 'Supplier', val: po.supplier },
          { label: 'Coffee', val: `${po.variety} ${po.type}` },
          { label: 'Volume', val: `${po.qty.toLocaleString()} KG` },
          { label: 'Buying Diff.', val: `${po.diff} ¢/lb` },
          { label: 'Futures', val: po.futures },
          { label: 'Est. Delivery', val: po.delivery },
        ].map((item, i) => (
          <div key={i}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.55, marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, fontFamily: i >= 2 ? "'DM Mono', monospace" : 'inherit' }}>{item.val}</div>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.55, marginBottom: 3 }}>All-In Price Today</div>
          <AllInPriceDisplay diff={22.0} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #E5E7EB', marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '10px 20px',
            fontSize: 13, fontWeight: 600,
            border: 'none', background: 'none',
            borderBottom: activeTab === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === t.id ? 'var(--color-primary)' : '#9CA3AF',
            cursor: 'pointer',
            marginBottom: -2,
            transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Contract Terms */}
            <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
              <SectionTitle>Contract Terms</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Buying Differential', val: `${po.diff} ¢/lb`, mono: true },
                  { label: 'Futures Contract', val: po.futures },
                  { label: 'Expected Delivery', val: po.delivery, mono: true },
                  { label: 'Quality Spec', val: 'SHB EP, SC 15+' },
                  { label: 'Certifications', val: po.certs.join(', ') },
                  { label: 'QC Gate Status', val: <StatusPill status={po.qcStatus} /> },
                ].map((row, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{row.label}</div>
                    <div style={{ fontSize: 14, color: '#111827', fontWeight: 500, fontFamily: row.mono ? "'DM Mono', monospace" : 'inherit' }}>{row.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Lots */}
            <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
              <SectionTitle action={<ActionButton variant="secondary" small onClick={() => onNavigate('receive-lot')}>+ Receive Lot</ActionButton>}>Linked Lots</SectionTitle>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <TableHeader columns={[{ label: 'Lot ID' }, { label: 'Date' }, { label: 'Weight (KG)' }, { label: 'QC' }, { label: 'Stage' }]} />
                <tbody>
                  {lots.map((lot, i) => (
                    <tr key={lot.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '10px 14px', fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--color-secondary)' }}>{lot.id}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13 }}>{lot.date}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{lot.weight}</td>
                      <td style={{ padding: '10px 14px' }}><StatusPill status={lot.qc} /></td>
                      <td style={{ padding: '10px 14px', fontSize: 13, color: '#374151' }}>{lot.stage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column: Gate + fixation summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
              <SectionTitle>Fixation Gate</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {gateChecks.map((g, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, lineHeight: 1.2, flexShrink: 0, color: g.done ? '#97BE0D' : '#D1D5DB' }}>
                      {g.done ? '✓' : '○'}
                    </span>
                    <span style={{ fontSize: 13, color: g.done ? '#374151' : '#9CA3AF', lineHeight: 1.4 }}>{g.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <ActionButton
                  variant="primary"
                  disabled={!allGatesPassed}
                  onClick={() => !allGatesPassed ? null : onNavigate('fixation')}
                >
                  Request Fixation
                </ActionButton>
                {!allGatesPassed && (
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>
                    ⚠ Complete all gate conditions to enable fixation submission.
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
              <SectionTitle>Fixation Summary</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Total Fixed', val: '600 KG' },
                  { label: 'Unfixed Balance', val: '600 KG' },
                  { label: 'Weighted Avg. Price', val: '381.25 ¢/lb' },
                  { label: 'Fixed %', val: '50%' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: 'var(--color-primary)' }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fixation' && (
        <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '24px' }}>
          <SectionTitle>Fixation History</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHeader columns={[
              { label: 'Fix ID' }, { label: 'Order Type' }, { label: 'Level' },
              { label: 'Status' }, { label: 'Volume Fixed (KG)' }, { label: 'Price (¢/lb)' }, { label: 'Timestamp' },
            ]} />
            <tbody>
              {fixHistory.map((fix, i) => (
                <tr key={fix.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 14px', fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--color-secondary)' }}>{fix.id}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13 }}>{fix.type}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{fix.level}</td>
                  <td style={{ padding: '12px 14px' }}><StatusPill status={fix.status} /></td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{fix.vol > 0 ? fix.vol : '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{fix.price || '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#9CA3AF' }}>{fix.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'lots' && (
        <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '24px' }}>
          <SectionTitle action={<ActionButton variant="secondary" small onClick={() => onNavigate('receive-lot')}>+ Receive Lot</ActionButton>}>
            Lots ({lots.length})
          </SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHeader columns={[{ label: 'Lot ID' }, { label: 'Received' }, { label: 'Weight (KG)' }, { label: 'QC' }, { label: 'Processing Stage' }, { label: '' }]} />
            <tbody>
              {lots.map((lot, i) => (
                <tr key={lot.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 14px', fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--color-secondary)' }}>{lot.id}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13 }}>{lot.date}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{lot.weight}</td>
                  <td style={{ padding: '12px 14px' }}><StatusPill status={lot.qc} /></td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>{lot.stage}</td>
                  <td style={{ padding: '12px 14px' }}><ActionButton variant="ghost" small>View Lot</ActionButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'documents' && (
        <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '24px' }}>
          <SectionTitle action={<ActionButton variant="outline" small>+ Upload Document</ActionButton>}>Documents</SectionTitle>
          {[
            { name: 'Signed Contract — El Paraíso Estate.pdf', type: 'Contract', date: 'Apr 20', size: '284 KB' },
            { name: 'Quality Spec Sheet.pdf', type: 'QC Spec', date: 'Apr 20', size: '112 KB' },
            { name: 'Receiving Report L-2025-0441.pdf', type: 'Receiving', date: 'May 3', size: '64 KB' },
          ].map((doc, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontSize: 20 }}>📄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{doc.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{doc.type} · {doc.date} · {doc.size}</div>
              </div>
              <ActionButton variant="ghost" small>Download</ActionButton>
            </div>
          ))}
        </div>
      )}

      {/* Audit trail */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowAudit(v => !v)} style={{
          fontSize: 12, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', gap: 6, alignItems: 'center',
        }}>
          <span style={{ transform: showAudit ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▶</span>
          Audit Trail ({showAudit ? 'hide' : 'show'})
        </button>
        {showAudit && (
          <div style={{ marginTop: 10, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '16px 20px' }}>
            {[
              { ts: 'May 3, 09:42', user: 'M. Santos', action: 'Lot L-2025-0441 received and linked to PO' },
              { ts: 'Apr 29, 14:15', user: 'M. Santos', action: 'Lot L-2025-0440 received and linked to PO' },
              { ts: 'Apr 28, 14:02', user: 'M. Santos', action: 'Fixation order FIX-2025-0031 submitted (GTC @ 385.50)' },
              { ts: 'Apr 22, 09:18', user: 'M. Santos', action: 'Fixation order FIX-2025-0029 filled (Market @ 381.25), 600 KG' },
              { ts: 'Apr 20, 11:30', user: 'A. Morales', action: 'PO confirmed and contract uploaded' },
            ].map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: 12 }}>
                <span style={{ color: '#9CA3AF', whiteSpace: 'nowrap', fontFamily: "'DM Mono', monospace", minWidth: 120 }}>{entry.ts}</span>
                <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>{entry.user}</span>
                <span style={{ color: '#374151' }}>{entry.action}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

// Live all-in price calculator using ICE ticker
function AllInPriceDisplay({ diff }) {
  const [ice, setIce] = React.useState(null);
  React.useEffect(() => {
    const handler = (e) => { if (e.detail && e.detail.price) setIce(e.detail.price); };
    window.addEventListener('ice-price-update', handler);
    return () => window.removeEventListener('ice-price-update', handler);
  }, []);
  const allIn = ice ? (ice + diff).toFixed(2) : '—';
  return (
    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: '#fff' }}>
      {ice ? `${allIn} ¢/lb` : 'Loading…'}
      {ice && <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 8 }}>({ice.toFixed(2)} + {diff})</span>}
    </div>
  );
}

// Screen 7: Receive Lot Form
function ReceiveLotScreen({ onNavigate }) {
  const [form, setForm] = React.useState({
    poRef: 'PO-2025-0092',
    truckWeight: '',
    millWeight: '',
    humidity: '',
    waterActivity: '',
    condition: 'GOOD',
    variety: 'Gesha',
    type: 'Washed',
    bagType: 'GrainPro',
    marking: 'EF-GL-2025',
    moistureTarget: '11.5',
    notes: '',
  });
  const [photos, setPhotos] = React.useState([]);
  const [submitted, setSubmitted] = React.useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const truckW = parseFloat(form.truckWeight) || 0;
  const millW = parseFloat(form.millWeight) || 0;
  const discrepancy = truckW && millW ? Math.abs((truckW - millW) / truckW * 100) : null;
  const hasDiscrepancyFlag = discrepancy !== null && discrepancy > 0.5;

  const conditions = ['GOOD', 'FAIR', 'DAMAGED', 'REJECTED'];

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid #D1D5DB', borderRadius: 8,
    fontSize: 13, outline: 'none',
    background: 'var(--color-white)', color: 'var(--color-text)',
    boxSizing: 'border-box',
  };

  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

  if (submitted) {
    return (
      <PageShell title="Lot Received" breadcrumb={<span style={{ cursor: 'pointer', color: 'var(--color-secondary)' }} onClick={() => onNavigate('po-detail')}>← PO-2025-0092</span>}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 18 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#97BE0D22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)' }}>Lot Received Successfully</div>
          <div style={{ fontSize: 14, color: '#6B7280' }}>Lot <strong>L-2025-0442</strong> has been recorded and linked to PO-2025-0092.</div>
          {hasDiscrepancyFlag && (
            <div style={{ padding: '12px 20px', background: '#FEF3C7', border: '1.5px solid #F59E0B', borderRadius: 8, fontSize: 13, color: '#92400E', maxWidth: 400, textAlign: 'center' }}>
              ⚠ Weight discrepancy of {discrepancy.toFixed(2)}% was flagged and logged. Review before processing.
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <ActionButton variant="primary" onClick={() => onNavigate('po-detail')}>View PO</ActionButton>
            <ActionButton variant="ghost" onClick={() => { setSubmitted(false); setForm(f => ({ ...f, truckWeight: '', millWeight: '', humidity: '', waterActivity: '', notes: '' })); }}>Receive Another Lot</ActionButton>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Receive Lot"
      breadcrumb={<span style={{ cursor: 'pointer', color: 'var(--color-secondary)' }} onClick={() => onNavigate('po-detail')}>← PO-2025-0092</span>}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <ActionButton variant="ghost" small>Save Draft</ActionButton>
          <ActionButton variant="primary" onClick={() => setSubmitted(true)}>Submit Receipt</ActionButton>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* PO Reference */}
          <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
            <SectionTitle>PO Reference</SectionTitle>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Purchase Order</label>
                <input value={form.poRef} readOnly style={{ ...inputStyle, background: '#F9FAFB', color: '#6B7280', cursor: 'not-allowed' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Supplier</label>
                <input value="El Paraíso Estate" readOnly style={{ ...inputStyle, background: '#F9FAFB', color: '#6B7280', cursor: 'not-allowed' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Coffee</label>
                <input value="Gesha Washed" readOnly style={{ ...inputStyle, background: '#F9FAFB', color: '#6B7280', cursor: 'not-allowed' }} />
              </div>
            </div>
          </div>

          {/* Weights */}
          <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
            <SectionTitle>Weight Entry</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 14, alignItems: 'end' }}>
              <div>
                <label style={labelStyle}>Truck Weight (KG)</label>
                <input type="number" value={form.truckWeight} onChange={e => set('truckWeight', e.target.value)}
                  placeholder="e.g. 315.0" style={{ ...inputStyle, fontFamily: "'DM Mono', monospace" }} />
              </div>
              <div>
                <label style={labelStyle}>Mill Weight (KG)</label>
                <input type="number" value={form.millWeight} onChange={e => set('millWeight', e.target.value)}
                  placeholder="e.g. 312.0" style={{ ...inputStyle, fontFamily: "'DM Mono', monospace" }} />
              </div>
              <div style={{ paddingBottom: 2 }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: hasDiscrepancyFlag ? '#FEF3C7' : discrepancy !== null ? '#F0FDF4' : '#F3F4F6',
                  border: `1.5px solid ${hasDiscrepancyFlag ? '#F59E0B' : discrepancy !== null ? '#97BE0D' : '#E5E7EB'}`,
                  minWidth: 120,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', letterSpacing: '0.06em', marginBottom: 3 }}>Discrepancy</div>
                  <div style={{
                    fontSize: 18, fontWeight: 700, fontFamily: "'DM Mono', monospace",
                    color: hasDiscrepancyFlag ? '#92400E' : discrepancy !== null ? '#97BE0D' : '#9CA3AF',
                  }}>
                    {discrepancy !== null ? `${discrepancy.toFixed(2)}%` : '—'}
                  </div>
                </div>
              </div>
            </div>
            {hasDiscrepancyFlag && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF3C7', border: '1.5px solid #F59E0B', borderRadius: 8, fontSize: 13, color: '#92400E', display: 'flex', gap: 8 }}>
                <span>⚠</span>
                <span>Weight discrepancy exceeds 0.5% threshold. This will be flagged for supervisor review. Please add notes below.</span>
              </div>
            )}
          </div>

          {/* Quality on Arrival */}
          <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
            <SectionTitle>Quality on Arrival</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Humidity (%)</label>
                <input type="number" value={form.humidity} onChange={e => set('humidity', e.target.value)}
                  placeholder="e.g. 12.5" step="0.1" style={{ ...inputStyle, fontFamily: "'DM Mono', monospace" }} />
              </div>
              <div>
                <label style={labelStyle}>Water Activity (Aw)</label>
                <input type="number" value={form.waterActivity} onChange={e => set('waterActivity', e.target.value)}
                  placeholder="e.g. 0.62" step="0.01" style={{ ...inputStyle, fontFamily: "'DM Mono', monospace" }} />
              </div>
              <div>
                <label style={labelStyle}>Condition on Arrival</label>
                <select value={form.condition} onChange={e => set('condition', e.target.value)} style={{ ...inputStyle }}>
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Variety Confirmation</label>
                <input value={form.variety} onChange={e => set('variety', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Processing Type</label>
                <input value={form.type} onChange={e => set('type', e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
            <SectionTitle>Receiving Notes</SectionTitle>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder={hasDiscrepancyFlag ? "Required: explain weight discrepancy…" : "Optional notes about this delivery…"}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5,
                borderColor: hasDiscrepancyFlag && !form.notes ? '#F1562A' : '#D1D5DB' }}
            />
            {hasDiscrepancyFlag && !form.notes && (
              <div style={{ fontSize: 12, color: '#F1562A', marginTop: 4 }}>Notes are required when weight discrepancy exceeds threshold.</div>
            )}
          </div>
        </div>

        {/* Right column: Processing Instructions + Photo Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
            <SectionTitle>Processing Instructions</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Bag Type', key: 'bagType', val: form.bagType },
                { label: 'Lot Marking', key: 'marking', val: form.marking },
                { label: 'Moisture Target (%)', key: 'moistureTarget', val: form.moistureTarget },
              ].map(row => (
                <div key={row.key}>
                  <label style={labelStyle}>{row.label}</label>
                  <input value={row.val} onChange={e => set(row.key, e.target.value)} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
            <SectionTitle>Photos</SectionTitle>
            <div style={{
              border: '2px dashed #D1D5DB', borderRadius: 8, padding: '28px 16px',
              textAlign: 'center', cursor: 'pointer', color: '#9CA3AF',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}
            onClick={() => setPhotos(p => [...p, `Photo ${p.length + 1}`])}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Tap to add photos</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>JPG, PNG · Max 10 MB each</div>
            </div>
            {photos.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {photos.map((p, i) => (
                  <div key={i} style={{
                    width: 60, height: 60, borderRadius: 8, background: '#F3F4F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: '#9CA3AF', border: '1px solid #E5E7EB',
                    position: 'relative',
                  }}>
                    <span style={{ fontSize: 20 }}>🖼</span>
                    <button onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))} style={{
                      position: 'absolute', top: -6, right: -6, background: '#F1562A', border: 'none',
                      color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#F0F4F9', border: '1px solid #D1D5DB', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Ready to Submit?</div>
            <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, marginBottom: 12 }}>
              Submitting will create a new lot record and notify the QC team. This action cannot be undone.
            </div>
            <ActionButton variant="primary" onClick={() => setSubmitted(true)}>Submit Receipt</ActionButton>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

Object.assign(window, { PODetailScreen, ReceiveLotScreen, AllInPriceDisplay });
