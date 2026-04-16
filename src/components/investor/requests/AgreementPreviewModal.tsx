import { Close, Download, FilePresent, Upload } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import aswennaMainLogo from "../../../assets/Aswenna Logo.png";
import sriLankaGovernmentLogo from "../../../assets/sri-lanka-government-emblem.jpg";
import {
  generateAgreementPDFForPreview,
  type AgreementDetails,
} from "../../../utils/agreementGenerator";

interface AgreementPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirmUpload: () => void;
  agreementType?: "Investor-Farmer" | "Investor-Landowner";
  agreementDetails?: Partial<AgreementDetails>;
  counterpartyName?: string;
}

const AgreementPreviewModal = ({
  open,
  onClose,
  onConfirmUpload,
  agreementType,
  agreementDetails,
  counterpartyName = "Party",
}: AgreementPreviewModalProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const imageUrlToPngDataUrl = (url: string): Promise<string | undefined> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(undefined);
            return;
          }
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch {
          resolve(undefined);
        }
      };
      img.onerror = () => resolve(undefined);
      img.src = url;
    });

  useEffect(() => {

    console.log("Modal useEffect triggered:", {
      open,
      pdfUrl: pdfUrl ? "SET" : "null",
      agreementType,
      agreementDetails: agreementDetails ? "SET" : "undefined",
      shouldGenerate: open && !pdfUrl && agreementType && agreementDetails,
    });

    if (!(open && !pdfUrl && agreementType && agreementDetails)) {
      console.log("Early return from useEffect - conditions not met");
      return;
    }

    let cancelled = false;

    const generatePreview = async () => {
      setIsLoading(true);
      try {
        console.log("Starting PDF generation with details:", agreementDetails);

        const [aswennaLogoDataUrl, governmentLogoDataUrl] = await Promise.all([
          imageUrlToPngDataUrl(aswennaMainLogo),
          imageUrlToPngDataUrl(sriLankaGovernmentLogo),
        ]);

        if (cancelled) return;

        const base: AgreementDetails = {
          agreementType,
          aswennaLogoDataUrl,
          governmentLogoDataUrl,
          investorName: agreementDetails.investorName ?? "N/A",
          investorNIC: agreementDetails.investorNIC,
          investorContact: agreementDetails.investorContact,
          counterpartyName: agreementDetails.counterpartyName ?? "N/A",
          counterpartyNIC: agreementDetails.counterpartyNIC,
          counterpartyContact: agreementDetails.counterpartyContact,
          projectRefId: agreementDetails.projectRefId,
          targetCrop: agreementDetails.targetCrop,
          propertyLocation: agreementDetails.propertyLocation,
          acreage: agreementDetails.acreage,
          designatedCultivator: agreementDetails.designatedCultivator,
          leaseDurationMonths: agreementDetails.leaseDurationMonths,
          leaseStartDate: agreementDetails.leaseStartDate,
          leaseEndDate: agreementDetails.leaseEndDate,
          grossMonthlyRental: agreementDetails.grossMonthlyRental,
          estimatedStartDate: agreementDetails.estimatedStartDate,
          estimatedEndDate: agreementDetails.estimatedEndDate,
          totalGrossInvestment: agreementDetails.totalGrossInvestment,
          milestones: agreementDetails.milestones,
        };

        console.log("Calling generateAgreementPDFForPreview with base:", base);
        const doc = generateAgreementPDFForPreview(base);
        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        console.log("PDF generated successfully, blob size:", blob.size);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
        console.error(
          "Stack trace:",
          error instanceof Error ? error.stack : "N/A",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void generatePreview();

    return () => {
      cancelled = true;
    };
  }, [open, agreementType, agreementDetails, pdfUrl]);

  const handleModalClose = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: "#09090B",
          backgroundImage:
            "linear-gradient(135deg, rgba(133,164,70,0.05) 0%, rgba(174,217,92,0.02) 100%)",
          borderRadius: "16px",
          border: "1px solid rgba(133,164,70,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          pb: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <FilePresent sx={{ color: "#aed95c" }} />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: -0.3,
              }}
            >
              Agreement Preview
            </Typography>
            <Typography variant="caption" sx={{ color: "#71717A" }}>
              {agreementType === "Investor-Landowner"
                ? "Land Lease Agreement"
                : "Cultivation & Escrow Agreement"}{" "}
              • {counterpartyName}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          onClick={handleModalClose}
          sx={{
            color: "#a1a1aa",
            "&:hover": {
              color: "#f1f5f9",
              background: "rgba(255,255,255,0.08)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0a",
          height: "60vh",
          maxHeight: "60vh",
          overflow: "hidden",
        }}
      >
        
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            background: "#09090B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            height: "100%",
            maxHeight: "100%",
          }}
        >
          {isLoading ? (
            <Stack alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "3px solid rgba(133,164,70,0.2)",
                  borderTop: "3px solid #aed95c",
                  animation: "spin 1s linear infinite",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
              <Typography variant="body2" sx={{ color: "#71717A" }}>
                Generating agreement...
              </Typography>
            </Stack>
          ) : pdfUrl ? (
            <Box
              component="iframe"
              src={pdfUrl}
              sx={{
                width: "90%",
                height: "90%",
                border: "none",
                borderRadius: "8px",
                maxWidth: "60vw",
              }}
            />
          ) : (
            <Stack alignItems="center" spacing={2}>
              <FilePresent
                sx={{ fontSize: 48, color: "#85a446", opacity: 0.3 }}
              />
              <Typography variant="body2" sx={{ color: "#71717A" }}>
                Unable to load agreement preview
              </Typography>
            </Stack>
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

        
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            Gap: 2,
            background: "rgba(0,0,0,0.4)",
            borderTop: "1px solid rgba(133,164,70,0.15)",
          }}
        >
          <Stack direction="row" spacing={1}>
            <button
              onClick={() => {
                if (pdfUrl) {
                  const link = document.createElement("a");
                  link.href = pdfUrl;
                  link.download = `agreement-${agreementType}-${new Date().getTime()}.pdf`;
                  link.click();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid rgba(133,164,70,0.4)",
                background: "transparent",
                color: "#aed95c",
                fontSize: "0.87rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(133,164,70,0.1)";
                e.currentTarget.style.borderColor = "#aed95c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(133,164,70,0.4)";
              }}
            >
              <Download sx={{ fontSize: 18 }} />
              Download for Review
            </button>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <button
              onClick={handleModalClose}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "#a1a1aa",
                fontSize: "0.87rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              Reject Changes
            </button>

            <button
              onClick={() => {
                handleModalClose();
                onConfirmUpload();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #85a446 0%, #aed95c 100%)",
                color: "#fff",
                fontSize: "0.87rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(133,164,70,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(133,164,70,0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(133,164,70,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Upload sx={{ fontSize: 18 }} />
              Upload Agreement
            </button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementPreviewModal;
