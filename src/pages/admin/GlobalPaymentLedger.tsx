import { CardHeaderWithIcon } from "@/components";
import type { Transaction } from "@/types/admin.types";
import {
  AttachMoney,
  CheckCircle,
  Download,
  Search,
  Sync,
  TrendingUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    transactionId: "TXN-2026-00234",
    type: "payment",
    payer: {
      id: "INV-012",
      name: "Green Future Investments",
      role: "investor",
    },
    payee: { id: "FAR-089", name: "Nimal Fernando", role: "farmer" },
    projectId: "PRJ-045",
    projectName: "Rice Cultivation - Polonnaruwa",
    amount: 250000,
    currency: "LKR",
    date: "2026-01-20T08:30:00",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "Milestone 2 Payment - Land Preparation",
    milestoneId: "MIL-045-02",
    milestoneName: "Land Preparation",
  },
  {
    id: "2",
    transactionId: "TXN-2026-00233",
    type: "payment",
    payer: { id: "INV-034", name: "Agri Ventures PLC", role: "investor" },
    payee: { id: "FAR-102", name: "Kamal Perera", role: "farmer" },
    projectId: "PRJ-102",
    projectName: "Fruit Orchard - Matale",
    amount: 500000,
    currency: "LKR",
    date: "2026-01-19T14:15:00",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "Initial Project Investment Payment",
  },
  {
    id: "3",
    transactionId: "TXN-2026-00232",
    type: "payment",
    payer: { id: "FAR-156", name: "Sunita Jayawardena", role: "farmer" },
    payee: { id: "LND-042", name: "Rathnayake Properties", role: "landowner" },
    projectId: "PRJ-078",
    projectName: "Vegetable Farm - Kurunegala",
    amount: 35000,
    currency: "LKR",
    date: "2026-01-19T11:45:00",
    status: "completed",
    paymentMethod: "Mobile Payment",
    description: "Monthly Rent Payment",
  },
  {
    id: "4",
    transactionId: "TXN-2026-00231",
    type: "payment",
    payer: { id: "INV-089", name: "AgroTech Investors", role: "investor" },
    payee: { id: "FAR-089", name: "Nimal Fernando", role: "farmer" },
    projectId: "PRJ-045",
    projectName: "Rice Cultivation - Polonnaruwa",
    amount: 200000,
    currency: "LKR",
    date: "2026-01-18T16:20:00",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "Milestone 1 Completion Payment",
    milestoneId: "MIL-045-01",
    milestoneName: "Site Survey",
  },
  {
    id: "5",
    transactionId: "TXN-2026-00230",
    type: "platform_fee",
    payer: {
      id: "INV-012",
      name: "Green Future Investments",
      role: "investor",
    },
    payee: { id: "PLATFORM", name: "Aswenna Platform", role: "superadmin" },
    projectId: "PRJ-045",
    projectName: "Rice Cultivation - Polonnaruwa",
    amount: 12500,
    currency: "LKR",
    date: "2026-01-18T16:22:00",
    status: "completed",
    description: "Platform Service Fee (5%)",
  },
  {
    id: "6",
    transactionId: "TXN-2026-00229",
    type: "payment",
    payer: { id: "INV-067", name: "Smart Agri Investments", role: "investor" },
    payee: { id: "FAR-234", name: "Prasanna Silva", role: "farmer" },
    projectId: "PRJ-133",
    projectName: "Coconut Plantation - Gampaha",
    amount: 180000,
    currency: "LKR",
    date: "2026-01-18T10:30:00",
    status: "pending",
    paymentMethod: "Bank Transfer",
    description: "Milestone 3 Payment - Planting",
  },
  {
    id: "7",
    transactionId: "TXN-2026-00228",
    type: "refund",
    payer: { id: "PLATFORM", name: "Aswenna Platform", role: "superadmin" },
    payee: { id: "INV-045", name: "Investor Corp Ltd", role: "investor" },
    projectId: "PRJ-067",
    projectName: "Tea Plantation - Nuwara Eliya",
    amount: 75000,
    currency: "LKR",
    date: "2026-01-17T09:15:00",
    status: "completed",
    paymentMethod: "Bank Transfer",
    description: "Partial Refund - Project Cancellation",
  },
  {
    id: "8",
    transactionId: "TXN-2026-00227",
    type: "payment",
    payer: { id: "FAR-089", name: "Nimal Fernando", role: "farmer" },
    payee: { id: "LND-023", name: "Silva Estates", role: "landowner" },
    projectId: "PRJ-045",
    projectName: "Rice Cultivation - Polonnaruwa",
    amount: 50000,
    currency: "LKR",
    date: "2026-01-17T08:00:00",
    status: "failed",
    paymentMethod: "Bank Transfer",
    description: "Monthly Rent Payment - Failed",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return { backgroundColor: "var(--color-brand-primary-hover)", color: "var(--text-primary)" };
    case "pending":
      return { backgroundColor: "var(--color-orange)", color: "var(--text-primary)" };
    case "failed":
      return { backgroundColor: "var(--color-overdue)", color: "var(--text-primary)" };
    case "disputed":
      return { backgroundColor: "var(--color-overdue)", color: "var(--text-primary)" };
    default:
      return { backgroundColor: "var(--neutral-500)", color: "var(--text-primary)" };
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "payment":
      return { backgroundColor: "var(--color-info-blue)", color: "var(--text-primary)" };
    case "refund":
      return { backgroundColor: "var(--color-orange)", color: "var(--text-primary)" };
    case "platform_fee":
      return { backgroundColor: "var(--color-purple)", color: "var(--text-primary)" };
    default:
      return { backgroundColor: "var(--neutral-500)", color: "var(--text-primary)" };
  }
};

