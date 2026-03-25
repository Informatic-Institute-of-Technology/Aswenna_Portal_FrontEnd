import { Box, Typography } from "@mui/material";

const LandOwnersPage = () => {
  return (
    <Box
      sx={{
        p: 3,
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Land search is currently unavailable.
      </Typography>
    </Box>
  );
};

export default LandOwnersPage;
