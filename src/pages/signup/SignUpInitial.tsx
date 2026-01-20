import AswendLogo from "@/assets/Aswenna Logo.png";
import SignUpImage from "@/assets/SignUp Image.png";
import "@/styles/SignUp.css";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignUpInitialProps {
  onNext: (data: { email: string; password: string }) => void;
  initialData?: { email: string; password: string };
}

const SignUpInitial = ({ onNext, initialData }: SignUpInitialProps) => {
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    onNext({ email, password });
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        {/* Left Side - Image */}
        <div className="signup-image-section">
          <div className="signup-image-overlay">
            <img
              src={SignUpImage}
              alt="Sign Up Illustration"
              className="signup-illustration"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="signup-form-section">
          <div className="signup-logo-container">
            <img src={AswendLogo} alt="Aswenna Logo" className="signup-logo" />
          </div>

          <div className="signup-form-wrapper">
            <h1 className="signup-title">Sign Up</h1>
            <p className="signup-subtitle">Enter Your Account Details</p>

            {error && <div className="signup-error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="signup-form-group">
                <label htmlFor="email" className="signup-form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="signup-form-input"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="signup-form-group">
                <label htmlFor="password" className="signup-form-label">
                  Create Password
                </label>
                <div className="signup-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="signup-form-input"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="signup-password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="signup-form-group">
                <label htmlFor="confirmPassword" className="signup-form-label">
                  Confirm Password
                </label>
                <div className="signup-password-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="signup-form-input"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="signup-password-toggle"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="signup-button">
                Continue
              </button>
            </form>
            <div className="signup-footer">
              <span>Do you have an account? </span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="signup-login-button"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpInitial;
