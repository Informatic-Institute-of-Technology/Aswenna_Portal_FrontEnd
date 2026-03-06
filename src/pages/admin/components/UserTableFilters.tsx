import { Search } from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { getRoleColor } from "../utils/userManagement.utils";

interface RoleStats {
  all: number;
  farmer: number;
  investor: number;
  landowner: number;
  superadmin: number;
}

interface UserTableFiltersProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  roleFilter: string;
  onRoleFilterChange: (v: string) => void;
  roleStats: RoleStats;
}

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "farmer", label: "Farmers" },
  { value: "investor", label: "Investors" },
  { value: "landowner", label: "Landowners" },
  { value: "superadmin", label: "Admins" },
];

const UserTableFilters = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  roleStats,
}: UserTableFiltersProps) => (
  <Card
    sx={{
      mb: 2,
      borderRadius: 3,
      bgcolor: "var(--bg-overlay)",
      border: "1px solid var(--surface-light)",
    }}
  >
    <Box
      sx={{
        p: 2,
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <TextField
        size="small"
        placeholder="Search by name, email, NIC, or district…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ fontSize: 18, color: "text.disabled" }} />
            </InputAdornment>
          ),
        }}
        sx={{ flex: 1, minWidth: 220 }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Role</InputLabel>
        <Select
          value={roleFilter}
          label="Role"
          onChange={(e) => onRoleFilterChange(e.target.value)}
        >
          {roleOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          label={`All ${roleStats.all}`}
          size="small"
          variant={roleFilter === "all" ? "filled" : "outlined"}
          onClick={() => onRoleFilterChange("all")}
          sx={{ fontWeight: 600 }}
        />
        {(["farmer", "investor", "landowner"] as const).map((r) => (
          <Chip
            key={r}
            label={
              <Typography
                component="span"
                sx={{ fontSize: "0.75rem", fontWeight: 600 }}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}{" "}
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.7rem",
                    color: getRoleColor(r),
                    fontWeight: 700,
                  }}
                >
                  {roleStats[r]}
                </Typography>
              </Typography>
            }
            size="small"
            variant={roleFilter === r ? "filled" : "outlined"}
            onClick={() => onRoleFilterChange(r)}
          />
        ))}
      </Box>
    </Box>
  </Card>
);

export default UserTableFilters;
