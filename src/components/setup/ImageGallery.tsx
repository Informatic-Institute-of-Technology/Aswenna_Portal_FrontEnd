import { Delete as DeleteIcon, PhotoCamera } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import type { ChangeEvent } from "react";

interface ImageGalleryProps {
  images: { file: File; preview: string }[];
  onImageAdd: (event: ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: (index: number) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export const ImageGallery = ({
  images,
  onImageAdd,
  onImageDelete,
  maxImages = 10,
  label = "Upload Images",
  helperText = "Add photos of your property",
}: ImageGalleryProps) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        {label}
      </Typography>
      <Grid container spacing={2}>
        {images.map((img, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                aspectRatio: "4/3",
                bgcolor: "var(--text-primary)",
              }}
            >
              <img
                src={img.preview}
                alt={`Preview ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                onClick={() => onImageDelete(index)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "var(--text-primary)",
                  "&:hover": { bgcolor: "var(--text-primary)" },
                }}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
      {images.length < maxImages && (
        <Button
          variant="outlined"
          component="label"
          startIcon={<PhotoCamera />}
          sx={{ mt: 2 }}
        >
          Add Photo
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={onImageAdd}
          />
        </Button>
      )}
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mt: 1 }}
      >
        {helperText} ({images.length}/{maxImages})
      </Typography>
    </Box>
  );
};
