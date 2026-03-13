export const CHART_COLORS = [
    "#3b82f6",
    "#10b981",
    "#fbbf24",
    "#f43f5e",
    "#8b5cf6",
    "#ec4899",
];

export const TOOLTIP_STYLE = {
    backgroundColor: "#1e1e1e",
    borderColor: "#333",
    color: "#fff",
    borderRadius: "8px",
};

export const genericFormatter = (value: number | string | undefined) => {
    if (typeof value === "number") return value.toLocaleString();
    return value !== undefined ? value.toString() : "";
};

export const moneyFormatter = (value: number | undefined) =>
    value !== undefined ? `$${value.toLocaleString()}` : "";
