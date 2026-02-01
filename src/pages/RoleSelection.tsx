import AswendLogo from "@/assets/Aswenna Logo.png";
import "@/styles/RoleSelection.css";
import { Agriculture, ArrowBack, East, TrendingUp, Villa } from "@mui/icons-material";
import { Box, Button, Container, IconButton, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../shared/components/Notification";
import { useNotification } from "../shared/hooks/useNotification";

type Role = "farmer" | "investor" | "landowner" | null;

const RoleSelection = () => {
    const [selectedRole, setSelectedRole] = useState<Role>(null);
    const navigate = useNavigate();
    const { notification, showSuccess, hideNotification } = useNotification();

    const roles = [
        {
            id: "farmer" as const,
            title: "Farmer",
            description: "Access the resources you need to grow. Connect with investors for funding, find arable land for lease, and manage your agricultural projects efficiently in one place."
        },
        {
            id: "investor" as const,
            title: "Investor",
            description: "Diversify your portfolio with direct agricultural investments. Browse vetted opportunities, fund capable farmers, and track project performance transparently."
        },
        {
            id: "landowner" as const,
            title: "Land Owner",
            description: "Turn your idle assets into income. List your available land and match with verified farmers looking to lease or partner on cultivation projects."
        }
    ];

    const handleRoleSelect = (role: Role) => {
        if (!role) return;

        setSelectedRole(role);
        localStorage.setItem("userRole", role);
        showSuccess(`Role selected: ${role.charAt(0).toUpperCase() + role.slice(1)}`);

        setTimeout(() => {
            if (role === 'farmer') {
                navigate("/farmer-profile-setup");
            } else {
                navigate("/login");
            }
        }, 800);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Box className="role-selection-container">
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pt: 3 }}>
                    <IconButton onClick={handleBack} sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.3)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' } }}>
                        <ArrowBack />
                    </IconButton>

                    <Stepper
                        activeStep={1}
                        sx={{
                            flex: 1,
                            maxWidth: 400,
                            '& .MuiStepConnector-line': {
                                borderColor: 'rgba(255,255,255,0.3)',
                            }
                        }}
                    >
                        <Step completed>
                            <StepLabel sx={{
                                '& .MuiStepLabel-label': { color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500 },
                                '& .MuiStepIcon-root': { color: '#6b8e23' },
                                '& .MuiStepIcon-text': { fill: 'white' }
                            }}>
                                Step 1
                            </StepLabel>
                        </Step>
                        <Step>
                            <StepLabel sx={{
                                '& .MuiStepLabel-label': { color: 'white', fontSize: '0.875rem', fontWeight: 600 },
                                '& .MuiStepIcon-root': { color: 'white', border: '2px solid white', borderRadius: '50%' },
                                '& .MuiStepIcon-text': { fill: '#1a1a1a' }
                            }}>
                                Step 2
                            </StepLabel>
                        </Step>
                        <Step>
                            <StepLabel sx={{
                                '& .MuiStepLabel-label': { color: '#6b6b6b', fontSize: '0.875rem', fontWeight: 500 },
                                '& .MuiStepIcon-root': { color: '#4a4a4a' },
                                '& .MuiStepIcon-text': { fill: 'white' }
                            }}>
                                Step 3
                            </StepLabel>
                        </Step>
                    </Stepper>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <img src={AswendLogo} alt="Aswenna Logo" style={{ width: '120px', marginBottom: '1.5rem' }} />
                    <Typography
                        variant="h3"
                        sx={{
                            color: 'white',
                            fontWeight: 700,
                            mb: 1.5,
                            fontSize: { xs: '2rem', md: '3rem' }
                        }}
                    >
                        Which one are you?
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.8)',
                            fontWeight: 400,
                            maxWidth: '600px',
                            margin: '0 auto',
                            fontSize: { xs: '1rem', md: '1.25rem' }
                        }}
                    >
                        Select your role to customize your Aswenna experience.
                        This helps us provide the right tools for your growth.
                    </Typography>
                </Box>

                <Box className="role-cards-container">
                    {roles.map((role) => (
                        <Box
                            key={role.id}
                            className={`role-section ${selectedRole === role.id ? 'selected' : ''}`}
                        >
                            <Typography className="role-section-description">
                                {role.description}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => handleRoleSelect(role.id)}
                                endIcon={<East />}
                                startIcon={
                                    role.id === 'farmer' ? <Agriculture /> :
                                        role.id === 'investor' ? <TrendingUp /> :
                                            <Villa />
                                }
                                sx={{
                                    backgroundColor: '#2e7d32',
                                    color: 'white',
                                    borderRadius: '12px',
                                    padding: '12px 24px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.39)',
                                    '&:hover': {
                                        backgroundColor: '#1b5e20',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.23)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                {role.title}
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Container>

            <Notification
                open={notification.open}
                message={notification.message}
                severity={notification.severity}
                duration={3000}
                onClose={hideNotification}
            />
        </Box>
    );
};

export default RoleSelection;
