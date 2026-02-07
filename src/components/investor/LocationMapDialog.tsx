import { useAuth } from '@/Context/useAuth';
import { Agriculture, Close, Email, LocationOn, Map as MapIcon, Phone, Place, Public, Star } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Dialog,
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
    Typography,
} from '@mui/material';
import { GoogleMap, InfoWindow, Marker, useLoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Function to geocode address to coordinates
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (!address || !GOOGLE_MAPS_API_KEY) return null;
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      console.log(`Geocoded "${address}" to:`, location);
      return { lat: location.lat, lng: location.lng };
    } else {
      console.warn(`Geocoding failed for "${address}":`, data.status);
      return null;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Debug logging
if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is not defined in environment variables');
} else {
  console.log('Google Maps API key loaded successfully');
}

interface PartyMember {
  id: string;
  name: string;
  role: 'farmer' | 'investor' | 'landowner';
  email: string;
  phone: string;
  image?: string;
  location?: string;
  coordinates?: string; // format: "lat, lng"
  rating?: number;
  specialization?: string;
  experience?: string;
}

interface LocationMapDialogProps {
  open: boolean;
  onClose: () => void;
  partyMembers: PartyMember[];
  projectLocation: string;
  coordinates: string; // format: "lat, lng"
  district: string;
  province: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

// Custom marker icons for each role with distinct colors - LARGER SIZE
const getMarkerIcon = (role: 'farmer' | 'investor' | 'landowner' | 'project', size: number = 70) => {
  const colors = {
    farmer: '#4CAF50',      // Green
    investor: '#2196F3',    // Blue
    landowner: '#FF9800',   // Orange
    project: '#E91E63',     // Pink for project location
  };

  const icons = {
    project: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 15}" viewBox="0 0 24 34">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.5 9 18 9 18s9-11.5 9-18c0-4.97-4.03-9-9-9z" fill="${colors.project}" filter="url(#shadow)"/>
        <circle cx="12" cy="9" r="6" fill="#FFFFFF"/>
        <g transform="translate(8, 5) scale(0.45)">
          <path fill="${colors.project}" d="M12,2L12,2C6.48,2,2,6.48,2,12v10h20V12C22,6.48,17.52,2,12,2z M12,6c1.93,0,3.5,1.57,3.5,3.5S13.93,13,12,13s-3.5-1.57-3.5-3.5 S10.07,6,12,6z"/>
        </g>
      </svg>
    `)}`,
    farmer: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 15}" viewBox="0 0 24 34">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.5 9 18 9 18s9-11.5 9-18c0-4.97-4.03-9-9-9z" fill="${colors.farmer}" filter="url(#shadow)"/>
        <circle cx="12" cy="9" r="6" fill="#FFFFFF"/>
        <g transform="translate(7, 4) scale(0.5)">
          <path fill="${colors.farmer}" d="M4,11h2v3H4V11z M18,10h2v4h-2V10z M1.5,5C0.67,5,0,5.67,0,6.5S0.67,8,1.5,8S3,7.33,3,6.5S2.33,5,1.5,5z M22.5,10c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S23.33,10,22.5,10z M8,16h8v-5H8V16z M6,17c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S7.1,17,6,17z M18,17c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S19.1,17,18,17z M12,2L8,4v5h8V4L12,2z"/>
        </g>
      </svg>
    `)}`,
    investor: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 15}" viewBox="0 0 24 34">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.5 9 18 9 18s9-11.5 9-18c0-4.97-4.03-9-9-9z" fill="${colors.investor}" filter="url(#shadow)"/>
        <circle cx="12" cy="9" r="6" fill="#FFFFFF"/>
        <g transform="translate(7, 4) scale(0.5)">
          <path fill="${colors.investor}" d="M12,7V3H2v18h20V7H12z M6,19H4v-2h2V19z M6,15H4v-2h2V15z M6,11H4V9h2V11z M6,7H4V5h2V7z M10,19H8v-2h2V19z M10,15H8v-2h2V15z M10,11H8V9h2V11z M10,7H8V5h2V7z M20,19h-8v-2h2v-2h-2v-2h2v-2h-2V9h8V19z M18,11h-2v2h2V11z M18,15h-2v2h2V15z"/>
        </g>
      </svg>
    `)}`,
    landowner: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 15}" viewBox="0 0 24 34">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.5 9 18 9 18s9-11.5 9-18c0-4.97-4.03-9-9-9z" fill="${colors.landowner}" filter="url(#shadow)"/>
        <circle cx="12" cy="9" r="6" fill="#FFFFFF"/>
        <g transform="translate(7, 5) scale(0.5)">
          <path fill="${colors.landowner}" d="M14,6l-3.75,5l2.85,3.8l-1.6,1.2C9.81,13.75,7,10,7,10l-6,8h22L14,6z"/>
        </g>
      </svg>
    `)}`
  };
  
  return icons[role];
};

