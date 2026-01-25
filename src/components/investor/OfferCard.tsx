import { LocationOn, Visibility } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    LinearProgress,
    Tooltip,
    Typography,
} from '@mui/material';

export interface PaymentInstallment {
    id: string;
    milestoneId: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: 'paid' | 'pending' | 'overdue';
    description: string;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    progress: number;
    status: 'completed' | 'in-progress' | 'pending' | 'delayed';
    startDate: string;
    endDate: string;
    completedDate?: string;
    payment: number;
    tasks: {
        total: number;
        completed: number;
    };
}

export interface PartyMember {
    id: string;
    name: string;
    role: 'farmer' | 'investor' | 'landowner';
    email: string;
    phone: string;
    image: string;
    location?: string;
    coordinates?: string; // Added coordinates field
    specialization?: string;
    experience?: string;
    rating?: number;
}

export interface OfferCardProps {
    id: string;
    projectName: string;
    projectId?: string;
    cropType: string;
    cropIcon: string;
    farmerName: string;
    farmerImage: string;
    farmerId?: string;
    location: string;
    district?: string;
    province?: string;
    coordinates?: string;
    budget: number;
    disbursed?: number;
    remaining?: number;
    expectedROI: number;
    status: 'active' | 'completed' | 'pending';
    progress?: number;
    startDate: string;
    endDate?: string;
    backgroundImage?: string;
    investorName?: string;
    investorId?: string;
    landownerName?: string;
    landownerId?: string;
    totalMilestones?: number;
    completedMilestones?: number;
    pendingMilestones?: number;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    riskStatus?: string;
    // Detailed information
    milestones?: Milestone[];
    payments?: PaymentInstallment[];
    partyMembers?: PartyMember[];
    financialBreakdown?: {
        category: string;
        amount: number;
        percentage: number;
    }[];
    onViewDetails?: (id: string) => void;
}

const OfferCard = ({
    id,
    projectName,
    cropType,
    cropIcon,
    farmerName,
    farmerImage,
    location,
    budget,
    expectedROI,
    status,
    progress = 0,
    startDate,
    endDate,
    backgroundImage,
    onViewDetails,
}: OfferCardProps) => {
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
        switch (status) {
            case 'active':
                return 'success';
            case 'completed':
                return 'primary';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(107, 142, 35, 0.1)',
                },
            }}
        >
            {/* Header with Background Image */}
            <Box
                sx={{
                    position: 'relative',
                    height: 160,
                    background: 'linear-gradient(135deg, #1a2e1a 0%, #2a3a2a 100%)',
                    overflow: 'hidden',
                }}
            >
                {backgroundImage && (
                    <CardMedia
                        component="img"
                        image={backgroundImage}
                        alt={cropType}
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.6,
                            transition: 'all 0.4s ease',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                opacity: 0.8,
                            },
                        }}
                    />
                )}
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
                            label={status.toUpperCase()}
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

                    {/* Crop Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                            }}
                        >
                            {cropIcon}
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                    fontSize: '1.1rem',
                                }}
                            >
                                {projectName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {cropType}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Card Body */}
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                {/* Stats Row using Bootstrap Grid */}
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
                                Budget
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#6B8E23', fontSize: '1rem' }}>
                                {formatCurrency(budget)}
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
                                Expected ROI
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50', fontSize: '1rem' }}>
                                {expectedROI}%
                            </Typography>
                        </Box>
                    </div>
                </div>

                {/* Progress (only for active projects) */}
                {status === 'active' && (
                    <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                Project Progress
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {progress}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 8,
                                borderRadius: 1,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, #6B8E23 0%, #8FA887 100%)',
                                },
                            }}
                        />
                    </Box>
                )}

                {/* Farmer Section */}
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
                        src={farmerImage}
                        alt={farmerName}
                        sx={{
                            width: 40,
                            height: 40,
                            border: '2px solid',
                            borderColor: 'primary.main',
                        }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {farmerName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOn sx={{ fontSize: 14, color: '#808080' }} />
                            <Typography variant="caption" color="text.secondary">
                                {location}
                            </Typography>
                        </Box>
                    </Box>
                    <Tooltip title="View Details">
                        <IconButton
                            size="small"
                            onClick={() => onViewDetails?.(id)}
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
            </CardContent>

            {/* Date Footer */}
            <Box
                className="row g-0"
                sx={{
                    p: 1.5,
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
            >
                <div className="col-6 text-center">
                    <Typography variant="caption" sx={{ color: '#808080', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                        Started
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem' }}>
                        {formatDate(startDate)}
                    </Typography>
                </div>
                {endDate && (
                    <div className="col-6 text-center">
                        <Typography variant="caption" sx={{ color: '#808080', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                            {status === 'completed' ? 'Completed' : 'Expected End'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem' }}>
                            {formatDate(endDate)}
                        </Typography>
                    </div>
                )}
            </Box>
        </Card>
    );
};

export default OfferCard;
