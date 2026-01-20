import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { EscrowAccount, Transaction } from '@/types/admin.types';
import {
    AccountBalanceWallet,
    AttachMoney,
    Download,
    Search,
    SwapHoriz,
    TrendingUp
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControl, Grid, InputAdornment,
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
    Typography
} from '@mui/material';
import { useState } from 'react';

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    transactionId: 'TXN-2026-00234',
    type: 'payment',
    payer: { id: 'INV-012', name: 'Green Future Investments', role: 'investor' },
    payee: { id: 'FAR-089', name: 'Nimal Fernando', role: 'farmer' },
    projectId: 'PRJ-045',
    projectName: 'Rice Cultivation - Polonnaruwa',
    amount: 250000,
    currency: 'LKR',
    date: '2026-01-20T08:30:00',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    description: 'Milestone 2 Payment - Land Preparation',
    milestoneId: 'MIL-045-02',
    milestoneName: 'Land Preparation',
  },
  {
    id: '2',
    transactionId: 'TXN-2026-00233',
    type: 'escrow_deposit',
    payer: { id: 'INV-034', name: 'Agri Ventures PLC', role: 'investor' },
    payee: { id: 'ESCROW', name: 'Platform Escrow', role: 'superadmin' },
    projectId: 'PRJ-102',
    projectName: 'Fruit Orchard - Matale',
    amount: 500000,
    currency: 'LKR',
    date: '2026-01-19T14:15:00',
    status: 'in_escrow',
    description: 'Initial Investment Deposit',
  },
  {
    id: '3',
    transactionId: 'TXN-2026-00232',
    type: 'payment',
    payer: { id: 'FAR-156', name: 'Sunita Jayawardena', role: 'farmer' },
    payee: { id: 'LND-042', name: 'Rathnayake Properties', role: 'landowner' },
    projectId: 'PRJ-078',
    projectName: 'Vegetable Farm - Kurunegala',
    amount: 35000,
    currency: 'LKR',
    date: '2026-01-19T11:45:00',
    status: 'completed',
    paymentMethod: 'Mobile Payment',
    description: 'Monthly Rent Payment',
  },
  {
    id: '4',
    transactionId: 'TXN-2026-00231',
    type: 'escrow_release',
    payer: { id: 'ESCROW', name: 'Platform Escrow', role: 'superadmin' },
    payee: { id: 'FAR-089', name: 'Nimal Fernando', role: 'farmer' },
    projectId: 'PRJ-045',
    projectName: 'Rice Cultivation - Polonnaruwa',
    amount: 200000,
    currency: 'LKR',
    date: '2026-01-18T16:20:00',
    status: 'completed',
    description: 'Milestone 1 Completion - Escrow Release',
    milestoneId: 'MIL-045-01',
    milestoneName: 'Site Survey',
  },
  {
    id: '5',
    transactionId: 'TXN-2026-00230',
    type: 'platform_fee',
    payer: { id: 'INV-012', name: 'Green Future Investments', role: 'investor' },
    payee: { id: 'PLATFORM', name: 'Aswenna Platform', role: 'superadmin' },
    projectId: 'PRJ-045',
    projectName: 'Rice Cultivation - Polonnaruwa',
    amount: 12500,
    currency: 'LKR',
    date: '2026-01-18T16:22:00',
    status: 'completed',
    description: 'Platform Service Fee (5%)',
  },
  {
    id: '6',
    transactionId: 'TXN-2026-00229',
    type: 'payment',
    payer: { id: 'INV-067', name: 'Smart Agri Investments', role: 'investor' },
    payee: { id: 'FAR-234', name: 'Prasanna Silva', role: 'farmer' },
    projectId: 'PRJ-133',
    projectName: 'Coconut Plantation - Gampaha',
    amount: 180000,
    currency: 'LKR',
    date: '2026-01-18T10:30:00',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    description: 'Milestone 3 Payment - Planting',
  },
  {
    id: '7',
    transactionId: 'TXN-2026-00228',
    type: 'refund',
    payer: { id: 'ESCROW', name: 'Platform Escrow', role: 'superadmin' },
    payee: { id: 'INV-045', name: 'Investor Corp Ltd', role: 'investor' },
    projectId: 'PRJ-067',
    projectName: 'Tea Plantation - Nuwara Eliya',
    amount: 75000,
    currency: 'LKR',
    date: '2026-01-17T09:15:00',
    status: 'completed',
    description: 'Partial Refund - Project Cancellation',
  },
  {
    id: '8',
    transactionId: 'TXN-2026-00227',
    type: 'payment',
    payer: { id: 'FAR-089', name: 'Nimal Fernando', role: 'farmer' },
    payee: { id: 'LND-023', name: 'Silva Estates', role: 'landowner' },
    projectId: 'PRJ-045',
    projectName: 'Rice Cultivation - Polonnaruwa',
    amount: 50000,
    currency: 'LKR',
    date: '2026-01-17T08:00:00',
    status: 'failed',
    paymentMethod: 'Bank Transfer',
    description: 'Monthly Rent Payment - Failed',
  },
];

