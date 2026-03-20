interface StatusBadgeProps {
  label: string;
  color: string;
  dotClassName?: string;
}

export function StatusBadge({ label, color, dotClassName }: StatusBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}38`,
      }}
    >
      {dotClassName ? (
        <span className={`w-1.5 h-1.5 rounded-full ${dotClassName}`} />
      ) : (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
        />
      )}
      {label}
    </span>
  );
}
