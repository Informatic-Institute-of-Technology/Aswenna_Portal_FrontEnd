import AswendLogo from "@/assets/Aswenna Logo.png"; // Assuming logo path is consistent
import { LocationService } from '@/services';
import {
    AccountBalance,
    Add as AddIcon,
    Agriculture,
    ArrowBack,
    Check as CheckIcon,
    Close as CloseIcon,
    CloudUpload,
    InsertDriveFile as FileIcon,
    Info as InfoIcon,
    Person,
    VerifiedUser,
    WbSunny
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    type SelectChangeEvent,
    Stack,
    Step,
    StepConnector,
    stepConnectorClasses,
    StepLabel,
    Stepper,
    styled,
    TextField,
    Typography
} from '@mui/material';
import type { ChangeEvent, DragEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// File Uploader Compone
interface FileUploaderProps {
    label: string;
    helperText: string;
    files: File[];
    onFilesSelected: (newFiles: File[]) => void;
    onFileDelete: (index: number) => void;
  }
  
  const FileUploader = ({ label, helperText, files, onFilesSelected, onFileDelete }: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleBoxClick = () => {
      fileInputRef.current?.click();
    };
  
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        onFilesSelected(Array.from(event.target.files));
      }
    };
  
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesSelected(Array.from(e.dataTransfer.files));
      }
    };
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
  
    return (
      <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>{label}</Typography>
          
          <Box 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleBoxClick}
              sx={{ 
                  border: '1px dashed #444', 
                  borderRadius: 2, 
                  p: 4, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': { 
                      borderColor: 'primary.main', 
                      bgcolor: 'rgba(107, 142, 35, 0.05)' 
                  }
              }}
          >
              <input 
                  type="file" 
                  multiple 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*,application/pdf"
              />
              <CloudUpload sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
              <Typography variant="caption" display="block" color="text.secondary">
                  {helperText}
              </Typography>
          </Box>
  
          {/* File Preview List */}
          {files.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {files.map((file, index) => (
                      <Box 
                          key={index}
                          sx={{
                              position: 'relative',
                              width: 60,
                              height: 60,
                              borderRadius: 2,
                              overflow: 'hidden',
                              border: '1px solid #444',
                              bgcolor: '#222',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                          }}
                      >
                          {file.type.startsWith('image/') ? (
                               <img 
                                  src={URL.createObjectURL(file)} 
                                  alt="preview" 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} 
                               />
                          ) : (
                              <FileIcon sx={{ color: 'text.secondary' }} />
                          )}
                          
                          <IconButton
                              size="small"
                              onClick={() => onFileDelete(index)}
                              sx={{
                                  position: 'absolute',
                                  top: 2,
                                  right: 2,
                                  bgcolor: 'rgba(0,0,0,0.6)',
                                  color: 'white',
                                  p: 0.5,
                                  '&:hover': { bgcolor: 'rgba(255,0,0,0.7)' }
                              }}
                          >
                              <CloseIcon fontSize="small" sx={{ fontSize: 14 }} />
                          </IconButton>
                      </Box>
                  ))}
              </Box>
          )}
      </Box>
    );
  };

// Custom Step Connector styled to match the dark theme thin lines
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? '#444' : '#eaeaf0',
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

