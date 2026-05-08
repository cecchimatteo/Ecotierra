
// Shared utilities, status pills, and small components

const STATUS_CONFIG = {
  AVAILABLE:   { label: 'Available',   bg: '#97BE0D', color: '#fff' },
  PASS:        { label: 'Pass',        bg: '#97BE0D', color: '#fff' },
  APPROVED:    { label: 'Approved',    bg: '#97BE0D', color: '#fff' },
  PENDING:     { label: 'Pending',     bg: '#0096BA', color: '#fff' },
  IN_PROGRESS: { label: 'In Progress', bg: '#0096BA', color: '#fff' },
  AT_RISK:     { label: 'At Risk',     bg: '#F1562A', color: '#fff' },
  OVERDUE:     { label: 'Overdue',     bg: '#F1562A', color: '#fff' },
  REJECTED:    { label: 'Rejected',    bg: '#F1562A', color: '#fff' },
  CANCELLED:   { label: 'Cancelled',   bg: '#9CA3AF', color: '#fff' },
  DRAFT:       { label: 'Draft',       bg: '#9CA3AF', color: '#fff' },
  CONFIRMED:   { label: 'Confirmed',   bg: '#344965', color: '#fff' },
  ACTIVE:      { label: 'Active',      bg: '#97BE0D', color: '#fff' },
  CONVERTED:   { label: 'Converted',   bg: '#344965', color: '#fff' },
  DISMISSED:   { label: 'Dismissed',   bg: '#9CA3AF', color: '#fff' },
  PARTIALLY_RECEIVED: { label: 'Part. Received', bg: '#0096BA', color: '#fff' },
  FULLY_RECEIVED:     { label: 'Fully Received',  bg: '#97BE0D', color: '#fff' },
};

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: '#9CA3AF', color: '#fff' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 9px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.03em',
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
    }}>{cfg.label}</span>
  );
}

function DeliveryIndicator({ status }) {
  // green = on track, amber = at risk, red = overdue
  const colors = { green: '#97BE0D', amber: '#F59E0B', red: '#F1562A' };
  const c = colors[status] || colors.green;
  return (
    <span style={{
      display: 'inline-block', width: 10, height: 10,
      borderRadius: '50%', background: c, flexShrink: 0,
    }} />
  );
}

function Badge({ children, color = '#0096BA' }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '1px 7px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      background: color + '1A',
      color: color,
      border: `1px solid ${color}33`,
    }}>{children}</span>
  );
}

function MetricCard({ label, value, sub, icon, accent = false, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--color-white)',
      border: '1px solid #E5E7EB',
      borderRadius: 10,
      padding: '18px 20px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow 0.15s',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}
    onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = '0 4px 16px rgba(52,73,101,0.10)')}
    onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        {icon && <span style={{ fontSize: 18, opacity: 0.5 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: accent ? 'var(--color-accent)' : 'var(--color-primary)', fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#9CA3AF' }}>{sub}</div>}
    </div>
  );
}

function TableHeader({ columns }) {
  return (
    <thead>
      <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
        {columns.map((col, i) => (
          <th key={i} style={{
            padding: '10px 14px',
            textAlign: col.right ? 'right' : 'left',
            fontSize: 11,
            fontWeight: 700,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            whiteSpace: 'nowrap',
            background: 'var(--color-white)',
          }}>{col.label}</th>
        ))}
      </tr>
    </thead>
  );
}

function FilterBar({ filters, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {filters.map(f => (
        <button key={f.value} onClick={() => onChange(f.value)} style={{
          padding: '5px 13px',
          borderRadius: 20,
          border: '1.5px solid',
          borderColor: active === f.value ? 'var(--color-primary)' : '#D1D5DB',
          background: active === f.value ? 'var(--color-primary)' : 'transparent',
          color: active === f.value ? '#fff' : '#6B7280',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}>{f.label}</button>
      ))}
    </div>
  );
}

function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <svg style={{ position: 'absolute', left: 10, opacity: 0.4 }} width="15" height="15" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="7" stroke="#344965" strokeWidth="2"/>
        <path d="M15 15l3 3" stroke="#344965" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
          border: '1.5px solid #D1D5DB',
          borderRadius: 8,
          fontSize: 13,
          outline: 'none',
          width: 220,
          background: 'var(--color-white)',
          color: 'var(--color-text)',
        }}
      />
    </div>
  );
}

function ActionButton({ children, variant = 'primary', onClick, small, disabled }) {
  const base = {
    padding: small ? '6px 14px' : '8px 18px',
    borderRadius: 8,
    fontSize: small ? 12 : 13,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all 0.15s',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex', alignItems: 'center', gap: 6,
  };
  const variants = {
    primary:   { background: 'var(--color-primary)', color: '#fff' },
    secondary: { background: 'var(--color-secondary)', color: '#fff' },
    outline:   { background: 'transparent', color: 'var(--color-primary)', border: '1.5px solid var(--color-primary)' },
    ghost:     { background: 'transparent', color: '#6B7280', border: '1.5px solid #D1D5DB' },
    accent:    { background: 'var(--color-accent)', color: '#fff' },
  };
  return (
    <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...variants[variant] }}>{children}</button>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{children}</h2>
      {action}
    </div>
  );
}

function PageShell({ title, breadcrumb, actions, children }) {
  return (
    <div style={{ padding: '28px 32px', minHeight: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          {breadcrumb && <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>{breadcrumb}</div>}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>{title}</h1>
        </div>
        {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}

Object.assign(window, {
  StatusPill, DeliveryIndicator, Badge, MetricCard,
  TableHeader, FilterBar, SearchInput, ActionButton,
  SectionTitle, PageShell, STATUS_CONFIG,
});
