import AswendLogo from '@/assets/Aswenna Logo.png';
import '@/styles/Login.css';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="login-container">
        <div className="login-content">
          <div className="login-form-section">
            <div className="logo-container">
              <img src="/logo.png" alt="Aswenna Logo" className="logo" />
            </div>

            <div className="form-wrapper">
              <h1 className="login-title">Check Your Email</h1>
              <p className="login-subtitle">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>

              <Link to="/login" className="login-button" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                Back to Login
              </Link>
            </div>
          </div>

          <div className="illustration-section">
            <div className="illustration-image" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-section">
          <div className="logo-container">
              <img src={AswendLogo} alt="Aswenna Logo" className="logo" />
          </div>

          <div className="form-wrapper">
            <h1 className="login-title">Forgot Password?</h1>
            <p className="login-subtitle">
              Enter your email address and we'll send you instructions to reset your password
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="login-button">
                Send Reset Link
              </button>
            </form>

            <div className="signup-prompt">
              <Link to="/login" className="signup-link">
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        <div className="illustration-section">
          <div className="illustration-image" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
