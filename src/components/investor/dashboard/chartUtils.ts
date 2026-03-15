// ──────────────────────────────────────────────────────────────────────────────
// Shared constants + formatter helpers used by investor dashboard chart components
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Pre-defined color palette used for chart series.
 * Keep it in sync with the dashboard design system.
 */
export const CHART_COLORS: string[] = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#fbbf24", // amber
    "#f43f5e", // rose
    "#8b5cf6", // violet
    "#ec4899", // pink
];

/**
 * Common tooltip style for chart overlays used in investor dashboard.
 */
export const TOOLTIP_STYLE = {
    backgroundColor: "#1e1e1e",
    borderColor: "#333",
    color: "#fff",
    borderRadius: "8px",
};

/**
 * Generic formatter. Handles numbers, strings, and undefined values safely.
 *
 * - number: formatted with locale separators (e.g. 1,234)
 * - string: returned directly
 * - undefined: returns empty string
 */
export const genericFormatter = (value: number | string | undefined): string => {
    if (typeof value === "number") {
        return value.toLocaleString();
    }

    if (typeof value === "string") {
        return value;
    }

    return "";
};

/**
 * USD money formatter (prefix with `$`) for numeric values.
 */
export const moneyFormatter = (value: number | undefined): string => {
    if (value === undefined || Number.isNaN(value)) {
        return "";
    }

    return `$${value.toLocaleString()}`;
};
