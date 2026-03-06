import { Add, Close, FilterAlt, RestartAlt, Sort } from "@mui/icons-material";
import React from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import type {
  FilterColKey,
  SortConfig,
} from "../hooks/useTableFilter";
import { COLUMN_DEFS } from "../hooks/useTableFilter";

const FILTERABLE_COLS = COLUMN_DEFS.filter(
  (c): c is { label: string; key: FilterColKey; align?: "left" | "center" | "right" } =>
    c.key !== null,
);

const ENUM_OPTIONS: Partial<Record<FilterColKey, { label: string; value: string }[]>> = {
  role: [
    { label: "Farmer",    value: "farmer" },
    { label: "Investor",  value: "investor" },
    { label: "Landowner", value: "landowner" },
    { label: "Admin",     value: "superadmin" },
  ],
  status: [
    { label: "Pending",   value: "Pending" },
    { label: "Active",    value: "Active" },
    { label: "Inactive",  value: "Inactive" },
    { label: "Suspended", value: "Suspended" },
  ],
};

interface FilterPaneProps {
  columnFilters: Partial<Record<FilterColKey, string>>;
  sortConfig: SortConfig | null;
  activeFilterCount: number;
  onSetFilter: (col: FilterColKey, value: string) => void;
  onClearFilter: (col: FilterColKey) => void;
  onClearSort: () => void;
  onResetAll: () => void;
  onClose: () => void;
  accentColor?: string;
  borderColor?: string;
}

const COL_LABEL: Record<FilterColKey, string> = {
  user: "User (Name / Email)",
  role: "Role",
  status: "Status",
  nic: "NIC",
  district: "District",
  joined: "Joined Date",
};

