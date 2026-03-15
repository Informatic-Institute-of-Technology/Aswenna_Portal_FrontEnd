import { useAuth } from "@/Context/useAuth";
import { profileService } from "@/services/profile.service";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface CreateAdPopupProps {
  open: boolean;
  onClose: () => void;
}

const fieldStyle = {
  "& .MuiInputBase-root": {
    color: "#e0e0e0",
  },
  "& .MuiInput-underline:before": {
    borderBottom: "1px solid #444",
  },
  "& .MuiInput-underline:hover:before": {
    borderBottom: "1px solid #666",
  },
  "& .MuiInput-underline:after": {
    borderBottom: "2px solid #6e8b3d",
  },
};

const Label = ({ text }: { text: string }) => (
  <Box sx={{ color: "#fff", fontSize: "14px", fontWeight: 500, mb: "6px" }}>
    {text}
  </Box>
);

const CreateAdPopup = ({ open, onClose }: CreateAdPopupProps) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    landId: "",
    additionalInfo: "",
    photos: [] as File[],
  });
  const [landIdTouched, setLandIdTouched] = useState(false);

  const profileSetupData = useMemo(() => profileService.getProfileSetupData(), []);
  const registeredLandInfo = profileSetupData?.landInfo;

  const registeredLandId = useMemo(() => {
    if (!user?._id) {
      return "";
    }

    const normalized = user._id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    return `LAND-${normalized.slice(-6)}`;
  }, [user?._id]);

  const isLandMatched =
    formData.landId.trim().toUpperCase() === registeredLandId && Boolean(registeredLandInfo);

  const canSubmit =
    isLandMatched && formData.additionalInfo.trim().length > 0 && formData.photos.length > 0;

  useEffect(() => {
    if (!open) {
      setFormData({
        landId: "",
        additionalInfo: "",
        photos: [],
      });
      setLandIdTouched(false);
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setFormData((prev) => ({
        ...prev,
        photos: Array.from(files),
      }));
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    console.log("Land ad submitted:", {
      landId: formData.landId,
      autoFilledLandDetails: registeredLandInfo,
      additionalInfo: formData.additionalInfo,
      photos: formData.photos.map((file) => file.name),
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: "linear-gradient(180deg, #1c1f22, #141617)",
          color: "#fff",
          padding: "12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        Create Land Ad
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <DialogContent>
        <Typography sx={{ color: "#a6a6a6", fontSize: "0.9rem", mb: 2 }}>
          Enter your land ID to fetch your registered land details automatically.
        </Typography>

        {registeredLandInfo ? (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              color: "#dbeafe",
              "& .MuiAlert-icon": { color: "#93c5fd" },
            }}
          >
            Your registered land ID: <strong>{registeredLandId}</strong>
          </Alert>
        ) : (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#fde68a",
              "& .MuiAlert-icon": { color: "#f59e0b" },
            }}
          >
            Registered land details not found. Complete landowner profile setup first.
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            columnGap: "48px",
            rowGap: "32px",
          }}
        >
          <Box>
            <Label text="Land ID" />
            <TextField
              name="landId"
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={formData.landId}
              onChange={handleInputChange}
              onBlur={() => setLandIdTouched(true)}
              placeholder="Enter land ID"
            />
            {landIdTouched && formData.landId && !isLandMatched && (
              <Typography sx={{ color: "#fca5a5", fontSize: "0.75rem", mt: 1 }}>
                Land ID does not match your registered land.
              </Typography>
            )}
          </Box>

          <Box>
            <Label text="Location" />
            <TextField
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={
                isLandMatched
                  ? `${registeredLandInfo?.landStreet || ""}, ${registeredLandInfo?.landCity || ""}`
                  : ""
              }
              placeholder="Auto-filled from registration"
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box>
            <Label text="Land Area" />
            <TextField
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={isLandMatched ? registeredLandInfo?.landSize || "" : ""}
              placeholder="Auto-filled from registration"
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box>
            <Label text="Soil Type" />
            <TextField
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={isLandMatched ? registeredLandInfo?.soilType || "" : ""}
              placeholder="Auto-filled from registration"
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box>
            <Label text="Rental Expectation" />
            <TextField
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={isLandMatched ? registeredLandInfo?.rentalExpectation || "" : ""}
              placeholder="Auto-filled from registration"
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
            <Label text="Additional Information" />
            <TextField
              name="additionalInfo"
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Enter additional details for this advertisement"
              multiline
              rows={3}
            />
          </Box>

          <Box sx={{ gridColumn: { xs: "1 / -1", md: "1 / -1" } }}>
            <Label text="Upload Photos" />
            <Box
              sx={{
                border: "1px dashed #ccc",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#282828",
                minHeight: "56px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": {
                  borderColor: "#6e8b3d",
                  backgroundColor: "rgba(113, 188, 93, 0.04)",
                },
              }}
              onClick={() => document.getElementById("photo-upload")?.click()}
            >
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div style={{ color: "#666", fontSize: "14px" }}>
                {formData.photos.length > 0
                  ? `${formData.photos.length} photo(s) selected`
                  : "No files chosen"}
              </div>
              <div
                style={{
                  color: "#999",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                Click to upload photos
              </div>
            </Box>
          </Box>
        </Box>

        <DialogActions sx={{ justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit}
            sx={{
              background: "linear-gradient(135deg, #6B8E23 0%, #8FA887 100%)",
              boxShadow: "0 4px 12px rgba(107, 142, 35, 0.3)",
              px: 8,
              py: 1.2,
              borderRadius: "10px",
              fontWeight: 600,
              color: "#fff",
              "&:hover": {
                opacity: 0.9,
              },
              "&.Mui-disabled": {
                background: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.45)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdPopup;
