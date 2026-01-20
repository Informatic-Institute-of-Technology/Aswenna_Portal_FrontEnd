import { Box, CircularProgress, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA3L-q18zc1dET4FtGpbC4GRfjd60KfWlc';

interface Coordinates {
  lat: number;
  lng: number;
}

interface SriLankaMapProps {
  location?: string;
  coordinates?: Coordinates;
}

const SriLankaMap = ({ location = 'Colombo, Sri Lanka', coordinates }: SriLankaMapProps) => {
  const [loading, setLoading] = useState(!coordinates);
  const [error, setError] = useState<string | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates | null>(coordinates || null);

  const getLocationData = useCallback(async (address: string) => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key is missing');
      console.error('API key is missing');
      return null;
    }

    if (!address || typeof address !== 'string') {
      setError('Invalid address provided');
      console.error('Invalid address provided');
      return null;
    }

    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

      console.log('Fetching location data for:', address);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Geocoding response:', data);

      if (data.status !== 'OK') {
        throw new Error(`Geocoding API error: ${data.status}`);
      }

      const locationData = data.results[0].geometry.location;
      return {
        lat: locationData.lat,
        lng: locationData.lng,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching location data:', errorMessage);
      return null;
    }
  }, []);

  useEffect(() => {
    if (coordinates) {
      setMapCoordinates(coordinates);
      setLoading(false);
      return;
    }

    const fetchCoordinates = async () => {
      setLoading(true);
      const coords = await getLocationData(location);
      if (coords) {
        setMapCoordinates(coords);
      }
      setLoading(false);
    };

    fetchCoordinates();
  }, [location, coordinates, getLocationData]);


  if (error) {
    return (
      <Box
        sx={{
          height: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Map Unavailable
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (loading || !mapCoordinates) {
    return (
      <Box
        sx={{
          height: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading Map...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          height: 500,
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
        }}
      >
        <iframe
          title={location}
          src={`https://www.google.com/maps?q=${mapCoordinates.lat},${mapCoordinates.lng}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allowFullScreen
          loading="lazy"
        />
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#d32f2f' }} />
          <Typography variant="caption">
            {location}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SriLankaMap;
