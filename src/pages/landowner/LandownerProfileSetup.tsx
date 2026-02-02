import {
    AdministrativeFields,
    FileUploader,
    FormSection,
    ImageGallery,
    LocationMapPicker,
    ProfileStepper
} from '@/components';
import { LocationService } from '@/services';
import { validateNIC } from '@/utils';
import {
    AccountBalance,
    Add as AddIcon,
    ArrowBack,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Description,
    Lightbulb,
    LocationOn,
    MyLocation,
    PhotoLibrary,
    Place
} from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';
import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandownerProfileSetup = () => {
    const navigate = useNavigate();
    const steps = ['Step 1', 'Step 2', 'Step 3'];

    // Google Maps Configuration
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: LocationService.getGoogleMapsApiKey()
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const defaultCenter = LocationService.getDefaultMapCenter();

    const [fullName, setFullName] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    
    const [nicNumber, setNicNumber] = useState('');
    const [nicError, setNicError] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
    const [age, setAge] = useState<number | null>(null);

    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [dsDivision, setDsDivision] = useState('');
    const [gnDivision, setGnDivision] = useState('');
    const [dsDivisionsList, setDsDivisionsList] = useState<string[]>([]);
    const [gnDivisionsList, setGnDivisionsList] = useState<{name: string, number: string}[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const pendingLocationUpdate = useRef<{ ds?: string, gn?: string, gnNumber?: string } | null>(null);
    const pendingLandLocationUpdate = useRef<{ ds?: string, gn?: string, gnNumber?: string } | null>(null);

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

    const [landStreet, setLandStreet] = useState('');
    const [landCity, setLandCity] = useState('');
    const [landProvince, setLandProvince] = useState('');
    const [landDistrict, setLandDistrict] = useState('');
    const [landPostalCode, setLandPostalCode] = useState('');
    const [landDsDivision, setLandDsDivision] = useState('');
    const [landGnDivision, setLandGnDivision] = useState('');
    const [landDsDivisionsList, setLandDsDivisionsList] = useState<string[]>([]);
    const [landGnDivisionsList, setLandGnDivisionsList] = useState<{name: string, number: string}[]>([]);
    const [landSize, setLandSize] = useState('');
    const [soilType, setSoilType] = useState('');
    const [rentalExpectation, setRentalExpectation] = useState('');

    const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
    const [galleryImages, setGalleryImages] = useState<{ file: File; preview: string }[]>([]);
    const [pinLocation, setPinLocation] = useState<{ lat: number; lng: number } | null>(defaultCenter);

    const soilTypes = ['Sandy Loam', 'Clay', 'Loamy', 'Silt', 'Peaty', 'Chalky', 'Sandy'];

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

    useEffect(() => {
        const fetchLandDSDivisions = async () => {
            if (landDistrict) {
                try {
                    const divisions = await LocationService.getDSDivisionsByDistrict(landDistrict);
                    setLandDsDivisionsList(divisions);
                    
                    // Check if we have a pending DS division to set from map interaction
                    if (pendingLandLocationUpdate.current?.ds) {
                        const match = divisions.find(d => d.toLowerCase() === pendingLandLocationUpdate.current?.ds?.toLowerCase());
                        if (match) {
                            setLandDsDivision(match);
                        } else {
                            console.warn('Pending DS Division not found in list:', pendingLandLocationUpdate.current?.ds);
                            setLandDsDivision('');
                        }
                    } else {
                        setLandDsDivision('');
                    }
                } catch (error) {
                    console.error("Failed to load Land DS Divisions", error);
                    setLandDsDivisionsList([]);
                    setLandDsDivision('');
                }
            } else {
                setLandDsDivisionsList([]);
                setLandDsDivision('');
            }
        };

        fetchLandDSDivisions();
    }, [landDistrict]);

    useEffect(() => {
        const fetchLandGNDivisions = async () => {
            if (landDsDivision) {
                try {
                    const gns = await LocationService.getGNDivisionsByDSDivision(landDsDivision);
                    setLandGnDivisionsList(gns);
                    
                    // Check if we have a pending GN division to set from map interaction
                    if (pendingLandLocationUpdate.current?.gn) {
                        const match = gns.find(g => g.name.toLowerCase() === pendingLandLocationUpdate.current?.gn?.toLowerCase());
                        if (match) {
                            setLandGnDivision(match.name);
                        } else {
                            console.warn('Pending GN Division not found in list:', pendingLandLocationUpdate.current?.gn);
                            setLandGnDivision('');
                        }
                        // Clear the pending update after processing
                        pendingLandLocationUpdate.current = null;
                    } else {
                        setLandGnDivision('');
                    }
                } catch (error) {
                    console.error("Failed to load Land GN Divisions", error);
                    setLandGnDivisionsList([]);
                    setLandGnDivision('');
                }
            } else {
                setLandGnDivisionsList([]);
                setLandGnDivision('');
            }
        };

        fetchLandGNDivisions();
    }, [landDsDivision]);

    useEffect(() => {
        const fetchPostalCode = async () => {
            if (city && district && !postalCode) {
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

    // Geocode land address and update map pin when manually entered
    useEffect(() => {
        const geocodeLandAddress = async () => {
            // Only geocode if we have at least street and city
            if (!landStreet || !landCity) {
                return;
            }

            try {
                console.log('Geocoding land address:', { landStreet, landCity, landDistrict, landProvince });
                
                const coordinates = await LocationService.geocodeAddress(
                    landStreet,
                    landCity,
                    landDistrict,
                    landProvince
                );

                if (coordinates) {
                    console.log('Geocoded coordinates:', coordinates);
                    setPinLocation(coordinates);
                    
                    if (map) {
                        map.panTo(coordinates);
                    }

                    try {
                        const locationDetails = await LocationService.getLocationDetails(
                            coordinates.lat,
                            coordinates.lng
                        );

                        if (locationDetails) {
                            if (locationDetails.dsDivision) {
                                const divisions = await LocationService.getDSDivisionsByDistrict(landDistrict);
                                const matchingDs = divisions.find(
                                    d => d.toLowerCase() === locationDetails.dsDivision?.toLowerCase()
                                );
                                if (matchingDs) {
                                    setLandDsDivision(matchingDs);
                                
                                    if (locationDetails.gnDivision) {
                                        const gns = await LocationService.getGNDivisionsByDSDivision(matchingDs);
                                        const matchingGn = gns.find(
                                            g => g.name === locationDetails.gnDivision
                                        );
                                        if (matchingGn) {
                                            setLandGnDivision(matchingGn.name);
                                        }
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching location details for geocoded address:', error);
                    }
                } else {
                    console.log('Could not geocode the address');
                }
            } catch (error) {
                console.error('Error geocoding land address:', error);
            }
        };

        const timeoutId = setTimeout(geocodeLandAddress, 1500);
        return () => clearTimeout(timeoutId);
    }, [landStreet, landCity, landDistrict, landProvince, map]);

    const handleBack = () => {
        navigate('/role-selection');
    };

    const handleProvinceChange = (event: SelectChangeEvent<string>) => {
        setProvince(event.target.value);
        setDistrict('');
    };

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
                    if (details.address) {
                        const addressParts = details.address.split(',');
                        if (addressParts.length > 0) setStreet(addressParts[0].trim());
                    }
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

    const handleNICChange = (value: string) => {
        setNicNumber(value);
        setNicError('');
        
        if (value.trim() === '') {
            setBirthday('');
            setGender('');
            setAge(null);
            return;
        }
        
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
        const imageToDelete = galleryImages[index];
        if (imageToDelete) {
            URL.revokeObjectURL(imageToDelete.preview);
        }
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const handlePinLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setPinLocation({
                        lat: latitude,
                        lng: longitude
                    });

                    if (map) {
                        map.panTo({ lat: latitude, lng: longitude });
                        map.setZoom(15);
                    }

                    try {
                        const address = await LocationService.reverseGeocode(latitude, longitude);
                        if (address) {
                            const parts = address.split(',').map(p => p.trim());
                            if (parts.length > 0) setLandStreet(parts[0]);
                            if (parts.length > 1) setLandCity(parts[1]);
                        }
                        
                        const details = await LocationService.getLocationDetails(latitude, longitude);
                        if (details.province) setLandProvince(details.province);
                        if (details.postalCode) setLandPostalCode(details.postalCode);
                        
                        if (details.district) {
                            setLandDistrict(details.district);
                            
                            try {
                                const dsDivisions = await LocationService.getDSDivisionsByDistrict(details.district);
                                setLandDsDivisionsList(dsDivisions);
                                
                                if (details.dsDivision && dsDivisions.length > 0) {
                                    const matchingDs = dsDivisions.find(ds => 
                                        ds.toLowerCase() === details.dsDivision?.toLowerCase()
                                    );
                                    if (matchingDs) {
                                        setLandDsDivision(matchingDs);
                                        
                                        try {
                                            const gnDivisions = await LocationService.getGNDivisionsByDSDivision(matchingDs);
                                            setLandGnDivisionsList(gnDivisions);
                                            
                                            if (details.gnDivision && gnDivisions.length > 0) {
                                                const matchingGn = gnDivisions.find(gn => 
                                                    gn.name.toLowerCase() === details.gnDivision?.toLowerCase()
                                                );
                                                if (matchingGn) {
                                                    setLandGnDivision(matchingGn.name);
                                                }
                                            }
                                        } catch (gnError) {
                                            console.error("Failed to load Land GN Divisions", gnError);
                                        }
                                    }
                                }
                            } catch (dsError) {
                                console.error("Failed to load Land DS Divisions", dsError);
                            }
                        }
                    } catch (error) {
                        console.error("Error getting location details:", error);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to get your location");
                }
            );
        }
    };

    const handleMapClick = async (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            
            setPinLocation({ lat, lng });

            try {
                const address = await LocationService.reverseGeocode(lat, lng);
                if (address) {
                    const parts = address.split(',').map(p => p.trim());
                    if (parts.length > 0) setLandStreet(parts[0]);
                    if (parts.length > 1) setLandCity(parts[1]);
                }
                
                const details = await LocationService.getLocationDetails(lat, lng);
                console.log('Location details received:', details);
                
                if (details.province) setLandProvince(details.province);
                if (details.postalCode) setLandPostalCode(details.postalCode);
                
                if (details.district) {
                    // Store DS/GN divisions in ref for the useEffect to handle
                    if (details.dsDivision || details.gnDivision) {
                        pendingLandLocationUpdate.current = {
                            ds: details.dsDivision,
                            gn: details.gnDivision,
                            gnNumber: details.gnNumber
                        };
                        console.log('Stored pending land location update:', pendingLandLocationUpdate.current);
                    }
                    
                    // Setting district will trigger the useEffect to fetch DS divisions
                    setLandDistrict(details.district);
                } else {
                    console.warn('No district in location details');
                }
            } catch (error) {
                console.error("Error getting location details:", error);
            }
        }
    };

    const onMapLoad = (map: google.maps.Map) => {
        setMap(map);
    };

    const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            
            setPinLocation({ lat, lng });

            try {
                const address = await LocationService.reverseGeocode(lat, lng);
                if (address) {
                    const parts = address.split(',').map(p => p.trim());
                    if (parts.length > 0) setLandStreet(parts[0]);
                    if (parts.length > 1) setLandCity(parts[1]);
                }
                
                const details = await LocationService.getLocationDetails(lat, lng);
                console.log('Location details received (drag):', details);
                
                if (details.province) setLandProvince(details.province);
                if (details.postalCode) setLandPostalCode(details.postalCode);
                
                if (details.district) {
                    // Store DS/GN divisions in ref for the useEffect to handle
                    if (details.dsDivision || details.gnDivision) {
                        pendingLandLocationUpdate.current = {
                            ds: details.dsDivision,
                            gn: details.gnDivision,
                            gnNumber: details.gnNumber
                        };
                        console.log('Stored pending land location update (drag):', pendingLandLocationUpdate.current);
                    }
                    
                    // Setting district will trigger the useEffect to fetch DS divisions
                    setLandDistrict(details.district);
                } else {
                    console.warn('No district in location details (drag)');
                }
            } catch (error) {
                console.error("Error getting location details (drag):", error);
            }
        }
    };

    const handleLandProvinceChange = (event: SelectChangeEvent<string>) => {
        setLandProvince(event.target.value);
        setLandDistrict('');
    };

    const handleCompleteRegistration = () => {
        console.log({
            fullName,
            houseNumber,
            street,
            city,
            province,
            district,
            postalCode,
            dsDivision,
            gnDivision,
            landStreet,
            landCity,
            landProvince,
            landDistrict,
            landPostalCode,
            landDsDivision,
            landGnDivision,
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
            <Container maxWidth="xl" sx={{ py: 2, px: 2 }}>
                <Box sx={{ mb: 3 }}>
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

                        <ProfileStepper activeStep={2} steps={steps} />
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <FormSection
                            icon={<Place sx={{ color: 'primary.main', mr: 1.5 }} />}
                            title="Personal Information"
                        >
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        placeholder="Nimsara Jayathilaka"
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
                                        placeholder="Enter the National ID Number"
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
                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                <Grid size={{ xs: 12, sm: 6 }}>
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

                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                                        Address
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="House/Building No"
                                        placeholder="123"
                                        variant="outlined"
                                        value={houseNumber}
                                        onChange={(e) => setHouseNumber(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Street"
                                        placeholder="Main Street"
                                        variant="outlined"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        placeholder="Colombo"
                                        variant="outlined"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Postal Code"
                                        placeholder="00100"
                                        variant="outlined"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </FormSection>

                        <FormSection
                            icon={<AccountBalance sx={{ color: 'primary.main', mr: 1.5 }} />}
                            title="Administrative Details"
                        >
                            <AdministrativeFields
                                district={district}
                                dsDivision={dsDivision}
                                gnDivision={gnDivision}
                                dsDivisionsList={dsDivisionsList}
                                gnDivisionsList={gnDivisionsList}
                                onDsDivisionChange={(e: SelectChangeEvent<string>) => setDsDivision(e.target.value)}
                                onGnDivisionChange={(e: SelectChangeEvent<string>) => setGnDivision(e.target.value)}
                            />
                        </FormSection>

                        <FormSection
                            icon={<Description sx={{ color: 'primary.main', mr: 1.5 }} />}
                            title="Legal Documentation"
                        >
                            <FileUploader
                                label="Upload Bimsaviya Certificate"
                                helperText="PDF, JPG, or PNG (Max 10MB)"
                                files={certificateFiles}
                                onFilesSelected={handleCertificateFilesSelected}
                                onFileDelete={handleCertificateFileDelete}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </FormSection>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <FormSection
                            icon={<MyLocation sx={{ color: 'primary.main', mr: 1.5 }} />}
                            title="Pin Land Location"
                            action={
                                <Button
                                    size="small"
                                    onClick={handlePinLocation}
                                    sx={{ color: 'primary.main', textTransform: 'none' }}
                                >
                                    LIVE VIEW
                                </Button>
                            }
                        >
                            <LocationMapPicker
                                isLoaded={isLoaded}
                                center={defaultCenter}
                                pinLocation={pinLocation}
                                onMapClick={handleMapClick}
                                onMapLoad={onMapLoad}
                                onMarkerDragEnd={handleMarkerDragEnd}
                                height="300px"
                            />
                        </FormSection>

                        <FormSection
                            icon={<LocationOn sx={{ color: 'primary.main', mr: 1.5 }} />}
                            title="Land Address & Specifications"
                        >
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                        Land Address
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Street/Area"
                                        placeholder="Main Street, Area Name"
                                        variant="outlined"
                                        value={landStreet}
                                        onChange={(e) => setLandStreet(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="City/Town"
                                        placeholder="Anamaduwa"
                                        variant="outlined"
                                        value={landCity}
                                        onChange={(e) => setLandCity(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel shrink>Province</InputLabel>
                                        <Select
                                            value={landProvince}
                                            onChange={handleLandProvinceChange}
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth disabled={!landProvince}>
                                        <InputLabel shrink>District</InputLabel>
                                        <Select
                                            value={landDistrict}
                                            onChange={(e) => setLandDistrict(e.target.value)}
                                            displayEmpty
                                            label="District"
                                            notched
                                        >
                                            <MenuItem value="" disabled>Select District</MenuItem>
                                            {landProvince && sriLankaLocations[landProvince]?.map((dist) => (
                                                <MenuItem key={dist} value={dist}>{dist}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Postal Code"
                                        placeholder="60170"
                                        variant="outlined"
                                        value={landPostalCode}
                                        onChange={(e) => setLandPostalCode(e.target.value)}
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
                        </FormSection>

                        <FormSection
                            icon={<AccountBalance sx={{ color: 'primary.main', mr: 1.5 }} />}
                            title="Land Administrative Details"
                        >
                            <AdministrativeFields
                                district={landDistrict}
                                dsDivision={landDsDivision}
                                gnDivision={landGnDivision}
                                dsDivisionsList={landDsDivisionsList}
                                gnDivisionsList={landGnDivisionsList}
                                onDsDivisionChange={(e: SelectChangeEvent<string>) => setLandDsDivision(e.target.value)}
                                onGnDivisionChange={(e: SelectChangeEvent<string>) => setLandGnDivision(e.target.value)}
                            />
                        </FormSection>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 4 }}>
                        <FormSection
                            icon={<PhotoLibrary sx={{ color: 'primary.main', mr: 1.5 }} />}
                            title="Land Gallery"
                            action={
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => document.getElementById('gallery-input')?.click()}
                                    sx={{ color: 'primary.main', textTransform: 'none' }}
                                >
                                    Add more
                                </Button>
                            }
                        >
                            <ImageGallery
                                images={galleryImages}
                                onImageAdd={handleGalleryImageAdd}
                                onImageDelete={handleGalleryImageDelete}
                            />
                        </FormSection>

                        <FormSection
                            icon={<Lightbulb sx={{ color: 'primary.main', mr: 1.5 }} />}
                            title="Expert Tip"
                            variant="bordered"
                        >
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
                        </FormSection>

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
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                        © 2024 Aswenna Platform. Sustainably Connecting Agriculture and Opportunity.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default LandownerProfileSetup;
