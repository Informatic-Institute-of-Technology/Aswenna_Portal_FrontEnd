import { FileUploader, ImageGallery, ProfileStepper } from '@/components';
import { validateNIC } from '@/utils';
import {
    Add as AddIcon,
    ArrowBack,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Description,
    Landscape,
    Lightbulb,
    MyLocation,
    PhotoLibrary,
    Place,
    ZoomIn,
    ZoomOut
} from '@mui/icons-material';
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    type SelectChangeEvent,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandownerProfileSetup = () => {
    const navigate = useNavigate();
    const steps = ['Step 1', 'Step 2', 'Step 3'];

    // Personal Information
    const [fullName, setFullName] = useState('');
    const [personalAddress, setPersonalAddress] = useState('');
    
    // NIC Validation States
    const [nicNumber, setNicNumber] = useState('');
    const [nicError, setNicError] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
    const [age, setAge] = useState<number | null>(null);

    // Land Address & Specifications
    const [landLocation, setLandLocation] = useState('');
    const [landSize, setLandSize] = useState('');
    const [soilType, setSoilType] = useState('');
    const [rentalExpectation, setRentalExpectation] = useState('');

    // Legal Documentation
    const [certificateFiles, setCertificateFiles] = useState<File[]>([]);

    // Land Gallery
    const [galleryImages, setGalleryImages] = useState<{ file: File; preview: string }[]>([]);

    // Map Pin Location (coordinates)
    const [pinLocation, setPinLocation] = useState<{ lat: number; lng: number } | null>(null);

    const soilTypes = ['Sandy Loam', 'Clay', 'Loamy', 'Silt', 'Peaty', 'Chalky', 'Sandy'];

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
        
        // Validate NIC when user types
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

    const handleSoilTypeChange = (event: SelectChangeEvent<string>) => {
        setSoilType(event.target.value);
    };

    const handleCertificateFilesSelected = (newFiles: File[]) => {
        setCertificateFiles(prev => [...prev, ...newFiles]);
    };

    const handleCertificateFileDelete = (index: number) => {
        setCertificateFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleGalleryImageAdd = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newImages = Array.from(event.target.files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setGalleryImages(prev => [...prev, ...newImages]);
        }
    };

    const handleGalleryImageDelete = (index: number) => {
        // Revoke the preview URL to free memory
        const imageToDelete = galleryImages[index];
        if (imageToDelete) {
            URL.revokeObjectURL(imageToDelete.preview);
        }
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleZoomIn = () => {
        // TODO: Integrate with actual map component
        console.log("Zoom in");
    };

    const handleZoomOut = () => {
        // TODO: Integrate with actual map component
        console.log("Zoom out");
    };

    const handlePinLocation = () => {
        // Get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPinLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to get your location");
                }
            );
        }
    };

    const handleCompleteRegistration = () => {
        // TODO: Implement form submission
        console.log({
            fullName,
            personalAddress,
            landLocation,
            landSize,
            soilType,
            rentalExpectation,
            certificateFiles,
            galleryImages,
            pinLocation
        });
        navigate('/landowner/dashboard');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
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
                                Landowner <span style={{ color: '#6B8E23' }}>Profile</span>
                            </Typography>
                        </Box>

                        {/* Stepper */}
                        <ProfileStepper activeStep={2} steps={steps} />
                    </Box>
                </Box>

                {/* Main Content */}
                <Grid container spacing={3}>
                    {/* Left Column */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        {/* Personal Information */}
                        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Place sx={{ color: 'primary.main', mr: 1.5 }} />
                                <Typography variant="h6" fontWeight="bold">Personal Information</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        placeholder="John Doe"
                                        variant="outlined"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="National ID Number"
                                        placeholder="9 digits + X/V or 12 digits"
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Gender"
                                        placeholder="Auto-filled from NIC"
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Date of Birth"
                                        placeholder="Auto-filled from NIC"
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Age"
                                        placeholder="Auto-filled from NIC"
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

                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Personal Address"
                                        placeholder="123 Residential Ave"
                                        variant="outlined"
                                        value={personalAddress}
                                        onChange={(e) => setPersonalAddress(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Land Address & Specifications */}
                        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Landscape sx={{ color: 'primary.main', mr: 1.5 }} />
                                <Typography variant="h6" fontWeight="bold">Land Address & Specifications</Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Location of the Land"
                                        placeholder="Anuradhapura District"
                                        variant="outlined"
                                        value={landLocation}
                                        onChange={(e) => setLandLocation(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Land Size / Area (Acres)"
                                        placeholder="5.5"
                                        variant="outlined"
                                        type="number"
                                        value={landSize}
                                        onChange={(e) => setLandSize(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel shrink>Soil Type</InputLabel>
                                        <Select
                                            value={soilType}
                                            onChange={handleSoilTypeChange}
                                            displayEmpty
                                            label="Soil Type"
                                            notched
                                        >
                                            <MenuItem value="" disabled>Select Soil Type</MenuItem>
                                            {soilTypes.map((type) => (
                                                <MenuItem key={type} value={type}>{type}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Rental Expectation (Monthly)"
                                        placeholder="LKR 45,000"
                                        variant="outlined"
                                        value={rentalExpectation}
                                        onChange={(e) => setRentalExpectation(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Legal Documentation */}
                        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Description sx={{ color: 'primary.main', mr: 1.5 }} />
                                <Typography variant="h6" fontWeight="bold">Legal Documentation</Typography>
                            </Box>
                            <FileUploader
                                label="Upload Bimsaviya Certificate"
                                helperText="PDF, JPG, or PNG (Max 10MB)"
                                files={certificateFiles}
                                onFilesSelected={handleCertificateFilesSelected}
                                onFileDelete={handleCertificateFileDelete}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </Paper>

                        {/* Complete Registration Button */}
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleCompleteRegistration}
                            sx={{
                                py: 1.5,
                                bgcolor: 'primary.main',
                                fontWeight: 'bold',
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: 'primary.dark'
                                }
                            }}
                        >
                            Complete Registration
                        </Button>
                    </Grid>

                    {/* Right Column */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        {/* Pin Land Location */}
                        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MyLocation sx={{ color: 'primary.main', mr: 1.5 }} />
                                    <Typography variant="h6" fontWeight="bold">Pin Land Location</Typography>
                                </Box>
                                <Button
                                    size="small"
                                    onClick={handlePinLocation}
                                    sx={{ color: 'primary.main', textTransform: 'none' }}
                                >
                                    LIVE VIEW
                                </Button>
                            </Box>

                            {/* Map Placeholder */}
                            <Box sx={{
                                position: 'relative',
                                height: 220,
                                borderRadius: 2,
                                overflow: 'hidden',
                                bgcolor: '#1a2e1a',
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M0 50 Q25 30 50 50 Q75 70 100 50\' fill=\'none\' stroke=\'%23223322\' stroke-width=\'2\'/%3E%3C/svg%3E")',
                                backgroundSize: '100px 100px'
                            }}>
                                {/* Pin Marker */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -100%)'
                                }}>
                                    <Place sx={{ fontSize: 40, color: 'primary.main' }} />
                                </Box>

                                {/* Zoom Controls */}
                                <Box sx={{
                                    position: 'absolute',
                                    right: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5
                                }}>
                                    <IconButton
                                        size="small"
                                        onClick={handleZoomIn}
                                        sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}
                                    >
                                        <ZoomIn fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={handleZoomOut}
                                        sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}
                                    >
                                        <ZoomOut fontSize="small" />
                                    </IconButton>
                                </Box>

                                {pinLocation && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: 8,
                                            bgcolor: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1
                                        }}
                                    >
                                        {pinLocation.lat.toFixed(4)}, {pinLocation.lng.toFixed(4)}
                                    </Typography>
                                )}
                            </Box>
                        </Paper>

                        {/* Land Gallery */}
                        <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PhotoLibrary sx={{ color: 'primary.main', mr: 1.5 }} />
                                    <Typography variant="h6" fontWeight="bold">Land Gallery</Typography>
                                </Box>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => document.getElementById('gallery-input')?.click()}
                                    sx={{ color: 'primary.main', textTransform: 'none' }}
                                >
                                    Add more
                                </Button>
                            </Box>
                            <ImageGallery
                                images={galleryImages}
                                onImageAdd={handleGalleryImageAdd}
                                onImageDelete={handleGalleryImageDelete}
                            />
                        </Paper>

                        {/* Expert Tip */}
                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Lightbulb sx={{ color: 'white' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Expert Tip
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Uploading clear, wide-angle photos of your land increases investor interest by up to 45%. Ensure boundaries are clearly visible.
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                        © 2024 Aswenna Platform. Sustainably Connecting Agriculture and Opportunity.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default LandownerProfileSetup;
