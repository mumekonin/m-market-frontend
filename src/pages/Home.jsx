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
  { key: 'phone',   label: 'Smartphones', icon: '📱' },
  { key: 'laptop',  label: 'Laptops',     icon: '💻' },
  { key: 'ipad',    label: 'Tablets',     icon: '📟' },
  { key: 'AirPods', label: 'AirPods',     icon: '🎧' },
  { key: 'watch',   label: 'Watches',     icon: '⌚' },
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
      setProducts(Array.isArray(data) ? data.slice(0, 9) : []);
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
            <span className="hero-pill">⚡ Premium Electronics Store</span>
            <h1 className="hero-h1">The future of tech<br /><span className="hero-accent">starts here.</span></h1>
            <p className="hero-sub">Discover cutting-edge smartphones, laptops, audio gear and more. Quality guaranteed. Fast delivery. Unbeatable prices.</p>
            <div className="hero-btns">
              <a href="#products" className="btn-primary">Shop Now →</a>
              <a href="#category" className="btn-ghost">Browse Categories</a>
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
            <span className="section-label">COMING SOON</span>
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
            <span className="section-label">SEARCH</span>
            <h2 className="section-title">Find Your Product</h2>
            <p className="section-sub">Search by name, color, storage, or category.</p>
          </div>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
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
            <div className="product-grid">{[1,2,3].map(i => <SkeletonProductCard key={i} />)}</div>
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
            <span className="section-label">CATALOG</span>
            <h2 className="section-title">Featured Electronics</h2>
            <p className="section-sub">Our latest collection of high-performance gadgets.</p>
          </div>
          {loadingProducts ? (
            <div className="product-grid">{[1,2,3,4,5,6].map(i => <SkeletonProductCard key={i} />)}</div>
          ) : products.length === 0 ? (
            <div className="empty-state"><span>📦</span><p>No products available right now.</p></div>
          ) : (
            <div className="product-grid">
              {products.map((p, i) => (
                <div key={p._id || p.id} className="fade-in-up" style={{ animationDelay: `${i * 70}ms` }}>
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
            <span className="section-label">BROWSE</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-sub">Pick a category to explore our full range.</p>
          </div>
          <div className="cat-pills">
            {CATEGORIES.map(({ key, label, icon }) => (
              <button key={key} className={`cat-pill${activeCategory === key ? ' cat-pill-active' : ''}`} onClick={() => filterCategory(key)}>
                <span>{icon}</span> {label}
              </button>
            ))}
            {activeCategory && (
              <button className="cat-pill cat-pill-clear" onClick={() => { setActiveCategory(''); setCatResults([]); }}>
                ✕ Clear
              </button>
            )}
          </div>
          {catLoading && (
            <div className="product-grid">{[1,2,3].map(i => <SkeletonProductCard key={i} />)}</div>
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
            <div className="empty-state"><span>🔍</span><p>No products found in this category.</p></div>
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
            <span className="section-label">WHO WE ARE</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '16px' }}>Your Trusted Partner in Modern Electronics</h2>
            <p className="about-desc">At M-Market Electronics, we don't just sell gadgets — we provide the tools for your digital success. Bridging the gap between complex technology and everyday convenience since 2024.</p>
            <ul className="about-list">
              <li><span className="about-check">✓</span> Every device is 100% certified and tested</li>
              <li><span className="about-check">✓</span> World-class innovation delivered to your doorstep</li>
              <li><span className="about-check">✓</span> Expert support team available 24/7</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="footer" className="footer">
        <div className="wrap footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">M-MARKET</span>
            <span className="footer-tagline">ELECTRONICS</span>
          </div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#products">Products</a>
            <a href="#category">Categories</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-contact">
            <a href="mailto:Mmarket@gmail.com">Mmarket@gmail.com</a>
            <span>© 2026 M-Market Electronics. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* ── MODAL — rendered last, outside every section ── */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

    </PageTransition>
  );
}