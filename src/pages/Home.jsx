import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import PageTransition from '../components/PageTransition';
import { SkeletonProductCard } from '../components/Skeletons';
import '../styles/Home.css';

const SERVER_URL = 'https://m-market-2.onrender.com';

const COMING_SOON = [
  { name: 'Sonic Pro G2',    desc: 'Immersive 360° Wireless Sound',  price: '$299',   img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
  { name: 'Lumina 4K Laser', desc: 'Ultra Short Throw Home Cinema',  price: '$1,499', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80' },
  { name: 'Aura ANC Pro',    desc: 'Pure Silence, Pure Sound',       price: '$349',   img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80' },
  { name: 'ProShot X4',      desc: 'Professional DSLR Excellence',   price: '$1,199', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80' },
  { name: 'Nexus Home Hub',  desc: 'The Heart of Your Smart Home',   price: '$199',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
];

const CATEGORIES = [
  { key: 'phone',   label: 'Smartphones', icon: 'smartphone' },
  { key: 'laptop',  label: 'Laptops',     icon: 'laptop' },
  { key: 'ipad',    label: 'Tablets',     icon: 'tablet' },
  { key: 'AirPods', label: 'AirPods',     icon: 'headphones' },
  { key: 'watch',   label: 'Watches',     icon: 'watch' },
];

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Home() {
  const [products,        setProducts]        = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [searchResults,   setSearchResults]   = useState([]);
  const [searchLoading,   setSearchLoading]   = useState(false);
  const [searchMsg,       setSearchMsg]       = useState('');
  const [catResults,      setCatResults]      = useState([]);
  const [catLoading,      setCatLoading]      = useState(false);
  const [activeCategory,  setActiveCategory]  = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useReveal();
  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const res  = await fetch(`${SERVER_URL}/products/get-all-products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { setProducts([]); }
    finally  { setLoadingProducts(false); }
  }

  async function openProduct(id) {
    try {
      const res     = await fetch(`${SERVER_URL}/products/get-product-detail/${id}`);
      const product = await res.json();
      setSelectedProduct(product);
    } catch {}
  }

  async function doSearch() {
    const q = searchQuery.trim();
    if (!q) { setSearchResults([]); setSearchMsg(''); return; }
    setSearchLoading(true);
    setSearchMsg('');
    try {
      const res  = await fetch(`${SERVER_URL}/products/search-products?key=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) { setSearchMsg(data.message || 'Error'); setSearchResults([]); return; }
      setSearchResults(Array.isArray(data) ? data : []);
      if (!data.length) setSearchMsg(`No products found for "${q}"`);
    } catch { setSearchMsg('Connection error. Please try again.'); }
    finally  { setSearchLoading(false); }
  }

  async function filterCategory(key) {
    setActiveCategory(key);
    setCatLoading(true);
    setCatResults([]);
    try {
      const res  = await fetch(`${SERVER_URL}/products/search-products?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      setCatResults(Array.isArray(data) ? data : []);
    } catch {}
    finally { setCatLoading(false); }
  }

  return (
    <PageTransition>
      <Header />

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="wrap hero-inner">
          <div className="hero-text">
            <span className="hero-pill">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>bolt</span>
              Premium Electronics Store
            </span>
            <h1 className="hero-h1">The future of tech<br /><span className="hero-accent">starts here.</span></h1>
            <p className="hero-sub">Discover cutting-edge smartphones, laptops, audio gear and more. Quality guaranteed. Fast delivery. Unbeatable prices.</p>
            <div className="hero-btns">
              <a href="#products" className="btn-primary">
                <span className="material-symbols-outlined">storefront</span>
                Shop Now
              </a>
              <a href="#category" className="btn-ghost">
                <span className="material-symbols-outlined">grid_view</span>
                Browse Categories
              </a>
            </div>
            <div className="hero-stats">
              <div className="hstat"><strong>500+</strong><span>Products</span></div>
              <div className="hstat-div" />
              <div className="hstat"><strong>10K+</strong><span>Customers</span></div>
              <div className="hstat-div" />
              <div className="hstat"><strong>24/7</strong><span>Support</span></div>
            </div>
          </div>
          <div className="hero-img-wrap">
            <div className="hero-img-glow" />
            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80" alt="Premium electronics" className="hero-img" />
          </div>
        </div>
      </section>

      {/* ── COMING SOON ── */}
      <section className="cs-section reveal">
        <div className="wrap">
          <div className="section-head">
            <span className="section-label">Coming Soon</span>
            <h2 className="section-title">Future Tech Arrivals</h2>
            <p className="section-sub">Be the first to experience next-gen innovation.</p>
          </div>
          <div className="cs-track">
            {COMING_SOON.map((p, i) => (
              <div className="cs-card" key={i}>
                <div className="cs-img">
                  <img src={p.img} alt={p.name} />
                  <span className="cs-pill">Coming Soon</span>
                </div>
                <div className="cs-info">
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <span className="cs-price">Expected {p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <section id="search" className="search-section reveal">
        <div className="wrap">
          <div className="section-head">
            <span className="section-label">Search</span>
            <h2 className="section-title">Find Your Product</h2>
            <p className="section-sub">Search by name, color, storage, or category.</p>
          </div>
          <div className="search-bar">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="e.g. iPhone, black, 256GB..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); if (!e.target.value.trim()) { setSearchResults([]); setSearchMsg(''); } }}
              onKeyPress={e => e.key === 'Enter' && doSearch()}
            />
            <button className={`search-btn${searchLoading ? ' btn-loading' : ''}`} onClick={doSearch} disabled={searchLoading}>
              {searchLoading ? '' : 'Search'}
            </button>
          </div>
          {searchMsg && <p className="search-msg">{searchMsg}</p>}
          {searchLoading && (
            <div className="product-grid">{[1,2,3,4].map(i => <SkeletonProductCard key={i} />)}</div>
          )}
          {!searchLoading && searchResults.length > 0 && (
            <>
              <p className="results-count">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</p>
              <div className="product-grid">
                {searchResults.map((item, i) => (
                  <div key={item._id || item.id} className="fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <ProductCard product={item} onViewDetails={openProduct} badge="RESULT" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section id="products" className="products-section reveal">
        <div className="wrap">
          <div className="section-head">
            <span className="section-label">Catalog</span>
            <h2 className="section-title">Featured Electronics</h2>
            <p className="section-sub">Our latest collection of high-performance gadgets.</p>
          </div>
          {loadingProducts ? (
            <div className="product-grid">{[1,2,3,4,5,6,7,8].map(i => <SkeletonProductCard key={i} />)}</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#333', display: 'block', marginBottom: '14px' }}>inventory_2</span>
              <p>No products available right now.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p, i) => (
                <div key={p._id || p.id} className="fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProductCard product={p} onViewDetails={openProduct} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORY ── */}
      <section id="category" className="cat-section reveal">
        <div className="wrap">
          <div className="section-head">
            <span className="section-label">Browse</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-sub">Pick a category to explore our full range.</p>
          </div>
          <div className="cat-pills">
            {CATEGORIES.map(({ key, label, icon }) => (
              <button key={key} className={`cat-pill${activeCategory === key ? ' cat-pill-active' : ''}`} onClick={() => filterCategory(key)}>
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </button>
            ))}
            {activeCategory && (
              <button className="cat-pill cat-pill-clear" onClick={() => { setActiveCategory(''); setCatResults([]); }}>
                <span className="material-symbols-outlined">close</span>
                Clear
              </button>
            )}
          </div>
          {catLoading && (
            <div className="product-grid">{[1,2,3,4].map(i => <SkeletonProductCard key={i} />)}</div>
          )}
          {!catLoading && catResults.length > 0 && (
            <>
              <p className="results-count">{catResults.length} product{catResults.length !== 1 ? 's' : ''} in <strong>{activeCategory}</strong></p>
              <div className="product-grid">
                {catResults.map((item, i) => (
                  <div key={item._id || item.id} className="fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <ProductCard product={item} onViewDetails={openProduct} badge={item.category} />
                  </div>
                ))}
              </div>
            </>
          )}
          {!catLoading && activeCategory && catResults.length === 0 && (
            <div className="empty-state">
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#333', display: 'block', marginBottom: '14px' }}>search_off</span>
              <p>No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about-section reveal">
        <div className="wrap about-inner">
          <div className="about-img-wrap">
            <img src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=700&q=80" alt="M-Market store" />
          </div>
          <div className="about-text">
            <span className="section-label">Who We Are</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>Your Trusted Partner in Modern Electronics</h2>
            <p className="about-desc">At M-Market Electronics, we don't just sell gadgets — we provide the tools for your digital success. Bridging the gap between complex technology and everyday convenience since 2024.</p>
            <ul className="about-list">
              <li>
                <span className="about-check"><span className="material-symbols-outlined">check</span></span>
                Every device is 100% certified and tested
              </li>
              <li>
                <span className="about-check"><span className="material-symbols-outlined">check</span></span>
                World-class innovation delivered to your doorstep
              </li>
              <li>
                <span className="about-check"><span className="material-symbols-outlined">check</span></span>
                Expert support team available 24/7
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer" className="footer">
        {/* Top wave divider */}
        <div className="footer-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#0d0d14"/>
          </svg>
        </div>

        <div className="footer-main">
          <div className="wrap footer-grid">

            {/* Brand column */}
            <div className="fcol fcol-brand">
              <div className="footer-logo-wrap">
                <span className="footer-logo">M-MARKET</span>
                <span className="footer-sub">ELECTRONICS</span>
              </div>
              <p className="footer-desc">
                Your trusted destination for premium electronics. Genuine products, fast delivery, and unbeatable prices — since 2024.
              </p>
              {/* Social links */}
              <div className="footer-socials">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter / X">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/>
                  </svg>
                </a>
                <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="social-btn" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Shop column */}
            <div className="fcol">
              <h4 className="fcol-title">Shop</h4>
              <ul className="fcol-links">
                <li><a href="#products">All Products</a></li>
                <li><a href="#category" onClick={() => {}}>Smartphones</a></li>
                <li><a href="#category">Laptops</a></li>
                <li><a href="#category">Tablets</a></li>
                <li><a href="#category">Watches</a></li>
                <li><a href="#category">AirPods</a></li>
              </ul>
            </div>

            {/* Company column */}
            <div className="fcol">
              <h4 className="fcol-title">Company</h4>
              <ul className="fcol-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#about">Our Story</a></li>
                <li><a href="#footer">Contact</a></li>
                <li><a href="#footer">Careers</a></li>
                <li><a href="#footer">Press</a></li>
              </ul>
            </div>

            {/* Support column */}
            <div className="fcol">
              <h4 className="fcol-title">Support</h4>
              <ul className="fcol-links">
                <li><a href="#footer">Help Center</a></li>
                <li><a href="#footer">Shipping Policy</a></li>
                <li><a href="#footer">Returns & Refunds</a></li>
                <li><a href="#footer">Track My Order</a></li>
                <li><a href="#footer">Privacy Policy</a></li>
                <li><a href="#footer">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact column */}
            <div className="fcol">
              <h4 className="fcol-title">Contact Us</h4>
              <ul className="fcol-contact-list">
                <li>
                  <span className="material-symbols-outlined">mail</span>
                  <a href="mailto:Mmarket@gmail.com">Mmarket@gmail.com</a>
                </li>
                <li>
                  <span className="material-symbols-outlined">call</span>
                  <a href="tel:+1234567890">+1 (234) 567-890</a>
                </li>
                <li>
                  <span className="material-symbols-outlined">location_on</span>
                  <span>123 Tech Street,<br/>Silicon Valley, CA</span>
                </li>
                <li>
                  <span className="material-symbols-outlined">schedule</span>
                  <span>Mon–Sat: 9am – 8pm</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="wrap footer-bottom-inner">
            <span className="footer-copy">© 2026 M-Market Electronics. All rights reserved.</span>
            <div className="footer-badges">
              <span className="footer-badge">
                <span className="material-symbols-outlined">verified_user</span>Secure Checkout
              </span>
              <span className="footer-badge">
                <span className="material-symbols-outlined">local_shipping</span>Fast Delivery
              </span>
              <span className="footer-badge">
                <span className="material-symbols-outlined">replay</span>Easy Returns
              </span>
            </div>
            <div className="footer-legal">
              <a href="#footer">Privacy</a>
              <a href="#footer">Terms</a>
              <a href="#footer">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODAL — always last, outside all sections ── */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </PageTransition>
  );
}