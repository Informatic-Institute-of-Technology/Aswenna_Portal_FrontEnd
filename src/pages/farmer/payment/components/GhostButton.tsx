import { AppButton } from "../../../../shared/components";

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
  return (
    <AppButton
      href={href}
      onClick={onClick}
      variant="ghost"
      size="md"
      className={className}
      leadingIcon={icon}
    >
      {children}
    </AppButton>
  );
}
