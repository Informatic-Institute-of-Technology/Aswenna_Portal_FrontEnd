import { Box, Typography } from '@mui/material';

interface PlaceholderWidgetProps {
  icon: string;
  title: string;
  description: string;
}

const PlaceholderWidget = ({ icon, title, description }: PlaceholderWidgetProps) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(107, 142, 35, 0.05)',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        p: 6,
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {icon} {title}
      </Typography>
      <Typography variant="body2">{description}</Typography>
    </Box>
  );
};

export default PlaceholderWidget;
