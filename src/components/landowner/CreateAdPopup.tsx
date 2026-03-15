import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

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
  "& .MuiSelect-icon": {
    color: "#e0e0e0",
  },
};

const Label = ({ text }: { text: string }) => (
  <Box sx={{ color: "#fff", fontSize: "14px", fontWeight: 500, mb: "6px" }}>
    {text}
  </Box>
);

const CreateAdPopup = ({ open, onClose }: CreateAdPopupProps) => {
  const [formData, setFormData] = useState({
    location: "",
    fromDate: "",
    toDate: "",
    soilType: "",
    additionalInfo: "",
    landArea: "",
    rentalAmount: "",
    landHistory: "",
    photo: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };

  const handleSubmit = () => {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    console.log("Form submitted:", formData);
    onClose();
    }
  };

  const soilTypes = [
    { value: "clay", label: "Clay" },
    { value: "sandy", label: "Sandy" },
    { value: "loamy", label: "Loamy" },
    { value: "silty", label: "Silty" },
    { value: "peaty", label: "Peaty" },
    { value: "chalky", label: "Chalky" },
    { value: "gravel", label: "Gravel" },
    { value: "other", label: "Other" },
  ];

  const landHistoryOptions = [
    { value: "organic-previous", label: "Previously Used for Organic Farming" },
    {
      value: "conventional-previous",
      label: "Previously Used for Conventional Farming",
    },
    { value: "uncultivated", label: "Uncultivated Land" },
    { value: "crop-rotation", label: "Crop Rotation Practiced" },
    { value: "fallow", label: "Fallow Land" },
  ];

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
        Create an Ad
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            columnGap: "48px",
            rowGap: "32px",
          }}
        >
          <Box>
            <Label text="Location" />
            <TextField
              name="location"
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Add location"
            />
          </Box>

          <Box>
            <Label text="Land Area" />
            <TextField
              name="landArea"
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={formData.landArea}
              onChange={handleInputChange}
              placeholder="Land Area"
            />
          </Box>

          <Box>
            <Label text="Available Period" />
            <TextField
              name="availablePeriod"
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={formData.fromDate}
              onChange={handleInputChange}
              placeholder="Available Period"
            />
          </Box>

          <Box>
            <Label text="Rental Amount" />
            <TextField
              name="rentalAmount"
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={formData.rentalAmount}
              onChange={handleInputChange}
              placeholder="Enter Amount"
            />
          </Box>

          <Box>
            <Label text="Soil Type" />
            <TextField
              fullWidth
              select
              placeholder="select soil type"
              name="soilType"
              value={formData.soilType}
              onChange={handleInputChange}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                },
              }}
            >
              {soilTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <Label text="Land History" />
            <TextField
              fullWidth
              select
              placeholder="Select"
              name="landHistory"
              value={formData.landHistory}
              onChange={handleInputChange}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                },
              }}
            >
              {landHistoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <Label text="Additional Information" />
            <TextField
              name="additionalInfo"
              variant="standard"
              fullWidth
              sx={fieldStyle}
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Additional info"
              multiline
              rows={2}
            />
          </Box>

          <Box>
            <Label text="Upload a Photo" />
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
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div style={{ color: "#666", fontSize: "14px" }}>
                {formData.photo ? formData.photo.name : "No file chosen"}
              </div>
              <div
                style={{
                  color: "#999",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                Click to upload or drag and drop
              </div>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#6e8b3d",
              px: 8,
              py: 1.2,
              borderRadius: "10px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#5d7633",
              },
            }}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdPopup;
