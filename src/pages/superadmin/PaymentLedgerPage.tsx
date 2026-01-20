import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AccountBalance,
    Download,
    FilterList,
    TrendingDown,
    TrendingUp,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useState } from 'react';

// Mock transaction data
const transactions = [
  {
    id: 'TXN-2024501',
    date: '2026-01-20 14:30',
    type: 'escrow_deposit',
    from: 'Sarah Investor',
    to: 'Escrow Account',
    amount: '$25,000',
    projectId: 1245,
    projectName: 'Organic Rice Cultivation',
    status: 'completed',
    fee: '$250',
  },
  {
    id: 'TXN-2024502',
    date: '2026-01-20 10:15',
    type: 'milestone_payout',
    from: 'Escrow Account',
    to: 'John Farmer',
    amount: '$15,000',
    projectId: 1245,
    projectName: 'Organic Rice Cultivation',
    status: 'completed',
    fee: '$150',
  },
  {
    id: 'TXN-2024503',
    date: '2026-01-19 16:45',
    type: 'refund',
    from: 'Escrow Account',
    to: 'Helen Invest',
    amount: '$25,000',
    projectId: 1243,
    projectName: 'Fruit Orchard Development',
    status: 'completed',
    fee: '$0',
  },
  {
    id: 'TXN-2024504',
    date: '2026-01-19 09:20',
    type: 'escrow_deposit',
    from: 'David Funds',
    to: 'Escrow Account',
    amount: '$78,000',
    projectId: 1246,
    projectName: 'Vegetable Export Project',
    status: 'pending',
    fee: '$780',
  },
  {
    id: 'TXN-2024505',
    date: '2026-01-18 11:00',
    type: 'land_rental',
    from: 'Escrow Account',
    to: 'Mike Properties',
    amount: '$5,000',
    projectId: 1245,
    projectName: 'Organic Rice Cultivation',
    status: 'completed',
    fee: '$50',
  },
];

const PaymentLedgerPage = () => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalVolume = '$148,000';
  const totalFees = '$1,230';
  const pendingPayments = '$78,000';

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'escrow_deposit':
        return '#3b82f6';
      case 'milestone_payout':
        return '#4CAF50';
      case 'refund':
        return '#FF9800';
      case 'land_rental':
        return '#9C27B0';
      default:
        return '#666';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeaderWithIcon
          icon={AccountBalance}
          title="Transaction Ledger & Payment History"
          action={<Chip label="Real-time Sync" size="small" color="success" />}
        />
        <CardContent>
          {/* Financial Overview */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUp sx={{ color: '#2196F3' }} />
                <Typography variant="body2" color="text.secondary">
                  Total Transaction Volume
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                {totalVolume}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last 30 days
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccountBalance sx={{ color: '#4CAF50' }} />
                <Typography variant="body2" color="text.secondary">
                  Platform Fees Collected
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                {totalFees}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last 30 days
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingDown sx={{ color: '#FF9800' }} />
                <Typography variant="body2" color="text.secondary">
                  Pending Payments
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                {pendingPayments}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Awaiting processing
              </Typography>
            </Paper>
          </Box>

          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(107, 142, 35, 0.05)' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FilterList />
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                displayEmpty
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">All Transaction Types</MenuItem>
                <MenuItem value="escrow_deposit">Escrow Deposits</MenuItem>
                <MenuItem value="milestone_payout">Milestone Payouts</MenuItem>
                <MenuItem value="refund">Refunds</MenuItem>
                <MenuItem value="land_rental">Land Rental</MenuItem>
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{ ml: 'auto' }}
              >
                Export to CSV
              </Button>
            </Box>
          </Paper>

          {/* Transaction Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {txn.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{txn.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(txn.type)}
                        size="small"
                        sx={{
                          bgcolor: `${getTypeColor(txn.type)}20`,
                          color: getTypeColor(txn.type),
                        }}
                      />
                    </TableCell>
                    <TableCell>{txn.from}</TableCell>
                    <TableCell>{txn.to}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {txn.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {txn.fee}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        #{txn.projectId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {txn.projectName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={txn.status}
                        size="small"
                        color={txn.status === 'completed' ? 'success' : 'warning'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Transaction Summary */}
          <Paper sx={{ mt: 3, p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              💰 Payment Flow Summary
            </Typography>
            <Typography variant="body2" component="div">
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li><strong>Escrow Deposits:</strong> Investors fund projects → Locked in escrow</li>
                <li><strong>Milestone Payouts:</strong> Escrow → Farmers upon milestone completion</li>
                <li><strong>Land Rental:</strong> Escrow → Land Owners (monthly/quarterly)</li>
                <li><strong>Refunds:</strong> Escrow → Investors (project termination/dispute)</li>
                <li><strong>Platform Fees:</strong> Automatically deducted from each transaction</li>
              </ul>
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default PaymentLedgerPage;
