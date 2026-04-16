import { Add } from "@mui/icons-material";
import { AppButton } from "../../shared/components";

interface CreateOfferButtonProps {
  onClick?: () => void;
  fullWidth?: boolean;
  label?: string;
  disabled?: boolean;
}

const CreateOfferButton = ({
  onClick,
  fullWidth = false,
  label = "Create New Offer",
  disabled = false,
}: CreateOfferButtonProps) => {
  return (
    <AppButton
      variant="success"
      size="md"
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      leadingIcon={<Add />}
    >
      {label}
    </AppButton>
  );
};

export default CreateOfferButton;
