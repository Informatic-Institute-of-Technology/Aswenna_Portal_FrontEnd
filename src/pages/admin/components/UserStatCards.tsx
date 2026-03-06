import {
  Agriculture,
  Business,
  Landscape,
  Verified,
} from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  badge?: React.ReactNode;
}

export const StatCard = ({
  label,
  value,
  icon,
  iconColor,
  badge,
}: StatCardProps) => (
  <Card
    sx={{
      flex: 1,
      minWidth: 0,
      position: "relative",
      borderRadius: 3,
      bgcolor: "var(--bg-overlay)",
      border: "1px solid var(--surface-light)",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: `0 8px 24px ${iconColor}30`,
      },
    }}
  >
    <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
      {badge && (
        <Box sx={{ position: "absolute", top: 12, right: 12 }}>{badge}</Box>
      )}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: `${iconColor}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1 }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

interface UserStatCardsProps {
  roleStats: {
    farmer: number;
    investor: number;
    landowner: number;
  };
  activeRate: number;
}

const UserStatCards = ({ roleStats, activeRate }: UserStatCardsProps) => (
  <Box sx={{ display: "flex", gap: 2.5, mb: 3, flexWrap: "wrap" }}>
    <StatCard
      label="Farmers"
      value={roleStats.farmer}
      icon={<Agriculture />}
      iconColor="var(--color-brand-primary)"
    />
    <StatCard
      label="Investors"
      value={roleStats.investor}
      icon={<Business />}
      iconColor="var(--color-info-blue)"
    />
    <StatCard
      label="Landowners"
      value={roleStats.landowner}
      icon={<Landscape />}
      iconColor="var(--color-amber)"
    />
    <StatCard
      label="Active Rate"
      value={`${activeRate}%`}
      icon={<Verified />}
      iconColor="var(--color-purple)"
      badge={
        <Chip
          label="Live"
          size="small"
          sx={{
            height: 20,
            fontSize: "0.65rem",
            fontWeight: 700,
            bgcolor: "rgba(168,85,247,0.2)",
            color: "#c084fc",
          }}
        />
      }
    />
  </Box>
);

export default UserStatCards;
