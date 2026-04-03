import type { InvestmentRequest } from "@/types/farmer.types";
import {
  CalendarToday,
  Close,
  Description,
  GetApp,
  Info,
  LocationOn,
  Person,
  Schedule,
  Star,
  TrendingUp,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AppButton } from "../../shared/components";

export interface InvestmentRequestDialogProps {
  request: InvestmentRequest | null;
  open: boolean;
  onClose: () => void;
  onInvest?: (id: string) => void;
}

const InvestmentRequestDialog = ({
  request,
  open,
  onClose,
  onInvest,
}: InvestmentRequestDialogProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!request) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(request.fundingDeadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline();
  const isUrgent = daysLeft <= 7;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: "var(--bg-subtle)",
          borderRadius: 2,
          maxHeight: "92vh",
        },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid var(--border-medium)",
          position: "relative",
          bgcolor: "var(--border-subtle)",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "var(--neutral-350)",
            bgcolor: "var(--bg-overlay)",
            "&:hover": {
              bgcolor: "var(--border-medium)",
              color: "var(--text-primary)",
            },
          }}
        >
          <Close fontSize="small" />
        </IconButton>

        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ color: "var(--text-primary)", mb: 1.5, pr: 6 }}
        >
          {request.projectTitle}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Chip
            label={`INV-${request.id.toUpperCase()}`}
            size="small"
            sx={{
              bgcolor: "var(--bg-overlay)",
              color: "var(--neutral-350)",
              fontWeight: 600,
              fontSize: "0.7rem",
              border: "1px solid var(--border-medium)",
              height: 24,
            }}
          />
          <Chip
            label={request.status.toUpperCase()}
            size="small"
            sx={{
              bgcolor:
                request.status === "open"
                  ? "var(--color-lime)"
                  : "var(--neutral-500)",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.7rem",
              height: 24,
            }}
          />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <CalendarToday sx={{ fontSize: 14, color: "var(--neutral-350)" }} />
            <Typography
              variant="caption"
              sx={{ color: "var(--neutral-350)", fontSize: "0.75rem" }}
            >
              Started{" "}
              {request.createdAt ? formatDate(request.createdAt) : "N/A"}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ p: 3, overflowY: "auto", maxHeight: "calc(92vh - 180px)" }}>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={request.farmerImage}
              alt={request.farmerName}
              sx={{
                width: 60,
                height: 60,
                border: "2px solid var(--color-lime)",
              }}
            >
              <Person />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ color: "var(--text-primary)", mb: 0.5 }}
              >
                {request.farmerName}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Schedule
                    sx={{ fontSize: 16, color: "var(--neutral-350)" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--neutral-350)" }}
                  >
                    {request.farmerExperience}+ years experience
                  </Typography>
                </Stack>
                {request.farmerRating && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Star sx={{ fontSize: 16, color: "var(--color-amber)" }} />
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--neutral-350)" }}
                    >
                      {request.farmerRating} rating
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOn sx={{ fontSize: 18, color: "var(--neutral-350)" }} />
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)" }}
              >
                {request.location}, {request.district}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            bgcolor: "var(--bg-overlay)",
            border: "1px solid var(--border-medium)",
            borderRadius: 2,
            p: 3,
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: "var(--text-primary)",
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component="span" sx={{ fontSize: "1.3rem" }}>
              💰
            </Box>
            Investment Financial Summary
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: "var(--border-subtle)",
                borderRadius: 1.5,
                border: "1px solid var(--border-medium)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "var(--neutral-350)",
                  fontSize: "0.7rem",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Total Investment
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ color: "var(--text-primary)" }}
              >
                {formatCurrency(request.totalInvestmentRequired)}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: "var(--border-subtle)",
                borderRadius: 1.5,
                border: "1px solid var(--border-medium)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "var(--neutral-350)",
                  fontSize: "0.7rem",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Expected ROI
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ color: "var(--color-lime)" }}
              >
                {request.expectedROI}%
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: "var(--border-subtle)",
                borderRadius: 1.5,
                border: "1px solid var(--border-medium)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "var(--neutral-350)",
                  fontSize: "0.7rem",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Project Duration
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ color: "var(--text-primary)" }}
              >
                {request.expectedDuration} months
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: "var(--border-subtle)",
                borderRadius: 1.5,
                border: "1px solid var(--border-medium)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "var(--neutral-350)",
                  fontSize: "0.7rem",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Payment Installments
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ color: "var(--text-primary)" }}
              >
                {request.installmentSchedule?.length ?? 0}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "var(--border-subtle)",
              borderRadius: 1.5,
              border: "1px solid var(--border-medium)",
            }}
          >
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              flexWrap="wrap"
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--neutral-350)",
                    fontSize: "0.7rem",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Investment Type
                </Typography>
                <Chip
                  icon={<Info sx={{ fontSize: 14 }} />}
                  label="Harvest-Based"
                  size="small"
                  sx={{
                    bgcolor: "var(--color-lime-muted)",
                    color: "var(--color-lime)",
                    border: "1px solid var(--color-lime-border)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--neutral-350)",
                    fontSize: "0.7rem",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Crop Type
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: "var(--text-primary)" }}
                >
                  {request.cropType}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--neutral-350)",
                    fontSize: "0.7rem",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Expected Yield
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: "var(--text-primary)" }}
                >
                  {request.expectedYield}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--neutral-350)",
                    fontSize: "0.7rem",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Funding Deadline
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    color: isUrgent
                      ? "var(--color-orange)"
                      : "var(--text-primary)",
                  }}
                >
                  {formatDate(request.fundingDeadline)}{" "}
                  {isUrgent && `(${daysLeft} days left)`}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: "1px solid var(--border-medium)",
              mb: 3,
              "& .MuiTab-root": {
                color: "var(--neutral-350)",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                minHeight: 48,
                "&.Mui-selected": {
                  color: "var(--color-lime)",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "var(--color-lime)",
                height: 3,
              },
            }}
          >
            <Tab label="Project Details" />
            <Tab label="Cost Breakdown" />
            <Tab label="Payment Schedule" />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              <Box
                sx={{
                  bgcolor: "var(--bg-overlay)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: 2,
                  p: 2.5,
                  mb: 3,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{
                    color: "var(--text-primary)",
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Description sx={{ fontSize: 20 }} />
                  Project Description
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                    mb: 2,
                  }}
                >
                  {request.description}
                </Typography>

                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--neutral-350)",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Duration
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: "var(--text-primary)" }}
                    >
                      {request.expectedDuration} months
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--neutral-350)",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Expected Yield
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: "var(--text-primary)" }}
                    >
                      {request.expectedYield}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--neutral-350)",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Crop Type
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ color: "var(--text-primary)" }}
                    >
                      {request.cropType}
                    </Typography>
                  </Box>
                  {isUrgent && (
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "var(--color-orange)",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        ⚠️ Funding Deadline
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ color: "var(--color-orange)" }}
                      >
                        {daysLeft} days left
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box
              sx={{
                bgcolor: "var(--bg-overlay)",
                border: "1px solid var(--border-medium)",
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ color: "var(--text-primary)", mb: 2 }}
              >
                💵 Detailed Cost Breakdown
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "var(--neutral-350)",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderBottom: "1px solid var(--border-medium)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          py: 1.5,
                        }}
                      >
                        Category
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "var(--neutral-350)",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderBottom: "1px solid var(--border-medium)",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          py: 1.5,
                        }}
                      >
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {request.costBreakdown?.map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": { bgcolor: "var(--surface-tint)" },
                        }}
                      >
                        <TableCell
                          sx={{
                            borderBottom: "1px solid var(--border-medium)",
                            py: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: "var(--text-primary)", mb: 0.5 }}
                          >
                            {item.category}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "var(--neutral-350)" }}
                          >
                            {item.description}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: "var(--text-secondary)",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            borderBottom: "1px solid var(--border-medium)",
                          }}
                        >
                          {formatCurrency(item.estimatedCost)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "var(--text-primary)",
                          fontWeight: 700,
                          fontSize: "1rem",
                          borderTop: "2px solid var(--border-medium)",
                          borderBottom: "none",
                          py: 2,
                        }}
                      >
                        Total Investment Required
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "var(--color-lime)",
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          borderTop: "2px solid var(--border-medium)",
                          borderBottom: "none",
                        }}
                      >
                        {formatCurrency(request.totalInvestmentRequired)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {activeTab === 2 && (
            <Box
              sx={{
                bgcolor: "var(--bg-overlay)",
                border: "1px solid var(--border-medium)",
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ color: "var(--text-primary)", mb: 2 }}
              >
                📅 Payment Schedule ({request.installmentSchedule?.length ?? 0}{" "}
                Installments)
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "var(--neutral-350)",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderBottom: "1px solid var(--border-medium)",
                          textTransform: "uppercase",
                          py: 1.5,
                          width: 60,
                        }}
                      >
                        #
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "var(--neutral-350)",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderBottom: "1px solid var(--border-medium)",
                          textTransform: "uppercase",
                          py: 1.5,
                        }}
                      >
                        Milestone
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "var(--neutral-350)",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderBottom: "1px solid var(--border-medium)",
                          textTransform: "uppercase",
                          py: 1.5,
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "var(--neutral-350)",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderBottom: "1px solid var(--border-medium)",
                          textTransform: "uppercase",
                          py: 1.5,
                        }}
                      >
                        Due Date
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "var(--neutral-350)",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderBottom: "1px solid var(--border-medium)",
                          textTransform: "uppercase",
                          py: 1.5,
                        }}
                      >
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {request.installmentSchedule?.map((installment) => (
                      <TableRow
                        key={installment.id}
                        sx={{
                          "&:hover": { bgcolor: "var(--surface-tint)" },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "var(--text-secondary)",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            borderBottom: "1px solid var(--border-medium)",
                          }}
                        >
                          {installment.installmentNumber}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "var(--text-primary)",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid var(--border-medium)",
                            fontWeight: 500,
                          }}
                        >
                          {installment.milestone}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: "var(--text-secondary)",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            borderBottom: "1px solid var(--border-medium)",
                          }}
                        >
                          {formatCurrency(installment.amount)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: "var(--neutral-350)",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid var(--border-medium)",
                          }}
                        >
                          {formatDate(installment.dueDate)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: "1px solid var(--border-medium)",
                          }}
                        >
                          <Chip
                            label={
                              installment.status?.toUpperCase() || "PENDING"
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                installment.status === "paid"
                                  ? "var(--color-lime-muted-strong)"
                                  : "var(--color-orange-muted)",
                              color:
                                installment.status === "paid"
                                  ? "var(--color-lime)"
                                  : "var(--color-amber)",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              height: 22,
                              border:
                                installment.status === "paid"
                                  ? "1px solid var(--color-lime-border)"
                                  : "1px solid var(--color-orange-border)",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          p: 2.5,
          borderTop: "1px solid var(--border-medium)",
          bgcolor: "var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <AppButton variant="outline" size="md" onClick={onClose}>
          Close
        </AppButton>
        <Stack direction="row" spacing={2}>
          <AppButton variant="success" size="md" leadingIcon={<GetApp />}>
            Download Full Report
          </AppButton>
          <AppButton
            variant={request.status === "open" ? "success" : "neutral"}
            size="md"
            leadingIcon={<TrendingUp />}
            onClick={() => {
              onInvest?.(request.id);
              onClose();
            }}
            disabled={request.status !== "open"}
          >
            {request.status === "open" ? "Invest Now" : "Not Available"}
          </AppButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default InvestmentRequestDialog;
