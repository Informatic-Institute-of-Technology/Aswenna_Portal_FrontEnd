import AswendLogo from "@/assets/Aswenna Logo.png";
import farmerImage from "@/assets/farmer-signup.png";
import { otpService } from "@/services";
import "@/styles/Signup.css";
import { CircularProgress } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../shared/components/Notification";
import { useNotification } from "../shared/hooks/useNotification";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();
  const { notification, showError, showSuccess, hideNotification } =
    useNotification();

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError("Password must contain at least one special character");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirmPass: string): boolean => {
    if (!confirmPass) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (confirmPass !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleEmailBlur = () => {
    if (email) {
      validateEmail(email);
    }
  };

  const handlePasswordBlur = () => {
    if (password) {
      validatePassword(password);
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError && value) {
      validateEmail(value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError && value) {
      validatePassword(value);
    }

    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (confirmPasswordError && value) {
      validateConfirmPassword(value);
    }
  };

  const getPasswordStrength = (): string => {
    if (!password) return "";
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    return "strong";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      showError("Please fix all validation errors before submitting");
      return;
    }

    setLoading(true);
    try {
      await otpService.sendOTP(email);

      localStorage.setItem("temp_email", email);
      localStorage.setItem("temp_password", password);

      showSuccess(
        "Verification code sent to your email. Please check your inbox!",
      );
      setTimeout(() => {
        navigate("/verify-email", { state: { email } });
      }, 1500);
    } catch (err) {
      const errorMsg =
        err instanceof Error && err.message
          ? err.message
          : "Failed to send verification code. Please try again.";
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="left-container">
          <img
            src={farmerImage}
            alt="Farmer Illustration"
            className="illustration-image"
          />
        </div>

        <div className="signup-form-section">
          <div className="logo-container">
            <img src={AswendLogo} alt="Aswenna Logo" className="logo" />
          </div>

          <div className="form-wrapper">
            <h1 className="signup-title">Sign Up</h1>
            <p className="signup-subtitle">Enter your account details</p>

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g., farmer@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  className={`form-input ${emailError ? "error" : ""}`}
                  autoComplete="email"
                  aria-label="Email address"
                  disabled={loading}
                />
                {emailError && (
                  <span className="field-error">{emailError}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    className={`form-input ${passwordError ? "error" : ""}`}
                    autoComplete="new-password"
                    aria-label="Password"
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
                {passwordError && (
                  <span className="field-error">{passwordError}</span>
                )}
                {password && !passwordError && (
                  <div className="password-strength">
                    <span className={`strength-indicator ${passwordStrength}`}>
                      {passwordStrength === "weak" && "Weak"}
                      {passwordStrength === "medium" && "Medium"}
                      {passwordStrength === "strong" && "Strong"}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur}
                    className={`form-input ${confirmPasswordError ? "error" : ""}`}
                    autoComplete="new-password"
                    aria-label="Confirm password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    tabIndex={0}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {confirmPasswordError && (
                  <span className="field-error">{confirmPasswordError}</span>
                )}
              </div>

              <button
                type="submit"
                className="signup-button"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="success" />
                ) : (
                  "Sign up!"
                )}
              </button>
            </form>

            <div className="login-link-container">
              <span className="login-text">Already have an account? </span>
              <Link to="/login" className="login-link">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>

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

export default Signup;
