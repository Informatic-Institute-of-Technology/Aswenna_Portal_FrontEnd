import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface StatCardProps {
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
}

const StatCard = ({ icon: Icon, iconBgColor, iconColor, label, value }: StatCardProps) => {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: iconBgColor,
            color: iconColor,
          }}
        >
          <Icon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
