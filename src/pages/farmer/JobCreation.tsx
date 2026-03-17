import { useAuth } from "@/Context/useAuth";
import {
  AddCircleOutline,
  ArrowBack,
  ChevronRight,
  Close as CloseIcon,
  DeleteOutline,
  EmailOutlined,
  PersonOutline,
  PhoneOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useMemo, useState, type ChangeEvent } from "react";
import {
  createFarmerAd,
  type CreateFarmerAdPayload,
} from "../../services/farmerAds.service";
import type { BudgetItem } from "../../types/farmer.types";

interface CreateOfferDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: FarmerJobCreationPayload) => void;
}

type OfferType = "harvest" | "commission";
type DialogStep = "type-selection" | "details";

interface JobCreationFormData {
  projectName: string;
  cropType: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  location: string;
  farmingMethods: string;
  agreementType: string;
  description: string;
  selectedRegions: string[];
  expectedHarvest: string;
  expectedLandArea: string;
  commissionPercentage: string;
  investmentAmount: string;
  noOfInstallments: string;
}

export interface FarmerJobCreationPayload {
  offerType: OfferType;
  projectName: string;
  cropType: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  location: string;
  farmingMethods: string;
  agreementType: string;
  description: string;
  selectedRegions: string[];
  expectedHarvest?: number;
  expectedLandArea?: number;
  commissionPercentage?: number;
  investmentAmount?: number;
  noOfInstallments?: number;
  costBreakdown: BudgetItem[];
  totalInvestmentRequired: number;
}

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

const OFFER_CARDS: {
  type: OfferType;
  title: string;
  description: string;
  helper: string;
  badge?: string;
  image: string;
}[] = [
  {
    type: "harvest",
    title: "Direct Harvesting Offer",
    description:
      "Request capital support based on your expected harvest output.",
    helper: "Great for seasonal cultivation cycles",
    badge: "Most Popular",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-qCNSlEKFbeDeI1OLuWmLTAAouKOLLT0bkFcEdosjgMW8Iei_jVlkOVXFWjIqFvrTUbuMV6MXBH5euZEU3KoPI75y5RbEfPPav1lvSLihn7UrpPkQ9dQaAqojNpvN311FgQIz9olI46NuiQ9m2rjBbk8EqYbwXoMWlzTno_sp62oTujNFGF-F2BTWr1Cei7tJBl_2HC8wMlphhMK7BmFJkqplfm9H641SpNoEPSBigzr23oPrwoIXVl80mso2EwtENs-fV3Kw4TM",
  },
  {
    type: "commission",
    title: "Commission-based Project",
    description:
      "Define investment terms and commission for investor partnerships.",
    helper: "Best for structured milestone-based projects",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgMccLyNAKEbbmyEJhHfQ1KJwij8Di4GY_zkGd38PlbCn3r8itTjEPMu1cSmxhFVHDQKqlpKjywK87OTiAvfO4osSQiDdR_bcIIX7MOTZb4lgtymisVirHKNQ2UW8mqqKPGgfM50VJqmleKzZkKF4csZsQpxkHLIXM2nQon9NzBcD6mPK5xLSl0br8EaNi_QRFVzQyYlSTQFLAYqMCV9xzmcRAEVMhgxR3nPcFs5zmbXybsnqDiYXlB5t9HqHLTLiGHO0ScvIchtw",
  },
];

const createInitialCostBreakdown = (): BudgetItem[] => [
  {
    id: "cost-1",
    category: "Seeds & Inputs",
    description: "Initial seeds and cultivation inputs",
    estimatedCost: 0,
  },
  {
    id: "cost-2",
    category: "Labor",
    description: "Field operations and labor charges",
    estimatedCost: 0,
  },
];

const initialFormData: JobCreationFormData = {
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
};

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "rgba(255,255,255,0.03)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(133,164,70,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#85A446" },
  },
  "& .MuiInputLabel-root": { color: "rgba(226,232,240,0.65)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#A3E635" },
  "& .MuiOutlinedInput-input": { color: "#E2E8F0" },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(148,163,184,0.55)",
    opacity: 1,
  },
  "& textarea": { color: "#E2E8F0" },
};

