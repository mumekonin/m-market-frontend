import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { SkeletonOrderCard } from '../components/Skeletons';
import '../styles/Auth.css';
import '../styles/MyOrders.css';

const SERVER_URL = 'https://m-market-2.onrender.com';

function statusClass(s) {
  const map = { pending: 'badge-pending', paid: 'badge-paid', shipped: 'badge-shipped', cancelled: 'badge-cancelled' };
  return map[s?.toLowerCase()] || 'badge-default';
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function fmtId(id) {
  const s = (id || '').toString();
  return s.length > 16 ? `${s.slice(0, 8)}…${s.slice(-5)}` : s;
}

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  // Filter & sort state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');


  useEffect(() => { loadMyOrders(); }, []);

  async function loadMyOrders() {
    const token = localStorage.getItem('userToken');
    setLoading(true);
    setError('');

    if (!token) { setOrders('noauth'); setLoading(false); return; }

    try {
      const res = await fetch(`${SERVER_URL}/orders/myOrder`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('userToken');
        setOrders('expired');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${res.status}`);
      }
      const data = await res.json();
      setOrders(data);

      const pending = data.filter(o => o.status?.toLowerCase() === 'pending').length;
      const shipped = data.filter(o => o.status?.toLowerCase() === 'shipped').length;
      const spent = data.reduce((sum, o) => sum + ((o.productId?.price || 0) * (o.quantity || 1)), 0);
      setStats({ total: data.length, pending, shipped, spent });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Filtered + sorted orders
  const displayedOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    let result = [...orders];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        (o.productId?.proName || '').toLowerCase().includes(q) ||
        (o.productId?.category || '').toLowerCase().includes(q) ||
        (o.status || '').toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(o => (o.status || '').toLowerCase() === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'price-high') return ((b.productId?.price || 0) * (b.quantity || 1)) - ((a.productId?.price || 0) * (a.quantity || 1));
      if (sortBy === 'price-low') return ((a.productId?.price || 0) * (a.quantity || 1)) - ((b.productId?.price || 0) * (b.quantity || 1));
      return 0;
    });

    return result;
  }, [orders, search, statusFilter, sortBy]);

  const filterChips = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'paid', label: 'Paid' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const chipActiveClass = (key) => {
    if (key === statusFilter) {
      const map = { all: 'active', pending: 'active', shipped: 'active-shipped', paid: 'active-paid', cancelled: 'active-cancelled' };
      return 'filter-chip ' + (map[key] || 'active');
    }
    return 'filter-chip';
  };

  const renderContent = () => {
    if (loading) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1,2,3].map(i => <SkeletonOrderCard key={i} />)}
      </div>
    );

    if (orders === 'noauth') return (
      <div className="mo-state">
        <span className="material-symbols-outlined mo-state-icon">lock</span>
        <div className="mo-state-title">You're not logged in</div>
        <div className="mo-state-desc">Please log in to view your orders</div>
        <Link to="/login" className="mo-state-btn">Log In</Link>
      </div>
    );

    if (orders === 'expired') return (
      <div className="mo-state">
        <span className="material-symbols-outlined mo-state-icon">timer_off</span>
        <div className="mo-state-title">Session expired</div>
        <div className="mo-state-desc">Please log in again to continue</div>
        <Link to="/login" className="mo-state-btn">Log In</Link>
      </div>
    );

    if (error) return (
      <>
        <div className="mo-error-banner">
          <span className="material-symbols-outlined">error</span> {error}
        </div>
        <div className="mo-state">
          <div className="mo-state-desc">Check your connection and try again</div>
          <button className="mo-state-btn" onClick={loadMyOrders}>Retry</button>
        </div>
      </>
    );

    if (!orders || orders.length === 0) return (
      <div className="mo-state">
        <span className="material-symbols-outlined mo-state-icon">inventory_2</span>
        <div className="mo-state-title">No orders yet</div>
        <div className="mo-state-desc">Your orders will appear here once you make a purchase</div>
        <Link to="/" className="mo-state-btn">Start Shopping</Link>
      </div>
    );

    return (
      <>
        {/* Controls */}
        <div className="orders-controls">
          <div className="mo-search-wrap">
            <span className="material-symbols-outlined mo-search-icon">search</span>
            <input
              className="orders-search-input"
              type="text"
              placeholder="Search by product, category or status…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="orders-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High → Low</option>
            <option value="price-low">Price: Low → High</option>
          </select>
        </div>

        {/* Filter chips */}
        <div className="filter-chips">
          {filterChips.map(({ key, label }) => (
            <button key={key} className={chipActiveClass(key)} onClick={() => setStatusFilter(key)}>
              {label}
              {key !== 'all' && Array.isArray(orders) && (
                <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                  ({orders.filter(o => (o.status || '').toLowerCase() === key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="orders-count">
          Showing {displayedOrders.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>

        {displayedOrders.length === 0 ? (
          <div className="mo-state">
            <span className="material-symbols-outlined mo-state-icon">search_off</span>
            <p className="mo-state-title">No orders match your filter</p>
            <small className="mo-state-desc">Try a different status or clear your search</small>
          </div>
        ) : (
          <div className="orders-list">
            {displayedOrders.map((order, i) => {
              const p = order.productId || {};
              const img = p.imageUrl ? `${SERVER_URL}/${p.imageUrl.replace(/\\/g, '/').replace(/^\/+/, '')}` : null;
              const qty = order.quantity || 1;
              const total = ((p.price || 0) * qty).toFixed(2);
              const st = order.status || 'unknown';

              return (
                <div className="order-card" key={order._id || i} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="card-head">
                    <div className="card-head-left">
                      <span className="material-symbols-outlined" style={{fontSize:'15px',color:'#f3a81c'}}>receipt_long</span>
                      <span className="card-id-lbl">Order</span>
                      <span className="card-id-val">#{fmtId(order._id || order.id)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span className="card-date">
                        <span className="material-symbols-outlined" style={{fontSize:'13px',marginRight:'3px'}}>calendar_today</span>
                        {fmtDate(order.createdAt)}
                      </span>
                      <span className={`status-badge ${statusClass(st)}`}>{st}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-img">
                      {img ? (
                        <>
                          <img src={img} alt={p.proName || 'Product'}
                            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                          <div className="card-img-placeholder" style={{display:'none'}}>
                            <span className="material-symbols-outlined">inventory_2</span>
                          </div>
                        </>
                      ) : (
                        <div className="card-img-placeholder">
                          <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                      )}
                    </div>
                    <div className="card-info">
                      <div className="card-product-name">{p.proName || 'Product Unavailable'}</div>
                      <div className="card-meta">
                        {p.category && (
                          <div className="meta-tag">
                            <span className="material-symbols-outlined">category</span>{p.category}
                          </div>
                        )}
                        {p.color && (
                          <div className="meta-tag">
                            <span className="material-symbols-outlined">palette</span>{p.color}
                          </div>
                        )}
                        {p.storage && (
                          <div className="meta-tag">
                            <span className="material-symbols-outlined">hard_drive</span>{p.storage}
                          </div>
                        )}
                        <div className="meta-tag">
                          <span className="material-symbols-outlined">sell</span>${p.price || 0} / unit
                        </div>
                      </div>
                    </div>
                    <div className="card-price-block">
                      <div className="card-price-lbl">Total</div>
                      <div className="card-price-val">${total}</div>
                      <div className="card-qty">
                        <span className="material-symbols-outlined">layers</span> Qty: {qty}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <PageTransition>
      <header className="site-header">
        <div className="container">
          <div className="brand">
            <Link to="/" className="logo-link">M-MARKET</Link>
            <span className="logo-subtext">ELECTRONICS</span>
          </div>
          <Link to="/" className="back-home">← Back to Store</Link>
        </div>
      </header>

      <div className="page-wrapper">
        <div className="brand-panel">
          <div className="brand-panel-logo">M-MARKET</div>
          <div className="brand-panel-sub">Electronics</div>
          <h2 className="brand-panel-tagline">Track your <span>orders</span> in real time</h2>
          <p className="brand-panel-desc">View all your purchases, check delivery status, and manage your order history from one place.</p>

          {stats && (
            <div className="side-stats" style={{ display: 'grid' }}>
              <div className="side-stat"><div className="side-stat-value">{stats.total}</div><div className="side-stat-label">Total Orders</div></div>
              <div className="side-stat"><div className="side-stat-value">{stats.pending}</div><div className="side-stat-label">Pending</div></div>
              <div className="side-stat"><div className="side-stat-value">{stats.shipped}</div><div className="side-stat-label">Shipped</div></div>
              <div className="side-stat"><div className="side-stat-value spent">${stats.spent.toFixed(2)}</div><div className="side-stat-label">Total Spent</div></div>
            </div>
          )}

          <div className="brand-panel-dots"><span></span><span></span><span></span></div>
        </div>

        <div className="orders-panel">
          <div className="orders-inner">
            <div className="orders-header">
              <div>
                <p className="form-eyebrow">Account</p>
                <h1 className="orders-title">My Orders</h1>
                <p className="orders-subtitle">Your full purchase history</p>
              </div>
              <button className="refresh-btn" onClick={loadMyOrders} title="Refresh">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                </svg>
              </button>
            </div>
            <div className="form-divider"></div>
            {renderContent()}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}