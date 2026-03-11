import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const SERVER_URL = 'https://m-market-2.onrender.com';

/* ── Inline Admin CSS (avoids separate file dependency) ── */
const adminCSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --sidebar-bg:#0f172a;--sidebar-hover:#1e293b;--sidebar-active:#1e40af;
  --sidebar-text:#94a3b8;--sidebar-text-active:#fff;
  --bg:#f8fafc;--card-bg:#ffffff;--border:#e2e8f0;
  --text:#0f172a;--text-muted:#64748b;
  --blue:#2563eb;--blue-light:#eff6ff;--blue-border:#bfdbfe;
  --red:#ef4444;--red-light:#fef2f2;--red-border:#fecaca;
  --green:#16a34a;--green-light:#f0fdf4;--green-border:#bbf7d0;
  --amber-light:#fffbeb;--amber-border:#fde68a;--amber-text:#92400e;
}
body.admin-body{font-family:'Inter',sans-serif;font-size:14px;background:var(--bg);color:var(--text);min-height:100vh}
.mobile-topbar{display:none;position:fixed;top:0;left:0;right:0;height:60px;background:var(--sidebar-bg);align-items:center;justify-content:space-between;padding:0 16px;z-index:400;border-bottom:1px solid #1e293b;box-shadow:0 2px 10px rgba(0,0,0,0.3)}
.mobile-topbar-title{color:#fff;font-weight:700;font-size:15px;letter-spacing:.5px}
.mobile-store-link{color:var(--sidebar-text);text-decoration:none;font-size:12px;font-weight:500;transition:color .2s}
.mobile-store-link:hover{color:#fff}
.hamburger-btn{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;gap:5px;padding:6px;border-radius:6px;transition:background .2s}
.hamburger-btn:hover{background:#1e293b}
.hamburger-btn span{display:block;width:20px;height:2px;background:var(--sidebar-text);border-radius:2px;transition:all .3s ease}
.hamburger-btn.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger-btn.open span:nth-child(2){opacity:0}
.hamburger-btn.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:350;backdrop-filter:blur(2px)}
.sidebar-overlay.is-open{display:block}
.layout{display:flex;min-height:100vh}
.sidebar{width:230px;flex-shrink:0;background:var(--sidebar-bg);display:flex;flex-direction:column;padding:20px 12px;position:sticky;top:0;height:100vh;transition:transform .3s cubic-bezier(.4,0,.2,1)}
.sidebar-logo{display:flex;align-items:center;gap:10px;padding:4px 6px 20px;border-bottom:1px solid #1e293b;margin-bottom:20px}
.logo-icon{width:34px;height:34px;background:var(--blue);border-radius:8px;display:grid;place-items:center;font-weight:700;font-size:16px;color:#fff;flex-shrink:0}
.logo-title{color:#fff;font-weight:700;font-size:14px}
.logo-sub{color:#475569;font-size:10px;margin-top:1px}
.nav-section-label{font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#475569;padding:0 8px;margin-bottom:8px}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:7px;color:var(--sidebar-text);text-decoration:none;font-size:13px;font-weight:500;margin-bottom:2px;transition:background .15s,color .15s;cursor:pointer;background:none;border:none;width:100%;text-align:left}
.nav-item:hover{background:var(--sidebar-hover);color:#cbd5e1}
.nav-item.active{background:var(--sidebar-active);color:var(--sidebar-text-active)}
.sidebar-footer{margin-top:auto;display:flex;align-items:center;gap:8px;padding:12px 8px 0;border-top:1px solid #1e293b;color:#475569;font-size:11px;flex-wrap:wrap}
.admin-dot{width:7px;height:7px;background:#22c55e;border-radius:50%;flex-shrink:0}
.store-link{margin-left:auto;color:#475569;text-decoration:none;font-size:11px;transition:color .2s}
.store-link:hover{color:#94a3b8}
.main{flex:1;padding:32px 36px;min-width:0}
.page{display:none}
.page.active{display:block}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;gap:12px;flex-wrap:wrap}
.page-header h1{font-size:22px;font-weight:700;line-height:1.2}
.page-sub{display:flex;align-items:center;gap:8px;margin-top:6px;color:var(--text-muted);font-size:12px;font-family:monospace}
.badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;letter-spacing:.5px;font-family:'Inter',sans-serif}
.badge-get{background:#dcfce7;color:#16a34a}
.badge-post{background:#dbeafe;color:#2563eb}
.badge-delete{background:#fee2e2;color:#dc2626}
.badge-patch{background:#fef3c7;color:#d97706}
.stats-bar{display:flex;align-items:center;background:var(--card-bg);border:1px solid var(--border);border-radius:10px;padding:16px 24px;margin-bottom:16px;gap:24px;flex-wrap:wrap}
.stat-item{display:flex;flex-direction:column;gap:2px}
.stat-value{font-size:20px;font-weight:700;color:var(--text);line-height:1}
.stat-label{font-size:11px;color:var(--text-muted)}
.stat-divider{width:1px;height:32px;background:var(--border)}
.search-bar{display:flex;align-items:center;gap:10px;background:var(--card-bg);border:1px solid var(--border);border-radius:8px;padding:0 14px;margin-bottom:16px;color:var(--text-muted)}
.search-bar input{flex:1;border:none;background:none;padding:10px 0;font-size:13px;color:var(--text);outline:none}
.search-bar input::placeholder{color:#cbd5e1}
.table-wrap{background:var(--card-bg);border:1px solid var(--border);border-radius:10px;overflow:hidden;overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:560px}
thead{background:#f8fafc;border-bottom:1px solid var(--border)}
th{padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
td{padding:12px 14px;font-size:13px;color:var(--text);border-bottom:1px solid var(--border);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafafa}
.product-img{width:40px;height:40px;object-fit:cover;border-radius:6px;border:1px solid var(--border);background:var(--bg);display:block}
.img-placeholder{width:40px;height:40px;border-radius:6px;border:1px solid var(--border);background:var(--bg);display:grid;place-items:center;color:#cbd5e1}
.product-name{font-weight:600}
.product-desc{font-size:11px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}
.cat-badge{font-size:11px;font-weight:500;padding:3px 8px;border-radius:20px;background:#f1f5f9;color:#475569;border:1px solid var(--border);white-space:nowrap}
.price{font-weight:600}
.stock-badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;padding:3px 8px;border-radius:20px}
.in-stock{background:var(--green-light);color:var(--green);border:1px solid var(--green-border)}
.low-stock{background:#fffbeb;color:#b45309;border:1px solid #fde68a}
.no-stock{background:var(--red-light);color:var(--red);border:1px solid var(--red-border)}
.id-cell{display:flex;align-items:center;gap:6px}
.id-text{font-family:monospace;font-size:11px;color:var(--text-muted);background:#f1f5f9;padding:3px 6px;border-radius:4px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.copy-btn{flex-shrink:0;background:none;border:1px solid var(--border);border-radius:5px;padding:4px 8px;cursor:pointer;color:var(--text-muted);font-size:11px;font-family:'Inter',sans-serif;font-weight:500;display:flex;align-items:center;gap:4px;transition:all .15s;white-space:nowrap}
.copy-btn:hover{background:var(--blue-light);color:var(--blue);border-color:var(--blue-border)}
.copy-btn.copied{background:var(--green-light);color:var(--green);border-color:var(--green-border)}
.empty-state{text-align:center;padding:60px 20px;color:var(--text-muted)}
.empty-state svg{margin:0 auto 14px;opacity:.3;display:block}
.empty-state p{font-weight:600;font-size:15px;margin-bottom:4px;color:var(--text)}
.empty-state small{font-size:12px}
.card{background:var(--card-bg);border:1px solid var(--border);border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.form-row{display:grid;gap:16px;margin-bottom:16px}
.form-row.two{grid-template-columns:1fr 1fr}
.form-row.four{grid-template-columns:1fr 1fr 1fr 1fr}
.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
.form-row .form-group{margin-bottom:0}
label{font-size:12px;font-weight:600;color:#374151}
.req{color:var(--red)}
.optional{font-weight:400;color:#94a3b8;font-size:11px}
input,textarea,select{width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:7px;font-family:'Inter',sans-serif;font-size:13px;color:var(--text);background:#fff;outline:none;transition:border-color .15s,box-shadow .15s;appearance:none}
input:focus,textarea:focus,select:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.08)}
input::placeholder,textarea::placeholder{color:#cbd5e1}
textarea{resize:vertical;min-height:80px;line-height:1.5}
select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px;cursor:pointer}
.hint{font-size:11px;color:#94a3b8;margin-top:2px}
.hint a{color:var(--blue);text-decoration:none}
.hint a:hover{text-decoration:underline}
.input-with-btn{display:flex;gap:8px}
.input-with-btn input{flex:1}
.upload-zone{border:2px dashed var(--border);border-radius:8px;padding:28px 20px;text-align:center;cursor:pointer;background:var(--bg);color:#94a3b8;transition:border-color .2s,background .2s,color .2s}
.upload-zone:hover{border-color:var(--blue);background:var(--blue-light);color:var(--blue)}
.upload-zone p{font-size:13px;font-weight:500;margin:8px 0 4px}
.upload-zone small{font-size:11px}
.file-preview{display:none;align-items:center;gap:12px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-top:8px}
.file-preview.show{display:flex}
.file-preview img{width:42px;height:42px;object-fit:cover;border-radius:6px;border:1px solid var(--border)}
.file-meta{flex:1}
.file-meta p{font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px}
.file-meta small{font-size:11px;color:var(--text-muted)}
.btn-link{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;padding:0}
.btn-link.danger{color:var(--red)}
.btn-link.danger:hover{text-decoration:underline}
.form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:8px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:7px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .15s;white-space:nowrap}
.btn-primary{background:var(--blue);color:#fff}
.btn-primary:hover{background:#1d4ed8}
.btn-primary:disabled{opacity:.5;cursor:not-allowed}
.btn-ghost{background:#fff;color:#374151;border:1.5px solid var(--border)}
.btn-ghost:hover{background:var(--bg);border-color:#cbd5e1}
.btn-danger{background:var(--red);color:#fff}
.btn-danger:hover{background:#dc2626}
.btn-warning{background:#f59e0b;color:#fff}
.btn-warning:hover{background:#d97706}
.btn-warning:disabled{opacity:.5;cursor:not-allowed}
.status-msg{display:none;align-items:center;gap:8px;margin-top:14px;padding:10px 14px;border-radius:7px;font-size:13px;font-weight:500}
.status-msg.show{display:flex}
.status-msg.loading{background:var(--blue-light);color:var(--blue);border:1px solid var(--blue-border)}
.status-msg.success{background:var(--green-light);color:var(--green);border:1px solid var(--green-border)}
.status-msg.error{background:var(--red-light);color:var(--red);border:1px solid var(--red-border)}
.spinner{width:14px;height:14px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}
.alert{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:7px;font-size:13px;margin-bottom:20px;line-height:1.5}
.alert svg{flex-shrink:0;margin-top:1px}
.alert-warning{background:var(--amber-light);color:var(--amber-text);border:1px solid var(--amber-border)}
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:500;place-items:center;backdrop-filter:blur(2px)}
.modal-overlay.show{display:grid}
.modal{background:#fff;border-radius:12px;padding:28px;width:380px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,.15);text-align:center}
.modal-icon-wrap{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;margin:0 auto 16px}
.modal-icon-wrap.danger{background:var(--red-light);color:var(--red);border:1px solid var(--red-border)}
.modal h3{font-size:17px;font-weight:700;margin-bottom:8px}
.modal p{font-size:13px;color:var(--text-muted);margin-bottom:10px}
.modal-id-box{font-family:monospace;font-size:12px;background:#f1f5f9;border:1px solid var(--border);border-radius:6px;padding:8px 12px;word-break:break-all;color:var(--text);margin-bottom:10px}
.modal-warn{color:var(--red)!important;font-weight:600;font-size:12px!important;margin-bottom:20px!important}
.modal-actions{display:flex;gap:10px;justify-content:center}
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);background:#0f172a;color:#fff;font-size:13px;font-weight:500;padding:10px 20px;border-radius:8px;z-index:600;transition:transform .3s ease;pointer-events:none;white-space:nowrap}
.toast.show{transform:translateX(-50%) translateY(0)}
.section-divider{display:flex;align-items:center;gap:12px;margin:4px 0 20px;color:#94a3b8;font-size:12px}
.section-divider::before,.section-divider::after{content:'';flex:1;height:1px;background:var(--border)}
.status-picker{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.status-card{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1.5px solid var(--border);border-radius:8px;cursor:pointer;background:#fff;transition:border-color .15s,background .15s,box-shadow .15s;user-select:none;position:relative}
.status-card:hover{border-color:#94a3b8;background:var(--bg)}
.status-card.selected{border-color:#f59e0b;background:#fffbeb;box-shadow:0 0 0 3px rgba(245,158,11,.12)}
.status-card-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.pending-dot{background:#f59e0b}.paid-dot{background:#16a34a}.shipped-dot{background:#7c3aed}.cancelled-dot{background:#ef4444}
.status-card-body{flex:1;display:flex;flex-direction:column;gap:2px}
.status-card-label{font-size:13px;font-weight:600;color:var(--text)}
.status-card-desc{font-size:11px;color:var(--text-muted);line-height:1.4}
.status-card-check{color:#f59e0b;opacity:0;transition:opacity .15s;flex-shrink:0}
.status-card.selected .status-card-check{opacity:1}
.order-status{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;white-space:nowrap}
.order-status::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}
.status-pending{background:#fffbeb;color:#b45309;border:1px solid #fde68a}
.status-paid,.status-completed{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
.status-cancelled{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}
.status-shipped{background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe}
.customer-name{font-weight:600;font-size:13px}
.customer-email{font-size:11px;color:var(--text-muted);margin-top:1px}
.order-product-name{font-weight:500;font-size:13px}
.order-product-cat{font-size:11px;color:var(--text-muted);margin-top:1px}
.order-total{font-weight:700}
.order-qty{font-weight:600;text-align:center}
.order-date{font-size:12px;color:var(--text-muted);white-space:nowrap}
@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:900px){
  .mobile-topbar{display:flex}
  .sidebar{position:fixed;top:0;left:0;height:100vh;width:260px;z-index:500;transform:translateX(-100%);padding-top:20px}
  .sidebar.is-open{transform:translateX(0)}
  .main{margin-left:0!important;padding:80px 22px 40px}
  .layout{display:block}
}
@media(max-width:768px){
  .form-row.two,.form-row.four{grid-template-columns:1fr}
  .status-picker{grid-template-columns:1fr}
  .form-actions{justify-content:stretch}
  .form-actions .btn{flex:1;justify-content:center}
  .modal{width:95%;padding:22px 18px}
  .modal-actions{flex-direction:column}
  .modal-actions .btn{width:100%;justify-content:center}
}
@media(max-width:640px){
  .main{padding:75px 14px 40px}
  th,td{padding:10px 10px;font-size:12px}
  .copy-btn{display:none}
}
`;

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getToken() { return localStorage.getItem('userToken') || ''; }
function authHeaders() {
  const t = getToken();
  return t ? { 'Authorization': 'Bearer ' + t } : {};
}

// ── STATUS MESSAGE component ──
function StatusMsg({ status }) {
  if (!status.type) return null;
  return (
    <div className={`status-msg show ${status.type}`}>
      {status.type === 'loading' && <div className="spinner"></div>}
      <span dangerouslySetInnerHTML={{ __html: status.msg }} />
    </div>
  );
}

// ── PRODUCT TABLE ROW ──
function ProductRow({ p, onCopy }) {
  const stock = Number(p.stock) || 0;
  const stockClass = stock === 0 ? 'no-stock' : stock <= 5 ? 'low-stock' : 'in-stock';
  const stockDot = stock === 0 ? '✕' : stock <= 5 ? '⚠' : '✓';
  const imgSrc = p.imageUrl ? `${SERVER_URL}/${p.imageUrl.replace(/\\/g, '/')}` : null;
  return (
    <tr>
      <td>{imgSrc ? <img className="product-img" src={imgSrc} alt={p.proName} /> : <div className="img-placeholder">📦</div>}</td>
      <td><div className="product-name">{p.proName}</div><div className="product-desc">{p.proDescrption}</div></td>
      <td><span className="cat-badge">{p.category || '—'}</span></td>
      <td className="price">${Number(p.price || 0).toFixed(2)}</td>
      <td><span className={`stock-badge ${stockClass}`}>{stockDot} {stock}</span></td>
      <td>
        <div className="id-cell">
          <span className="id-text" title={p.id}>{p.id}</span>
          <button className="copy-btn" onClick={() => onCopy(p.id)}>Copy</button>
        </div>
      </td>
    </tr>
  );
}

// ── MAIN ADMIN COMPONENT ──
export default function Admin() {
  const [activePage, setActivePage] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);

  // Products state
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productStatus, setProductStatus] = useState({ type: '', msg: '' });

  // Upload state
  const [uploadFields, setUploadFields] = useState({ proName:'', proDescrption:'', price:'', stock:'', category:'', color:'', storage:'' });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [uploadStatus, setUploadStatus] = useState({ type:'', msg:'' });

  // Update state
  const [updateId, setUpdateId] = useState('');
  const [updateFields, setUpdateFields] = useState({ proName:'', proDescrption:'', price:'', stock:'', category:'', color:'', storage:'' });
  const [updateFile, setUpdateFile] = useState(null);
  const [updatePreview, setUpdatePreview] = useState('');
  const [updateStatus, setUpdateStatus] = useState({ type:'', msg:'' });

  // Delete state
  const [deleteId, setDeleteId] = useState('');
  const [deleteStatus, setDeleteStatus] = useState({ type:'', msg:'' });
  const [confirmModal, setConfirmModal] = useState(false);

  // Orders state
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState({ type:'', msg:'' });

  // Update order status
  const [orderStatusId, setOrderStatusId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [orderStatusMsg, setOrderStatusMsg] = useState({ type:'', msg:'' });

  useEffect(() => {
    // Inject admin CSS
    const style = document.createElement('style');
    style.id = 'admin-styles';
    style.textContent = adminCSS;
    document.head.appendChild(style);
    document.body.classList.add('admin-body');
    loadProducts();
    return () => {
      document.head.removeChild(style);
      document.body.classList.remove('admin-body');
    };
  }, []);

  useEffect(() => {
    if (activePage === 'products') loadProducts();
    if (activePage === 'orders') loadOrders();
  }, [activePage]);

  function showToast(msg) {
    setToast(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }

  // ── Products ──
  async function loadProducts() {
    setProductStatus({ type: 'loading', msg: 'Loading products…' });
    try {
      const res = await fetch(`${SERVER_URL}/products/get-all-products`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) { setProductStatus({ type: 'error', msg: '✕ ' + (data.message || 'Failed.') }); return; }
      setAllProducts(data);
      setFilteredProducts(data);
      setProductStatus({ type: '', msg: '' });
    } catch {
      setProductStatus({ type: 'error', msg: '✕ Network error.' });
    }
  }

  function filterProducts(q) {
    setProductSearch(q);
    const filtered = allProducts.filter(p =>
      (p.proName||'').toLowerCase().includes(q.toLowerCase()) ||
      (p.category||'').toLowerCase().includes(q.toLowerCase())
    );
    setFilteredProducts(filtered);
  }

  function copyId(id) {
    navigator.clipboard.writeText(id).then(() => showToast('ID copied to clipboard!'));
  }

  // ── Upload ──
  function handleUploadFile(file) {
    const reader = new FileReader();
    reader.onload = e => setUploadPreview(e.target.result);
    reader.readAsDataURL(file);
    setUploadFile(file);
  }

  async function submitUpload() {
    const { proName, proDescrption, price, stock, category, color, storage } = uploadFields;
    if (!proName || !proDescrption || !price || !stock || !category) {
      setUploadStatus({ type: 'error', msg: '✕ Please fill in all required fields.' }); return;
    }
    if (!uploadFile) { setUploadStatus({ type: 'error', msg: '✕ Product image is required.' }); return; }

    const formData = new FormData();
    Object.entries({ proName, proDescrption, price, stock, category }).forEach(([k,v]) => formData.append(k, v));
    if (color) formData.append('color', color);
    if (storage) formData.append('storage', storage);
    formData.append('image', uploadFile);

    setUploadStatus({ type: 'loading', msg: 'Uploading product…' });
    try {
      const res = await fetch(`${SERVER_URL}/products/upload`, { method: 'POST', headers: authHeaders(), body: formData });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus({ type: 'success', msg: `✓ Product uploaded! — ${data.proName || proName}` });
        showToast('Product uploaded!');
        setUploadFields({ proName:'', proDescrption:'', price:'', stock:'', category:'', color:'', storage:'' });
        setUploadFile(null); setUploadPreview('');
      } else {
        setUploadStatus({ type: 'error', msg: '✕ ' + (data.message || 'Upload failed.') });
      }
    } catch {
      setUploadStatus({ type: 'error', msg: '✕ Network error.' });
    }
  }

  // ── Update ──
  async function submitUpdate() {
    if (!updateId.trim()) { setUpdateStatus({ type: 'error', msg: '✕ Product ID is required.' }); return; }
    const formData = new FormData();
    let hasField = false;
    Object.entries(updateFields).forEach(([k, v]) => { if (v) { formData.append(k, v); hasField = true; } });
    if (updateFile) { formData.append('image', updateFile); hasField = true; }
    if (!hasField) { setUpdateStatus({ type: 'error', msg: '✕ Fill in at least one field.' }); return; }

    setUpdateStatus({ type: 'loading', msg: 'Saving changes…' });
    try {
      const res = await fetch(`${SERVER_URL}/products/update/${updateId.trim()}`, { method: 'PATCH', headers: authHeaders(), body: formData });
      const data = await res.json();
      if (res.ok) {
        setUpdateStatus({ type: 'success', msg: `✓ Product updated!${data.proName ? ' — ' + data.proName : ''}` });
        showToast('Product updated!');
      } else {
        setUpdateStatus({ type: 'error', msg: '✕ ' + (data.message || 'Update failed.') });
      }
    } catch {
      setUpdateStatus({ type: 'error', msg: '✕ Network error.' });
    }
  }

  // ── Delete ──
  async function confirmDelete() {
    setConfirmModal(false);
    setDeleteStatus({ type: 'loading', msg: 'Deleting product…' });
    try {
      const res = await fetch(`${SERVER_URL}/products/delete/${deleteId.trim()}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (res.ok) {
        setDeleteStatus({ type: 'success', msg: '✓ ' + (data.message || 'Product deleted.') });
        showToast('Product deleted!');
        setDeleteId('');
      } else {
        setDeleteStatus({ type: 'error', msg: '✕ ' + (data.message || 'Delete failed.') });
      }
    } catch {
      setDeleteStatus({ type: 'error', msg: '✕ Network error.' });
    }
  }

  // ── Orders ──
  async function loadOrders() {
    setOrderStatus({ type: 'loading', msg: 'Loading orders…' });
    try {
      const res = await fetch(`${SERVER_URL}/orders/allOrders`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) { setOrderStatus({ type: 'error', msg: '✕ ' + (data.message || 'Failed.') }); return; }
      const orders = Array.isArray(data) ? data : [];
      setAllOrders(orders);
      setFilteredOrders(orders);
      setOrderStatus({ type: '', msg: '' });
    } catch {
      setOrderStatus({ type: 'error', msg: '✕ Network error.' });
    }
  }

  function filterOrders(q) {
    setOrderSearch(q);
    const filtered = allOrders.filter(o => {
      const name = (o.userId?.name || o.userId?.fullName || '').toLowerCase();
      const email = (o.userId?.email || '').toLowerCase();
      const product = (o.productId?.proName || '').toLowerCase();
      return name.includes(q.toLowerCase()) || email.includes(q.toLowerCase()) || product.includes(q.toLowerCase());
    });
    setFilteredOrders(filtered);
  }

  async function submitOrderStatus() {
    if (!orderStatusId.trim()) { setOrderStatusMsg({ type: 'error', msg: '✕ Please enter an Order ID.' }); return; }
    if (!selectedStatus) { setOrderStatusMsg({ type: 'error', msg: '✕ Please select a status.' }); return; }

    setOrderStatusMsg({ type: 'loading', msg: 'Updating order status…' });
    try {
      const res = await fetch(`${SERVER_URL}/orders/${orderStatusId.trim()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status: selectedStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setOrderStatusMsg({ type: 'success', msg: `✓ ${data.message || 'Status updated!'} — Now <strong>${data.order?.status || selectedStatus}</strong>` });
        showToast('Order status updated!');
      } else {
        setOrderStatusMsg({ type: 'error', msg: '✕ ' + (data.message || 'Update failed.') });
      }
    } catch {
      setOrderStatusMsg({ type: 'error', msg: '✕ Network error.' });
    }
  }

  // ── Stats ──
  const productStats = { total: allProducts.length, categories: new Set(allProducts.map(p => p.category)).size, stock: allProducts.reduce((s, p) => s + (Number(p.stock) || 0), 0) };
  const orderStats = {
    total: allOrders.length,
    pending: allOrders.filter(o => (o.status||'').toLowerCase() === 'pending').length,
    completed: allOrders.filter(o => ['paid','completed'].includes((o.status||'').toLowerCase())).length,
    revenue: allOrders.reduce((s, o) => s + ((o.productId?.price || 0) * (o.quantity || 1)), 0)
  };

  const navItems = [
    { id: 'products', label: 'All Products', section: 'Products' },
    { id: 'upload', label: 'Upload Product', section: 'Products' },
    { id: 'update', label: 'Update Product', section: 'Products' },
    { id: 'delete', label: 'Delete Product', section: 'Products' },
    { id: 'orders', label: 'All Orders', section: 'Orders' },
    { id: 'updateOrder', label: 'Update Order Status', section: 'Orders' },
  ];

  return (
    <div>
      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <button className={`hamburger-btn${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(p => !p)}>
          <span></span><span></span><span></span>
        </button>
        <span className="mobile-topbar-title">M-Market Admin</span>
        <Link to="/" className="mobile-store-link">Store ↗</Link>
      </div>

      {sidebarOpen && <div className="sidebar-overlay is-open" onClick={() => setSidebarOpen(false)}></div>}

      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? ' is-open' : ''}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">M</div>
            <div><div className="logo-title">M-Market</div><div className="logo-sub">Admin Panel · v1.0</div></div>
          </div>

          {['Products', 'Orders'].map(section => (
            <React.Fragment key={section}>
              <div className="nav-section-label" style={section === 'Orders' ? { marginTop: '16px' } : {}}>{section}</div>
              <nav>
                {navItems.filter(n => n.section === section).map(n => (
                  <button key={n.id} className={`nav-item${activePage === n.id ? ' active' : ''}`}
                    onClick={() => { setActivePage(n.id); setSidebarOpen(false); }}>
                    {n.label}
                  </button>
                ))}
              </nav>
            </React.Fragment>
          ))}

          <div className="sidebar-footer">
            <div className="admin-dot"></div>
            <span>Admin · JWT Auth</span>
            <Link to="/" className="store-link">← Store</Link>
          </div>
        </aside>

        {/* Main */}
        <main className="main">

          {/* ALL PRODUCTS */}
          <div className={`page${activePage === 'products' ? ' active' : ''}`}>
            <div className="page-header">
              <div><h1>All Products</h1><p className="page-sub"><span className="badge badge-get">GET</span> /products/get-all-products</p></div>
              <button className="btn btn-primary" onClick={loadProducts}>↻ Refresh</button>
            </div>
            {filteredProducts.length > 0 && (
              <div className="stats-bar">
                <div className="stat-item"><span className="stat-value">{productStats.total}</span><span className="stat-label">Total Products</span></div>
                <div className="stat-divider"></div>
                <div className="stat-item"><span className="stat-value">{productStats.categories}</span><span className="stat-label">Categories</span></div>
                <div className="stat-divider"></div>
                <div className="stat-item"><span className="stat-value">{productStats.stock}</span><span className="stat-label">Total Stock</span></div>
              </div>
            )}
            {filteredProducts.length > 0 && (
              <div className="search-bar">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search by name or category…" value={productSearch} onChange={e => filterProducts(e.target.value)} />
              </div>
            )}
            <StatusMsg status={productStatus} />
            {filteredProducts.length > 0 ? (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Product ID</th></tr></thead>
                  <tbody>{filteredProducts.map(p => <ProductRow key={p.id || p._id} p={p} onCopy={copyId} />)}</tbody>
                </table>
              </div>
            ) : productStatus.type === '' && (
              <div className="empty-state"><p>No products found</p><small>Upload your first product to get started</small></div>
            )}
          </div>

          {/* UPLOAD PRODUCT */}
          <div className={`page${activePage === 'upload' ? ' active' : ''}`}>
            <div className="page-header">
              <div><h1>Upload Product</h1><p className="page-sub"><span className="badge badge-post">POST</span> /products/upload</p></div>
            </div>
            <div className="card">
              <div className="form-row two">
                <div className="form-group"><label>Product Name <span className="req">*</span></label><input type="text" placeholder="e.g. iPhone 15 Pro" value={uploadFields.proName} onChange={e => setUploadFields(p => ({...p, proName: e.target.value}))} /></div>
                <div className="form-group">
                  <label>Category <span className="req">*</span></label>
                  <select value={uploadFields.category} onChange={e => setUploadFields(p => ({...p, category: e.target.value}))}>
                    <option value="">Select category…</option>
                    <option value="phone">Phone</option><option value="laptop">Laptop</option>
                    <option value="ipad">iPad / Tablet</option><option value="watch">Watch</option><option value="airpod">AirPods</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Description <span className="req">*</span></label><textarea placeholder="Describe the product…" value={uploadFields.proDescrption} onChange={e => setUploadFields(p => ({...p, proDescrption: e.target.value}))} /></div>
              <div className="form-row four">
                <div className="form-group"><label>Price (USD) <span className="req">*</span></label><input type="number" placeholder="0.00" value={uploadFields.price} onChange={e => setUploadFields(p => ({...p, price: e.target.value}))} /></div>
                <div className="form-group"><label>Stock <span className="req">*</span></label><input type="number" placeholder="0" value={uploadFields.stock} onChange={e => setUploadFields(p => ({...p, stock: e.target.value}))} /></div>
                <div className="form-group"><label>Color</label><input type="text" placeholder="Black, White…" value={uploadFields.color} onChange={e => setUploadFields(p => ({...p, color: e.target.value}))} /></div>
                <div className="form-group"><label>Storage</label><input type="text" placeholder="128GB…" value={uploadFields.storage} onChange={e => setUploadFields(p => ({...p, storage: e.target.value}))} /></div>
              </div>
              <div className="form-group">
                <label>Product Image <span className="req">*</span></label>
                {!uploadFile ? (
                  <div className="upload-zone" onClick={() => document.getElementById('uploadFileInput').click()}>
                    <input type="file" id="uploadFileInput" accept="image/*" style={{display:'none'}} onChange={e => e.target.files[0] && handleUploadFile(e.target.files[0])} />
                    <p>Click to upload or drag & drop</p><small>PNG, JPG, WEBP — max 10MB</small>
                  </div>
                ) : (
                  <div className="file-preview show">
                    <img src={uploadPreview} alt="" />
                    <div className="file-meta"><p>{uploadFile.name}</p><small>{formatBytes(uploadFile.size)}</small></div>
                    <button className="btn-link danger" onClick={() => { setUploadFile(null); setUploadPreview(''); }}>Remove</button>
                  </div>
                )}
              </div>
              <StatusMsg status={uploadStatus} />
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => { setUploadFields({ proName:'',proDescrption:'',price:'',stock:'',category:'',color:'',storage:'' }); setUploadFile(null); setUploadPreview(''); setUploadStatus({type:'',msg:''}); }}>Clear</button>
                <button className="btn btn-primary" onClick={submitUpload}>↑ Upload Product</button>
              </div>
            </div>
          </div>

          {/* UPDATE PRODUCT */}
          <div className={`page${activePage === 'update' ? ' active' : ''}`}>
            <div className="page-header">
              <div><h1>Update Product</h1><p className="page-sub"><span className="badge badge-patch">PATCH</span> /products/update/:id</p></div>
            </div>
            <div className="card">
              <div className="form-group">
                <label>Product ID <span className="req">*</span></label>
                <div className="input-with-btn">
                  <input type="text" placeholder="Paste MongoDB ObjectId…" value={updateId} onChange={e => setUpdateId(e.target.value)} />
                  <button className="btn btn-ghost" onClick={() => navigator.clipboard.readText().then(t => setUpdateId(t.trim())).catch(()=>{})}>Paste</button>
                </div>
              </div>
              <div className="section-divider"><span>Fields to update — leave blank to keep existing value</span></div>
              <div className="form-row two">
                <div className="form-group"><label>Product Name</label><input type="text" placeholder="Leave blank to keep current" value={updateFields.proName} onChange={e => setUpdateFields(p => ({...p, proName: e.target.value}))} /></div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={updateFields.category} onChange={e => setUpdateFields(p => ({...p, category: e.target.value}))}>
                    <option value="">— Keep current —</option>
                    <option value="phone">Phone</option><option value="laptop">Laptop</option>
                    <option value="ipad">iPad / Tablet</option><option value="watch">Watch</option><option value="AirPods">AirPods</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Description</label><textarea placeholder="Leave blank to keep current" value={updateFields.proDescrption} onChange={e => setUpdateFields(p => ({...p, proDescrption: e.target.value}))} /></div>
              <div className="form-row four">
                <div className="form-group"><label>Price</label><input type="number" placeholder="e.g. 999.00" value={updateFields.price} onChange={e => setUpdateFields(p => ({...p, price: e.target.value}))} /></div>
                <div className="form-group"><label>Stock</label><input type="number" placeholder="e.g. 50" value={updateFields.stock} onChange={e => setUpdateFields(p => ({...p, stock: e.target.value}))} /></div>
                <div className="form-group"><label>Color</label><input type="text" placeholder="e.g. Black" value={updateFields.color} onChange={e => setUpdateFields(p => ({...p, color: e.target.value}))} /></div>
                <div className="form-group"><label>Storage</label><input type="text" placeholder="e.g. 256GB" value={updateFields.storage} onChange={e => setUpdateFields(p => ({...p, storage: e.target.value}))} /></div>
              </div>
              <div className="form-group">
                <label>Replace Image <span className="optional">(optional)</span></label>
                {!updateFile ? (
                  <div className="upload-zone" onClick={() => document.getElementById('updateFileInput').click()}>
                    <input type="file" id="updateFileInput" accept="image/*" style={{display:'none'}} onChange={e => { if (e.target.files[0]) { const f = e.target.files[0]; const r = new FileReader(); r.onload = ev => setUpdatePreview(ev.target.result); r.readAsDataURL(f); setUpdateFile(f); } }} />
                    <p>Click to upload new image</p><small>Leave empty to keep existing image</small>
                  </div>
                ) : (
                  <div className="file-preview show">
                    <img src={updatePreview} alt="" />
                    <div className="file-meta"><p>{updateFile.name}</p><small>{formatBytes(updateFile.size)}</small></div>
                    <button className="btn-link danger" onClick={() => { setUpdateFile(null); setUpdatePreview(''); }}>Remove</button>
                  </div>
                )}
              </div>
              <StatusMsg status={updateStatus} />
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => { setUpdateId(''); setUpdateFields({proName:'',proDescrption:'',price:'',stock:'',category:'',color:'',storage:''}); setUpdateFile(null); setUpdatePreview(''); setUpdateStatus({type:'',msg:''}); }}>Clear</button>
                <button className="btn btn-warning" onClick={submitUpdate}>✎ Save Changes</button>
              </div>
            </div>
          </div>

          {/* DELETE PRODUCT */}
          <div className={`page${activePage === 'delete' ? ' active' : ''}`}>
            <div className="page-header">
              <div><h1>Delete Product</h1><p className="page-sub"><span className="badge badge-delete">DELETE</span> /products/delete/:id</p></div>
            </div>
            <div className="card">
              <div className="form-group">
                <label>Product ID <span className="req">*</span></label>
                <div className="input-with-btn">
                  <input type="text" placeholder="Paste MongoDB ObjectId here…" value={deleteId} onChange={e => setDeleteId(e.target.value)} />
                  <button className="btn btn-ghost" onClick={() => navigator.clipboard.readText().then(t => setDeleteId(t.trim())).catch(()=>{})}>Paste</button>
                </div>
              </div>
              <div className="alert alert-warning">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                This action is <strong>permanent</strong>. The product record and its image will be deleted from storage.
              </div>
              <div className="form-actions">
                <button className="btn btn-danger" onClick={() => { if (!deleteId.trim()) { setDeleteStatus({type:'error',msg:'✕ Please enter a Product ID.'}); return; } setConfirmModal(true); }}>🗑 Delete Product</button>
              </div>
              <StatusMsg status={deleteStatus} />
            </div>
          </div>

          {/* ALL ORDERS */}
          <div className={`page${activePage === 'orders' ? ' active' : ''}`}>
            <div className="page-header">
              <div><h1>All Orders</h1><p className="page-sub"><span className="badge badge-get">GET</span> /orders/allOrders</p></div>
              <button className="btn btn-primary" onClick={loadOrders}>↻ Refresh</button>
            </div>
            {filteredOrders.length > 0 && (
              <div className="stats-bar">
                <div className="stat-item"><span className="stat-value">{orderStats.total}</span><span className="stat-label">Total Orders</span></div>
                <div className="stat-divider"></div>
                <div className="stat-item"><span className="stat-value">{orderStats.pending}</span><span className="stat-label">Pending</span></div>
                <div className="stat-divider"></div>
                <div className="stat-item"><span className="stat-value">{orderStats.completed}</span><span className="stat-label">Completed</span></div>
                <div className="stat-divider"></div>
                <div className="stat-item"><span className="stat-value">${orderStats.revenue.toFixed(2)}</span><span className="stat-label">Total Revenue</span></div>
              </div>
            )}
            {filteredOrders.length > 0 && (
              <div className="search-bar">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search by customer name, email or product…" value={orderSearch} onChange={e => filterOrders(e.target.value)} />
              </div>
            )}
            <StatusMsg status={orderStatus} />
            {filteredOrders.length > 0 ? (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {filteredOrders.map(order => {
                      const user = order.userId || {};
                      const product = order.productId || {};
                      const status = (order.status || 'pending').toLowerCase();
                      const qty = order.quantity || 1;
                      const total = ((product.price || 0) * qty).toFixed(2);
                      const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) : '—';
                      const orderId = (order._id || '').toString();
                      const statusCls = { pending:'status-pending', paid:'status-paid', completed:'status-completed', cancelled:'status-cancelled', shipped:'status-shipped' }[status] || 'status-pending';
                      return (
                        <tr key={orderId}>
                          <td><div className="id-cell"><span className="id-text" title={orderId}>{orderId}</span><button className="copy-btn" onClick={() => copyId(orderId)}>Copy</button></div></td>
                          <td><div className="customer-name">{user.fullName || 'Unknown'}</div><div className="customer-email">{user.email || '—'}</div></td>
                          <td><div className="order-product-name">{product.proName || '—'}</div><div className="order-product-cat">{product.category || '—'}</div></td>
                          <td className="order-qty">{qty}</td>
                          <td className="order-total">${total}</td>
                          <td><span className={`order-status ${statusCls}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                          <td className="order-date">{date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : orderStatus.type === '' && (
              <div className="empty-state"><p>No orders found</p><small>Orders will appear here once customers place them</small></div>
            )}
          </div>

          {/* UPDATE ORDER STATUS */}
          <div className={`page${activePage === 'updateOrder' ? ' active' : ''}`}>
            <div className="page-header">
              <div><h1>Update Order Status</h1><p className="page-sub"><span className="badge badge-patch">PATCH</span> /orders/:id</p></div>
            </div>
            <div className="card">
              <div className="form-group">
                <label>Order ID <span className="req">*</span></label>
                <div className="input-with-btn">
                  <input type="text" placeholder="Paste MongoDB ObjectId…" value={orderStatusId} onChange={e => setOrderStatusId(e.target.value)} />
                  <button className="btn btn-ghost" onClick={() => navigator.clipboard.readText().then(t => setOrderStatusId(t.trim())).catch(()=>{})}>Paste</button>
                </div>
              </div>
              <div className="section-divider"><span>Select new status</span></div>
              <div className="status-picker">
                {[
                  { value: 'pending', label: 'Pending', desc: 'Order received, awaiting payment', dotClass: 'pending-dot' },
                  { value: 'paid', label: 'Paid', desc: 'Payment confirmed, preparing order', dotClass: 'paid-dot' },
                  { value: 'shipped', label: 'Shipped', desc: 'Order dispatched and on the way', dotClass: 'shipped-dot' },
                  { value: 'cancelled', label: 'Cancelled', desc: 'Order has been cancelled', dotClass: 'cancelled-dot' },
                ].map(s => (
                  <label key={s.value} className={`status-card${selectedStatus === s.value ? ' selected' : ''}`} onClick={() => setSelectedStatus(s.value)}>
                    <div className={`status-card-dot ${s.dotClass}`}></div>
                    <div className="status-card-body"><span className="status-card-label">{s.label}</span><span className="status-card-desc">{s.desc}</span></div>
                    <svg className="status-card-check" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </label>
                ))}
              </div>
              <StatusMsg status={orderStatusMsg} />
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => { setOrderStatusId(''); setSelectedStatus(''); setOrderStatusMsg({type:'',msg:''}); }}>Clear</button>
                <button className="btn btn-warning" onClick={submitOrderStatus}>⏱ Update Status</button>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Confirm Delete Modal */}
      {confirmModal && (
        <div className="modal-overlay show" onClick={e => e.target.className.includes('modal-overlay') && setConfirmModal(false)}>
          <div className="modal">
            <div className="modal-icon-wrap danger">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>
            </div>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete product:</p>
            <div className="modal-id-box">{deleteId}</div>
            <p className="modal-warn">This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast${toastVisible ? ' show' : ''}`}>{toast}</div>
    </div>
  );
}
