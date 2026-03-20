import { useAuth } from "@/Context/useAuth";
import type { User } from "@/Context/createAuthContext";
import {
  BarChart,
  Delete,
  Edit,
  Folder,
  HourglassEmpty,
  Settings,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { OfferCardProps } from "../../components/investor";
import {
  CreateOfferButton,
  OfferCard,
  ProjectDetailsDialog,
} from "../../components/investor";
import CreateAdPopup, {
  type LandAdFormValues,
} from "../../components/landowner/CreateAdPopup";
import { comprehensiveProjectsData } from "../../data/json";
import Notification from "../../shared/components/Notification";
import { useNotification } from "../../shared/hooks/useNotification";

type LandAdStatus = "open" | "allocated" | "expired";

interface LandAd extends LandAdFormValues {
  id: number;
  status: LandAdStatus;
  projectName?: string;
  investorRequests: number;
}

const DEFAULT_LAND_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900";

const INITIAL_LAND_ADS: LandAd[] = [
  {
    id: 1,
    title: "North Valley Seasonal Lease",
    location: "North Valley Farm",
    landArea: "25 acres",
    availableFrom: "2026-03-01",
    availableTo: "2026-12-15",
    soilType: "loamy",
    rentalAmount: "50000",
    waterAccess: "irrigation",
    landHistory: "organic-previous",
    additionalInfo:
      "Flat access roads, irrigation lines installed, and suitable for paddy or seasonal vegetables.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900",
    status: "open",
    investorRequests: 4,
  },
  {
    id: 2,
    title: "Sunrise Fields Allocation",
    location: "Sunrise Fields",
    landArea: "15 acres",
    availableFrom: "2026-04-01",
    availableTo: "2026-11-30",
    soilType: "clay",
    rentalAmount: "35000",
    waterAccess: "canal",
    landHistory: "conventional-previous",
    additionalInfo:
      "Canal-fed plot with easy truck access and fenced perimeter.",
    image:
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=900",
    status: "allocated",
    projectName: "Organic Wheat Cultivation",
    investorRequests: 0,
  },
  {
    id: 3,
    title: "Green Meadows Renewal",
    location: "Green Meadows",
    landArea: "30 acres",
    availableFrom: "2026-01-10",
    availableTo: "2026-08-20",
    soilType: "sandy",
    rentalAmount: "45000",
    waterAccess: "well-water",
    landHistory: "crop-rotation",
    additionalInfo:
      "Previous rice cycle completed successfully. Land is ready for a new seasonal partnership.",
    image:
      "https://images.unsplash.com/photo-1464226180484-05a7a0c82715?w=900",
    status: "expired",
    projectName: "Rice Cultivation",
    investorRequests: 0,
  },
];

const EMPTY_LAND_AD: LandAdFormValues = {
  title: "",
  location: "",
  landArea: "",
  availableFrom: "",
  availableTo: "",
  soilType: "",
  rentalAmount: "",
  waterAccess: "",
  landHistory: "",
  additionalInfo: "",
  image: "",
};

const STATUS_CONFIG: Record<
  LandAdStatus,
  { label: string; color: "success" | "warning" | "default" }
> = {
  allocated: {
    label: "Joined to Active Project",
    color: "default",
  },
  open: {
    label: "Open for Investor Requests",
    color: "success",
  },
  expired: {
    label: "Project Completed",
    color: "warning",
  },
};

const formatDateLabel = (value: string) => {
  if (!value) return "Flexible";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatRentalAmount = (value: string) => {
  if (!value) return "LKR 0";
  if (value.toLowerCase().includes("lkr")) return value;

  const numericValue = Number(value.replace(/,/g, ""));
  if (!Number.isNaN(numericValue)) {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  }

  return `LKR ${value}`;
};

const formatAvailability = (ad: LandAdFormValues) =>
  `${formatDateLabel(ad.availableFrom)} - ${formatDateLabel(ad.availableTo)}`;

const toLandAdFormValues = (ad: LandAd): LandAdFormValues => ({
  title: ad.title,
  location: ad.location,
  landArea: ad.landArea,
  availableFrom: ad.availableFrom,
  availableTo: ad.availableTo,
  soilType: ad.soilType,
  rentalAmount: ad.rentalAmount,
  waterAccess: ad.waterAccess,
  landHistory: ad.landHistory,
  additionalInfo: ad.additionalInfo,
  image: ad.image,
});

const normalizeString = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
};

const buildPrefilledAdFromUser = (user: User | null): LandAdFormValues => {
  const personalInfo = user?.personalInfo;
  const userAddress = normalizeString(user?.address);
  const personalAddress = normalizeString(personalInfo?.address);

  const extendedUser = user as
    | (User & {
        landOwnerDetails?: {
          landAddress?: {
            street?: string;
            city?: string;
            district?: string;
            province?: string;
            size?: string;
            soilType?: string;
            rentalExpectation?: string;
          };
        };
      })
    | null;

  const landAddress = extendedUser?.landOwnerDetails?.landAddress;

  const locationParts = [
    normalizeString(landAddress?.street),
    normalizeString(landAddress?.city),
    normalizeString(landAddress?.district),
    normalizeString(landAddress?.province),
  ].filter(Boolean);

  const fallbackLocation = [
    normalizeString(personalInfo?.city),
    normalizeString(personalInfo?.district),
    normalizeString(personalInfo?.province),
  ]
    .filter(Boolean)
    .join(", ");

  const fullName =
    normalizeString(user?.fullName) ||
    [normalizeString(user?.firstName), normalizeString(user?.lastName)]
      .filter(Boolean)
      .join(" ");

  const location =
    locationParts.join(", ") ||
    fallbackLocation ||
    personalAddress ||
    userAddress;

  return {
    title: fullName ? `${fullName}'s Land Ad` : "Land Advertisement",
    location,
    landArea: normalizeString(landAddress?.size),
    availableFrom: "",
    availableTo: "",
    soilType: normalizeString(landAddress?.soilType),
    rentalAmount: normalizeString(landAddress?.rentalExpectation),
    waterAccess: "",
    landHistory: "",
    additionalInfo: "",
    // Intentionally left blank: user must choose/upload a cover image when creating.
    image: "",
  };
};

const SectionTitle = ({
  title,
  accent,
}: {
  title: string;
  accent: string;
}) => (
  <Typography
    variant="h5"
    sx={{
      fontWeight: 700,
      mb: 3,
      display: "flex",
      alignItems: "center",
      gap: 1,
      "&::before": {
        content: '""',
        width: 4,
        height: 24,
        background: accent,
        borderRadius: 1,
      },
    }}
  >
    {title}
  </Typography>
);

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <Box
    sx={{
      textAlign: "center",
      p: 6,
      background: "var(--surface-tint)",
      borderRadius: 2,
      border: "2px dashed",
      borderColor: "divider",
    }}
  >
    <Typography variant="h4" sx={{ mb: 1, opacity: 0.5 }}>
      {icon}
    </Typography>
    <Typography variant="h6" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

const StatusLabel = ({ status }: { status: LandAdStatus }) => {
  const config = STATUS_CONFIG[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
};

const MyLandAdsPage = () => {
  const { user } = useAuth();
  const { notification, showSuccess, showWarning, hideNotification } =
    useNotification();
  const [landAds, setLandAds] = useState<LandAd[]>(INITIAL_LAND_ADS);
  const [landAdDialogOpen, setLandAdDialogOpen] = useState(false);
  const [landAdDialogMode, setLandAdDialogMode] = useState<"create" | "edit">(
    "create",
  );
  const [landAdDraft, setLandAdDraft] = useState<LandAdFormValues>(EMPTY_LAND_AD);
  const [editingLandAdId, setEditingLandAdId] = useState<number | null>(null);
  const [selectedLandAd, setSelectedLandAd] = useState<LandAd | null>(null);
  const [landAdDetailsOpen, setLandAdDetailsOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<OfferCardProps | null>(null);
  const [deleteAdDialogOpen, setDeleteAdDialogOpen] = useState(false);
  const [adToDeleteId, setAdToDeleteId] = useState<number | null>(null);

  const userDisplayName =
    user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "You";

  const allProjects = useMemo(() => {
    const projects = comprehensiveProjectsData as (OfferCardProps & {
      landownerId?: string;
    })[];

    const ownedProjects = user?._id
      ? projects.filter((project) => project.landownerId === user._id)
      : [];

    const scopedProjects =
      ownedProjects.length > 0
        ? ownedProjects
        : projects.filter((project) => project.landownerId).slice(0, 4);

    return scopedProjects.map((project) => ({
      ...project,
      landownerName: userDisplayName,
      landownerId: user?._id ?? project.landownerId,
      secondaryPartyName: project.investorName || "Assigned Investor",
      secondaryPartyRoleLabel: "Investor",
      secondaryPartyRoleType: "investor" as const,
    }));
  }, [user?._id, userDisplayName]);

  const activeProjects = useMemo(
    () => allProjects.filter((project) => project.status === "active"),
    [allProjects],
  );

  const pastProjects = useMemo(
    () => allProjects.filter((project) => project.status === "completed"),
    [allProjects],
  );

  const createdAds = useMemo(
    () => landAds.filter((ad) => ad.status === "open"),
    [landAds],
  );

  const hasActiveLandProject = useMemo(
    () =>
      landAds.some((ad) => ad.status === "open" || ad.status === "allocated") ||
      activeProjects.length > 0,
    [activeProjects.length, landAds],
  );

  const handleCreateAd = () => {
    if (hasActiveLandProject) {
      showWarning(
        "Only one active land project is allowed. Complete or close the current active item first.",
      );
      return;
    }

    setLandAdDialogMode("create");
    setEditingLandAdId(null);
    setLandAdDraft(buildPrefilledAdFromUser(user));
    setLandAdDialogOpen(true);
  };

  const handleEditAd = (adId: number) => {
    const ad = landAds.find((item) => item.id === adId);
    if (!ad) return;

    setLandAdDialogMode("edit");
    setEditingLandAdId(ad.id);
    setLandAdDraft(toLandAdFormValues(ad));
    setLandAdDialogOpen(true);
  };

  const handleCreateNewSeason = (adId: number) => {
    const ad = landAds.find((item) => item.id === adId);
    if (!ad) return;

    setLandAdDialogMode("create");
    setEditingLandAdId(null);
    setLandAdDraft({
      ...toLandAdFormValues(ad),
      title: `${ad.title} - New Season`,
      availableFrom: "",
      availableTo: "",
    });
    setLandAdDialogOpen(true);
  };

  const handleSubmitLandAd = (values: LandAdFormValues) => {
    if (landAdDialogMode === "edit" && editingLandAdId !== null) {
      setLandAds((currentAds) =>
        currentAds.map((ad) =>
          ad.id === editingLandAdId ? { ...ad, ...values } : ad,
        ),
      );
      showSuccess("Land advertisement updated successfully.");
      return;
    }

    if (hasActiveLandProject) {
      showWarning(
        "Cannot publish a new ad while you already have an active land project.",
      );
      return;
    }

    setLandAds((currentAds) => [
      {
        id: Date.now(),
        ...values,
        image: values.image || DEFAULT_LAND_IMAGE,
        status: "open",
        investorRequests: 0,
      },
      ...currentAds,
    ]);
    showSuccess("Land advertisement published successfully.");
  };

  const handleViewLandAd = (adId: number) => {
    const ad = landAds.find((item) => item.id === adId);
    if (!ad) return;

    setSelectedLandAd(ad);
    setLandAdDetailsOpen(true);
  };

  const handleDeleteAd = (adId: number) => {
    setAdToDeleteId(adId);
    setDeleteAdDialogOpen(true);
  };

  const handleConfirmDeleteAd = () => {
    if (adToDeleteId === null) return;
    setLandAds((prev) => prev.filter((ad) => ad.id !== adToDeleteId));
    showSuccess("Land advertisement removed.");
    setDeleteAdDialogOpen(false);
    setAdToDeleteId(null);
  };

  const handleCancelDeleteAd = () => {
    setDeleteAdDialogOpen(false);
    setAdToDeleteId(null);
  };

  const handleViewProjectDetails = (id: string) => {
    const project = [...activeProjects, ...pastProjects].find(
      (item) => item.id === id,
    );

    if (!project) return;

    setSelectedProject(project);
    setDetailsDialogOpen(true);
  };

  const renderLandCard = (ad: LandAd) => {
    const isOpen = ad.status === "open";
    const isExpired = ad.status === "expired";

    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px var(--overlay-md), 0 0 20px var(--color-olive-muted)",
          },
        }}
      >
        {/* Image header — matches OfferCard height and overlay structure */}
        <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, var(--color-nature-deep) 0%, var(--color-nature-mid) 100%)",
            }}
          />
          <CardMedia
            component="img"
            image={ad.image || DEFAULT_LAND_IMAGE}
            alt={ad.title}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.6,
              transition: "opacity 0.3s ease, transform 0.3s ease",
              "&:hover": { opacity: 0.75, transform: "scale(1.05)" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          {/* Status chip — top left */}
          <Box sx={{ position: "absolute", top: 12, left: 12 }}>
            <StatusLabel status={ad.status} />
          </Box>
          {/* Title + area chip — bottom left */}
          <Box sx={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
                mb: 0.5,
                textShadow: "0 1px 4px rgba(0,0,0,0.7)",
              }}
            >
              {ad.title}
            </Typography>
            <Chip
              label={ad.landArea}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.18)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: 0 }}>
          {/* Data grid — mirrors OfferCard's budget/ROI boxes */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "var(--surface-tint)",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block">
                Rental / Season
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "var(--color-olive-light)" }}>
                {formatRentalAmount(ad.rentalAmount)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "var(--surface-tint)",
                border: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block">
                Soil Type
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, textTransform: "capitalize" }}
              >
                {ad.soilType}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 1.5, opacity: 0.4 }} />

          {/* Location row with icon buttons — mirrors OfferCard's farmer row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Location
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {ad.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {isOpen && (
                <Tooltip title="Edit Ad">
                  <IconButton
                    size="small"
                    onClick={() => handleEditAd(ad.id)}
                    sx={{
                      color: "primary.main",
                      "&:hover": { backgroundColor: "var(--color-olive-muted)" },
                    }}
                  >
                    <Edit sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => handleViewLandAd(ad.id)}
                  sx={{
                    color: "primary.main",
                    "&:hover": { backgroundColor: "var(--color-olive-muted)" },
                  }}
                >
                  <Visibility sx={{ fontSize: "1.2rem" }} />
                </IconButton>
              </Tooltip>
              {isOpen && (
                <Tooltip title="Delete Ad">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAd(ad.id)}
                    sx={{
                      color: "error.main",
                      "&:hover": { backgroundColor: "rgba(211,47,47,0.1)" },
                    }}
                  >
                    <Delete sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {ad.projectName && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                background: "var(--surface-tint)",
                border: "1px solid",
                borderColor: "divider",
                mb: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Linked Project
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {ad.projectName}
              </Typography>
            </Box>
          )}

          {isOpen && (
            <Typography variant="caption" color="text.secondary">
              {ad.investorRequests} investor request
              {ad.investorRequests === 1 ? "" : "s"} received.
            </Typography>
          )}
        </CardContent>

        {/* Footer — mirrors OfferCard's start/end date footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
            mt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
            background: "var(--surface-tint)",
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              From
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {formatDateLabel(ad.availableFrom)}
            </Typography>
          </Box>
          {isExpired && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleCreateNewSeason(ad.id)}
              sx={{ fontSize: "0.7rem", textTransform: "none", px: 1.5 }}
            >
              New Season
            </Button>
          )}
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary" display="block">
              To
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {formatDateLabel(ad.availableTo)}
            </Typography>
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <>
      <Box className="container-fluid" sx={{ mb: 4 }}>
        <div className="row align-items-start">
          <div className="col-12 col-lg-8">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              My Offers
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Publish your land availability, track joined projects, and review investor interest from one place.
            </Typography>
          </div>
          <div className="col-12 col-lg-4 d-flex justify-content-lg-end align-items-center gap-2 mt-3 mt-lg-0">
            <Tooltip
              title={
                hasActiveLandProject
                  ? "Only one active land project is allowed. Complete or close your current active item before creating a new one."
                  : ""
              }
            >
              <span>
                <CreateOfferButton
                  onClick={handleCreateAd}
                  label="Create New Ad"
                  disabled={hasActiveLandProject}
                />
              </span>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Box>

      <section className="mb-5">
        <SectionTitle
          title="My Land Ads"
          accent="linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)"
        />
        {createdAds.length > 0 ? (
          <div className="row g-4">
            {createdAds.map((ad) => (
              <div key={ad.id} className="col-12 col-md-6 col-lg-4">
                {renderLandCard(ad)}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<HourglassEmpty sx={{ fontSize: 40, opacity: 0.5 }} />}
            title="No Land Ads Yet"
            description="Create your first land advertisement to start receiving investor requests."
          />
        )}
      </section>

      <hr
        style={{
          margin: "3rem 0",
          border: "none",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--border-medium), transparent)",
        }}
      />

      <section className="mb-5">
        <SectionTitle
          title="Active Projects"
          accent="linear-gradient(180deg, var(--color-olive) 0%, var(--color-olive-light) 100%)"
        />
        {activeProjects.length > 0 ? (
          <div className="row g-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <OfferCard
                  {...project}
                  onViewDetails={handleViewProjectDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BarChart sx={{ fontSize: 40, opacity: 0.5 }} />}
            title="No Active Projects"
            description="Approved investor collaborations involving your land will appear here."
          />
        )}
      </section>

      <hr
        style={{
          margin: "3rem 0",
          border: "none",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--border-medium), transparent)",
        }}
      />

      <section>
        <SectionTitle
          title="Past Projects"
          accent="linear-gradient(180deg, var(--color-olive) 0%, var(--color-olive-light) 100%)"
        />
        {pastProjects.length > 0 ? (
          <div className="row g-4">
            {pastProjects.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <OfferCard
                  {...project}
                  onViewDetails={handleViewProjectDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Folder sx={{ fontSize: 40, opacity: 0.5 }} />}
            title="No Past Projects"
            description="Completed collaborations involving your land will appear here."
          />
        )}
      </section>

      <CreateAdPopup
        open={landAdDialogOpen}
        onClose={() => setLandAdDialogOpen(false)}
        onSubmit={handleSubmitLandAd}
        initialValues={landAdDraft}
        mode={landAdDialogMode}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteAdDialogOpen}
        onClose={handleCancelDeleteAd}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(180deg, var(--bg-overlay), var(--bg-elevated))",
            border: "1px solid var(--surface-light)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Remove Land Ad?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently remove the advertisement. You'll be able to
            create a new one afterwards.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={handleCancelDeleteAd} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteAd}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={landAdDetailsOpen}
        onClose={() => setLandAdDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(180deg, var(--bg-overlay), var(--bg-elevated))",
            border: "1px solid var(--surface-light)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Land Ad Details
        </DialogTitle>
        <DialogContent>
          {selectedLandAd && (
            <Stack spacing={2.25}>
              <Box
                sx={{
                  height: 220,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid var(--surface-light)",
                }}
              >
                <CardMedia
                  component="img"
                  image={selectedLandAd.image || DEFAULT_LAND_IMAGE}
                  alt={selectedLandAd.title}
                  sx={{ height: "100%", objectFit: "cover" }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {selectedLandAd.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedLandAd.location}
                  </Typography>
                </Box>
                <StatusLabel status={selectedLandAd.status} />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Land Area
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedLandAd.landArea}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Rental Amount
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatRentalAmount(selectedLandAd.rentalAmount)} / Month
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Soil Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                    {selectedLandAd.soilType}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Water Access
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                    {selectedLandAd.waterAccess.replace(/-/g, " ")}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Available Period
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatAvailability(selectedLandAd)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Land History
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedLandAd.landHistory.replace(/-/g, " ")}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "var(--surface-tint)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Additional Information
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedLandAd.additionalInfo || "No additional notes provided."}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setLandAdDetailsOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ProjectDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        project={selectedProject}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        duration={5000}
        onClose={hideNotification}
      />
    </>
  );
};

export default MyLandAdsPage;