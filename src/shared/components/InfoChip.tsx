import { Cancel, CheckCircle } from '@mui/icons-material';
import { Chip } from '@mui/material';

interface InfoChipProps {
  label: string;
  verified?: boolean | null;
  type?: 'verified' | 'role' | 'default';
}

export const InfoChip = ({ label, verified, type = 'default' }: InfoChipProps) => {
  if (type === 'verified') {
    return (
      <Chip
        icon={verified ? <CheckCircle /> : <Cancel />}
        label={label}
        color={verified ? 'success' : 'default'}
        size="small"
        variant={verified ? 'filled' : 'outlined'}
      />
    );
  }

  if (type === 'role') {
    return (
      <Chip
        label={label}
        color="primary"
        size="small"
        sx={{
          fontWeight: 600,
          textTransform: 'capitalize',
        }}
      />
    );
  }

  return <Chip label={label} size="small" />;
};
