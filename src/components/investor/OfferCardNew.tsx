import type { InvestorOffer } from '@/types/investor.types';
import { LocalShipping, LocationOn, Percent, TrendingUp, Visibility } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';

export interface OfferCardProps {
    offer: InvestorOffer;
    onViewDetails?: (id: string) => void;
}

const OfferCard = ({ offer, onViewDetails }: OfferCardProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusColor = () => {
        switch (offer.status) {
            case 'active':
                return 'success';
            case 'completed':
                return 'primary';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getOfferTypeInfo = () => {
        if (offer.offerType === 'direct-harvest') {
            return {
                icon: '🌾',
                label: 'Direct Harvest Order',
                color: '#FF9800',
                gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)'
            };
        } else {
            return {
                icon: '💰',
                label: 'Sponsorship',
                color: '#2196F3',
                gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)'
            };
        }
    };

    const offerTypeInfo = getOfferTypeInfo();

    // Get background image based on crop type
    const getBackgroundImage = () => {
        const cropType = offer.offerType === 'direct-harvest' 
            ? offer.cropType 
            : offer.cropTypes[0] || 'farming';
        
        const imageMap: Record<string, string> = {
            'Rice': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600',
            'Tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
            'Tea': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600',
            'Vegetables': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600',
        };
        
        return imageMap[cropType] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600';
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(107, 142, 35, 0.1)',
                },
            }}
        >
            {/* Offer Type Badge (Top Right Corner) */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -8,
                    right: 16,
                    zIndex: 10,
                    background: offerTypeInfo.gradient,
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                {offerTypeInfo.icon} {offerTypeInfo.label}
            </Box>

            {/* Header with Background Image */}
            <Box
                sx={{
                    position: 'relative',
                    height: 160,
                    background: 'linear-gradient(135deg, #1a2e1a 0%, #2a3a2a 100%)',
                    overflow: 'hidden',
                }}
            >
                <CardMedia
                    component="img"
                    image={getBackgroundImage()}
                    alt="crop"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.6,
                        transition: 'all 0.4s ease',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)',
                    }}
                />
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Status Badge */}
                    <Box>
                        <Chip
                            label={offer.status.toUpperCase()}
                            color={getStatusColor()}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                letterSpacing: 0.5,
                                backdropFilter: 'blur(10px)',
                                textTransform: 'uppercase',
                            }}
                        />
                    </Box>

                    {/* Title */}
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: '#ffffff',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                fontSize: '1.1rem',
                                mb: 0.5
                            }}
                        >
                            {offer.offerType === 'direct-harvest' 
                                ? `${offer.requiredQuantity} ${offer.quantityUnit} ${offer.cropType}`
                                : offer.sponsorshipTitle
                            }
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {offer.offerType === 'direct-harvest'
                                ? offer.companyName || 'Direct Harvest Order'
                                : `${offer.cropTypes.join(', ')}`
                            }
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Card Body */}
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                {/* Direct Harvest Specific Info */}
                {offer.offerType === 'direct-harvest' && (
                    <>
                        <div className="row g-2">
                            <div className="col-6">
                                <Box
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 1.5,
                                        p: 1.5,
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: '#808080', textTransform: 'uppercase' }}>
                                        Total Budget
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#6B8E23', fontSize: '1rem' }}>
                                        {formatCurrency(offer.totalBudget)}
                                    </Typography>
                                </Box>
                            </div>
                            <div className="col-6">
                                <Box
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 1.5,
                                        p: 1.5,
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: '#808080', textTransform: 'uppercase' }}>
                                        Price/Unit
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF9800', fontSize: '1rem' }}>
                                        {formatCurrency(offer.pricePerUnit)}
                                    </Typography>
                                </Box>
                            </div>
                        </div>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 1 }}>
                            <LocalShipping sx={{ fontSize: 18, color: '#FF9800' }} />
                            <Box>
                                <Typography variant="caption" sx={{ color: '#808080' }}>
                                    Delivery Deadline
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#FF9800' }}>
                                    {formatDate(offer.deliveryDeadline)}
                                </Typography>
                            </Box>
                        </Box>

                        {offer.deliveryLocation && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn sx={{ fontSize: 16, color: '#808080' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {offer.deliveryLocation}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}

                {/* Sponsorship Specific Info */}
                {offer.offerType === 'sponsorship' && (
                    <>
                        <div className="row g-2">
                            <div className="col-6">
                                <Box
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 1.5,
                                        p: 1.5,
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: '#808080', textTransform: 'uppercase' }}>
                                        Investment Range
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#6B8E23', fontSize: '0.9rem' }}>
                                        {offer.minimumInvestment && offer.maximumInvestment ? (
                                            <>{formatCurrency(offer.minimumInvestment)} - {formatCurrency(offer.maximumInvestment)}</>
                                        ) : 'TBD'}
                                    </Typography>
                                </Box>
                            </div>
                            <div className="col-6">
                                <Box
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 1.5,
                                        p: 1.5,
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: '#808080', textTransform: 'uppercase' }}>
                                        Commission
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196F3', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Percent sx={{ fontSize: 16 }} /> {offer.commissionRate}%
                                    </Typography>
                                </Box>
                            </div>
                        </div>

                        {offer.expectedCommission && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 1 }}>
                                <TrendingUp sx={{ fontSize: 18, color: '#2196F3' }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#808080' }}>
                                        Expected Commission
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196F3' }}>
                                        {formatCurrency(offer.expectedCommission)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {offer.supportType.map((type) => (
                                <Chip
                                    key={type}
                                    label={type}
                                    size="small"
                                    sx={{
                                        fontSize: '0.7rem',
                                        height: 22,
                                        bgcolor: 'rgba(33, 150, 243, 0.1)',
                                        color: '#2196F3'
                                    }}
                                />
                            ))}
                        </Box>
                    </>
                )}

                {/* Applications Count */}
                <Box
                    sx={{
                        p: 1.5,
                        bgcolor: 'rgba(107, 142, 35, 0.1)',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        Applications Received
                    </Typography>
                    <Chip
                        label={offer.applicationsCount}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            bgcolor: 'primary.main',
                            color: 'white'
                        }}
                    />
                </Box>

                {/* Farmer/Land Owner Match (if confirmed) */}
                {offer.selectedFarmer && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            pt: 2,
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        <Avatar
                            src={offer.selectedFarmer.farmerImage}
                            alt={offer.selectedFarmer.farmerName}
                            sx={{
                                width: 40,
                                height: 40,
                                border: '2px solid',
                                borderColor: 'primary.main',
                            }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {offer.selectedFarmer.farmerName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn sx={{ fontSize: 14, color: '#808080' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {offer.selectedFarmer.location}
                                </Typography>
                            </Box>
                        </Box>
                        <Tooltip title="View Details">
                            <IconButton
                                size="small"
                                onClick={() => onViewDetails?.(offer.id)}
                                sx={{
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'rgba(107, 142, 35, 0.1)',
                                    },
                                }}
                            >
                                <Visibility fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}

                {/* Payment Installments Info */}
                <Box
                    sx={{
                        p: 1.5,
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 1,
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                >
                    <Typography variant="caption" sx={{ color: '#808080', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                        Payment Schedule
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {offer.paymentInstallments.length} Installments
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {offer.paymentInstallments.filter(i => i.status === 'paid').length} Paid, {' '}
                        {offer.paymentInstallments.filter(i => i.status === 'pending').length} Pending
                    </Typography>
                </Box>
            </CardContent>

            {/* Date Footer */}
            <Box
                sx={{
                    p: 1.5,
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Box>
                    <Typography variant="caption" sx={{ color: '#808080', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                        Created
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem' }}>
                        {formatDate(offer.createdAt)}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    size="small"
                    endIcon={<Visibility />}
                    onClick={() => onViewDetails?.(offer.id)}
                    sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.light',
                            bgcolor: 'rgba(107, 142, 35, 0.1)'
                        }
                    }}
                >
                    View Details
                </Button>
            </Box>
        </Card>
    );
};

export default OfferCard;
