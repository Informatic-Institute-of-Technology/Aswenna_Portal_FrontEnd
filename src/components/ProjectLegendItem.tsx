import { Box, Typography } from '@mui/material';

interface ProjectLegendItemProps {
  name: string;
  color: string;
  startDate: string;
  endDate: string;
}

const ProjectLegendItem = ({ name, color, startDate, endDate }: ProjectLegendItemProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        backgroundColor: 'var(--surface-muted)',
        borderRadius: 2,
        border: `2px solid ${color}`,
      }}
    >
      <Box
        sx={{
          width: 16,
          height: 16,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: 'var(--text-primary)',
            fontWeight: 600,
            display: 'block',
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'var(--text-on-dark)',
            fontSize: '0.65rem',
          }}
        >
          {new Date(startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}{' '}
          -{' '}
          {new Date(endDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectLegendItem;
