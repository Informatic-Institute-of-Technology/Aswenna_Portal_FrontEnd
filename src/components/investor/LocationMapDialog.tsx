import { Close, LocationOn } from '@mui/icons-material';
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
import { useState } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA3L-q18zc1dET4FtGpbC4GRfjd60KfWlc';

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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Parse main project coordinates
  const [lat, lng] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
  const center = { lat, lng };

  // Create markers for each party member using their actual coordinates
  const memberMarkers = partyMembers.map((member, index) => {
    let position = center; // Default to project location if no coordinates
    
    // Use member's actual coordinates if available
    if (member.coordinates) {
      const [memberLat, memberLng] = member.coordinates.split(',').map(coord => parseFloat(coord.trim()));
      position = { lat: memberLat, lng: memberLng };
      
      // If member is at same location as project, apply a small offset to make marker visible
      const isSameAsProject = Math.abs(memberLat - lat) < 0.0001 && Math.abs(memberLng - lng) < 0.0001;
      if (isSameAsProject) {
        console.warn(`${member.role} - ${member.name} is at project location, applying offset`);
        // Apply offset based on index (circular distribution)
        const angle = (index * 120) * (Math.PI / 180); // 120 degrees apart
        const offsetDistance = 0.015; // ~1.5km offset
        position = {
          lat: memberLat + (offsetDistance * Math.cos(angle)),
          lng: memberLng + (offsetDistance * Math.sin(angle))
        };
      }
      
      console.log(`${member.role} - ${member.name}:`, position, isSameAsProject ? '(OFFSET APPLIED)' : '(ORIGINAL)');
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
          <Typography color="error">Error loading map: {loadError.message}</Typography>
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
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    🌾 Project Location
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  📍 {projectLocation}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  🏛️ District: {district}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  🗺️ Province: {province}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  📌 GPS: {coordinates}
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    ⭐ Rating: {selectedMember.rating.toFixed(1)}/5.0
                  </Typography>
                )}
                {selectedMember.location && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    📍 {selectedMember.location}
                  </Typography>
                )}
                {selectedMember.coordinates && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                    📌 GPS: {selectedMember.coordinates}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  📧 {selectedMember.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📞 {selectedMember.phone}
                </Typography>
                {selectedMember.specialization && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    💼 {selectedMember.specialization}
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
                        🌾
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
                          src={member.image}
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
