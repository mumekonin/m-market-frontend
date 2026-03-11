import React, { useState } from 'react';

const SERVER_URL = 'https://m-market-2.onrender.com';

// Robust image URL builder — handles backslashes, leading slash, already-full URLs
function buildImgUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  const clean = imageUrl.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${SERVER_URL}/${clean}`;
}

export default function ProductCard({ product, onViewDetails, badge }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = buildImgUrl(product.imageUrl);

  return (
    <div className="pc-card">
      {/* Image */}
      <div className="pc-img-wrap">
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={product.proName}
            className="pc-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="pc-img-fallback">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
        )}
        {badge && <span className="pc-badge">{badge}</span>}
      </div>

      {/* Body */}
      <div className="pc-body">
        {product.category && (
          <div className="pc-category">
            <span className="material-symbols-outlined">category</span>
            {product.category}
          </div>
        )}
        <h3 className="pc-name">{product.proName}</h3>
        <div className="pc-price">${product.price?.toLocaleString()}</div>

        <button
          className="pc-btn"
          onClick={() => onViewDetails(product._id || product.id)}
        >
          <span className="material-symbols-outlined">visibility</span>
          View Details
        </button>
      </div>
    </div>
  );
}