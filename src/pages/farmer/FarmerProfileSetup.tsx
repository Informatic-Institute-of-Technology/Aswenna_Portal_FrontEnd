import AswendLogo from "@/assets/Aswenna Logo.png";
import { FileUploader, ProfileStepper } from '@/components';
import { LocationService } from '@/services';
import { validateNIC } from '@/utils';
import {
    AccountBalance,
    Add as AddIcon,
    Agriculture,
    ArrowBack,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    MyLocation,
    Person,
    VerifiedUser,
    WbSunny
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
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
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FarmerProfileSetup = () => {
  const navigate = useNavigate();
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Paddy']);
  const [nicFiles, setNicFiles] = useState<File[]>([]);
  
  // NIC Validation States
  const [nicNumber, setNicNumber] = useState('');
  const [nicError, setNicError] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [age, setAge] = useState<number | null>(null);

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
    setDistrict('');
  };

  const [dsDivision, setDsDivision] = useState('');
  const [dsDivisionsList, setDsDivisionsList] = useState<string[]>([]);
  
  const pendingLocationUpdate = useRef<{ ds?: string, gn?: string, gnNumber?: string } | null>(null);

  useEffect(() => {
    const fetchDSDivisions = async () => {
      if (district) {
        try {
          const divisions = await LocationService.getDSDivisionsByDistrict(district);
          setDsDivisionsList(divisions);
          
          if (pendingLocationUpdate.current?.ds) {
              const match = divisions.find(d => d.toLowerCase() === pendingLocationUpdate.current?.ds?.toLowerCase());
              if (match) {
                  setDsDivision(match);
              } else {
                  setDsDivision('');
              }
          } else {
             setDsDivision('');
          }
        } catch (error) {
          console.error("Failed to load DS Divisions", error);
          setDsDivisionsList([]);
          setDsDivision('');
        }
      } else {
        setDsDivisionsList([]);
        setDsDivision('');
      }
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
          if (pendingLocationUpdate.current?.gn) {
              const match = gns.find(g => g.name === pendingLocationUpdate.current?.gn);
              if (match) {
                  setGnDivision(match.name);
              } else {
                  setGnDivision('');
              }
              pendingLocationUpdate.current = null;
          } else {
            setGnDivision('');
          }

        } catch (error) {
          console.error("Failed to load GN Divisions", error);
          setGnDivisionsList([]);
          setGnDivision('');
        }
      } else {
        setGnDivisionsList([]);
        setGnDivision('');
      }
    };

    fetchGNDivisions();
  }, [dsDivision]);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    const fetchPostalCode = async () => {
        if (city && !postalCode) {
            try {
                const code = await LocationService.getPostalCodeByAddress(city, district);
                if (code) setPostalCode(code);
            } catch (e) {
                console.error("Failed to auto-fetch postal code", e);
            }
        }
    };
    
    const timeoutId = setTimeout(fetchPostalCode, 1000);
    return () => clearTimeout(timeoutId);
  }, [city, district, postalCode]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const details = await LocationService.getLocationDetails(latitude, longitude);

          if (details.province) setProvince(details.province);
          if (details.dsDivision || details.gnDivision) {
              pendingLocationUpdate.current = {
                  ds: details.dsDivision,
                  gn: details.gnDivision,
                  gnNumber: details.gnNumber
              };
          }

          if (details.district) setDistrict(details.district); 
          
          if (details.city) setCity(details.city);
          if (details.address) setAddress(details.address);
          if (details.postalCode) setPostalCode(details.postalCode);
          
        } catch (error) {
          console.error("Error getting location details:", error);
          alert("Failed to fetch location details.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLoadingLocation(false);
        alert("Unable to retrieve your location.");
      }
    );
  };

  const [passbookFiles, setPassbookFiles] = useState<File[]>([]);
  const [gnFiles, setGnFiles] = useState<File[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const crops = ['Paddy', 'Corn', 'Tea', 'Cinnamon', 'Vegetables'];

  const handleSendVerification = () => {
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

  const handleNICChange = (value: string) => {
    setNicNumber(value);
    setNicError('');
    
    if (value.trim() === '') {
      setBirthday('');
      setGender('');
      setAge(null);
      return;
    }
    
    // Validate NIC when user types (debounced effect)
    if (value.length === 10 || value.length === 12) {
      const result = validateNIC(value);
      
      if (result.isValid) {
        setBirthday(result.birthday || '');
        setGender(result.gender || '');
        setAge(result.age || null);
        setNicError('');
      } else {
        setBirthday('');
        setGender('');
        setAge(null);
        setNicError(result.error || 'Invalid NIC');
      }
    }
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

                <ProfileStepper activeStep={1} steps={steps} />
            </Box>
        </Box>
        
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
          <Grid size={{ xs: 12, lg: 8 }}>
            
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
                  <TextField 
                    fullWidth 
                    label="National ID Number" 
                    placeholder="Enter National ID Number" 
                    variant="outlined" 
                    value={nicNumber}
                    onChange={(e) => handleNICChange(e.target.value.toUpperCase())}
                    error={!!nicError}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{
                      input: {
                        endAdornment: nicNumber && (
                          <InputAdornment position="end">
                            {nicError ? (
                              <Tooltip title={nicError} arrow placement="top">
                                <CancelIcon sx={{ color: 'error.main', fontSize: 24 }} />
                              </Tooltip>
                            ) : birthday ? (
                              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
                            ) : null}
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Gender" 
                    placeholder="Gender" 
                    variant="outlined" 
                    value={gender}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: gender ? 'rgba(255, 255, 255, 0.87)' : 'rgba(255, 255, 255, 0.38)',
                        fontWeight: gender ? 600 : 400
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Date of Birth" 
                    placeholder="Date of Birth" 
                    variant="outlined" 
                    value={birthday ? new Date(birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: birthday ? 'rgba(255, 255, 255, 0.87)' : 'rgba(255, 255, 255, 0.38)',
                        fontWeight: birthday ? 600 : 400
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Age" 
                    placeholder="Age"
                    variant="outlined" 
                    value={age !== null ? `${age} years` : ''}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: age !== null ? 'rgba(255, 255, 255, 0.87)' : 'rgba(255, 255, 255, 0.38)',
                        fontWeight: age !== null ? 600 : 400
                      }
                    }}
                  />
                </Grid>

                {/* Address Subheading */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                    Address
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Street Address (No / Lane)" 
                    placeholder="123 Green Lane" 
                    variant="outlined" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    InputLabelProps={{ shrink: true }} 
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="City / Town" 
                    placeholder="Enter City" 
                    variant="outlined" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    InputLabelProps={{ shrink: true }} 
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton 
                                        onClick={handleUseMyLocation} 
                                        disabled={isLoadingLocation}
                                        title="Use My Location"
                                        color="primary"
                                    >
                                        {isLoadingLocation ? <CircularProgress size={24} /> : <MyLocation />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                  />
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
                  <TextField 
                    fullWidth 
                    label="Postal Code" 
                    placeholder="XXXXX" 
                    variant="outlined" 
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    InputLabelProps={{ shrink: true }} 
                  />
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
