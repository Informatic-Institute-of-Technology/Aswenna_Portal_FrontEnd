import { Box, CircularProgress, Typography } from '@mui/material';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA3L-q18zc1dET4FtGpbC4GRfjd60KfWlc';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationMarker extends Coordinates {
  id?: string | number;
  name: string;
  farmers?: number;
  investors?: number;
  landowners?: number;
  total?: number;
  type?: 'farmers' | 'investors' | 'landowners' | 'mixed';
}

interface ProvinceDistribution {
  [province: string]: {
    farmers: number;
    investors: number;
    landowners: number;
    total: number;
  };
}

interface SriLankaMapProps {
  location?: string;
  coordinates?: Coordinates;
  userDistribution?: { [key: string]: number };
  provinceDistribution?: ProvinceDistribution;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const getMarkerIcon = (type: 'farmers' | 'investors' | 'landowners', size: number = 45) => {
  const icons = {
    farmers: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 10}" viewBox="0 0 24 34">
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.5 9 18 9 18s9-11.5 9-18c0-4.97-4.03-9-9-9z" fill="#4CAF50"/>
        <g transform="translate(7, 4) scale(0.42)">
          <path fill="#FFFFFF" d="M4,11h2v3H4V11z M18,10h2v4h-2V10z M1.5,5C0.67,5,0,5.67,0,6.5S0.67,8,1.5,8S3,7.33,3,6.5S2.33,5,1.5,5z M22.5,10c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S23.33,10,22.5,10z M8,16h8v-5H8V16z M6,17c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S7.1,17,6,17z M18,17c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S19.1,17,18,17z M12,2L8,4v5h8V4L12,2z"/>
        </g>
      </svg>
    `)}`,
    investors: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 10}" viewBox="0 0 24 34">
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.5 9 18 9 18s9-11.5 9-18c0-4.97-4.03-9-9-9z" fill="#FF9800"/>
        <g transform="translate(7, 4) scale(0.42)">
          <path fill="#FFFFFF" d="M12,7V3H2v18h20V7H12z M6,19H4v-2h2V19z M6,15H4v-2h2V15z M6,11H4V9h2V11z M6,7H4V5h2V7z M10,19H8v-2h2V19z M10,15H8v-2h2V15z M10,11H8V9h2V11z M10,7H8V5h2V7z M20,19h-8v-2h2v-2h-2v-2h2v-2h-2V9h8V19z M18,11h-2v2h2V11z M18,15h-2v2h2V15z"/>
        </g>
      </svg>
    `)}`,
    landowners: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 10}" viewBox="0 0 24 34">
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.5 9 18 9 18s9-11.5 9-18c0-4.97-4.03-9-9-9z" fill="#9C27B0"/>
        <g transform="translate(7, 5) scale(0.42)">
          <path fill="#FFFFFF" d="M14,6l-3.75,5l2.85,3.8l-1.6,1.2C9.81,13.75,7,10,7,10l-6,8h22L14,6z"/>
        </g>
      </svg>
    `)}`
  };
  return icons[type];
};

