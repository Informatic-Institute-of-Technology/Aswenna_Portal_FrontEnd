import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  accentColor?: string;
  showLeftBorder?: boolean;
  showIconBox?: boolean;
}

const SectionHeader = ({
  title,
  description,
  icon,
  accentColor = 'var(--color-brand-accent)',
  showLeftBorder = false,
  showIconBox = false,
}: SectionHeaderProps) => {
  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        borderLeft: showLeftBorder ? `4px solid ${accentColor}` : 'none',
        pl: showLeftBorder ? 2 : 0,
      }}
    >
      {showIconBox && icon && (
        <Box
          sx={{
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${accentColor}33`,
            borderRadius: 1.5,
            border: `1px solid ${accentColor}66`,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: description ? 0.5 : 0,
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-on-dark)',
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SectionHeader;
