import AswendLogo from "@/assets/Aswenna Logo.png";
import loginImage from "@/assets/Loging Image.png";
import { useAuth } from "@/Context/useAuth";
import "@/styles/Login.css";
import { CircularProgress } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppButton } from "../shared/components";
import Notification from "../shared/components/Notification";
import { useNotification } from "../shared/hooks/useNotification";
import AccountProcessingDialog from "./components/AccountProcessingDialog";

const INACTIVE_KEYWORDS = [
  "inactive",
  "pending",
  "processing",
  "not active",
  "under review",
];

const isAccountInactiveError = (msg: string) =>
  INACTIVE_KEYWORDS.some((kw) => msg.toLowerCase().includes(kw));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [inactiveDialog, setInactiveDialog] = useState(false);
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { notification, showError, hideNotification } = useNotification();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      const errorMsg = "Please fill in all fields";
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = "Please enter a valid email address";
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    try {
      await login(email, password);
      const sid = localStorage.getItem("session_id");
      navigate(`/${sid}/dashboard`);
    } catch (err) {
      let errorMsg = "An unexpected error occurred. Please try again.";
      if (err instanceof Error && err.message) {
        try {
          const parsed = JSON.parse(err.message) as {
            message?: string | string[];
            statusCode?: number;
          };
          if (parsed.message) {
            errorMsg = Array.isArray(parsed.message)
              ? parsed.message.join(" ")
              : parsed.message;
          }
        } catch {
          errorMsg = err.message;
        }
      }
      if (isAccountInactiveError(errorMsg)) {
        setInactiveDialog(true);
      } else {
        setError(errorMsg);
        showError(errorMsg);
      }
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
                <label htmlFor="email" className="visually-hidden">
                  Email Address
                </label>
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
                <label htmlFor="password" className="visually-hidden">
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              <AppButton
                type="submit"
                variant="success"
                size="md"
                fullWidth
                disabled={loading}
                className="login-button"
              >
                {loading ? (
                  <CircularProgress size={20} color="success" />
                ) : (
                  "Login"
                )}
              </AppButton>
            </form>

            <div className="signup-link-container">
              <span className="signup-text">Don't have an account? </span>
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className="right-container">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="illustration-image"
          />
        </div>
      </div>

      <AccountProcessingDialog
        open={inactiveDialog}
        onClose={() => setInactiveDialog(false)}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        duration={5000}
        onClose={hideNotification}
      />
    </div>
  );
};

export default Login;
