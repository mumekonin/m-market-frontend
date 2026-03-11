import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(prev => {
      document.body.style.overflow = !prev ? 'hidden' : 'auto';
      return !prev;
    });
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <header className="site-header">
      {/* Dark overlay behind mobile nav */}
      <div
        className={`nav-overlay${menuOpen ? ' is-open' : ''}`}
        onClick={closeMenu}
      />

      <div className="container">
        <div className="brand">
          <Link to="/" className="logo-link">M-MARKET</Link>
          <span className="logo-subtext">ELECTRONICS</span>
        </div>

        <div className={`nav-wrapper${menuOpen ? ' is-open' : ''}`} id="nav-wrapper">
          <nav>
            <ul className="nav-list">
              <li><a href="#home" className="nav-link" onClick={closeMenu}>Home</a></li>
              <li><a href="#products" className="nav-link" onClick={closeMenu}>Our Products</a></li>
              <li><a href="#category" className="nav-link" onClick={closeMenu}>Category</a></li>
              <li><a href="#about" className="nav-link" onClick={closeMenu}>About</a></li>
              <li><a href="#footer" className="nav-link" onClick={closeMenu}>Contact</a></li>
            </ul>
          </nav>

          <div className="auth-group">
            {isLoggedIn ? (
              <div className="profile-wrapper" ref={dropdownRef}>
                <button
                  className="profile-btn"
                  onClick={(e) => { e.stopPropagation(); setDropdownOpen(p => !p); }}
                >
                  👤 Profile
                </button>
                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <Link to="/my-orders" className="dropdown-orders-link" onClick={() => setDropdownOpen(false)}>
                      📦 My Orders
                    </Link>
                    <button className="logout-btn" onClick={handleLogout}>🚪 Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="login-link" onClick={closeMenu}>Log In</Link>
                <Link to="/registration" className="signup-btn" onClick={closeMenu}>Sign Up</Link>
              </>
            )}
          </div>
        </div>

        <button
          className={`menu-btn${menuOpen ? ' is-active' : ''}`}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>
      </div>
    </header>
  );
}