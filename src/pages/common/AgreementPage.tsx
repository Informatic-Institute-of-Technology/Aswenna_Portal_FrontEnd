import { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Download,
  Print,
  VerifiedUser,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Mock agreement data - TODO: Fetch from API
const agreementData = {
  projectId: "GH-RICE-042",
  serialNo: "AGR-2024-0892-GH",
  effectiveDate: "Oct 24, 2024",
  jurisdiction: "Western Province",
  farmer: {
    name: "Mod Goviya",
    digitalId: "MKN-15-12-52",
    timestamp: "2024-10-24 11:12:56 UTC",
    ip: "192.168.1.42",
  },
  investor: {
    name: "H. C. Partners Ltd.",
    digitalId: "2889-09-778",
    timestamp: "2024-10-24 14:56:43 UTC",
    ip: "45.12.32.145",
  },
  investmentAmount: "$25,000.00 USD",
  cropDetails:
    "15 acres of Organic Basmati Rice on the designated Golden Harvest land plot",
  profitSplit: { investor: 60, farmer: 40 },
  distributionDays: 14,
};

const AgreementPage = () => {
  const navigate = useNavigate();
  const agreementRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!agreementRef.current) return;

    try {
      const canvas = await html2canvas(agreementRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#111a11",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
      );
      pdf.save(`Agreement_${agreementData.projectId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePrint = () => {
    const printContent = agreementRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Legal Investment Agreement - ${agreementData.projectId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              background: #fff; 
              color: #333;
              padding: 40px;
              line-height: 1.6;
            }
            .agreement-container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #4CAF50; padding-bottom: 15px; }
            .title { font-size: 24px; font-weight: bold; color: #1a1a1a; }
            .serial { font-size: 12px; color: #666; margin-top: 5px; }
            .project-id { text-align: right; }
            .project-id-label { font-size: 10px; color: #888; letter-spacing: 1px; }
            .project-id-value { font-size: 16px; color: #4CAF50; font-weight: 600; }
            .chips { display: flex; gap: 10px; margin-bottom: 25px; }
            .chip { padding: 6px 12px; border-radius: 16px; font-size: 12px; }
            .chip-green { background: #e8f5e9; color: #2e7d32; }
            .chip-gray { background: #f5f5f5; color: #666; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; }
            .section-content { font-size: 13px; color: #555; }
            .highlight { color: #4CAF50; font-weight: 600; }
            .strong { color: #1a1a1a; font-weight: 600; }
            .divider { border-top: 1px solid #e0e0e0; margin: 25px 0; }
            .signature-section { text-align: center; margin-bottom: 20px; }
            .signature-label { font-size: 10px; color: #888; letter-spacing: 1px; }
            .signatures { display: flex; justify-content: space-around; margin: 25px 0; }
            .signature-box { text-align: center; flex: 1; }
            .verified { color: #4CAF50; font-size: 10px; margin-bottom: 8px; }
            .signature-name { font-size: 20px; font-style: italic; color: #4CAF50; margin-bottom: 10px; }
            .signature-details { font-size: 10px; color: #888; }
            .executed-badge { text-align: center; margin: 25px 0; }
            .badge { display: inline-block; padding: 10px 20px; background: #e8f5e9; color: #4CAF50; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .blockchain { text-align: center; font-size: 10px; color: #aaa; margin: 15px 0; }
            .footer { text-align: center; font-size: 11px; color: #888; margin-top: 20px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="agreement-container">
            <div class="header">
              <div>
                <div class="title">Legal Investment Agreement</div>
                <div class="serial">Serial No: ${agreementData.serialNo}</div>
              </div>
              <div class="project-id">
                <div class="project-id-label">PROJECT ID</div>
                <div class="project-id-value">${agreementData.projectId}</div>
              </div>
            </div>
            
            <div class="chips">
              <span class="chip chip-green">Effective Date: ${agreementData.effectiveDate}</span>
              <span class="chip chip-gray">Jurisdiction: ${agreementData.jurisdiction}</span>
            </div>
            
            <div class="section">
              <div class="section-title">1. PARTIES INVOLVED</div>
              <div class="section-content">
                This Agricultural Investment Agreement ("Agreement") is entered into as of the Effective Date
                by and between <span class="highlight">${agreementData.farmer.name}</span>, hereinafter referred to as the "Farmer", and
                <span class="highlight">${agreementData.investor.name}</span>, hereinafter referred to as the "Investor".
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">2. SCOPE OF INVESTMENT</div>
              <div class="section-content">
                The Investor agrees to provide capital in the amount of <span class="strong">${agreementData.investmentAmount}</span> for the specific purpose
                of cultivating ${agreementData.cropDetails}. These funds shall be utilized exclusively for seeds,
                organic fertilizers, labor, and specialized irrigation maintenance.
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">3. PROFIT SHARING & DISTRIBUTIONS</div>
              <div class="section-content">
                Net profits from the harvest shall be distributed as follows: Sixty percent (${agreementData.profitSplit.investor}%) to the Investor
                and Forty percent (${agreementData.profitSplit.farmer}%) to the Farmer. Distributions will be executed within ${agreementData.distributionDays} business days
                following the successful sale of the crop to certified organic wholesalers.
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">4. RISK DISCLOSURE</div>
              <div class="section-content">
                Both parties acknowledge that agricultural ventures are subject to environmental factors. In the
                event of a total crop failure due to "Act of God" circumstances, the liability of the Farmer shall be
                limited to the salvage value of the assets remaining, as per the catastrophic insurance policy
                attached in Annex A.
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">5. GOVERNING LAW</div>
              <div class="section-content">
                This Agreement shall be governed by and construed in accordance with the laws of the Republic,
                specifically under the Commercial Agriculture Act of 2018. Any disputes shall be resolved
                through binding arbitration in the regional court of commerce.
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="signature-section">
              <div class="signature-label">E-SIGNATURE VERIFICATION</div>
            </div>
            
            <div class="signatures">
              <div class="signature-box">
                <div class="verified">✓ VERIFIED DIGITALLY</div>
                <div class="signature-name">${agreementData.farmer.name}</div>
                <div class="signature-details">Digital ID: ${agreementData.farmer.digitalId}</div>
                <div class="signature-details">Timestamp: ${agreementData.farmer.timestamp}</div>
                <div class="signature-details">IP: ${agreementData.farmer.ip}</div>
              </div>
              <div class="signature-box">
                <div class="verified">✓ VERIFIED DIGITALLY</div>
                <div class="signature-name">${agreementData.investor.name}</div>
                <div class="signature-details">Digital ID: ${agreementData.investor.digitalId}</div>
                <div class="signature-details">Timestamp: ${agreementData.investor.timestamp}</div>
                <div class="signature-details">IP: ${agreementData.investor.ip}</div>
              </div>
            </div>
            
            <div class="executed-badge">
              <span class="badge">✓ DOCUMENT FULLY EXECUTED & LEGALLY BINDING</span>
            </div>
            
            <div class="blockchain">
              Blockchain Hash: 7a3e8f4a-89c1-4fd3-aeb3-893bb2249919
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
              This is a legally binding electronic record under the Electronic Transactions Act.<br>
              Need assistance? Contact our legal support team.
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0a0f0a" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "#0d120d",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ color: "rgba(255,255,255,0.6)" }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "1px",
                fontWeight: 500,
              }}
            >
              LEGAL AGREEMENT VIEW
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="text"
              startIcon={<Download />}
              onClick={handleDownloadPDF}
              sx={{
                color: "rgba(255,255,255,0.7)",
                textTransform: "none",
                fontSize: "0.8rem",
              }}
            >
              Download PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<Print />}
              onClick={handlePrint}
              sx={{
                backgroundColor: "#4CAF50",
                textTransform: "none",
                fontSize: "0.8rem",
                px: 2,
                "&:hover": { backgroundColor: "#3d8b40" },
              }}
            >
              Print
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
          <Card
            ref={agreementRef}
            sx={{
              backgroundColor: "#111a11",
              border: "1px solid rgba(133, 164, 70, 0.15)",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Title & Project ID */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}
                  >
                    Legal Investment Agreement
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}
                  >
                    Serial No: {agreementData.serialNo}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      fontSize: "0.6rem",
                      letterSpacing: "0.5px",
                    }}
                  >
                    PROJECT ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#4CAF50", fontWeight: 600 }}
                  >
                    {agreementData.projectId}
                  </Typography>
                </Box>
              </Box>

              {/* Date & Jurisdiction Chips */}
              <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                <Chip
                  label={`Effective Date: ${agreementData.effectiveDate}`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(133, 164, 70, 0.15)",
                    color: "#4CAF50",
                    fontSize: "0.7rem",
                    height: 26,
                  }}
                />
                <Chip
                  label={`Jurisdiction: ${agreementData.jurisdiction}`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.7rem",
                    height: 26,
                  }}
                />
              </Box>

              {/* Agreement Sections */}
              <Box sx={{ "& > div": { mb: 2.5 } }}>
                {/* Section 1 */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#fff", fontWeight: 600, mb: 0.75 }}
                  >
                    1. PARTIES INVOLVED
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                    }}
                  >
                    This Agricultural Investment Agreement ("Agreement") is
                    entered into as of the Effective Date by and between{" "}
                    <strong style={{ color: "#4CAF50" }}>
                      {agreementData.farmer.name}
                    </strong>
                    , hereinafter referred to as the "Farmer", and{" "}
                    <strong style={{ color: "#4CAF50" }}>
                      {agreementData.investor.name}
                    </strong>
                    , hereinafter referred to as the "Investor".
                  </Typography>
                </Box>

                {/* Section 2 */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#fff", fontWeight: 600, mb: 0.75 }}
                  >
                    2. SCOPE OF INVESTMENT
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                    }}
                  >
                    The Investor agrees to provide capital in the amount of{" "}
                    <strong style={{ color: "#fff" }}>
                      {agreementData.investmentAmount}
                    </strong>{" "}
                    for the specific purpose of cultivating{" "}
                    {agreementData.cropDetails}. These funds shall be utilized
                    exclusively for seeds, organic fertilizers, labor, and
                    specialized irrigation maintenance.
                  </Typography>
                </Box>

                {/* Section 3 */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#fff", fontWeight: 600, mb: 0.75 }}
                  >
                    3. PROFIT SHARING & DISTRIBUTIONS
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                    }}
                  >
                    Net profits from the harvest shall be distributed as
                    follows: Sixty percent ({agreementData.profitSplit.investor}
                    %) to the Investor and Forty percent (
                    {agreementData.profitSplit.farmer}%) to the Farmer.
                    Distributions will be executed within{" "}
                    {agreementData.distributionDays} business days following the
                    successful sale of the crop to certified organic
                    wholesalers.
                  </Typography>
                </Box>

                {/* Section 4 */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#fff", fontWeight: 600, mb: 0.75 }}
                  >
                    4. RISK DISCLOSURE
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                    }}
                  >
                    Both parties acknowledge that agricultural ventures are
                    subject to environmental factors. In the event of a total
                    crop failure due to "Act of God" circumstances, the
                    liability of the Farmer shall be limited to the salvage
                    value of the assets remaining, as per the catastrophic
                    insurance policy attached in Annex A.
                  </Typography>
                </Box>

                {/* Section 5 */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#fff", fontWeight: 600, mb: 0.75 }}
                  >
                    5. GOVERNING LAW
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                    }}
                  >
                    This Agreement shall be governed by and construed in
                    accordance with the laws of the Republic, specifically under
                    the Commercial Agriculture Act of 2018. Any disputes shall
                    be resolved through binding arbitration in the regional
                    court of commerce.
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 3 }} />

              {/* E-Signature Section */}
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "1px",
                    fontSize: "0.65rem",
                  }}
                >
                  E-SIGNATURE VERIFICATION
                </Typography>
              </Box>

              {/* Signatures Grid */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  gap: 3,
                  mb: 3,
                }}
              >
                {/* Farmer Signature */}
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <VerifiedUser sx={{ color: "#4CAF50", fontSize: 14 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#4CAF50",
                        fontSize: "0.6rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      VERIFIED DIGITALLY
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4CAF50",
                      fontFamily: "'Brush Script MT', cursive",
                      fontSize: "1.5rem",
                      mb: 1,
                    }}
                  >
                    {agreementData.farmer.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      fontSize: "0.6rem",
                    }}
                  >
                    Digital ID: {agreementData.farmer.digitalId}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      fontSize: "0.6rem",
                    }}
                  >
                    Timestamp: {agreementData.farmer.timestamp}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      fontSize: "0.6rem",
                    }}
                  >
                    IP: {agreementData.farmer.ip}
                  </Typography>
                </Box>

                {/* Investor Signature */}
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <VerifiedUser sx={{ color: "#4CAF50", fontSize: 14 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#4CAF50",
                        fontSize: "0.6rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      VERIFIED DIGITALLY
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4CAF50",
                      fontFamily: "'Brush Script MT', cursive",
                      fontSize: "1.5rem",
                      mb: 1,
                    }}
                  >
                    {agreementData.investor.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      fontSize: "0.6rem",
                    }}
                  >
                    Digital ID: {agreementData.investor.digitalId}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      fontSize: "0.6rem",
                    }}
                  >
                    Timestamp: {agreementData.investor.timestamp}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.4)",
                      display: "block",
                      fontSize: "0.6rem",
                    }}
                  >
                    IP: {agreementData.investor.ip}
                  </Typography>
                </Box>
              </Box>

              {/* Executed Badge */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Chip
                  icon={<CheckCircle sx={{ fontSize: 16 }} />}
                  label="DOCUMENT FULLY EXECUTED & LEGALLY BINDING"
                  sx={{
                    backgroundColor: "rgba(133, 164, 70, 0.2)",
                    color: "#4CAF50",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    py: 2,
                    px: 1,
                    "& .MuiChip-icon": { color: "#4CAF50" },
                  }}
                />
              </Box>

              {/* Blockchain Hash */}
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.3)",
                  display: "block",
                  textAlign: "center",
                  fontSize: "0.6rem",
                  mb: 2,
                }}
              >
                Blockchain Hash: 7a3e8f4a-89c1-4fd3-aeb3-893bb2249919
              </Typography>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 2 }} />

              {/* Footer */}
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  display: "block",
                  textAlign: "center",
                  fontSize: "0.65rem",
                  lineHeight: 1.6,
                }}
              >
                This is a legally binding electronic record under the Electronic
                Transactions Act.
                <br />
                Need assistance?{" "}
                <span style={{ color: "#4CAF50", cursor: "pointer" }}>
                  Contact our legal support team
                </span>
                .
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
  );
};

export default AgreementPage;
