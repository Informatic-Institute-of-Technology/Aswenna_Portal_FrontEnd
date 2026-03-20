import { Close, CloudUpload, InsertDriveFile } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import type { ChangeEvent } from "react";
import { useRef } from "react";

export interface NicUploaderProps {
  frontFile: File | null;
  backFile: File | null;
  onFrontChange: (file: File | null) => void;
  onBackChange: (file: File | null) => void;
}

const isImageFile = (file: File) => file.type.startsWith("image/");

interface NicSlotProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}

const NicSlot = ({ label, file, onChange }: NicSlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl =
    file && isImageFile(file) ? URL.createObjectURL(file) : null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onChange(selected);
    e.target.value = "";
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onChange(null);
  };

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="caption"
        fontWeight={700}
        sx={{
          mb: 0.75,
          display: "block",
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.7rem",
        }}
      >
        {label}
      </Typography>
      <input
        type="file"
        ref={inputRef}
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {!file ? (
        <Box
          onClick={() => inputRef.current?.click()}
          sx={{
            border: "1.5px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            textAlign: "center",
            cursor: "pointer",
            minHeight: 140,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.2s, background 0.2s",
            "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
          }}
        >
          <CloudUpload sx={{ fontSize: 38, color: "primary.main", mb: 0.5 }} />
          <Typography variant="body2" color="text.secondary" fontSize="0.78rem">
            Click or drag to upload
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            fontSize="0.7rem"
            sx={{ mt: 0.3 }}
          >
            JPG · PNG · PDF
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "primary.light",
            minHeight: 140,
            bgcolor: "action.hover",
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={label}
              style={{
                width: "100%",
                height: 140,
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                height: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <InsertDriveFile
                sx={{ fontSize: 40, color: "primary.main", mb: 0.5 }}
              />
              <Typography
                variant="caption"
                noWrap
                sx={{
                  maxWidth: "100%",
                  color: "text.secondary",
                  fontSize: "0.72rem",
                }}
              >
                {file.name}
              </Typography>
            </Box>
          )}

          <IconButton
            size="small"
            onClick={handleClear}
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              bgcolor: "rgba(0,0,0,0.55)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.78)" },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
          <Box
            onClick={() => inputRef.current?.click()}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.45)",
              py: 0.6,
              cursor: "pointer",
              textAlign: "center",
              transition: "background 0.15s",
              "&:hover": { bgcolor: "rgba(0,0,0,0.65)" },
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "white", fontSize: "0.72rem" }}
            >
              Change photo
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export const NicUploader = ({
  frontFile,
  backFile,
  onFrontChange,
  onBackChange,
}: NicUploaderProps) => {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
        National ID (NIC) *
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <NicSlot label="Front Side" file={frontFile} onChange={onFrontChange} />
        <NicSlot label="Back Side" file={backFile} onChange={onBackChange} />
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        Upload clear photos or scans of both sides of your NIC. Supported
        formats: JPG, PNG, PDF.
      </Typography>
    </Box>
  );
};
