import { useAuth } from "@/Context/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import coverImages from "../../data/json/coverImages.json";
import CreateOfferDialog, {
  type FarmerJobCreationPayload,
  type FarmerProjectFormInitialData,
} from "../farmer/JobCreation";
import ProjectDetailsDialog from "../../components/farmer/ProjectDetailsDialog";
import { OfferCard } from "../../components/investor";
import {
  deleteFarmerAd,
  getFarmerAdsByUser,
} from "../../services/farmerAds.service";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Agriculture,
  BarChart,
  Delete,
  Edit,
  Folder,
  HourglassEmpty,
  Landscape,
  LocationOn,
  Visibility,
  WarningAmber,
} from "@mui/icons-material";

interface ProjectCostBreakdownItem {
  category: string;
  description: string;
  amount: number;
}

interface ProjectMilestoneBreakdownItem {
  milestone: string;
  description?: string;
  estimatedAmount: number;
}

interface ProjectTeamMember {
  id: string;
  name: string;
  role: "INVESTOR" | "FARMER" | "LANDOWNER";
  email?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  isCurrentUser?: boolean;
}

interface Project {
  id: number | string;
  name: string;
  cropType: string;
  cropIcon: string;
  status: "ACTIVE" | "IN REVIEW" | "COMPLETED";
  investmentStatus: string;
  fundingPercentage?: number;
  progress: number;
  landArea: number;
  budget: number;
  expectedROI: number;
  startDate: string;
  endDate?: string;
  expiryDate?: string;
  harvestDate?: string;
  region?: string;
  location: string;
  profitYield?: string;
  completedDate?: string;
  backgroundImage?: string;
  investmentType: "harvest" | "commission";
  // Team members
  farmerName: string;
  farmerImage: string;
  landownerName?: string;
  landAvailability?: "with_land" | "without_land";
  landSize?: number;
  landLocation?: string;
  expectedHarvest?: number;
  commissionPercentage?: number;
  description?: string;
  farmingMethods?: string;
  preferredRegions?: string[];
  cropTypeValue?: string;
  coverImageValue?: string;
  costBreakdown?: ProjectCostBreakdownItem[];
  milestoneBreakdown?: ProjectMilestoneBreakdownItem[];
  teamMembers?: ProjectTeamMember[];
}

const selectActiveProjects = (projects: Project[]) => {
  const explicitlyActive = projects.filter(
    (project) => project.status === "ACTIVE",
  );

  if (explicitlyActive.length > 0) {
    return [explicitlyActive[0]];
  }

  const inferredActive = projects.find(
    (project) => project.status === "IN REVIEW",
  );
  return inferredActive ? [inferredActive] : [];
};

const initialProjects: Project[] = [
  {
    id: 1,
    name: "Premium Rice Cultivation",
    cropType: "Rice (Nadu)",
    cropIcon: "🌾",
    status: "ACTIVE",
    investmentStatus: "75% Funded",
    fundingPercentage: 75,
    progress: 74,
    landArea: 5.5,
    budget: 250500,
    expectedROI: 28,
    startDate: "2025-11-15",
    endDate: "2026-04-30",
    harvestDate: "Apr 30, 2026",
    location: "Anuradhapura",
    backgroundImage:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600",
    investmentType: "harvest",
    farmerName: "Kamal Perera",
    farmerImage: "https://randomuser.me/api/portraits/men/32.jpg",
    landownerName: "Perera Estates",
  },
  {
    id: 2,
    name: "Emerald Tea Plantation",
    cropType: "Ceylon Black Tea",
    cropIcon: "🍵",
    status: "IN REVIEW",
    investmentStatus: "Pending Approval",
    fundingPercentage: 10,
    progress: 10,
    landArea: 12.0,
    budget: 450000,
    expectedROI: 22,
    startDate: "2025-12-01",
    endDate: "2026-08-30",
    region: "Nuwara Eliya",
    location: "Nuwara Eliya",
    backgroundImage:
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600",
    investmentType: "commission",
    farmerName: "Sunil Fernando",
    farmerImage: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 3,
    name: "Organic Pepper Vines",
    cropType: "Black Pepper",
    cropIcon: "🌿",
    status: "COMPLETED",
    investmentStatus: "Fully Payout",
    fundingPercentage: 100,
    progress: 100,
    landArea: 8.0,
    budget: 320000,
    expectedROI: 18,
    startDate: "2024-06-01",
    endDate: "2024-01-12",
    profitYield: "+18.4%",
    completedDate: "Jan 12, 2024",
    location: "Matale",
    backgroundImage:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600",
    investmentType: "harvest",
    farmerName: "Nimal Silva",
    farmerImage: "https://randomuser.me/api/portraits/men/67.jpg",
    landownerName: "Silva Spice Gardens",
  },
];

// TODO: Fetch projects dynamically from API
// API endpoint: GET /api/farmer/projects

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "IN REVIEW":
      return "warning";
    case "COMPLETED":
      return "primary";
    default:
      return "default";
  }
};