const selectStyles = {
  ...textFieldStyles,
  "& .MuiSelect-select": { color: "#E2E8F0" },
  "& .MuiSelect-icon": { color: "rgba(148,163,184,0.8)" },
};

const tableInputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    bgcolor: "rgba(255,255,255,0.03)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
    "&:hover fieldset": { borderColor: "rgba(133,164,70,0.45)" },
    "&.Mui-focused fieldset": { borderColor: "#85A446" },
  },
  "& .MuiOutlinedInput-input": {
    color: "#E2E8F0",
    py: 1.05,
    fontSize: "0.83rem",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(148,163,184,0.55)",
    opacity: 1,
  },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);

const parseOptionalNumber = (value: string): number | undefined => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
};

const parseApiErrorMessage = (error: unknown) => {
  if (!(error instanceof Error) || !error.message) {
    return "Failed to create project. Please try again.";
  }

  try {
    const parsed = JSON.parse(error.message) as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(parsed.message)) {
      return parsed.message.join(", ");
    }

    if (typeof parsed.message === "string") {
      return parsed.message;
    }

    if (typeof parsed.error === "string") {
      return parsed.error;
    }
  } catch {
    return error.message;
  }

  return error.message;
};

const getUserAvatarUrl = (
  profilePicture:
    | string
    | {
        url?: string;
        filename?: string;
      }
    | null
    | undefined,
) => {
  if (!profilePicture) {
    return null;
  }

  if (typeof profilePicture === "string") {
    return profilePicture;
  }

  return profilePicture.url ?? null;
};

