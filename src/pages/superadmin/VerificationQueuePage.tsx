import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    CheckCircle,
    Close,
    Description,
    Download,
    VerifiedUser,
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

// Mock verification requests
const verificationRequests = [
  {
    id: 1,
    user: 'John Farmer',
    email: 'john@example.com',
    role: 'farmer',
    requestDate: '2026-01-18',
    documents: ['NIC Copy', 'Farming License'],
    status: 'pending',
  },
  {
    id: 2,
    user: 'Sarah Investor',
    email: 'sarah@example.com',
    role: 'investor',
    requestDate: '2026-01-19',
    documents: ['Passport', 'Bank Statement', 'Business Registration'],
    status: 'pending',
  },
  {
    id: 3,
    user: 'Mike Landowner',
    email: 'mike@example.com',
    role: 'landowner',
    requestDate: '2026-01-17',
    documents: ['NIC', 'Land Deed', 'Tax Certificate'],
    status: 'pending',
  },
];

const VerificationQueuePage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof verificationRequests[0] | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (request: typeof verificationRequests[0]) => {
    console.log('Approving verification for:', request.user);
    // API call to approve verification
  };

  const handleReject = () => {
    console.log('Rejecting verification with reason:', rejectionReason);
    setOpenDialog(false);
    setRejectionReason('');
  };

  const handleOpenRejectDialog = (request: typeof verificationRequests[0]) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeaderWithIcon
          icon={VerifiedUser}
          title="Manual Verification Queue"
          action={
            <Chip
              label={`${verificationRequests.length} Pending Approvals`}
              color="warning"
            />
          }
        />
        <CardContent>
          {/* Summary Stats */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                {verificationRequests.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Reviews
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                142
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved (Last 30 Days)
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected (Last 30 Days)
              </Typography>
            </Paper>
          </Box>

          {/* Verification Requests Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Documents</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {verificationRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar>{request.user.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {request.user}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.role}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {request.documents.map((doc, index) => (
                          <Chip
                            key={index}
                            label={doc}
                            size="small"
                            icon={<Description />}
                            onClick={() => console.log('View document:', doc)}
                            sx={{ cursor: 'pointer' }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label="Pending Review" size="small" color="warning" />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Documents">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download All">
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Approve">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleApprove(request)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenRejectDialog(request)}
                        >
                          <Close />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Document Verification Guidelines */}
          <Paper sx={{ mt: 3, p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              📋 Verification Guidelines
            </Typography>
            <Typography variant="body2" component="div">
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Verify document authenticity and validity dates</li>
                <li>Confirm identity matches across all documents</li>
                <li>For Land Owners: Verify land deed ownership and tax records</li>
                <li>For Investors: Confirm banking details and business registration</li>
                <li>For Farmers: Validate farming licenses and certifications</li>
              </ul>
            </Typography>
          </Paper>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Verification Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            User: <strong>{selectedRequest?.user}</strong>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            placeholder="Please provide a detailed reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!rejectionReason}
          >
            Reject Request
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default VerificationQueuePage;