const getRoleColor = (role: 'farmer' | 'investor' | 'landowner' | 'project') => {
  const colors = {
    farmer: '#4CAF50',
    investor: '#2196F3',
    landowner: '#FF9800',
    project: '#E91E63',
  };
  return colors[role];
};

const LocationMapDialog = ({ 
  open, 
  onClose, 
  partyMembers, 
  projectLocation,
  coordinates, 
  district, 
  province 
}: LocationMapDialogProps) => {
  const [selectedMember, setSelectedMember] = useState<(PartyMember & { position: { lat: number; lng: number } }) | null>(null);
  const [selectedProject, setSelectedProject] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<string | null>(null);
  const { user } = useAuth();

  // Move hook to top before any conditional returns
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
    id: 'google-map-script', // Prevents multiple loads
  });

  // Geocode user address if no coordinates available
  useEffect(() => {
    const fetchUserCoordinates = async () => {
      // Skip if user already has coordinates or no address
      if (!user?.address) {
        setUserCoordinates('6.9271, 79.8612'); // Default Colombo
        return;
      }

      // Try to geocode the user's address
      const geocoded = await geocodeAddress(user.address);
      if (geocoded) {
        setUserCoordinates(`${geocoded.lat}, ${geocoded.lng}`);
        console.log(`User address "${user.address}" geocoded to: ${geocoded.lat}, ${geocoded.lng}`);
      } else {
        // Fall back to Colombo if geocoding fails
        setUserCoordinates('6.9271, 79.8612');
        console.log('Geocoding failed, using Colombo default coordinates');
      }
    };

    if (open) {
      fetchUserCoordinates();
    }
  }, [user?.address, open]);

  // Check if API key is available
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Location Map</Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error" variant="h6" gutterBottom>
              Google Maps API Key Missing
            </Typography>
            <Typography color="text.secondary">
              Please configure the VITE_GOOGLE_MAPS_API_KEY environment variable in your .env file.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Parse main project coordinates safely
  const parseCoordinates = (coordString: string) => {
    try {
      const [lat, lng] = coordString.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        console.error('Invalid coordinates:', coordString);
        return null;
      }
      return { lat, lng };
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return null;
    }
  };

  const centerCoords = parseCoordinates(coordinates);
  const center = centerCoords || { lat: 7.8731, lng: 80.7718 }; // Default to Sri Lanka center

  // Add current user as investor to the party members
  const currentUserAsMember: PartyMember = {
    id: user?._id ? `INV-${user._id.slice(-6).toUpperCase()}` : 'INV-USER',
    name: user?.fullName || user?.firstName || 'You',
    role: 'investor',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    location: user?.address || 'Colombo, Western Province',
    coordinates: userCoordinates || '6.9271, 79.8612', // Use geocoded or default Colombo coordinates
    specialization: 'Agricultural Investment Portfolio',
    experience: 'Active Investor'
  };

  // Combine current user with other party members
  const allMembers = [currentUserAsMember, ...partyMembers];

  // Create markers for each party member using their actual coordinates
  const memberMarkers = allMembers.map((member, index) => {
    let position = center; // Default to project location if no coordinates
    
    // Use member's actual coordinates if available
    if (member.coordinates) {
      const memberCoords = parseCoordinates(member.coordinates);
      if (memberCoords) {
        position = memberCoords;
        
        // If member is at same location as project, apply a small offset to make marker visible
        const isSameAsProject = centerCoords && 
          Math.abs(memberCoords.lat - centerCoords.lat) < 0.0001 && 
          Math.abs(memberCoords.lng - centerCoords.lng) < 0.0001;
        
        if (isSameAsProject) {
          console.warn(`${member.role} - ${member.name} is at project location, applying offset`);
          // Apply offset based on index (circular distribution)
          const angle = (index * 120) * (Math.PI / 180); // 120 degrees apart
          const offsetDistance = 0.015; // ~1.5km offset
          position = {
            lat: memberCoords.lat + (offsetDistance * Math.cos(angle)),
            lng: memberCoords.lng + (offsetDistance * Math.sin(angle))
          };
        }
        
        console.log(`${member.role} - ${member.name}:`, position, isSameAsProject ? '(OFFSET APPLIED)' : '(ORIGINAL)');
      } else {
        console.warn(`Invalid coordinates for ${member.role} - ${member.name}: ${member.coordinates}`);
      }
    } else {
      console.warn(`No coordinates for ${member.role} - ${member.name}`);
    }
    
    return {
      ...member,
      position
    };
  });

  console.log('Total markers:', memberMarkers.length);

  if (loadError) {
    console.error('Google Maps load error:', loadError);
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Location Map</Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error" variant="h6" gutterBottom>
              Error Loading Map
            </Typography>
            <Typography color="text.secondary" paragraph>
              {loadError.message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This could be due to:
            </Typography>
            <ul style={{ textAlign: 'left', marginTop: '8px' }}>
              <li>Invalid API key</li>
              <li>API key restrictions</li>
              <li>Network connectivity issues</li>
              <li>Google Maps API quota exceeded</li>
            </ul>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isLoaded) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Location Map</Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="500px">
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          color: 'white',
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ color: '#76c043' }} />
              Project Location Map
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mt: 0.5 }}>
              {projectLocation}, {district} District, {province} Province
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Legend */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'rgba(255,255,255,0.05)', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: 3,
          alignItems: 'center'
        }}>
          <Typography variant="body2" fontWeight={600} color="rgba(255,255,255,0.7)">
            Legend:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip 
              label="Project Location" 
              size="small"
              sx={{ 
                bgcolor: getRoleColor('project'),
                color: 'white',
                fontWeight: 600
              }}
            />
            <Chip 
              label="Farmer" 
              size="small"
              sx={{ 
                bgcolor: getRoleColor('farmer'),
                color: 'white',
                fontWeight: 600
              }}
            />
            <Chip 
              label="Investor" 
              size="small"
              sx={{ 
                bgcolor: getRoleColor('investor'),
                color: 'white',
                fontWeight: 600
              }}
            />
            <Chip 
              label="Landowner" 
              size="small"
              sx={{ 
                bgcolor: getRoleColor('landowner'),
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
          <Typography variant="body2" color="rgba(255,255,255,0.6)">
            GPS: {coordinates}
          </Typography>
        </Box>

        {/* Map */}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={8}
          options={{
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#242f3e' }]
              },
              {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#242f3e' }]
              },
              {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#746855' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
              },
            ],
          }}
        >
          {/* Project Location Marker - Pink/Red */}
          <Marker
            position={center}
            icon={{
              url: getMarkerIcon('project'),
              scaledSize: new window.google.maps.Size(80, 95),
            }}
            label={{
              text: 'PROJECT SITE',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 'bold',
              className: 'marker-label'
            }}
            onClick={() => setSelectedProject(true)}
            zIndex={1000}
            title="Project Cultivation Location"
          />

          {/* Markers for each party member */}
          {memberMarkers.map((member, index) => {
            // Set z-index to ensure party members appear above project marker
            const zIndex = 1100 + index;
            
            return (
              <Marker
                key={member.id}
                position={member.position}
                icon={{
                  url: getMarkerIcon(member.role),
                  scaledSize: new window.google.maps.Size(70, 85),
                }}
                label={{
                  text: member.name,
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  className: 'marker-label'
                }}
                onClick={() => setSelectedMember(member)}
                zIndex={zIndex}
                title={`${member.role.toUpperCase()}: ${member.name}`}
              />
            );
          })}

          {/* Info Window for Project Location */}
          {selectedProject && (
            <InfoWindow
              position={center}
              onCloseClick={() => setSelectedProject(false)}
            >
              <Box sx={{ p: 1, minWidth: 250 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Agriculture sx={{ color: 'green', fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    Project Location
                  </Typography>
                  <Chip 
                    label="ACTIVE PROJECT" 
                    size="small"
                    sx={{ 
                      bgcolor: getRoleColor('project'),
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16 }} /> {projectLocation}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Public sx={{ fontSize: 16 }} /> District: {district}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MapIcon sx={{ fontSize: 16 }} /> Province: {province}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Place sx={{ fontSize: 16 }} /> GPS: {coordinates}
                </Typography>
              </Box>
            </InfoWindow>
          )}

          {/* Info Window for Party Members */}
          {selectedMember && (
            <InfoWindow
              position={selectedMember.position}
              onCloseClick={() => setSelectedMember(null)}
            >
              <Box sx={{ p: 1, minWidth: 250 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {selectedMember.name}
                  </Typography>
                  <Chip 
                    label={selectedMember.role.toUpperCase()} 
                    size="small"
                    sx={{ 
                      bgcolor: getRoleColor(selectedMember.role),
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                {selectedMember.rating && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 16, color: '#ffc107' }} /> Rating: {selectedMember.rating.toFixed(1)}/5.0
                  </Typography>
                )}
                {selectedMember.location && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16 }} /> {selectedMember.location}
                  </Typography>
                )}
                {selectedMember.coordinates && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Place sx={{ fontSize: 14 }} /> GPS: {selectedMember.coordinates}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Email sx={{ fontSize: 16 }} /> {selectedMember.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Phone sx={{ fontSize: 16 }} /> {selectedMember.phone}
                </Typography>
                {selectedMember.specialization && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    {selectedMember.specialization}
                  </Typography>
                )}
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Party Members Table */}
        <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
            Team Members & Locations
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Member</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>GPS Coordinates</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Project Location Row */}
                <TableRow sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                  <TableCell sx={{ color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: getRoleColor('project'), width: 40, height: 40 }}>
                        <Agriculture />
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        Project Site
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label="PROJECT" 
                      size="small"
                      sx={{ 
                        bgcolor: getRoleColor('project'),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <Typography variant="body2">{projectLocation}</Typography>
                    <Typography variant="caption" color="rgba(255,255,255,0.6)">
                      {district} District, {province} Province
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {coordinates}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    -
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    -
                  </TableCell>
                </TableRow>

                {/* Party Members Rows */}
                {memberMarkers.map((member) => (
                  <TableRow 
                    key={member.id}
                    sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', cursor: 'pointer' } }}
                    onClick={() => setSelectedMember(member)}
                  >
                    <TableCell sx={{ color: 'white' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={member.role === 'investor' && !member.image 
                            ? "https://media.licdn.com/dms/image/v2/D5603AQF7Qr6f1Gapug/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1704052697627?e=2147483647&v=beta&t=5lFwZUSaC8-lmnuNau2_IiprSNOENhJuVwTbRH6Q5mU"
                            : member.image
                          }
                          sx={{ bgcolor: getRoleColor(member.role), width: 40, height: 40 }}
                        >
                          {member.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" color="rgba(255,255,255,0.6)">
                            {member.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={member.role.toUpperCase()} 
                        size="small"
                        sx={{ 
                          bgcolor: getRoleColor(member.role),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      <Typography variant="body2">{member.location}</Typography>
                      {member.specialization && (
                        <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ fontStyle: 'italic' }}>
                          {member.specialization}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {member.coordinates || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                        📧 {member.email}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                        📞 {member.phone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {member.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            ⭐ {member.rating.toFixed(1)}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMapDialog;
