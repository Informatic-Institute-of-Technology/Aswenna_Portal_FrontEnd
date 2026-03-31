import { AppButton } from "../../../../shared/components";

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
