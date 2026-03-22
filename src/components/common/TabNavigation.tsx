import { Box, Chip, Tab, Tabs } from "@mui/material";
import type { ReactNode } from "react";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabNavigationProps {
  activeTab: string;
  tabs: TabItem[];
  onChange: (value: string) => void;
  variant?: "default" | "dark" | "colored";
}

const TabNavigation = ({
  activeTab,
  tabs,
  onChange,
  variant = "dark",
}: TabNavigationProps) => {
  const getTabStyles = (isActive: boolean) => {
    const baseStyles = {
      minHeight: 48,
      textTransform: "none" as const,
      fontSize: "0.95rem",
      fontWeight: 600,
      px: 3,
      py: 1.5,
      borderRadius: 3,
      transition: "all 0.3s ease",
    };

    if (variant === "dark") {
      return {
        ...baseStyles,
        color: isActive ? "var(--text-primary)" : "var(--text-on-dark)",
        background: isActive
          ? "linear-gradient(135deg, var(--bg-subtle) 0%, var(--border-medium) 100%)"
          : "transparent",
        border: isActive
          ? "1px solid var(--surface-light)"
          : "1px solid var(--surface-light)",
        "&:hover": {
          background: isActive
            ? "linear-gradient(135deg, var(--border-medium) 0%, var(--border-medium) 100%)"
            : "var(--surface-muted)",
        },
        "& .MuiTab-iconWrapper": {
          color: isActive ? "var(--text-primary)" : "var(--text-on-dark)",
        },
      };
    }

    return baseStyles;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onChange(newValue)}
        sx={{
          minHeight: "auto",
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .MuiTabs-flexContainer": {
            gap: 2,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="start"
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  color: "var(--text-primary)",
                }}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <Chip
                    label={tab.count}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      bgcolor:
                        activeTab === tab.value
                          ? "var(--overlay-sm)"
                          : "var(--surface-light)",
                      color: "var(--text-primary)",
                      border:
                        activeTab === tab.value
                          ? "none"
                          : "1px solid var(--surface-light)",
                    }}
                  />
                )}
              </Box>
            }
            value={tab.value}
            sx={getTabStyles(activeTab === tab.value)}
          />
        ))}
      </Tabs>
      <Box sx={{ height: 1, bgcolor: "var(--bg-active)", mt: 3 }} />
    </Box>
  );
};

export default TabNavigation;
