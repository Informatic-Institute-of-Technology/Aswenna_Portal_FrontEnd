interface TableCellProps {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  muted?: boolean;
}

export function TableCell({
  children,
  align = "left",
  muted = false,
}: TableCellProps) {
  const textClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "";
  const color = muted ? "var(--neutral-350)" : "var(--text-primary)";

  return (
    <span className={`text-sm ${textClass}`} style={{ color }}>
      {children}
    </span>
  );
}
 