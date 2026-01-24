import { AttachFile, TrendingUp } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputAdornment,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';

interface CommissionBasedFormProps {
  serviceDescription: string;
  onServiceDescriptionChange: (value: string) => void;
  commissionType: 'fixed' | 'percentage';
  onCommissionTypeChange: (value: 'fixed' | 'percentage') => void;
  commissionAmount: number;
  onCommissionAmountChange: (value: number) => void;
  commissionPercentage: number;
  onCommissionPercentageChange: (value: number) => void;
  estimatedEarnings: number;
  onEstimatedEarningsChange: (value: number) => void;
  portfolioFiles: File[];
  onPortfolioFilesChange: (files: File[]) => void;
}

export const CommissionBasedForm = ({
  serviceDescription,
  onServiceDescriptionChange,
  commissionType,
  onCommissionTypeChange,
  commissionAmount,
  onCommissionAmountChange,
  commissionPercentage,
  onCommissionPercentageChange,
  estimatedEarnings,
  onEstimatedEarningsChange,
  portfolioFiles,
  onPortfolioFilesChange
}: CommissionBasedFormProps) => {
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      onPortfolioFilesChange([...portfolioFiles, ...filesArray]);
      setUploadedFileNames([...uploadedFileNames, ...filesArray.map(f => f.name)]);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
          Commission-Based Project Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Define your service offering and commission structure for this opportunity.
        </Typography>
      </Box>

      {/* Service Description */}
      <Card
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 4,
                height: 40,
                bgcolor: 'success.main',
                borderRadius: 1
              }}
            />
            <Typography variant="h6" fontWeight="bold" color="success.main">
              Service Description
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Service Description"
            value={serviceDescription}
            onChange={(e) => onServiceDescriptionChange(e.target.value)}
            placeholder="Describe the farming services you'll provide (e.g., land preparation, crop management, harvesting services)"
            helperText="Explain what work you'll do and what expertise you bring"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Commission Structure */}
      <Card
        elevation={3}
        sx={{
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <FormControl component="fieldset" fullWidth>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 4,
                  height: 40,
                  bgcolor: 'success.main',
                  borderRadius: 1
                }}
              />
              <FormLabel component="legend" sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'success.main' }}>
                Commission Structure
              </FormLabel>
            </Box>
            <RadioGroup
              value={commissionType}
              onChange={(e) => onCommissionTypeChange(e.target.value as 'fixed' | 'percentage')}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={commissionType === 'fixed' ? 8 : 2}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      border: 2,
                      borderRadius: 3,
                      borderColor: commissionType === 'fixed' ? 'success.main' : 'transparent',
                      background: commissionType === 'fixed'
                        ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                        : 'white',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(17, 153, 142, 0.3)',
                        borderColor: 'success.main'
                      }
                    }}
                    onClick={() => onCommissionTypeChange('fixed')}
                  >
                    <FormControlLabel
                      value="fixed"
                      control={
                        <Radio
                          sx={{
                            color: commissionType === 'fixed' ? 'white' : 'success.main',
                            '&.Mui-checked': {
                              color: 'white'
                            }
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: commissionType === 'fixed' ? 'white' : 'text.primary' }}
                          >
                            Fixed Commission
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: commissionType === 'fixed' ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                              mt: 0.5
                            }}
                          >
                            Set a fixed amount you'll earn regardless of harvest outcome
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={commissionType === 'percentage' ? 8 : 2}
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      border: 2,
                      borderRadius: 3,
                      borderColor: commissionType === 'percentage' ? 'success.main' : 'transparent',
                      background: commissionType === 'percentage'
                        ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                        : 'white',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(17, 153, 142, 0.3)',
                        borderColor: 'success.main'
                      }
                    }}
                    onClick={() => onCommissionTypeChange('percentage')}
                  >
                    <FormControlLabel
                      value="percentage"
                      control={
                        <Radio
                          sx={{
                            color: commissionType === 'percentage' ? 'white' : 'success.main',
                            '&.Mui-checked': {
                              color: 'white'
                            }
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: commissionType === 'percentage' ? 'white' : 'text.primary' }}
                          >
                            Percentage-Based
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: commissionType === 'percentage' ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                              mt: 0.5
                            }}
                          >
                            Earn a percentage of the total revenue/profit
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 4 }}>
            {commissionType === 'fixed' ? (
              <TextField
                fullWidth
                type="number"
                label="Fixed Commission Amount"
                value={commissionAmount}
                onChange={(e) => onCommissionAmountChange(parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
                }}
                helperText="Enter the total amount you expect to earn from this project"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }
                }}
              />
            ) : (
              <TextField
                fullWidth
                type="number"
                label="Commission Percentage"
                value={commissionPercentage}
                onChange={(e) => onCommissionPercentageChange(parseFloat(e.target.value) || 0)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
                helperText="Enter the percentage of revenue/profit you'll receive"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Estimated Earnings */}
      <Card
        elevation={6}
        sx={{
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          border: '2px solid rgba(17, 153, 142, 0.3)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 1.5,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.2)'
              }}
            >
              <TrendingUp sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography variant="h6" fontWeight="bold" color="white">
              Estimated Earnings
            </Typography>
          </Box>
          <TextField
            fullWidth
            type="number"
            label="Expected Total Earnings"
            value={estimatedEarnings}
            onChange={(e) => onEstimatedEarningsChange(parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start" sx={{ color: 'white' }}>Rs.</InputAdornment>
            }}
            helperText={
              commissionType === 'percentage'
                ? `Based on estimated revenue and ${commissionPercentage}% commission`
                : 'Your total expected earnings from this project'
            }
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem'
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
        </CardContent>
      </Card>

      {/* Portfolio Upload */}
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 4,
                height: 40,
                bgcolor: 'success.main',
                borderRadius: 1
              }}
            />
            <Typography variant="h6" fontWeight="bold" color="success.main">
              Portfolio & Experience Documents (Optional)
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Upload photos, certificates, or documents showcasing your farming expertise
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            component="label"
            startIcon={<AttachFile />}
            sx={{
              bgcolor: 'success.main',
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'success.dark',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(17, 153, 142, 0.3)'
              }
            }}
          >
            Upload Documents
            <input
              type="file"
              hidden
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
            />
          </Button>

          {uploadedFileNames.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'success.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'success.light'
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="success.dark">
                Uploaded Files:
              </Typography>
              {uploadedFileNames.map((name, index) => (
                <Typography key={index} variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ✓ {name}
                </Typography>
              ))}
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
