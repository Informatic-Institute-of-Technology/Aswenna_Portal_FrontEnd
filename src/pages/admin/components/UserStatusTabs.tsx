import { Box, Card, Chip, Tab, Tabs, Typography } from "@mui/material";
import { statusColor } from "../utils/userManagement.utils";

interface StatusCounts {
  all: number;
  pending: number;
  active: number;
  suspended: number;
}

interface UserStatusTabsProps {
  statusTab: number;
  onTabChange: (tab: number) => void;
  statusCounts: StatusCounts;
}

const tabDefs = [
  { label: "All", countKey: "all" as const, color: "" },
  {
    label: "Pending",
    countKey: "pending" as const,
    color: statusColor.Pending,
  },
  { label: "Active", countKey: "active" as const, color: statusColor.Active },
  {
    label: "Suspended",
    countKey: "suspended" as const,
    color: statusColor.Suspended,
  },
];

const UserStatusTabs = ({
  statusTab,
  onTabChange,
  statusCounts,
}: UserStatusTabsProps) => (
  <Card
    sx={{
      borderRadius: 3,
      bgcolor: "var(--bg-overlay)",
      border: "1px solid var(--surface-light)",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        px: 2,
        pt: 1.5,
        pb: 0,
        borderBottom: "1px solid var(--surface-light)",
      }}
    >
      <Tabs
        value={statusTab}
        onChange={(_e, v) => onTabChange(v)}
        sx={{
          "& .MuiTab-root": {
            color: "text.secondary",
            fontSize: "0.85rem",
            minWidth: 0,
            px: 0,
            mr: 3,
            textTransform: "none",
            fontWeight: 500,
            pb: 1.5,
          },
          "& .Mui-selected": { color: "text.primary", fontWeight: 700 },
          "& .MuiTabs-indicator": {
            bgcolor: "primary.main",
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
          minHeight: 44,
        }}
      >
        {tabDefs.map((tab, idx) => (
          <Tab
            key={tab.label}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="inherit">{tab.label}</Typography>
                <Chip
                  label={statusCounts[tab.countKey]}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    bgcolor: tab.color
                      ? `${tab.color}22`
                      : statusTab === idx
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.08)",
                    color: tab.color || "text.secondary",
                  }}
                />
              </Box>
            }
          />
        ))}
      </Tabs>
    </Box>
  </Card>
);

export default UserStatusTabs;
