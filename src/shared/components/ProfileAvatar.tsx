import { CameraAlt, Close, CloudUpload } from '@mui/icons-material';
import { Avatar, Box, Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography } from '@mui/material';
import { useState } from 'react';

interface ProfileAvatarProps {
  fullName: string | null;
  avatarUrl?: string;
  onAvatarChange?: (file: File) => void;
  size?: number;
  editable?: boolean;
}

export const ProfileAvatar = ({
  fullName,
  avatarUrl,
  onAvatarChange,
  size = 120,
  editable = true,
}: ProfileAvatarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleAvatarClick = () => {
    if (editable) {
      setUploadDialogOpen(true);
    }
  };

  return (
    <>
      <Box 
        sx={{ position: 'relative', display: 'inline-block', cursor: editable ? 'pointer' : 'default' }}
        onMouseEnter={() => editable && setIsHovered(true)}
        onMouseLeave={() => editable && setIsHovered(false)}
        onClick={handleAvatarClick}
      >
        <Avatar
          src={avatarUrl}
          alt={fullName || 'User'}
          sx={{
            width: size,
            height: size,
            fontSize: size / 3,
            bgcolor: 'primary.main',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            ...(editable && isHovered && {
              filter: 'brightness(0.7)',
            }),
          }}
        >
          {!avatarUrl && getInitials(fullName)}
        </Avatar>
        
        {editable && isHovered && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              pointerEvents: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <CameraAlt sx={{ fontSize: size / 3 }} />
          </Box>
        )}
      </Box>

      {/* Upload Dialog - UI Only */}
      <Dialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Upload Profile Picture</Typography>
            <IconButton onClick={() => setUploadDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.default',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.dark',
              },
            }}
          >
            <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag and drop your image here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or click to browse
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: JPG, PNG, GIF (Max 5MB)
            </Typography>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};
