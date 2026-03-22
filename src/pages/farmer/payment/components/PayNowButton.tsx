interface PayNowButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const SIZE_CLASSES = {
  sm: "text-xs px-3.5 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 rounded-xl",
  lg: "text-sm px-6 py-3 rounded-xl",
} as const;

export function PayNowButton({
  onClick,
  label = "Track",
  icon,
  size = "sm",
  fullWidth = false,
}: PayNowButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""}`}
      style={{
        background:
          "linear-gradient(135deg, var(--color-olive), var(--color-olive-light))",
        boxShadow: "0 2px 10px var(--color-olive-glow)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
 