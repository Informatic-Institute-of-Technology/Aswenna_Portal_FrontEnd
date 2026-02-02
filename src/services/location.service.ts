interface DSDivisionAttributes {
  ds_division_name: string;
}

interface DSDivisionFeature {
  attributes: DSDivisionAttributes;
}

interface DSDivisionResponse {
  features: DSDivisionFeature[];
}

interface GNDivisionAttributes {
  gnd_name: string;
  gnd_number: string;
}

interface GNDivisionFeature {
  attributes: GNDivisionAttributes;
}

interface GNDivisionResponse {
  features: GNDivisionFeature[];
}

interface AddressComponent {
  types: string[];
  long_name: string;
}

export interface LocationDetails {
  province?: string;
  district?: string;
  dsDivision?: string;
  gnDivision?: string;
  gnNumber?: string;
  city?: string;
  address?: string;
  postalCode?: string;
}

const NSDI_DS_URL = '/nsdi-api/server/rest/services/Srilanka/Archeology/MapServer/25/query';
const NSDI_GN_URL = '/nsdi-api/server/rest/services/Srilanka/Boundaries/MapServer/1/query';

export const LocationService = {
  getGoogleMapsApiKey: (): string => {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  },

  getDefaultMapCenter: () => {
    return { lat: 7.8731, lng: 80.7718 };
  },

  reverseGeocode: async (lat: number, lng: number): Promise<string> => {
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!googleApiKey) {
      console.error('Google Maps API key not found');
      return '';
    }

    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`;
      const response = await fetch(googleUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return '';
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return '';
    }
  },

  getDSDivisionsByDistrict: async (districtName: string): Promise<string[]> => {
    try {
      const params = new URLSearchParams({
        where: `district_name = '${districtName}'`,
        outFields: 'ds_division_name',
        f: 'json',
        returnGeometry: 'false'
      });

      const response = await fetch(`${NSDI_DS_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch DS Divisions: ${response.statusText}`);
      }

      const data: DSDivisionResponse = await response.json();
      
      if (data.features && Array.isArray(data.features)) {
        return data.features
            .map(feature => feature.attributes.ds_division_name)
            .sort(); 
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching DS Divisions:', error);
      return [];
    }
  },

  getGNDivisionsByDSDivision: async (dsDivisionName: string): Promise<{name: string, number: string}[]> => {
    try {
      const upperCaseDSName = dsDivisionName.toUpperCase();
      
      const params = new URLSearchParams({
        where: `ds_division_name = '${upperCaseDSName}'`,
        outFields: 'gnd_name,gnd_number',
        f: 'json',
        returnGeometry: 'false'
      });

      const response = await fetch(`${NSDI_GN_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch GN Divisions: ${response.statusText}`);
      }

      const data: GNDivisionResponse = await response.json();
      
      if (data.features && Array.isArray(data.features)) {
        return data.features
            .map(feature => ({
              name: feature.attributes.gnd_name,
              number: feature.attributes.gnd_number
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching GN Divisions:', error);
      return [];
    }
  },

  getLocationDetails: async (lat: number, lon: number): Promise<LocationDetails> => {
    const details: LocationDetails = {};

    try {
      const params = new URLSearchParams({
        geometry: `${lon},${lat}`,
        geometryType: 'esriGeometryPoint',
        inSR: '4326',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'province_name,district_name,ds_division_name,gnd_name,gnd_number,gnd_name_gazetted',
        f: 'json'
      });

      const nsdiResponse = await fetch(`${NSDI_GN_URL}?${params.toString()}`);
      if (nsdiResponse.ok) {
        const data = await nsdiResponse.json();
        if (data.features && data.features.length > 0) {
          const attrs = data.features[0].attributes;
          
          const toTitleCase = (str: string) => 
            str ? str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : '';

          details.province = toTitleCase(attrs.province_name);
          details.district = toTitleCase(attrs.district_name);
          details.dsDivision = toTitleCase(attrs.ds_division_name);
          details.gnDivision = attrs.gnd_name;
          details.gnNumber = attrs.gnd_number;
        }
      }
    } catch (error) {
      console.error('Error fetching admin boundaries:', error);
    }
    
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (googleApiKey) {
      try {
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`;
        const googleResponse = await fetch(googleUrl);
        const googleData = await googleResponse.json();

        if (googleData.status === 'OK' && googleData.results.length > 0) {
          const primaryComponents = googleData.results[0].address_components;
          
          const getComponent = (components: AddressComponent[], type: string) => 
            components.find((c: AddressComponent) => c.types.includes(type))?.long_name;
          
          const locality = getComponent(primaryComponents, 'locality');
          const sublocality = getComponent(primaryComponents, 'sublocality');
          const route = getComponent(primaryComponents, 'route');
          const streetNumber = getComponent(primaryComponents, 'street_number');
          
          let postalCode = '';
          for (const result of googleData.results) {
            const pc = getComponent(result.address_components, 'postal_code');
            if (pc) {
              postalCode = pc;
              console.log('Found postal code from Google Maps:', postalCode);
              break;
            }
          }
          
          details.city = locality || sublocality;
          details.postalCode = postalCode;
          
          if (route) {
            details.address = streetNumber ? `${streetNumber}, ${route}` : route;
          }
          
          if (!postalCode) {
            console.log('No postal code found in Google Maps results for coordinates:', lat, lon);
          }
        } else {
          console.log('Google Maps geocoding status:', googleData.status);
        }
      } catch (error) {
        console.error('Error fetching Google Maps data:', error);
      }
    }

    if (!details.postalCode) {
      try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
        const nomResponse = await fetch(nominatimUrl);
        if (nomResponse.ok) {
           const nomData = await nomResponse.json();
           if (nomData && nomData.address && nomData.address.postcode) {
               details.postalCode = nomData.address.postcode;
           }
           if (!details.city && (nomData.address.city || nomData.address.town || nomData.address.village)) {
               details.city = nomData.address.city || nomData.address.town || nomData.address.village;
           }
        }
      } catch (e) {
         console.warn("Nominatim fallback failed", e);
      }
    }
    
    if (!details.postalCode && details.city && details.district) {
      try {
        console.log('Trying postal code lookup by address:', details.city, details.district);
        const postalCode = await LocationService.getPostalCodeByAddress(details.city, details.district);
        if (postalCode) {
          details.postalCode = postalCode;
          console.log('Found postal code from address lookup:', postalCode);
        }
      } catch (e) {
        console.warn("Postal code address lookup failed", e);
      }
    }

    return details;
  },

  getPostalCodeByAddress: async (city: string, district?: string): Promise<string> => {
    try {
      if (!city) return '';
      
      const query = district ? `${city}, ${district}, Sri Lanka` : `${city}, Sri Lanka`;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0 && data[0].address && data[0].address.postcode) {
          return data[0].address.postcode;
        }
      }
      return '';
    } catch (error) {
       console.error("Error searching postal code:", error);
       return '';
    }
  },

  geocodeAddress: async (street: string, city: string, district?: string, province?: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!googleApiKey) {
        console.error('Google Maps API key not found');
        return null;
      }

      const addressParts = [street, city, district, province, 'Sri Lanka'].filter(Boolean);
      const address = addressParts.join(', ');
      
      if (!address || address === 'Sri Lanka') {
        return null;
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }
};

export default LocationService;
