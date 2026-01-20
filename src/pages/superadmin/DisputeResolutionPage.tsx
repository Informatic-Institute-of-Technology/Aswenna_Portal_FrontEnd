import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    CheckCircle,
    Gavel,
    Message,
    Undo,
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
    Divider,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';

// Mock dispute data
const disputes = [
  {
    id: 1,
    projectId: 1243,
    projectName: 'Fruit Orchard Development',
    farmer: 'Robert Farm',
    investor: 'Helen Invest',
    milestone: 'Milestone 3: Harvest Phase',
    amount: '$25,000',
    reason: 'Incomplete harvest documentation',
    filedBy: 'investor',
    filedDate: '2026-01-15',
    status: 'open',
    priority: 'high',
  },
  {
    id: 2,
    projectId: 1238,
    projectName: 'Vegetable Cultivation Hub',
    farmer: 'Emma Veggies',
    investor: 'David Growth',
    milestone: 'Milestone 2: Planting Complete',
    amount: '$15,000',
    reason: 'Weather delay - requesting extension',
    filedBy: 'farmer',
    filedDate: '2026-01-18',
    status: 'open',
    priority: 'medium',
  },
];

const DisputeResolutionPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<typeof disputes[0] & { action?: 'approve' | 'reject' } | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleResolve = (dispute: typeof disputes[0], action: 'approve' | 'reject') => {
    setSelectedDispute({ ...dispute, action });
    setOpenDialog(true);
  };

  const handleSubmitResolution = () => {
    if (!selectedDispute) return;
    console.log('Resolution:', {
      dispute: selectedDispute,
      action: selectedDispute.action,
      notes: resolutionNotes,
    });
    setOpenDialog(false);
    setResolutionNotes('');
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeaderWithIcon
          icon={Gavel}
          title="Dispute Resolution Center"
          action={
            <Chip
              label={`${disputes.filter((d) => d.status === 'open').length} Open Disputes`}
              color="error"
            />
          }
        />
        <CardContent>
          {/* Dispute Statistics */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                {disputes.filter((d) => d.priority === 'high').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                {disputes.filter((d) => d.priority === 'medium').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Medium Priority
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                45
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resolved (Last 30 Days)
              </Typography>
            </Paper>
          </Box>

          {/* Active Disputes */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Active Disputes Requiring Resolution
          </Typography>

          {disputes.map((dispute) => (
            <Paper
              key={dispute.id}
              sx={{
                p: 3,
                mb: 2,
                borderLeft: 4,
                borderColor: dispute.priority === 'high' ? '#f44336' : '#FF9800',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip
                      label={`Dispute #${dispute.id}`}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={dispute.priority}
                      size="small"
                      color={dispute.priority === 'high' ? 'error' : 'warning'}
                      sx={{ textTransform: 'uppercase' }}
                    />
                    <Chip label={`Project #${dispute.projectId}`} size="small" variant="outlined" />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {dispute.projectName}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: '#6B8E23', width: 32, height: 32 }}>F</Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Farmer
                        </Typography>
                        <Typography variant="body2">{dispute.farmer}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32 }}>I</Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Investor
                        </Typography>
                        <Typography variant="body2">{dispute.investor}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Disputed Milestone
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {dispute.milestone}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Amount in Dispute
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#f44336' }}>
                        {dispute.amount}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Filed By
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {dispute.filedBy}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Filed Date
                      </Typography>
                      <Typography variant="body2">{dispute.filedDate}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Reason for Dispute:
                    </Typography>
                    <Typography variant="body2">{dispute.reason}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 3 }}>
                  <Tooltip title="View Full Details">
                    <IconButton color="primary">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Messages">
                    <IconButton>
                      <Message />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Undo />}
                  onClick={() => handleResolve(dispute, 'reject')}
                >
                  Reject & Refund Investor
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => handleResolve(dispute, 'approve')}
                >
                  Approve & Release Funds
                </Button>
              </Box>
            </Paper>
          ))}

          {/* Resolution Guidelines */}
          <Paper sx={{ mt: 3, p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              ⚖️ Resolution Guidelines
            </Typography>
            <Typography variant="body2" component="div">
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Review all submitted evidence from both parties</li>
                <li>Check milestone completion requirements in the Tri-Party Agreement</li>
                <li>Consider communication history between parties</li>
                <li>Document your decision rationale for audit purposes</li>
                <li>Notify all parties via email after resolution</li>
              </ul>
            </Typography>
          </Paper>
        </CardContent>
      </Card>

      {/* Resolution Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDispute?.action === 'approve'
            ? '✅ Approve Milestone & Release Funds'
            : '❌ Reject Milestone & Refund Investor'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Project:</strong> {selectedDispute?.projectName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Amount:</strong> {selectedDispute?.amount}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Resolution Notes (Required)"
            placeholder="Document your decision and reasoning for audit trail..."
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color={selectedDispute?.action === 'approve' ? 'success' : 'error'}
            onClick={handleSubmitResolution}
            disabled={!resolutionNotes}
            startIcon={selectedDispute?.action === 'approve' ? <CheckCircle /> : <Undo />}
          >
            {selectedDispute?.action === 'approve' ? 'Approve & Release' : 'Reject & Refund'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default DisputeResolutionPage;
