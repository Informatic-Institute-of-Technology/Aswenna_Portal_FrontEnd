import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Radio,
  Stack,
  Chip
} from '@mui/material';
import type { FarmerJob } from '../../types/farmer.types';
import { Close } from '@mui/icons-material';

interface Offer {
  id: string;
  projectTitle: string;
  cropType: string;
  cropIcon: string;
  requiredQuantity: number;
  quantityUnit: string;
  totalBudget: number;
}

interface HireFarmerDialogProps {
  open: boolean;
  onClose: () => void;
  farmer: FarmerJob | null;
  offers: Offer[];
  onSubmit: (farmer: FarmerJob, offer: Offer) => void;
}

const HireFarmerDialog: React.FC<HireFarmerDialogProps> = ({ open, onClose, farmer, offers, onSubmit }) => {
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleHire = () => {
    if (farmer && selectedOfferId) {
      const selectedOffer = offers.find(o => o.id === selectedOfferId);
      if (selectedOffer) {
        onSubmit(farmer, selectedOffer);
        setSelectedOfferId(null);
      }
    }
  };

  const handleClose = () => {
    setSelectedOfferId(null);
    onClose();
  };

  if (!farmer) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'var(--bg-overlay)',
          backgroundImage: 'none',
          border: '1px solid var(--surface-light)',
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--surface-light)',
        pb: 2,
        pt: 3,
        px: 3
      }}>
        <Box>
          <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
            Hire {farmer.farmerName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 0.5 }}>
            Assign this farmer to one of your Direct Harvest Offers
          </Typography>
        </Box>
        <Button 
          onClick={handleClose}
          sx={{ 
            minWidth: 'auto', 
            p: 1, 
            color: 'var(--text-secondary)',
            bgcolor: 'var(--bg-active)',
            borderRadius: 1.5,
            '&:hover': { bgcolor: 'var(--surface-light)', color: 'var(--text-primary)' }
          }}
        >
          <Close fontSize="small" />
        </Button>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3, px: 3 }}>
        
        {offers.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'var(--surface-tint)', borderRadius: 2, border: '1px dashed var(--surface-light)' }}>
            <Typography sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              You don't have any active harvest offers.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {offers.map(offer => (
              <Card 
                key={offer.id}
                onClick={() => setSelectedOfferId(offer.id)}
                sx={{ 
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedOfferId === offer.id ? '#85a446' : 'var(--surface-light)',
                  bgcolor: selectedOfferId === offer.id ? 'rgba(133, 164, 70, 0.05)' : 'var(--bg-subtle)',
                  transition: 'all 0.2s ease',
                  borderRadius: 2,
                  boxShadow: selectedOfferId === offer.id ? '0 4px 12px rgba(133, 164, 70, 0.15)' : 'none',
                  '&:hover': {
                    borderColor: selectedOfferId === offer.id ? '#85a446' : 'var(--text-secondary)',
                  }
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Radio 
                    checked={selectedOfferId === offer.id}
                    sx={{ 
                      color: 'var(--surface-light)',
                      '&.Mui-checked': { color: '#85a446' },
                      mr: 2
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                      {offer.projectTitle}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" gap={1}>
                      <Chip 
                        size="small" 
                        label={`${offer.cropIcon} ${offer.cropType}`}
                        sx={{ bgcolor: 'var(--surface-light)', color: 'var(--text-primary)', fontWeight: 500 }}
                      />
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'var(--color-info-blue)', marginRight: '6px', fontWeight: 600 }}>Qty:</span> {offer.requiredQuantity} {offer.quantityUnit}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'var(--color-orange)', marginRight: '6px', fontWeight: 600 }}>Budget:</span> {formatCurrency(offer.totalBudget)}
                      </Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid var(--surface-light)' }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: 'var(--text-secondary)', 
            fontWeight: 600, 
            px: 3,
            '&:hover': { bgcolor: 'var(--bg-active)' } 
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleHire}
          variant="contained"
          disabled={!selectedOfferId}
          size="large"
          sx={{
            bgcolor: '#85a446',
            color: '#1a2d32',
            fontWeight: 700,
            px: 4,
            textTransform: 'none',
            borderRadius: 1.5,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            '&:hover': { bgcolor: '#93b34e', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' },
            '&.Mui-disabled': {
              bgcolor: 'var(--surface-muted)',
              color: 'var(--text-muted)'
            }
          }}
        >
          Confirm Hire
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HireFarmerDialog;
