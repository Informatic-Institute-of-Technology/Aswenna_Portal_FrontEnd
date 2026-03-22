interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  color: string;
  icon: React.ElementType;
  progress?: number;
}

export function MetricCard({
  label,
  value,
  change,
  color,
  icon: Icon,
  progress = 60,
}: MetricCardProps) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden"
      style={{
        background: "var(--bg-elevated)",
        border: `1px solid ${color}40`,
        boxShadow: `0 0 24px ${color}18`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at top right, ${color}22 0%, transparent 70%)`,
        }}
      />
      <div className="relative flex items-center justify-between">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </span>
        <div className="p-1.5 rounded-lg" style={{ background: `${color}25` }}>
          <Icon sx={{ color, fontSize: 16 }} />
        </div>
      </div>
      <span className="relative text-white text-xl font-extrabold font-mono tracking-tight">
        {value}
      </span>
      <span
        className="relative text-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        {change}
      </span>
      <div className="relative mt-2 h-1.5 rounded-full bg-black/40 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}
 