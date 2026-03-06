import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grow,
  IconButton,
  Typography,
} from "@mui/material";
import { AswendLogo } from "../../assets";

interface AccountProcessingDialogProps {
  open: boolean;
  onClose: () => void;
}

const AccountProcessingDialog = ({
  open,
  onClose,
}: AccountProcessingDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    TransitionComponent={Grow}
    TransitionProps={{ timeout: { enter: 350, exit: 250 } }}
    PaperProps={{
      sx: {
        borderRadius: 4,
        background:
          "linear-gradient(160deg, #111111 0%, #1c1c1c 50%, #222222 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.85)",
        overflow: "hidden",
      },
    }}
  >
    <IconButton
      onClick={onClose}
      size="small"
      sx={{
        position: "absolute",
        top: 14,
        right: 14,
        color: "rgba(255,255,255,0.3)",
        bgcolor: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        "&:hover": {
          color: "#fff",
          bgcolor: "rgba(255,255,255,0.12)",
        },
        zIndex: 1,
      }}
    >
      <Close sx={{ fontSize: 16 }} />
    </IconButton>

    <DialogContent sx={{ pt: 5, pb: 5, px: 5 }}>
      <Box sx={{ textAlign: "center", mb: 3.5 }}>
        <Box
          component="img"
          src={AswendLogo}
          alt="Aswenna"
          sx={{
            height: 100,
            mb: 3,
            objectFit: "contain",
            display: "block",
            mx: "auto",
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#fff",
            mb: 0.75,
            letterSpacing: "-0.5px",
          }}
        >
          Application Under Processing
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}
        >
          Your registration has been received successfully
        </Typography>
      </Box>

      <Box
        sx={{
          borderRadius: 3,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          p: 3.5,
          mb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85 }}
        >
          Thank you for registering with{" "}
          <span style={{ color: "#6aab2b", fontWeight: 700 }}>Aswenna</span>.
          Your account has been created and is currently{" "}
          <span style={{ color: "#f59e0b", fontWeight: 700 }}>
            under review
          </span>{" "}
          by our admin team.
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85 }}
        >
          This verification process typically takes{" "}
          <span style={{ color: "#f59e0b", fontWeight: 700 }}>
            1 to 3 business days
          </span>
          . During this time, our team will verify your submitted documents and
          information to ensure the security of our platform.
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85 }}
        >
          Once your account has been approved, you will receive a notification
          via your registered{" "}
          <span style={{ color: "#3b82f6", fontWeight: 700 }}>
            email address
          </span>
          . You may then log in and access all features of the Aswenna portal.
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85 }}
        >
          If you have any questions or require further assistance, please
          contact the{" "}
          <span style={{ color: "#6aab2b", fontWeight: 700 }}>
            Aswenna Admin team
          </span>
          . We appreciate your patience and look forward to welcoming you to our
          platform.
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 3 }} />

      <Button
        fullWidth
        variant="contained"
        onClick={onClose}
        sx={{
          background: "linear-gradient(135deg, #4a7c1f 0%, #6aab2b 100%)",
          borderRadius: 2.5,
          py: 1.5,
          fontWeight: 700,
          textTransform: "none",
          fontSize: "1rem",
          letterSpacing: "0.2px",
          boxShadow: "0 6px 20px rgba(74,124,31,0.45)",
          "&:hover": {
            background: "linear-gradient(135deg, #3d6818 0%, #5a9424 100%)",
            boxShadow: "0 8px 24px rgba(74,124,31,0.55)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Got it, Thanks!
      </Button>
    </DialogContent>
  </Dialog>
);

export default AccountProcessingDialog;
