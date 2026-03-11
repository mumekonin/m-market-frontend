import React, { useState } from 'react';

const SERVER_URL = 'https://m-market-2.onrender.com';

export default function ProductCard({ product, onViewDetails, badge }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = product.imageUrl
    ? `${SERVER_URL}/${product.imageUrl.replace(/\\/g, '/').replace(/^\//, '')}`
    : null;

  return (
    <div className="product-card">
      <div className="product-card-img-wrap">
        {imgSrc && !imgError ? (
          <img src={imgSrc} alt={product.proName} onError={() => setImgError(true)} />
        ) : (
          <div className="product-card-img-placeholder">📦</div>
        )}
        {badge && <span className="product-card-badge">{badge}</span>}
      </div>
      <div className="product-card-body">
        <h3>{product.proName}</h3>
        {product.category && <span className="product-card-category">{product.category}</span>}
        <div className="product-price">${product.price?.toLocaleString()}</div>
        <button className="order-btn" onClick={() => onViewDetails(product._id || product.id)}>
          View Details
        </button>
      </div>
    </div>
  );
}
