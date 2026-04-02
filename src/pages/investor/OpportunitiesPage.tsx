import type { FarmerJob, InvestmentRequest } from "@/types/farmer.types";
import type { DirectHarvestOfferAPI } from "@/types/investor.types";
import {
  AccountBalanceWallet,
  Handshake,
  Landscape,
} from "@mui/icons-material";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  SectionHeader,
  TabNavigation,
  type TabItem,
} from "../../components/common";
import FarmerJobCard from "../../components/farmer/FarmerJobCard";
import HireFarmerDialog from "../../components/investor/HireFarmerDialog";
import InvestmentRequestCard from "../../components/investor/InvestmentRequestCard";
import InvestmentRequestDialog from "../../components/investor/InvestmentRequestDialog";
import LandAdCard from "../../components/investor/LandAdCard";
import LandAdDetailDialog from "../../components/investor/LandAdDetailDialog";
import { farmerJobsData } from "../../data/json";
import coverImages from "../../data/json/coverImages.json";
import {
  getFarmerProjects,
  type FarmerProjectApiItem,
} from "../../services/farmerProject.service";
import {
  getLandownerAds,
  type LandownerAdApiItem,
} from "../../services/landownerAds.service";
import { getInvestorOffers } from "../../services/offer.service";
import Notification from "../../shared/components/Notification";
import { FarmerJobType } from "../../types/farmer.types";

type CoverImageItem = {
  id: string;
  label: string;
  url: string;
};

const coverImageList = coverImages as CoverImageItem[];
const coverImageById = new Map(
  coverImageList.map((image) => [image.id, image.url]),
);

const isHttpUrl = (value?: string): boolean =>
  Boolean(value && /^https?:\/\//i.test(value));

const resolveProjectCoverImage = (
  backgroundImage?: string,
): string | undefined => {
  if (!backgroundImage) {
    return undefined;
  }

  if (isHttpUrl(backgroundImage)) {
    return backgroundImage;
  }

  return coverImageById.get(backgroundImage);
};

const extractFarmerName = (project: FarmerProjectApiItem): string => {
  if (project.farmer && typeof project.farmer === "object") {
    if (project.farmer.fullName?.trim()) {
      return project.farmer.fullName.trim();
    }

    if (project.farmer.email?.includes("@")) {
      return project.farmer.email.split("@")[0];
    }
  }

  return "Unknown Farmer";
};

const extractFarmerId = (project: FarmerProjectApiItem): string => {
  if (project.farmer && typeof project.farmer === "object") {
    return project.farmer._id ?? "";
  }

  return typeof project.farmer === "string" ? project.farmer : "";
};

const normalizeStatus = (status: string): InvestmentRequest["status"] => {
  switch (status.toUpperCase()) {
    case "DRAFT":
    case "OPEN":
    case "ACTIVE":
    case "PUBLISHED":
      return "open";
    case "FUNDED":
      return "funded";
    case "IN_PROGRESS":
      return "in-progress";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
    default:
      return "cancelled";
  }
};

const normalizeFarmingMethod = (
  farmingMethods: string,
): InvestmentRequest["farmingMethod"] => {
  const normalized = farmingMethods.toLowerCase();

  if (normalized.includes("organic")) {
    return "organic";
  }

  if (normalized.includes("conventional")) {
    return "conventional";
  }

  return "mixed";
};

const calculateExpectedDuration = (from: string, to: string): number => {
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return 1;
  }

  const monthMs = 1000 * 60 * 60 * 24 * 30;
  return Math.max(1, Math.ceil((end - start) / monthMs));
};

const buildInstallmentSchedule = (
  project: FarmerProjectApiItem,
): InvestmentRequest["installmentSchedule"] => {
  const milestones = project.milestoneBreakdown ?? [];

  if (milestones.length === 0) {
    return [];
  }

  const start = new Date(project.effectiveDateFrom).getTime();
  const end = new Date(project.effectiveDateTo).getTime();
  const range =
    Number.isNaN(start) || Number.isNaN(end) || end <= start ? 0 : end - start;

  return milestones.map((milestone, index) => {
    const dueDate =
      range > 0
        ? new Date(
            start + (range * (index + 1)) / milestones.length,
          ).toISOString()
        : project.effectiveDateFrom;

    return {
      id: `${project._id}-milestone-${index + 1}`,
      installmentNumber: index + 1,
      amount: milestone.estimatedAmount ?? 0,
      dueDate,
      milestone: milestone.milestone,
      status: "pending",
    };
  });
};

