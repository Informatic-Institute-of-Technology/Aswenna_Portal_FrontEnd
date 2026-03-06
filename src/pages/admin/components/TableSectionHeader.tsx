import { FilterList, Refresh, Search } from "@mui/icons-material";
import {
  Box,
  Chip,
  InputAdornment,
  InputBase,
  Tooltip,
  Typography,
} from "@mui/material";

interface TableSectionHeaderProps {
  title: string;
  subtitle: string;
  accentGradient: string;
  accentColor: string;
  borderColor: string;
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  filterPaneOpen: boolean;
  filterCount: number;
  onFilterToggle: () => void;
  mt?: number | string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const TableSectionHeader = ({
  title,
  subtitle,
  accentGradient,
  accentColor,
  borderColor,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filterPaneOpen,
  filterCount,
  onFilterToggle,
  mt,
  onRefresh,
  refreshing,
}: TableSectionHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      mb: 1.5,
      ...(mt !== undefined ? { mt } : {}),
    }}
  >
    <Box
      sx={{
        width: 4,
        height: 22,
        borderRadius: 2,
        background: accentGradient,
        flexShrink: 0,
      }}
    />

    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: "1rem" }}
      >
        {title}
      </Typography>
      <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
        {subtitle}
      </Typography>
    </Box>

    {onRefresh && (
      <Tooltip title="Refresh">
        <Box
          onClick={onRefresh}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1.25,
            py: 0.5,
            borderRadius: 1.5,
            cursor: refreshing ? "default" : "pointer",
            border: "1px solid transparent",
            color: accentColor,
            transition: "all 0.15s",
            "&:hover": { bgcolor: `${accentColor}18` },
            mr: 0,
          }}
        >
          <Refresh
            sx={{
              fontSize: 16,
              animation: refreshing ? "spin 0.8s linear infinite" : "none",
              "@keyframes spin": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(360deg)" },
              },
            }}
          />
        </Box>
      </Tooltip>
    )}

    <Tooltip title={filterPaneOpen ? "Close filter pane" : "Open filter pane"}>
      <Box
        onClick={onFilterToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1.25,
          py: 0.5,
          borderRadius: 1.5,
          cursor: "pointer",
          bgcolor: filterPaneOpen ? `${accentColor}18` : "transparent",
          border: "1px solid",
          borderColor: filterPaneOpen ? borderColor : "transparent",
          color: accentColor,
          transition: "all 0.15s",
          "&:hover": { bgcolor: `${accentColor}18` },
          mr: 1,
        }}
      >
        <FilterList sx={{ fontSize: 16 }} />
        {filterCount > 0 && (
          <Chip
            label={filterCount}
            size="small"
            sx={{
              height: 16,
              fontSize: "0.65rem",
              fontWeight: 700,
              bgcolor: accentColor,
              color: "#000",
            }}
          />
        )}
      </Box>
    </Tooltip>

    <InputBase
      placeholder={searchPlaceholder}
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
      startAdornment={
        <InputAdornment position="start">
          <Search sx={{ fontSize: 16, color: accentColor, mr: 0.5 }} />
        </InputAdornment>
      }
      sx={{
        fontSize: "0.82rem",
        color: "inherit",
        bgcolor: `${accentColor}12`,
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
        px: 1.5,
        py: 0.5,
        minWidth: 220,
        "& input::placeholder": { color: accentColor, opacity: 0.6 },
      }}
    />
  </Box>
);

export default TableSectionHeader;
