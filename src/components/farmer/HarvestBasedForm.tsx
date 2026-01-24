import type { BOQItem } from '@/types';
import { Add, Delete, ExpandLess, ExpandMore } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    FormControl,
    Grid,
    IconButton,
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
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Predefined sections for categorization
const PREDEFINED_SECTIONS = [
  'Land Preparation',
  'Seeds & Planting Materials',
  'Fertilizers & Soil Amendments',
  'Pesticides & Weed Control',
  'Irrigation & Water Management',
  'Labor Costs',
  'Equipment & Machinery',
  'Transportation',
  'Storage & Packaging',
  'Marketing & Distribution',
  'Other Expenses'
];

interface HarvestBasedFormProps {
  boqItems: BOQItem[];
  onChange: (items: BOQItem[]) => void;
  investorSharePercentage: number;
  onInvestorShareChange: (value: number) => void;
}

export const HarvestBasedForm = ({ 
  boqItems, 
  onChange, 
  investorSharePercentage,
  onInvestorShareChange 
}: HarvestBasedFormProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(PREDEFINED_SECTIONS));
  const [newItem, setNewItem] = useState({
    section: '',
    description: '',
    quantity: '',
    unit: '',
    unitCost: ''
  });

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddItem = () => {
    if (!newItem.section || !newItem.description || !newItem.quantity || !newItem.unit || !newItem.unitCost) {
      alert('Please fill all fields');
      return;
    }

    const quantity = parseFloat(newItem.quantity);
    const unitCost = parseFloat(newItem.unitCost);
    const totalCost = quantity * unitCost;

    const item: BOQItem = {
      id: uuidv4(),
      section: newItem.section,
      description: newItem.description,
      quantity,
      unit: newItem.unit,
      unitCost,
      totalCost
    };

    onChange([...boqItems, item]);
    
    // Reset form
    setNewItem({
      section: newItem.section, // Keep section selected for easier multiple entries
      description: '',
      quantity: '',
      unit: '',
      unitCost: ''
    });
  };

  const handleDeleteItem = (id: string) => {
    onChange(boqItems.filter(item => item.id !== id));
  };

  // Group items by section
  const itemsBySection = boqItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, BOQItem[]>);

  // Calculate section totals
  const getSectionTotal = (section: string) => {
    return (itemsBySection[section] || []).reduce((sum, item) => sum + item.totalCost, 0);
  };

  // Calculate grand total
  const grandTotal = boqItems.reduce((sum, item) => sum + item.totalCost, 0);
  const farmerShare = grandTotal * ((100 - investorSharePercentage) / 100);
  const investorShare = grandTotal * (investorSharePercentage / 100);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bill of Quantities (BOQ)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Break down your project costs by category. Add items with their quantities and costs.
      </Typography>

      {/* Add New Item Form */}
      <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Add New Item
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'white' }}>Section</InputLabel>
                <Select
                  value={newItem.section}
                  label="Section"
                  onChange={(e) => setNewItem({ ...newItem, section: e.target.value })}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)'
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white'
                    }
                  }}
                >
                  {PREDEFINED_SECTIONS.map(section => (
                    <MenuItem key={section} value={section}>{section}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="e.g., Organic fertilizer"
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.9)'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1
                  }
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.9)'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Unit"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                placeholder="e.g., kg, hours"
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.9)'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Unit Cost"
                type="number"
                value={newItem.unitCost}
                onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: 'white' }}>
                      Rs.
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white'
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.9)'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleAddItem}
            sx={{
              mt: 3,
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* BOQ Items by Section */}
      {boqItems.length > 0 ? (
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          {PREDEFINED_SECTIONS.map(section => {
            const items = itemsBySection[section];
            if (!items || items.length === 0) return null;
            
            const sectionTotal = getSectionTotal(section);
            const isExpanded = expandedSections.has(section);

            return (
              <Box key={section} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Box
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(to right, #f8f9fa 0%, #e9ecef 100%)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'linear-gradient(to right, #e9ecef 0%, #dee2e6 100%)',
                      transform: 'translateX(4px)'
                    }
                  }}
                  onClick={() => toggleSection(section)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      {section}
                    </Typography>
                    <Chip
                      label={`${items.length} items`}
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      Rs. {sectionTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                    <IconButton size="small">
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={isExpanded}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Unit</TableCell>
                          <TableCell align="right">Unit Cost</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{item.unit}</TableCell>
                            <TableCell align="right">Rs. {item.unitCost.toFixed(2)}</TableCell>
                            <TableCell align="right">
                              <strong>Rs. {item.totalCost.toFixed(2)}</strong>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Collapse>
              </Box>
            );
          })}

          {/* Grand Total Footer */}
          <Box
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" color="white">
                Total Project Cost
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="white">
                Rs. {getTotalProjectCost().toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="white" sx={{ mb: 2 }}>
                Profit Sharing Structure
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Investor Share (%)"
                    value={investorSharePercentage}
                    onChange={(e) => onInvestorShareChange(parseFloat(e.target.value) || 0)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end" sx={{ color: 'white' }}>%</InputAdornment>
                    }}
                    helperText={`Investor contributes: Rs. ${investorShare.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 'bold'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        borderWidth: 2
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.6)'
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Farmer Share (%)"
                    value={100 - investorSharePercentage}
                    InputProps={{
                      readOnly: true,
                      endAdornment: <InputAdornment position="end" sx={{ color: 'white' }}>%</InputAdornment>
                    }}
                    helperText={`Farmer contributes: Rs. ${farmerShare.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 'bold'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        borderWidth: 2
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={2}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No items added yet. Start by adding your first expense item above.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
