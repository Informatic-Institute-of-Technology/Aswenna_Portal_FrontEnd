import { Box, Typography } from "@mui/material";
import React from "react";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  customContent?: React.ReactNode;
}

const InfoRow = ({ icon, label, value, customContent }: InfoRowProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      p: 1.5,
      borderRadius: 2,
      bgcolor: "var(--bg-hover)",
      border: "1px solid var(--bg-active)",
      mb: 1.5,
    }}
  >
    <Box sx={{ color: "var(--text-on-dark)", display: "flex", mt: 0.15 }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="caption"
        sx={{
          color: "var(--text-secondary)",
          fontWeight: 600,
          letterSpacing: 0.7,
          fontSize: "0.68rem",
          display: "block",
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      {customContent ?? (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      )}
    </Box>
  </Box>
);

export default InfoRow;
