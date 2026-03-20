import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

interface CreateOfferButtonProps {
    onClick?: () => void;
    fullWidth?: boolean;
}

const CreateOfferButton = ({ onClick, fullWidth = false }: CreateOfferButtonProps) => {
    return (
        <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onClick}
            className="create-offer-btn"
            sx={{
                background: 'linear-gradient(135deg, var(--color-olive) 0%, var(--color-olive-light) 100%)',
                borderRadius: '12px',
                padding: '0.875rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px var(--color-olive-glow)',
                width: fullWidth ? '100%' : 'auto',
                '&:hover': {
                    background: 'linear-gradient(135deg, var(--color-olive-hover) 0%, var(--color-olive-light) 100%)',
                    boxShadow: '0 6px 20px var(--color-olive-glow)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            Create New Offer
        </Button>
    );
};

export default CreateOfferButton;
