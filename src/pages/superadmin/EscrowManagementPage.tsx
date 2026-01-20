import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AttachMoney,
    CheckCircle,
    Lock,
    Security,
    Send,
    Visibility,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';

// Mock escrow accounts
const escrowAccounts = [
  {
    projectId: 1245,
    projectName: 'Organic Rice Cultivation',
    totalFunding: 45000,
    lockedAmount: 20000,
    releasedAmount: 25000,
    investor: 'Sarah Capital',
    farmer: 'John Farmer',
    milestonesTotal: 5,
    milestonesCompleted: 3,
    status: 'active',
  },
  {
    projectId: 1246,
    projectName: 'Vegetable Export Project',
    totalFunding: 78000,
    lockedAmount: 78000,
    releasedAmount: 0,
    investor: 'David Funds',
    farmer: 'Emma Green',
    milestonesTotal: 6,
    milestonesCompleted: 0,
    status: 'active',
  },
  {
    projectId: 1243,
    projectName: 'Fruit Orchard Development',
    totalFunding: 125000,
    lockedAmount: 75000,
    releasedAmount: 50000,
    investor: 'Helen Invest',
    farmer: 'Robert Farm',
    milestonesTotal: 8,
    milestonesCompleted: 2,
    status: 'disputed',
  },
];

const EscrowManagementPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<typeof escrowAccounts[0] | null>(null);
  const [payoutAmount, setPayoutAmount] = useState('');

  const totalLocked = escrowAccounts.reduce((sum, acc) => sum + acc.lockedAmount, 0);
  const totalReleased = escrowAccounts.reduce((sum, acc) => sum + acc.releasedAmount, 0);
  const totalEscrow = escrowAccounts.reduce((sum, acc) => sum + acc.totalFunding, 0);

  const handleManualPayout = (account: typeof escrowAccounts[0]) => {
    setSelectedAccount(account);
    setOpenDialog(true);
  };

  const handleSubmitPayout = () => {
    console.log('Manual payout:', {
      account: selectedAccount,
      amount: payoutAmount,
    });
    setOpenDialog(false);
    setPayoutAmount('');
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeaderWithIcon
          icon={Security}
          title="Escrow Account Monitoring"
          action={<Chip label="Real-time Balance" size="small" color="success" />}
        />
        <CardContent>
          {/* Escrow Summary */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Lock sx={{ color: '#2196F3' }} />
                <Typography variant="body2" color="text.secondary">
                  Total Locked Funds
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                ${totalLocked.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                In escrow accounts
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircle sx={{ color: '#4CAF50' }} />
                <Typography variant="body2" color="text.secondary">
                  Total Released
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                ${totalReleased.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Paid to farmers
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(107, 142, 35, 0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AttachMoney sx={{ color: '#6B8E23' }} />
                <Typography variant="body2" color="text.secondary">
                  Total Escrow Volume
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#6B8E23' }}>
                ${totalEscrow.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                All projects
              </Typography>
            </Paper>
          </Box>

          {/* Escrow Accounts Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Parties</TableCell>
                  <TableCell>Total Funding</TableCell>
                  <TableCell>Locked</TableCell>
                  <TableCell>Released</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {escrowAccounts.map((account) => {
                  const releasePercentage = (account.releasedAmount / account.totalFunding) * 100;
                  return (
                    <TableRow key={account.projectId} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          #{account.projectId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.projectName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: '#3b82f6', width: 24, height: 24, fontSize: '0.75rem' }}>
                              I
                            </Avatar>
                            <Typography variant="caption">{account.investor}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: '#6B8E23', width: 24, height: 24, fontSize: '0.75rem' }}>
                              F
                            </Avatar>
                            <Typography variant="caption">{account.farmer}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${account.totalFunding.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196F3' }}>
                          ${account.lockedAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                          ${account.releasedAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: 150 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption">
                              {account.milestonesCompleted}/{account.milestonesTotal}
                            </Typography>
                            <Typography variant="caption">
                              {releasePercentage.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={releasePercentage}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={account.status}
                          size="small"
                          color={account.status === 'active' ? 'success' : 'error'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Manual Payout">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleManualPayout(account)}
                          >
                            <Send />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Escrow Management Guidelines */}
          <Paper sx={{ mt: 3, p: 2, bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              🔒 Critical Security Guidelines
            </Typography>
            <Typography variant="body2" component="div">
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li><strong>Manual Payouts:</strong> Only release funds after thorough milestone verification</li>
                <li><strong>Dispute Handling:</strong> Funds remain locked during active disputes</li>
                <li><strong>Refund Process:</strong> Document all refund reasons for audit trail</li>
                <li><strong>Fee Deduction:</strong> Platform fees automatically deducted before transfer</li>
                <li><strong>Audit Requirement:</strong> All manual actions logged with admin ID and timestamp</li>
              </ul>
            </Typography>
          </Paper>
        </CardContent>
      </Card>

      {/* Manual Payout Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>💸 Manual Payout Trigger</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Project:</strong> {selectedAccount?.projectName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Available in Escrow:</strong> ${selectedAccount?.lockedAmount.toLocaleString()}
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Payout Amount ($)"
            placeholder="Enter amount to release..."
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for Manual Payout"
            placeholder="Document why manual intervention is required..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmitPayout}
            disabled={!payoutAmount}
            startIcon={<Send />}
          >
            Release Funds
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default EscrowManagementPage;
