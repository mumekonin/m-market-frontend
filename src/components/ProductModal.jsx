import React, { useState, useEffect } from 'react';

const SERVER_URL = 'https://m-market-2.onrender.com';

function buildImgUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  const clean = imageUrl.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${SERVER_URL}/${clean}`;
}

export default function ProductModal({ product, onClose }) {
  const [step,       setStep]       = useState('detail'); // 'detail' | 'order' | 'success'
  const [qty,        setQty]        = useState(1);
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imgError,   setImgError]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg,   setErrorMsg]   = useState('');

  // ESC to close
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!product) return null;

  const imgSrc = buildImgUrl(product.imageUrl);
  const total  = ((product.price || 0) * qty).toLocaleString();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMsg('');
  }

  async function handleConfirm() {
    const token = localStorage.getItem('userToken');
    if (!token)      { setErrorMsg('You must be logged in to place an order.'); return; }
    if (!screenshot) { setErrorMsg('Please upload your payment screenshot.'); return; }
    setErrorMsg('');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('productId', product._id || product.id);
      fd.append('quantity',  qty);
      fd.append('image',     screenshot);

      const res = await fetch(`${SERVER_URL}/orders/create-order`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    fd,
      });

      if (res.ok) {
        setStep('success');
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* ── OVERLAY ── */}
      <div className="pm-overlay" onClick={onClose} />

      {/* ── MODAL ── */}
      <div className="pm-modal" role="dialog" aria-modal="true">

        {/* Close */}
        <button className="pm-close" onClick={onClose} aria-label="Close modal">
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* ════════════ SUCCESS STATE ════════════ */}
        {step === 'success' && (
          <div className="pm-success">
            <div className="pm-success-ring">
              <span className="material-symbols-outlined pm-success-icon">check_circle</span>
            </div>
            <h2 className="pm-success-title">Order Placed!</h2>
            <p className="pm-success-sub">
              Your order for <strong>{product.proName}</strong> has been submitted.
              We'll review your payment and confirm shortly.
            </p>
            <div className="pm-success-card">
              <div className="pm-success-row">
                <span className="material-symbols-outlined">package_2</span>
                <span className="pm-success-row-label">Product</span>
                <span className="pm-success-row-val">{product.proName}</span>
              </div>
              <div className="pm-success-row">
                <span className="material-symbols-outlined">layers</span>
                <span className="pm-success-row-label">Quantity</span>
                <span className="pm-success-row-val">{qty}</span>
              </div>
              <div className="pm-success-row">
                <span className="material-symbols-outlined">payments</span>
                <span className="pm-success-row-label">Total</span>
                <span className="pm-success-row-val pm-success-total">${total}</span>
              </div>
            </div>
            <button className="pm-btn-primary pm-btn-wide" onClick={onClose}>
              <span className="material-symbols-outlined">storefront</span>
              Continue Shopping
            </button>
          </div>
        )}

        {/* ════════════ MAIN (detail + order) ════════════ */}
        {step !== 'success' && (
          <div className="pm-body">

            {/* ── LEFT — Product Image ── */}
            <div className="pm-left">
              {imgSrc && !imgError ? (
                <img
                  src={imgSrc}
                  alt={product.proName}
                  className="pm-product-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="pm-img-fallback">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
              )}
              <div className="pm-trust-badges">
                <span className="pm-trust-badge">
                  <span className="material-symbols-outlined">verified</span>
                  Genuine
                </span>
                <span className="pm-trust-badge">
                  <span className="material-symbols-outlined">local_shipping</span>
                  Fast Delivery
                </span>
                <span className="pm-trust-badge">
                  <span className="material-symbols-outlined">shield</span>
                  12M Warranty
                </span>
              </div>
            </div>

            {/* ── RIGHT — Info / Order Form ── */}
            <div className="pm-right">

              {/* ─── DETAIL STEP ─── */}
              {step === 'detail' && (
                <>
                  {/* Category */}
                  <div className="pm-cat-tag">
                    <span className="material-symbols-outlined">category</span>
                    {product.category}
                  </div>

                  {/* Name & Price */}
                  <h2 className="pm-title">{product.proName}</h2>
                  <div className="pm-price">${product.price?.toLocaleString()}</div>

                  {/* Description */}
                  {product.proDescrption && (
                    <p className="pm-desc">{product.proDescrption}</p>
                  )}

                  {/* Specs grid */}
                  <div className="pm-specs">
                    {product.color && (
                      <div className="pm-spec">
                        <span className="material-symbols-outlined">palette</span>
                        <div className="pm-spec-text">
                          <span className="pm-spec-label">Color</span>
                          <span className="pm-spec-val">{product.color}</span>
                        </div>
                      </div>
                    )}
                    {product.storage && (
                      <div className="pm-spec">
                        <span className="material-symbols-outlined">hard_drive</span>
                        <div className="pm-spec-text">
                          <span className="pm-spec-label">Storage</span>
                          <span className="pm-spec-val">{product.storage}</span>
                        </div>
                      </div>
                    )}
                    <div className="pm-spec">
                      <span className="material-symbols-outlined">local_shipping</span>
                      <div className="pm-spec-text">
                        <span className="pm-spec-label">Delivery</span>
                        <span className="pm-spec-val">2–4 Business Days</span>
                      </div>
                    </div>
                    <div className="pm-spec">
                      <span className="material-symbols-outlined">shield</span>
                      <div className="pm-spec-text">
                        <span className="pm-spec-label">Warranty</span>
                        <span className="pm-spec-val">12 Months</span>
                      </div>
                    </div>
                  </div>

                  <button className="pm-btn-primary pm-btn-wide" onClick={() => setStep('order')}>
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Place Order
                  </button>
                </>
              )}

              {/* ─── ORDER STEP ─── */}
              {step === 'order' && (
                <>
                  <button className="pm-back-btn" onClick={() => { setStep('detail'); setErrorMsg(''); }}>
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Details
                  </button>

                  <h2 className="pm-title" style={{ fontSize: '22px', marginBottom: '4px' }}>Complete Your Order</h2>
                  <p className="pm-desc" style={{ marginBottom: '20px' }}>{product.proName}</p>

                  {/* Quantity */}
                  <div className="pm-form-group">
                    <label className="pm-form-label">
                      <span className="material-symbols-outlined">layers</span>
                      Quantity
                    </label>
                    <div className="pm-qty">
                      <button className="pm-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                      <span className="pm-qty-num">{qty}</span>
                      <button className="pm-qty-btn" onClick={() => setQty(q => q + 1)}>
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                  </div>

                  {/* Order summary */}
                  <div className="pm-summary">
                    <div className="pm-summary-row">
                      <span>Unit Price</span>
                      <span>${product.price?.toLocaleString()}</span>
                    </div>
                    <div className="pm-summary-row">
                      <span>Quantity</span>
                      <span>× {qty}</span>
                    </div>
                    <div className="pm-summary-divider" />
                    <div className="pm-summary-row pm-summary-total">
                      <span>
                        <span className="material-symbols-outlined">receipt</span>
                        Total
                      </span>
                      <strong>${total}</strong>
                    </div>
                  </div>

                  {/* Upload */}
                  <div className="pm-form-group">
                    <label className="pm-form-label">
                      <span className="material-symbols-outlined">receipt_long</span>
                      Payment Screenshot
                    </label>
                    <label className="pm-upload">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="pm-upload-preview" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined pm-upload-icon">cloud_upload</span>
                          <span className="pm-upload-main">Click to upload payment proof</span>
                          <span className="pm-upload-hint">PNG, JPG — max 10 MB</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                    </label>
                    {previewUrl && (
                      <button className="pm-change-btn" onClick={() => { setScreenshot(null); setPreviewUrl(null); }}>
                        <span className="material-symbols-outlined">swap_horiz</span>
                        Change file
                      </button>
                    )}
                  </div>

                  {/* Error */}
                  {errorMsg && (
                    <div className="pm-error">
                      <span className="material-symbols-outlined">error</span>
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    className={`pm-btn-primary pm-btn-wide${submitting ? ' pm-btn-disabled' : ''}`}
                    onClick={handleConfirm}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <><span className="pm-spinner" /> Submitting…</>
                    ) : (
                      <><span className="material-symbols-outlined">check_circle</span> Confirm &amp; Pay</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}