const FarmerProfileSetup = () => {
  const navigate = useNavigate();
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Paddy']);
  const [nicFiles, setNicFiles] = useState<File[]>([]);

  // Sri Lanka Provinces and Districts Data
  const sriLankaLocations: Record<string, string[]> = {
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Eastern": ["Ampara", "Batticaloa", "Trincomalee"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "North Western": ["Kurunegala", "Puttalam"],
    "Sabaragamuwa": ["Kegalle", "Ratnapura"],
    "Southern": ["Galle", "Hambantota", "Matara"],
    "Uva": ["Badulla", "Monaragala"],
    "Western": ["Colombo", "Gampaha", "Kalutara"]
  };
  
  const handleProvinceChange = (event: SelectChangeEvent<string>) => {
    setProvince(event.target.value);
    setDistrict(''); // Reset district when province changes
  };

  const [dsDivision, setDsDivision] = useState('');
  const [dsDivisionsList, setDsDivisionsList] = useState<string[]>([]);

  useEffect(() => {
    const fetchDSDivisions = async () => {
      if (district) {
        // Optionally show loading state here
        try {
          const divisions = await LocationService.getDSDivisionsByDistrict(district);
          setDsDivisionsList(divisions);
        } catch (error) {
          console.error("Failed to load DS Divisions", error);
          setDsDivisionsList([]);
        }
      } else {
        setDsDivisionsList([]);
      }
      setDsDivision('');
    };

    fetchDSDivisions();
  }, [district]);

  const [gnDivision, setGnDivision] = useState('');
  const [gnDivisionsList, setGnDivisionsList] = useState<{name: string, number: string}[]>([]);

  useEffect(() => {
    const fetchGNDivisions = async () => {
      if (dsDivision) {
        try {
          const gns = await LocationService.getGNDivisionsByDSDivision(dsDivision);
          setGnDivisionsList(gns);
        } catch (error) {
          console.error("Failed to load GN Divisions", error);
          setGnDivisionsList([]);
        }
      } else {
        setGnDivisionsList([]);
      }
      setGnDivision('');
    };

    fetchGNDivisions();
  }, [dsDivision]);

  const [passbookFiles, setPassbookFiles] = useState<File[]>([]);
  const [gnFiles, setGnFiles] = useState<File[]>([]);
  
  // Phone Verification State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const crops = ['Paddy', 'Corn', 'Tea', 'Cinnamon', 'Vegetables'];

  const handleSendVerification = () => {
    // Simulate API call to send SMS
    setVerificationDialogOpen(true);
  };

  const handleVerifyCode = () => {
    if (verificationCode === '1234') { 
        setIsPhoneVerified(true);
        setVerificationDialogOpen(false);
        setVerificationCode('');
    } else {
        alert("Invalid code (Mock: use 1234)");
    }
  };

  const handleCropToggle = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter(c => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleBack = () => {
    navigate('/role-selection');
  };

  const steps = ['Account', 'Details', 'Verification'];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4, pt: 2 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, cursor: 'pointer' }} onClick={handleBack}>
                <ArrowBack sx={{ color: 'text.secondary', mr: 1, fontSize: '1rem' }} />
                <Typography variant="body2" color="text.secondary">
                    Back to Role Selection
                </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Farmer <span style={{ color: '#6B8E23' }}>Information</span>
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Complete your farmer profile to start connecting with investors and land owners.
                    </Typography>
                </Box>

                {/* Stepper */}
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <Stepper activeStep={1} alternativeLabel connector={<ColorlibConnector />}>
                        {steps.map((label, index) => {
                             const completed = index < 1;
                             const active = index === 1;
                             
                             return (
                                <Step key={label} completed={completed}>
                                    <StepLabel 
                                        StepIconComponent={() => (
                                            <Box sx={{ 
                                                width: 32, 
                                                height: 32, 
                                                borderRadius: '50%', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                bgcolor: completed ? 'primary.main' : 'transparent',
                                                border: completed ? 'none' : (active ? '2px solid #6B8E23' : '2px solid #555'),
                                                color: completed || active ? 'white' : '#777',
                                                fontWeight: 'bold'
                                            }}>
                                                {completed ? <CheckIcon fontSize="small" /> : index + 1}
                                            </Box>
                                        )}
                                    >
                                        <Typography variant="caption" sx={{ 
                                            color: completed || active ? 'text.primary' : 'text.secondary',
                                            fontWeight: active ? 'bold' : 'normal'
                                        }}>
                                            {label}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                             );
                        })}
                    </Stepper>
                </Box>
            </Box>
        </Box>
        
        {/* Phone Verification Dialog */}
        <Dialog open={verificationDialogOpen} onClose={() => setVerificationDialogOpen(false)}>
            <DialogTitle>Verify Phone Number</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    We have sent a 4-digit verification code to {phoneNumber}. Please enter it below.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="code"
                    label="Verification Code (Try 1234)"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setVerificationDialogOpen(false)} color="inherit">Cancel</Button>
                <Button onClick={handleVerifyCode} variant="contained" color="primary">Verify</Button>
            </DialogActions>
        </Dialog>

        <Grid container spacing={3}>
          {/* Main Form Fields - Left Column */}
          <Grid size={{ xs: 12, lg: 8 }}>
            
            {/* Personal & Address Details */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">Personal & Address Details</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Full Name" placeholder="Enter Full Name" variant="outlined" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="National ID Number" placeholder="19XXXXXXXXXX" variant="outlined" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Street Address (No / Lane)" placeholder="123 Green Lane" variant="outlined" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="City / Town" placeholder="Enter City" variant="outlined" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel shrink>Province</InputLabel>
                    <Select
                      value={province}
                      onChange={handleProvinceChange}
                      displayEmpty
                      label="Province"
                      notched
                    >
                      <MenuItem value="" disabled>Select Province</MenuItem>
                      {Object.keys(sriLankaLocations).map((prov) => (
                        <MenuItem key={prov} value={prov}>{prov}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Postal Code" placeholder="XXXXX" variant="outlined" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Phone Number" 
                    placeholder="07X XXXXXXX" 
                    variant="outlined" 
                    InputLabelProps={{ 
                        shrink: true 
                    }} 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {isPhoneVerified ? (
                                    <Chip 
                                        icon={<VerifiedUser sx={{ fontSize: '1rem !important', color: 'white !important' }} />} 
                                        label="Verified" 
                                        size="small" 
                                        sx={{ 
                                            bgcolor: 'primary.main', 
                                            color: 'white',
                                            fontWeight: 'bold',
                                            border: 'none',
                                            '& .MuiChip-label': { px: 1 }
                                        }}
                                    />
                                ) : (
                                    <Button 
                                        variant="text" 
                                        size="small" 
                                        onClick={handleSendVerification}
                                        disabled={!phoneNumber || phoneNumber.length < 9}
                                        sx={{ color: 'primary.main', fontWeight: 'bold' }}
                                    >
                                        VERIFY
                                    </Button>
                                )}
                            </InputAdornment>
                        )
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth disabled={!province}>
                    <InputLabel shrink>District</InputLabel>
                    <Select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      displayEmpty
                      label="District"
                      notched
                    >
                      <MenuItem value="" disabled>Select District</MenuItem>
                      {province && sriLankaLocations[province]?.map((dist) => (
                         <MenuItem key={dist} value={dist}>{dist}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccountBalance sx={{ color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">Administrative Details</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth disabled={!district}>
                    <InputLabel shrink>District Secretariat Division</InputLabel>
                    <Select
                      value={dsDivision}
                      onChange={(e) => setDsDivision(e.target.value)}
                      displayEmpty
                      label="District Secretariat Division"
                      notched
                    >
                      <MenuItem value="" disabled>Select Division</MenuItem>
                      {dsDivisionsList.map((div) => (
                        <MenuItem key={div} value={div}>{div}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth disabled={!dsDivision}>
                    <InputLabel shrink>Grama Niladhari Division</InputLabel>
                    <Select
                      value={gnDivision}
                      onChange={(e) => setGnDivision(e.target.value)}
                      displayEmpty
                      label="Grama Niladhari Division"
                      notched
                    >
                      <MenuItem value="" disabled>Select GN Division</MenuItem>
                      {gnDivisionsList.map((gn) => (
                        <MenuItem key={gn.number} value={gn.name}>{gn.name} ({gn.number})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField fullWidth label="Govijana Sewa ID" placeholder="ID-0000-00" variant="outlined" InputLabelProps={{ shrink: true }} />
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Agriculture sx={{ color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">Farming Experience</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>What are your primary crops?</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                    {crops.map((crop) => (
                        <Chip 
                            key={crop}
                            label={crop}
                            clickable
                            onClick={() => handleCropToggle(crop)}
                            sx={{ 
                                bgcolor: selectedCrops.includes(crop) ? 'primary.main' : 'transparent',
                                color: selectedCrops.includes(crop) ? 'white' : 'text.secondary',
                                border: `1px solid ${selectedCrops.includes(crop) ? '#6B8E23' : '#444'}`,
                                '&:hover': {
                                    bgcolor: selectedCrops.includes(crop) ? 'primary.dark' : 'rgba(255,255,255,0.05)',
                                }
                            }}
                        />
                    ))}
                    <Chip 
                        icon={<AddIcon />} 
                        label="Add Other" 
                        clickable
                        onClick={() => {}}
                        sx={{ 
                            bgcolor: 'transparent',
                            color: 'text.secondary',
                            border: '1px solid #444',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.05)',
                                borderColor: 'text.secondary',
                            }
                        }}
                    />
                  </Stack>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField 
                        fullWidth 
                        label="Experience Level" 
                        placeholder="Years in farming" 
                        variant="outlined" 
                        InputLabelProps={{ shrink: true }} 
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField 
                        fullWidth 
                        label="Preferred Region" 
                        placeholder="Region where you operate" 
                        variant="outlined" 
                        InputLabelProps={{ shrink: true }} 
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField 
                        fullWidth 
                        multiline
                        rows={3}
                        label="Specific Needs" 
                        placeholder="What do you need? (e.g., funding, equipment, land)" 
                        variant="outlined" 
                        InputLabelProps={{ shrink: true }} 
                    />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Verification & Actions - Right Column */}
          <Grid size={{ xs: 12, lg: 4 }}>
            
            {/* Verification */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VerifiedUser sx={{ color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">Verification</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FileUploader 
                  label="National ID (NIC)" 
                  helperText="Upload Front & Back"
                  files={nicFiles}
                  onFilesSelected={(newFiles) => setNicFiles([...nicFiles, ...newFiles])}
                  onFileDelete={(index) => setNicFiles(nicFiles.filter((_, i) => i !== index))}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <FileUploader 
                  label="Govi Jana Sewa Passbook" 
                  helperText="Upload photo of Govi Jana Sewa passbook page"
                  files={passbookFiles}
                  onFilesSelected={(newFiles) => setPassbookFiles([...passbookFiles, ...newFiles])}
                  onFileDelete={(index) => setPassbookFiles(passbookFiles.filter((_, i) => i !== index))}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <FileUploader 
                  label="Grama Niladhari Certified Document" 
                  helperText="Proof of Residence"
                  files={gnFiles}
                  onFilesSelected={(newFiles) => setGnFiles([...gnFiles, ...newFiles])}
                  onFileDelete={(index) => setGnFiles(gnFiles.filter((_, i) => i !== index))}
                />
              </Box>

              <Box sx={{ 
                  bgcolor: 'rgba(255, 167, 38, 0.1)', 
                  border: '1px solid rgba(255, 167, 38, 0.3)', 
                  borderRadius: 1, 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'flex-start' 
                }}>
                  <InfoIcon sx={{ color: '#ffa726', fontSize: 16, mt: 0.5, mr: 1 }} />
                  <Typography variant="caption" color="#ffa726">
                      Documents will be reviewed by our team within 24-48 hours. Ensure images are clear and readable.
                  </Typography>
              </Box>
            </Paper>

            {/* Actions */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    sx={{ 
                        mb: 2, 
                        py: 1.5,
                        textTransform: 'none', 
                        fontWeight: 'bold', 
                        boxShadow: '0 4px 14px 0 rgba(107, 142, 35, 0.39)'
                    }}
                >
                    Save & Continue →
                </Button>
                
                <Button 
                    fullWidth 
                    variant="outlined" 
                    color="inherit" 
                    size="large"
                    sx={{ 
                        py: 1.5,
                        textTransform: 'none',
                        borderColor: '#444',
                        color: 'white',
                        '&:hover': { borderColor: 'white' }
                    }}
                >
                    Save as Draft
                </Button>
            </Paper>

            {/* Floating Action Button for theme toggle (optional, just mimicking screenshot bottom right icon) */}
            <Box sx={{ position: 'fixed', bottom: 32, right: 32}}>
                <IconButton sx={{ bgcolor: '#333', color: '#fbbf24', '&:hover': { bgcolor: '#444' } }}>
                    <WbSunny />
                </IconButton>
            </Box>

          </Grid>
        </Grid>
        
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mb: 2, fontSize: '0.7rem' }}>
                “Empowering Sri Lankan agriculture through transparent partnerships.”
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
                 {/* Placeholder for small Aswenna Verified logo/text */}
                <Box component="img" src={AswendLogo} sx={{ width: 16, height: 16, mr: 1, filter: 'grayscale(100%)' }} />
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', letterSpacing: 1, fontSize: '0.65rem' }}>
                    ASWENNA VERIFIED
                </Typography>
            </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FarmerProfileSetup;
