import { Check as CheckIcon } from '@mui/icons-material';
import {
    Box,
    Step,
    StepConnector,
    stepConnectorClasses,
    StepLabel,
    Stepper,
    styled,
    Typography
} from '@mui/material';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 15,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.primary.main,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.primary.main,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? '#444' : '#eaeaf0',
        borderTopWidth: 2,
        borderRadius: 1,
    },
}));

interface ProfileStepperProps {
    activeStep: number;
    steps: string[];
}

export const ProfileStepper = ({ activeStep, steps }: ProfileStepperProps) => {
    return (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Stepper activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />}>
                {steps.map((label, index) => {
                    const completed = index < activeStep;
                    const active = index === activeStep;

                    return (
                        <Step key={label} completed={completed}>
                            <StepLabel
                                StepIconComponent={() => (
                                    <Box sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: completed || active ? 'primary.main' : 'transparent',
                                        border: completed || active ? 'none' : '2px solid #555',
                                        color: completed || active ? 'white' : '#777',
                                        fontWeight: 'bold'
                                    }}>
                                        {completed ? <CheckIcon fontSize="small" /> : index + 1}
                                    </Box>
                                )}
                            >
                                <Typography variant="caption" sx={{
                                    color: completed || active ? 'text.primary' : 'text.secondary',
                                    fontWeight: active ? 'bold' : 'normal'
                                }}>
                                    {label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
};
