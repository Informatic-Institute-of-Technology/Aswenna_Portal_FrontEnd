import { useAuth } from "@/Context/useAuth";
import coverImages from "@/data/json/coverImages.json";
import {
  AddCircleOutline,
  ArrowBack,
  Check,
  ChevronRight,
  Close as CloseIcon,
  DeleteOutline,
  EmailOutlined,
  PersonOutline,
  PhoneOutlined,
  Upload,
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
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  FlashcardNotification,
  type FlashcardNotificationContent,
} from "../../components/common/FlashcardNotification";
import {
  createFarmerAd,
  type CreateFarmerAdPayload,
  updateFarmerAd,
} from "../../services/farmerAds.service";
import type { BudgetItem } from "../../types/farmer.types";

interface CreateOfferDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: FarmerJobCreationPayload) => void | Promise<void>;
  mode?: "create" | "edit";
  projectId?: string;
  initialData?: FarmerProjectFormInitialData | null;
}

type OfferType = "harvest" | "commission";
type DialogStep = "type-selection" | "details";
type LandAvailability = "with_land" | "without_land";

interface JobCreationFormData {
  projectName: string;
  cropType: string;
  cropIcon: string;
  coverImage: string;
  expiryDate: string;
  effectiveDateFrom: string;
  landAvailability: LandAvailability | "";
  landSize: string;
  landLocation: string;
  location: string;
  farmingMethods: string;
  agreementType: string;
  description: string;
  selectedRegions: string[];
  expectedHarvest: string;
  commissionPercentage: string;
}

interface MilestoneBreakdownItem {
  id: string;
  milestone: string;
  description: string;
  estimatedAmount: number;
}

type CoverImage = { id: string; label: string; url: string };

export interface FarmerJobCreationPayload {
  offerType: OfferType;
  projectName: string;
  cropType: string;
  cropIcon: string;
  coverImage: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  expiryDate: string;
  location: string;
  landAvailability: LandAvailability;
  landSize?: number;
  landLocation?: string;
  farmingMethods: string;
  agreementType: string;
  description: string;
  selectedRegions: string[];
  expectedHarvest?: number;
  commissionPercentage?: number;
  costBreakdown: BudgetItem[];
  milestoneBreakdown: Array<{
    milestone: string;
    description: string;
    estimatedAmount: number;
  }>;
  totalInvestmentRequired: number;
}

