import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userToken'));
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const openMenu = () => {
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Our Products', href: '#products' },
    { label: 'Category', href: '#category' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#footer' },
  ];

  const s = {
    overlay: {
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 9998,
      opacity: menuOpen ? 1 : 0,
      pointerEvents: menuOpen ? 'all' : 'none',
      transition: 'opacity 0.3s ease',
    },
    drawer: {
      position: 'fixed', top: 0, right: 0,
      width: '75vw', maxWidth: '300px', height: '100vh',
      background: '#0d0d14',
      borderLeft: '1px solid rgba(243,168,28,0.15)',
      boxShadow: '-20px 0 60px rgba(0,0,0,0.9)',
      zIndex: 9999,
      transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      display: 'flex', flexDirection: 'column',
      padding: '80px 28px 40px',
      overflowY: 'auto',
    },
    link: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 8px', fontSize: '16px', fontWeight: 600,
      color: '#ccc', textDecoration: 'none',
      fontFamily: "'DM Sans', sans-serif",
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
    },
    loginBtn: {
      display: 'block', textAlign: 'center', padding: '14px',
      borderRadius: '50px', border: '1.5px solid rgba(243,168,28,0.6)',
      color: '#f3a81c', textDecoration: 'none', fontWeight: 700,
      fontSize: '15px', fontFamily: "'DM Sans', sans-serif",
      touchAction: 'manipulation', cursor: 'pointer',
    },
    signupBtn: {
      display: 'block', textAlign: 'center', padding: '14px',
      borderRadius: '50px', background: '#f3a81c',
      color: '#000', textDecoration: 'none', fontWeight: 700,
      fontSize: '15px', fontFamily: "'DM Sans', sans-serif",
      touchAction: 'manipulation', cursor: 'pointer',
    },
  };

  return (
    <>
      {createPortal(
        <>
          <div style={s.overlay} onClick={closeMenu} />
          <div style={s.drawer}>
            {/* X close button */}
            <button
              onClick={closeMenu}
              style={{
                position: 'absolute', top: '18px', right: '18px',
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#aaa', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 700,
                touchAction: 'manipulation',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f3a81c'; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#aaa'; }}
            >
              ✕
            </button>

            <nav style={{ marginBottom: '32px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {navLinks.map(item => (
                  <li key={item.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <a href={item.href} style={s.link} onClick={closeMenu}>
                      {item.label}
                      <span style={{ color: '#f3a81c', fontSize: '20px', lineHeight: 1 }}>›</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {isLoggedIn ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/my-orders" style={s.loginBtn} onClick={closeMenu}>📦 My Orders</Link>
                <button onClick={() => { closeMenu(); handleLogout(); }} style={{ ...s.loginBtn, border: '1.5px solid rgba(255,77,77,0.5)', color: '#ff4d4d', background: 'none' }}>
                  🚪 Log Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/login" style={s.loginBtn} onClick={closeMenu}>Log In</Link>
                <Link to="/registration" style={s.signupBtn} onClick={closeMenu}>Sign Up</Link>
              </div>
            )}
          </div>
        </>,
        document.body
      )}

      <header className="site-header">
        <div className="container">
          <div className="brand">
            <Link to="/" className="logo-link">M-MARKET</Link>
            <span className="logo-subtext">ELECTRONICS</span>
          </div>

          <div className="nav-wrapper">
            <nav>
              <ul className="nav-list">
                {navLinks.map(item => (
                  <li key={item.label}><a href={item.href} className="nav-link">{item.label}</a></li>
                ))}
              </ul>
            </nav>
            <div className="auth-group">
              {isLoggedIn ? (
                <div className="profile-wrapper" ref={dropdownRef}>
                  <button className="profile-btn" onClick={(e) => { e.stopPropagation(); setDropdownOpen(p => !p); }}>
                    👤 Profile
                  </button>
                  {dropdownOpen && (
                    <div className="profile-dropdown">
                      <Link to="/my-orders" className="dropdown-orders-link" onClick={() => setDropdownOpen(false)}>📦 My Orders</Link>
                      <button className="logout-btn" onClick={handleLogout}>🚪 Log Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="login-link">Log In</Link>
                  <Link to="/registration" className="signup-btn">Sign Up</Link>
                </>
              )}
            </div>
          </div>

          <button
            className={`menu-btn${menuOpen ? ' is-active' : ''}`}
            onClick={menuOpen ? closeMenu : openMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </header>
    </>
  );
}