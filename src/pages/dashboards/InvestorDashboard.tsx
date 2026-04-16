import { SriLankaMap } from "@/components";
import { useAuth } from "@/Context/useAuth";
import { getLandownerAds } from "@/services/landownerAds.service";
import { getInvestorOffers } from "@/services/offer.service";
import type { InvestorOfferAPI, OfferStatus } from "@/types/investor.types";
import {
  AccountBalance,
  Agriculture,
  AssignmentTurnedIn,
  AttachMoney,
  Business,
  CheckCircle,
  DoNotDisturb,
  EventBusy,
  HourglassEmpty,
  LocalOffer,
  Refresh,
  TrendingUp,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LandownerAdApiItem } from "../../services/landownerAds.service";

const STATUS_CONFIG: Record<
  OfferStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  open: {
    label: "Open",
    color: "#aed95c",
    bg: "rgba(174,217,92,0.12)",
    icon: <LocalOffer sx={{ fontSize: 32, opacity: 0.35 }} />,
  },
  active: {
    label: "Active",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    icon: <CheckCircle sx={{ fontSize: 32, opacity: 0.35 }} />,
  },
  pending: {
    label: "Pending",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    icon: <HourglassEmpty sx={{ fontSize: 32, opacity: 0.35 }} />,
  },
  expired: {
    label: "Expired",
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    icon: <EventBusy sx={{ fontSize: 32, opacity: 0.35 }} />,
  },
  closed: {
    label: "Closed",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
    icon: <DoNotDisturb sx={{ fontSize: 32, opacity: 0.35 }} />,
  },
};

const OFFER_STATUSES: OfferStatus[] = [
  "open",
  "active",
  "pending",
  "expired",
  "closed",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `LKR ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `LKR ${(n / 1_000).toFixed(0)}K`;
  return `LKR ${n.toLocaleString()}`;
}

interface PieSlice {
  label: string;
  value: number;
  color: string;
}
const PieChart = ({ slices }: { slices: PieSlice[] }) => {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  let cumulative = 0;
  const gradient = slices
    .map((s) => {
      const start = (cumulative / total) * 360;
      cumulative += s.value;
      const end = (cumulative / total) * 360;
      return `${s.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: `conic-gradient(${gradient})`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          flexShrink: 0,
        }}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
        {slices.map((s) => (
          <Box
            key={s.label}
            sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: s.color,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "#94a3b8", fontSize: "0.72rem" }}
            >
              {s.label} ({s.value})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

interface BarData {
  label: string;
  harvest: number;
  sponsorship: number;
}
const BarChart = ({ data }: { data: BarData[] }) => {
  const maxVal =
    Math.max(...data.map((d) => d.harvest + d.sponsorship), 1) * 1.15;
  return (
    <Box sx={{ width: "100%" }}>
      
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: "6px",
          height: 180,
          pb: 0,
        }}
      >
        {data.map((d) => {
          const harvestH = Math.max((d.harvest / maxVal) * 160, d.harvest > 0 ? 4 : 0);
          const sponsorH = Math.max((d.sponsorship / maxVal) * 160, d.sponsorship > 0 ? 4 : 0);
          return (
            <Box
              key={d.label}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "2px",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "3px",
                  height: 160,
                }}
              >
                <Tooltip title={`Direct Harvest: ${d.harvest}`}>
                  <Box
                    sx={{
                      width: 14,
                      height: harvestH,
                      background:
                        "linear-gradient(180deg, #aed95c 0%, #85a446 100%)",
                      borderRadius: "3px 3px 0 0",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                      "&:hover": { opacity: 0.75 },
                    }}
                  />
                </Tooltip>
                <Tooltip title={`Sponsorship: ${d.sponsorship}`}>
                  <Box
                    sx={{
                      width: 14,
                      height: sponsorH,
                      background:
                        "linear-gradient(180deg, #fb923c 0%, #ea580c 100%)",
                      borderRadius: "3px 3px 0 0",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                      "&:hover": { opacity: 0.75 },
                    }}
                  />
                </Tooltip>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.6rem",
                  color: "#71717a",
                  textAlign: "center",
                  mt: 0.5,
                  lineHeight: 1.2,
                }}
              >
                {d.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      
      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          mt: 1.5,
          justifyContent: "center",
        }}
      >
        {[
          { color: "#aed95c", label: "Direct Harvest" },
          { color: "#fb923c", label: "Sponsorship" },
        ].map((l) => (
          <Box
            key={l.label}
            sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: 1,
                background: l.color,
              }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: "0.7rem", color: "#94a3b8" }}
            >
              {l.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const StatusBadge = ({ status }: { status: OfferStatus }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        height: 20,
        fontSize: "0.62rem",
        fontWeight: 800,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
        letterSpacing: 0.4,
      }}
    />
  );
};

