import { Box, CardHeader, Typography } from '@mui/material';
import React from 'react';

interface CardHeaderWithIconProps {
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
}

const CardHeaderWithIcon: React.FC<CardHeaderWithIconProps> = ({
  icon: Icon,
  title,
  action,
}) => {
  return (
    <CardHeader
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon />
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      }
      action={action}
    />
  );
};

export default CardHeaderWithIcon;
