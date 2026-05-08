
// Screen 1: Home Dashboard

function DashboardScreen({ onNavigate }) {
  const metrics = [
    { label: 'Active POs', value: 14, sub: '3 pending fixation', icon: '📋' },
    { label: 'Lots Pending Delivery', value: 7, sub: '2 overdue', icon: '🏭', accent: true },
    { label: 'Open Daily Offers', value: 23, sub: 'Updated 18 min ago', icon: '☕' },
    { label: 'Open Client Reqs', value: 5, sub: '2 eligible for this mill', icon: '📌' },
    { label: 'Pending Fixation', value: 3, sub: 'Action required', icon: '⚡', accent: true },
  ];

  const activity = [
    { time: '09:42', type: 'lot',     color: '#97BE0D', msg: 'Lot #L-2025-0441 received — 312 kg, Finca La Palma' },
    { time: '09:18', type: 'offer',   color: '#0096BA', msg: 'New daily offer: Coop San Marcos — 600 kg Bourbon Natural' },
    { time: '08:55', type: 'qc',      color: '#F1562A', msg: 'QC Flag: Lot #L-2025-0438 weight discrepancy 0.8%' },
    { time: '08:30', type: 'po',      color: '#344965', msg: 'PO #PO-2025-0092 confirmed — El Paraíso Estate' },
    { time: 'Yesterday', type: 'fix', color: '#F59E0B', msg: 'Fixation order FIX-2025-0031 expired without fill' },
    { time: 'Yesterday', type: 'lot', color: '#97BE0D', msg: 'Lot #L-2025-0440 passed post-milling QC' },
  ];

  const quickActions = [
    { label: 'Log Daily Offer', variant: 'primary',   screen: 'daily-offers' },
    { label: 'Receive Lot',     variant: 'secondary', screen: 'receive-lot' },
    { label: 'Create PO',       variant: 'outline',   screen: 'po-list' },
  ];

  return (
    <PageShell title="Dashboard" breadcrumb="ElevaFinca · Café del Monte Mill">
      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
        {metrics.map((m, i) => (
          <MetricCard key={i} label={m.label} value={m.value} sub={m.sub} icon={m.icon} accent={m.accent}
            onClick={() => {
              if (i === 2) onNavigate('daily-offers');
              if (i === 0 || i === 1) onNavigate('po-list');
            }}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Recent Activity */}
        <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
          <SectionTitle>Recent Activity</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activity.map((a, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '11px 0',
                borderBottom: i < activity.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: a.color, flexShrink: 0, marginTop: 6,
                }} />
                <div style={{ flex: 1, fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{a.msg}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap', marginTop: 2 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, padding: '20px 24px' }}>
            <SectionTitle>Quick Actions</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {quickActions.map((qa, i) => (
                <ActionButton key={i} variant={qa.variant} onClick={() => onNavigate(qa.screen)}>
                  {qa.label}
                </ActionButton>
              ))}
            </div>
          </div>

          {/* ICE Summary Card */}
          <div style={{
            background: 'var(--color-primary)',
            border: '1px solid #2A3C55',
            borderRadius: 10,
            padding: '20px 24px',
            color: '#fff',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, marginBottom: 8 }}>ICE C Futures — Jul 25</div>
            <ICETicker large />
            <div style={{ marginTop: 12, fontSize: 12, opacity: 0.6 }}>NY market hours: 9:00–14:30 EST</div>
            <div style={{ marginTop: 4, fontSize: 12, opacity: 0.7 }}>
              <span style={{ color: '#97BE0D' }}>● </span>Market Open
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// Screen 2: Daily Offers List
function DailyOffersScreen({ onNavigate }) {
  const [filter, setFilter] = React.useState('ALL');
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState([]);

  const offers = [
    { id: 'DO-2025-0081', date: 'May 3', supplier: 'Finca La Palma', variety: 'Bourbon', type: 'Washed', qty: 480, unit: 'KG', diff: '+12.5', certs: ['RFA', 'Organic'], status: 'ACTIVE' },
    { id: 'DO-2025-0080', date: 'May 3', supplier: 'Coop San Marcos', variety: 'Caturra', type: 'Natural', qty: 600, unit: 'KG', diff: '+8.0', certs: ['FTO'], status: 'ACTIVE' },
    { id: 'DO-2025-0079', date: 'May 2', supplier: 'El Paraíso Estate', variety: 'Gesha', type: 'Honey', qty: 240, unit: 'KG', diff: '+22.0', certs: ['SHB', 'Organic'], status: 'ACTIVE' },
    { id: 'DO-2025-0078', date: 'May 2', supplier: 'Finca Las Nubes', variety: 'Pacamara', type: 'Washed', qty: 360, unit: 'KG', diff: '+15.0', certs: ['RFA'], status: 'CONVERTED' },
    { id: 'DO-2025-0077', date: 'May 1', supplier: 'Coop La Unión', variety: 'Typica', type: 'Natural', qty: 720, unit: 'KG', diff: '+6.5', certs: ['FTO', 'Organic'], status: 'CONVERTED' },
    { id: 'DO-2025-0076', date: 'May 1', supplier: 'Finca El Roble', variety: 'Catuai', type: 'Washed', qty: 300, unit: 'KG', diff: '+4.0', certs: [], status: 'DISMISSED' },
    { id: 'DO-2025-0075', date: 'Apr 30', supplier: 'Hacienda La Gracia', variety: 'Bourbon', type: 'Honey', qty: 540, unit: 'KG', diff: '+10.5', certs: ['SHB'], status: 'DISMISSED' },
  ];

  const filters = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Converted', value: 'CONVERTED' },
    { label: 'Dismissed', value: 'DISMISSED' },
  ];

  const filtered = offers.filter(o =>
    (filter === 'ALL' || o.status === filter) &&
    (search === '' || o.supplier.toLowerCase().includes(search.toLowerCase()) || o.variety.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelect = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const cols = [
    { label: '' },
    { label: 'ID' },
    { label: 'Date' },
    { label: 'Supplier' },
    { label: 'Variety / Type' },
    { label: 'Qty (KG)' },
    { label: 'Differential' },
    { label: 'Certifications' },
    { label: 'Status' },
    { label: 'Actions' },
  ];

  return (
    <PageShell
      title="Daily Offers"
      breadcrumb="Sourcing"
      actions={
        <>
          {selected.length > 0 && (
            <ActionButton variant="accent" small onClick={() => setSelected([])}>
              Dismiss {selected.length} selected
            </ActionButton>
          )}
          <ActionButton variant="primary" onClick={() => onNavigate('daily-offer-create')}>
            + Log Offer
          </ActionButton>
        </>
      }
    >
      <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <FilterBar filters={filters} active={filter} onChange={setFilter} />
          <div style={{ flex: 1 }} />
          <SearchInput value={search} onChange={setSearch} placeholder="Search supplier, variety…" />
          <ActionButton variant="ghost" small>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Filter
          </ActionButton>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHeader columns={cols} />
            <tbody>
              {filtered.map((offer, i) => (
                <tr key={offer.id} style={{
                  borderBottom: '1px solid #F3F4F6',
                  background: selected.includes(offer.id) ? '#EFF6FF' : i % 2 === 0 ? '#FAFAFA' : 'var(--color-white)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F0F4F9'}
                onMouseLeave={e => e.currentTarget.style.background = selected.includes(offer.id) ? '#EFF6FF' : i % 2 === 0 ? '#FAFAFA' : 'var(--color-white)'}
                >
                  <td style={{ padding: '12px 14px', width: 32 }}>
                    <input type="checkbox" checked={selected.includes(offer.id)} onChange={() => toggleSelect(offer.id)}
                      style={{ cursor: 'pointer', accentColor: 'var(--color-primary)' }} />
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#6B7280', fontFamily: "'DM Mono', monospace" }}>{offer.id}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{offer.date}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>{offer.supplier}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151' }}>
                    <span>{offer.variety}</span>
                    <span style={{ marginLeft: 6, fontSize: 11, color: '#9CA3AF', background: '#F3F4F6', padding: '2px 7px', borderRadius: 10 }}>{offer.type}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontFamily: "'DM Mono', monospace", color: '#374151' }}>{offer.qty.toLocaleString()}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontFamily: "'DM Mono', monospace", color: offer.diff.startsWith('+') ? '#97BE0D' : '#F1562A', fontWeight: 700 }}>
                    {offer.diff} ¢/lb
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {offer.certs.length === 0 ? <span style={{ color: '#D1D5DB', fontSize: 12 }}>—</span> :
                        offer.certs.map(c => <Badge key={c} color="#344965">{c}</Badge>)}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}><StatusPill status={offer.status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {offer.status === 'ACTIVE' && (
                        <>
                          <ActionButton variant="primary" small onClick={() => onNavigate('po-create')}>Convert → PO</ActionButton>
                          <ActionButton variant="ghost" small>Edit</ActionButton>
                        </>
                      )}
                      {offer.status !== 'ACTIVE' && (
                        <ActionButton variant="ghost" small>View</ActionButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Showing {filtered.length} of {offers.length} offers</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button style={{ padding: '4px 10px', border: '1px solid #E5E7EB', borderRadius: 6, background: 'var(--color-white)', fontSize: 12, cursor: 'pointer', color: '#6B7280' }}>← Prev</button>
            <span style={{ fontSize: 12, color: '#374151', padding: '0 6px' }}>Page 1 of 1</span>
            <button style={{ padding: '4px 10px', border: '1px solid #E5E7EB', borderRadius: 6, background: 'var(--color-white)', fontSize: 12, cursor: 'pointer', color: '#6B7280' }}>Next →</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// Screen 4: Purchase Orders List
function POListScreen({ onNavigate }) {
  const [filter, setFilter] = React.useState('ALL');
  const [search, setSearch] = React.useState('');

  const pos = [
    { id: 'PO-2025-0092', supplier: 'El Paraíso Estate', variety: 'Gesha Washed', qty: 1200, diff: '+22.0', fixStatus: 'PENDING', qcStatus: 'PASS', delivery: '2025-05-10', deliveryColor: 'green', status: 'CONFIRMED' },
    { id: 'PO-2025-0091', supplier: 'Finca La Palma', variety: 'Bourbon Washed', qty: 2400, diff: '+12.5', fixStatus: 'IN_PROGRESS', qcStatus: 'PENDING', delivery: '2025-05-08', deliveryColor: 'amber', status: 'CONFIRMED' },
    { id: 'PO-2025-0090', supplier: 'Coop San Marcos', variety: 'Caturra Natural', qty: 3600, diff: '+8.0', fixStatus: 'APPROVED', qcStatus: 'PASS', delivery: '2025-05-06', deliveryColor: 'red', status: 'PARTIALLY_RECEIVED' },
    { id: 'PO-2025-0089', supplier: 'Finca Las Nubes', variety: 'Pacamara Honey', qty: 960, diff: '+15.0', fixStatus: 'APPROVED', qcStatus: 'PASS', delivery: '2025-05-01', deliveryColor: 'green', status: 'FULLY_RECEIVED' },
    { id: 'PO-2025-0088', supplier: 'Hacienda La Gracia', variety: 'Bourbon Honey', qty: 1800, diff: '+10.5', fixStatus: 'PENDING', qcStatus: 'PENDING', delivery: '2025-05-15', deliveryColor: 'green', status: 'DRAFT' },
    { id: 'PO-2025-0087', supplier: 'Finca El Roble', variety: 'Catuai Washed', qty: 2100, diff: '+4.0', fixStatus: 'CANCELLED', qcStatus: 'REJECTED', delivery: '2025-04-28', deliveryColor: 'red', status: 'CANCELLED' },
  ];

  const filters = [
    { label: 'All', value: 'ALL' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'In Delivery', value: 'PARTIALLY_RECEIVED' },
    { label: 'Completed', value: 'FULLY_RECEIVED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  const filtered = pos.filter(p =>
    (filter === 'ALL' || p.status === filter) &&
    (search === '' || p.supplier.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
  );

  const cols = [
    { label: 'PO Number' },
    { label: 'Supplier' },
    { label: 'Coffee' },
    { label: 'Qty (KG)' },
    { label: 'Differential' },
    { label: 'Fixation' },
    { label: 'QC Gate' },
    { label: 'Est. Delivery' },
    { label: 'Status' },
    { label: '' },
  ];

  return (
    <PageShell
      title="Purchase Orders"
      breadcrumb="Sourcing"
      actions={
        <ActionButton variant="primary" onClick={() => onNavigate('po-create')}>+ New PO</ActionButton>
      }
    >
      <div style={{ background: 'var(--color-white)', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <FilterBar filters={filters} active={filter} onChange={setFilter} />
          <div style={{ flex: 1 }} />
          <SearchInput value={search} onChange={setSearch} placeholder="Search PO or supplier…" />
          <ActionButton variant="ghost" small>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Filter
          </ActionButton>
          <ActionButton variant="ghost" small>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M17 3H3v2l6 6v6l2-1V11l6-6V3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
            Sort
          </ActionButton>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHeader columns={cols} />
            <tbody>
              {filtered.map((po, i) => (
                <tr key={po.id} style={{
                  borderBottom: '1px solid #F3F4F6',
                  background: i % 2 === 0 ? '#FAFAFA' : 'var(--color-white)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F0F4F9'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#FAFAFA' : 'var(--color-white)'}
                onClick={() => onNavigate('po-detail', po.id)}
                >
                  <td style={{ padding: '13px 14px', fontSize: 12, fontFamily: "'DM Mono', monospace", color: 'var(--color-secondary)', fontWeight: 600 }}>{po.id}</td>
                  <td style={{ padding: '13px 14px', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>{po.supplier}</td>
                  <td style={{ padding: '13px 14px', fontSize: 13, color: '#374151' }}>{po.variety}</td>
                  <td style={{ padding: '13px 14px', fontSize: 13, fontFamily: "'DM Mono', monospace", color: '#374151' }}>{po.qty.toLocaleString()}</td>
                  <td style={{ padding: '13px 14px', fontSize: 13, fontFamily: "'DM Mono', monospace", color: '#97BE0D', fontWeight: 700 }}>{po.diff} ¢/lb</td>
                  <td style={{ padding: '13px 14px' }}><StatusPill status={po.fixStatus} /></td>
                  <td style={{ padding: '13px 14px' }}><StatusPill status={po.qcStatus} /></td>
                  <td style={{ padding: '13px 14px' }}>
                    <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                      <DeliveryIndicator status={po.deliveryColor} />
                      <span style={{ fontSize: 12, color: '#374151', fontFamily: "'DM Mono', monospace" }}>{po.delivery}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 14px' }}><StatusPill status={po.status} /></td>
                  <td style={{ padding: '13px 14px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <ActionButton variant="ghost" small onClick={() => onNavigate('po-detail', po.id)}>View</ActionButton>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 18, lineHeight: 1, padding: '2px 4px' }}>⋮</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Showing {filtered.length} of {pos.length} purchase orders</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button style={{ padding: '4px 10px', border: '1px solid #E5E7EB', borderRadius: 6, background: 'var(--color-white)', fontSize: 12, cursor: 'pointer', color: '#6B7280' }}>← Prev</button>
            <span style={{ fontSize: 12, color: '#374151', padding: '0 6px' }}>Page 1 of 1</span>
            <button style={{ padding: '4px 10px', border: '1px solid #E5E7EB', borderRadius: 6, background: 'var(--color-white)', fontSize: 12, cursor: 'pointer', color: '#6B7280' }}>Next →</button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

Object.assign(window, { DashboardScreen, DailyOffersScreen, POListScreen });
