import {
  ArrowDownward,
  ArrowUpward,
  FilterAlt,
  FilterAltOff,
} from "@mui/icons-material";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import type {
  FilterColKey,
  MenuState,
  SortConfig,
  SortDir,
} from "../hooks/useTableFilter";

interface ColumnFilterMenuProps {
  menuState: MenuState | null;
  sortConfig: SortConfig | null;
  activeFilter: string | undefined;
  onClose: () => void;
  onSort: (col: FilterColKey, dir: SortDir) => void;
  onOpenFilter: (col: FilterColKey) => void;
  onFilterToValue: (col: FilterColKey, value: string) => void;
  onClearFilter: (col: FilterColKey) => void;
}

const ColumnFilterMenu = ({
  menuState,
  sortConfig,
  activeFilter,
  onClose,
  onSort,
  onOpenFilter,
  onFilterToValue,
  onClearFilter,
}: ColumnFilterMenuProps) => {
  if (!menuState) return null;
  const { col, cellValue } = menuState;

  const isAscActive = sortConfig?.col === col && sortConfig.dir === "asc";
  const isDescActive = sortConfig?.col === col && sortConfig.dir === "desc";
  const hasFilter = Boolean(activeFilter);

  const handle = (fn: () => void) => () => {
    fn();
    onClose();
  };

  return (
    <Menu
      anchorEl={menuState.anchor}
      open={Boolean(menuState)}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "var(--bg-elevated)",
            border: "1px solid var(--color-olive-muted-strong)",
            borderRadius: 2,
            minWidth: 200,
            boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
            mt: 0.5,
          },
        },
      }}
      transformOrigin={{ horizontal: "left", vertical: "top" }}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
    >
      <MenuItem
        onClick={handle(() => onSort(col, "asc"))}
        selected={isAscActive}
        sx={{
          fontSize: "0.83rem",
          gap: 0.5,
          color: isAscActive ? "var(--color-brand-primary)" : "inherit",
          "&:hover": { bgcolor: "var(--color-olive-muted)" },
          "&.Mui-selected": { bgcolor: "var(--color-brand-muted)" },
        }}
      >
        <ListItemIcon sx={{ minWidth: 30, color: "inherit" }}>
          <ArrowUpward sx={{ fontSize: 16 }} />
        </ListItemIcon>
        <ListItemText primaryTypographyProps={{ fontSize: "0.83rem" }}>
          Ascending
        </ListItemText>
      </MenuItem>

      <MenuItem
        onClick={handle(() => onSort(col, "desc"))}
        selected={isDescActive}
        sx={{
          fontSize: "0.83rem",
          gap: 0.5,
          color: isDescActive ? "var(--color-brand-primary)" : "inherit",
          "&:hover": { bgcolor: "var(--color-olive-muted)" },
          "&.Mui-selected": { bgcolor: "var(--color-brand-muted)" },
        }}
      >
        <ListItemIcon sx={{ minWidth: 30, color: "inherit" }}>
          <ArrowDownward sx={{ fontSize: 16 }} />
        </ListItemIcon>
        <ListItemText primaryTypographyProps={{ fontSize: "0.83rem" }}>
          Descending
        </ListItemText>
      </MenuItem>

      <Divider
        sx={{ my: 0.5, borderColor: "var(--color-olive-muted-strong)" }}
      />

      <MenuItem
        onClick={handle(() => onOpenFilter(col))}
        sx={{
          fontSize: "0.83rem",
          "&:hover": { bgcolor: "var(--color-olive-muted)" },
        }}
      >
        <ListItemIcon
          sx={{ minWidth: 30, color: "var(--color-brand-primary)" }}
        >
          <FilterAlt sx={{ fontSize: 16 }} />
        </ListItemIcon>
        <ListItemText primaryTypographyProps={{ fontSize: "0.83rem" }}>
          Filter…
        </ListItemText>
      </MenuItem>

      <MenuItem
        disabled={!cellValue}
        onClick={handle(() => {
          if (cellValue) onFilterToValue(col, cellValue);
        })}
        sx={{
          fontSize: "0.83rem",
          "&:hover": { bgcolor: "var(--color-olive-muted)" },
          "&.Mui-disabled": { opacity: 0.38 },
        }}
      >
        <ListItemIcon
          sx={{ minWidth: 30, color: "var(--color-brand-primary)" }}
        >
          <FilterAlt sx={{ fontSize: 16 }} />
        </ListItemIcon>
        <ListItemText primaryTypographyProps={{ fontSize: "0.83rem" }}>
          Filter to this value
        </ListItemText>
      </MenuItem>

      <MenuItem
        disabled={!hasFilter && !(sortConfig?.col === col)}
        onClick={handle(() => onClearFilter(col))}
        sx={{
          fontSize: "0.83rem",
          color: hasFilter ? "var(--color-error)" : "inherit",
          "&:hover": { bgcolor: "var(--color-olive-muted)" },
          "&.Mui-disabled": { opacity: 0.38 },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 30,
            color: hasFilter ? "var(--color-error)" : "text.disabled",
          }}
        >
          <FilterAltOff sx={{ fontSize: 16 }} />
        </ListItemIcon>
        <ListItemText primaryTypographyProps={{ fontSize: "0.83rem" }}>
          Clear filter
        </ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ColumnFilterMenu;
