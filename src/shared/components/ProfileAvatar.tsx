import { CameraAlt } from '@mui/icons-material';
import { Avatar, Box, IconButton } from '@mui/material';

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
  const getInitials = (name: string | null) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={avatarUrl}
        alt={fullName || 'User'}
        sx={{
          width: size,
          height: size,
          fontSize: size / 3,
          bgcolor: 'primary.main',
          fontWeight: 600,
        }}
      >
        {!avatarUrl && getInitials(fullName)}
      </Avatar>
      {editable && (
        <>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="avatar-upload">
            <IconButton
              component="span"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              }}
              size="small"
            >
              <CameraAlt fontSize="small" />
            </IconButton>
          </label>
        </>
      )}
    </Box>
  );
};
