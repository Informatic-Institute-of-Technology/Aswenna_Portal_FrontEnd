import type { FarmerProjectApiItem } from "@/services/farmerProject.service";
import type {
  ActiveProjectsStats,
  ProjectCategory,
  ProjectStakeholder,
  UnifiedProject,
} from "@/types/admin.types";
import type {
  DirectHarvestOfferAPI,
  SponsorshipOfferAPI,
} from "@/types/investor.types";

export function normalizeFarmerProject(
  project: FarmerProjectApiItem,
): UnifiedProject {
  const isCommission = project.offerType === "commission";
  const category: ProjectCategory = isCommission
    ? "farmer-commission"
    : "farmer-harvest";
  const farmerId =
    typeof project.farmer === "string"
      ? project.farmer
      : project.farmer?._id || "unknown";
  const farmerName =
    typeof project.farmer === "object"
      ? project.farmer?.fullName || "Unknown Farmer"
      : "Unknown Farmer";

  const financialMetric = isCommission
    ? {
        label: "Commission Rate",
        value: project.commissionBasedDetails?.commissionPercentage || 0,
        unit: "%",
      }
    : {
        label: "Investment Required",
        value: project.totalInvestmentRequired || 0,
        unit: "LKR",
      };

  const result: UnifiedProject = {
    id: project._id,
    sourceApi: "farmer-project",
    sourceId: project._id,
    category,
    stakeholder: "farmer",
    title: project.projectName,
    description: project.description,
    cropType: project.cropType,
    cropIcon: project.cropIcon,
    backgroundImage: project.backgroundImage,
    creator: {
      id: farmerId,
      name: farmerName,
      email:
        typeof project.farmer === "object" ? project.farmer?.email : undefined,
    },
    financialMetric,
    totalInvestment: project.totalInvestmentRequired,
    budget: project.totalInvestmentRequired,
    currency: "LKR",
    startDate: project.effectiveDateFrom,
    endDate: project.effectiveDateTo,
    duration: calculateDurationInMonths(
      project.effectiveDateFrom,
      project.effectiveDateTo,
    ),
    location: project.location,
    preferredRegions: project.preferredRegions,
    status: normalizeStatus(project.status),
    visibility: project.visibility,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    landArea:
      (isCommission
        ? project.commissionBasedDetails?.expectedLandArea
        : project.harvestBasedDetails?.expectedLandArea) || 0,
    landAreaUnit: "acres",
    expectedYield: project.harvestBasedDetails?.expectedHarvest?.toString(),
  };

  return result;
}

export function normalizeDirectHarvestOffer(
  offer: DirectHarvestOfferAPI,
): UnifiedProject {
  return {
    id: offer._id,
    sourceApi: "investor-offer",
    sourceId: offer._id,
    category: "investor-harvest",
    stakeholder: "investor",
    title: offer.harvestBaseDetails.projectTitle,
    description: offer.description,
    cropType: offer.harvestBaseDetails.cropType,
    cropIcon: offer.cropIcon,
    backgroundImage: offer.backgroundImage,
    creator: {
      id: offer.investor._id,
      name: offer.investor.fullName,
      email: offer.investor.email,
    },
    financialMetric: {
      label: "Total Budget",
      value: offer.harvestBaseDetails.totalBudget,
      unit: "LKR",
    },
    totalInvestment: offer.harvestBaseDetails.totalBudget,
    budget: offer.harvestBaseDetails.totalBudget,
    currency: offer.currency,
    startDate: new Date().toISOString(),
    deadline: offer.expiredDate,
    location: offer.harvestBaseDetails.deliveryLocation,
    preferredRegions: offer.harvestBaseDetails.preferredRegion || [],
    status: normalizeStatus(offer.status),
    createdAt: offer.createdAt,
    updatedAt: offer.updatedAt,
    expectedROI: offer.expectedROI,
    applicationCount: offer.applicationsCount,
  };
}


