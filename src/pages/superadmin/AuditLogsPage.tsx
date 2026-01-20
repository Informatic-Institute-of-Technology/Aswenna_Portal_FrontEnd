import { CardHeaderWithIcon } from '@/components';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Description,
    Download,
    FilterList,
    Search,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    InputAdornment,
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
} from '@mui/material';
import { useState } from 'react';

// Mock audit log data
const auditLogs = [
  {
    id: 1,
    timestamp: '2026-01-20 14:35:22',
    user: 'admin@aswenna.com',
    role: 'superadmin',
    action: 'VERIFY_USER',
    target: 'John Farmer (user_123)',
    details: 'Approved verification request with NIC and Farming License',
    ipAddress: '192.168.1.100',
    severity: 'info',
  },
  {
    id: 2,
    timestamp: '2026-01-20 14:30:15',
    user: 'sarah@example.com',
    role: 'investor',
    action: 'CREATE_PROJECT',
    target: 'Project #1246',
    details: 'Created Vegetable Export Project with $78,000 funding',
    ipAddress: '203.94.125.45',
    severity: 'info',
  },
  {
    id: 3,
    timestamp: '2026-01-20 13:45:30',
    user: 'admin@aswenna.com',
    role: 'superadmin',
    action: 'RESOLVE_DISPUTE',
    target: 'Dispute #1 (Project #1243)',
    details: 'Rejected milestone and refunded $25,000 to investor',
    ipAddress: '192.168.1.100',
    severity: 'warning',
  },
  {
    id: 4,
    timestamp: '2026-01-20 12:20:18',
    user: 'john@example.com',
    role: 'farmer',
    action: 'UPLOAD_DOCUMENT',
    target: 'Project #1245 - Milestone 3',
    details: 'Uploaded harvest documentation (5 files)',
    ipAddress: '110.23.45.67',
    severity: 'info',
  },
  {
    id: 5,
    timestamp: '2026-01-20 11:15:42',
    user: 'admin@aswenna.com',
    role: 'superadmin',
    action: 'MANUAL_PAYOUT',
    target: 'Escrow Account #1245',
    details: 'Released $15,000 to John Farmer for milestone completion',
    ipAddress: '192.168.1.100',
    severity: 'critical',
  },
  {
    id: 6,
    timestamp: '2026-01-20 10:05:55',
    user: 'mike@example.com',
    role: 'landowner',
    action: 'CREATE_LISTING',
    target: 'Land Property #45',
    details: 'Listed 25-acre property in Anuradhapura',
    ipAddress: '112.134.56.78',
    severity: 'info',
  },
  {
    id: 7,
    timestamp: '2026-01-20 09:30:12',
    user: 'admin@aswenna.com',
    role: 'superadmin',
    action: 'SUSPEND_USER',
    target: 'Emma Cultivator (user_456)',
    details: 'Suspended account for violating tri-party agreement terms',
    ipAddress: '192.168.1.100',
    severity: 'critical',
  },
];

const AuditLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#f44336';
      case 'warning':
        return '#FF9800';
      case 'info':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'rgba(244, 67, 54, 0.1)';
      case 'warning':
        return 'rgba(255, 152, 0, 0.1)';
      case 'info':
        return 'rgba(33, 150, 243, 0.1)';
      default:
        return 'rgba(150, 150, 150, 0.1)';
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeaderWithIcon
          icon={Description}
          title="Platform Audit Logs"
          action={
            <Chip
              label={`${auditLogs.length} Events Logged Today`}
              color="primary"
            />
          }
        />
        <CardContent>
          {/* Audit Statistics */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f44336' }}>
                {auditLogs.filter((log) => log.severity === 'critical').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Critical Actions
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                {auditLogs.filter((log) => log.severity === 'warning').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Warnings
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                {auditLogs.filter((log) => log.severity === 'info').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Info Events
              </Typography>
            </Paper>
          </Box>

          {/* Search and Filter */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(107, 142, 35, 0.05)' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                placeholder="Search logs by user, action, or target..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flexGrow: 1, minWidth: '300px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                displayEmpty
                startAdornment={<FilterList sx={{ mr: 1 }} />}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All Actions</MenuItem>
                <MenuItem value="VERIFY_USER">User Verification</MenuItem>
                <MenuItem value="CREATE_PROJECT">Project Creation</MenuItem>
                <MenuItem value="RESOLVE_DISPUTE">Dispute Resolution</MenuItem>
                <MenuItem value="MANUAL_PAYOUT">Manual Payouts</MenuItem>
                <MenuItem value="SUSPEND_USER">User Suspension</MenuItem>
              </Select>
              <Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                displayEmpty
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Severity</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="info">Info</MenuItem>
              </Select>
              <Button
                variant="outlined"
                startIcon={<Download />}
              >
                Export Logs
              </Button>
            </Box>
          </Paper>

          {/* Audit Logs Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Severity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log) => (
                    <TableRow key={log.id} hover sx={{ bgcolor: getSeverityBgColor(log.severity) }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {log.timestamp}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                            {log.user.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                              {log.user}
                            </Typography>
                            <Chip
                              label={log.role}
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '0.65rem',
                                textTransform: 'uppercase',
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.action}
                          size="small"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {log.target}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {log.details}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {log.ipAddress}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.severity}
                          size="small"
                          sx={{
                            bgcolor: getSeverityBgColor(log.severity),
                            color: getSeverityColor(log.severity),
                            textTransform: 'uppercase',
                            fontWeight: 600,
                          }}
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
            count={auditLogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Audit Information */}
          <Paper sx={{ mt: 3, p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              📋 Audit Log Information
            </Typography>
            <Typography variant="body2" component="div">
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li><strong>Retention:</strong> Audit logs are retained for 7 years for compliance</li>
                <li><strong>Immutability:</strong> Logs cannot be modified or deleted</li>
                <li><strong>Critical Actions:</strong> Manual payouts, dispute resolutions, user suspensions</li>
                <li><strong>Export:</strong> Logs can be exported for external audits and reporting</li>
              </ul>
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AuditLogsPage;
