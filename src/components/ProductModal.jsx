import React, { useState, useEffect } from 'react';

const SERVER_URL = 'https://m-market-2.onrender.com';

export default function ProductModal({ product, onClose }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [qty, setQty] = useState(1);
  const [screenshot, setScreenshot] = useState(null);
  const [imgError, setImgError] = useState(false);



  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!product) return null;

  const cleanPath = product.imageUrl?.replace(/\\/g, '/').replace(/^\//, '');
  const imgSrc = cleanPath ? `${SERVER_URL}/${cleanPath}` : null;

  const handleBuyNow = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) { alert('Please login first!'); return; }
    if (!screenshot) { alert('Screenshot required!'); return; }

    const formData = new FormData();
    formData.append('productId', product._id || product.id);
    formData.append('quantity', qty);
    formData.append('image', screenshot);

    try {
      const response = await fetch(`${SERVER_URL}/orders/create-order`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (response.ok) {
        alert('Order placed successfully!');
        onClose();
      } else {
        const err = await response.json();
        alert('Error: ' + err.message);
      }
    } catch (e) {
      console.error('Order Error:', e);
    }
  };

  return (
    <>
      <div className="modal-overlay-bg active" onClick={onClose}></div>
      <div className="detail-modal">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        <div className="modal-body">
          <div className="modal-image-side">
            {imgSrc && !imgError ? (
              <img src={imgSrc} alt={product.proName} onError={() => setImgError(true)} />
            ) : (
              <div className="modal-img-placeholder">📦</div>
            )}
          </div>
          <div className="modal-info-side">
            <span className="spec-badge">Category: {product.category}</span>
            <h2 className="detail-title">{product.proName}</h2>
            <div className="detail-price">${product.price?.toLocaleString()}</div>
            <p className="detail-desc">{product.proDescrption}</p>
            <div className="detail-specs">
              {product.color && (
                <div className="detail-spec-row">
                  <span className="spec-label">Color</span>
                  <span className="spec-value">{product.color}</span>
                </div>
              )}
              {product.storage && (
                <div className="detail-spec-row">
                  <span className="spec-label">Storage</span>
                  <span className="spec-value">{product.storage}</span>
                </div>
              )}
            </div>
            {!showOrderForm ? (
              <button className="order-btn" onClick={() => setShowOrderForm(true)} style={{ padding: '15px', marginTop: '20px' }}>
                PLACE ORDER
              </button>
            ) : (
              <div className="order-form-section">
                <label>Quantity:</label>
                <input type="number" value={qty} min="1" onChange={e => setQty(e.target.value)} />
                <label>Payment Screenshot:</label>
                <input type="file" accept="image/*" onChange={e => setScreenshot(e.target.files[0])} />
                <button className="confirm-order-btn" onClick={handleBuyNow}>CONFIRM &amp; PAY</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}