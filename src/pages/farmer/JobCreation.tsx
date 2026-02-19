import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Divider,
  Chip,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface CreateOfferDialogProps {
  open: boolean;
  onClose: () => void;
}

type OfferType = "harvest" | "commission";

const REGIONS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Anuradhapura",
  "Polonnaruwa",
  "Kurunegala",
  "Puttalam",
  "Badulla",
  "Ratnapura",
  "Kegalle",
];

const CreateOfferDialog = ({ open, onClose }: CreateOfferDialogProps) => {
  const [offerType, setOfferType] = useState<OfferType>("harvest");
  const [formData, setFormData] = useState({
    projectName: "",
    cropType: "",
    effectiveDateFrom: "",
    effectiveDateTo: "",
    location: "",
    farmingMethods: "",
    agreementType: "",
    description: "",
    selectedRegions: [] as string[],
    // Harvest-based fields
    expectedHarvest: "",
    expectedLandArea: "",
    // Commission-based fields
    commissionPercentage: "",
    investmentAmount: "",
    noOfInstallments: "",
  });

  const handleInputChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSave = () => {
    console.log("Form data:", formData, "Offer Type:", offerType);
    onClose();
  };

  const handleClose = () => {
    // Reset form
    setOfferType("harvest");
    setFormData({
      projectName: "",
      cropType: "",
      effectiveDateFrom: "",
      effectiveDateTo: "",
      location: "",
      farmingMethods: "",
      agreementType: "",
      description: "",
      selectedRegions: [],
      expectedHarvest: "",
      expectedLandArea: "",
      commissionPercentage: "",
      investmentAmount: "",
      noOfInstallments: "",
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxHeight: "90vh",
          backgroundColor: "#1a1a1a",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2.5,
        }}
      >
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600 }}>
          Create New Offer
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.6)",
            "&:hover": { color: "rgba(255,255,255,0.9)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <DialogContent sx={{ px: 3, py: 3 }}>
        {/* Offer Type Selection */}
        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "#fff",
                "&.Mui-focused": { color: "#fff" },
              }}
            >
              Select Offer Type
            </FormLabel>
            <RadioGroup
              value={offerType}
              onChange={(e) => setOfferType(e.target.value as OfferType)}
            >
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 250,
                    p: 2,
                    border: 2,
                    borderColor:
                      offerType === "harvest"
                        ? "#6B8E23"
                        : "rgba(255,255,255,0.2)",
                    borderRadius: 2,
                    bgcolor:
                      offerType === "harvest"
                        ? "rgba(107, 142, 35, 0.1)"
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setOfferType("harvest")}
                >
                  <FormControlLabel
                    value="harvest"
                    control={
                      <Radio
                        sx={{
                          color: "#6B8E23",
                          "&.Mui-checked": { color: "#6B8E23" },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography
                          fontWeight={600}
                          gutterBottom
                          sx={{ color: "#fff" }}
                        >
                          🌾 Harvest-based Income
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          I want to offer harvest-based returns to investors
                          based on crop yield
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: "flex-start", m: 0 }}
                  />
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 250,
                    p: 2,
                    border: 2,
                    borderColor:
                      offerType === "commission"
                        ? "#6B8E23"
                        : "rgba(255,255,255,0.2)",
                    borderRadius: 2,
                    bgcolor:
                      offerType === "commission"
                        ? "rgba(107, 142, 35, 0.1)"
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setOfferType("commission")}
                >
                  <FormControlLabel
                    value="commission"
                    control={
                      <Radio
                        sx={{
                          color: "#6B8E23",
                          "&.Mui-checked": { color: "#6B8E23" },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography
                          fontWeight={600}
                          gutterBottom
                          sx={{ color: "#fff" }}
                        >
                          💰 Commission-based Income
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          I want to offer commission-based returns with fixed
                          percentage payouts
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: "flex-start", m: 0 }}
                  />
                </Box>
              </Box>
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Common Fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
          <TextField
            label="Project Name *"
            value={formData.projectName}
            onChange={handleInputChange("projectName")}
            placeholder="Enter your project name"
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
              "& input": { color: "#fff" },
            }}
          />

          <TextField
            label="Description *"
            value={formData.description}
            onChange={handleInputChange("description")}
            placeholder="Describe your project requirements, goals, and expectations..."
            multiline
            rows={3}
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
              "& textarea": { color: "#fff" },
            }}
          />

          <FormControl
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
              "& .MuiSelect-select": { color: "#fff" },
              "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
            }}
          >
            <InputLabel>Preferred Regions (Optional)</InputLabel>
            <Select
              multiple
              value={formData.selectedRegions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  selectedRegions: e.target.value as string[],
                }))
              }
              label="Preferred Regions (Optional)"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      sx={{ bgcolor: "rgba(107, 142, 35, 0.3)", color: "#fff" }}
                    />
                  ))}
                </Box>
              )}
            >
              {REGIONS.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ color: "rgba(255,255,255,0.5)" }}>
              Select regions you prefer to work with
            </FormHelperText>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Harvest-based Fields */}
        {offerType === "harvest" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& .MuiSelect-select": { color: "#fff" },
                  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
                }}
              >
                <InputLabel>Crop Type *</InputLabel>
                <Select
                  value={formData.cropType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cropType: e.target.value,
                    }))
                  }
                  label="Crop Type *"
                >
                  <MenuItem value="rice">Rice</MenuItem>
                  <MenuItem value="tea">Tea</MenuItem>
                  <MenuItem value="pepper">Pepper</MenuItem>
                  <MenuItem value="vegetables">Vegetables</MenuItem>
                  <MenuItem value="fruits">Fruits</MenuItem>
                  <MenuItem value="coconut">Coconut</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& .MuiSelect-select": { color: "#fff" },
                  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
                }}
              >
                <InputLabel>Farming Methods *</InputLabel>
                <Select
                  value={formData.farmingMethods}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      farmingMethods: e.target.value,
                    }))
                  }
                  label="Farming Methods *"
                >
                  <MenuItem value="organic">Organic</MenuItem>
                  <MenuItem value="traditional">Traditional</MenuItem>
                  <MenuItem value="hydroponic">Hydroponic</MenuItem>
                  <MenuItem value="mixed">Mixed Methods</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Expected Harvest (KG) *"
                type="number"
                value={formData.expectedHarvest}
                onChange={handleInputChange("expectedHarvest")}
                placeholder="e.g., 5000"
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                }}
              />

              <TextField
                label="Land Area (Acres) *"
                type="number"
                value={formData.expectedLandArea}
                onChange={handleInputChange("expectedLandArea")}
                placeholder="e.g., 5.5"
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start Date *"
                type="date"
                value={formData.effectiveDateFrom}
                onChange={handleInputChange("effectiveDateFrom")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                  "& input::-webkit-calendar-picker-indicator": {
                    filter: "invert(1)",
                    opacity: 0.5,
                  },
                }}
              />

              <TextField
                label="Expected End Date *"
                type="date"
                value={formData.effectiveDateTo}
                onChange={handleInputChange("effectiveDateTo")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                  "& input::-webkit-calendar-picker-indicator": {
                    filter: "invert(1)",
                    opacity: 0.5,
                  },
                }}
              />
            </Box>

            <TextField
              label="Location *"
              value={formData.location}
              onChange={handleInputChange("location")}
              placeholder="e.g., Anuradhapura, North Central Province"
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                "& input": { color: "#fff" },
              }}
            />

            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                "& .MuiSelect-select": { color: "#fff" },
                "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
              }}
            >
              <InputLabel>Agreement Type</InputLabel>
              <Select
                value={formData.agreementType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreementType: e.target.value,
                  }))
                }
                label="Agreement Type"
              >
                <MenuItem value="lease">Lease</MenuItem>
                <MenuItem value="partnership">Partnership</MenuItem>
                <MenuItem value="contract">Contract Farming</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Commission-based Fields */}
        {offerType === "commission" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& .MuiSelect-select": { color: "#fff" },
                  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
                }}
              >
                <InputLabel>Crop Type *</InputLabel>
                <Select
                  value={formData.cropType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cropType: e.target.value,
                    }))
                  }
                  label="Crop Type *"
                >
                  <MenuItem value="rice">Rice</MenuItem>
                  <MenuItem value="tea">Tea</MenuItem>
                  <MenuItem value="pepper">Pepper</MenuItem>
                  <MenuItem value="vegetables">Vegetables</MenuItem>
                  <MenuItem value="fruits">Fruits</MenuItem>
                  <MenuItem value="coconut">Coconut</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& .MuiSelect-select": { color: "#fff" },
                  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
                }}
              >
                <InputLabel>Farming Methods *</InputLabel>
                <Select
                  value={formData.farmingMethods}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      farmingMethods: e.target.value,
                    }))
                  }
                  label="Farming Methods *"
                >
                  <MenuItem value="organic">Organic</MenuItem>
                  <MenuItem value="traditional">Traditional</MenuItem>
                  <MenuItem value="hydroponic">Hydroponic</MenuItem>
                  <MenuItem value="mixed">Mixed Methods</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Commission Percentage (%) *"
                type="number"
                value={formData.commissionPercentage}
                onChange={handleInputChange("commissionPercentage")}
                placeholder="e.g., 15"
                fullWidth
                required
                helperText="Your share of the revenue to investors"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255,255,255,0.5)",
                  },
                }}
              />

              <TextField
                label="Investment Amount (LKR) *"
                type="number"
                value={formData.investmentAmount}
                onChange={handleInputChange("investmentAmount")}
                placeholder="e.g., 250000"
                fullWidth
                required
                helperText="Total investment required"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255,255,255,0.5)",
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Number of Installments"
                type="number"
                value={formData.noOfInstallments}
                onChange={handleInputChange("noOfInstallments")}
                placeholder="e.g., 4"
                fullWidth
                helperText="How many payment installments"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255,255,255,0.5)",
                  },
                }}
              />

              <TextField
                label="Land Area (Acres) *"
                type="number"
                value={formData.expectedLandArea}
                onChange={handleInputChange("expectedLandArea")}
                placeholder="e.g., 5.5"
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start Date *"
                type="date"
                value={formData.effectiveDateFrom}
                onChange={handleInputChange("effectiveDateFrom")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                  "& input::-webkit-calendar-picker-indicator": {
                    filter: "invert(1)",
                    opacity: 0.5,
                  },
                }}
              />

              <TextField
                label="Expected End Date *"
                type="date"
                value={formData.effectiveDateTo}
                onChange={handleInputChange("effectiveDateTo")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                  "& input": { color: "#fff" },
                  "& input::-webkit-calendar-picker-indicator": {
                    filter: "invert(1)",
                    opacity: 0.5,
                  },
                }}
              />
            </Box>

            <TextField
              label="Location *"
              value={formData.location}
              onChange={handleInputChange("location")}
              placeholder="e.g., Anuradhapura, North Central Province"
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                "& input": { color: "#fff" },
              }}
            />

            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#6B8E23" },
                "& .MuiSelect-select": { color: "#fff" },
                "& .MuiSelect-icon": { color: "rgba(255,255,255,0.4)" },
              }}
            >
              <InputLabel>Agreement Type</InputLabel>
              <Select
                value={formData.agreementType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreementType: e.target.value,
                  }))
                }
                label="Agreement Type"
              >
                <MenuItem value="lease">Lease</MenuItem>
                <MenuItem value="partnership">Partnership</MenuItem>
                <MenuItem value="contract">Contract Farming</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{
            borderColor: "#6B8E23",
            color: "#6B8E23",
            "&:hover": {
              borderColor: "#8FA887",
              backgroundColor: "rgba(107, 142, 35, 0.1)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="large"
          sx={{
            minWidth: 150,
            background: "linear-gradient(135deg, #6B8E23 0%, #8FA887 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #7C9F34 0%, #A4C29D 100%)",
            },
          }}
        >
          Create Offer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOfferDialog;
