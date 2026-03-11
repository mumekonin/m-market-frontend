import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const SERVER_URL = 'https://m-market-2.onrender.com';

/* ── Inline Admin CSS — Dark Professional Theme ── */
const adminCSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#f3a81c;
  --gold-dim:rgba(243,168,28,.12);
  --gold-border:rgba(243,168,28,.25);
  --sidebar-bg:#0a0a0f;
  --sidebar-border:rgba(255,255,255,.06);
  --bg:#0d0d14;
  --card-bg:#12121a;
  --border:rgba(255,255,255,.07);
  --border-hover:rgba(243,168,28,.25);
  --text:#e8e8f0;
  --text-muted:#666;
  --text-dim:#999;
  --input-bg:rgba(255,255,255,.04);
  --red:#ff5050;--red-dim:rgba(255,80,80,.1);--red-border:rgba(255,80,80,.25);
  --green:#22c55e;--green-dim:rgba(34,197,94,.1);--green-border:rgba(34,197,94,.25);
  --blue:#3b82f6;--blue-dim:rgba(59,130,246,.1);--blue-border:rgba(59,130,246,.25);
  --amber:#f59e0b;--amber-dim:rgba(245,158,11,.1);--amber-border:rgba(245,158,11,.25);
  --purple:#a78bfa;--purple-dim:rgba(167,139,250,.1);--purple-border:rgba(167,139,250,.25);
}
body.admin-body{font-family:'DM Sans',sans-serif;font-size:14px;background:#0d0d14!important;color:#e8e8f0!important;min-height:100vh}

/* Main content */
.main{flex:1;padding:36px 40px;min-width:0;background:#0d0d14!important}
.page{display:none}
.page.active{display:block}

/* Card */
.card{background:#12121a!important;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(0,0,0,.3)}

/* Mobile topbar */
.mobile-topbar{display:none;position:fixed;top:0;left:0;right:0;height:60px;background:var(--sidebar-bg);align-items:center;justify-content:space-between;padding:0 18px;z-index:400;border-bottom:1px solid var(--sidebar-border)}
.mobile-topbar-title{color:#fff;font-weight:700;font-size:15px;letter-spacing:.5px;font-family:'Syne',sans-serif}
.mobile-store-link{color:var(--text-muted);text-decoration:none;font-size:12px;font-weight:600;transition:color .2s}
.mobile-store-link:hover{color:var(--gold)}
.hamburger-btn{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;gap:5px;padding:6px;border-radius:6px;transition:background .2s}
.hamburger-btn:hover{background:rgba(255,255,255,.06)}
.hamburger-btn span{display:block;width:20px;height:2px;background:var(--text-muted);border-radius:2px;transition:all .3s ease}
.hamburger-btn.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger-btn.open span:nth-child(2){opacity:0}
.hamburger-btn.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

/* Overlay */
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:350;backdrop-filter:blur(4px)}
.sidebar-overlay.is-open{display:block}

/* Layout */
.layout{display:flex;min-height:100vh}

/* Sidebar */
.sidebar{
  width:240px;flex-shrink:0;
  background:var(--sidebar-bg);
  border-right:1px solid var(--sidebar-border);
  display:flex;flex-direction:column;
  padding:24px 14px;
  position:sticky;top:0;height:100vh;
  overflow-y:auto;
  transition:transform .3s cubic-bezier(.4,0,.2,1);
}
.sidebar-logo{
  display:flex;align-items:center;gap:12px;
  padding:4px 6px 22px;
  border-bottom:1px solid var(--sidebar-border);
  margin-bottom:24px;
}
.logo-icon{
  width:36px;height:36px;
  background:var(--gold);border-radius:10px;
  display:grid;place-items:center;
  font-family:'Syne',sans-serif;font-weight:800;font-size:16px;color:#000;flex-shrink:0;
}
.logo-title{color:#fff;font-weight:700;font-size:14px;font-family:'Syne',sans-serif}
.logo-sub{color:var(--text-muted);font-size:10px;margin-top:2px}
.nav-section-label{
  font-size:10px;font-weight:700;letter-spacing:1.5px;
  text-transform:uppercase;color:#333;
  padding:0 10px;margin-bottom:8px;
}
.nav-item{
  display:flex;align-items:center;gap:10px;
  padding:10px 12px;border-radius:10px;
  color:var(--text-muted);text-decoration:none;
  font-size:13px;font-weight:600;margin-bottom:2px;
  transition:background .15s,color .15s;
  cursor:pointer;background:none;border:none;width:100%;text-align:left;
  font-family:'DM Sans',sans-serif;
}
.nav-item:hover{background:rgba(255,255,255,.04);color:var(--text-dim)}
.nav-item.active{background:var(--gold-dim);color:var(--gold);border:1px solid var(--gold-border)}
.nav-icon{font-size:18px!important;flex-shrink:0;opacity:.7}
.nav-item.active .nav-icon{opacity:1}
.sidebar-footer{
  margin-top:auto;display:flex;align-items:center;gap:8px;
  padding:16px 8px 0;border-top:1px solid var(--sidebar-border);
  flex-wrap:wrap;
}
.admin-dot{width:7px;height:7px;background:var(--green);border-radius:50%;flex-shrink:0}
.store-link{margin-left:auto;color:var(--text-muted);text-decoration:none;font-size:11px;font-weight:600;transition:color .2s}
.store-link:hover{color:var(--gold)}

/* Page header */
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;gap:12px;flex-wrap:wrap}
.page-header h1{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:#fff;line-height:1.2}
.page-sub{display:flex;align-items:center;gap:8px;margin-top:6px;color:var(--text-muted);font-size:12px;font-family:monospace}

/* Method badges */
.badge{font-size:10px;font-weight:700;padding:3px 8px;border-radius:5px;letter-spacing:.5px;font-family:'DM Sans',sans-serif}
.badge-get{background:var(--green-dim);color:var(--green);border:1px solid var(--green-border)}
.badge-post{background:var(--blue-dim);color:var(--blue);border:1px solid var(--blue-border)}
.badge-delete{background:var(--red-dim);color:var(--red);border:1px solid var(--red-border)}
.badge-patch{background:var(--amber-dim);color:var(--amber);border:1px solid var(--amber-border)}

/* Stats bar */
.stats-bar{
  display:flex;align-items:center;
  background:var(--card-bg);border:1px solid var(--border);
  border-radius:14px;padding:18px 28px;margin-bottom:20px;
  gap:28px;flex-wrap:wrap;
}
.stat-item{display:flex;flex-direction:column;gap:3px}
.stat-value{font-size:22px;font-weight:800;color:var(--gold);line-height:1;font-family:'Syne',sans-serif}
.stat-label{font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.stat-divider{width:1px;height:36px;background:var(--border)}

/* Search bar */
.search-bar{
  display:flex;align-items:center;gap:10px;
  background:var(--card-bg);border:1.5px solid var(--border);
  border-radius:12px;padding:0 16px;margin-bottom:18px;
  transition:border-color .2s,box-shadow .2s;
}
.search-bar:focus-within{border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-dim)}
.search-bar svg{color:var(--text-muted);flex-shrink:0}
.search-bar input{flex:1;border:none;background:none;padding:11px 0;font-size:14px;color:var(--text);outline:none;font-family:'DM Sans',sans-serif}
.search-bar input::placeholder{color:#333}

/* Table */
.table-wrap{background:var(--card-bg);border:1px solid var(--border);border-radius:14px;overflow:hidden;overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:560px}
thead{background:rgba(255,255,255,.02);border-bottom:1px solid var(--border)}
th{padding:12px 16px;text-align:left;font-size:10px;font-weight:700;color:#444;text-transform:uppercase;letter-spacing:1px;white-space:nowrap}
td{padding:14px 16px;font-size:13px;color:var(--text);border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.02)}
.product-img{width:44px;height:44px;object-fit:cover;border-radius:8px;border:1px solid var(--border);background:var(--bg);display:block}
.img-placeholder{width:44px;height:44px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,.03);display:grid;place-items:center;color:#2a2a38;font-size:20px}
.product-name{font-weight:700;color:#f0f0f5}
.product-desc{font-size:11px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
.cat-badge{font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;background:rgba(243,168,28,.08);color:var(--gold);border:1px solid var(--gold-border);white-space:nowrap}
.price{font-weight:700;color:var(--gold)}
.stock-badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px}
.in-stock{background:var(--green-dim);color:var(--green);border:1px solid var(--green-border)}
.low-stock{background:var(--amber-dim);color:var(--amber);border:1px solid var(--amber-border)}
.no-stock{background:var(--red-dim);color:var(--red);border:1px solid var(--red-border)}
.id-cell{display:flex;align-items:center;gap:8px}
.id-text{font-family:monospace;font-size:11px;color:var(--text-muted);background:rgba(255,255,255,.05);padding:3px 8px;border-radius:5px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid var(--border)}
.copy-btn{flex-shrink:0;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:6px;padding:4px 10px;cursor:pointer;color:var(--text-muted);font-size:11px;font-family:'DM Sans',sans-serif;font-weight:600;display:flex;align-items:center;gap:4px;transition:all .15s;white-space:nowrap}
.copy-btn:hover{background:var(--gold-dim);color:var(--gold);border-color:var(--gold-border)}
.copy-btn.copied{background:var(--green-dim);color:var(--green);border-color:var(--green-border)}

/* Empty state */
.empty-state{text-align:center;padding:64px 20px;color:var(--text-muted)}
.empty-state svg{margin:0 auto 14px;opacity:.2;display:block}
.empty-state p{font-weight:700;font-size:16px;margin-bottom:6px;color:#333}
.empty-state small{font-size:13px}

/* Forms */
.form-row{display:grid;gap:18px;margin-bottom:18px}
.form-row.two{grid-template-columns:1fr 1fr}
.form-row.four{grid-template-columns:1fr 1fr 1fr 1fr}
.form-group{display:flex;flex-direction:column;gap:7px;margin-bottom:18px}
.form-row .form-group{margin-bottom:0}
label{font-size:11px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:.8px}
.req{color:var(--red)}
.optional{font-weight:400;color:#333;font-size:11px;text-transform:none;letter-spacing:0}
input,textarea,select{
  width:100%;padding:11px 14px;
  border:1.5px solid rgba(255,255,255,.08)!important;
  border-radius:10px;
  font-family:'DM Sans',sans-serif;font-size:14px;
  color:#e8e8f0!important;
  background:#1a1a24!important;
  outline:none;
  transition:border-color .15s,box-shadow .15s;
  appearance:none;
  -webkit-appearance:none;
}
input:focus,textarea:focus,select:focus{
  border-color:var(--gold)!important;
  box-shadow:0 0 0 3px rgba(243,168,28,.1)!important;
  background:#1e1e2a!important;
}
input::placeholder,textarea::placeholder{color:#3a3a4a!important}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus{
  -webkit-box-shadow:0 0 0 1000px #1a1a24 inset!important;
  -webkit-text-fill-color:#e8e8f0!important;
  border-color:rgba(255,255,255,.08)!important;
}
textarea{resize:vertical;min-height:88px;line-height:1.6;background:#1a1a24!important}
select{
  background-color:#1a1a24!important;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")!important;
  background-repeat:no-repeat!important;
  background-position:right 14px center!important;
  padding-right:36px;cursor:pointer;
  color:#e8e8f0!important;
}
select option{background:#1a1a24;color:#e8e8f0}
.hint{font-size:11px;color:var(--text-muted);margin-top:3px}
.input-with-btn{display:flex;gap:10px}
.input-with-btn input{flex:1}
.btn-ghost{background:rgba(255,255,255,.05)!important;color:#aaa!important;border:1.5px solid rgba(255,255,255,.1)!important}
.btn-ghost:hover{background:rgba(255,255,255,.09)!important;border-color:rgba(255,255,255,.18)!important;color:#ddd!important}

/* Upload zone */
.upload-zone{
  border:2px dashed rgba(255,255,255,.1);border-radius:12px;
  padding:32px 20px;text-align:center;cursor:pointer;
  background:rgba(255,255,255,.02);color:var(--text-muted);
  transition:border-color .2s,background .2s,color .2s;
}
.upload-zone:hover{border-color:var(--gold);background:var(--gold-dim);color:var(--gold)}
.upload-zone p{font-size:14px;font-weight:600;margin:8px 0 4px}
.upload-zone small{font-size:12px}
.file-preview{display:none;align-items:center;gap:14px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:10px;padding:12px 16px;margin-top:10px}
.file-preview.show{display:flex}
.file-preview img{width:46px;height:46px;object-fit:cover;border-radius:8px;border:1px solid var(--border)}
.file-meta{flex:1}
.file-meta p{font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px}
.file-meta small{font-size:11px;color:var(--text-muted)}
.btn-link{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;padding:0}
.btn-link.danger{color:var(--red)}
.btn-link.danger:hover{text-decoration:underline}
.form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .15s;white-space:nowrap}
.btn-primary{background:var(--blue);color:#fff!important}
.btn-primary:hover{background:#2563eb;box-shadow:0 4px 16px rgba(59,130,246,.3)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed}
.btn-danger{background:var(--red);color:#fff!important}
.btn-danger:hover{background:#ff3333;box-shadow:0 4px 16px rgba(255,80,80,.3)}
.btn-warning{background:var(--gold);color:#000!important}
.btn-warning:hover{opacity:.88;box-shadow:0 4px 16px rgba(243,168,28,.3)}
.btn-warning:disabled{opacity:.5;cursor:not-allowed}

/* Status messages */
.status-msg{display:none;align-items:center;gap:10px;margin-top:16px;padding:12px 16px;border-radius:10px;font-size:13px;font-weight:600}
.status-msg.show{display:flex}
.status-msg.loading{background:var(--blue-dim);color:var(--blue);border:1px solid var(--blue-border)}
.status-msg.success{background:var(--green-dim);color:var(--green);border:1px solid var(--green-border)}
.status-msg.error{background:var(--red-dim);color:var(--red);border:1px solid var(--red-border)}
.spinner{width:14px;height:14px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0}

/* Alert */
.alert{display:flex;align-items:flex-start;gap:10px;padding:14px 16px;border-radius:10px;font-size:13px;margin-bottom:22px;line-height:1.6}
.alert svg{flex-shrink:0;margin-top:1px}
.alert-warning{background:var(--amber-dim);color:var(--amber);border:1px solid var(--amber-border)}

/* Modal */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:500;place-items:center;backdrop-filter:blur(8px)}
.modal-overlay.show{display:grid}
.modal{background:var(--card-bg);border:1px solid var(--border);border-radius:18px;padding:32px;width:400px;max-width:92vw;box-shadow:0 30px 80px rgba(0,0,0,.6);text-align:center}
.modal-icon-wrap{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;margin:0 auto 18px}
.modal-icon-wrap.danger{background:var(--red-dim);color:var(--red);border:1px solid var(--red-border)}
.modal h3{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#fff;margin-bottom:10px}
.modal p{font-size:13px;color:var(--text-muted);margin-bottom:12px}
.modal-id-box{font-family:monospace;font-size:12px;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;padding:10px 14px;word-break:break-all;color:var(--text-dim);margin-bottom:12px}
.modal-warn{color:var(--red)!important;font-weight:700;font-size:12px!important;margin-bottom:22px!important}
.modal-actions{display:flex;gap:10px;justify-content:center}

/* Toast */
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--card-bg);color:var(--text);border:1px solid var(--gold-border);font-size:13px;font-weight:600;padding:12px 22px;border-radius:12px;z-index:600;transition:transform .3s ease;pointer-events:none;white-space:nowrap;box-shadow:0 8px 30px rgba(0,0,0,.4)}
.toast.show{transform:translateX(-50%) translateY(0)}

/* Section divider */
.section-divider{display:flex;align-items:center;gap:12px;margin:4px 0 22px;color:#333;font-size:12px;font-weight:600}
.section-divider::before,.section-divider::after{content:'';flex:1;height:1px;background:var(--border)}

/* Status picker */
.status-picker{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:22px}
.status-card{display:flex;align-items:center;gap:12px;padding:16px;border:1.5px solid var(--border);border-radius:12px;cursor:pointer;background:rgba(255,255,255,.02);transition:border-color .15s,background .15s,box-shadow .15s;user-select:none}
.status-card:hover{border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.04)}
.status-card.selected{border-color:var(--gold);background:var(--gold-dim);box-shadow:0 0 0 3px rgba(243,168,28,.08)}
.status-card-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.pending-dot{background:var(--amber)}.paid-dot{background:var(--green)}.shipped-dot{background:var(--purple)}.cancelled-dot{background:var(--red)}
.status-card-body{flex:1;display:flex;flex-direction:column;gap:3px}
.status-card-label{font-size:13px;font-weight:700;color:var(--text)}
.status-card-desc{font-size:11px;color:var(--text-muted);line-height:1.4}
.status-card-check{color:var(--gold);opacity:0;transition:opacity .15s;flex-shrink:0}
.status-card.selected .status-card-check{opacity:1}

/* Order table status badges */
.order-status{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;white-space:nowrap}
.order-status::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}
.status-pending{background:var(--amber-dim);color:var(--amber);border:1px solid var(--amber-border)}
.status-paid,.status-completed{background:var(--green-dim);color:var(--green);border:1px solid var(--green-border)}
.status-cancelled{background:var(--red-dim);color:var(--red);border:1px solid var(--red-border)}
.status-shipped{background:var(--purple-dim);color:var(--purple);border:1px solid var(--purple-border)}

/* Order table cells */
.customer-name{font-weight:700;font-size:13px;color:var(--text)}
.customer-email{font-size:11px;color:var(--text-muted);margin-top:2px}
.order-product-name{font-weight:600;font-size:13px;color:var(--text)}
.order-product-cat{font-size:11px;color:var(--text-muted);margin-top:2px}
.order-total{font-weight:800;color:var(--gold)}
.order-qty{font-weight:700;text-align:center}
.order-date{font-size:12px;color:var(--text-muted);white-space:nowrap}

@keyframes spin{to{transform:rotate(360deg)}}

/* Responsive */
@media(max-width:900px){
  .mobile-topbar{display:flex}
  .sidebar{position:fixed;top:0;left:0;height:100vh;width:260px;z-index:500;transform:translateX(-100%);padding-top:24px}
  .sidebar.is-open{transform:translateX(0)}
  .main{margin-left:0!important;padding:80px 22px 40px}
  .layout{display:block}
}
@media(max-width:768px){
  .form-row.two,.form-row.four{grid-template-columns:1fr}
  .status-picker{grid-template-columns:1fr}
  .form-actions{justify-content:stretch}
  .form-actions .btn{flex:1;justify-content:center}
  .modal{width:95%;padding:24px 18px}
  .modal-actions{flex-direction:column}
  .modal-actions .btn{width:100%;justify-content:center}
  .stats-bar{gap:16px;padding:14px 18px}
}
@media(max-width:640px){
  .main{padding:75px 14px 40px}
  th,td{padding:10px 10px;font-size:12px}
  .copy-btn{display:none}
}
`;

function buildImgUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  const clean = imageUrl.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${SERVER_URL}/${clean}`;
}

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

function escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
  const stockLabel = stock === 0 ? '✕ Out' : stock <= 5 ? `⚠ ${stock}` : `✓ ${stock}`;
  const imgSrc = buildImgUrl(p.imageUrl);
  return (
    <tr>
      <td>
        {imgSrc ? (
          <img className="product-img" src={imgSrc} alt={p.proName}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'grid'; }} />
        ) : null}
        <div className="img-placeholder" style={{ display: imgSrc ? 'none' : 'grid' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>inventory_2</span>
        </div>
      </td>
      <td><div className="product-name">{p.proName}</div><div className="product-desc">{p.proDescrption}</div></td>
      <td><span className="cat-badge">{p.category || '—'}</span></td>
      <td className="price">${Number(p.price || 0).toFixed(2)}</td>
      <td><span className={`stock-badge ${stockClass}`}>{stockLabel}</span></td>
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
  const [uploadFields, setUploadFields] = useState({ proName: '', proDescrption: '', price: '', stock: '', category: '', color: '', storage: '' });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [uploadStatus, setUploadStatus] = useState({ type: '', msg: '' });

  // Update state
  const [updateId, setUpdateId] = useState('');
  const [updateFields, setUpdateFields] = useState({ proName: '', proDescrption: '', price: '', stock: '', category: '', color: '', storage: '' });
  const [updateFile, setUpdateFile] = useState(null);
  const [updatePreview, setUpdatePreview] = useState('');
  const [updateStatus, setUpdateStatus] = useState({ type: '', msg: '' });

  // Delete state
  const [deleteId, setDeleteId] = useState('');
  const [deleteStatus, setDeleteStatus] = useState({ type: '', msg: '' });
  const [confirmModal, setConfirmModal] = useState(false);

  // Orders state
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState({ type: '', msg: '' });

  // Update order status
  const [orderStatusId, setOrderStatusId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [orderStatusMsg, setOrderStatusMsg] = useState({ type: '', msg: '' });

  useEffect(() => {
    // Inject fonts
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
    ];
    const fontLinks = fonts.map(href => {
      const existing = document.querySelector(`link[href="${href}"]`);
      if (existing) return null;
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = href;
      document.head.appendChild(link);
      return link;
    }).filter(Boolean);

    // Inject admin CSS
    const style = document.createElement('style');
    style.id = 'admin-styles';
    style.textContent = adminCSS;
    document.head.appendChild(style);
    document.body.classList.add('admin-body');
    loadProducts();
    return () => {
      fontLinks.forEach(l => document.head.removeChild(l));
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
      (p.proName || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(q.toLowerCase())
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
    formData.append('proName', proName);
    formData.append('proDescrption', proDescrption);
    formData.append('price', String(Number(price)));
    formData.append('stock', String(Number(stock)));
    formData.append('category', category);
    formData.append('color', color || '');
    formData.append('storage', storage || '');
    formData.append('image', uploadFile);

    setUploadStatus({ type: 'loading', msg: 'Uploading product…' });
    try {
      const res = await fetch(`${SERVER_URL}/products/upload`, { method: 'POST', headers: authHeaders(), body: formData });
      const data = await res.json();
      if (res.ok) {
        const name = data.product?.proName || data.proName || proName;
        setUploadStatus({ type: 'success', msg: `✓ Product uploaded successfully! — ${name}` });
        showToast('Product uploaded!');
        setUploadFields({ proName: '', proDescrption: '', price: '', stock: '', category: '', color: '', storage: '' });
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
        const name = data.product?.proName || data.proName || '';
        setUpdateStatus({ type: 'success', msg: `✓ Product updated!${name ? ' — ' + name : ''}` });
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
    pending: allOrders.filter(o => (o.status || '').toLowerCase() === 'pending').length,
    completed: allOrders.filter(o => ['paid', 'completed'].includes((o.status || '').toLowerCase())).length,
    revenue: allOrders.reduce((s, o) => s + ((o.productId?.price || 0) * (o.quantity || 1)), 0)
  };

  const navItems = [
    { id: 'products', label: 'All Products', section: 'Products', icon: 'inventory_2' },
    { id: 'upload', label: 'Upload Product', section: 'Products', icon: 'upload' },
    { id: 'update', label: 'Update Product', section: 'Products', icon: 'edit' },
    { id: 'delete', label: 'Delete Product', section: 'Products', icon: 'delete' },
    { id: 'orders', label: 'All Orders', section: 'Orders', icon: 'receipt_long' },
    { id: 'updateOrder', label: 'Update Order Status', section: 'Orders', icon: 'published_with_changes' },
  ];

  return (
    <div>
      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <button className={`hamburger-btn${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(p => !p)}>
          <span></span><span></span><span></span>
        </button>
        <span className="mobile-topbar-title">M-MARKET Admin</span>
        <Link to="/" className="mobile-store-link">← Store</Link>
      </div>

      {sidebarOpen && <div className="sidebar-overlay is-open" onClick={() => setSidebarOpen(false)}></div>}

      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? ' is-open' : ''}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">M</div>
            <div>
              <div className="logo-title">M-MARKET</div>
              <div className="logo-sub">Admin Panel</div>
            </div>
          </div>

          {['Products', 'Orders'].map(section => (
            <React.Fragment key={section}>
              <div className="nav-section-label" style={section === 'Orders' ? { marginTop: '20px' } : {}}>{section}</div>
              <nav>
                {navItems.filter(n => n.section === section).map(n => (
                  <button key={n.id} className={`nav-item${activePage === n.id ? ' active' : ''}`}
                    onClick={() => { setActivePage(n.id); setSidebarOpen(false); }}>
                    <span className="material-symbols-outlined nav-icon">{n.icon}</span>
                    {n.label}
                  </button>
                ))}
              </nav>
            </React.Fragment>
          ))}

          <div className="sidebar-footer">
            <div className="admin-dot"></div>
            <span style={{ fontSize: '11px', color: '#444', fontWeight: 600 }}>Admin</span>
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
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
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
                <div className="form-group"><label>Product Name <span className="req">*</span></label><input type="text" placeholder="e.g. iPhone 15 Pro" value={uploadFields.proName} onChange={e => setUploadFields(p => ({ ...p, proName: e.target.value }))} /></div>
                <div className="form-group">
                  <label>Category <span className="req">*</span></label>
                  <select value={uploadFields.category} onChange={e => setUploadFields(p => ({ ...p, category: e.target.value }))}>
                    <option value="">Select category…</option>
                    <option value="phone">Phone</option>
                    <option value="laptop">Laptop</option>
                    <option value="ipad">iPad / Tablet</option>
                    <option value="watch">Watch</option>
                    <option value="AirPods">AirPods</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Description <span className="req">*</span></label><textarea placeholder="Describe the product…" value={uploadFields.proDescrption} onChange={e => setUploadFields(p => ({ ...p, proDescrption: e.target.value }))} /></div>
              <div className="form-row four">
                <div className="form-group"><label>Price (USD) <span className="req">*</span></label><input type="number" placeholder="0.00" value={uploadFields.price} onChange={e => setUploadFields(p => ({ ...p, price: e.target.value }))} /></div>
                <div className="form-group"><label>Stock <span className="req">*</span></label><input type="number" placeholder="0" value={uploadFields.stock} onChange={e => setUploadFields(p => ({ ...p, stock: e.target.value }))} /></div>
                <div className="form-group"><label>Color</label><input type="text" placeholder="Black, White…" value={uploadFields.color} onChange={e => setUploadFields(p => ({ ...p, color: e.target.value }))} /></div>
                <div className="form-group"><label>Storage</label><input type="text" placeholder="128GB…" value={uploadFields.storage} onChange={e => setUploadFields(p => ({ ...p, storage: e.target.value }))} /></div>
              </div>
              <div className="form-group">
                <label>Product Image <span className="req">*</span></label>
                {!uploadFile ? (
                  <div className="upload-zone" onClick={() => document.getElementById('uploadFileInput').click()}>
                    <input type="file" id="uploadFileInput" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleUploadFile(e.target.files[0])} />
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
                <button className="btn btn-ghost" onClick={() => { setUploadFields({ proName: '', proDescrption: '', price: '', stock: '', category: '', color: '', storage: '' }); setUploadFile(null); setUploadPreview(''); setUploadStatus({ type: '', msg: '' }); }}>Clear</button>
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
                  <button className="btn btn-ghost" onClick={() => navigator.clipboard.readText().then(t => setUpdateId(t.trim())).catch(() => { })}>Paste</button>
                </div>
              </div>
              <div className="section-divider"><span>Fields to update — leave blank to keep existing value</span></div>
              <div className="form-row two">
                <div className="form-group"><label>Product Name</label><input type="text" placeholder="Leave blank to keep current" value={updateFields.proName} onChange={e => setUpdateFields(p => ({ ...p, proName: e.target.value }))} /></div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={updateFields.category} onChange={e => setUpdateFields(p => ({ ...p, category: e.target.value }))}>
                    <option value="">— Keep current —</option>
                    <option value="phone">Phone</option>
                    <option value="laptop">Laptop</option>
                    <option value="ipad">iPad / Tablet</option>
                    <option value="watch">Watch</option>
                    <option value="AirPods">AirPods</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Description</label><textarea placeholder="Leave blank to keep current" value={updateFields.proDescrption} onChange={e => setUpdateFields(p => ({ ...p, proDescrption: e.target.value }))} /></div>
              <div className="form-row four">
                <div className="form-group"><label>Price</label><input type="number" placeholder="e.g. 999.00" value={updateFields.price} onChange={e => setUpdateFields(p => ({ ...p, price: e.target.value }))} /></div>
                <div className="form-group"><label>Stock</label><input type="number" placeholder="e.g. 50" value={updateFields.stock} onChange={e => setUpdateFields(p => ({ ...p, stock: e.target.value }))} /></div>
                <div className="form-group"><label>Color</label><input type="text" placeholder="e.g. Black" value={updateFields.color} onChange={e => setUpdateFields(p => ({ ...p, color: e.target.value }))} /></div>
                <div className="form-group"><label>Storage</label><input type="text" placeholder="e.g. 256GB" value={updateFields.storage} onChange={e => setUpdateFields(p => ({ ...p, storage: e.target.value }))} /></div>
              </div>
              <div className="form-group">
                <label>Replace Image <span className="optional">(optional)</span></label>
                {!updateFile ? (
                  <div className="upload-zone" onClick={() => document.getElementById('updateFileInput').click()}>
                    <input type="file" id="updateFileInput" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) { const f = e.target.files[0]; const r = new FileReader(); r.onload = ev => setUpdatePreview(ev.target.result); r.readAsDataURL(f); setUpdateFile(f); } }} />
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
                <button className="btn btn-ghost" onClick={() => { setUpdateId(''); setUpdateFields({ proName: '', proDescrption: '', price: '', stock: '', category: '', color: '', storage: '' }); setUpdateFile(null); setUpdatePreview(''); setUpdateStatus({ type: '', msg: '' }); }}>Clear</button>
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
                  <button className="btn btn-ghost" onClick={() => navigator.clipboard.readText().then(t => setDeleteId(t.trim())).catch(() => { })}>Paste</button>
                </div>
              </div>
              <div className="alert alert-warning">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                This action is <strong>permanent</strong>. The product record and its image will be deleted from storage.
              </div>
              <div className="form-actions">
                <button className="btn btn-danger" onClick={() => { if (!deleteId.trim()) { setDeleteStatus({ type: 'error', msg: '✕ Please enter a Product ID.' }); return; } setConfirmModal(true); }}>🗑 Delete Product</button>
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
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
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
                      const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
                      const orderId = (order._id || '').toString();
                      const statusCls = { pending: 'status-pending', paid: 'status-paid', completed: 'status-completed', cancelled: 'status-cancelled', shipped: 'status-shipped' }[status] || 'status-pending';
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
                  <button className="btn btn-ghost" onClick={() => navigator.clipboard.readText().then(t => setOrderStatusId(t.trim())).catch(() => { })}>Paste</button>
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
                    <svg className="status-card-check" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                  </label>
                ))}
              </div>
              <StatusMsg status={orderStatusMsg} />
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => { setOrderStatusId(''); setSelectedStatus(''); setOrderStatusMsg({ type: '', msg: '' }); }}>Clear</button>
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
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2" /></svg>
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