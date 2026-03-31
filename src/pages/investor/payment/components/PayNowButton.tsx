import type { ButtonSize } from "../../../../shared/components";
import { AppButton } from "../../../../shared/components";

interface PayNowButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function PayNowButton({
  onClick,
  label = "Pay Now",
  icon,
  size = "sm",
  fullWidth = false,
}: PayNowButtonProps) {
  return (
    <AppButton
      onClick={onClick}
      variant="success"
      size={size}
      fullWidth={fullWidth}
      leadingIcon={icon}
    >
      {label}
    </AppButton>
  );
}
