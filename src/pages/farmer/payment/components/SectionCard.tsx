interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accentColor: string;
  count?: number;
  children: React.ReactNode;
}

export function SectionCard({
  icon,
  title,
  subtitle,
  accentColor,
  count,
  children,
}: SectionCardProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: `1px solid var(--bg-subtle)`,
        background: "var(--bg-surface)",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          borderBottom: "1px solid var(--bg-subtle)",
          background: `linear-gradient(to right, ${accentColor}12, transparent)`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="p-1.5 rounded-lg flex-shrink-0"
            style={{ background: `${accentColor}20` }}
          >
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-bold uppercase tracking-wide leading-none">
                {title}
              </p>
              {count !== undefined && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full leading-none"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                >
                  {count}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs mt-1" style={{ color: accentColor }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Last updated: Just now
        </span>
      </div>

      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
 