const getCropIcon = (cropType: string) => {
  const iconMap: Record<string, string> = {
    rice: "🌾",
    tea: "🍵",
    pepper: "🌿",
    vegetables: "🥕",
    fruits: "🍎",
    coconut: "🥥",
  };

  return iconMap[cropType.toLowerCase()] ?? "🌱";
};

const formatCropLabel = (cropType: string) =>
  cropType
    .split(" ")
    .map((word) =>
      word.length > 0
        ? word[0].toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
    .join(" ");

const coverImageMap = Object.fromEntries(
  (coverImages as Array<{ id: string; url: string }>).map((image) => [
    image.id,
    image.url,
  ]),
);

const resolveCoverImageUrl = (coverImageId: string) =>
  coverImageMap[coverImageId] || undefined;

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
  typeof value === "object" && value !== null;

const looksLikeProjectRecord = (value: ApiRecord) =>
  typeof value.projectName === "string" ||
  typeof value.name === "string" ||
  typeof value.cropType === "string" ||
  typeof value.offerType === "string" ||
  typeof value.investmentType === "string" ||
  typeof value.status === "string" ||
  typeof value.projectStatus === "string" ||
  typeof value._id === "string" ||
  typeof value.id === "string" ||
  typeof value.id === "number";

const findProjectArrayDeep = (value: unknown, depth = 0): ApiRecord[] => {
  if (depth > 4) {
    return [];
  }

  if (Array.isArray(value)) {
    const records = value.filter(isRecord);

    if (records.length > 0 && records.some(looksLikeProjectRecord)) {
      return records;
    }

    for (const item of value) {
      const nested = findProjectArrayDeep(item, depth + 1);
      if (nested.length > 0) {
        return nested;
      }
    }

    return [];
  }

  if (!isRecord(value)) {
    return [];
  }

  for (const nestedValue of Object.values(value)) {
    const nested = findProjectArrayDeep(nestedValue, depth + 1);
    if (nested.length > 0) {
      return nested;
    }
  }

  return [];
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getValidDate = (value: unknown, fallback?: string) => {
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return value;
  }

  return fallback;
};

const extractStatusToken = (status: unknown): string | undefined => {
  if (typeof status === "string" && status.trim().length > 0) {
    return status;
  }

  if (typeof status === "number") {
    return String(status);
  }

  if (!isRecord(status)) {
    return undefined;
  }

  const candidates: unknown[] = [
    status.status,
    status.name,
    status.label,
    status.value,
    status.code,
    status.state,
    status.stage,
    status.currentStatus,
    status.projectStatus,
    status.offerStatus,
  ];

  for (const candidate of candidates) {
    const token = extractStatusToken(candidate);
    if (token) {
      return token;
    }
  }

  return undefined;
};

const normalizeStatus = (status: unknown): Project["status"] => {
  const statusToken = extractStatusToken(status);

  if (!statusToken) {
    return "IN REVIEW";
  }

  const normalized = statusToken.trim().toUpperCase().replace(/[_-]/g, " ");

  const activeStatuses = new Set([
    "ACTIVE",
    "FUNDED",
    "IN PROGRESS",
    "ONGOING",
    "APPROVED",
    "ACCEPTED",
    "RUNNING",
    "STARTED",
    "LIVE",
  ]);

  const completedStatuses = new Set([
    "COMPLETED",
    "COMPLETE",
    "CLOSED",
    "FINISHED",
    "SUCCESS",
    "DONE",
    "ENDED",
  ]);

  const reviewStatuses = new Set([
    "IN REVIEW",
    "REVIEW",
    "PENDING",
    "PENDING APPROVAL",
    "DRAFT",
    "NEW",
    "CREATED",
    "REQUESTED",
  ]);

  const numericStatus = Number(normalized);
  if (Number.isFinite(numericStatus)) {
    if (numericStatus >= 3) {
      return "COMPLETED";
    }

    if (numericStatus === 2) {
      return "ACTIVE";
    }

    return "IN REVIEW";
  }

  if (completedStatuses.has(normalized)) {
    return "COMPLETED";
  }

  if (activeStatuses.has(normalized)) {
    return "ACTIVE";
  }

  if (reviewStatuses.has(normalized)) {
    return "IN REVIEW";
  }

  if (normalized.includes("COMPLETE") || normalized.includes("CLOSE")) {
    return "COMPLETED";
  }

  if (
    normalized.includes("ACTIVE") ||
    normalized.includes("PROGRESS") ||
    normalized.includes("APPROVED") ||
    normalized.includes("ONGOING") ||
    normalized.includes("RUNNING")
  ) {
    return "ACTIVE";
  }

  return "IN REVIEW";
};

const normalizeInvestmentType = (
  offerType: unknown,
): Project["investmentType"] =>
  typeof offerType === "string" && offerType.toLowerCase() === "commission"
    ? "commission"
    : "harvest";

const extractProjectsFromResponse = (response: unknown): ApiRecord[] => {
  if (Array.isArray(response)) {
    const directArray = response.filter(isRecord);
    if (directArray.length > 0 && directArray.some(looksLikeProjectRecord)) {
      return directArray;
    }

    const nestedArray = findProjectArrayDeep(response);
    if (nestedArray.length > 0) {
      return nestedArray;
    }

    return [];
  }

  if (!isRecord(response)) {
    return [];
  }

  const candidates: unknown[] = [
    response.data,
    response.projects,
    response.items,
    isRecord(response.data) ? response.data.data : undefined,
    isRecord(response.data) ? response.data.projects : undefined,
    isRecord(response.data) ? response.data.items : undefined,
    response.result,
    response.payload,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const list = candidate.filter(isRecord);
      if (list.length > 0 && list.some(looksLikeProjectRecord)) {
        return list;
      }
    }
  }

  const nestedArray = findProjectArrayDeep(response);
  if (nestedArray.length > 0) {
    return nestedArray;
  }

  if (
    isRecord(response.data) &&
    isRecord(response.data.data) &&
    looksLikeProjectRecord(response.data.data)
  ) {
    return [response.data.data];
  }

  if (isRecord(response.data) && looksLikeProjectRecord(response.data)) {
    return [response.data];
  }

  if (looksLikeProjectRecord(response)) {
    return [response];
  }

  return [];
};

