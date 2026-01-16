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
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 600,
            display: 'block',
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
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
