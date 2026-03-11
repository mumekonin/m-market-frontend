import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import '../styles/Auth.css';

export default function Registration() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const shakeForm = () => {
    if (!formRef.current) return;
    formRef.current.classList.add('input-shake');
    setTimeout(() => formRef.current?.classList.remove('input-shake'), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://m-market-2.onrender.com/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      const result = await response.json();

      if (response.ok) {
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
        shakeForm();
      }
    } catch {
      setError('Cannot connect to server.');
      shakeForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <header className="site-header">
        <div className="container">
          <div className="brand">
            <Link to="/" className="logo-link">M-MARKET</Link>
            <span className="logo-subtext">ELECTRONICS</span>
          </div>
          <Link to="/" className="back-home">← Back to Store</Link>
        </div>
      </header>

      <div className="page-wrapper">
        <div className="brand-panel">
          <div className="brand-panel-logo">M-MARKET</div>
          <div className="brand-panel-sub">Electronics</div>
          <h2 className="brand-panel-tagline">Join our <span>growing</span> community of tech lovers</h2>
          <p className="brand-panel-desc">Create your account to place orders, track deliveries, and get access to exclusive deals.</p>
          <div className="brand-panel-dots"><span></span><span></span><span></span></div>
        </div>

        <div className="form-panel">
          <div className="form-inner" ref={formRef}>
            <p className="form-eyebrow">Get started</p>
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Join M-Market Electronics today</p>
            <div className="form-divider"></div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input type="text" id="fullName" placeholder="Enter your full name" required value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉</span>
                  <input type="email" id="email" placeholder="name@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input type="password" id="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" className={`submit-btn ripple-btn${loading ? ' btn-loading' : ''}`} disabled={loading}>
                {loading ? '' : 'Sign Up'}
              </button>
              <p className="auth-footer">
                Already have an account? <Link to="/login">Log In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