const resolveFarmerNameFromApi = (project: ApiRecord) => {
  if (typeof project.farmerName === "string" && project.farmerName.trim()) {
    return project.farmerName;
  }

  const farmer = isRecord(project.farmer) ? project.farmer : null;

  if (!farmer) {
    return "Current Farmer";
  }

  if (typeof farmer.fullName === "string" && farmer.fullName.trim()) {
    return farmer.fullName;
  }

  const firstName =
    typeof farmer.firstName === "string" ? farmer.firstName.trim() : "";
  const lastName =
    typeof farmer.lastName === "string" ? farmer.lastName.trim() : "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return fullName || "Current Farmer";
};

const resolveFarmerImageFromApi = (project: ApiRecord) => {
  const farmer = isRecord(project.farmer) ? project.farmer : null;

  if (!farmer) {
    return "";
  }

  if (typeof farmer.profilePicture === "string") {
    return farmer.profilePicture;
  }

  const personalInfo = isRecord(farmer.personalInfo)
    ? farmer.personalInfo
    : null;

  if (!personalInfo) {
    return "";
  }

  if (typeof personalInfo.profilePicture === "string") {
    return personalInfo.profilePicture;
  }

  if (
    isRecord(personalInfo.profilePicture) &&
    typeof personalInfo.profilePicture.url === "string"
  ) {
    return personalInfo.profilePicture.url;
  }

  return "";
};

const resolveBackgroundImageFromApi = (imageValue: unknown) => {
  if (isRecord(imageValue)) {
    if (
      typeof imageValue.url === "string" &&
      imageValue.url.trim().length > 0
    ) {
      return imageValue.url;
    }

    if (typeof imageValue.id === "string" && imageValue.id.trim().length > 0) {
      return resolveCoverImageUrl(imageValue.id);
    }

    return undefined;
  }

  if (typeof imageValue !== "string" || imageValue.trim().length === 0) {
    return undefined;
  }

  if (/^https?:\/\//i.test(imageValue)) {
    return imageValue;
  }

  return resolveCoverImageUrl(imageValue);
};

