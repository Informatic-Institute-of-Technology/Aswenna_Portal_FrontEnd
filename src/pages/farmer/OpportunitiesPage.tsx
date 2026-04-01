import type { InvestorOfferAPI } from "@/types/investor.types";
import {
  Add,
  CalendarToday,
  Close,
  DeleteOutline,
  Handshake,
  RadioButtonChecked,
  RadioButtonUnchecked,
  TrendingUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Context";
import {
  SectionHeader,
  TabNavigation,
  type TabItem,
} from "../../components/common";
import FarmerOpportunityOfferCard from "../../components/farmer/FarmerOpportunityOfferCard";
import {
  getFarmerProjects,
  type FarmerProjectApiItem,
} from "../../services/farmerProject.service";
import {
  getInvestorOfferById,
  getInvestorOffers,
  updateFarmerOfferBreakdown,
} from "../../services/offer.service";
import Notification from "../../shared/components/Notification";

type FarmerOpportunityTab = "commission-service" | "harvest-partnership";

type EditableCostRow = {
  id: string;
  category: string;
  description: string;
  estimatedCost: string;
};

type EditableMilestoneRow = {
  id: string;
  milestone: string;
  fromDate: string;
  toDate: string;
  paymentDueDate: string;
  budget: string;
};

const makeRowId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getProjectFarmerId = (project: FarmerProjectApiItem): string => {
  if (typeof project.farmer === "string") {
    return project.farmer;
  }

  if (project.farmer && typeof project.farmer === "object") {
    return project.farmer._id ?? "";
  }

  return "";
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateForApi = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
};

const parsePositiveAmount = (value: string) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return amount;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    try {
      const parsed = JSON.parse(error.message) as {
        message?: string | string[];
      };
      if (Array.isArray(parsed.message)) {
        return parsed.message[0] || fallback;
      }
      if (typeof parsed.message === "string") {
        return parsed.message;
      }
    } catch {
      return error.message;
    }

    return error.message;
  }

  return fallback;
};

const getInvestorName = (offer: InvestorOfferAPI) =>
  offer.investor?.fullName?.trim() || "Investor";

const getOfferTitle = (offer: InvestorOfferAPI) => {
  if (offer.offerType === "direct-harvest") {
    return offer.harvestBaseDetails.projectTitle;
  }

  return offer.commissionDetails.sponsorshipTitle;
};

const getOfferFromResponse = (
  response: unknown,
  fallback: InvestorOfferAPI,
): InvestorOfferAPI => {
  if (response && typeof response === "object" && "_id" in response) {
    return response as InvestorOfferAPI;
  }

  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    (response as { data?: unknown }).data &&
    typeof (response as { data?: unknown }).data === "object" &&
    "_id" in ((response as { data?: unknown }).data as object)
  ) {
    return (response as { data: InvestorOfferAPI }).data;
  }

  return fallback;
};

const buildInitialCostRows = (offer: InvestorOfferAPI): EditableCostRow[] => {
  if (offer.offerType === "direct-harvest") {
    const budget = offer.harvestBaseDetails.totalBudget || 0;
    return [
      {
        id: makeRowId(),
        category: "Seeds & Inputs",
        description: "Initial seeds and cultivation inputs",
        estimatedCost: budget > 0 ? String(Math.round(budget * 0.35)) : "",
      },
      {
        id: makeRowId(),
        category: "Labor",
        description: "Field operations and labor charges",
        estimatedCost: budget > 0 ? String(Math.round(budget * 0.65)) : "",
      },
    ];
  }

  return [
    {
      id: makeRowId(),
      category: "Capital Support",
      description: "Initial commission-based support",
      estimatedCost: String(offer.commissionDetails.minimumInvestment || ""),
    },
  ];
};

