import type { User } from "@/Context/createAuthContext";
import { useAuth } from "@/Context/useAuth";
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
import { useEffect, useMemo, useState } from "react";
import type { OfferCardProps } from "../../components/investor";
import {
  CreateOfferButton,
  OfferCard,
  ProjectDetailsDialog,
} from "../../components/investor";
import CreateAdPopup, {
  type LandAdFormValues,
} from "../../components/landowner/CreateAdPopup";
import LandAdDetailsDialog from "../../components/landowner/LandAdDetailsDialog";
import { comprehensiveProjectsData } from "../../data/json";
import {
  createLandownerAd,
  deleteLandownerAd,
  getLandownerAds,
  updateLandownerAd,
  uploadLandAdImages,
  type LandImage,
  type LandownerAdApiItem,
  type LandownerInfo,
} from "../../services/landownerAds.service";
import Notification from "../../shared/components/Notification";
import { useNotification } from "../../shared/hooks/useNotification";

type LandAdStatus = "open" | "allocated" | "expired";

interface LandAd extends LandAdFormValues {
  id: string;
  status: LandAdStatus;
  projectName?: string;
  investorRequests: number;
  waterAccess?: string;
  image?: string;
  images?: LandImage[];
  landowner?: LandownerInfo | string;
  landownerName?: string;
}

const DEFAULT_LAND_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900";

const EMPTY_LAND_AD: LandAdFormValues = {
  title: "",
  location: "",
  landArea: "",
  availableFrom: "",
  availableTo: "",
  soilType: "",
  rentalAmount: "",
  waterAvailability: "",
  landHistory: "",
  additionalInfo: "",
  landImages: [],
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

const normalizeAdStatus = (status?: string): LandAdStatus => {
  const normalized = status?.toLowerCase();
  if (normalized === "active" || normalized === "open") return "open";
  if (normalized === "allocated" || normalized === "joined") return "allocated";
  if (normalized === "expired" || normalized === "completed") return "expired";
  return "open";
};

const toUtcIsoFromDateInput = (value: string): string => {
  if (!value) return "";

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;

  return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

const toLandAdFormValues = (ad: LandAd): LandAdFormValues => ({
  title: ad.title,
  location: ad.location,
  landArea: ad.landArea,
  availableFrom: ad.availableFrom,
  availableTo: ad.availableTo,
  soilType: ad.soilType,
  rentalAmount: ad.rentalAmount,
  waterAvailability: ad.waterAvailability,
  landHistory: ad.landHistory,
  additionalInfo: ad.additionalInfo,
  landImages: ad.landImages,
});

const normalizeString = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
};

const normalizeLocationField = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && value) {
    const obj = value as Record<string, unknown>;

    const addressParts = [obj.street, obj.city, obj.district, obj.province]
      .filter((part) => typeof part === "string" && part)
      .map((part) => (part as string).trim());

    if (addressParts.length > 0) {
      return addressParts.join(", ");
    }
  }
  return "";
};

const toNumberOrString = (value: string): string | number => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const numericValue = Number(trimmed);
  return Number.isNaN(numericValue) ? trimmed : numericValue;
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
    waterAvailability: "",
    landHistory: "",
    additionalInfo: "",
    landImages: [],
  };
};