export interface FarmerProjectFormInitialData {
  offerType: OfferType;
  projectName: string;
  cropType: string;
  cropIcon?: string;
  coverImage?: string;
  effectiveDateFrom?: string;
  expiryDate?: string;
  location: string;
  landAvailability: LandAvailability;
  landSize?: number;
  landLocation?: string;
  farmingMethods?: string;
  agreementType?: string;
  description?: string;
  selectedRegions?: string[];
  expectedHarvest?: number;
  commissionPercentage?: number;
  costBreakdown?: Array<{
    category: string;
    description: string;
    estimatedCost: number;
  }>;
  milestoneBreakdown?: Array<{
    milestone: string;
    description: string;
    estimatedAmount: number;
  }>;
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

const CROP_EMOJIS = [
  "🌾",
  "🥕",
  "🍅",
  "🥦",
  "🌽",
  "🥔",
  "🧅",
  "🧄",
  "🥬",
  "🫑",
];

const coverImageList = coverImages as CoverImage[];

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

const createInitialMilestoneBreakdown = (): MilestoneBreakdownItem[] => [
  {
    id: "milestone-1",
    milestone: "Land Preparation",
    description: "Initial land clearing and preparation",
    estimatedAmount: 0,
  },
  {
    id: "milestone-2",
    milestone: "Planting",
    description: "Seed purchasing and planting operations",
    estimatedAmount: 0,
  },
];

const initialFormData: JobCreationFormData = {
  projectName: "",
  cropType: "",
  cropIcon: "",
  coverImage: "",
  expiryDate: "",
  effectiveDateFrom: "",
  landAvailability: "",
  landSize: "",
  landLocation: "",
  location: "",
  farmingMethods: "",
  agreementType: "",
  description: "",
  selectedRegions: [],
  expectedHarvest: "",
  commissionPercentage: "",
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
  mode = "create",
  projectId,
  initialData,
}: CreateOfferDialogProps) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<DialogStep>("type-selection");
  const [offerType, setOfferType] = useState<OfferType>("harvest");
  const [formData, setFormData] =
    useState<JobCreationFormData>(initialFormData);
  const [costBreakdown, setCostBreakdown] = useState<BudgetItem[]>(
    createInitialCostBreakdown(),
  );
  const [milestoneBreakdown, setMilestoneBreakdown] = useState<
    MilestoneBreakdownItem[]
  >(createInitialMilestoneBreakdown());
  const [notification, setNotification] =
    useState<FlashcardNotificationContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "error",
    duration = 5000,
  ) => {
    setNotification({
      id: `notification-${Date.now()}`,
      message,
      type,
      duration,
    });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const toDateInputValue = (value?: string) => {
    if (!value) {
      return "";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value.slice(0, 10);
    }

    return parsedDate.toISOString().slice(0, 10);
  };

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

  const totalMilestoneAmount = useMemo(
    () =>
      milestoneBreakdown.reduce(
        (total, item) =>
          total +
          (Number.isFinite(item.estimatedAmount)
            ? Number(item.estimatedAmount)
            : 0),
        0,
      ),
    [milestoneBreakdown],
  );

  const farmerName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Farmer";

  const farmerAvatar = getUserAvatarUrl(user?.personalInfo?.profilePicture);

  const selectedOfferCard = OFFER_CARDS.find((item) => item.type === offerType);
  const selectedCover = coverImageList.find(
    (image) =>
      image.id === formData.coverImage || image.url === formData.coverImage,
  );

  useEffect(() => {
    if (!open || mode !== "edit" || !initialData) {
      return;
    }

    const normalizedOfferType =
      initialData.offerType === "commission" ? "commission" : "harvest";

    setActiveStep("details");
    setOfferType(normalizedOfferType);
    setFormData({
      projectName: initialData.projectName || "",
      cropType: initialData.cropType || "",
      cropIcon: initialData.cropIcon || "",
      coverImage: initialData.coverImage || "",
      expiryDate: toDateInputValue(initialData.expiryDate),
      effectiveDateFrom: toDateInputValue(initialData.effectiveDateFrom),
      landAvailability: initialData.landAvailability || "",
      landSize:
        typeof initialData.landSize === "number" &&
        Number.isFinite(initialData.landSize)
          ? String(initialData.landSize)
          : "",
      landLocation: initialData.landLocation || "",
      location: initialData.location || "",
      farmingMethods: initialData.farmingMethods || "",
      agreementType: initialData.agreementType || "",
      description: initialData.description || "",
      selectedRegions: initialData.selectedRegions || [],
      expectedHarvest:
        typeof initialData.expectedHarvest === "number" &&
        Number.isFinite(initialData.expectedHarvest)
          ? String(initialData.expectedHarvest)
          : "",
      commissionPercentage:
        typeof initialData.commissionPercentage === "number" &&
        Number.isFinite(initialData.commissionPercentage)
          ? String(initialData.commissionPercentage)
          : "",
    });

    setCostBreakdown(
      initialData.costBreakdown && initialData.costBreakdown.length > 0
        ? initialData.costBreakdown.map((item, index) => ({
            id: `cost-${Date.now()}-${index}`,
            category: item.category,
            description: item.description,
            estimatedCost: item.estimatedCost,
          }))
        : createInitialCostBreakdown(),
    );

    setMilestoneBreakdown(
      initialData.milestoneBreakdown &&
        initialData.milestoneBreakdown.length > 0
        ? initialData.milestoneBreakdown.map((item, index) => ({
            id: `milestone-${Date.now()}-${index}`,
            milestone: item.milestone,
            description: item.description,
            estimatedAmount: item.estimatedAmount,
          }))
        : createInitialMilestoneBreakdown(),
    );

    closeNotification();
  }, [open, mode, initialData]);

  const handleInputChange =
    (field: keyof JobCreationFormData) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>,
    ) => {
      const value = event.target.value;
      setFormData((previousData) => ({
        ...previousData,
        [field]: value,
      }));
    };

  const handleRegionsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData((previousData) => ({
      ...previousData,
      selectedRegions: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleLandAvailabilityChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as LandAvailability | "";

    setFormData((previousData) => ({
      ...previousData,
      landAvailability: value,
      ...(value === "without_land"
        ? {
            landSize: "",
            landLocation: "",
          }
        : {}),
    }));
  };

  const handleCostItemChange = (
    itemId: string,
    field: "category" | "description" | "estimatedCost",
    value: string,
  ) => {
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

  const handleMilestoneItemChange = (
    itemId: string,
    field: "milestone" | "description" | "estimatedAmount",
    value: string,
  ) => {
    setMilestoneBreakdown((previousItems) =>
      previousItems.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        if (field === "estimatedAmount") {
          const parsedAmount = Number(value);
          return {
            ...item,
            estimatedAmount:
              Number.isFinite(parsedAmount) && parsedAmount >= 0
                ? parsedAmount
                : 0,
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

  const handleAddMilestoneItem = () => {
    setMilestoneBreakdown((previousItems) => [
      ...previousItems,
      {
        id: `milestone-${Date.now()}`,
        milestone: "",
        description: "",
        estimatedAmount: 0,
      },
    ]);
  };

  const handleRemoveMilestoneItem = (itemId: string) => {
    if (milestoneBreakdown.length === 1) {
      return;
    }

    setMilestoneBreakdown((previousItems) =>
      previousItems.filter((item) => item.id !== itemId),
    );
  };

  const handleCropIconSelect = (cropIcon: string) => {
    setFormData((previousData) => ({
      ...previousData,
      cropIcon,
    }));
  };

  const handleCoverImageSelect = (coverImage: string) => {
    setFormData((previousData) => ({
      ...previousData,
      coverImage,
    }));
  };

  const resetForm = () => {
    setActiveStep("type-selection");
    setOfferType("harvest");
    setFormData(initialFormData);
    setCostBreakdown(createInitialCostBreakdown());
    setMilestoneBreakdown(createInitialMilestoneBreakdown());
    closeNotification();
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

  const normalizeMilestoneBreakdown = () =>
    milestoneBreakdown
      .map((item) => ({
        milestone: item.milestone.trim(),
        description: item.description.trim(),
        estimatedAmount: item.estimatedAmount,
      }))
      .filter((item) => item.milestone.length > 0 && item.estimatedAmount > 0);

  const validateForm = (
    normalizedCostBreakdown: BudgetItem[],
    normalizedMilestoneBreakdown: Array<{
      milestone: string;
      description: string;
      estimatedAmount: number;
    }>,
  ) => {
    if (
      !formData.projectName.trim() ||
      !formData.description.trim() ||
      !formData.cropType.trim() ||
      !formData.farmingMethods.trim() ||
      !formData.expiryDate
    ) {
      return "Please complete all required project details before creating the job.";
    }

    if (!formData.cropIcon || !formData.coverImage) {
      return "Please select a crop icon and a cover image before creating the job.";
    }

    if (!formData.landAvailability) {
      return "Please select whether this project is with land or without land.";
    }

    if (offerType === "harvest" && !formData.location.trim()) {
      return "Please provide the project location for direct harvesting offers.";
    }

    if (offerType === "commission" && formData.selectedRegions.length === 0) {
      return "Please select at least one preferred region for commission-based projects.";
    }

    if (formData.landAvailability === "with_land") {
      const parsedLandSize = Number(formData.landSize);

      if (!Number.isFinite(parsedLandSize) || parsedLandSize <= 0) {
        return "Please provide a valid land size for projects with land.";
      }

      if (offerType === "commission" && !formData.landLocation.trim()) {
        return "Please provide the location of the land.";
      }
    }

    if (offerType === "harvest") {
      if (!formData.effectiveDateFrom) {
        return "Please select a start date for direct harvesting offers.";
      }

      if (
        new Date(formData.effectiveDateFrom).getTime() >
        new Date(formData.expiryDate).getTime()
      ) {
        return "Expiry date must be later than start date.";
      }
    }

    if (offerType === "commission") {
      return "";
    }

    if (normalizedCostBreakdown.length === 0) {
      return "Add at least one valid cost breakdown item with category and amount.";
    }

    if (normalizedMilestoneBreakdown.length === 0) {
      return "Add at least one valid milestone breakdown item with milestone and amount.";
    }

    const totalCostAmount = normalizedCostBreakdown.reduce(
      (total, item) => total + item.estimatedCost,
      0,
    );

    const totalMilestoneAmount = normalizedMilestoneBreakdown.reduce(
      (total, item) => total + item.estimatedAmount,
      0,
    );

    if (totalMilestoneAmount > totalCostAmount) {
      return `Milestone breakdown total (LKR ${totalMilestoneAmount.toLocaleString()}) cannot exceed cost breakdown total (LKR ${totalCostAmount.toLocaleString()}).`;
    }

    if (totalMilestoneAmount !== totalCostAmount) {
      return `Milestone breakdown total (LKR ${totalMilestoneAmount.toLocaleString()}) must equal cost breakdown total (LKR ${totalCostAmount.toLocaleString()}).`;
    }

    return "";
  };

  const handleSave = async () => {
    const normalizedCostBreakdown =
      offerType === "harvest" ? normalizeCostBreakdown() : [];
    const normalizedMilestoneBreakdown =
      offerType === "harvest" ? normalizeMilestoneBreakdown() : [];
    const error = validateForm(
      normalizedCostBreakdown,
      normalizedMilestoneBreakdown,
    );

    if (error) {
      showNotification(error, "error");
      return;
    }

    if (!user?._id) {
      showNotification(
        "Unable to identify the current farmer account. Please sign in again.",
        "error",
      );
      return;
    }

    const totalInvestmentRequired =
      offerType === "harvest"
        ? normalizedCostBreakdown.reduce(
            (total, item) => total + item.estimatedCost,
            0,
          )
        : 0;

    const landAvailability = formData.landAvailability as LandAvailability;
    const landSize =
      landAvailability === "with_land"
        ? parseOptionalNumber(formData.landSize)
        : undefined;
    const landLocation =
      landAvailability === "with_land"
        ? offerType === "harvest"
          ? formData.location.trim()
          : formData.landLocation.trim()
        : undefined;

    const resolvedProjectLocation =
      offerType === "harvest"
        ? formData.location.trim()
        : formData.selectedRegions.length > 0
          ? formData.selectedRegions[0]
          : landLocation || "Not specified";

    const payload: FarmerJobCreationPayload = {
      offerType,
      projectName: formData.projectName.trim(),
      cropType: formData.cropType,
      cropIcon: formData.cropIcon,
      coverImage: formData.coverImage,
      effectiveDateFrom:
        offerType === "harvest"
          ? formData.effectiveDateFrom
          : formData.expiryDate,
      effectiveDateTo: formData.expiryDate,
      expiryDate: formData.expiryDate,
      location: resolvedProjectLocation,
      landAvailability,
      landSize,
      landLocation,
      farmingMethods: formData.farmingMethods,
      agreementType: formData.agreementType,
      description: formData.description.trim(),
      selectedRegions:
        offerType === "commission" ? formData.selectedRegions : [],
      expectedHarvest:
        offerType === "harvest"
          ? parseOptionalNumber(formData.expectedHarvest)
          : undefined,
      commissionPercentage:
        offerType === "commission"
          ? parseOptionalNumber(formData.commissionPercentage)
          : undefined,
      costBreakdown: normalizedCostBreakdown,
      milestoneBreakdown: normalizedMilestoneBreakdown,
      totalInvestmentRequired,
    };

    const createAdPayload: CreateFarmerAdPayload = {
      farmer: user._id,
      farmerImage: farmerAvatar ?? undefined,
      offerType: payload.offerType,
      projectName: payload.projectName,
      description: payload.description,
      cropType: payload.cropType,
      cropIcon: payload.cropIcon,
      backgroundImage: payload.coverImage,
      location: payload.location,
      landAvailability: payload.landAvailability,
      effectiveDateFrom: payload.effectiveDateFrom,
      effectiveDateTo: payload.expiryDate,
      farmingMethods: payload.farmingMethods,
      preferredRegions: payload.selectedRegions,
      costBreakdown: payload.costBreakdown.map((item) => ({
        category: item.category,
        description: item.description,
        estimatedCost: item.estimatedCost,
      })),
      milestoneBreakdown: payload.milestoneBreakdown.map((item) => ({
        milestone: item.milestone,
        description: item.description,
        estimatedAmount: item.estimatedAmount,
      })),
      totalInvestmentRequired: payload.totalInvestmentRequired,
      ...(payload.offerType === "harvest"
        ? {
            harvestBasedDetails: {
              expectedHarvest: payload.expectedHarvest,
              expectedLandArea: payload.landSize,
            },
          }
        : {
            commissionBasedDetails: {
              commissionPercentage: payload.commissionPercentage,
              expectedLandArea: payload.landSize,
            },
          }),
    };

    setIsSubmitting(true);

    try {
      if (mode === "edit") {
        if (!projectId) {
          showNotification(
            "Unable to update project. Missing project reference.",
            "error",
          );
          return;
        }

        await updateFarmerAd(projectId, createAdPayload);
      } else {
        await createFarmerAd(user._id, createAdPayload);
      }

      if (onSubmit) {
        await onSubmit(payload);
      }
      showNotification(
        mode === "edit"
          ? `Project "${payload.projectName}" updated successfully!`
          : `Project "${payload.projectName}" created successfully!`,
        "success",
        4000,
      );
      console.log(
        mode === "edit"
          ? "Farmer job update payload:"
          : "Farmer job creation payload:",
        createAdPayload,
      );
      handleClose();
    } catch (apiError) {
      showNotification(parseApiErrorMessage(apiError), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOfferTypeSelect = (selectedType: OfferType) => {
    setOfferType(selectedType);
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
          onClick={() =>
            mode === "edit" ? handleClose() : setActiveStep("type-selection")
          }
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
            {mode === "edit" ? "Edit Offer" : "New Offer"}
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
                  label="Project Name"
                  value={formData.projectName}
                  onChange={handleInputChange("projectName")}
                  placeholder="e.g., Anuradhapura Paddy Cycle Q3"
                  fullWidth
                  required
                  sx={textFieldStyles}
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange("description")}
                  placeholder="Describe project scope, outcomes, and investor expectations"
                  multiline
                  rows={3}
                  fullWidth
                  required
                  sx={textFieldStyles}
                />

                {offerType === "harvest" ? (
                  <TextField
                    label="Project Location"
                    value={formData.location}
                    onChange={handleInputChange("location")}
                    placeholder="e.g., Anuradhapura"
                    fullWidth
                    required
                    sx={textFieldStyles}
                  />
                ) : (
                  <FormControl fullWidth required sx={selectStyles}>
                    <InputLabel>Preferred Regions</InputLabel>
                    <Select<string[]>
                      multiple
                      value={formData.selectedRegions}
                      onChange={handleRegionsChange}
                      label="Preferred Regions"
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
                      Select one or more preferred regions for this commission
                      project
                    </FormHelperText>
                  </FormControl>
                )}
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
                    <InputLabel>Crop Type</InputLabel>
                    <Select
                      value={formData.cropType}
                      onChange={handleInputChange("cropType")}
                      label="Crop Type"
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
                    <InputLabel>Farming Methods</InputLabel>
                    <Select
                      value={formData.farmingMethods}
                      onChange={handleInputChange("farmingMethods")}
                      label="Farming Methods"
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
                </Box>

                <FormControl fullWidth required sx={selectStyles}>
                  <InputLabel>Land Availability</InputLabel>
                  <Select
                    value={formData.landAvailability}
                    onChange={handleLandAvailabilityChange}
                    label="Land Availability"
                  >
                    <MenuItem value="with_land">With Land</MenuItem>
                    <MenuItem value="without_land">Without Land</MenuItem>
                  </Select>
                </FormControl>

                {formData.landAvailability === "with_land" && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md:
                          offerType === "commission"
                            ? "repeat(2, minmax(0, 1fr))"
                            : "1fr",
                      },
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Land Size (Acres)"
                      type="number"
                      value={formData.landSize}
                      onChange={handleInputChange("landSize")}
                      placeholder="e.g., 5.5"
                      fullWidth
                      required
                      sx={textFieldStyles}
                    />

                    {offerType === "commission" && (
                      <TextField
                        label="Location of the Land"
                        value={formData.landLocation}
                        onChange={handleInputChange("landLocation")}
                        placeholder="e.g., Anuradhapura"
                        fullWidth
                        required
                        sx={textFieldStyles}
                      />
                    )}
                  </Box>
                )}

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md:
                        offerType === "harvest"
                          ? "repeat(2, minmax(0, 1fr))"
                          : "1fr",
                    },
                    gap: 2,
                  }}
                >
                  {offerType === "harvest" && (
                    <TextField
                      label="Start Date"
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
                  )}

                  <TextField
                    label="Expiry Date"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleInputChange("expiryDate")}
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
              </Box>
            </Box>

            {offerType === "harvest" && (
              <>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
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
                              sx={{
                                borderBottomColor: "rgba(255,255,255,0.06)",
                              }}
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
                              sx={{
                                borderBottomColor: "rgba(255,255,255,0.06)",
                              }}
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
                              sx={{
                                borderBottomColor: "rgba(255,255,255,0.06)",
                              }}
                            >
                              <TextField
                                type="number"
                                value={
                                  item.estimatedCost === 0
                                    ? ""
                                    : item.estimatedCost
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
                              sx={{
                                borderBottomColor: "rgba(255,255,255,0.06)",
                              }}
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

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.5,
                    }}
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
                      Milestone Breakdown
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "rgba(148,163,184,0.85)",
                      fontSize: "0.82rem",
                      mb: 1.8,
                    }}
                  >
                    Define milestone-level disbursement items for this project.
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
                              minWidth: 220,
                            }}
                          >
                            Milestone *
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
                        {milestoneBreakdown.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell
                              sx={{
                                borderBottomColor: "rgba(255,255,255,0.06)",
                              }}
                            >
                              <TextField
                                value={item.milestone}
                                onChange={(event) =>
                                  handleMilestoneItemChange(
                                    item.id,
                                    "milestone",
                                    event.target.value,
                                  )
                                }
                                placeholder="e.g., Land Preparation"
                                fullWidth
                                size="small"
                                sx={tableInputStyles}
                              />
                            </TableCell>

                            <TableCell
                              sx={{
                                borderBottomColor: "rgba(255,255,255,0.06)",
                              }}
                            >
                              <TextField
                                value={item.description}
                                onChange={(event) =>
                                  handleMilestoneItemChange(
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
                              sx={{
                                borderBottomColor: "rgba(255,255,255,0.06)",
                              }}
                            >
                              <TextField
                                type="number"
                                value={
                                  item.estimatedAmount === 0
                                    ? ""
                                    : item.estimatedAmount
                                }
                                onChange={(event) =>
                                  handleMilestoneItemChange(
                                    item.id,
                                    "estimatedAmount",
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
                              sx={{
                                borderBottomColor: "rgba(255,255,255,0.06)",
                              }}
                            >
                              <IconButton
                                onClick={() =>
                                  handleRemoveMilestoneItem(item.id)
                                }
                                size="small"
                                disabled={milestoneBreakdown.length === 1}
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
                    onClick={handleAddMilestoneItem}
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
                    Add Milestone
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
                      label={`${milestoneBreakdown.length} milestone${milestoneBreakdown.length > 1 ? "s" : ""}`}
                      sx={{
                        bgcolor: "rgba(163,230,53,0.18)",
                        color: "#D9F99D",
                        fontWeight: 800,
                      }}
                    />

                    <Typography sx={{ color: "#F8FAFC", fontWeight: 800 }}>
                      Milestone Total: {formatCurrency(totalMilestoneAmount)}
                    </Typography>
                  </Box>
                </Box>
              </>
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
                mb: 1.2,
              }}
            >
              Crop Icon
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 0.8,
              }}
            >
              {CROP_EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  onClick={() => handleCropIconSelect(emoji)}
                  sx={{
                    minWidth: 0,
                    p: 0,
                    height: 44,
                    borderRadius: 1.5,
                    fontSize: "1.2rem",
                    bgcolor:
                      formData.cropIcon === emoji
                        ? "rgba(133,164,70,0.22)"
                        : "#141414",
                    border:
                      formData.cropIcon === emoji
                        ? "1px solid rgba(133,164,70,0.85)"
                        : "1px solid rgba(255,255,255,0.08)",
                    color: "#E2E8F0",
                    "&:hover": {
                      bgcolor: "rgba(133,164,70,0.12)",
                    },
                  }}
                >
                  {emoji}
                </Button>
              ))}
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.25,
              }}
            >
              <Typography
                sx={{
                  color: "#CBD5E1",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.75,
                }}
              >
                Cover Image
              </Typography>
              <Button
                startIcon={<Upload sx={{ fontSize: 14 }} />}
                size="small"
                sx={{
                  ml: "auto",
                  color: "#A3E635",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  minWidth: 0,
                  px: 0.75,
                  py: 0.2,
                }}
              >
                Upload
              </Button>
            </Box>

            {selectedCover && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: 1.5,
                  overflow: "hidden",
                  mb: 1.5,
                }}
              >
                <Box
                  component="img"
                  src={selectedCover.url}
                  alt={selectedCover.label}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.62) 100%)",
                  }}
                />
                <Typography
                  sx={{
                    position: "absolute",
                    left: 10,
                    bottom: 8,
                    color: "#F8FAFC",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  {selectedCover.label}
                </Typography>
                <Chip
                  icon={<Check sx={{ fontSize: 12 }} />}
                  label="Selected"
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    bgcolor: "#85A446",
                    color: "#fff",
                    fontWeight: 700,
                    height: 20,
                    fontSize: "0.62rem",
                  }}
                />
              </Box>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 0.7,
              }}
            >
              {coverImageList.map((image) => (
                <Box
                  key={image.id}
                  onClick={() => handleCoverImageSelect(image.id)}
                  sx={{
                    position: "relative",
                    borderRadius: 1.3,
                    overflow: "hidden",
                    aspectRatio: "1 / 1",
                    cursor: "pointer",
                    opacity: formData.coverImage === image.id ? 1 : 0.62,
                    border:
                      formData.coverImage === image.id
                        ? "2px solid #85A446"
                        : "1px solid rgba(255,255,255,0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      opacity: 0.95,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={image.url}
                    alt={image.label}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              ))}
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
          {isSubmitting
            ? mode === "edit"
              ? "Saving Changes..."
              : "Creating Project..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Project"}
        </Button>
      </DialogActions>
    </Box>
  );

  return (
    <>
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
      <FlashcardNotification
        notification={notification}
        onClose={closeNotification}
      />
    </>
  );
};

export default CreateOfferDialog;