const mapApiProjectToUiProject = (
  project: ApiRecord,
  index: number,
): Project => {
  const investmentType = normalizeInvestmentType(
    project.offerType ?? project.investmentType,
  );
  const status = normalizeStatus(
    project.status ??
      project.projectStatus ??
      project.offerStatus ??
      project.projectState ??
      project.state ??
      project.lifecycleStatus ??
      project.currentStatus ??
      project.approvalStatus ??
      project.workflowStatus,
  );
  const harvestBasedDetails = isRecord(project.harvestBasedDetails)
    ? project.harvestBasedDetails
    : null;
  const commissionBasedDetails = isRecord(project.commissionBasedDetails)
    ? project.commissionBasedDetails
    : null;
  const cropTypeRaw =
    typeof project.cropType === "string" && project.cropType.trim().length > 0
      ? project.cropType
      : "Unknown Crop";
  const costBreakdown = Array.isArray(project.costBreakdown)
    ? project.costBreakdown.filter(isRecord).map((item) => ({
        category:
          typeof item.category === "string" ? item.category : "Uncategorized",
        description:
          typeof item.description === "string" ? item.description : "",
        amount: toNumber(item.estimatedCost ?? item.amount),
      }))
    : undefined;
  const milestoneBreakdown = Array.isArray(project.milestoneBreakdown)
    ? project.milestoneBreakdown.filter(isRecord).map((item) => ({
        milestone:
          typeof item.milestone === "string"
            ? item.milestone
            : `Milestone ${index + 1}`,
        description:
          typeof item.description === "string" ? item.description : "",
        estimatedAmount: toNumber(item.estimatedAmount ?? item.amount),
      }))
    : undefined;
  const teamMembers = Array.isArray(project.teamMembers)
    ? project.teamMembers.filter(isRecord).map((member, memberIndex) => {
        const roleRaw =
          typeof member.role === "string" ? member.role.toUpperCase() : "";
        const role: ProjectTeamMember["role"] =
          roleRaw === "INVESTOR" ||
          roleRaw === "LANDOWNER" ||
          roleRaw === "FARMER"
            ? (roleRaw as ProjectTeamMember["role"])
            : "FARMER";

        return {
          id:
            typeof member.id === "string"
              ? member.id
              : `${role}-${index}-${memberIndex}`,
          name:
            typeof member.name === "string" && member.name.trim().length > 0
              ? member.name
              : `Member ${memberIndex + 1}`,
          role,
          email: typeof member.email === "string" ? member.email : undefined,
          phone: typeof member.phone === "string" ? member.phone : undefined,
          location:
            typeof member.location === "string" ? member.location : undefined,
          avatar: typeof member.avatar === "string" ? member.avatar : undefined,
          isCurrentUser:
            typeof member.isCurrentUser === "boolean"
              ? member.isCurrentUser
              : undefined,
        };
      })
    : undefined;
  const preferredRegions = Array.isArray(project.preferredRegions)
    ? project.preferredRegions.filter(
        (region): region is string => typeof region === "string",
      )
    : undefined;
  const idValue = project._id ?? project.id ?? `project-${Date.now()}-${index}`;
  const parsedLandSize = toNumber(
    project.landSize ??
      project.expectedLandArea ??
      harvestBasedDetails?.expectedLandArea ??
      commissionBasedDetails?.expectedLandArea,
  );
  const landAvailabilityRaw =
    typeof project.landAvailability === "string"
      ? project.landAvailability.toLowerCase()
      : "";
  const hasLand =
    landAvailabilityRaw === "with_land" ||
    landAvailabilityRaw === "with land" ||
    parsedLandSize > 0;
  const landLocationRaw =
    typeof project.landLocation === "string"
      ? project.landLocation
      : typeof project.location === "string"
        ? project.location
        : "";
  const expectedHarvestValue = toNumber(
    harvestBasedDetails?.expectedHarvest ?? project.expectedHarvest,
  );
  const commissionPercentageValue = toNumber(
    commissionBasedDetails?.commissionPercentage ??
      project.commissionPercentage,
  );
  const coverImageValue =
    typeof project.coverImage === "string"
      ? project.coverImage
      : typeof project.coverImageId === "string"
        ? project.coverImageId
        : typeof project.backgroundImage === "string"
          ? project.backgroundImage
          : undefined;

  return {
    id:
      typeof idValue === "string" || typeof idValue === "number"
        ? idValue
        : `project-${Date.now()}-${index}`,
    name:
      typeof project.projectName === "string" &&
      project.projectName.trim().length > 0
        ? project.projectName
        : typeof project.name === "string" && project.name.trim().length > 0
          ? project.name
          : `Project ${index + 1}`,
    cropType: formatCropLabel(cropTypeRaw),
    cropIcon:
      typeof project.cropIcon === "string" && project.cropIcon.trim().length > 0
        ? project.cropIcon
        : getCropIcon(cropTypeRaw),
    status,
    investmentStatus:
      status === "COMPLETED"
        ? "Completed"
        : status === "IN REVIEW"
          ? "Pending Approval"
          : investmentType === "harvest"
            ? "Funding Requested"
            : "Commission Active",
    fundingPercentage:
      investmentType === "harvest"
        ? toNumber(project.fundingPercentage ?? project.fundingProgress ?? 0)
        : undefined,
    progress: toNumber(
      project.progress,
      status === "COMPLETED" ? 100 : status === "IN REVIEW" ? 10 : 50,
    ),
    landArea: parsedLandSize,
    budget: toNumber(project.totalInvestmentRequired ?? project.budget),
    expectedROI: toNumber(
      project.expectedROI ??
        commissionBasedDetails?.commissionPercentage ??
        project.commissionPercentage,
      investmentType === "commission" ? 20 : 18,
    ),
    startDate:
      getValidDate(
        project.effectiveDateFrom ?? project.startDate,
        new Date().toISOString().slice(0, 10),
      ) ?? new Date().toISOString().slice(0, 10),
    endDate: getValidDate(project.effectiveDateTo ?? project.endDate),
    expiryDate: getValidDate(project.expiryDate ?? project.effectiveDateTo),
    location:
      typeof project.location === "string" && project.location.trim().length > 0
        ? project.location
        : "Not specified",
    backgroundImage: resolveBackgroundImageFromApi(
      project.backgroundImage ?? project.coverImage ?? project.coverImageId,
    ),
    investmentType,
    farmerName: resolveFarmerNameFromApi(project),
    farmerImage: resolveFarmerImageFromApi(project),
    landownerName:
      typeof project.landownerName === "string"
        ? project.landownerName
        : undefined,
    landAvailability: hasLand ? "with_land" : "without_land",
    landSize: parsedLandSize > 0 ? parsedLandSize : undefined,
    landLocation: landLocationRaw || undefined,
    expectedHarvest:
      expectedHarvestValue > 0 ? expectedHarvestValue : undefined,
    commissionPercentage:
      commissionPercentageValue > 0 ? commissionPercentageValue : undefined,
    description:
      typeof project.description === "string" ? project.description : undefined,
    farmingMethods:
      typeof project.farmingMethods === "string"
        ? project.farmingMethods
        : undefined,
    preferredRegions,
    cropTypeValue: cropTypeRaw.toLowerCase(),
    coverImageValue,
    costBreakdown,
    milestoneBreakdown,
    teamMembers,
  };
};

