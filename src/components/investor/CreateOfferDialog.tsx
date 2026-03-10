import { useAuth } from "@/Context/useAuth";
import type {
  DirectHarvestOffer,
  SponsorshipOffer,
} from "@/types/investor.types";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

interface CreateOfferDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    offer: Partial<DirectHarvestOffer> | Partial<SponsorshipOffer>,
  ) => void;
}

type OfferType = "direct-harvest" | "sponsorship";

const CROP_TYPES = [
  "Rice",
  "Wheat",
  "Corn",
  "Tomatoes",
  "Potatoes",
  "Onions",
  "Carrots",
  "Tea",
  "Coffee",
  "Rubber",
  "Coconut",
  "Vegetables (Mixed)",
  "Fruits (Mixed)",
];

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
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Moneragala",
  "Ratnapura",
  "Kegalle",
];

const SUPPORT_TYPES = [
  { value: "capital", label: "Capital Investment" },
  { value: "equipment", label: "Equipment & Tools" },
  { value: "expertise", label: "Technical Expertise" },
  { value: "marketing", label: "Marketing Support" },
];

const CreateOfferDialog = ({
  open,
  onClose,
  onSubmit,
}: CreateOfferDialogProps) => {
  const { user } = useAuth();
  const [offerType, setOfferType] = useState<OfferType>("direct-harvest");

  // Auto-compute investor name from logged user
  const investorName = useMemo(() => {
    if (!user) return "";
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return fullName || user.email || "Investor";
  }, [user]);

  // Common fields
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Direct Harvest specific
  const [cropType, setCropType] = useState("");
  const [cropVariety, setCropVariety] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState<"kg" | "tons">("kg");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [qualityStandards, setQualityStandards] = useState("");
  const [deliveryDeadline, setDeliveryDeadline] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [totalBudget, setTotalBudget] = useState("");

  // Sponsorship specific
  const [selectedCropTypes, setSelectedCropTypes] = useState<string[]>([]);
  const [farmingMethod, setFarmingMethod] = useState<
    "organic" | "conventional" | "mixed"
  >("conventional");
  const [commissionRate, setCommissionRate] = useState("");
  const [minInvestment, setMinInvestment] = useState("");
  const [maxInvestment, setMaxInvestment] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [supportTypes, setSupportTypes] = useState<string[]>(["capital"]);

  const handleSupportTypeToggle = (value: string) => {
    setSupportTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };

  const handleSubmit = () => {
    if (offerType === "direct-harvest") {
      const offer: Partial<DirectHarvestOffer> = {
        offerType: "direct-harvest",
        investorName,
        projectTitle,
        cropType,
        cropVariety: cropVariety || undefined,
        requiredQuantity: Number(requiredQuantity),
        quantityUnit,
        pricePerUnit: Number(pricePerUnit),
        qualityStandards: qualityStandards || undefined,
        deliveryDeadline,
        deliveryLocation,
        totalBudget: Number(totalBudget),
        currency: "LKR",
        preferredRegion:
          selectedRegions.length > 0 ? selectedRegions : undefined,
        companyName: companyName || undefined,
        description,
        status: "pending",
        applicationsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentInstallments: [], // Farmer will plan installments
      };
      onSubmit(offer);
    } else {
      const offer: Partial<SponsorshipOffer> = {
        offerType: "sponsorship",
        investorName,
        sponsorshipTitle: projectTitle,
        cropTypes: selectedCropTypes,
        preferredFarmingMethod: farmingMethod,
        minimumInvestment: Number(minInvestment),
        maximumInvestment: Number(maxInvestment),
        commissionRate: Number(commissionRate),
        currency: "LKR",
        supportType: supportTypes as (
          | "capital"
          | "equipment"
          | "expertise"
          | "marketing"
        )[],
        minimumProjectDuration: minDuration ? Number(minDuration) : undefined,
        maximumProjectDuration: maxDuration ? Number(maxDuration) : undefined,
        preferredRegions:
          selectedRegions.length > 0 ? selectedRegions : undefined,
        description,
        status: "pending",
        applicationsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentInstallments: [], // Farmer will plan installments
      };
      onSubmit(offer);
    }
    handleClose();
  };

  const handleClose = () => {
    // Reset form (keep investorName as it's auto-populated)
    setOfferType("direct-harvest");
    setProjectTitle("");
    setDescription("");
    setSelectedRegions([]);
    setCropType("");
    setCropVariety("");
    setRequiredQuantity("");
    setPricePerUnit("");
    setQualityStandards("");
    setDeliveryDeadline("");
    setDeliveryLocation("");
    setCompanyName("");
    setTotalBudget("");
    setSelectedCropTypes([]);
    setCommissionRate("");
    setMinInvestment("");
    setMaxInvestment("");
    setMinDuration("");
    setMaxDuration("");
    setSupportTypes(["capital"]);
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
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Create New Offer
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {/* Offer Type Selection */}
        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
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
                      offerType === "direct-harvest"
                        ? "primary.main"
                        : "divider",
                    borderRadius: 2,
                    bgcolor:
                      offerType === "direct-harvest"
                        ? "var(--color-olive-muted)"
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setOfferType("direct-harvest")}
                >
                  <FormControlLabel
                    value="direct-harvest"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography fontWeight={600} gutterBottom>
                          🌾 Direct Harvest Order
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          I need specific harvest quantity by a deadline (e.g.,
                          100KG tomatoes for my business)
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
                      offerType === "sponsorship" ? "primary.main" : "divider",
                    borderRadius: 2,
                    bgcolor:
                      offerType === "sponsorship"
                        ? "var(--color-info-blue-muted)"
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setOfferType("sponsorship")}
                >
                  <FormControlLabel
                    value="sponsorship"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography fontWeight={600} gutterBottom>
                          💰 Sponsorship Program
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          I want to sponsor farmers and earn commission on their
                          harvest
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

        <Divider sx={{ mb: 3 }} />

        {/* Common Fields - All Offers */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
          <TextField
            label="Investor Name *"
            value={investorName}
            placeholder="Your full name or company name"
            fullWidth
            required
            disabled
            helperText="Auto-populated from your account"
            InputProps={{
              sx: {
                bgcolor: "var(--surface-tint)",
                "& .Mui-disabled": {
                  WebkitTextFillColor: "var(--overlay-xl)",
                },
              },
            }}
          />

          <TextField
            label="Project Title *"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder={
              offerType === "direct-harvest"
                ? "e.g., Tomato Purchase for Sauce Production Q1 2026"
                : "e.g., Organic Farming Sponsorship Program 2026"
            }
            fullWidth
            required
          />

          <TextField
            label="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your requirements, expectations, and any special conditions..."
            multiline
            rows={3}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Preferred Regions (Optional)</InputLabel>
            <Select
              multiple
              value={selectedRegions}
              onChange={(e) => setSelectedRegions(e.target.value as string[])}
              label="Preferred Regions (Optional)"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
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
            <FormHelperText>
              Select regions you prefer to work with
            </FormHelperText>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Direct Harvest Fields */}
        {offerType === "direct-harvest" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Company Name (Optional)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., ABC Sauce Company"
              helperText="If purchasing for a business"
              fullWidth
            />

            <TextField
              label="Crop Name *"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="e.g., Tomatoes, Rice, Carrots"
              helperText="Enter the specific crop you want to purchase"
              fullWidth
              required
            />

            <TextField
              label="Crop Variety (Optional)"
              value={cropVariety}
              onChange={(e) => setCropVariety(e.target.value)}
              placeholder="e.g., Cherry Tomatoes, Basmati Rice"
              fullWidth
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Required Quantity *"
                type="number"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                fullWidth
                required
              />
              <FormControl sx={{ minWidth: 120 }} required>
                <InputLabel>Unit *</InputLabel>
                <Select
                  value={quantityUnit}
                  onChange={(e) =>
                    setQuantityUnit(e.target.value as "kg" | "tons")
                  }
                  label="Unit *"
                >
                  <MenuItem value="kg">KG</MenuItem>
                  <MenuItem value="tons">Tons</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Price Per Unit (LKR) *"
              type="number"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">LKR</InputAdornment>
                ),
              }}
              fullWidth
              required
            />

            <TextField
              label="Delivery Deadline *"
              type="date"
              value={deliveryDeadline}
              onChange={(e) => setDeliveryDeadline(e.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="When do you need the harvest delivered?"
              fullWidth
              required
            />

            <TextField
              label="Delivery Location *"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="e.g., Colombo Warehouse, Galle Factory"
              fullWidth
              required
            />

            <TextField
              label="Quality Standards (Optional)"
              value={qualityStandards}
              onChange={(e) => setQualityStandards(e.target.value)}
              placeholder="e.g., Organic certified, Grade A, No pesticides"
              multiline
              rows={2}
              fullWidth
            />

            <TextField
              label="Total Budget (LKR) *"
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">LKR</InputAdornment>
                ),
              }}
              helperText="Total amount you're willing to invest for this harvest order"
              fullWidth
              required
            />
          </Box>
        )}

        {/* Sponsorship Fields */}
        {offerType === "sponsorship" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControl fullWidth required>
              <InputLabel>Crop Types *</InputLabel>
              <Select
                multiple
                value={selectedCropTypes}
                onChange={(e) =>
                  setSelectedCropTypes(e.target.value as string[])
                }
                label="Crop Types *"
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {CROP_TYPES.map((crop) => (
                  <MenuItem key={crop} value={crop}>
                    {crop}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Select multiple crops you're willing to sponsor
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Preferred Farming Method</FormLabel>
              <RadioGroup
                value={farmingMethod}
                onChange={(e) =>
                  setFarmingMethod(
                    e.target.value as "organic" | "conventional" | "mixed",
                  )
                }
                row
              >
                <FormControlLabel
                  value="organic"
                  control={<Radio />}
                  label="Organic Only"
                />
                <FormControlLabel
                  value="conventional"
                  control={<Radio />}
                  label="Conventional"
                />
                <FormControlLabel
                  value="mixed"
                  control={<Radio />}
                  label="Any Method"
                />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Minimum Investment (LKR) *"
                type="number"
                value={minInvestment}
                onChange={(e) => setMinInvestment(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">LKR</InputAdornment>
                  ),
                }}
                helperText="Minimum amount you'll invest"
                fullWidth
                required
              />
              <TextField
                label="Maximum Investment (LKR) *"
                type="number"
                value={maxInvestment}
                onChange={(e) => setMaxInvestment(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">LKR</InputAdornment>
                  ),
                }}
                helperText="Maximum amount you'll invest"
                fullWidth
                required
              />
            </Box>

            <TextField
              label="Commission Rate (%) *"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              helperText="Your share of the harvest revenue (e.g., 15% of total sales)"
              fullWidth
              required
            />

            <Box>
              <FormLabel sx={{ mb: 1, display: "block" }}>
                Support Types *
              </FormLabel>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {SUPPORT_TYPES.map((type) => (
                  <Chip
                    key={type.value}
                    label={type.label}
                    onClick={() => handleSupportTypeToggle(type.value)}
                    color={
                      supportTypes.includes(type.value) ? "primary" : "default"
                    }
                    variant={
                      supportTypes.includes(type.value) ? "filled" : "outlined"
                    }
                  />
                ))}
              </Box>
              <FormHelperText>
                Select the types of support you'll provide
              </FormHelperText>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Min Duration (Months)"
                type="number"
                value={minDuration}
                onChange={(e) => setMinDuration(e.target.value)}
                helperText="Minimum project length"
                fullWidth
              />
              <TextField
                label="Max Duration (Months)"
                type="number"
                value={maxDuration}
                onChange={(e) => setMaxDuration(e.target.value)}
                helperText="Maximum project length"
                fullWidth
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={handleClose} variant="outlined" size="large">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          sx={{
            minWidth: 150,
            background:
              "linear-gradient(135deg, var(--color-olive) 0%, var(--color-olive-light) 100%)",
            "&:hover": {
              background:
                "linear-gradient(135deg, var(--color-olive-hover) 0%, var(--color-olive-light) 100%)",
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
