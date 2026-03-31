import AswendLogo from "@/assets/Aswenna Logo.png";
import { otpService } from "@/services";
import "@/styles/EmailVerification.css";
import { CircularProgress, Step, StepLabel, Stepper } from "@mui/material";
import type { ClipboardEvent, FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "../shared/components/Notification";
import { useNotification } from "../shared/hooks/useNotification";

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { notification, showError, showSuccess, hideNotification } =
    useNotification();

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    const timerKey = `verification_timer_${email}`;
    const storedStartTime = localStorage.getItem(timerKey);

    if (storedStartTime) {
      const startTime = parseInt(storedStartTime, 10);
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remainingSeconds = Math.max(0, 300 - elapsedSeconds);

      setTimer(remainingSeconds);
      if (remainingSeconds === 0) {
        setCanResend(true);
      }
    } else {
      localStorage.setItem(timerKey, Date.now().toString());
    }
  }, [email]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newCode = [...code];
      if (newCode[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();

    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      showError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      await otpService.verifyOTP(email, verificationCode);

      const timerKey = `verification_timer_${email}`;
      localStorage.removeItem(timerKey);

      localStorage.setItem("email_verified", "true");

      showSuccess("Email verified successfully!");
      setTimeout(() => {
        navigate("/role-selection");
      }, 2000);
    } catch (err) {
      const errorMsg =
        err instanceof Error && err.message
          ? err.message
          : "Invalid verification code. Please try again.";
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      await otpService.resendOTP(email);

      showSuccess("Verification code resent to your email!");

      const timerKey = `verification_timer_${email}`;
      localStorage.setItem(timerKey, Date.now().toString());
      setTimer(300);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const errorMsg =
        err instanceof Error && err.message
          ? err.message
          : "Failed to resend code. Please try again.";
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-content">
        <div className="logo-container">
          <img src={AswendLogo} alt="Aswenna Logo" className="logo" />
        </div>

        <Stepper
          activeStep={1}
          alternativeLabel
          sx={{
            width: "100%",
            maxWidth: "400px",
            marginBottom: "1rem",
            "& .MuiStepConnector-line": {
              borderColor: "var(--neutral-700)",
            },
            "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
              borderColor: "var(--color-olive)",
            },
            "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
              borderColor: "var(--color-olive)",
            },
            "& .MuiStepLabel-label": {
              color: "var(--neutral-350)",
              marginTop: "0.5rem",
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "var(--color-olive)",
              fontWeight: 600,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "var(--color-olive)",
            },
            "& .MuiStepIcon-root": {
              color: "var(--neutral-700)",
              fontSize: "2.5rem",
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "var(--color-olive)",
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "var(--color-olive)",
            },
          }}
        >
          <Step completed={true}>
            <StepLabel>Sign Up</StepLabel>
          </Step>
          <Step>
            <StepLabel>Verify</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>

        <div className="verify-wrapper">
          <h1 className="verify-title">Email Verification</h1>
          <p className="verify-subtitle">
            Enter the 6-digit code sent to your email address.
          </p>
          {email && <p className="verify-email">{email}</p>}

          <form onSubmit={handleVerify} className="verify-form">
            <div className="code-inputs" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="code-input"
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="timer-section">
              <span className="timer">{formatTime(timer)}</span>
              <button
                type="button"
                onClick={handleResendCode}
                className={`resend-link ${canResend ? "active" : ""}`}
                disabled={!canResend || loading}
              >
                Resend Code
              </button>
            </div>

            <button type="submit" className="verify-button" disabled={loading}>
              {loading ? (
                <CircularProgress size={20} color="success" />
              ) : (
                "Verify"
              )}
            </button>
          </form>
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

export default EmailVerification;