const MyProjectsPage = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hideTeamAndAgreement, setHideTeamAndAgreement] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshProjectsFromApi = useCallback(async () => {
    if (!user?._id) {
      return;
    }

    try {
      const response = await getFarmerAdsByUser(user._id);
      const projects = extractProjectsFromResponse(response).map(
        mapApiProjectToUiProject,
      );
      setProjectList(projects);
    } catch (error) {
      console.error("Failed to load farmer projects", error);
    }
  }, [user?._id]);

  useEffect(() => {
    void refreshProjectsFromApi();
  }, [refreshProjectsFromApi]);

  const hasActiveProject = selectActiveProjects(projectList).length > 0;

  const handleOpenDialog = () => {
    if (hasActiveProject) {
      return;
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenDetails = (
    project: Project,
    options?: { fromCreatedProjects?: boolean },
  ) => {
    setSelectedProject(project);
    setHideTeamAndAgreement(Boolean(options?.fromCreatedProjects));
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedProject(null);
    setHideTeamAndAgreement(false);
  };

  const handleCreateProject = async (_payload: FarmerJobCreationPayload) => {
    await refreshProjectsFromApi();
  };

  const toEditFormData = (project: Project): FarmerProjectFormInitialData => ({
    offerType: project.investmentType,
    projectName: project.name,
    cropType: (project.cropTypeValue || project.cropType || "").toLowerCase(),
    cropIcon: project.cropIcon,
    coverImage: project.coverImageValue || project.backgroundImage || "",
    effectiveDateFrom: project.startDate,
    expiryDate: project.expiryDate || project.endDate || "",
    location: project.location,
    landAvailability: project.landAvailability || "without_land",
    landSize: project.landSize || project.landArea || undefined,
    landLocation: project.landLocation || project.location,
    farmingMethods: project.farmingMethods || "",
    agreementType: "",
    description: project.description || "",
    selectedRegions: project.preferredRegions || [],
    expectedHarvest: project.expectedHarvest,
    commissionPercentage: project.commissionPercentage,
    costBreakdown: (project.costBreakdown || []).map((item) => ({
      category: item.category,
      description: item.description || "",
      estimatedCost: item.amount,
    })),
    milestoneBreakdown: (project.milestoneBreakdown || []).map((item) => ({
      milestone: item.milestone,
      description: item.description || "",
      estimatedAmount: item.estimatedAmount,
    })),
  });

  const handleOpenEdit = (project: Project) => {
    setProjectToEdit(project);
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setProjectToEdit(null);
  };

  const handleOpenDelete = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    if (isDeleting) {
      return;
    }

    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      if (typeof projectToDelete.id === "number") {
        setProjectList((previousProjects) =>
          previousProjects.filter(
            (project) => project.id !== projectToDelete.id,
          ),
        );
      } else {
        await deleteFarmerAd(projectToDelete.id.toString());
        await refreshProjectsFromApi();
      }
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Failed to delete farmer project", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeProjects = useMemo(
    () => selectActiveProjects(projectList),
    [projectList],
  );

  const inferredActiveProjectId =
    activeProjects.length > 0 && activeProjects[0].status === "IN REVIEW"
      ? activeProjects[0].id.toString()
      : null;

  const activeOfferCards = useMemo(
    () =>
      activeProjects.slice(0, 1).map((project) => ({
        id: project.id.toString(),
        projectName: project.name,
        cropType: project.cropType,
        cropIcon: project.cropIcon,
        farmerName: project.farmerName,
        farmerImage: project.farmerImage,
        location: project.location,
        budget: project.budget > 0 ? project.budget : undefined,
        expectedROI: project.expectedROI,
        status: "active" as const,
        progress: project.progress,
        startDate: project.startDate,
        endDate: project.endDate || project.expiryDate,
        backgroundImage: project.backgroundImage,
        landownerName: project.landownerName,
        investmentType: project.investmentType,
        commissionRate: project.commissionPercentage,
      })),
    [activeProjects],
  );

  const createdProjects = useMemo(
    () =>
      projectList.filter(
        (project) =>
          project.status === "IN REVIEW" &&
          project.id.toString() !== inferredActiveProjectId,
      ),
    [projectList, inferredActiveProjectId],
  );

  const pastProjects = useMemo(
    () => projectList.filter((project) => project.status === "COMPLETED"),
    [projectList],
  );

  const renderProjectCard = (project: Project) => (
    <div key={project.id} className="col-12 col-md-6 col-lg-4">
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow:
              "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(107, 142, 35, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: 160,
            background: "linear-gradient(135deg, #1a2e1a 0%, #2a3a2a 100%)",
            overflow: "hidden",
          }}
        >
          {project.backgroundImage && (
            <CardMedia
              component="img"
              image={project.backgroundImage}
              alt={project.cropType}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.6,
                transition: "all 0.4s ease",
              }}
            />
          )}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label={project.status}
                color={getStatusColor(project.status) as any}
                size="small"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  backdropFilter: "blur(10px)",
                  textTransform: "uppercase",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                {project.cropIcon}
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#ffffff",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                    fontSize: "1.1rem",
                  }}
                >
                  {project.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {project.cropType}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          <div className="row g-2">
            <div className="col-6">
              <Box
                sx={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: 1.5,
                  p: 1.5,
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#808080",
                    textTransform: "uppercase",
                  }}
                >
                  Budget
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#6B8E23",
                    fontSize: "1rem",
                  }}
                >
                  {formatCurrency(project.budget)}
                </Typography>
              </Box>
            </div>
            <div className="col-6">
              <Box
                sx={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: 1.5,
                  p: 1.5,
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#808080",
                    textTransform: "uppercase",
                  }}
                >
                  Expected ROI
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#4caf50",
                    fontSize: "1rem",
                  }}
                >
                  {project.expectedROI}%
                </Typography>
              </Box>
            </div>
          </div>

          {project.status === "ACTIVE" && (
            <Box sx={{ mt: "auto" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Project Progress
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "primary.main" }}
                >
                  {project.progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={project.progress}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    background:
                      "linear-gradient(90deg, #6B8E23 0%, #8FA887 100%)",
                  },
                }}
              />
            </Box>
          )}

          <Box
            sx={{
              pt: 2,
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: project.landownerName ? 1.5 : 0,
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={project.farmerImage}
                  alt={project.farmerName}
                  sx={{
                    width: 40,
                    height: 40,
                    border: "2px solid",
                    borderColor: "#76c043",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 18,
                    height: 18,
                    bgcolor: "#76c043",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #1f1f1f",
                  }}
                >
                  <Agriculture sx={{ fontSize: 12, color: "white" }} />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                >
                  {project.farmerName}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "#76c043", fontSize: "0.7rem" }}
                  >
                    Farmer
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    •
                  </Typography>
                  <LocationOn sx={{ fontSize: 12, color: "#808080" }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {project.location}
                  </Typography>
                </Box>
              </Box>
              {!project.landownerName && (
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDetails(project)}
                    sx={{
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "rgba(107, 142, 35, 0.1)",
                      },
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {project.landownerName && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid",
                      borderColor: "#ff9800",
                      bgcolor: "rgba(255, 152, 0, 0.2)",
                    }}
                  >
                    <Landscape sx={{ fontSize: 20, color: "#ff9800" }} />
                  </Avatar>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -2,
                      right: -2,
                      width: 18,
                      height: 18,
                      bgcolor: "#ff9800",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #1f1f1f",
                    }}
                  >
                    <Landscape sx={{ fontSize: 10, color: "white" }} />
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                  >
                    {project.landownerName}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "#ff9800", fontSize: "0.7rem" }}
                    >
                      Landowner
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      •
                    </Typography>
                    <LocationOn sx={{ fontSize: 12, color: "#808080" }} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.7rem" }}
                    >
                      {project.location}
                    </Typography>
                  </Box>
                </Box>
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDetails(project)}
                    sx={{
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "rgba(107, 142, 35, 0.1)",
                      },
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </CardContent>

        <Box
          className="row g-0"
          sx={{
            p: 1.5,
            background: "rgba(0, 0, 0, 0.2)",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="col-6 text-center">
            <Typography
              variant="caption"
              sx={{
                color: "#808080",
                textTransform: "uppercase",
                fontSize: "0.65rem",
              }}
            >
              Started
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#b0b0b0", fontSize: "0.75rem" }}
            >
              {formatDate(project.startDate)}
            </Typography>
          </div>
          {project.endDate && (
            <div className="col-6 text-center">
              <Typography
                variant="caption"
                sx={{
                  color: "#808080",
                  textTransform: "uppercase",
                  fontSize: "0.65rem",
                }}
              >
                {project.status === "COMPLETED" ? "Completed" : "Expected End"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#b0b0b0", fontSize: "0.75rem" }}
              >
                {formatDate(project.endDate)}
              </Typography>
            </div>
          )}
        </Box>
      </Card>
    </div>
  );

  const renderCreatedProjectCard = (project: Project) => {
    const isHarvestOffer = project.investmentType === "harvest";
    const landArea = project.landSize ?? project.landArea;
    const expiryDateLabel = project.expiryDate
      ? formatDate(project.expiryDate)
      : project.endDate
        ? formatDate(project.endDate)
        : "Not specified";
    const preferredRegionLabel =
      project.preferredRegions && project.preferredRegions.length > 0
        ? project.preferredRegions.length > 1
          ? `${project.preferredRegions[0]} +${project.preferredRegions.length - 1}`
          : project.preferredRegions[0]
        : project.location || "Not specified";

    return (
      <div key={project.id} className="col-12 col-md-6 col-lg-4">
        <Card
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            transition: "transform 0.2s, box-shadow 0.2s",
            background: "linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: 160,
              background: project.backgroundImage
                ? `url(${project.backgroundImage}) center/cover`
                : "linear-gradient(135deg, #1a2e1a 0%, #2a3a2a 100%)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.78) 100%)",
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={isHarvestOffer ? "Harvest Offer" : "Commission Offer"}
                  size="small"
                  sx={{
                    background: isHarvestOffer
                      ? "rgba(76,175,80,0.85)"
                      : "rgba(33,150,243,0.85)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.68rem",
                    letterSpacing: 0.3,
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Chip
                  label="Pending Approval"
                  size="small"
                  sx={{
                    background: "rgba(245,158,11,0.85)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.68rem",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    background: "rgba(255,255,255,0.14)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  {project.cropIcon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      fontSize: "1.05rem",
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {project.cropType}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <CardContent sx={{ p: 2 }}>
            <div className="row g-2">
              {isHarvestOffer ? (
                <>
                  <div className="col-6">
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 1.5,
                        p: 1.3,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Total Budget
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B8E23", fontWeight: 700 }}
                      >
                        {formatCurrency(project.budget)}
                      </Typography>
                    </Box>
                  </div>
                  <div className="col-6">
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 1.5,
                        p: 1.3,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Expected Harvest
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#4caf50", fontWeight: 700 }}
                      >
                        {project.expectedHarvest
                          ? `${project.expectedHarvest.toLocaleString()} kg`
                          : "Not specified"}
                      </Typography>
                    </Box>
                  </div>
                  <div className="col-6">
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 1.5,
                        p: 1.3,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Land Area
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#ffffff", fontWeight: 700 }}
                      >
                        {landArea > 0 ? `${landArea} acres` : "Not specified"}
                      </Typography>
                    </Box>
                  </div>
                  <div className="col-6">
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 1.5,
                        p: 1.3,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Expiry Date
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#f59e0b", fontWeight: 700 }}
                      >
                        {expiryDateLabel}
                      </Typography>
                    </Box>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-6">
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 1.5,
                        p: 1.3,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Commission Rate
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#2196f3", fontWeight: 700 }}
                      >
                        {project.commissionPercentage ?? project.expectedROI}%
                      </Typography>
                    </Box>
                  </div>
                  <div className="col-6">
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 1.5,
                        p: 1.3,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Preferred Regions
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B8E23", fontWeight: 700 }}
                      >
                        {preferredRegionLabel}
                      </Typography>
                    </Box>
                  </div>
                  <div className="col-6">
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 1.5,
                        p: 1.3,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Land Availability
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#ffffff", fontWeight: 700 }}
                      >
                        {project.landAvailability === "with_land"
                          ? "With Land"
                          : "Without Land"}
                      </Typography>
                    </Box>
                  </div>
                  <div className="col-6">
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: 1.5,
                        p: 1.3,
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#808080", textTransform: "uppercase" }}
                      >
                        Expiry Date
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#f59e0b", fontWeight: 700 }}
                      >
                        {expiryDateLabel}
                      </Typography>
                    </Box>
                  </div>
                </>
              )}
            </div>

            <Box
              sx={{
                mt: 1.8,
                pt: 1.2,
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <LocationOn sx={{ fontSize: 15, color: "#808080" }} />
              <Typography
                variant="caption"
                sx={{
                  color: "#9ca3af",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {project.location}
              </Typography>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() =>
                    handleOpenDetails(project, { fromCreatedProjects: true })
                  }
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "rgba(107, 142, 35, 0.1)",
                    },
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Project">
                <IconButton
                  size="small"
                  onClick={() => handleOpenEdit(project)}
                  sx={{
                    color: "#22c55e",
                    "&:hover": {
                      backgroundColor: "rgba(34, 197, 94, 0.12)",
                    },
                  }}
                >
                  <Edit sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Project">
                <IconButton
                  size="small"
                  onClick={() => handleOpenDelete(project)}
                  sx={{
                    color: "#ef4444",
                    "&:hover": {
                      backgroundColor: "rgba(239, 68, 68, 0.12)",
                    },
                  }}
                >
                  <Delete sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: "#0a0f0a" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ color: "#fff", fontWeight: 600, mb: 0.5 }}
          >
            My Projects
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
            Create Farming Opportunity and view the status of your current
            farming plans.
          </Typography>
          {hasActiveProject && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.8,
                color: "#fbbf24",
                fontWeight: 600,
              }}
            >
              Only one active project is allowed. Complete the current active
              project before creating a new one.
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={hasActiveProject}
          sx={{
            borderColor: "rgba(255,255,255,0.3)",
            color: "#fff",
            textTransform: "none",
            px: 2.5,
            py: 1,
            fontSize: "0.875rem",
            "&:hover": {
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
            },
            "&.Mui-disabled": {
              borderColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.35)",
            },
          }}
        >
          Create New Project
        </Button>
      </Box>

      {/* Active Projects Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&::before": {
              content: '""',
              width: 4,
              height: 24,
              background: "linear-gradient(180deg, #6B8E23 0%, #8FA887 100%)",
              borderRadius: 1,
            },
          }}
        >
          Active Projects
        </Typography>

        {activeOfferCards.length > 0 ? (
          <div className="row g-4">
            {activeOfferCards.map((project) => {
              const activeProjectSource = activeProjects.find(
                (item) => item.id.toString() === project.id,
              );

              return (
                <div key={project.id} className="col-12 col-md-6 col-lg-4">
                  <OfferCard
                    {...project}
                    onViewDetails={() => {
                      if (activeProjectSource) {
                        handleOpenDetails(activeProjectSource);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              borderRadius: 2,
              border: "2px dashed",
              borderColor: "rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <BarChart
              sx={{ fontSize: 40, opacity: 0.45, mb: 1, color: "#fff" }}
            />
            <Typography variant="h6" sx={{ mb: 1, color: "#fff" }}>
              No Active Projects
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Active farmer projects will appear here.
            </Typography>
          </Box>
        )}
      </Box>

      <hr
        style={{
          margin: "3rem 0",
          border: "none",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />

      <section className="mb-5">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&::before": {
              content: '""',
              width: 4,
              height: 24,
              background: "linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)",
              borderRadius: 1,
            },
          }}
        >
          My Created Projects
        </Typography>

        {createdProjects.length > 0 ? (
          <div className="row g-4">
            {createdProjects.map(renderCreatedProjectCard)}
          </div>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              borderRadius: 2,
              border: "2px dashed",
              borderColor: "rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <HourglassEmpty
              sx={{ fontSize: 40, opacity: 0.45, mb: 1, color: "#fff" }}
            />
            <Typography variant="h6" sx={{ mb: 1, color: "#fff" }}>
              No Created Projects
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Newly created farmer offers waiting for approval will appear here.
            </Typography>
          </Box>
        )}
      </section>

      <hr
        style={{
          margin: "3rem 0",
          border: "none",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />

      <section>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&::before": {
              content: '""',
              width: 4,
              height: 24,
              background: "linear-gradient(180deg, #6B8E23 0%, #8FA887 100%)",
              borderRadius: 1,
            },
          }}
        >
          Past Projects
        </Typography>

        {pastProjects.length > 0 ? (
          <div className="row g-4">{pastProjects.map(renderProjectCard)}</div>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              borderRadius: 2,
              border: "2px dashed",
              borderColor: "rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <Folder
              sx={{ fontSize: 40, opacity: 0.45, mb: 1, color: "#fff" }}
            />
            <Typography variant="h6" sx={{ mb: 1, color: "#fff" }}>
              No Past Projects
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Completed farmer projects will appear here.
            </Typography>
          </Box>
        )}
      </section>

      {/* Create Offer Dialog */}
      <CreateOfferDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleCreateProject}
      />

      <CreateOfferDialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        onSubmit={handleCreateProject}
        mode="edit"
        projectId={projectToEdit ? projectToEdit.id.toString() : undefined}
        initialData={projectToEdit ? toEditFormData(projectToEdit) : null}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "#111a11",
            border: "1px solid rgba(255,255,255,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            color: "#fff",
          }}
        >
          <WarningAmber sx={{ color: "#f59e0b", fontSize: 26 }} />
          Delete Project
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)" }}>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </Typography>
          {projectToDelete && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.32)",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#fff", fontWeight: 700 }}
              >
                {projectToDelete.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#fca5a5",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {projectToDelete.investmentType} offer
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseDelete}
            disabled={isDeleting}
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: 2,
              color: "#fff",
              borderColor: "rgba(255,255,255,0.28)",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            variant="contained"
            sx={{
              flex: 1,
              borderRadius: 2,
              fontWeight: 700,
              bgcolor: "#dc2626",
              "&:hover": { bgcolor: "#b91c1c" },
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project Details Dialog */}
      <ProjectDetailsDialog
        open={detailsDialogOpen}
        onClose={handleCloseDetails}
        hideTeamAndAgreement={hideTeamAndAgreement}
        project={
          selectedProject
            ? {
                id: selectedProject.id,
                name: selectedProject.name,
                projectId: `PRJ-${selectedProject.id.toString()}`,
                status: selectedProject.status,
                startDate: formatDate(selectedProject.startDate),
                endDate: selectedProject.endDate
                  ? formatDate(selectedProject.endDate)
                  : undefined,
                expiryDate: selectedProject.expiryDate
                  ? formatDate(selectedProject.expiryDate)
                  : selectedProject.endDate
                    ? formatDate(selectedProject.endDate)
                    : undefined,
                progress: selectedProject.progress,
                budget: selectedProject.budget,
                expectedROI: selectedProject.expectedROI,
                investmentType:
                  selectedProject.investmentType === "harvest"
                    ? "Harvest-Based"
                    : "Commission-Based",
                location: selectedProject.location,
                farmerName: selectedProject.farmerName,
                landownerName: selectedProject.landownerName,
                landAvailability: selectedProject.landAvailability,
                landSize: selectedProject.landSize,
                landLocation: selectedProject.landLocation,
                expectedHarvest: selectedProject.expectedHarvest,
                commissionPercentage: selectedProject.commissionPercentage,
                description: selectedProject.description,
                farmingMethods: selectedProject.farmingMethods,
                preferredRegions: selectedProject.preferredRegions,
                costBreakdown: selectedProject.costBreakdown,
                milestoneBreakdown: selectedProject.milestoneBreakdown,
                teamMembers: selectedProject.teamMembers,
              }
            : null
        }
      />
    </Box>
  );
};

export default MyProjectsPage;
