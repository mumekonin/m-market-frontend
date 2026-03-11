import React from 'react';

export function SkeletonProductCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-sub"></div>
      <div className="skeleton skeleton-price"></div>
      <div className="skeleton skeleton-btn"></div>
    </div>
  );
}

export function SkeletonOrderCard() {
  return (
    <div className="skeleton-order">
      <div className="skeleton-order-head">
        <div className="skeleton" style={{ width: '140px', height: '18px', borderRadius: '6px' }}></div>
        <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '20px' }}></div>
      </div>
      <div className="skeleton-order-body">
        <div className="skeleton skeleton-order-img"></div>
        <div className="skeleton-order-info">
          <div className="skeleton" style={{ height: '18px', width: '60%' }}></div>
          <div className="skeleton" style={{ height: '13px', width: '80%' }}></div>
          <div className="skeleton" style={{ height: '13px', width: '50%' }}></div>
        </div>
        <div className="skeleton skeleton-order-price"></div>
      </div>
    </div>
  );
}
