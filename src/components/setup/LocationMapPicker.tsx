import { Box, CircularProgress } from '@mui/material';
import { GoogleMap, Marker } from '@react-google-maps/api';

interface LocationMapPickerProps {
    isLoaded: boolean;
    center: { lat: number; lng: number };
    pinLocation: { lat: number; lng: number } | null;
    zoom?: number;
    onMapClick: (e: google.maps.MapMouseEvent) => void;
    onMapLoad: (map: google.maps.Map) => void;
    onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
    height?: string;
}

const LocationMapPicker = ({
    isLoaded,
    center,
    pinLocation,
    zoom = 8,
    onMapClick,
    onMapLoad,
    onMarkerDragEnd,
    height = '300px'
}: LocationMapPickerProps) => {
    if (!isLoaded) {
        return (
            <Box sx={{
                width: '100%',
                height,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: '#1a2e1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <CircularProgress sx={{ color: 'primary.main' }} />
            </Box>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={{
                width: '100%',
                height: height,
                borderRadius: '8px'
            }}
            center={pinLocation || center}
            zoom={pinLocation ? 15 : zoom}
            onClick={onMapClick}
            onLoad={onMapLoad}
            options={{
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
                zoomControl: true,
                mapTypeId: 'hybrid',
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT,
                    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
                }
            }}
        >
            {pinLocation && (
                <Marker
                    position={pinLocation}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                    animation={google.maps.Animation.DROP}
                />
            )}
        </GoogleMap>
    );
};

export default LocationMapPicker;