const GlobalPaymentLedger = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [platformPage, setPlatformPage] = useState(0);
  const [platformRowsPerPage, setPlatformRowsPerPage] = useState(5);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.payer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.payee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.projectName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesType = typeFilter === "all" || txn.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPayments = transactions.reduce(
    (sum, txn) => (txn.type === "payment" ? sum + txn.amount : sum),
    0,
  );
  const totalRefunds = transactions.reduce(
    (sum, txn) => (txn.type === "refund" ? sum + txn.amount : sum),
    0,
  );
  const totalProcessed = transactions.reduce(
    (sum, txn) => (txn.status === "completed" ? sum + txn.amount : sum),
    0,
  );
  const pendingTransactions = transactions.filter(
    (txn) => txn.status === "pending",
  ).length;

  const platformTransactions = transactions.filter(
    (txn) => txn.type === "platform_fee" || txn.payee.id === "PLATFORM",
  );

  const totalPlatformEarnings = platformTransactions.reduce(
    (sum, txn) => sum + txn.amount,
    0,
  );

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <AttachMoney color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Total Payments
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {formatCurrency(totalPayments)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Sync color="info" />
                <Typography variant="body2" color="text.secondary">
                  Total Refunds
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {formatCurrency(totalRefunds)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CheckCircle color="success" />
                <Typography variant="body2" color="text.secondary">
                  Total Completed
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {formatCurrency(totalProcessed)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TrendingUp color="warning" />
                <Typography variant="body2" color="text.secondary">
                  Pending Transactions
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {pendingTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardHeaderWithIcon icon={AttachMoney} title="Platform Payments" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  height: "100%",
                  minHeight: 280,
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 3,
                }}
              >
                <CardContent
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                      }}
                    >
                      <Typography
                        variant="overline"
                        sx={{ opacity: 0.9, letterSpacing: 1.5 }}
                      >
                        Aswenna
                      </Typography>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "var(--surface-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AttachMoney />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.8, display: "block", mb: 1 }}
                      >
                        Total Platform Earnings
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight={700}
                        sx={{ letterSpacing: 1 }}
                      >
                        {formatCurrency(totalPlatformEarnings)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.7, display: "block" }}
                        >
                          Total Transactions
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {platformTransactions.length}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.7, display: "block" }}
                        >
                          Completed
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {
                            platformTransactions.filter(
                              (t) => t.status === "completed",
                            ).length
                          }
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>

                <Box
                  sx={{
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "var(--surface-light)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -80,
                    left: -80,
                    width: 250,
                    height: 250,
                    borderRadius: "50%",
                    background: "var(--surface-muted)",
                  }}
                />
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Transaction History
                  </Typography>

                  {platformTransactions.length > 0 ? (
                    <>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Transaction ID</TableCell>
                              <TableCell>From</TableCell>
                              <TableCell>Project</TableCell>
                              <TableCell align="right">Amount</TableCell>
                              <TableCell align="center">Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {platformTransactions
                              .slice(
                                platformPage * platformRowsPerPage,
                                platformPage * platformRowsPerPage +
                                  platformRowsPerPage,
                              )
                              .map((txn) => (
                                <TableRow key={txn.id} hover>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                    >
                                      {txn.transactionId}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {formatDateTime(txn.date)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {txn.payer.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {txn.payer.role}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      noWrap
                                      sx={{ maxWidth: 150 }}
                                    >
                                      {txn.projectName || "-"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography
                                      variant="body2"
                                      fontWeight={700}
                                      color="primary"
                                    >
                                      {formatCurrency(txn.amount)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Chip
                                      label={txn.status}
                                      size="small"
                                      sx={getStatusColor(txn.status)}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={platformTransactions.length}
                        rowsPerPage={platformRowsPerPage}
                        page={platformPage}
                        onPageChange={(_, newPage) => setPlatformPage(newPage)}
                        onRowsPerPageChange={(e) => {
                          setPlatformRowsPerPage(parseInt(e.target.value, 10));
                          setPlatformPage(0);
                        }}
                      />
                    </>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No platform payment transactions found
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeaderWithIcon
          icon={AttachMoney}
          title="Global Payment Ledger"
          action={
            <Button variant="outlined" startIcon={<Download />} size="small">
              Export
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search by transaction ID, project, or party name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="payment">Payment</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="platform_fee">Platform Fee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((txn) => (
                    <TableRow key={txn.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {txn.transactionId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {txn.paymentMethod || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={txn.type.replace(/_/g, " ")}
                          size="small"
                          sx={getTypeColor(txn.type)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {txn.payer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {txn.payer.role}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {txn.payee.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {txn.payee.role}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: 200 }}
                        >
                          {txn.projectName || "-"}
                        </Typography>
                        {txn.milestoneName && (
                          <Typography variant="caption" color="text.secondary">
                            {txn.milestoneName}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700}>
                          {formatCurrency(txn.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(txn.date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={txn.status}
                          size="small"
                          sx={getStatusColor(txn.status)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default GlobalPaymentLedger;