const mockEscrowAccounts: EscrowAccount[] = [
  {
    projectId: 'PRJ-102',
    projectName: 'Fruit Orchard - Matale',
    totalDeposited: 500000,
    totalReleased: 0,
    currentBalance: 500000,
    pendingReleases: 150000,
    lastUpdated: '2026-01-19T14:15:00',
  },
  {
    projectId: 'PRJ-045',
    projectName: 'Rice Cultivation - Polonnaruwa',
    totalDeposited: 600000,
    totalReleased: 200000,
    currentBalance: 400000,
    pendingReleases: 250000,
    lastUpdated: '2026-01-20T08:30:00',
  },
  {
    projectId: 'PRJ-133',
    projectName: 'Coconut Plantation - Gampaha',
    totalDeposited: 800000,
    totalReleased: 320000,
    currentBalance: 480000,
    pendingReleases: 180000,
    lastUpdated: '2026-01-18T10:30:00',
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_escrow':
      return 'info';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    case 'disputed':
      return 'error';
    default:
      return 'default';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'payment':
      return 'primary';
    case 'escrow_deposit':
      return 'info';
    case 'escrow_release':
      return 'success';
    case 'refund':
      return 'warning';
    case 'platform_fee':
      return 'secondary';
    default:
      return 'default';
  }
};

const GlobalPaymentLedger = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [escrowAccounts] = useState<EscrowAccount[]>(mockEscrowAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.payer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.payee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.projectName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalEscrowBalance = escrowAccounts.reduce(
    (sum, acc) => sum + acc.currentBalance,
    0
  );
  const totalPendingReleases = escrowAccounts.reduce(
    (sum, acc) => sum + acc.pendingReleases,
    0
  );
  const totalProcessed = transactions.reduce(
    (sum, txn) => (txn.status === 'completed' ? sum + txn.amount : sum),
    0
  );

  return (
    <DashboardLayout>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountBalanceWallet color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Total Escrow Balance
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {formatCurrency(totalEscrowBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SwapHoriz color="info" />
                <Typography variant="body2" color="text.secondary">
                  Pending Releases
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {formatCurrency(totalPendingReleases)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp color="success" />
                <Typography variant="body2" color="text.secondary">
                  Total Processed
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoney color="warning" />
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {transactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Escrow Accounts Overview */}
      <Card sx={{ mb: 3 }}>
        <CardHeaderWithIcon
          icon={AccountBalanceWallet}
          title="Active Escrow Accounts"
        />
        <CardContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell align="right">Total Deposited</TableCell>
                  <TableCell align="right">Released</TableCell>
                  <TableCell align="right">Current Balance</TableCell>
                  <TableCell align="right">Pending Release</TableCell>
                  <TableCell>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {escrowAccounts.map((account) => (
                  <TableRow key={account.projectId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {account.projectName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {account.projectId}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(account.totalDeposited)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(account.totalReleased)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700} color="primary">
                        {formatCurrency(account.currentBalance)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(account.pendingReleases)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(account.lastUpdated)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Transaction History */}
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
          {/* Filters */}
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
                  <MenuItem value="in_escrow">In Escrow</MenuItem>
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
                  <MenuItem value="escrow_deposit">Escrow Deposit</MenuItem>
                  <MenuItem value="escrow_release">Escrow Release</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="platform_fee">Platform Fee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Transactions Table */}
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
                          {txn.paymentMethod || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={txn.type.replace(/_/g, ' ')}
                          size="small"
                          color={getTypeColor(txn.type) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{txn.payer.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {txn.payer.role}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{txn.payee.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {txn.payee.role}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {txn.projectName || '-'}
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
                          color={getStatusColor(txn.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
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
    </DashboardLayout>
  );
};

export default GlobalPaymentLedger;
