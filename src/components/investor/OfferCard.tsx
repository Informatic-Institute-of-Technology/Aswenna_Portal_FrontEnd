import { Agriculture, Landscape, LocationOn, Visibility } from '@mui/icons-material';
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
import { useMemo } from 'react';

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
    budget?: number; // Optional - can be auto-calculated
    disbursed?: number; // Optional - can be auto-calculated
    remaining?: number; // Optional - can be auto-calculated
    expectedROI: number;
    status: 'active' | 'completed' | 'pending';
    progress?: number; // Optional - can be auto-calculated
    startDate: string;
    endDate?: string;
    backgroundImage?: string;
    investorName?: string;
    investorId?: string;
    landownerName?: string;
    landownerId?: string;
    totalMilestones?: number; // Optional - can be auto-calculated
    completedMilestones?: number; // Optional - can be auto-calculated
    pendingMilestones?: number; // Optional - can be auto-calculated
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    riskStatus?: string;
    investmentType?: 'harvest' | 'commission';
    commissionRate?: number; // Percentage rate for commission-based investments
    earnedCommission?: number; // Total commission earned (for completed or active commission projects)
    investorAmount?: number; // Initial investment amount from investor
    // Detailed information - REQUIRED for auto-calculation
    milestones?: Milestone[];
    payments?: PaymentInstallment[];
    partyMembers?: PartyMember[];
    financialBreakdown?: {
        category: string;
        amount: number;
        percentage?: number; // Optional - auto-calculated on frontend
        type?: 'expense' | 'commission'; // Optional - filters commission from expenses
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
    progress,
    milestones,
    payments,
    financialBreakdown,
    startDate,
    endDate,
    backgroundImage,
    landownerName,
    investmentType,
    earnedCommission,
    investorAmount,
    onViewDetails,
}: OfferCardProps) => {
    // Auto-calculate ROI based on investment type
    const calculatedROI = useMemo(() => {
        // For commission-based projects: ROI = (earnedCommission / investorAmount) × 100
        if (investmentType === 'commission' && investorAmount && earnedCommission !== undefined) {
            return Math.round((earnedCommission / investorAmount) * 100);
        }
        // For harvest-based or if no calculation possible, use provided expectedROI
        return expectedROI;
    }, [investmentType, earnedCommission, investorAmount, expectedROI]);

    // Auto-calculate progress if not provided
    const calculatedProgress = useMemo(() => {
        if (progress !== undefined) return progress;
        if (!milestones || milestones.length === 0) return 0;

        const totalProgress = milestones.reduce((sum, milestone) => sum + milestone.progress, 0);
        return Math.round(totalProgress / milestones.length);
    }, [progress, milestones]);

    // Auto-calculate budget if not provided
    const calculatedBudget = useMemo(() => {
        if (budget !== undefined) return budget;
        if (payments && payments.length > 0) {
            return payments.reduce((sum, payment) => sum + payment.amount, 0);
        }
        if (financialBreakdown && financialBreakdown.length > 0) {
            return financialBreakdown.reduce((sum, item) => sum + item.amount, 0);
        }
        return 0;
    }, [budget, payments, financialBreakdown]);

    // Analyze for critical/warning notifications
    const notificationStatus = useMemo(() => {
        const today = new Date();
        let hasCritical = false;
        let hasWarning = false;
        let criticalCount = 0;
        let warningCount = 0;

        // Check payments
        if (payments) {
            payments.forEach((payment) => {
                const dueDate = new Date(payment.dueDate);
                const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                // Critical: Overdue payments
                if (payment.status === 'pending' && daysDiff < 0) {
                    hasCritical = true;
                    criticalCount++;
                }
                // Warning: Payment due within 7 days
                else if (payment.status === 'pending' && daysDiff >= 0 && daysDiff <= 7) {
                    hasWarning = true;
                    warningCount++;
                }
            });
        }

        // Check milestones
        if (milestones) {
            milestones.forEach((milestone) => {
                const endDate = new Date(milestone.endDate);
                const daysDiff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                // Critical: Delayed milestones
                if (milestone.status === 'delayed') {
                    hasCritical = true;
                    criticalCount++;
                }
                // Warning: Milestone nearing deadline (in-progress with <=5 days)
                else if (milestone.status === 'in-progress' && daysDiff >= 0 && daysDiff <= 5) {
                    hasWarning = true;
                    warningCount++;
                }
            });
        }

        return {
            hasCritical,
            hasWarning,
            totalCount: criticalCount + warningCount,
            criticalCount,
            warningCount,
        };
    }, [payments, milestones]);

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
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                        {/* Notification Badge */}
                        {(notificationStatus.hasCritical || notificationStatus.hasWarning) && (
                            <Tooltip
                                title={
                                    notificationStatus.hasCritical
                                        ? `${notificationStatus.criticalCount} Critical Alert${notificationStatus.criticalCount > 1 ? 's' : ''}`
                                        : `${notificationStatus.warningCount} Warning${notificationStatus.warningCount > 1 ? 's' : ''}`
                                }
                                arrow
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: 32,
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: notificationStatus.hasCritical ? 'rgba(239, 83, 80, 0.2)' : 'rgba(255, 167, 38, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '50%',
                                        border: `2px solid ${notificationStatus.hasCritical ? '#ef5350' : '#ffa726'}`,
                                        animation: 'pulse 2s infinite',
                                        '@keyframes pulse': {
                                            '0%, 100%': {
                                                boxShadow: `0 0 0 0 ${notificationStatus.hasCritical ? 'rgba(239, 83, 80, 0.7)' : 'rgba(255, 167, 38, 0.7)'}`,
                                            },
                                            '50%': {
                                                boxShadow: `0 0 0 8px ${notificationStatus.hasCritical ? 'rgba(239, 83, 80, 0)' : 'rgba(255, 167, 38, 0)'}`,
                                            },
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '16px',
                                            lineHeight: 1,
                                        }}
                                    >
                                        {notificationStatus.hasCritical ? '🚨' : '⚠️'}
                                    </Typography>
                                    {notificationStatus.totalCount > 1 && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -4,
                                                right: -4,
                                                width: 18,
                                                height: 18,
                                                bgcolor: notificationStatus.hasCritical ? '#ef5350' : '#ffa726',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '2px solid #1f1f1f',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    color: 'white',
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {notificationStatus.totalCount}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Tooltip>
                        )}
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
                                {formatCurrency(calculatedBudget)}
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
                                {investmentType === 'commission' ? 'Calculated ROI' : 'Expected ROI'}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50', fontSize: '1rem' }}>
                                {calculatedROI}%
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
                                {calculatedProgress}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={calculatedProgress}
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

                <Box
                    sx={{
                        pt: 2,
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            mb: landownerName ? 1.5 : 0,
                        }}
                    >
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={farmerImage}
                                alt={farmerName}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    border: '2px solid',
                                    borderColor: '#76c043',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: -2,
                                    right: -2,
                                    width: 18,
                                    height: 18,
                                    bgcolor: '#76c043',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid #1f1f1f',
                                }}
                            >
                                <Agriculture sx={{ fontSize: 12, color: 'white' }} />
                            </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {farmerName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: '#76c043', fontSize: '0.7rem' }}>
                                    Farmer
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    •
                                </Typography>
                                <LocationOn sx={{ fontSize: 12, color: '#808080' }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {location}
                                </Typography>
                            </Box>
                        </Box>
                        {!landownerName && (
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
                        )}
                    </Box>

                    {landownerName && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        border: '2px solid',
                                        borderColor: '#ff9800',
                                        bgcolor: 'rgba(255, 152, 0, 0.2)',
                                    }}
                                >
                                    <Landscape sx={{ fontSize: 20, color: '#ff9800' }} />
                                </Avatar>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: -2,
                                        right: -2,
                                        width: 18,
                                        height: 18,
                                        bgcolor: '#ff9800',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid #1f1f1f',
                                    }}
                                >
                                    <Landscape sx={{ fontSize: 10, color: 'white' }} />
                                </Box>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                    {landownerName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: '#ff9800', fontSize: '0.7rem' }}>
                                        Landowner
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666' }}>
                                        •
                                    </Typography>
                                    <LocationOn sx={{ fontSize: 12, color: '#808080' }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
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
                    )}
                </Box>
            </CardContent>

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
