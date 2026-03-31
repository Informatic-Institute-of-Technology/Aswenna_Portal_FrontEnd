import type {
  DirectHarvestOfferAPI,
  InvestorOfferAPI,
  SponsorshipOfferAPI,
} from "@/types/investor.types";
import {
  Agriculture,
  CalendarToday,
  Groups,
  LocationOn,
  MonetizationOn,
  Percent,
  ScaleOutlined,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import coverImagesData from "../../data/json/coverImages.json";

interface FarmerOpportunityOfferCardProps {
  offer: InvestorOfferAPI;
  actionLabel: string;
  onView: (offer: InvestorOfferAPI) => void;
  onAction: (offer: InvestorOfferAPI) => void;
}

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

const FarmerOpportunityOfferCard = ({
  offer,
  actionLabel,
  onView,
  onAction,
}: FarmerOpportunityOfferCardProps) => {
  const isHarvest = isHarvestOffer(offer);
  const harvest = isHarvest ? (offer as DirectHarvestOfferAPI) : null;
  const sponsorship = !isHarvest ? (offer as SponsorshipOfferAPI) : null;

  const hd = harvest?.harvestBaseDetails;
  const cd = sponsorship?.commissionDetails;

  const cropTypes = Array.isArray(cd?.cropTypes) ? cd.cropTypes : [];
  const supportTypes = Array.isArray(cd?.supportType) ? cd.supportType : [];
  const regions = isHarvest
    ? Array.isArray(hd?.preferredRegion)
      ? hd.preferredRegion
      : []
    : Array.isArray(cd?.preferredRegions)
      ? cd.preferredRegions
      : [];

  const title = isHarvest
    ? (hd?.projectTitle ?? "Untitled")
    : (cd?.sponsorshipTitle ?? "Untitled");
  const bgUrl = resolveBgUrl(offer.backgroundImage);

  const formatPartyLabel = (
    name?: string,
    id?: string,
    fallback: string = "Not assigned",
  ) => {
    if (name && id) return `${name} (${id})`;
    if (name) return name;
    if (id) return `ID: ${id}`;
    return fallback;
  };

  const farmerLabel = formatPartyLabel(
    offer.farmerName,
    offer.farmerId,
    "Farmer not assigned",
  );
  const landOwnerLabel = formatPartyLabel(
    offer.landOwnerName,
    offer.landOwnerId,
    "Landowner not assigned",
  );

  const stats: Array<{ label: string; value: string; icon: ReactNode }> =
    isHarvest
      ? [
          {
            label: "Quantity Needed",
            value:
              `${hd?.requiredQuantity ?? 0} ${hd?.quantityUnit ?? ""}`.trim(),
            icon: (
              <ScaleOutlined
                sx={{ fontSize: 14, color: "primary.main", mt: 0.2 }}
              />
            ),
          },
          ...(hd?.totalBudget && hd.totalBudget > 0
            ? [
                {
                  label: "Total Budget",
                  value: formatCurrency(hd.totalBudget),
                  icon: (
                    <MonetizationOn
                      sx={{ fontSize: 14, color: "success.main", mt: 0.2 }}
                    />
                  ),
                },
              ]
            : []),
          ...(hd?.pricePerUnit && hd.pricePerUnit > 0
            ? [
                {
                  label: "Price / Unit",
                  value: formatCurrency(hd.pricePerUnit),
                  icon: (
                    <MonetizationOn
                      sx={{ fontSize: 14, color: "warning.main", mt: 0.2 }}
                    />
                  ),
                },
              ]
            : []),
          ...(offer.expectedROI > 0
            ? [
                {
                  label: "Expected ROI",
                  value: `${offer.expectedROI}%`,
                  icon: (
                    <Percent
                      sx={{ fontSize: 14, color: "info.main", mt: 0.2 }}
                    />
                  ),
                },
              ]
            : []),
          ...(hd?.deliveryLocation
            ? [
                {
                  label: "Delivery",
                  value: hd.deliveryLocation,
                  icon: (
                    <LocationOn
                      sx={{ fontSize: 14, color: "error.main", mt: 0.2 }}
                    />
                  ),
                },
              ]
            : []),
        ]
      : [
          ...((cd?.minimumInvestment ?? 0) > 0 ||
          (cd?.maximumInvestment ?? 0) > 0
            ? [
                {
                  label: "Investment Range",
                  value: `${formatCurrency(cd?.minimumInvestment ?? 0)} – ${formatCurrency(cd?.maximumInvestment ?? 0)}`,
                  icon: (
                    <MonetizationOn
                      sx={{ fontSize: 14, color: "success.main", mt: 0.2 }}
                    />
                  ),
                },
              ]
            : []),
          ...((cd?.commissionRate ?? 0) > 0
            ? [
                {
                  label: "Commission Rate",
                  value: `${cd?.commissionRate ?? 0}%`,
                  icon: (
                    <Percent
                      sx={{ fontSize: 14, color: "info.main", mt: 0.2 }}
                    />
                  ),
                },
              ]
            : []),
          ...(offer.expectedROI > 0
            ? [
                {
                  label: "Expected ROI",
                  value: `${offer.expectedROI}%`,
                  icon: (
                    <MonetizationOn
                      sx={{ fontSize: 14, color: "warning.main", mt: 0.2 }}
                    />
                  ),
                },
              ]
            : []),
          {
            label: "Method",
            value: cd?.preferredFarmingMethod ?? "Any",
            icon: (
              <Agriculture
                sx={{ fontSize: 14, color: "primary.main", mt: 0.2 }}
              />
            ),
          },
          ...(supportTypes.length > 0
            ? [
                {
                  label: "Support",
                  value: supportTypes.join(", "),
                  icon: (
                    <Groups
                      sx={{ fontSize: 14, color: "secondary.main", mt: 0.2 }}
                    />
                  ),
                },
              ]
            : []),
        ];

  const visibleStats = stats.slice(0, 4);

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
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
                  ? "rgba(76,175,80,0.85)"
                  : "rgba(33,150,243,0.85)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.68rem",
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
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                background: "var(--surface-light)",
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
                {isHarvest ? hd?.cropType : cropTypes.join(", ")}
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
          {visibleStats.map((stat, index) => (
            <Box
              key={`${stat.label}-${index}`}
              sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}
            >
              {stat.icon}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform:
                      stat.label === "Method" ? "capitalize" : "none",
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          ))}
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
            </Box>
          </Box>
          {offer.expiredDate && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                Due {formatDate(offer.expiredDate)}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75 }}>
          {regions.length > 0 ? (
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
          ) : (
            <Box sx={{ flex: 1 }} />
          )}
        </Box>

        <Divider sx={{ mt: 1.25, mb: 1.25 }} />
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => onView(offer)}
            sx={{
              border: "1px solid var(--surface-light)",
              borderRadius: 1.5,
              width: 42,
              height: 42,
              color: "var(--text-primary)",
              "&:hover": {
                borderColor: "var(--text-secondary)",
                bgcolor: "var(--bg-active)",
              },
            }}
          >
            <Visibility sx={{ fontSize: 18 }} />
          </IconButton>

          <Button
            fullWidth
            variant="contained"
            onClick={() => onAction(offer)}
            sx={{
              minHeight: 42,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 800,
              letterSpacing: 0.2,
              background:
                "linear-gradient(135deg, var(--color-success) 0%, var(--color-lime) 100%)",
              color: "var(--text-primary)",
              boxShadow: "0 8px 18px var(--color-lime-border)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, var(--color-lime-hover) 0%, var(--color-lime) 100%)",
                boxShadow: "0 10px 20px var(--color-lime-border)",
              },
            }}
          >
            {actionLabel}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FarmerOpportunityOfferCard;