const FilterPane = ({
  columnFilters,
  sortConfig,
  activeFilterCount,
  onSetFilter,
  onClearFilter,
  onClearSort,
  onResetAll,
  onClose,
  accentColor = "var(--color-olive)",
  borderColor = "var(--color-olive-muted-strong)",
}: FilterPaneProps) => {
  const activeKeys = (
    Object.keys(columnFilters) as FilterColKey[]
  ).filter((k) => columnFilters[k] !== undefined);

  const availableKeys = FILTERABLE_COLS.filter(
    (c) => !activeKeys.includes(c.key),
  );

  const [addColKey, setAddColKey] = React.useState<FilterColKey | "">("");

  const handleAddFilter = (col: FilterColKey) => {
    onSetFilter(col, "");
    setAddColKey("");
  };

  return (
    <Box
      sx={{
        width: 248,
        minWidth: 248,
        borderRight: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        bgcolor: "var(--bg-overlay)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterAlt sx={{ fontSize: 16, color: accentColor }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.82rem" }}>
            Views
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              label={activeFilterCount}
              size="small"
              sx={{
                height: 16,
                fontSize: "0.65rem",
                fontWeight: 700,
                bgcolor: `${accentColor}22`,
                color: accentColor,
              }}
            />
          )}
        </Box>
        <Tooltip title="Close filter pane">
          <IconButton size="small" onClick={onClose} sx={{ p: 0.4 }}>
            <Close sx={{ fontSize: 15, color: "var(--text-secondary)" }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: accentColor,
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={onResetAll}
        >
          *All
        </Typography>
      </Box>

      <Divider sx={{ borderColor: borderColor }} />

      {sortConfig && (
        <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Sort sx={{ fontSize: 14, color: "var(--text-secondary)" }} />
          <Typography variant="caption" sx={{ flex: 1, color: "var(--text-secondary)" }}>
            Sorted by{" "}
            <strong style={{ color: "white" }}>
              {COL_LABEL[sortConfig.col]}
            </strong>{" "}
            ({sortConfig.dir === "asc" ? "A→Z" : "Z→A"})
          </Typography>
          <Tooltip title="Clear sort">
            <IconButton size="small" onClick={onClearSort} sx={{ p: 0.25 }}>
              <Close sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.72rem", letterSpacing: 0.5 }}
        >
          Filter list by:
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 1 }}>
        {activeKeys.length === 0 && !sortConfig && (
          <Typography
            variant="caption"
            sx={{ color: "var(--text-secondary)", display: "block", mt: 1 }}
          >
            No filters applied. Use column headers or add a filter below.
          </Typography>
        )}

        {activeKeys.map((col) => (
          <Box key={col} sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.4,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Close
                  sx={{ fontSize: 11, cursor: "pointer", color: "var(--text-secondary)" }}
                  onClick={() => onClearFilter(col)}
                />
                {COL_LABEL[col]}
              </Typography>
            </Box>

            {ENUM_OPTIONS[col] ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {ENUM_OPTIONS[col]!.map((opt) => {
                  const isActive = (columnFilters[col] ?? "").toLowerCase() === opt.value.toLowerCase();
                  return (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      size="small"
                      onClick={() =>
                        onSetFilter(col, isActive ? "" : opt.value)
                      }
                      sx={{
                        fontSize: "0.73rem",
                        fontWeight: 600,
                        height: 24,
                        cursor: "pointer",
                        bgcolor: isActive ? accentColor : "var(--bg-card)",
                        color: isActive ? "#000" : "var(--text-secondary)",
                        border: `1px solid ${isActive ? accentColor : borderColor}`,
                        borderRadius: 1.5,
                        "&:hover": {
                          bgcolor: isActive ? accentColor : `${accentColor}22`,
                          color: isActive ? "#000" : accentColor,
                          borderColor: accentColor,
                        },
                        transition: "all 0.15s ease",
                      }}
                    />
                  );
                })}
              </Box>
            ) : (
              <InputBase
                fullWidth
                value={columnFilters[col] ?? ""}
                onChange={(e) => onSetFilter(col, e.target.value)}
                placeholder={`Filter ${COL_LABEL[col]}…`}
                sx={{
                  fontSize: "0.82rem",
                  color: "inherit",
                  bgcolor: "var(--bg-card)",
                  border: `1px solid ${borderColor}`,
                  borderRadius: 1.5,
                  px: 1.25,
                  py: 0.5,
                  "&.Mui-focused": { borderColor: accentColor },
                  "& input::placeholder": {
                    color: "var(--text-secondary)",
                    opacity: 0.7,
                    fontSize: "0.78rem",
                  },
                }}
              />
            )}
          </Box>
        ))}

        {availableKeys.length > 0 && (
          <Box sx={{ mt: 1.5 }}>
            <Select
              value={addColKey}
              onChange={(e) => {
                const v = e.target.value as FilterColKey;
                if (v) handleAddFilter(v);
              }}
              displayEmpty
              size="small"
              renderValue={(v) =>
                v ? (
                  COL_LABEL[v as FilterColKey]
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Add sx={{ fontSize: 14 }} />
                    <span>Filter…</span>
                  </Box>
                )
              }
              sx={{
                width: "100%",
                fontSize: "0.8rem",
                color: accentColor,
                bgcolor: "transparent",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: `${accentColor}55`,
                  borderStyle: "dashed",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: accentColor,
                },
                ".MuiSvgIcon-root": { color: accentColor },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "var(--bg-elevated)",
                    border: `1px solid ${borderColor}`,
                    borderRadius: 2,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.55)",
                  },
                },
              }}
            >
              {availableKeys.map((c) => (
                <MenuItem
                  key={c.key}
                  value={c.key}
                  sx={{
                    fontSize: "0.82rem",
                    "&:hover": { bgcolor: "var(--color-olive-muted)" },
                  }}
                >
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: borderColor }} />

      <Box sx={{ px: 2, py: 1.25 }}>
        <Typography
          variant="caption"
          sx={{
            color:
              activeFilterCount > 0 || sortConfig
                ? "var(--color-error)"
                : "var(--text-secondary)",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.78rem",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            opacity: activeFilterCount > 0 || sortConfig ? 1 : 0.4,
          }}
          onClick={onResetAll}
        >
          <RestartAlt sx={{ fontSize: 14 }} />
          Reset filters
        </Typography>
      </Box>
    </Box>
  );
};

export default FilterPane;
