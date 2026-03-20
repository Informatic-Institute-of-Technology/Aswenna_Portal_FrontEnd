import { Box, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface FormSectionProps {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    action?: ReactNode;
    variant?: 'default' | 'bordered';
}

const FormSection = ({ icon, title, children, action, variant = 'default' }: FormSectionProps) => {
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                ...(variant === 'bordered' && {
                    border: '1px solid',
                    borderColor: 'divider'
                })
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: action ? 2 : 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {icon}
                    <Typography variant="h6" fontWeight="bold">{title}</Typography>
                </Box>
                {action}
            </Box>
            {children}
        </Paper>
    );
};

export default FormSection;
