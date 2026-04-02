import type {
  DirectHarvestOfferAPI,
  InvestorOfferAPI,
  SponsorshipOfferAPI,
} from "@/types/investor.types";
import {
  Agriculture,
  CalendarToday,
  Delete,
  Edit,
  Groups,
  LocationOn,
  MonetizationOn,
  Percent,
  ScaleOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import coverImagesData from "../../data/json/coverImages.json";

const coverImageMap = Object.fromEntries(
  (coverImagesData as { id: string; url: string }[]).map((img) => [
    img.id,
    img.url,
  ]),
);

const resolveBgUrl = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  if (value.startsWith("http")) return value;
  return coverImageMap[value];
};

interface InvestorCreatedOfferCardProps {
  offer: InvestorOfferAPI;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const isHarvestOffer = (
  offer: InvestorOfferAPI,
): offer is DirectHarvestOfferAPI => offer.offerType === "direct-harvest";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const InvestorCreatedOfferCard = ({
  offer,
  onEdit,
  onDelete,
}: InvestorCreatedOfferCardProps) => {
  const isHarvest = isHarvestOffer(offer);
  const harvest = isHarvest ? (offer as DirectHarvestOfferAPI) : null;
  const sponsorship = !isHarvest ? (offer as SponsorshipOfferAPI) : null;

  const hd = harvest?.harvestBaseDetails;
  const cd = sponsorship?.commissionDetails;

  const title = hd ? hd.projectTitle : (cd?.sponsorshipTitle ?? "");
  const deadline = offer.expiredDate;
  const regions = hd
    ? (hd.preferredRegion ?? [])
    : (cd?.preferredRegions ?? []);

  const bgUrl = resolveBgUrl(offer.backgroundImage);

  const formatPartyLabel = (
    name?: string,
    id?: string,
    fallback: string = "Not assigned",
  ) => {
    if (name) return name;
    if (id) return `ID: ${id}`;
    return fallback;
  };

  const resolvedFarmerName = offer.farmer?.fullName ?? offer.farmerName;
  const resolvedFarmerId = offer.farmer?._id ?? offer.farmerId;
  const farmerLabel = formatPartyLabel(
    resolvedFarmerName,
    resolvedFarmerId,
    "Farmer not assigned",
  );

  const resolvedLandownerName =
    offer.landOwnerName ?? offer.landowner?.fullName;
  const landOwnerLabel = resolvedLandownerName ?? "Landowner not assigned";

  const landProjectName =
    offer.landownerProject?.title ?? offer.landownerProject?.name;

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 160,
          background: bgUrl
            ? `url(${bgUrl}) center/cover`
            : "linear-gradient(135deg, var(--color-olive) 0%, var(--color-olive-light) 100%)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
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
              label={isHarvest ? "Harvest Offer" : "Sponsorship"}
              size="small"
              sx={{
                background: isHarvest
                  ? "rgba(133, 164, 70,0.85)"
                  : "rgba(33,150,243,0.85)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.68rem",
                letterSpacing: 0.3,
                backdropFilter: "blur(10px)",
              }}
            />
            <Chip
              label="Awaiting Farmers"
              size="small"
              sx={{
                background: "rgba(255,152,0,0.85)",
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
                background: "var(--surface-light)",
                backdropFilter: "blur(10px)",
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}
            >
              {offer.cropIcon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  textShadow: "0 2px 4px var(--overlay-sm)",
                  fontSize: "1.05rem",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "var(--text-on-dark)", fontSize: "0.75rem" }}
              >
                {isHarvest ? hd?.cropType : (cd?.cropTypes ?? []).join(", ")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Divider sx={{ mb: 1.5 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            mb: 1.5,
          }}
        >
          {isHarvest ? (
            <>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <MonetizationOn
                  sx={{ fontSize: 14, color: "success.main", mt: 0.2 }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Total Budget
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {formatCurrency(hd?.totalBudget ?? 0)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <ScaleOutlined
                  sx={{ fontSize: 14, color: "primary.main", mt: 0.2 }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Quantity Needed
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {hd?.requiredQuantity} {hd?.quantityUnit}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <MonetizationOn
                  sx={{ fontSize: 14, color: "warning.main", mt: 0.2 }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Price / Unit
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {formatCurrency(hd?.pricePerUnit ?? 0)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <Percent sx={{ fontSize: 14, color: "info.main", mt: 0.2 }} />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Expected ROI
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {offer.expectedROI}%
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <MonetizationOn
                  sx={{ fontSize: 14, color: "success.main", mt: 0.2 }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Investment Range
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {formatCurrency(cd?.minimumInvestment ?? 0)} –{" "}
                    {formatCurrency(cd?.maximumInvestment ?? 0)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <Percent sx={{ fontSize: 14, color: "info.main", mt: 0.2 }} />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Commission Rate
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {cd?.commissionRate}%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <MonetizationOn
                  sx={{ fontSize: 14, color: "warning.main", mt: 0.2 }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Expected ROI
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {offer.expectedROI}%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
                <Agriculture
                  sx={{ fontSize: 14, color: "primary.main", mt: 0.2 }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Method
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, textTransform: "capitalize" }}
                  >
                    {cd?.preferredFarmingMethod ?? "Any"}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>

        <Divider sx={{ mb: 1.5 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75 }}>
            <Groups sx={{ fontSize: 14, color: "text.secondary", mt: 0.25 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Farmer
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {farmerLabel}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, mt: 0.25 }}
              >
                Landowner
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {landOwnerLabel}
              </Typography>
              {landProjectName && (
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {landProjectName}
                </Typography>
              )}
            </Box>
          </Box>
          {deadline && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                Due {formatDate(deadline)}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75 }}>
          {regions.length > 0 && (
            <>
              <LocationOn sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {regions.slice(0, 3).join(", ")}
                {regions.length > 3 && ` +${regions.length - 3} more`}
              </Typography>
            </>
          )}
          {regions.length === 0 && <Box sx={{ flex: 1 }} />}
          {onEdit && (
            <Tooltip title="Edit Offer">
              <IconButton
                size="small"
                onClick={() => onEdit(offer._id)}
                sx={{
                  p: 0.5,
                  color: "primary.main",
                  "&:hover": {
                    color: "primary.main",
                    background: "rgba(133,164,70,0.12)",
                  },
                }}
              >
                <Edit sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete Offer">
              <IconButton
                size="small"
                onClick={() => onDelete(offer._id)}
                sx={{
                  p: 0.5,
                  color: "error.main",
                  "&:hover": {
                    color: "error.main",
                    background: "rgba(211,47,47,0.12)",
                  },
                }}
              >
                <Delete sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvestorCreatedOfferCard;
