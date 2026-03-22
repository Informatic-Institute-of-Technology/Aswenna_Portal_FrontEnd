import type { GlobalUser } from "@/types/admin.types";
import { ArrowDownward, ArrowUpward, FilterAlt } from "@mui/icons-material";
import {
  Box,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { UseTableFilterReturn } from "../hooks/useTableFilter";
import { COLUMN_DEFS } from "../hooks/useTableFilter";
import type { ActionType } from "../utils/userManagement.utils";
import ColumnFilterMenu from "./ColumnFilterMenu";
import FilterPane from "./FilterPane";
import UserTableRow from "./UserTableRow";

interface UserTableSectionProps {
  filter: UseTableFilterReturn;
  displayedUsers: GlobalUser[];
  paginatedUsers: GlobalUser[];
  page: number;
  onPageChange: (page: number) => void;
  onViewDetails: (user: GlobalUser) => void;
  onRequestAction: (action: ActionType, user: GlobalUser) => void;
  accentColor: string;
  headerColor: string;
  borderColor: string;
  headerBg: string;
  emptyMessage: string;
  loading?: boolean;
  error?: string | null;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const UserTableSection = ({
  filter,
  displayedUsers,
  paginatedUsers,
  page,
  onPageChange,
  onViewDetails,
  onRequestAction,
  accentColor,
  headerColor,
  borderColor,
  headerBg,
  emptyMessage,
  loading = false,
  error = null,
  children,
  sx,
}: UserTableSectionProps) => {
  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          bgcolor: "var(--bg-overlay)",
          border: `1px solid ${borderColor}`,
          display: "flex",
          ...(sx as object),
        }}
      >
        {filter.filterPaneOpen && (
          <FilterPane
            columnFilters={filter.columnFilters}
            sortConfig={filter.sortConfig}
            activeFilterCount={filter.activeFilterCount}
            onSetFilter={filter.setFilter}
            onClearFilter={filter.clearFilter}
            onClearSort={() => filter.setSortConfig(null)}
            onResetAll={filter.resetAll}
            onClose={() => filter.setFilterPaneOpen(false)}
            accentColor={accentColor}
            borderColor={borderColor}
          />
        )}

        <Box sx={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
          {children}

          <TableContainer
            component={Paper}
            sx={{ bgcolor: "transparent", boxShadow: "none" }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      borderBottom: `1px solid ${borderColor}`,
                      py: 1.5,
                      bgcolor: headerBg,
                    },
                  }}
                >
                  {COLUMN_DEFS.map((col) => {
                    const isActive =
                      col.key !== null &&
                      (Boolean(filter.columnFilters[col.key]) ||
                        filter.sortConfig?.col === col.key);

                    return (
                      <TableCell
                        key={col.label}
                        align={col.align ?? "left"}
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          letterSpacing: 0.8,
                          color: isActive ? accentColor : headerColor,
                          textTransform: "uppercase",
                          userSelect: "none",
                          cursor: col.key ? "pointer" : "default",
                          whiteSpace: "nowrap",
                          transition: "color 0.15s",
                          "&:hover": col.key ? { color: accentColor } : {},
                        }}
                      >
                        {col.key ? (
                          <Box
                            onClick={(e) =>
                              filter.openMenu(e.currentTarget, col.key!)
                            }
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.4,
                            }}
                          >
                            {col.label}
                            {filter.columnFilters[col.key] ? (
                              <FilterAlt sx={{ fontSize: 12 }} />
                            ) : filter.sortConfig?.col === col.key ? (
                              filter.sortConfig.dir === "asc" ? (
                                <ArrowUpward sx={{ fontSize: 12 }} />
                              ) : (
                                <ArrowDownward sx={{ fontSize: 12 }} />
                              )
                            ) : (
                              <ArrowDownward
                                sx={{ fontSize: 11, opacity: 0.3 }}
                              />
                            )}
                          </Box>
                        ) : (
                          col.label
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Loading users…
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!loading && error && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!loading && !error && displayedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {emptyMessage}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  !error &&
                  paginatedUsers.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      onViewDetails={onViewDetails}
                      onRequestAction={onRequestAction}
                      onCellMenuOpen={(e, col, value) =>
                        filter.openMenu(
                          e.currentTarget as HTMLElement,
                          col,
                          value,
                        )
                      }
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {displayedUsers.length > 0 && (
            <TablePagination
              component="div"
              count={displayedUsers.length}
              page={page}
              onPageChange={(_e, p) => onPageChange(p)}
              rowsPerPage={10}
              rowsPerPageOptions={[10]}
              sx={{ borderTop: `1px solid ${borderColor}` }}
            />
          )}
        </Box>
      </Card>

      <ColumnFilterMenu
        menuState={filter.menuState}
        sortConfig={filter.sortConfig}
        activeFilter={
          filter.menuState
            ? filter.columnFilters[filter.menuState.col]
            : undefined
        }
        onClose={filter.closeMenu}
        onSort={(col, dir) => {
          filter.setSortConfig({ col, dir });
          filter.setFilterPaneOpen(true);
        }}
        onOpenFilter={(col) => {
          filter.setFilter(col, filter.columnFilters[col] ?? "");
          filter.setFilterPaneOpen(true);
        }}
        onFilterToValue={(col, value) => {
          filter.setFilter(col, value);
          filter.setFilterPaneOpen(true);
        }}
        onClearFilter={(col) => {
          filter.clearFilter(col);
          if (filter.sortConfig?.col === col) filter.setSortConfig(null);
        }}
      />
    </>
  );
};

export default UserTableSection;
