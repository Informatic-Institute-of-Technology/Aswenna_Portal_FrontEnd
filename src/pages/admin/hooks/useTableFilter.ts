import type { GlobalUser } from "@/types/admin.types";
import { useCallback, useState } from "react";
import { getDistrict, normalizeStatus } from "../utils/userManagement.utils";

export type SortDir = "asc" | "desc";
export type FilterColKey =
  | "user"
  | "role"
  | "status"
  | "nic"
  | "district"
  | "joined";

export interface SortConfig {
  col: FilterColKey;
  dir: SortDir;
}

export interface MenuState {
  anchor: HTMLElement;
  col: FilterColKey;
  cellValue?: string;
}

export const COLUMN_DEFS: {
  label: string;
  key: FilterColKey | null;
  align?: "left" | "center" | "right";
}[] = [
  { label: "User", key: "user" },
  { label: "Role", key: "role" },
  { label: "Status", key: "status" },
  { label: "NIC", key: "nic" },
  { label: "District", key: "district" },
  { label: "Verified", key: null },
  { label: "Joined", key: "joined" },
  { label: "Actions", key: null, align: "center" },
];

export const useTableFilter = () => {
  const [columnFilters, setColumnFilters] = useState<
    Partial<Record<FilterColKey, string>>
  >({});
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterPaneOpen, setFilterPaneOpen] = useState(false);
  const [menuState, setMenuState] = useState<MenuState | null>(null);

  const openMenu = useCallback(
    (anchor: HTMLElement, col: FilterColKey, cellValue?: string) => {
      setMenuState({ anchor, col, cellValue });
    },
    [],
  );

  const closeMenu = useCallback(() => setMenuState(null), []);

  const setFilter = useCallback((col: FilterColKey, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [col]: value }));
  }, []);

  const clearFilter = useCallback((col: FilterColKey) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      delete next[col];
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setColumnFilters({});
    setSortConfig(null);
  }, []);

  const getColValue = (user: GlobalUser, col: FilterColKey): string => {
    switch (col) {
      case "user":
        return `${user.fullName} ${user.email}`;
      case "role":
        return user.role;
      case "status":
        return normalizeStatus(user.apiStatus);
      case "nic":
        return user.nic || "";
      case "district":
        return getDistrict(user.address);
      case "joined":
        return user.registrationDate || "";
      default:
        return "";
    }
  };

  const apply = useCallback(
    (users: GlobalUser[]): GlobalUser[] => {
      let result = [...users];

      (
        Object.entries(columnFilters) as [FilterColKey, string | undefined][]
      ).forEach(([col, val]) => {
        if (val) {
          result = result.filter((u) =>
            getColValue(u, col).toLowerCase().includes(val.toLowerCase()),
          );
        }
      });

      if (sortConfig) {
        result.sort((a, b) => {
          const va = getColValue(a, sortConfig.col);
          const vb = getColValue(b, sortConfig.col);
          const cmp = va.localeCompare(vb, undefined, { sensitivity: "base" });
          return sortConfig.dir === "asc" ? cmp : -cmp;
        });
      }

      return result;
    },
    [columnFilters, sortConfig],
  );

  const activeFilterCount = Object.values(columnFilters).filter(Boolean).length;
  const activeSortCount = sortConfig ? 1 : 0;

  return {
    columnFilters,
    setFilter,
    clearFilter,
    sortConfig,
    setSortConfig,
    filterPaneOpen,
    setFilterPaneOpen,
    menuState,
    openMenu,
    closeMenu,
    resetAll,
    apply,
    activeFilterCount,
    activeSortCount,
  };
};
export type UseTableFilterReturn = ReturnType<typeof useTableFilter>;