const CreateOfferDialog = ({
  open,
  onClose,
  onSubmit,
}: CreateOfferDialogProps) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<DialogStep>("type-selection");
  const [offerType, setOfferType] = useState<OfferType>("harvest");
  const [formData, setFormData] =
    useState<JobCreationFormData>(initialFormData);
  const [costBreakdown, setCostBreakdown] = useState<BudgetItem[]>(
    createInitialCostBreakdown(),
  );
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalEstimatedCost = useMemo(
    () =>
      costBreakdown.reduce(
        (total, item) =>
          total +
          (Number.isFinite(item.estimatedCost)
            ? Number(item.estimatedCost)
            : 0),
        0,
      ),
    [costBreakdown],
  );

  const farmerName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Farmer";

  const farmerAvatar = getUserAvatarUrl(user?.personalInfo?.profilePicture);

  const selectedOfferCard = OFFER_CARDS.find((item) => item.type === offerType);

  const handleInputChange =
    (field: keyof JobCreationFormData) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>,
    ) => {
      setValidationError("");
      const value = event.target.value;
      setFormData((previousData) => ({
        ...previousData,
        [field]: value,
      }));
    };

  const handleRegionsChange = (event: SelectChangeEvent<string[]>) => {
    setValidationError("");
    const value = event.target.value;
    setFormData((previousData) => ({
      ...previousData,
      selectedRegions: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleCostItemChange = (
    itemId: string,
    field: "category" | "description" | "estimatedCost",
    value: string,
  ) => {
    setValidationError("");
    setCostBreakdown((previousItems) =>
      previousItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        if (field === "estimatedCost") {
          const parsedCost = Number(value);
          return {
            ...item,
            estimatedCost:
              Number.isFinite(parsedCost) && parsedCost >= 0 ? parsedCost : 0,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    );
  };

  const handleAddCostItem = () => {
    setCostBreakdown((previousItems) => [
      ...previousItems,
      {
        id: `cost-${Date.now()}`,
        category: "",
        description: "",
        estimatedCost: 0,
      },
    ]);
  };

  const handleRemoveCostItem = (itemId: string) => {
    if (costBreakdown.length === 1) {
      return;
    }

    setCostBreakdown((previousItems) =>
      previousItems.filter((item) => item.id !== itemId),
    );
  };

  const resetForm = () => {
    setActiveStep("type-selection");
    setOfferType("harvest");
    setFormData(initialFormData);
    setCostBreakdown(createInitialCostBreakdown());
    setValidationError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const normalizeCostBreakdown = () =>
    costBreakdown
      .map((item) => ({
        ...item,
        category: item.category.trim(),
        description: item.description.trim(),
      }))
      .filter((item) => item.category.length > 0 && item.estimatedCost > 0);

  const validateForm = (normalizedCostBreakdown: BudgetItem[]) => {
    if (
      !formData.projectName.trim() ||
      !formData.description.trim() ||
      !formData.cropType.trim() ||
      !formData.location.trim() ||
      !formData.farmingMethods.trim() ||
      !formData.effectiveDateFrom ||
      !formData.effectiveDateTo
    ) {
      return "Please complete all required project details before creating the job.";
    }

    if (
      new Date(formData.effectiveDateFrom).getTime() >
      new Date(formData.effectiveDateTo).getTime()
    ) {
      return "End date must be later than start date.";
    }

    if (normalizedCostBreakdown.length === 0) {
      return "Add at least one valid cost breakdown item with category and amount.";
    }

    return "";
  };

  const handleSave = async () => {
    const normalizedCostBreakdown = normalizeCostBreakdown();
    const error = validateForm(normalizedCostBreakdown);

    if (error) {
      setValidationError(error);
      return;
    }

    if (!user?._id) {
      setValidationError(
        "Unable to identify the current farmer account. Please sign in again.",
      );
      return;
    }

    const totalInvestmentRequired = normalizedCostBreakdown.reduce(
      (total, item) => total + item.estimatedCost,
      0,
    );

    const payload: FarmerJobCreationPayload = {
      offerType,
      projectName: formData.projectName.trim(),
      cropType: formData.cropType,
      effectiveDateFrom: formData.effectiveDateFrom,
      effectiveDateTo: formData.effectiveDateTo,
      location: formData.location.trim(),
      farmingMethods: formData.farmingMethods,
      agreementType: formData.agreementType,
      description: formData.description.trim(),
      selectedRegions: formData.selectedRegions,
      expectedHarvest: parseOptionalNumber(formData.expectedHarvest),
      expectedLandArea: parseOptionalNumber(formData.expectedLandArea),
      commissionPercentage: parseOptionalNumber(formData.commissionPercentage),
      investmentAmount: parseOptionalNumber(formData.investmentAmount),
      noOfInstallments: parseOptionalNumber(formData.noOfInstallments),
      costBreakdown: normalizedCostBreakdown,
      totalInvestmentRequired,
    };

    const createAdPayload: CreateFarmerAdPayload = {
      farmer: user._id,
      offerType: payload.offerType,
      projectName: payload.projectName,
      description: payload.description,
      cropType: payload.cropType,
      location: payload.location,
      effectiveDateFrom: payload.effectiveDateFrom,
      effectiveDateTo: payload.effectiveDateTo,
      farmingMethods: payload.farmingMethods,
      agreementType: null,
      preferredRegions: payload.selectedRegions,
      costBreakdown: payload.costBreakdown.map((item) => ({
        category: item.category,
        description: item.description,
        estimatedCost: item.estimatedCost,
      })),
      totalInvestmentRequired: payload.totalInvestmentRequired,
      ...(payload.offerType === "harvest"
        ? {
            harvestBasedDetails: {
              expectedHarvest: payload.expectedHarvest,
              expectedLandArea: payload.expectedLandArea,
            },
          }
        : {
            commissionBasedDetails: {
              commissionPercentage: payload.commissionPercentage,
              investmentAmount: payload.investmentAmount,
              noOfInstallments: payload.noOfInstallments,
              expectedLandArea: payload.expectedLandArea,
            },
          }),
    };

    setIsSubmitting(true);

    try {
      await createFarmerAd(user._id, createAdPayload);
      onSubmit?.(payload);
      console.log("Farmer job creation payload:", createAdPayload);
      handleClose();
    } catch (apiError) {
      setValidationError(parseApiErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOfferTypeSelect = (selectedType: OfferType) => {
    setOfferType(selectedType);
    setValidationError("");
    setActiveStep("details");
  };

  const renderOfferTypeSelection = () => (
    <Box
      sx={{
        width: { xs: "95vw", md: "900px" },
        maxWidth: "95vw",
        bgcolor: "#050505",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#E2E8F0",
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ color: "#CBD5E1", bgcolor: "rgba(255,255,255,0.06)" }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>
        <Typography sx={{ fontWeight: 700, color: "#F8FAFC", fontSize: 15 }}>
          Step 1: Offer Type Selection
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ color: "rgba(226,232,240,0.7)" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 4, py: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            sx={{ fontSize: "0.88rem", color: "#94A3B8", fontWeight: 600 }}
          >
            Onboarding Progress
          </Typography>
          <Typography
            sx={{ fontSize: "0.85rem", color: "#A3E635", fontWeight: 700 }}
          >
            1 of 2
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: 6,
            borderRadius: 99,
            bgcolor: "#1E293B",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "50%",
              height: "100%",
              bgcolor: "#85A446",
              boxShadow: "0 0 12px rgba(133,164,70,0.45)",
            }}
          />
        </Box>
      </Box>

      <Box sx={{ px: 4, pt: 4, pb: 3 }}>
        <Typography
          sx={{
            color: "#F8FAFC",
            fontWeight: 800,
            fontSize: { xs: "1.8rem", md: "2.15rem" },
            lineHeight: 1.15,
            mb: 1,
          }}
        >
          Choose your project path
        </Typography>
        <Typography sx={{ color: "#94A3B8", fontSize: "1rem" }}>
          Select how you want to structure your farming project for investors.
        </Typography>
      </Box>

      <Box
        sx={{
          px: 4,
          pb: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2.5,
        }}
      >
        {OFFER_CARDS.map((card) => (
          <Box
            key={card.type}
            onClick={() => handleOfferTypeSelect(card.type)}
            sx={{
              minHeight: 280,
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.12)",
              overflow: "hidden",
              cursor: "pointer",
              position: "relative",
              transition: "all 0.25s ease",
              "&:hover": {
                borderColor: "rgba(133,164,70,0.5)",
                transform: "translateY(-2px)",
                boxShadow: "0 14px 28px rgba(0,0,0,0.45)",
              },
            }}
          >
            <Box
              component="img"
              src={card.image}
              alt={card.title}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.58,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(5,5,5,0.08) 5%, rgba(5,5,5,0.92) 90%)",
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                p: 2.5,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                {card.badge && (
                  <Chip
                    label={card.badge}
                    size="small"
                    sx={{
                      bgcolor: "#85A446",
                      color: "#0A0A0A",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 0.4,
                      fontSize: "0.62rem",
                      height: 22,
                    }}
                  />
                )}
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#F8FAFC",
                    fontWeight: 800,
                    fontSize: "1.55rem",
                    lineHeight: 1.2,
                    mb: 1,
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  sx={{ color: "#CBD5E1", fontSize: "0.9rem", mb: 0.75 }}
                >
                  {card.description}
                </Typography>
                <Typography
                  sx={{ color: "#94A3B8", fontSize: "0.79rem", mb: 2.1 }}
                >
                  {card.helper}
                </Typography>

                <Typography
                  sx={{
                    color: "#A3E635",
                    fontWeight: 800,
                    fontSize: "0.98rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                  }}
                >
                  Select Path <ChevronRight sx={{ fontSize: 18 }} />
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          p: 2.2,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={handleClose}
          sx={{ color: "#94A3B8", fontWeight: 600, textTransform: "none" }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );

  const renderDetailsForm = () => (
    <Box
      sx={{
        width: { xs: "96vw", lg: "1080px" },
        maxWidth: "96vw",
        bgcolor: "#0A0A0A",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#E2E8F0",
        display: "flex",
        flexDirection: "column",
        maxHeight: "92vh",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <IconButton
          onClick={() => setActiveStep("type-selection")}
          sx={{
            color: "#CBD5E1",
            bgcolor: "rgba(255,255,255,0.06)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#A3E635",
              fontWeight: 800,
              mb: 0.1,
            }}
          >
            New Offer
          </Typography>
          <Typography
            sx={{ color: "#F8FAFC", fontWeight: 800, fontSize: "1.05rem" }}
          >
            {selectedOfferCard?.title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 0.9, alignItems: "center" }}>
          {["Offer Details", "Review & Publish"].map((label, index) => {
            const active = index === 0;
            return (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  px: 1.4,
                  py: 0.65,
                  borderRadius: 99,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  bgcolor: active ? "#85A446" : "rgba(255,255,255,0.05)",
                  color: active ? "#fff" : "#64748B",
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: active
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                  }}
                >
                  {index + 1}
                </Box>
                {label}
              </Box>
            );
          })}

          <IconButton
            onClick={handleClose}
            sx={{ color: "rgba(226,232,240,0.7)" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" },
          minHeight: 0,
          flex: 1,
        }}
      >
        <DialogContent sx={{ px: 3, py: 3, minHeight: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 20,
                    borderRadius: 4,
                    bgcolor: "#85A446",
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.92rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    color: "#E2E8F0",
                  }}
                >
                  Offer Info
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                <TextField
                  label="Project Name *"
                  value={formData.projectName}
                  onChange={handleInputChange("projectName")}
                  placeholder="e.g., Anuradhapura Paddy Cycle Q3"
                  fullWidth
                  required
                  sx={textFieldStyles}
                />

                <TextField
                  label="Description *"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  placeholder="Describe project scope, outcomes, and investor expectations"
                  multiline
                  rows={3}
                  fullWidth
                  required
                  sx={textFieldStyles}
                />

                <FormControl fullWidth sx={selectStyles}>
                  <InputLabel>Preferred Regions (Optional)</InputLabel>
                  <Select<string[]>
                    multiple
                    value={formData.selectedRegions}
                    onChange={handleRegionsChange}
                    label="Preferred Regions (Optional)"
                    renderValue={(selected) => {
                      const selectedValues = selected as string[];
                      if (selectedValues.length === 0) {
                        return "Select districts";
                      }

                      return (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}
                        >
                          {selectedValues.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              size="small"
                              sx={{
                                bgcolor: "rgba(133,164,70,0.18)",
                                color: "#D9F99D",
                                fontWeight: 700,
                              }}
                            />
                          ))}
                        </Box>
                      );
                    }}
                  >
                    {REGIONS.map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "rgba(148,163,184,0.8)" }}>
                    Select regions where you can execute this project
                  </FormHelperText>
                </FormControl>
              </Box>
            </Box>

            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 20,
                    borderRadius: 4,
                    bgcolor: "#85A446",
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.92rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    color: "#E2E8F0",
                  }}
                >
                  Project Requirements
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  <FormControl fullWidth required sx={selectStyles}>
                    <InputLabel>Crop Type *</InputLabel>
                    <Select
                      value={formData.cropType}
                      onChange={handleInputChange("cropType")}
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

                  <FormControl fullWidth required sx={selectStyles}>
                    <InputLabel>Farming Methods *</InputLabel>
                    <Select
                      value={formData.farmingMethods}
                      onChange={handleInputChange("farmingMethods")}
                      label="Farming Methods *"
                    >
                      <MenuItem value="organic">Organic</MenuItem>
                      <MenuItem value="traditional">Traditional</MenuItem>
                      <MenuItem value="hydroponic">Hydroponic</MenuItem>
                      <MenuItem value="mixed">Mixed Methods</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  {offerType === "harvest" ? (
                    <TextField
                      label="Expected Harvest (KG)"
                      type="number"
                      value={formData.expectedHarvest}
                      onChange={handleInputChange("expectedHarvest")}
                      placeholder="e.g., 5000"
                      fullWidth
                      sx={textFieldStyles}
                    />
                  ) : (
                    <TextField
                      label="Commission Percentage (%)"
                      type="number"
                      value={formData.commissionPercentage}
                      onChange={handleInputChange("commissionPercentage")}
                      placeholder="e.g., 15"
                      fullWidth
                      sx={textFieldStyles}
                    />
                  )}

                  <TextField
                    label="Land Area (Acres)"
                    type="number"
                    value={formData.expectedLandArea}
                    onChange={handleInputChange("expectedLandArea")}
                    placeholder="e.g., 5.5"
                    fullWidth
                    sx={textFieldStyles}
                  />
                </Box>

                {offerType === "commission" && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, minmax(0, 1fr))",
                      },
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Investment Amount (LKR)"
                      type="number"
                      value={formData.investmentAmount}
                      onChange={handleInputChange("investmentAmount")}
                      placeholder="e.g., 250000"
                      fullWidth
                      sx={textFieldStyles}
                    />
                    <TextField
                      label="Number of Installments"
                      type="number"
                      value={formData.noOfInstallments}
                      onChange={handleInputChange("noOfInstallments")}
                      placeholder="e.g., 4"
                      fullWidth
                      sx={textFieldStyles}
                    />
                  </Box>
                )}

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Start Date *"
                    type="date"
                    value={formData.effectiveDateFrom}
                    onChange={handleInputChange("effectiveDateFrom")}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    sx={{
                      ...textFieldStyles,
                      "& input::-webkit-calendar-picker-indicator": {
                        filter: "invert(0.85)",
                        opacity: 0.75,
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
                      ...textFieldStyles,
                      "& input::-webkit-calendar-picker-indicator": {
                        filter: "invert(0.85)",
                        opacity: 0.75,
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
                  sx={textFieldStyles}
                />
              </Box>
            </Box>

            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 20,
                    borderRadius: 4,
                    bgcolor: "#85A446",
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.92rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    color: "#E2E8F0",
                  }}
                >
                  Cost Breakdown
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "rgba(148,163,184,0.85)",
                  fontSize: "0.82rem",
                  mb: 1.8,
                }}
              >
                Add itemized project costs. The same fields are editable
                directly in the table.
              </Typography>

              <TableContainer
                sx={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.02)",
                  overflowX: "auto",
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#94A3B8",
                          borderBottomColor: "rgba(255,255,255,0.08)",
                          fontWeight: 700,
                          fontSize: "0.73rem",
                          textTransform: "uppercase",
                          letterSpacing: 0.6,
                          minWidth: 200,
                        }}
                      >
                        Category *
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#94A3B8",
                          borderBottomColor: "rgba(255,255,255,0.08)",
                          fontWeight: 700,
                          fontSize: "0.73rem",
                          textTransform: "uppercase",
                          letterSpacing: 0.6,
                          minWidth: 250,
                        }}
                      >
                        Description
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#94A3B8",
                          borderBottomColor: "rgba(255,255,255,0.08)",
                          fontWeight: 700,
                          fontSize: "0.73rem",
                          textTransform: "uppercase",
                          letterSpacing: 0.6,
                          width: 170,
                        }}
                      >
                        Amount (LKR) *
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#94A3B8",
                          borderBottomColor: "rgba(255,255,255,0.08)",
                          fontWeight: 700,
                          fontSize: "0.73rem",
                          textTransform: "uppercase",
                          letterSpacing: 0.6,
                          width: 90,
                        }}
                      >
                        Remove
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {costBreakdown.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell
                          sx={{ borderBottomColor: "rgba(255,255,255,0.06)" }}
                        >
                          <TextField
                            value={item.category}
                            onChange={(event) =>
                              handleCostItemChange(
                                item.id,
                                "category",
                                event.target.value,
                              )
                            }
                            placeholder="e.g., Seeds"
                            fullWidth
                            size="small"
                            sx={tableInputStyles}
                          />
                        </TableCell>

                        <TableCell
                          sx={{ borderBottomColor: "rgba(255,255,255,0.06)" }}
                        >
                          <TextField
                            value={item.description}
                            onChange={(event) =>
                              handleCostItemChange(
                                item.id,
                                "description",
                                event.target.value,
                              )
                            }
                            placeholder="Optional details"
                            fullWidth
                            size="small"
                            sx={tableInputStyles}
                          />
                        </TableCell>

                        <TableCell
                          sx={{ borderBottomColor: "rgba(255,255,255,0.06)" }}
                        >
                          <TextField
                            type="number"
                            value={
                              item.estimatedCost === 0 ? "" : item.estimatedCost
                            }
                            onChange={(event) =>
                              handleCostItemChange(
                                item.id,
                                "estimatedCost",
                                event.target.value,
                              )
                            }
                            placeholder="0"
                            fullWidth
                            size="small"
                            sx={tableInputStyles}
                          />
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{ borderBottomColor: "rgba(255,255,255,0.06)" }}
                        >
                          <IconButton
                            onClick={() => handleRemoveCostItem(item.id)}
                            size="small"
                            disabled={costBreakdown.length === 1}
                            sx={{ color: "rgba(226,232,240,0.62)" }}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                startIcon={<AddCircleOutline />}
                onClick={handleAddCostItem}
                variant="outlined"
                sx={{
                  mt: 1.6,
                  color: "#A3E635",
                  borderColor: "rgba(163,230,53,0.38)",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "rgba(163,230,53,0.65)",
                    bgcolor: "rgba(163,230,53,0.08)",
                  },
                }}
              >
                Add Cost Item
              </Button>

              <Box
                sx={{
                  mt: 2,
                  p: 1.7,
                  border: "1px solid rgba(163,230,53,0.26)",
                  borderRadius: 2,
                  bgcolor: "rgba(163,230,53,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={`${costBreakdown.length} item${costBreakdown.length > 1 ? "s" : ""}`}
                  sx={{
                    bgcolor: "rgba(163,230,53,0.18)",
                    color: "#D9F99D",
                    fontWeight: 800,
                  }}
                />

                <Typography sx={{ color: "#F8FAFC", fontWeight: 800 }}>
                  Total Estimated Cost: {formatCurrency(totalEstimatedCost)}
                </Typography>
              </Box>
            </Box>

            {validationError && (
              <Typography sx={{ color: "#FCA5A5", fontWeight: 700, mt: -0.5 }}>
                {validationError}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <Box
          sx={{
            borderLeft: { lg: "1px solid rgba(255,255,255,0.08)" },
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 2.2,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(133,164,70,0.22)",
              background: "linear-gradient(135deg, #0f1a0a 0%, #0d1108 100%)",
              p: 2,
            }}
          >
            <Typography
              sx={{
                color: "rgba(163,230,53,0.8)",
                fontSize: "0.62rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
                mb: 1.25,
              }}
            >
              Publishing as
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {farmerAvatar ? (
                <Avatar src={farmerAvatar} sx={{ width: 42, height: 42 }} />
              ) : (
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    bgcolor: "rgba(133,164,70,0.2)",
                  }}
                >
                  <PersonOutline sx={{ color: "#D9F99D", fontSize: 22 }} />
                </Avatar>
              )}

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "#F8FAFC",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  {farmerName}
                </Typography>
                <Chip
                  label="Farmer"
                  size="small"
                  sx={{
                    height: 18,
                    mt: 0.55,
                    bgcolor: "rgba(163,230,53,0.16)",
                    color: "#D9F99D",
                    fontWeight: 800,
                    fontSize: "0.58rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.45,
                  }}
                />
                <Typography
                  sx={{
                    mt: 0.7,
                    color: "#94A3B8",
                    fontSize: "0.72rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                  }}
                >
                  <EmailOutlined sx={{ fontSize: 13 }} /> {user?.email || "—"}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.4,
                    color: "#94A3B8",
                    fontSize: "0.72rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                  }}
                >
                  <PhoneOutlined sx={{ fontSize: 13 }} />{" "}
                  {user?.phoneNumber || "—"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              borderRadius: 2,
              p: 2,
              border: "1px solid rgba(255,255,255,0.1)",
              bgcolor: "rgba(255,255,255,0.02)",
            }}
          >
            <Typography
              sx={{
                color: "#CBD5E1",
                fontWeight: 800,
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: 0.75,
                mb: 1.25,
              }}
            >
              Selected Path
            </Typography>

            <Typography
              sx={{
                color: "#F8FAFC",
                fontWeight: 700,
                fontSize: "0.92rem",
                mb: 0.6,
              }}
            >
              {selectedOfferCard?.title}
            </Typography>
            <Typography
              sx={{ color: "#94A3B8", fontSize: "0.8rem", lineHeight: 1.5 }}
            >
              {selectedOfferCard?.description}
            </Typography>

            <Box sx={{ mt: 1.5, display: "flex", gap: 0.8, flexWrap: "wrap" }}>
              <Button
                onClick={() => setOfferType("harvest")}
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 1.4,
                  borderRadius: 10,
                  fontSize: "0.72rem",
                  bgcolor:
                    offerType === "harvest"
                      ? "rgba(133,164,70,0.28)"
                      : "rgba(255,255,255,0.06)",
                  color: offerType === "harvest" ? "#D9F99D" : "#A1A1AA",
                }}
              >
                Harvest
              </Button>
              <Button
                onClick={() => setOfferType("commission")}
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 1.4,
                  borderRadius: 10,
                  fontSize: "0.72rem",
                  bgcolor:
                    offerType === "commission"
                      ? "rgba(133,164,70,0.28)"
                      : "rgba(255,255,255,0.06)",
                  color: offerType === "commission" ? "#D9F99D" : "#A1A1AA",
                }}
              >
                Commission
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              borderRadius: 2,
              p: 2,
              border: "1px solid rgba(255,255,255,0.1)",
              bgcolor: "rgba(255,255,255,0.02)",
            }}
          >
            <Typography
              sx={{
                color: "#CBD5E1",
                fontWeight: 800,
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: 0.75,
                mb: 1.25,
              }}
            >
              Live Summary
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.1 }}>
              <Typography sx={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                Project:{" "}
                <Box
                  component="span"
                  sx={{ color: "#F8FAFC", fontWeight: 700 }}
                >
                  {formData.projectName || "—"}
                </Box>
              </Typography>
              <Typography sx={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                Crop:{" "}
                <Box
                  component="span"
                  sx={{ color: "#F8FAFC", fontWeight: 700 }}
                >
                  {formData.cropType || "—"}
                </Box>
              </Typography>
              <Typography sx={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                Region Count:{" "}
                <Box
                  component="span"
                  sx={{ color: "#F8FAFC", fontWeight: 700 }}
                >
                  {formData.selectedRegions.length}
                </Box>
              </Typography>
              <Typography sx={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                Total Estimate:{" "}
                <Box
                  component="span"
                  sx={{ color: "#A3E635", fontWeight: 800 }}
                >
                  {formatCurrency(totalEstimatedCost)}
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <DialogActions
        sx={{
          p: 2.5,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          variant="outlined"
          sx={{
            borderColor: "rgba(148,163,184,0.45)",
            color: "#CBD5E1",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            borderRadius: 2,
            "&:hover": {
              borderColor: "rgba(148,163,184,0.85)",
              bgcolor: "rgba(255,255,255,0.05)",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          variant="contained"
          endIcon={<ChevronRight sx={{ fontSize: 18 }} />}
          sx={{
            minWidth: 220,
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 2,
            background: "linear-gradient(135deg,#85A446 0%,#AED95C 100%)",
            "&:hover": {
              background: "linear-gradient(135deg,#94B452 0%,#BAE36A 100%)",
            },
          }}
        >
          {isSubmitting ? "Creating Project..." : "Create Project"}
        </Button>
      </DialogActions>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          bgcolor: "transparent",
          boxShadow: "none",
          overflow: "visible",
          borderRadius: 3,
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0,0,0,0.72)",
          },
        },
      }}
    >
      {activeStep === "type-selection"
        ? renderOfferTypeSelection()
        : renderDetailsForm()}
    </Dialog>
  );
};

export default CreateOfferDialog;