const InvestorDashboard = () => {
  const { user } = useAuth();

  const [offers, setOffers] = useState<InvestorOfferAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [landAds, setLandAds] = useState<LandownerAdApiItem[]>([]);
  const [landAdsLoading, setLandAdsLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const res = await getInvestorOffers({ limit: 100 });
      setOffers(res.data ?? []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load offers");
    } finally {
      setLoading(false);
    }

    try {
      setLandAdsLoading(true);
      const adsRes = await getLandownerAds();
      setLandAds(adsRes.data ?? []);
    } catch {
      setLandAds([]);
    } finally {
      setLandAdsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statusCounts = useMemo(() => {
    const counts: Record<OfferStatus, number> = {
      open: 0,
      active: 0,
      pending: 0,
      expired: 0,
      closed: 0,
    };
    offers.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status]++;
    });
    return counts;
  }, [offers]);

  const totalBudget = useMemo(() => {
    return offers.reduce((sum, o) => {
      if (o.offerType === "direct-harvest") {
        return sum + (o.harvestBaseDetails?.totalBudget ?? 0);
      }
      if (o.offerType === "sponsorship") {
        return sum + (o.commissionDetails?.maximumInvestment ?? 0);
      }
      return sum;
    }, 0);
  }, [offers]);

  const avgROI = useMemo(() => {
    if (!offers.length) return 0;
    const sum = offers.reduce((s, o) => s + (o.expectedROI ?? 0), 0);
    return Math.round(sum / offers.length);
  }, [offers]);

  const barData = useMemo((): BarData[] => {
    const now = new Date();
    const months: BarData[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString("default", { month: "short" }),
        harvest: 0,
        sponsorship: 0,
      });
    }
    offers.forEach((o) => {
      const created = new Date(o.createdAt);
      const diff =
        (now.getFullYear() - created.getFullYear()) * 12 +
        now.getMonth() -
        created.getMonth();
      if (diff >= 0 && diff < 6) {
        const idx = 5 - diff;
        if (o.offerType === "direct-harvest") months[idx].harvest++;
        else if (o.offerType === "sponsorship") months[idx].sponsorship++;
      }
    });
    return months;
  }, [offers]);

  const pieSlices = useMemo(
    (): PieSlice[] =>
      OFFER_STATUSES.filter((s) => statusCounts[s] > 0).map((s) => ({
        label: STATUS_CONFIG[s].label,
        value: statusCounts[s],
        color: STATUS_CONFIG[s].color,
      })),
    [statusCounts]
  );

  const provinceDistribution = useMemo(() => {
    const dist: {
      [p: string]: {
        farmers: number;
        investors: number;
        landowners: number;
        total: number;
      };
    } = {};
    offers.forEach((o) => {
      const regions: string[] =
        o.offerType === "direct-harvest"
          ? o.harvestBaseDetails?.preferredRegion ?? []
          : o.offerType === "sponsorship"
          ? o.commissionDetails?.preferredRegions ?? []
          : [];
      regions.forEach((region) => {
        if (!dist[region]) {
          dist[region] = { farmers: 0, investors: 1, landowners: 0, total: 1 };
        } else {
          dist[region].investors++;
          dist[region].total++;
        }
      });
    });
    return dist;
  }, [offers]);

  const recentOffers = useMemo(
    () =>
      [...offers]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [offers]
  );

  const cropBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    offers.forEach((o) => {
      const crops: string[] =
        o.offerType === "direct-harvest"
          ? [o.harvestBaseDetails?.cropType ?? "Unknown"]
          : o.offerType === "sponsorship"
          ? o.commissionDetails?.cropTypes ?? []
          : [];
      crops.forEach((c) => {
        map[c] = (map[c] || 0) + 1;
      });
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [offers]);

  const maxCrop = cropBreakdown[0]?.[1] || 1;

  const profilePic =
    user?.personalInfo?.profilePicture &&
    typeof user.personalInfo.profilePicture === "object"
      ? (user.personalInfo.profilePicture as { url?: string }).url
      : typeof user?.personalInfo?.profilePicture === "string"
      ? user.personalInfo.profilePicture
      : null;

  return (
    <Box sx={{ minHeight: "100vh", background: "#09090B", pb: 6 }}>
      
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          pt: 4,
          pb: 3,
          background:
            "linear-gradient(135deg, rgba(133,164,70,0.08) 0%, rgba(9,9,11,0) 60%)",
          borderBottom: "1px solid #27272A",
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={profilePic ?? undefined}
              sx={{
                width: 56,
                height: 56,
                background:
                  "linear-gradient(135deg, #85a446 0%, #aed95c 100%)",
                fontWeight: 800,
                fontSize: "1.2rem",
                boxShadow: "0 4px 16px rgba(133,164,70,0.4)",
              }}
            >
              {user?.fullName?.[0] ?? "I"}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  color: "#f1f5f9",
                  letterSpacing: -0.5,
                  lineHeight: 1.2,
                }}
              >
                {getGreeting()}, {user?.fullName?.split(" ")[0] ?? "Investor"}!
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#71717a", fontSize: "0.78rem" }}
              >
                {user?.investor?.organizationName && (
                  <>
                    <Business
                      sx={{ fontSize: 13, mr: 0.5, verticalAlign: "middle" }}
                    />
                    {user.investor.organizationName} ·{" "}
                  </>
                )}
                {now.toLocaleDateString("en-LK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                · {now.toLocaleTimeString("en-LK", { hour12: true })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {lastUpdated && (
              <Typography
                variant="caption"
                sx={{ color: "#52525b", fontSize: "0.7rem" }}
              >
                Updated {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
            <Button
              size="small"
              variant="outlined"
              startIcon={
                loading ? <CircularProgress size={14} /> : <Refresh />
              }
              onClick={fetchData}
              disabled={loading}
              sx={{
                borderColor: "#27272A",
                color: "#a1a1aa",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#aed95c",
                  color: "#aed95c",
                  background: "rgba(174,217,92,0.06)",
                },
              }}
            >
              {loading ? "Loading…" : "Refresh"}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress
              sx={{ color: "#aed95c" }}
              size={48}
              thickness={3}
            />
          </Box>
        )}

        {!loading && (
          <>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {[
                {
                  label: "Total Portfolio Value",
                  value: formatCurrency(totalBudget),
                  sub: `${offers.length} total offers`,
                  icon: (
                    <AccountBalance sx={{ fontSize: 28, opacity: 0.7 }} />
                  ),
                  grad: "linear-gradient(135deg, #85a446 0%, #aed95c 100%)",
                  shadow: "rgba(133,164,70,0.35)",
                },
                {
                  label: "Avg. Expected ROI",
                  value: `${avgROI}%`,
                  sub: "across all offers",
                  icon: <TrendingUp sx={{ fontSize: 28, opacity: 0.7 }} />,
                  grad: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
                  shadow: "rgba(14,165,233,0.35)",
                },
                {
                  label: "Active Investments",
                  value: statusCounts.active,
                  sub: `+ ${statusCounts.open} open offers`,
                  icon: <AssignmentTurnedIn sx={{ fontSize: 28, opacity: 0.7 }} />,
                  grad: "linear-gradient(135deg, #34d399 0%, #6ee7b7 100%)",
                  shadow: "rgba(52,211,153,0.35)",
                },
                {
                  label: "Pending Review",
                  value: statusCounts.pending,
                  sub: "awaiting farmer response",
                  icon: <AttachMoney sx={{ fontSize: 28, opacity: 0.7 }} />,
                  grad: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                  shadow: "rgba(245,158,11,0.35)",
                },
              ].map((kpi) => (
                <Grid key={kpi.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Card
                    sx={{
                      background: kpi.grad,
                      borderRadius: 3,
                      boxShadow: `0 8px 32px ${kpi.shadow}`,
                      border: "none",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.8)",
                              fontWeight: 600,
                              fontSize: "0.72rem",
                              textTransform: "uppercase",
                              letterSpacing: 0.8,
                            }}
                          >
                            {kpi.label}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              color: "#fff",
                              fontWeight: 900,
                              mt: 0.5,
                              lineHeight: 1.1,
                            }}
                          >
                            {kpi.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.65)",
                              fontSize: "0.7rem",
                            }}
                          >
                            {kpi.sub}
                          </Typography>
                        </Box>
                        <Box sx={{ color: "rgba(255,255,255,0.55)" }}>
                          {kpi.icon}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {OFFER_STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <Grid key={s} size={{ xs: 6, sm: 4, md: 2.4 }}>
                    <Box
                      sx={{
                        background: "#18181B",
                        borderRadius: 3,
                        border: `1px solid ${cfg.color}25`,
                        p: 2,
                        textAlign: "center",
                        transition: "all 0.25s",
                        cursor: "default",
                        "&:hover": {
                          borderColor: `${cfg.color}60`,
                          background: cfg.bg,
                          transform: "translateY(-3px)",
                          boxShadow: `0 8px 24px ${cfg.color}20`,
                        },
                      }}
                    >
                      <Box sx={{ color: cfg.color, mb: 0.5 }}>{cfg.icon}</Box>
                      <Typography
                        variant="h4"
                        sx={{ color: cfg.color, fontWeight: 900 }}
                      >
                        {statusCounts[s]}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#71717a",
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                        }}
                      >
                        {cfg.label}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    background: "#18181B",
                    borderRadius: 3,
                    border: "1px solid #27272A",
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "#f1f5f9",
                      mb: 0.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    Offers by Month
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#52525b", mb: 2.5, display: "block" }}
                  >
                    Last 6 months activity
                  </Typography>
                  <BarChart data={barData} />
                </Box>
              </Grid>

              
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    background: "#18181B",
                    borderRadius: 3,
                    border: "1px solid #27272A",
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "#f1f5f9",
                      mb: 0.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    Status Distribution
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#52525b", mb: 2.5, display: "block" }}
                  >
                    All {offers.length} offers
                  </Typography>
                  {pieSlices.length > 0 ? (
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PieChart slices={pieSlices} />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#52525b" }}
                      >
                        No offers yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              
              <Grid size={{ xs: 12, md: 3 }}>
                <Box
                  sx={{
                    background: "#18181B",
                    borderRadius: 3,
                    border: "1px solid #27272A",
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "#f1f5f9",
                      mb: 0.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    Top Crops
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#52525b", mb: 2.5, display: "block" }}
                  >
                    By offer count
                  </Typography>
                  {cropBreakdown.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{ color: "#52525b" }}
                    >
                      No data
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {cropBreakdown.map(([crop, count], idx) => {
                        const colors = [
                          "#aed95c",
                          "#34d399",
                          "#fb923c",
                          "#60a5fa",
                          "#c084fc",
                        ];
                        const c = colors[idx % colors.length];
                        return (
                          <Box key={crop}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.75,
                                }}
                              >
                                <Agriculture
                                  sx={{ fontSize: 13, color: c }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#d4d4d8",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {crop}
                                </Typography>
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{ color: c, fontWeight: 800 }}
                              >
                                {count}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                height: 5,
                                borderRadius: 3,
                                background: "#27272A",
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  height: "100%",
                                  width: `${(count / maxCrop) * 100}%`,
                                  background: c,
                                  borderRadius: 3,
                                  transition: "width 0.6s ease",
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              
              <Grid size={{ xs: 12, lg: 7 }}>
                <Box
                  sx={{
                    background: "#18181B",
                    borderRadius: 3,
                    border: "1px solid #27272A",
                    p: 3,
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "#f1f5f9",
                      mb: 0.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    Offer Distribution · Sri Lanka
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#52525b", mb: 2, display: "block" }}
                  >
                    {landAdsLoading
                      ? "Loading map data…"
                      : `${landAds.length} land ads + investor preferred regions`}
                  </Typography>
                  <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <SriLankaMap
                      provinceDistribution={
                        Object.keys(provinceDistribution).length > 0
                          ? provinceDistribution
                          : undefined
                      }
                      landAds={
                        landAds.length > 0 && Object.keys(provinceDistribution).length === 0
                          ? landAds
                          : undefined
                      }
                    />
                  </Box>
                </Box>
              </Grid>

              
              <Grid size={{ xs: 12, lg: 5 }}>
                <Box
                  sx={{
                    background: "#18181B",
                    borderRadius: 3,
                    border: "1px solid #27272A",
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      color: "#f1f5f9",
                      mb: 0.5,
                      fontSize: "0.95rem",
                    }}
                  >
                    Recent Offers
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#52525b", mb: 2.5, display: "block" }}
                  >
                    Latest {recentOffers.length} offers
                  </Typography>

                  {recentOffers.length === 0 ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 6,
                        color: "#52525b",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <LocalOffer sx={{ fontSize: 40, opacity: 0.3 }} />
                      <Typography variant="body2">
                        No offers found
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.25,
                      }}
                    >
                      {recentOffers.map((offer) => {
                        const title =
                          offer.offerType === "direct-harvest"
                            ? offer.harvestBaseDetails?.projectTitle
                            : offer.commissionDetails?.sponsorshipTitle;
                        const budget =
                          offer.offerType === "direct-harvest"
                            ? offer.harvestBaseDetails?.totalBudget
                            : offer.commissionDetails?.maximumInvestment;
                        return (
                          <Box
                            key={offer._id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              p: 1.25,
                              borderRadius: 2,
                              background: "#09090B",
                              border: "1px solid #27272A",
                              transition: "all 0.2s",
                              "&:hover": {
                                borderColor: "#3f3f46",
                                background: "#18181B",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                background:
                                  offer.offerType === "direct-harvest"
                                    ? "rgba(174,217,92,0.15)"
                                    : "rgba(251,146,60,0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {offer.offerType === "direct-harvest" ? (
                                <Agriculture
                                  sx={{
                                    fontSize: 18,
                                    color: "#aed95c",
                                  }}
                                />
                              ) : (
                                <Business
                                  sx={{
                                    fontSize: 18,
                                    color: "#fb923c",
                                  }}
                                />
                              )}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: "#e4e4e7",
                                  fontSize: "0.8rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {title ?? "Untitled Offer"}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#52525b",
                                  fontSize: "0.68rem",
                                }}
                              >
                                {new Date(offer.createdAt).toLocaleDateString(
                                  "en-LK"
                                )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                gap: 0.4,
                                flexShrink: 0,
                              }}
                            >
                              <StatusBadge status={offer.status} />
                              {budget != null && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#a1a1aa",
                                    fontSize: "0.67rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  {formatCurrency(budget)}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            
            <Grid container spacing={3}>
              {[
                {
                  type: "direct-harvest",
                  label: "Direct Harvest Offers",
                  color: "#aed95c",
                  bg: "rgba(174,217,92,0.08)",
                  border: "rgba(174,217,92,0.2)",
                  icon: <Agriculture sx={{ fontSize: 40, color: "#aed95c", opacity: 0.6 }} />,
                  count: offers.filter((o) => o.offerType === "direct-harvest").length,
                },
                {
                  type: "sponsorship",
                  label: "Sponsorship Offers",
                  color: "#fb923c",
                  bg: "rgba(251,146,60,0.08)",
                  border: "rgba(251,146,60,0.2)",
                  icon: <Business sx={{ fontSize: 40, color: "#fb923c", opacity: 0.6 }} />,
                  count: offers.filter((o) => o.offerType === "sponsorship").length,
                },
              ].map((t) => (
                <Grid key={t.type} size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      background: t.bg,
                      border: `1px solid ${t.border}`,
                      borderRadius: 3,
                      p: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                    }}
                  >
                    {t.icon}
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ color: t.color, fontWeight: 900 }}
                      >
                        {t.count}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#71717a",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        {t.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#52525b", fontSize: "0.7rem" }}
                      >
                        {offers.length > 0
                          ? `${Math.round((t.count / offers.length) * 100)}% of portfolio`
                          : "No data"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default InvestorDashboard;
