interface GhostButtonProps {
  href?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function GhostButton({
  href,
  icon,
  className = "",
  children,
  onClick,
}: GhostButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold text-white transition-all hover:opacity-80 active:scale-[0.97]";

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClasses} ${className}`}
        style={{
          color: "var(--text-secondary)",
          border: "1px solid var(--bg-subtle)",
          textDecoration: "none",
        }}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      style={{
        color: "var(--text-secondary)",
        border: "1px solid var(--bg-subtle)",
        background: "var(--bg-overlay)",
      }}
    >
      {icon}
      {children}
    </button>
  );
}
 