const SriLankaMap = ({ location = 'Kegalle, Sri Lanka', coordinates, userDistribution, provinceDistribution }: SriLankaMapProps) => {
  const [loading, setLoading] = useState(!coordinates && !userDistribution && !provinceDistribution);
  const [error, setError] = useState<string | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates | null>(coordinates || null);
  const [markers, setMarkers] = useState<LocationMarker[]>([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

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
    // If provinceDistribution provided, geocode all provinces and create markers for each role
    if (provinceDistribution && Object.keys(provinceDistribution).length > 0) {
      const fetchProvinceMarkers = async () => {
        setLoading(true);
        const fetchedMarkers: LocationMarker[] = [];
        
        for (const [province, data] of Object.entries(provinceDistribution)) {
          const coords = await getLocationData(`${province} Province, Sri Lanka`);
          if (coords) {
            // Create separate markers for each user type in this province
            const offset = 0.05; // Small offset to separate markers
            
            if (data.farmers > 0) {
              fetchedMarkers.push({
                ...coords,
                lat: coords.lat + offset,
                lng: coords.lng - offset,
                id: `${province}-farmers`,
                name: province,
                farmers: data.farmers,
                total: data.total,
                type: 'farmers',
              });
            }
            
            if (data.investors > 0) {
              fetchedMarkers.push({
                ...coords,
                lat: coords.lat - offset,
                id: `${province}-investors`,
                name: province,
                investors: data.investors,
                total: data.total,
                type: 'investors',
              });
            }
            
            if (data.landowners > 0) {
              fetchedMarkers.push({
                ...coords,
                lat: coords.lat + offset,
                lng: coords.lng + offset,
                id: `${province}-landowners`,
                name: province,
                landowners: data.landowners,
                total: data.total,
                type: 'landowners',
              });
            }
          }
        }
        
        if (fetchedMarkers.length > 0) {
          setMarkers(fetchedMarkers);
          setMapCoordinates({ lat: 7.8731, lng: 80.7718 });
        }
        setLoading(false);
      };

      fetchProvinceMarkers();
      return;
    }

    if (userDistribution && Object.keys(userDistribution).length > 0) {
      const fetchDistributionMarkers = async () => {
        setLoading(true);
        const fetchedMarkers: LocationMarker[] = [];
        
        for (const [city, count] of Object.entries(userDistribution)) {
          const coords = await getLocationData(`${city}, Sri Lanka`);
          if (coords) {
            fetchedMarkers.push({
              ...coords,
              id: city,
              name: city,
              total: count,
              type: 'mixed',
            });
          }
        }
        
        if (fetchedMarkers.length > 0) {
          setMarkers(fetchedMarkers);
          const centerLat = fetchedMarkers.reduce((sum, m) => sum + m.lat, 0) / fetchedMarkers.length;
          const centerLng = fetchedMarkers.reduce((sum, m) => sum + m.lng, 0) / fetchedMarkers.length;
          setMapCoordinates({ lat: centerLat, lng: centerLng });
        }
        setLoading(false);
      };

      fetchDistributionMarkers();
      return;
    }

    if (coordinates) {
      setMapCoordinates(coordinates);
      setMarkers([{ ...coordinates, name: location }]);
      setLoading(false);
      return;
    }

    const fetchCoordinates = async () => {
      setLoading(true);
      const coords = await getLocationData(location);
      if (coords) {
        setMapCoordinates(coords);
        setMarkers([{ ...coords, name: location }]);
      }
      setLoading(false);
    };

    fetchCoordinates();
  }, [location, coordinates, userDistribution, provinceDistribution, getLocationData]);

  if (loadError) {
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
            Failed to Load Google Maps
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loadError.message}
          </Typography>
        </Box>
      </Box>
    );
  }

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

  if (loading || !mapCoordinates || !isLoaded) {
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
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCoordinates}
          zoom={markers.length > 1 ? 7 : 12}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
            mapTypeId: 'satellite', // Set satellite view as default
          }}
        >
          {markers.map((marker, index) => {
            const getTitle = () => {
              if (marker.type === 'farmers') return `${marker.name} - Farmers: ${marker.farmers}`;
              if (marker.type === 'investors') return `${marker.name} - Investors: ${marker.investors}`;
              if (marker.type === 'landowners') return `${marker.name} - Landowners: ${marker.landowners}`;
              return `${marker.name} - Total: ${marker.total}`;
            };

            return (
              <Marker
                key={marker.id || index}
                position={{ lat: marker.lat, lng: marker.lng }}
                title={getTitle()}
                icon={marker.type && marker.type !== 'mixed' ? {
                  url: getMarkerIcon(marker.type),
                  scaledSize: new window.google.maps.Size(45, 55),
                  anchor: new window.google.maps.Point(22.5, 55),
                } : undefined}
              />
            );
          })}
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default SriLankaMap;
