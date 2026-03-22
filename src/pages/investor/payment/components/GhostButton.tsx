interface GhostButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function GhostButton({
  children,
  onClick,
  href,
  icon,
  className = "",
}: GhostButtonProps) {
  const cls = `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:text-white hover:border-[var(--neutral-600)] ${className}`;
  const style = {
    background: "var(--bg-overlay)",
    border: "1px solid var(--border-medium)",
    color: "var(--text-secondary)",
    fontFamily: "Inter, sans-serif",
  };

  if (href) {
    return (
      <a href={href} className={cls} style={style}>
        {icon}
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls} style={style}>
      {icon}
      {children}
    </button>
  );
}