export function normalizeSponsorshipOffer(
  offer: SponsorshipOfferAPI,
): UnifiedProject {
  return {
    id: offer._id,
    sourceApi: "investor-offer",
    sourceId: offer._id,
    category: "investor-sponsorship",
    stakeholder: "investor",
    title: offer.commissionDetails.sponsorshipTitle,
    description: offer.description,
    cropType: offer.commissionDetails.cropTypes?.[0],
    cropIcon: offer.cropIcon,
    backgroundImage: offer.backgroundImage,
    creator: {
      id: offer.investor._id,
      name: offer.investor.fullName,
      email: offer.investor.email,
    },
    financialMetric: {
      label: "Commission Rate",
      value: offer.commissionDetails.commissionRate,
      unit: "%",
    },
    totalInvestment: offer.commissionDetails.maximumInvestment,
    budget: offer.commissionDetails.maximumInvestment,
    currency: offer.currency,
    startDate: new Date().toISOString(),
    deadline: offer.expiredDate,
    location: "Multiple Regions",
    preferredRegions: offer.commissionDetails.preferredRegions || [],
    status: normalizeStatus(offer.status),
    createdAt: offer.createdAt,
    updatedAt: offer.updatedAt,
    expectedROI: offer.expectedROI,
    applicationCount: offer.applicationsCount,
  };
}

function normalizeStatus(
  status: string,
): "active" | "pending" | "completed" | "cancelled" | "draft" {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "open") {
    return "active";
  }
  if (normalizedStatus === "completed" || normalizedStatus === "finished") {
    return "completed";
  }
  if (normalizedStatus === "cancelled" || normalizedStatus === "closed") {
    return "cancelled";
  }
  if (normalizedStatus === "pending" || normalizedStatus === "draft") {
    return "pending";
  }

  return "active";
}

function calculateDurationInMonths(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return Math.max(1, months);
}

export function filterProjectsByStatus(
  projects: UnifiedProject[],
  status: "active" | "all",
): UnifiedProject[] {
  if (status === "all") return projects;
  return projects.filter((p) => p.status === status);
}


export function filterProjectsByStakeholder(
  projects: UnifiedProject[],
  stakeholder: ProjectStakeholder,
): UnifiedProject[] {
  return projects.filter((p) => p.stakeholder === stakeholder);
}

export function filterProjectsByCategory(
  projects: UnifiedProject[],
  category: ProjectCategory,
): UnifiedProject[] {
  return projects.filter((p) => p.category === category);
}


export function groupProjectsByCategory(
  projects: UnifiedProject[],
): Record<ProjectCategory, UnifiedProject[]> {
  const grouped: Record<ProjectCategory, UnifiedProject[]> = {
    "farmer-harvest": [],
    "farmer-commission": [],
    "investor-harvest": [],
    "investor-sponsorship": [],
    "landowner-rental": [],
  };

  projects.forEach((project) => {
    grouped[project.category].push(project);
  });

  return grouped;
}

export function getActiveProjectsStats(
  projects: UnifiedProject[],
): ActiveProjectsStats {
  const grouped = groupProjectsByCategory(
    filterProjectsByStatus(projects, "active"),
  );

  return {
    totalActive: projects.filter((p) => p.status === "active").length,
    byStakeholder: {
      farmerHarvest: grouped["farmer-harvest"].length,
      farmerCommission: grouped["farmer-commission"].length,
      investorHarvest: grouped["investor-harvest"].length,
      investorSponsorship: grouped["investor-sponsorship"].length,
      landownerRental: grouped["landowner-rental"].length,
    },
  };
}

export function sortProjects(
  projects: UnifiedProject[],
  sortBy: "createdAt" | "status" | "budget" | "deadline" = "createdAt",
  order: "asc" | "desc" = "desc",
): UnifiedProject[] {
  const sorted = [...projects].sort((a, b) => {
    let aVal: string | number | Date;
    let bVal: string | number | Date;

    switch (sortBy) {
      case "budget":
        aVal = a.totalInvestment ?? 0;
        bVal = b.totalInvestment ?? 0;
        break;
      case "deadline":
        aVal = a.deadline ? new Date(a.deadline).getTime() : 0;
        bVal = b.deadline ? new Date(b.deadline).getTime() : 0;
        break;
      case "status":
        aVal = a.status;
        bVal = b.status;
        break;
      case "createdAt":
      default:
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
    }

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}


export function searchProjects(
  projects: UnifiedProject[],
  query: string,
): UnifiedProject[] {
  const lowerQuery = query.toLowerCase();

  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(lowerQuery) ||
      project.description?.toLowerCase().includes(lowerQuery) ||
      project.location.toLowerCase().includes(lowerQuery) ||
      project.creator.name.toLowerCase().includes(lowerQuery),
  );
}

export function paginateProjects(
  projects: UnifiedProject[],
  page: number = 1,
  limit: number = 20,
) {
  const startIdx = (page - 1) * limit;
  const endIdx = startIdx + limit;
  const data = projects.slice(startIdx, endIdx);
  const total = projects.length;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: endIdx < total,
      hasPrevPage: page > 1,
    },
  };
}