const SectionTitle = ({ title, accent }: { title: string; accent: string }) => (
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
  const [landAds, setLandAds] = useState<LandAd[]>([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [hasExistingAdFromServer, setHasExistingAdFromServer] = useState(false);
  const [landAdDialogOpen, setLandAdDialogOpen] = useState(false);
  const [landAdDialogMode, setLandAdDialogMode] = useState<"create" | "edit">(
    "create",
  );
  const [landAdDraft, setLandAdDraft] =
    useState<LandAdFormValues>(EMPTY_LAND_AD);
  const [editingLandAdId, setEditingLandAdId] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<OfferCardProps | null>(
    null,
  );
  const [deleteAdDialogOpen, setDeleteAdDialogOpen] = useState(false);
  const [adToDeleteId, setAdToDeleteId] = useState<string | null>(null);
  const [viewingAdId, setViewingAdId] = useState<string | null>(null);
  const [landAdDetailsDialogOpen, setLandAdDetailsDialogOpen] = useState(false);

  const userDisplayName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "You";

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

  const createdAds = useMemo(() => landAds, [landAds]);
  const hasExistingLandAd = hasExistingAdFromServer || createdAds.length > 0;
  const showPortfolioSections = true;

  const fetchAds = async () => {
    setAdsLoading(true);
    try {
      const response = await getLandownerAds();

      const responseAny = response as unknown as {
        data?: unknown;
        items?: unknown;
        docs?: unknown;
        pagination?: { totalDocs?: number };
      };

      const nestedData = responseAny.data as
        | {
            data?: unknown;
            items?: unknown;
            docs?: unknown;
            pagination?: { totalDocs?: number };
          }
        | undefined;

      const rawAds = Array.isArray(responseAny.data)
        ? responseAny.data
        : Array.isArray(nestedData?.data)
          ? nestedData.data
          : Array.isArray(responseAny.items)
            ? responseAny.items
            : Array.isArray(nestedData?.items)
              ? nestedData.items
              : Array.isArray(responseAny.docs)
                ? responseAny.docs
                : Array.isArray(nestedData?.docs)
                  ? nestedData.docs
                  : [];

      const totalDocs =
        responseAny.pagination?.totalDocs ??
        nestedData?.pagination?.totalDocs ??
        0;

      const mapped = (rawAds as LandownerAdApiItem[]).map(
        (item: LandownerAdApiItem): LandAd => {
          let landownerName = "";
          if (typeof item.landowner === "object" && item.landowner) {
            landownerName = item.landowner.fullName || "";
          } else if (typeof item.landowner === "string") {
            landownerName = item.landowner;
          }

          const imageUrls = (item.images || [])
            .filter((img): img is LandImage => img && !!img.url)
            .map((img) => img);

          const primaryImage =
            imageUrls.length > 0 ? imageUrls[0].url : item.image;

          return {
            id: item._id,
            title: item.title || "",
            location: normalizeLocationField(item.location),
            landArea: normalizeString(item.landArea),
            availableFrom: item.availableFrom || "",
            availableTo: item.availableTo || "",
            soilType: normalizeString(item.soilType),
            rentalAmount: normalizeString(item.rentalAmount),
            waterAvailability: item.waterAvailability || "",
            landHistory: normalizeString(item.landHistory),
            additionalInfo: normalizeString(item.additionalInfo),
            landImages: imageUrls.map((img) => img.url || "").filter(Boolean),
            image: primaryImage || "",
            images: imageUrls,
            landowner: item.landowner,
            landownerName,
            status: normalizeAdStatus(item.status),
            investorRequests: 0,
          };
        },
      );
      setLandAds(mapped);
      setHasExistingAdFromServer(totalDocs > 0 || mapped.length > 0);
    } catch (error) {
      console.error("[MyOffers] Failed to fetch land ads:", error);
      setHasExistingAdFromServer(false);
    } finally {
      setAdsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) void fetchAds();
  }, [user?._id]);

  const handleCreateAd = () => {
    if (hasExistingLandAd) {
      showWarning(
        "You can create only one land ad. Edit or delete the existing ad.",
      );
      return;
    }

    setLandAdDialogMode("create");
    setEditingLandAdId(null);
    setLandAdDraft(buildPrefilledAdFromUser(user));
    setLandAdDialogOpen(true);
  };

  const handleEditAd = (adId: string) => {
    const ad = landAds.find((item) => item.id === adId);
    if (!ad) return;

    setLandAdDialogMode("edit");
    setEditingLandAdId(ad.id);
    setLandAdDraft(toLandAdFormValues(ad));
    setLandAdDialogOpen(true);
  };

  const handleCreateNewSeason = (adId: string) => {
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

  const handleSubmitLandAd = async (
    values: LandAdFormValues,
    newImageFiles?: File[],
  ) => {
    if (landAdDialogMode === "edit" && editingLandAdId !== null) {
      const updatePayload = {
        title: values.title.trim(),
        availableFrom: toUtcIsoFromDateInput(values.availableFrom),
        availableTo: toUtcIsoFromDateInput(values.availableTo),
        soilType: values.soilType.trim(),
        rentalAmount: toNumberOrString(values.rentalAmount),
        waterAvailability: values.waterAvailability.trim(),
        landHistory: values.landHistory.trim(),
        ...(values.additionalInfo.trim()
          ? { additionalInfo: values.additionalInfo.trim() }
          : { additionalInfo: "" }),
      };

      try {
        await updateLandownerAd(editingLandAdId, updatePayload);
      } catch (error) {
        console.error("[MyOffers] Update landowner ad failed:", error);
        showWarning("Failed to update land advertisement. Please try again.");
        throw error;
      }

      void fetchAds();
      showSuccess("Land advertisement updated successfully.");
      return;
    }

    if (!user?._id) {
      showWarning("Unable to create ad. Missing user ID.");
      throw new Error("Missing user ID");
    }

    const payload = {
      landOwner: user._id,
      title: values.title.trim(),
      location: values.location.trim(),
      landArea: values.landArea.trim(),
      availableFrom: toUtcIsoFromDateInput(values.availableFrom),
      availableTo: toUtcIsoFromDateInput(values.availableTo),
      soilType: values.soilType.trim(),
      rentalAmount: toNumberOrString(values.rentalAmount),
      waterAvailability: values.waterAvailability.trim(),
      landHistory: values.landHistory.trim(),
      ...(values.additionalInfo.trim()
        ? { additionalInfo: values.additionalInfo.trim() }
        : {}),
    };

    let createdAdId: string | undefined;
    try {
      const response = await createLandownerAd(payload);
      createdAdId = (response as { _id?: string } | undefined)?._id;
    } catch (error) {
      console.error("[MyOffers] Create landowner ad failed:", error);
      showWarning("Failed to publish land advertisement. Please try again.");
      throw error;
    }

    if (newImageFiles && newImageFiles.length > 0 && createdAdId) {
      try {
        await uploadLandAdImages(createdAdId, newImageFiles);
        console.log(
          `[MyOffers] Successfully uploaded ${newImageFiles.length} image(s) to ad ${createdAdId}`,
        );
      } catch (error) {
        console.error(
          "[MyOffers] Failed to upload images for ad:",
          createdAdId,
          error,
        );
        showWarning(
          "Land advertisement created but some images failed to upload.",
        );
      }
    }

    showSuccess("Land advertisement published successfully.");
    void fetchAds();
  };

  const handleDeleteAd = (adId: string) => {
    setAdToDeleteId(adId);
    setDeleteAdDialogOpen(true);
  };

  const handleConfirmDeleteAd = async () => {
    if (adToDeleteId === null) return;
    try {
      await deleteLandownerAd(adToDeleteId);
      setLandAds((prev) => {
        const updated = prev.filter((ad) => ad.id !== adToDeleteId);
        setHasExistingAdFromServer(updated.length > 0);
        return updated;
      });
      showSuccess("Land advertisement removed.");
    } catch (error) {
      console.error("[MyOffers] Delete land ad failed:", error);
      showWarning("Failed to remove the advertisement. Please try again.");
    }
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
          background:
            "linear-gradient(145deg, var(--bg-subtle) 0%, var(--bg-overlay) 100%)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow:
              "0 20px 40px var(--overlay-md), 0 0 20px var(--color-olive-muted)",
          },
        }}
      >
        <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
          <CardMedia
            component="img"
            image={ad.image || DEFAULT_LAND_IMAGE}
            alt={ad.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.7,
              transition: "opacity 0.3s ease, transform 0.3s ease",
              "&:hover": { opacity: 0.85, transform: "scale(1.05)" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
            <StatusLabel status={ad.status} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              zIndex: 10,
            }}
          >
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
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
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
              {ad.landownerName && (
                <Chip
                  label={ad.landownerName}
                  size="small"
                  sx={{
                    bgcolor: "rgba(133, 164, 70, 0.3)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Stack>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: 0 }}>
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
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Rental / Season
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "var(--color-olive-light)" }}
              >
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
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Location
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {ad.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => {
                    setViewingAdId(ad.id);
                    setLandAdDetailsDialogOpen(true);
                  }}
                  sx={{
                    color: "var(--color-olive-light)",
                    "&:hover": {
                      backgroundColor: "rgba(133, 164, 70, 0.1)",
                    },
                  }}
                >
                  <Visibility sx={{ fontSize: "1.2rem" }} />
                </IconButton>
              </Tooltip>
              {isOpen && (
                <Tooltip title="Edit Ad">
                  <IconButton
                    size="small"
                    onClick={() => handleEditAd(ad.id)}
                    sx={{
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "var(--color-olive-muted)",
                      },
                    }}
                  >
                    <Edit sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                </Tooltip>
              )}
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
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
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
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
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
              Publish your land availability, track joined projects, and review
              investor interest from one place.
            </Typography>
          </div>
          <div className="col-12 col-lg-4 d-flex justify-content-lg-end align-items-center gap-2 mt-3 mt-lg-0">
            <Tooltip
              title={
                hasExistingLandAd
                  ? "Only one land ad is allowed. Edit or delete your current ad."
                  : ""
              }
            >
              <span>
                <CreateOfferButton
                  onClick={handleCreateAd}
                  label="Create New Ad"
                  disabled={hasExistingLandAd || adsLoading}
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

      {showPortfolioSections && (
        <>
          <section className="mb-5">
            <SectionTitle
              title="My Land Ads"
              accent="linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)"
            />
            {adsLoading ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography color="text.secondary">
                  Loading your land ads…
                </Typography>
              </Box>
            ) : createdAds.length > 0 ? (
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
        </>
      )}

      <CreateAdPopup
        open={landAdDialogOpen}
        onClose={() => setLandAdDialogOpen(false)}
        onSubmit={handleSubmitLandAd}
        initialValues={landAdDraft}
        mode={landAdDialogMode}
      />

      <Dialog
        open={deleteAdDialogOpen}
        onClose={handleCancelDeleteAd}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background:
              "linear-gradient(180deg, var(--bg-overlay), var(--bg-elevated))",
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

      <ProjectDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        project={selectedProject}
        viewMode="landowner"
      />

      <LandAdDetailsDialog
        open={landAdDetailsDialogOpen}
        onClose={() => {
          setLandAdDetailsDialogOpen(false);
          setViewingAdId(null);
        }}
        adId={viewingAdId || undefined}
        defaultImage={DEFAULT_LAND_IMAGE}
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
