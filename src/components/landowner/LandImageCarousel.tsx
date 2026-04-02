import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";
import { useState } from "react";

interface LandImage {
  url?: string;
  filename?: string;
}

interface LandImageCarouselProps {
  images: LandImage[];
  title: string;
  defaultImage?: string;
}

export const LandImageCarousel = ({
  images,
  title,
  defaultImage = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900",
}: LandImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const validImages = images.filter((img) => img.url);
  const imagesToDisplay =
    validImages.length > 0 ? validImages : [{ url: defaultImage }];
  const currentImage = imagesToDisplay[currentImageIndex];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesToDisplay.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === imagesToDisplay.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: 180,
        overflow: "hidden",
        borderRadius: "8px 8px 0 0",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, var(--color-nature-deep) 0%, var(--color-nature-mid) 100%)",
          zIndex: 1,
        }}
      />

      <Box
        component="img"
        src={currentImage.url || defaultImage}
        alt={title}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.7,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          "&:hover": { opacity: 0.85, transform: "scale(1.05)" },
          zIndex: 2,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
          zIndex: 3,
        }}
      />

      {imagesToDisplay.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              },
            }}
            size="small"
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              },
            }}
            size="small"
          >
            <ChevronRight />
          </IconButton>
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              zIndex: 5,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {currentImageIndex + 1} / {imagesToDisplay.length}
          </Box>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              zIndex: 5,
            }}
          >
            {imagesToDisplay.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor:
                    index === currentImageIndex
                      ? "white"
                      : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default LandImageCarousel;