const buildInitialMilestoneRows = (
  offer: InvestorOfferAPI,
): EditableMilestoneRow[] => {
  const defaultFrom = formatDateForApi(offer.createdAt);
  const defaultTo = formatDateForApi(offer.expiredDate);
  const defaultDue = defaultTo;

  if (offer.offerType === "direct-harvest") {
    const budget = offer.harvestBaseDetails.totalBudget || 0;
    return [
      {
        id: makeRowId(),
        milestone: "Land Preparation",
        fromDate: defaultFrom,
        toDate: defaultTo,
        paymentDueDate: defaultDue,
        budget: budget > 0 ? String(Math.round(budget * 0.4)) : "",
      },
      {
        id: makeRowId(),
        milestone: "Harvest & Delivery",
        fromDate: defaultFrom,
        toDate: defaultTo,
        paymentDueDate: defaultDue,
        budget: budget > 0 ? String(Math.round(budget * 0.6)) : "",
      },
    ];
  }

  const minInvest = offer.commissionDetails.minimumInvestment || 0;
  return [
    {
      id: makeRowId(),
      milestone: "Initial Funding",
      fromDate: defaultFrom,
      toDate: defaultTo,
      paymentDueDate: defaultDue,
      budget: String(minInvest),
    },
  ];
};

const FarmerOpportunitiesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] =
    useState<FarmerOpportunityTab>("commission-service");
  const [offers, setOffers] = useState<InvestorOfferAPI[]>([]);
  const [farmerHarvestProjects, setFarmerHarvestProjects] = useState<
    FarmerProjectApiItem[]
  >([]);
  const [harvestProjectsLoading, setHarvestProjectsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offerDetailsLoading, setOfferDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<InvestorOfferAPI | null>(
    null,
  );
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [editableCostRows, setEditableCostRows] = useState<EditableCostRow[]>(
    [],
  );
  const [editableMilestoneRows, setEditableMilestoneRows] = useState<
    EditableMilestoneRow[]
  >([]);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let mounted = true;

    const loadOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getInvestorOffers({ status: "open" });
        const activeOffers = (response.data ?? [])
          .filter(
            (offer) => offer.status !== "closed" && offer.status !== "expired",
          )
          .map((offer) => ({
            ...offer,
            farmerName: offer.farmer?.fullName || offer.farmerName,
            farmerId: offer.farmer?._id || offer.farmerId,
            landOwnerName: offer.landowner?.fullName || offer.landOwnerName,
            landOwnerId: offer.landowner?._id || offer.landOwnerId,
          }));

        if (mounted) {
          setOffers(activeOffers);
        }
      } catch {
        if (mounted) {
          setError("Failed to load investor opportunities. Please try again.");
          setOffers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadOffers();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadHarvestProjects = async () => {
      if (!user?._id) {
        if (mounted) {
          setFarmerHarvestProjects([]);
        }
        return;
      }

      try {
        setHarvestProjectsLoading(true);
        const response = await getFarmerProjects();
        const myHarvestProjects = (response.data ?? []).filter(
          (project) =>
            project.offerType === "harvest" &&
            getProjectFarmerId(project) === user._id &&
            project.visibility !== false &&
            project.status.toLowerCase() !== "cancelled" &&
            project.status.toLowerCase() !== "completed",
        );

        if (mounted) {
          setFarmerHarvestProjects(myHarvestProjects);
          setSelectedProjectId(myHarvestProjects[0]?._id ?? null);
        }
      } catch {
        if (mounted) {
          setFarmerHarvestProjects([]);
          setSelectedProjectId(null);
        }
      } finally {
        if (mounted) {
          setHarvestProjectsLoading(false);
        }
      }
    };

    void loadHarvestProjects();

    return () => {
      mounted = false;
    };
  }, [user?._id]);

  const harvestBasedInvestorOffers = useMemo(
    () => offers.filter((offer) => offer.offerType === "direct-harvest"),
    [offers],
  );

  const commissionBasedInvestorOffers = useMemo(
    () => offers.filter((offer) => offer.offerType === "sponsorship"),
    [offers],
  );

  const tabs: TabItem[] = [
    {
      value: "commission-service",
      label: "My Offers",
      icon: <Handshake sx={{ fontSize: 20 }} />,
      count: commissionBasedInvestorOffers.length,
    },
    {
      value: "harvest-partnership",
      label: "My Jobs",
      icon: <TrendingUp sx={{ fontSize: 20 }} />,
      count: harvestBasedInvestorOffers.length,
    },
  ];

  const currentOffers =
    activeTab === "commission-service"
      ? commissionBasedInvestorOffers
      : harvestBasedInvestorOffers;

  const sectionTitle =
    activeTab === "commission-service" ? "My Offers" : "My Jobs";

  const sectionDescription =
    activeTab === "commission-service"
      ? "Investor commission-based partnership opportunities."
      : "Investor harvest-based offers you can connect with.";

  const actionLabel =
    activeTab === "commission-service" ? "Connect" : "Send Request";

  const handleView = async (offer: InvestorOfferAPI) => {
    setDetailsOpen(true);
    setOfferDetailsLoading(true);
    setSelectedOffer(offer);

    try {
      const response = await getInvestorOfferById(offer._id);
      const liveOffer = getOfferFromResponse(response, offer);
      setSelectedOffer(liveOffer);
    } catch {
      setSelectedOffer(offer);
    } finally {
      setOfferDetailsLoading(false);
    }
  };

  const handleAction = async (offer: InvestorOfferAPI) => {
    setOfferDetailsLoading(true);
    setSelectedOffer(offer);

    try {
      const response = await getInvestorOfferById(offer._id);
      const liveOffer = getOfferFromResponse(response, offer);
      setSelectedOffer(liveOffer);
      setEditableCostRows(buildInitialCostRows(liveOffer));
      setEditableMilestoneRows(buildInitialMilestoneRows(liveOffer));
    } catch {
      setEditableCostRows(buildInitialCostRows(offer));
      setEditableMilestoneRows(buildInitialMilestoneRows(offer));
      setSelectedOffer(offer);
    } finally {
      setOfferDetailsLoading(false);
      if (activeTab === "commission-service") {
        setConnectDialogOpen(true);
      } else {
        setActionDialogOpen(true);
      }
    }
  };

  const handleConnectDialogClose = () => {
    setConnectDialogOpen(false);
  };

  const handleConnectConfirm = () => {
    if (!selectedOffer || !selectedProjectId) {
      return;
    }

    const selectedProject = farmerHarvestProjects.find(
      (project) => project._id === selectedProjectId,
    );

    setNotification({
      open: true,
      message: `Connected ${selectedProject?.projectName || "project"} with ${getInvestorName(selectedOffer)}.`,
      severity: "success",
    });
    setConnectDialogOpen(false);
  };

  const handleActionDialogClose = () => {
    setActionDialogOpen(false);
  };

  const handleActionDialogConfirm = async () => {
    if (!selectedOffer || selectedOffer.offerType !== "direct-harvest") {
      return;
    }

    if (!user?._id) {
      setNotification({
        open: true,
        message: "Unable to send request. Farmer account was not found.",
        severity: "error",
      });
      return;
    }

    const hasIncompleteCostRow = editableCostRows.some((row) => {
      const title = row.category.trim();
      const amount = parsePositiveAmount(row.estimatedCost);
      return title === "" || amount === null;
    });

    const financialBreakdown = editableCostRows
      .map((row) => {
        const amount = parsePositiveAmount(row.estimatedCost);
        const category = row.category.trim();

        if (!category || amount === null) {
          return null;
        }

        return {
          category,
          amount,
        };
      })
      .filter(
        (
          item,
        ): item is {
          category: string;
          amount: number;
        } => item !== null,
      );

    const hasIncompleteMilestoneRow = editableMilestoneRows.some((row) => {
      const title = row.milestone.trim();
      const amount = parsePositiveAmount(row.budget);
      return title === "" || amount === null;
    });

    const milestones = editableMilestoneRows
      .map((row) => {
        const title = row.milestone.trim();
        const payment = parsePositiveAmount(row.budget);

        if (!title || payment === null) {
          return null;
        }

        const startDate = formatDateForApi(
          row.fromDate || selectedOffer.createdAt,
        );
        const endDate = formatDateForApi(
          row.toDate || selectedOffer.expiredDate,
        );
        const paymentDueDate = formatDateForApi(
          row.paymentDueDate || selectedOffer.expiredDate,
        );

        const description = `Payment due by ${formatDate(paymentDueDate)}`;

        return {
          title,
          description,
          startDate,
          endDate,
          payment,
          paymentDueDate,
        };
      })
      .filter(
        (
          item,
        ): item is {
          title: string;
          description: string;
          startDate: string;
          endDate: string;
          payment: number;
          paymentDueDate: string;
        } => item !== null,
      );

    if (
      hasIncompleteCostRow ||
      hasIncompleteMilestoneRow ||
      milestones.length === 0 ||
      financialBreakdown.length === 0
    ) {
      setNotification({
        open: true,
        message:
          "Please fill every cost and milestone row with valid values before sending.",
        severity: "error",
      });
      return;
    }

    const totalFinancialBreakdown = financialBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const totalMilestones = milestones.reduce(
      (sum, item) => sum + item.payment,
      0,
    );

    if (totalFinancialBreakdown !== totalMilestones) {
      setNotification({
        open: true,
        message: `Cost breakdown total (${formatCurrency(totalFinancialBreakdown)}) and milestone total (${formatCurrency(totalMilestones)}) must be equal.`,
        severity: "error",
      });
      return;
    }

    const offerBudget = selectedOffer.harvestBaseDetails.totalBudget || 0;
    if (offerBudget > 0 && totalFinancialBreakdown > offerBudget) {
      setNotification({
        open: true,
        message: `Total amount cannot exceed offer budget (${formatCurrency(offerBudget)}).`,
        severity: "error",
      });
      return;
    }

    try {
      setSubmittingRequest(true);

      await updateFarmerOfferBreakdown(selectedOffer._id, {
        costBreakdown: financialBreakdown.map((item) => ({
          title: item.category,
          estimatedCost: item.amount,
        })),
        milestoneBreakdown: milestones.map((item) => ({
          title: item.title,
          estimatedAmount: item.payment,
          paymentOverDueDate: item.paymentDueDate,
          startDate: item.startDate,
          endDate: item.endDate,
        })),
        farmer: {
          _id: user._id,
          fullName: user.fullName || undefined,
          email: user.email || undefined,
        },
      } as Parameters<typeof updateFarmerOfferBreakdown>[1]);

      setNotification({
        open: true,
        message: `${actionLabel} sent to ${getInvestorName(selectedOffer)} successfully.`,
        severity: "success",
      });
      setActionDialogOpen(false);
    } catch (error) {
      setNotification({
        open: true,
        message: getErrorMessage(
          error,
          "Failed to send request. Please try again.",
        ),
        severity: "error",
      });
    } finally {
      setSubmittingRequest(false);
    }
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const updateCostRow = (
    rowId: string,
    field: keyof EditableCostRow,
    value: string,
  ) => {
    setEditableCostRows((previous) =>
      previous.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    );
  };

  const updateMilestoneRow = (
    rowId: string,
    field: keyof EditableMilestoneRow,
    value: string,
  ) => {
    setEditableMilestoneRows((previous) =>
      previous.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    );
  };

  const addCostRow = () => {
    setEditableCostRows((previous) => [
      ...previous,
      { id: makeRowId(), category: "", description: "", estimatedCost: "" },
    ]);
  };

  const removeCostRow = (rowId: string) => {
    setEditableCostRows((previous) =>
      previous.filter((row) => row.id !== rowId),
    );
  };

  const addMilestoneRow = () => {
    setEditableMilestoneRows((previous) => [
      ...previous,
      {
        id: makeRowId(),
        milestone: "",
        fromDate: formatDateForApi(new Date().toISOString()),
        toDate: formatDateForApi(new Date().toISOString()),
        paymentDueDate: formatDateForApi(new Date().toISOString()),
        budget: "",
      },
    ]);
  };

  const removeMilestoneRow = (rowId: string) => {
    setEditableMilestoneRows((previous) =>
      previous.filter((row) => row.id !== rowId),
    );
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Opportunities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Investor-created offers, presented in a farmer-friendly view.
          </Typography>
        </Box>

        <TabNavigation
          activeTab={activeTab}
          tabs={tabs}
          onChange={(value) => setActiveTab(value as FarmerOpportunityTab)}
          variant="dark"
        />

        <SectionHeader
          title={sectionTitle}
          description={sectionDescription}
          accentColor="var(--color-brand-accent)"
          showLeftBorder={true}
        />

        {loading ? (
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
              Loading investor opportunities...
            </Typography>
            <Typography variant="body2">
              Fetching live data from the investor offers API.
            </Typography>
          </Box>
        ) : error ? (
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
            <Typography variant="body2">{error}</Typography>
          </Box>
        ) : currentOffers.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: 3,
            }}
          >
            {currentOffers.map((offer) => (
              <Box key={offer._id}>
                <FarmerOpportunityOfferCard
                  offer={offer}
                  actionLabel={actionLabel}
                  onView={() => void handleView(offer)}
                  onAction={() => void handleAction(offer)}
                />
              </Box>
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
              No opportunities available
            </Typography>
            <Typography variant="body2">
              New investor offers will appear here after publishing.
            </Typography>
          </Box>
        )}
      </Box>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: "var(--bg-subtle)",
            borderRadius: 2,
            maxHeight: "92vh",
          },
        }}
      >
        {selectedOffer && (
          <>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid var(--border-medium)",
                position: "relative",
                bgcolor: "var(--border-subtle)",
              }}
            >
              <IconButton
                onClick={() => setDetailsOpen(false)}
                sx={{ position: "absolute", right: 12, top: 12 }}
              >
                <Close fontSize="small" />
              </IconButton>

              <Typography variant="h5" fontWeight={600} sx={{ mb: 1.5, pr: 6 }}>
                {getOfferTitle(selectedOffer)}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography
                  variant="caption"
                  sx={{ color: "var(--neutral-350)" }}
                >
                  Investor: {getInvestorName(selectedOffer)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "var(--neutral-350)" }}
                >
                  Type:{" "}
                  {selectedOffer.offerType === "direct-harvest"
                    ? "Harvest Offer"
                    : "Commission Offer"}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <CalendarToday
                    sx={{ fontSize: 14, color: "var(--neutral-350)" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--neutral-350)" }}
                  >
                    Expires {formatDate(selectedOffer.expiredDate)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <DialogContent
              sx={{ p: 3, overflowY: "auto", maxHeight: "calc(92vh - 170px)" }}
            >
              {offerDetailsLoading ? (
                <Typography color="text.secondary">
                  Loading latest offer details...
                </Typography>
              ) : (
                <Stack spacing={3}>
                  <Box
                    sx={{
                      bgcolor: "var(--bg-overlay)",
                      border: "1px solid var(--border-medium)",
                      borderRadius: 2,
                      p: 3,
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                      Opportunity Financial Summary
                    </Typography>
                    {selectedOffer.offerType === "direct-harvest" ? (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                          },
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "var(--border-subtle)",
                            borderRadius: 1.5,
                            border: "1px solid var(--border-medium)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--neutral-350)",
                              textTransform: "uppercase",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Crop Type
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {selectedOffer.harvestBaseDetails.cropType}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "var(--border-subtle)",
                            borderRadius: 1.5,
                            border: "1px solid var(--border-medium)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--neutral-350)",
                              textTransform: "uppercase",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Quantity
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {selectedOffer.harvestBaseDetails.requiredQuantity}{" "}
                            {selectedOffer.harvestBaseDetails.quantityUnit}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "var(--border-subtle)",
                            borderRadius: 1.5,
                            border: "1px solid var(--border-medium)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--neutral-350)",
                              textTransform: "uppercase",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Delivery Location
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {selectedOffer.harvestBaseDetails.deliveryLocation}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "var(--border-subtle)",
                            borderRadius: 1.5,
                            border: "1px solid var(--border-medium)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--neutral-350)",
                              textTransform: "uppercase",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Preferred Regions
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {selectedOffer.harvestBaseDetails.preferredRegion
                              ?.slice(0, 2)
                              .join(", ") || "Not specified"}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                          },
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "var(--border-subtle)",
                            borderRadius: 1.5,
                            border: "1px solid var(--border-medium)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--neutral-350)",
                              textTransform: "uppercase",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Min Investment
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {formatCurrency(
                              selectedOffer.commissionDetails.minimumInvestment,
                            )}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "var(--border-subtle)",
                            borderRadius: 1.5,
                            border: "1px solid var(--border-medium)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--neutral-350)",
                              textTransform: "uppercase",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Max Investment
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {formatCurrency(
                              selectedOffer.commissionDetails.maximumInvestment,
                            )}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "var(--border-subtle)",
                            borderRadius: 1.5,
                            border: "1px solid var(--border-medium)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--neutral-350)",
                              textTransform: "uppercase",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Commission Rate
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {selectedOffer.commissionDetails.commissionRate}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "var(--border-subtle)",
                            borderRadius: 1.5,
                            border: "1px solid var(--border-medium)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--neutral-350)",
                              textTransform: "uppercase",
                              display: "block",
                              mb: 0.5,
                            }}
                          >
                            Expected ROI
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {selectedOffer.expectedROI}%
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      bgcolor: "var(--bg-overlay)",
                      border: "1px solid var(--border-medium)",
                      borderRadius: 2,
                      p: 2.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mb: 1.5 }}
                    >
                      Offer Description
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {selectedOffer.description}
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />

                    {selectedOffer.offerType === "direct-harvest" ? (
                      <Stack spacing={0.8}>
                        <Typography variant="body2">
                          Project:{" "}
                          {selectedOffer.harvestBaseDetails.projectTitle}
                        </Typography>
                        <Typography variant="body2">
                          Crop: {selectedOffer.harvestBaseDetails.cropType}
                          {selectedOffer.harvestBaseDetails.cropVariety
                            ? ` (${selectedOffer.harvestBaseDetails.cropVariety})`
                            : ""}
                        </Typography>
                        <Typography variant="body2">
                          Regions:{" "}
                          {selectedOffer.harvestBaseDetails.preferredRegion?.join(
                            ", ",
                          ) || "Not specified"}
                        </Typography>
                        <Typography variant="body2">
                          Company:{" "}
                          {selectedOffer.harvestBaseDetails.companyName ||
                            "Not specified"}
                        </Typography>
                      </Stack>
                    ) : (
                      <Stack spacing={0.8}>
                        <Typography variant="body2">
                          Title:{" "}
                          {selectedOffer.commissionDetails.sponsorshipTitle}
                        </Typography>
                        <Typography variant="body2">
                          Farming Method:{" "}
                          {selectedOffer.commissionDetails
                            .preferredFarmingMethod || "Any"}
                        </Typography>
                        <Typography variant="body2">
                          Crop Types:{" "}
                          {selectedOffer.commissionDetails.cropTypes.join(
                            ", ",
                          ) || "Not specified"}
                        </Typography>
                        <Typography variant="body2">
                          Support Types:{" "}
                          {selectedOffer.commissionDetails.supportType.join(
                            ", ",
                          ) || "Not specified"}
                        </Typography>
                        <Typography variant="body2">
                          Regions:{" "}
                          {selectedOffer.commissionDetails.preferredRegions.join(
                            ", ",
                          ) || "Not specified"}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </Stack>
              )}
            </DialogContent>

            <Box
              sx={{
                p: 2.5,
                borderTop: "1px solid var(--border-medium)",
                bgcolor: "var(--border-subtle)",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setDetailsOpen(false)}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Close
              </Button>
            </Box>
          </>
        )}
      </Dialog>

      <Dialog
        open={actionDialogOpen}
        onClose={handleActionDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {actionLabel} ·{" "}
          {selectedOffer ? getOfferTitle(selectedOffer) : "Offer"}
        </DialogTitle>
        <DialogContent>
          {offerDetailsLoading ? (
            <Typography color="text.secondary">
              Loading latest offer details...
            </Typography>
          ) : (
            <Stack spacing={2} sx={{ py: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Fill cost breakdown and milestone details for this investor
                offer.
              </Typography>

              {selectedOffer?.offerType === "direct-harvest" ? (
                <Stack spacing={3}>
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: 3,
                      p: 2,
                      border: "1px solid #2a2a2a",
                      bgcolor: "#0f0f10",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1.5 }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Cost Breakdown
                      </Typography>
                      <Button
                        startIcon={<Add />}
                        onClick={addCostRow}
                        size="small"
                        variant="contained"
                        sx={{ textTransform: "none" }}
                      >
                        Add Row
                      </Button>
                    </Stack>

                    <Stack spacing={1.25}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 0.6fr auto",
                          },
                          gap: 1,
                          alignItems: "center",
                          px: 1,
                          py: 0.75,
                          bgcolor: "#1c1c1e",
                          borderRadius: 0,
                          border: "1px solid #2e2e2e",
                          color: "#e6e6e6",
                          fontWeight: 700,
                        }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>
                          Purpose
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>Cost</Typography>
                        <Box />
                      </Box>

                      {editableCostRows.map((row, index) => (
                        <Box
                          key={row.id}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "1fr 0.6fr auto",
                            },
                            gap: 1,
                            alignItems: "center",
                            px: 1,
                            py: 0.85,
                            bgcolor: index % 2 === 0 ? "#131313" : "#1a1a1d",
                            color: "#f5f5f5",
                            borderRadius: 0,
                            border: "1px solid #2e2e2e",
                          }}
                        >
                          <TextField
                            size="small"
                            placeholder="Purpose"
                            value={row.category}
                            onChange={(event) =>
                              updateCostRow(
                                row.id,
                                "category",
                                event.target.value,
                              )
                            }
                            fullWidth
                          />
                          <TextField
                            size="small"
                            placeholder="Cost"
                            type="number"
                            value={row.estimatedCost}
                            onChange={(event) =>
                              updateCostRow(
                                row.id,
                                "estimatedCost",
                                event.target.value,
                              )
                            }
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  LKR
                                </InputAdornment>
                              ),
                            }}
                          />
                          <IconButton onClick={() => removeCostRow(row.id)}>
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                          alignItems: "center",
                          mt: 0.5,
                          px: 1,
                          py: 0.75,
                          borderRadius: 0,
                          bgcolor: "#1c1c1e",
                          border: "1px solid #2e2e2e",
                          color: "#e6e6e6",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: 700, color: "text.secondary" }}
                        >
                          Total
                        </Typography>
                        <Typography sx={{ fontWeight: 800 }}>
                          {formatCurrency(
                            editableCostRows.reduce(
                              (sum, row) =>
                                sum + (Number(row.estimatedCost) || 0),
                              0,
                            ),
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: 3,
                      p: 2,
                      border: "1px solid #2a2a2a",
                      bgcolor: "#0f0f10",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 1.5 }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Milestone Breakdown
                      </Typography>
                      <Button
                        startIcon={<Add />}
                        onClick={addMilestoneRow}
                        size="small"
                        variant="contained"
                        sx={{ textTransform: "none" }}
                      >
                        Add Row
                      </Button>
                    </Stack>

                    <Stack spacing={1.25}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 0.7fr 0.7fr 0.7fr 0.6fr auto",
                          },
                          gap: 1,
                          alignItems: "center",
                          px: 1,
                          py: 0.75,
                          bgcolor: "#1c1c1e",
                          borderRadius: 0,
                          border: "1px solid #2e2e2e",
                          color: "#e6e6e6",
                          fontWeight: 700,
                        }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>
                          Milestone
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>From</Typography>
                        <Typography sx={{ fontWeight: 700 }}>To</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          Payment Due
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>Budget</Typography>
                        <Box />
                      </Box>

                      {editableMilestoneRows.map((row, index) => (
                        <Box
                          key={row.id}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              md: "1fr 0.7fr 0.7fr 0.7fr 0.6fr auto",
                            },
                            gap: 1,
                            alignItems: "center",
                            px: 1,
                            py: 0.85,
                            bgcolor: index % 2 === 0 ? "#131313" : "#1a1a1d",
                            color: "#f5f5f5",
                            borderRadius: 0,
                            border: "1px solid #2e2e2e",
                          }}
                        >
                          <TextField
                            size="small"
                            placeholder="Milestone name"
                            value={row.milestone}
                            onChange={(event) =>
                              updateMilestoneRow(
                                row.id,
                                "milestone",
                                event.target.value,
                              )
                            }
                            fullWidth
                          />
                          <TextField
                            size="small"
                            type="date"
                            value={row.fromDate}
                            onChange={(event) =>
                              updateMilestoneRow(
                                row.id,
                                "fromDate",
                                event.target.value,
                              )
                            }
                            fullWidth
                          />
                          <TextField
                            size="small"
                            type="date"
                            value={row.toDate}
                            onChange={(event) =>
                              updateMilestoneRow(
                                row.id,
                                "toDate",
                                event.target.value,
                              )
                            }
                            fullWidth
                          />
                          <TextField
                            size="small"
                            type="date"
                            value={row.paymentDueDate}
                            onChange={(event) =>
                              updateMilestoneRow(
                                row.id,
                                "paymentDueDate",
                                event.target.value,
                              )
                            }
                            fullWidth
                          />
                          <TextField
                            size="small"
                            placeholder="Budget"
                            type="number"
                            value={row.budget}
                            onChange={(event) =>
                              updateMilestoneRow(
                                row.id,
                                "budget",
                                event.target.value,
                              )
                            }
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  LKR
                                </InputAdornment>
                              ),
                            }}
                          />
                          <IconButton
                            onClick={() => removeMilestoneRow(row.id)}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                          alignItems: "center",
                          mt: 0.5,
                          px: 1,
                          py: 0.75,
                          borderRadius: 0,
                          bgcolor: "#1c1c1e",
                          border: "1px solid #2e2e2e",
                          color: "#e6e6e6",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: 700, color: "text.secondary" }}
                        >
                          Total Budget
                        </Typography>
                        <Typography sx={{ fontWeight: 800 }}>
                          {formatCurrency(
                            editableMilestoneRows.reduce(
                              (sum, row) => sum + (Number(row.budget) || 0),
                              0,
                            ),
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              ) : (
                <Stack spacing={1.25}>
                  {selectedOffer?.offerType === "sponsorship" && (
                    <Box
                      sx={{
                        border: "1px solid var(--border-medium)",
                        borderRadius: 1.5,
                        p: 1.5,
                        bgcolor: "var(--bg-overlay)",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Commission Offer Summary
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedOffer.commissionDetails.sponsorshipTitle} ·
                        Commission{" "}
                        {selectedOffer.commissionDetails.commissionRate}% ·
                        Range{" "}
                        {formatCurrency(
                          selectedOffer.commissionDetails.minimumInvestment,
                        )}{" "}
                        -{" "}
                        {formatCurrency(
                          selectedOffer.commissionDetails.maximumInvestment,
                        )}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleActionDialogClose}
            disabled={submittingRequest}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleActionDialogConfirm}
            disabled={submittingRequest}
            sx={{
              textTransform: "none",
              bgcolor: "var(--color-success)",
              color: "var(--text-primary)",
            }}
          >
            {submittingRequest ? "Sending..." : actionLabel}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={connectDialogOpen}
        onClose={handleConnectDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedOffer
            ? `Connect · ${getInvestorName(selectedOffer)}`
            : "Connect"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select one of your harvest-based projects.
          </Typography>

          {harvestProjectsLoading ? (
            <Typography color="text.secondary">
              Loading your harvest projects...
            </Typography>
          ) : farmerHarvestProjects.length === 0 ? (
            <Typography color="text.secondary">
              No active harvest projects found. Create a harvest project first.
            </Typography>
          ) : (
            <Stack spacing={1.25}>
              {farmerHarvestProjects.map((project) => (
                <Box
                  key={project._id}
                  onClick={() => setSelectedProjectId(project._id)}
                  sx={{
                    border: "1px solid",
                    borderColor:
                      selectedProjectId === project._id
                        ? "var(--color-lime-border)"
                        : "var(--surface-light)",
                    bgcolor:
                      selectedProjectId === project._id
                        ? "var(--color-lime-muted)"
                        : "var(--bg-subtle)",
                    borderRadius: 2,
                    p: 1.5,
                    cursor: "pointer",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Radio
                      checked={selectedProjectId === project._id}
                      icon={<RadioButtonUnchecked />}
                      checkedIcon={<RadioButtonChecked />}
                      sx={{
                        color: "var(--surface-light)",
                        "&.Mui-checked": { color: "var(--color-lime)" },
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {project.projectName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {project.cropType} · Qty:{" "}
                        {project.harvestBasedDetails?.expectedHarvest ?? "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Budget:{" "}
                        {formatCurrency(project.totalInvestmentRequired)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleConnectDialogClose}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConnectConfirm}
            disabled={!selectedProjectId}
            sx={{
              textTransform: "none",
              bgcolor: "var(--color-success)",
              color: "var(--text-primary)",
            }}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        duration={4500}
        onClose={closeNotification}
      />
    </>
  );
};

export default FarmerOpportunitiesPage;