const mapFarmerProjectToInvestmentRequest = (
  project: FarmerProjectApiItem,
): InvestmentRequest => {
  const expectedHarvest = project.harvestBasedDetails?.expectedHarvest;
  const commissionDetails = (project as any).commissionBasedDetails;

  return {
    id: project._id,
    farmerId: extractFarmerId(project),
    farmerName: extractFarmerName(project),
    farmerImage: undefined,
    coverImageUrl: resolveProjectCoverImage(project.backgroundImage),
    farmerExperience: 0,
    farmerRating: undefined,
    offerType: project.offerType as "harvest" | "commission",
    projectTitle: project.projectName,
    description: project.description,
    cropType: project.cropType,
    cropIcon: project.cropIcon,
    cropVariety: undefined,
    landSize: project.harvestBasedDetails?.expectedLandArea ?? 0,
    landSizeUnit: "acres",
    location: project.location,
    preferredRegions: project.preferredRegions,
    district: project.preferredRegions?.[0] || project.location,
    province: project.location,
    costBreakdown: (project.costBreakdown ?? []).map((item) => ({
      category: item.category,
      description: item.description,
      estimatedCost: item.estimatedCost,
    })),
    milestoneBreakdown: (project.milestoneBreakdown ?? []).map((item) => ({
      milestone: item.milestone,
      description: item.description,
      estimatedAmount: item.estimatedAmount,
    })),
    totalInvestmentRequired: project.totalInvestmentRequired,
    fundingDeadline: project.effectiveDateFrom,
    installmentSchedule: buildInstallmentSchedule(project),
    expectedDuration: calculateExpectedDuration(
      project.effectiveDateFrom,
      project.effectiveDateTo,
    ),
    expectedYield:
      typeof expectedHarvest === "number"
        ? `${expectedHarvest.toLocaleString()} KG`
        : "TBD",
    expectedROI: 0,
    commissionPercentage: commissionDetails?.commissionPercentage,
    investmentAmount: commissionDetails?.investmentAmount,
    numberOfInstallments: commissionDetails?.noOfInstallments,
    expectedLandArea: commissionDetails?.expectedLandArea,
    status: normalizeStatus(project.status),
    farmingMethod: normalizeFarmingMethod(project.farmingMethods),
    certifications: [],
    previousExperience: "",
    collateral: "",
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

const OpportunitiesPage = () => {
  const [activeTab, setActiveTab] = useState<
    "investments" | "hire" | "land-search"
  >("investments");
  const [selectedRequest, setSelectedRequest] =
    useState<InvestmentRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [hireDialogOpen, setHireDialogOpen] = useState(false);
  const [selectedFarmerForHire, setSelectedFarmerForHire] =
    useState<FarmerJob | null>(null);
  const [liveOffers, setLiveOffers] = useState<any[]>([]);
  const [investmentRequests, setInvestmentRequests] = useState<
    InvestmentRequest[]
  >([]);
  const [investmentRequestsLoading, setInvestmentRequestsLoading] =
    useState(false);
  const [investmentRequestsError, setInvestmentRequestsError] = useState<
    string | null
  >(null);

  const [landAds, setLandAds] = useState<LandownerAdApiItem[]>([]);
  const [landAdsLoading, setLandAdsLoading] = useState(false);
  const [landAdsError, setLandAdsError] = useState<string | null>(null);
  const [selectedLandAd, setSelectedLandAd] =
    useState<LandownerAdApiItem | null>(null);
  const [landDetailOpen, setLandDetailOpen] = useState(false);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  useEffect(() => {
    getInvestorOffers()
      .then((res) => {
        if (res.data) {
          const mappedOffers = res.data
            .filter(
              (offer) =>
                offer.offerType === "direct-harvest" &&
                offer.status !== "completed" &&
                offer.status !== "cancelled",
            )
            .map((offer) => {
              const details = (offer as any).harvestBaseDetails;
              return {
                id: offer._id,
                projectTitle: details?.projectTitle || "Untitled Harvest",
                cropType: details?.cropType || "Crop",
                cropIcon: "🌾",
                requiredQuantity: details?.requiredQuantity || 0,
                quantityUnit: details?.quantityUnit || "kg",
                totalBudget: details?.totalBudget || 0,
              };
            });
          setLiveOffers(mappedOffers);
        }
      })
      .catch((err) => console.error("Failed to load offers", err));
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadFarmerProjects = async () => {
      try {
        setInvestmentRequestsLoading(true);
        setInvestmentRequestsError(null);

        const response = await getFarmerProjects();
        const filteredProjects = (response.data ?? []).filter(
          (project) =>
            project.offerType === "harvest" && project.visibility !== false,
        );

        const requests = filteredProjects
          .map(mapFarmerProjectToInvestmentRequest)
          .filter(
            (request) =>
              request.status === "open" || request.status === "draft",
          );

        if (mounted) {
          setInvestmentRequests(requests);
        }
      } catch (error) {
        if (mounted) {
          setInvestmentRequestsError(
            "Failed to load farmer projects. Please try again.",
          );
          setInvestmentRequests([]);
        }
      } finally {
        if (mounted) {
          setInvestmentRequestsLoading(false);
        }
      }
    };

    loadFarmerProjects();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadLandAds = async () => {
      try {
        setLandAdsLoading(true);
        setLandAdsError(null);
        const response = await getLandownerAds();
        if (mounted) {
          setLandAds(
            (response.data ?? []).filter((ad) => ad.status === "ACTIVE"),
          );
        }
      } catch {
        if (mounted)
          setLandAdsError("Failed to load land listings. Please try again.");
      } finally {
        if (mounted) setLandAdsLoading(false);
      }
    };
    loadLandAds();
    return () => {
      mounted = false;
    };
  }, []);

  const allFarmerJobs = farmerJobsData as FarmerJob[];
  const farmerJobs = allFarmerJobs.filter(
    (job) => job.jobType === FarmerJobType.COMMISSION && job.status === "OPEN",
  );

  const handleViewDetails = (request: InvestmentRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleInvest = (id: string) => {
    console.log("Invest in request:", id);
  };

  const handleOpenHireDialog = (farmer: FarmerJob) => {
    setSelectedFarmerForHire(farmer);
    setHireDialogOpen(true);
  };

  const handleCloseHireDialog = () => {
    setHireDialogOpen(false);
    setSelectedFarmerForHire(null);
  };

  const handleHireSubmit = (farmer: FarmerJob, offer: any) => {
    setNotification({
      open: true,
      message: `The Project ${offer.projectTitle} ${farmer.farmerName} has been requested`,
    });
    setHireDialogOpen(false);
    setSelectedFarmerForHire(null);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleViewLandAd = (ad: LandownerAdApiItem) => {
    setSelectedLandAd(ad);
    setLandDetailOpen(true);
  };

  const handleCloseLandDetail = () => {
    setLandDetailOpen(false);
    setSelectedLandAd(null);
  };

  const handleHireLandowner = (
    ad: LandownerAdApiItem,
    project?: DirectHarvestOfferAPI,
  ) => {
    setLandDetailOpen(false);
    setSelectedLandAd(null);
    setNotification({
      open: true,
      message: project
        ? `Linked "${project.harvestBaseDetails.projectTitle}" to ${typeof ad.landowner === "object" && ad.landowner?.fullName ? ad.landowner.fullName : "Landowner"} for "${ad.title}"`
        : `Hire request sent to ${typeof ad.landowner === "object" && ad.landowner?.fullName ? ad.landowner.fullName : "Landowner"} for "${ad.title}"`,
    });
  };

  const tabs: TabItem[] = [
    {
      value: "investments",
      label: "Investment Opportunities",
      icon: <AccountBalanceWallet sx={{ fontSize: 20 }} />,
      count: investmentRequests.length,
    },
    {
      value: "hire",
      label: "Hire Farmers",
      icon: <Handshake sx={{ fontSize: 20 }} />,
      count: farmerJobs.length,
    },
    {
      value: "land-search",
      label: "Land Search",
      icon: <Landscape sx={{ fontSize: 20 }} />,
      count: landAds.length,
    },
  ];

  return (
    <>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Opportunities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore investment opportunities and hire skilled farmers
          </Typography>
        </Box>

        <TabNavigation
          activeTab={activeTab}
          tabs={tabs}
          onChange={(value) =>
            setActiveTab(value as "investments" | "hire" | "land-search")
          }
          variant="dark"
        />

        {activeTab === "investments" && (
          <Box>
            <SectionHeader
              title="Investment Opportunities"
              description="Fund farmers' cultivation projects with detailed cost breakdowns and payment schedules"
              accentColor="var(--color-brand-accent)"
              showLeftBorder={true}
            />

            {investmentRequestsLoading ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "var(--surface-tint)",
                  borderRadius: 2,
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Loading investment opportunities...
                </Typography>
                <Typography variant="body2">
                  Fetching farmer projects from live data.
                </Typography>
              </Box>
            ) : investmentRequestsError ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "var(--surface-tint)",
                  borderRadius: 2,
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Couldn&apos;t load opportunities
                </Typography>
                <Typography variant="body2">
                  {investmentRequestsError}
                </Typography>
              </Box>
            ) : investmentRequests.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                  gap: 3,
                }}
              >
                {investmentRequests.map((request) => (
                  <InvestmentRequestCard
                    key={request.id}
                    request={request}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "var(--surface-tint)",
                  borderRadius: 2,
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No investment opportunities available
                </Typography>
                <Typography variant="body2">
                  Check back later for new farmer funding requests
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {activeTab === "hire" && (
          <Box>
            <SectionHeader
              title="Hire Farmers"
              description="Hire skilled farmers for various agricultural services"
              accentColor="var(--color-brand-accent)"
              showLeftBorder={true}
            />

            {farmerJobs.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: 3,
                }}
              >
                {farmerJobs.map((job) => (
                  <FarmerJobCard
                    key={job.id}
                    job={job}
                    onViewMore={(job) => console.log("View job:", job)}
                    onConnect={(job) => console.log("Connect to job:", job)}
                    onHire={handleOpenHireDialog}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "var(--surface-tint)",
                  borderRadius: 2,
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No farmers available for hire
                </Typography>
                <Typography variant="body2">
                  Check back later for available services
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* ── Land Search Tab ── */}
        {activeTab === "land-search" && (
          <Box>
            <SectionHeader
              title="Land Search"
              description="Browse available agricultural land plots from verified landowners"
              accentColor="var(--color-brand-accent)"
              showLeftBorder={true}
            />

            {landAdsLoading ? (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <CircularProgress
                  size={40}
                  sx={{ color: "var(--color-brand-accent)" }}
                />
                <Typography
                  variant="body2"
                  sx={{ mt: 2, color: "text.secondary" }}
                >
                  Loading land listings…
                </Typography>
              </Box>
            ) : landAdsError ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "var(--surface-tint)",
                  borderRadius: 2,
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Couldn&apos;t load land listings
                </Typography>
                <Typography variant="body2">{landAdsError}</Typography>
              </Box>
            ) : landAds.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: 3,
                }}
              >
                {landAds.map((ad) => (
                  <LandAdCard
                    key={ad._id}
                    ad={ad}
                    onViewDetails={handleViewLandAd}
                  />
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  bgcolor: "var(--surface-tint)",
                  borderRadius: 2,
                  color: "text.secondary",
                }}
              >
                <Landscape
                  sx={{ fontSize: 56, color: "rgba(133, 164, 70,0.3)", mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  No land listings available
                </Typography>
                <Typography variant="body2">
                  Check back later for new land rental opportunities
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <InvestmentRequestDialog
        request={selectedRequest}
        open={dialogOpen}
        onClose={handleCloseDialog}
        onInvest={handleInvest}
      />

      <HireFarmerDialog
        open={hireDialogOpen}
        onClose={handleCloseHireDialog}
        farmer={selectedFarmerForHire}
        offers={liveOffers}
        onSubmit={handleHireSubmit}
      />

      <LandAdDetailDialog
        open={landDetailOpen}
        onClose={handleCloseLandDetail}
        ad={selectedLandAd}
        onHire={handleHireLandowner}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity="success"
        duration={5000}
        onClose={handleCloseNotification}
      />
    </>
  );
};

export default OpportunitiesPage;
