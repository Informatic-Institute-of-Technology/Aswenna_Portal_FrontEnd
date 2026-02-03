import AswendLogo from "@/assets/Aswenna Logo.png";
import { useAuth } from "@/Context";
import { profileService } from "@/services";
import {
  ArrowBack,
  CheckCircle,
  Gavel,
  Handshake,
  Security as SecurityIcon,
  VerifiedUser,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  FormControlLabel,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleCompleteSignup = async () => {
    if (!agreed) {
      alert("Please agree to the Terms & Conditions to proceed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData = profileService.getProfileSetupData();
      const userRole = profileService.getUserRole();

      if (!profileData) {
        throw new Error(
          "Profile data not found. Please complete the profile setup.",
        );
      }

      profileData.termsAccepted = true;

      const payload = {
        ...profileData,
        role: userRole || profileData.role,
        termsAcceptedAt: new Date().toISOString(),
        userId: user?._id || null,
        email: user?.email || null,
      };

      await profileService.completeProfile(payload);

      profileService.clearProfileSetupData();

      setShowSuccessDialog(true);

      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error completing signup:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while creating your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        color: "white",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{
              color: "white",
              backgroundColor: "rgba(0,0,0,0.3)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
              textTransform: "none",
              px: 2,
              py: 0.75,
            }}
          >
            Back
          </Button>

          <Stepper
            activeStep={2}
            sx={{
              flex: 1,
              maxWidth: 400,
              mx: 4,
              "& .MuiStepConnector-line": {
                borderColor: "rgba(255,255,255,0.3)",
              },
            }}
          >
            <Step completed>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "#9ca3af",
                    fontSize: "0.75rem",
                  },
                  "& .MuiStepIcon-root": { color: "#6B8E23" },
                  "& .MuiStepIcon-text": { fill: "white" },
                }}
              >
                Account
              </StepLabel>
            </Step>
            <Step completed>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "#9ca3af",
                    fontSize: "0.75rem",
                  },
                  "& .MuiStepIcon-root": { color: "#6B8E23" },
                  "& .MuiStepIcon-text": { fill: "white" },
                }}
              >
                Profile
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  },
                  "& .MuiStepIcon-root": {
                    color: "white",
                    border: "2px solid white",
                    borderRadius: "50%",
                  },
                  "& .MuiStepIcon-text": { fill: "#1a1a1a" },
                }}
              >
                Consent
              </StepLabel>
            </Step>
          </Stepper>

          <Box sx={{ width: 80 }} />
        </Box>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img
            src={AswendLogo}
            alt="Aswenna Logo"
            style={{ width: "80px", marginBottom: "1rem" }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Terms of Service & Data Privacy
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#b0b0b0",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Please review our policies regarding your data usage and platform
            agreements before completing your Aswenna account setup.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "rgba(107, 142, 35, 0.15)",
            p: 2.5,
            mb: 3,
            borderRadius: 2,
            border: "1px solid rgba(107, 142, 35, 0.4)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              sx={{
                bgcolor: "#6B8E23",
                borderRadius: 2,
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SecurityIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Data Security Guarantee
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                We use bank-level AES-256 encryption to protect your
                information. Your agricultural data, land records, financial
                inputs, and personal details remain your exclusive property.
                Aswenna does not sell your raw data to third parties.
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#1a1a1a",
            p: 3,
            borderRadius: 2,
            border: "1px solid #3a3a3a",
            mb: 3,
            maxHeight: "400px",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#2a2a2a",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#6B8E23",
              borderRadius: "3px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              pb: 1.5,
              borderBottom: "1px solid #3a3a3a",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Gavel sx={{ color: "#6B8E23", fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Platform Agreement
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
              Last updated: January 2026
            </Typography>
          </Box>

          <Box sx={{ "& > *:not(:last-child)": { mb: 2.5 } }}>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <VerifiedUser sx={{ color: "#6B8E23", fontSize: 18 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#6B8E23" }}
                >
                  1. Usage License & Platform Access
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#b0b0b0", pl: 3.5 }}>
                By accessing and using the Aswenna Agricultural Platform, you
                accept and agree to be bound by these terms. The platform
                connects Farmers, Landowners, and Investors to facilitate
                agricultural partnerships across Sri Lanka. You agree to provide
                accurate information during registration and maintain the
                security of your account credentials. Any misuse of the platform
                may result in account suspension.
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <SecurityIcon sx={{ color: "#6B8E23", fontSize: 18 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#6B8E23" }}
                >
                  2. Data Ownership & Privacy
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#b0b0b0", pl: 3.5 }}>
                You retain full ownership of all data uploaded to Aswenna,
                including: land details, crop information, soil reports,
                investment records, NIC documents, and financial transactions.
                Your data is encrypted and stored securely. We only share
                information with other users as necessary to facilitate matches
                and partnerships that you explicitly approve.
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Handshake sx={{ color: "#6B8E23", fontSize: 18 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#6B8E23" }}
                >
                  3. Partnership Agreements & Liability
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#b0b0b0", pl: 3.5 }}>
                Aswenna facilitates connections between agricultural
                stakeholders but is not a party to agreements made between
                users. All land leases, investment contracts, and farming
                arrangements are between the respective parties. While we verify
                user identities, we recommend conducting your own due diligence
                before entering into any partnership agreement.
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <CheckCircle sx={{ color: "#6B8E23", fontSize: 18 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#6B8E23" }}
                >
                  4. Verification & Trust
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#b0b0b0", pl: 3.5 }}>
                All users undergo identity verification through NIC document
                submission. Land ownership is verified through deed
                certificates. Aswenna reserves the right to remove unverified
                accounts or listings that violate platform guidelines. Verified
                badges indicate completed identity checks but do not guarantee
                the outcome of any partnership.
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Gavel sx={{ color: "#6B8E23", fontSize: 18 }} />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#6B8E23" }}
                >
                  5. Dispute Resolution
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#b0b0b0", pl: 3.5 }}>
                In case of disputes between parties, Aswenna provides a
                mediation service to help resolve conflicts amicably. However,
                legal disputes must be resolved through appropriate Sri Lankan
                courts. By using the platform, you agree that Aswenna is not
                liable for losses arising from failed partnerships, crop
                failures, or investment losses due to agricultural risks.
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#1a1a1a",
            p: 2,
            borderRadius: 2,
            border: "1px solid #3a3a3a",
            mb: 3,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                sx={{
                  color: "#6B8E23",
                  "&.Mui-checked": {
                    color: "#6B8E23",
                  },
                }}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{" "}
                <span style={{ color: "#6B8E23", fontWeight: 600 }}>
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span style={{ color: "#6B8E23", fontWeight: 600 }}>
                  Data Usage Policy
                </span>
              </Typography>
            }
          />
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#b0b0b0",
              ml: 4,
              mt: 0.5,
            }}
          >
            Required to proceed with account creation.
          </Typography>
        </Paper>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBack />}
            disabled={isSubmitting}
            sx={{
              color: "white",
              borderColor: "#3a3a3a",
              textTransform: "none",
              px: 3,
              py: 1,
              fontSize: "0.875rem",
              "&:hover": {
                borderColor: "#6B8E23",
                bgcolor: "transparent",
              },
            }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            onClick={handleCompleteSignup}
            disabled={!agreed || isSubmitting}
            endIcon={<CheckCircle />}
            sx={{
              bgcolor: "#6B8E23",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1,
              fontSize: "0.875rem",
              boxShadow: "0 4px 14px 0 rgba(107, 142, 35, 0.39)",
              "&:hover": {
                bgcolor: "#5A7519",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(107, 142, 35, 0.4)",
              },
              "&:disabled": {
                bgcolor: "#3a3a3a",
                color: "#6b7280",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {isSubmitting ? "Processing..." : "Complete Signup"}
          </Button>
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              opacity: 0.6,
            }}
          >
            <img
              src={AswendLogo}
              alt="Aswenna"
              style={{
                width: "16px",
                height: "16px",
                filter: "grayscale(100%)",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#b0b0b0",
                letterSpacing: 1,
              }}
            >
              ASWENNA VERIFIED
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              display: "block",
              mt: 1,
              fontStyle: "italic",
            }}
          >
            "Empowering Sri Lankan agriculture through transparent
            partnerships."
          </Typography>
        </Box>
      </Container>

      {/* Loading Dialog */}
      <Dialog
        open={isSubmitting}
        PaperProps={{
          sx: {
            bgcolor: "#1a1a1a",
            borderRadius: 3,
            border: "1px solid #3a3a3a",
            p: 4,
            textAlign: "center",
            minWidth: 300,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <CircularProgress size={60} sx={{ color: "#6B8E23", mb: 3 }} />
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: 600, mb: 1 }}
          >
            Creating Your Account
          </Typography>
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            Please wait while we set up your Aswenna profile...
          </Typography>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showSuccessDialog}
        PaperProps={{
          sx: {
            bgcolor: "#1a1a1a",
            borderRadius: 3,
            border: "1px solid #6B8E23",
            p: 4,
            textAlign: "center",
            minWidth: 350,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "rgba(107, 142, 35, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <CheckCircle sx={{ color: "#6B8E23", fontSize: 50 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: 700, mb: 1 }}
          >
            Account Created Successfully!
          </Typography>
          <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
            Your Aswenna account has been created. You will be redirected to the
            login page shortly.
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <img
              src={AswendLogo}
              alt="Aswenna"
              style={{ width: 24, height: 24 }}
            />
            <Typography
              variant="body2"
              sx={{ color: "#6B8E23", fontWeight: 600 }}
            >
              Welcome to Aswenna!
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TermsAndConditions;
