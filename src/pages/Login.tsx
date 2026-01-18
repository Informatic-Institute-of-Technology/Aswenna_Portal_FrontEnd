import AswendLogo from '@/assets/Aswenna Logo.png';
import loginImage from '@/assets/Loging Image.png';
import { useAuth } from '@/Context/useAuth';
import '@/styles/Login.css';
import { CircularProgress } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-section m">
          <div className="logo-container">
            <img src={AswendLogo} alt="Aswenna Logo" className="logo" />
          </div>

          <div className="form-wrapper">
            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">Enter your account details</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="visually-hidden">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="nimsaraofficial@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  autoComplete="email"
                  aria-label="Email address"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="visually-hidden">Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    autoComplete="current-password"
                    aria-label="Password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="forgot-password-container">
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? <CircularProgress size={20} color="success" /> : 'Login'}
              </button>
            </form>

            <div className="signup-prompt">
              <span>Don't have an account? </span>
              <button 
                type="button"
                onClick={() => navigate('/signup')}
                className="signup-button"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>

        <div className="illustration-section">
            <img src={loginImage} alt="Login Illustration" className="illustration-image" />
        </div>
      </div>
    </div>
  );
};

export default Login;
