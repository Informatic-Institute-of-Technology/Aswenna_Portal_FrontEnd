import { CommissionBasedForm } from '@/components/farmer/CommissionBasedForm';
import { HarvestBasedForm } from '@/components/farmer/HarvestBasedForm';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { BOQItem, JobCreationState } from '@/types';
import { Agriculture, ArrowBack, ArrowForward, AttachMoney } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProjectWizard = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<JobCreationState>({
    step: 0,
    engagementModel: undefined,
    title: '',
    description: '',
    location: '',
    landSize: 0,
    landUnit: 'acres',
    startDate: '',
    expectedEndDate: '',
    boqItems: [],
    investorSharePercentage: 50,
    estimatedYield: 0,
    yieldUnit: 'kg',
    estimatedRevenue: 0,
    serviceDescription: '',
    commissionType: 'fixed',
    commissionAmount: 0,
    commissionPercentage: 0,
    estimatedEarnings: 0,
    portfolioFiles: []
  });

  const steps = ['Select Model', 'Project Details', 'Review & Submit'];

  // Step 1: Select Engagement Model
  const renderModelSelection = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        Choose Your Engagement Model
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
        Select how you want to structure this farming opportunity
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={formData.engagementModel === 'harvest-based' ? 12 : 2}
            sx={{
              height: '100%',
              cursor: 'pointer',
              border: 2,
              borderColor: formData.engagementModel === 'harvest-based' ? 'primary.main' : 'transparent',
              background: formData.engagementModel === 'harvest-based'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-12px)',
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                borderColor: 'primary.main'
              }
            }}
            onClick={() => setFormData({ ...formData, engagementModel: 'harvest-based' })}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: formData.engagementModel === 'harvest-based' ? 'rgba(255,255,255,0.2)' : 'primary.50',
                  mb: 2
                }}
              >
                <Agriculture
                  sx={{
                    fontSize: 64,
                    color: formData.engagementModel === 'harvest-based' ? 'white' : 'primary.main'
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: formData.engagementModel === 'harvest-based' ? 'white' : 'text.primary' }}
              >
                Harvest-Based
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: formData.engagementModel === 'harvest-based' ? 'rgba(255,255,255,0.9)' : 'text.secondary'
                }}
              >
                Share costs and revenue with an investor based on harvest outcomes
              </Typography>
              <Box
                sx={{
                  textAlign: 'left',
                  bgcolor: formData.engagementModel === 'harvest-based' ? 'rgba(255,255,255,0.15)' : 'background.paper',
                  backdropFilter: 'blur(10px)',
                  p: 2,
                  borderRadius: 2,
                  border: 1,
                  borderColor: formData.engagementModel === 'harvest-based' ? 'rgba(255,255,255,0.2)' : 'divider'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: formData.engagementModel === 'harvest-based' ? 'white' : 'text.primary',
                    fontWeight: 500
                  }}
                >
                  ✓ Detailed cost breakdown
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: formData.engagementModel === 'harvest-based' ? 'white' : 'text.primary',
                    fontWeight: 500
                  }}
                >
                  ✓ Investor shares expenses
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: formData.engagementModel === 'harvest-based' ? 'white' : 'text.primary',
                    fontWeight: 500
                  }}
                >
                  ✓ Profit sharing after harvest
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: formData.engagementModel === 'harvest-based' ? 'white' : 'text.primary',
                    fontWeight: 500
                  }}
                >
                  ✓ Suitable for crop cultivation
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={formData.engagementModel === 'commission-based' ? 12 : 2}
            sx={{
              height: '100%',
              cursor: 'pointer',
              border: 2,
              borderColor: formData.engagementModel === 'commission-based' ? 'success.main' : 'transparent',
              background: formData.engagementModel === 'commission-based'
                ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                : 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-12px)',
                boxShadow: '0 20px 40px rgba(56, 239, 125, 0.3)',
                borderColor: 'success.main'
              }
            }}
            onClick={() => setFormData({ ...formData, engagementModel: 'commission-based' })}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: formData.engagementModel === 'commission-based' ? 'rgba(255,255,255,0.2)' : 'success.50',
                  mb: 2
                }}
              >
                <AttachMoney
                  sx={{
                    fontSize: 64,
                    color: formData.engagementModel === 'commission-based' ? 'white' : 'success.main'
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: formData.engagementModel === 'commission-based' ? 'white' : 'text.primary' }}
              >
                Commission-Based
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: formData.engagementModel === 'commission-based' ? 'rgba(255,255,255,0.9)' : 'text.secondary'
                }}
              >
                Offer your expertise as a service for fixed or percentage-based payment
              </Typography>
              <Box
                sx={{
                  textAlign: 'left',
                  bgcolor: formData.engagementModel === 'commission-based' ? 'rgba(255,255,255,0.15)' : 'background.paper',
                  backdropFilter: 'blur(10px)',
                  p: 2,
                  borderRadius: 2,
                  border: 1,
                  borderColor: formData.engagementModel === 'commission-based' ? 'rgba(255,255,255,0.2)' : 'divider'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: formData.engagementModel === 'commission-based' ? 'white' : 'text.primary',
                    fontWeight: 500
                  }}
                >
                  ✓ Service-oriented approach
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: formData.engagementModel === 'commission-based' ? 'white' : 'text.primary',
                    fontWeight: 500
                  }}
                >
                  ✓ Fixed or percentage commission
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: formData.engagementModel === 'commission-based' ? 'white' : 'text.primary',
                    fontWeight: 500
                  }}
                >
                  ✓ No cost sharing needed
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: formData.engagementModel === 'commission-based' ? 'white' : 'text.primary',
                    fontWeight: 500
                  }}
                >
                  ✓ Suitable for consulting/services
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Step 2: Project Details (Basic Info + Model-Specific Form)
  const renderProjectDetails = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Project Details
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Provide information about your farming opportunity
      </Typography>

      {/* Basic Information */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(to right, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 4,
              height: 40,
              bgcolor: 'primary.main',
              borderRadius: 1
            }}
          />
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Basic Information
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Organic Rice Cultivation - Polonnaruwa"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project, crop types, methods, etc."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Polonnaruwa District"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Land Size"
              value={formData.landSize}
              onChange={(e) => setFormData({ ...formData, landSize: parseFloat(e.target.value) || 0 })}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Unit"
              value={formData.landUnit}
              onChange={(e) => setFormData({ ...formData, landUnit: e.target.value })}
              placeholder="acres"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Expected End Date"
              value={formData.expectedEndDate}
              onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Model-Specific Forms */}
      {formData.engagementModel === 'harvest-based' && (
        <HarvestBasedForm
          boqItems={formData.boqItems}
          onChange={(items: BOQItem[]) => setFormData({ ...formData, boqItems: items })}
          investorSharePercentage={formData.investorSharePercentage}
          onInvestorShareChange={(value: number) => 
            setFormData({ ...formData, investorSharePercentage: value })
          }
        />
      )}

      {formData.engagementModel === 'commission-based' && (
        <CommissionBasedForm
          serviceDescription={formData.serviceDescription}
          onServiceDescriptionChange={(value: string) => 
            setFormData({ ...formData, serviceDescription: value })
          }
          commissionType={formData.commissionType}
          onCommissionTypeChange={(value: 'fixed' | 'percentage') => 
            setFormData({ ...formData, commissionType: value })
          }
          commissionAmount={formData.commissionAmount}
          onCommissionAmountChange={(value: number) => 
            setFormData({ ...formData, commissionAmount: value })
          }
          commissionPercentage={formData.commissionPercentage}
          onCommissionPercentageChange={(value: number) => 
            setFormData({ ...formData, commissionPercentage: value })
          }
          estimatedEarnings={formData.estimatedEarnings}
          onEstimatedEarningsChange={(value: number) => 
            setFormData({ ...formData, estimatedEarnings: value })
          }
          portfolioFiles={formData.portfolioFiles}
          onPortfolioFilesChange={(files: File[]) => 
            setFormData({ ...formData, portfolioFiles: files })
          }
        />
      )}
    </Box>
  );

  // Step 3: Review & Submit
  const renderReview = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
        Review Your Project
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
        Please review all details before submitting
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Summary preview will be shown here...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Project: {formData.title || 'Untitled'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Model: {formData.engagementModel}
        </Typography>
        {formData.engagementModel === 'harvest-based' && (
          <Typography variant="body2" color="text.secondary">
            Total BOQ Items: {formData.boqItems.length}
          </Typography>
        )}
      </Paper>
    </Box>
  );

  const handleNext = () => {
    if (activeStep === 0 && !formData.engagementModel) {
      alert('Please select an engagement model');
      return;
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = () => {
    // TODO: Submit to backend
    console.log('Submitting project:', formData);
    alert('Project created successfully!');
    navigate('/dashboard/my-projects');
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          {activeStep === 0 && renderModelSelection()}
          {activeStep === 1 && renderProjectDetails()}
          {activeStep === 2 && renderReview()}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={activeStep === 0 ? () => navigate('/dashboard/my-projects') : handleBack}
            variant="outlined"
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            endIcon={<ArrowForward />}
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            variant="contained"
            disabled={activeStep === 0 && !formData.engagementModel}
          >
            {activeStep === steps.length - 1 ? 'Submit Project' : 'Next'}
          </Button>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default CreateProjectWizard;
