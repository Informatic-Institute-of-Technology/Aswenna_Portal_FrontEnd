interface DSDivisionAttributes {
  ds_division_name: string;
  district_name?: string;
  province_name?: string;
}

interface DSDivisionFeature {
  attributes: DSDivisionAttributes;
}

interface DSDivisionResponse {
  features: DSDivisionFeature[];
  error?: {
    code: number;
    message: string;
  };
}

interface GNDivisionAttributes {
  gnd_name: string;
  gnd_number: string;
  ds_division_name?: string;
  district_name?: string;
  province_name?: string;
}

interface GNDivisionFeature {
  attributes: GNDivisionAttributes;
}

interface GNDivisionResponse {
  features: GNDivisionFeature[];
  error?: {
    code: number;
    message: string;
  };
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

const NSDI_BASE_URL = 'https://gis.survey.gov.lk/nsdiwebservices';
const NSDI_DS_URL = `${NSDI_BASE_URL}/server/rest/services/Srilanka/Archeology/MapServer/25/query`;
const NSDI_GN_URL = `${NSDI_BASE_URL}/server/rest/services/Srilanka/Boundaries/MapServer/1/query`;

const NSDI_FALLBACK_BASE = '/nsdi-api';
const NSDI_DS_URL_FALLBACK = `${NSDI_FALLBACK_BASE}/server/rest/services/Srilanka/Archeology/MapServer/25/query`;
const NSDI_GN_URL_FALLBACK = `${NSDI_FALLBACK_BASE}/server/rest/services/Srilanka/Boundaries/MapServer/1/query`;

const REQUEST_TIMEOUT = 10000;

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = REQUEST_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const normalizeDivisionName = (name: string): string => {
  if (!name) return '';
  return name
    .trim()
    .replace(/\s+/g, ' ') 
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .toLowerCase();
};

const findMatchingDivision = (targetName: string, availableOptions: string[]): string | null => {
  if (!targetName || !availableOptions || availableOptions.length === 0) return null;
  
  const normalizedTarget = normalizeDivisionName(targetName);
  
  for (const option of availableOptions) {
    if (normalizeDivisionName(option) === normalizedTarget) {
      return option;
    }
  }
  
  for (const option of availableOptions) {
    const normalizedOption = normalizeDivisionName(option);
    if (normalizedTarget.includes(normalizedOption) || normalizedOption.includes(normalizedTarget)) {
      console.log(`Found partial match: ${targetName} -> ${option}`);
      return option;
    }
  }
  
  const targetWords = normalizedTarget.split(' ');
  for (const option of availableOptions) {
    const optionWords = normalizeDivisionName(option).split(' ');
    for (const targetWord of targetWords) {
      if (targetWord.length > 3 && optionWords.some(ow => ow.includes(targetWord) || targetWord.includes(ow))) {
        console.log(`Found word-based match: ${targetName} -> ${option}`);
        return option;
      }
    }
  }
  
  console.warn(`No matching division found for: ${targetName} in options:`, availableOptions);
  return null;
};

const isValidCity = (cityName: string | undefined): boolean => {
  if (!cityName) return false;
  const invalid = ['Sri Lanka', 'SRI LANKA', 'Sri lanka', 'sri lanka'];
  return !invalid.includes(cityName);
};

const fetchNSDIData = async <T extends DSDivisionResponse | GNDivisionResponse>(
  primaryUrl: string, 
  fallbackUrl: string, 
  params: URLSearchParams
): Promise<T> => {
  const urls = [primaryUrl, fallbackUrl];
  
  for (const baseUrl of urls) {
    try {
      const url = `${baseUrl}?${params.toString()}`;
      console.log(`Attempting NSDI fetch from: ${baseUrl}`);
      
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn(`NSDI request failed with status ${response.status} for ${baseUrl}`);
        continue;
      }

      const data = await response.json();
      
      if (data.error) {
        console.warn(`NSDI API returned error: ${data.error.message} (code: ${data.error.code})`);
        continue;
      }

      if (data.features && Array.isArray(data.features)) {
        console.log(`Successfully fetched ${data.features.length} features from NSDI`);
        return data as T;
      }

      console.warn('NSDI response missing features array');
    } catch (error) {
      console.error(`Error fetching from ${baseUrl}:`, error);
    }
  }
  console.error('All NSDI fetch attempts failed');
  return { features: [] } as unknown as T;
};

export const LocationService = {
  getGoogleMapsApiKey: (): string => {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  },

  getDefaultMapCenter: () => {
    return { lat: 7.239511, lng: 80.358374 };
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
    if (!districtName || districtName.trim() === '') {
      console.warn('getDSDivisionsByDistrict: Empty district name provided');
      return [];
    }

    try {
      const params = new URLSearchParams({
        where: `district_name = '${districtName}'`,
        outFields: 'ds_division_name',
        f: 'json',
        returnGeometry: 'false'
      });

      const data: DSDivisionResponse = await fetchNSDIData(
        NSDI_DS_URL,
        NSDI_DS_URL_FALLBACK,
        params
      );
      
      if (data.features && Array.isArray(data.features) && data.features.length > 0) {
        const divisions = data.features
          .map(feature => feature.attributes.ds_division_name)
          .filter(name => name && name.trim() !== '')
          .sort();
        
        console.log(`Found ${divisions.length} DS divisions for district: ${districtName}`);
        return divisions;
      }
      
      console.warn(`No DS divisions found for district: ${districtName}`);
      return [];
    } catch (error) {
      console.error('Error in getDSDivisionsByDistrict:', error);
      return [];
    }
  },

  getGNDivisionsByDSDivision: async (dsDivisionName: string): Promise<{name: string, number: string}[]> => {
    if (!dsDivisionName || dsDivisionName.trim() === '') {
      console.warn('getGNDivisionsByDSDivision: Empty DS division name provided');
      return [];
    }

    try {
      const upperCaseDSName = dsDivisionName.toUpperCase();
      const titleCaseDSName = toTitleCase(dsDivisionName);
      
      let params = new URLSearchParams({
        where: `UPPER(ds_division_name) = '${upperCaseDSName}'`,
        outFields: 'gnd_name,gnd_number,ds_division_name',
        f: 'json',
        returnGeometry: 'false'
      });

      let data: GNDivisionResponse = await fetchNSDIData(
        NSDI_GN_URL,
        NSDI_GN_URL_FALLBACK,
        params
      );

      if (!data.features || data.features.length === 0) {
        console.log('Trying title case match for DS division');
        params = new URLSearchParams({
          where: `ds_division_name = '${titleCaseDSName}'`,
          outFields: 'gnd_name,gnd_number,ds_division_name',
          f: 'json',
          returnGeometry: 'false'
        });

        data = await fetchNSDIData(
          NSDI_GN_URL,
          NSDI_GN_URL_FALLBACK,
          params
        );
      }

      if (!data.features || data.features.length === 0) {
        console.log('Trying original case match for DS division');
        params = new URLSearchParams({
          where: `ds_division_name = '${dsDivisionName}'`,
          outFields: 'gnd_name,gnd_number,ds_division_name',
          f: 'json',
          returnGeometry: 'false'
        });

        data = await fetchNSDIData(
          NSDI_GN_URL,
          NSDI_GN_URL_FALLBACK,
          params
        );
      }
      
      if (data.features && Array.isArray(data.features) && data.features.length > 0) {
        const gnDivisions = data.features
          .filter(feature => 
            feature.attributes.gnd_name && 
            feature.attributes.gnd_name.trim() !== '' &&
            feature.attributes.gnd_number &&
            feature.attributes.gnd_number.trim() !== ''
          )
          .map(feature => ({
            name: feature.attributes.gnd_name.trim(),
            number: feature.attributes.gnd_number.trim()
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        console.log(`Found ${gnDivisions.length} GN divisions for DS division: ${dsDivisionName}`);
        return gnDivisions;
      }
      
      console.warn(`No GN divisions found for DS division: ${dsDivisionName}`);
      return [];
    } catch (error) {
      console.error('Error in getGNDivisionsByDSDivision:', error);
      return [];
    }
  },

  getLocationDetails: async (lat: number, lon: number): Promise<LocationDetails> => {
    const details: LocationDetails = {};

    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      console.error('Invalid coordinates provided:', { lat, lon });
      return details;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      console.error('Coordinates out of valid range:', { lat, lon });
      return details;
    }

    console.log(`Fetching location details for coordinates: ${lat}, ${lon}`);

    try {
      const params = new URLSearchParams({
        geometry: `${lon},${lat}`,
        geometryType: 'esriGeometryPoint',
        inSR: '4326',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'province_name,district_name,ds_division_name,gnd_name,gnd_number,gnd_name_gazetted',
        f: 'json',
        returnGeometry: 'false'
      });

      const data: GNDivisionResponse = await fetchNSDIData(
        NSDI_GN_URL,
        NSDI_GN_URL_FALLBACK,
        params
      );

      if (data.features && data.features.length > 0) {
        const attrs = data.features[0].attributes;
        
        console.log('NSDI Raw Attributes (ALL FIELDS):', JSON.stringify(attrs, null, 2));
        
        details.province = toTitleCase(attrs.province_name || '');
        details.district = toTitleCase(attrs.district_name || '');
        
        const attrsRecord = attrs as unknown as Record<string, string | undefined>;
        const rawDsDivision = toTitleCase(
          attrs.ds_division_name || 
          attrsRecord.dsd_name || 
          attrsRecord.divisional_secretariat || 
          attrsRecord.ds_name ||
          attrsRecord.divi_name ||
          ''
        );
        
        details.gnDivision = attrs.gnd_name || attrsRecord.gn_name || '';
        details.gnNumber = attrs.gnd_number || attrsRecord.gnd_no || attrsRecord.gn_number || '';

        console.log('NSDI administrative data retrieved (raw):', {
          province: details.province,
          district: details.district,
          dsDivision: rawDsDivision,
          gnDivision: details.gnDivision,
          gnNumber: details.gnNumber,
          allFieldNames: Object.keys(attrs)
        });
        if (details.district) {
          const availableDsDivisions = await LocationService.getDSDivisionsByDistrict(details.district);
          console.log('Available DS divisions for district:', availableDsDivisions);
          
          if (!rawDsDivision && availableDsDivisions.length > 0) {
            try {
              console.log('DS division not found in GN response, querying DS endpoint directly...');
              const dsParams = new URLSearchParams({
                geometry: `${lon},${lat}`,
                geometryType: 'esriGeometryPoint',
                inSR: '4326',
                spatialRel: 'esriSpatialRelIntersects',
                outFields: 'ds_division_name,district_name',
                f: 'json',
                returnGeometry: 'false'
              });

              const dsData: DSDivisionResponse = await fetchNSDIData<DSDivisionResponse>(
                NSDI_DS_URL,
                NSDI_DS_URL_FALLBACK,
                dsParams
              );

              if (dsData.features && dsData.features.length > 0) {
                const dsDivFromDsEndpoint = toTitleCase(dsData.features[0].attributes.ds_division_name || '');
                console.log('DS division from DS endpoint:', dsDivFromDsEndpoint);
                
                const matchedDs = findMatchingDivision(dsDivFromDsEndpoint, availableDsDivisions);
                if (matchedDs) {
                  details.dsDivision = matchedDs;
                  console.log(`Matched DS division from DS endpoint: ${dsDivFromDsEndpoint} -> ${matchedDs}`);
                }
              }
            } catch (error) {
              console.error('Error querying DS endpoint directly:', error);
            }
          }
          
          if (availableDsDivisions.length > 0) {
            if (!details.dsDivision) {
              if (rawDsDivision) {
                const matchedDsDivision = findMatchingDivision(rawDsDivision, availableDsDivisions);
                if (matchedDsDivision) {
                  details.dsDivision = matchedDsDivision;
                  console.log(`Matched DS division: ${rawDsDivision} -> ${matchedDsDivision}`);
                } else {
                  console.warn(`DS division "${rawDsDivision}" not found in available options, leaving empty for manual selection`);
                }
              } else {
                details.dsDivision = availableDsDivisions[0];
                console.log(`No DS division from any source, using first available: ${details.dsDivision}`);
              }
            } else {
              console.log(`DS division already set from direct query: ${details.dsDivision}`);
            }
          }
        }

        if (details.dsDivision) {
          const availableGnDivisions = await LocationService.getGNDivisionsByDSDivision(details.dsDivision);
          console.log(`Available GN divisions for ${details.dsDivision}:`, availableGnDivisions.length);
          
          if (availableGnDivisions.length > 0) {
            if (details.gnDivision) {
              const gnNames = availableGnDivisions.map(gn => gn.name);
              const matchedGnDivision = findMatchingDivision(details.gnDivision, gnNames);
              
              if (matchedGnDivision) {
                const matchedGn = availableGnDivisions.find(gn => gn.name === matchedGnDivision);
                if (matchedGn) {
                  details.gnDivision = matchedGn.name;
                  details.gnNumber = matchedGn.number;
                  console.log(`Matched GN division: ${matchedGnDivision} (${matchedGn.number})`);
                }
              } else {
                console.warn(`GN division "${details.gnDivision}" not found in available options`);
                details.gnDivision = '';
                details.gnNumber = '';
              }
            } else {
              console.log('No GN division from NSDI, leaving empty for manual selection');
            }
          }
        }
      } else {
        console.warn('No NSDI features found for coordinates:', { lat, lon });
      }
    } catch (error) {
      console.error('Error fetching NSDI administrative boundaries:', error);
    }
    
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (googleApiKey) {
      try {
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`;
        const googleResponse = await fetchWithTimeout(googleUrl);

        if (!googleResponse.ok) {
          throw new Error(`Google Maps API error: ${googleResponse.status} ${googleResponse.statusText}`);
        }

        const googleData = await googleResponse.json();

        if (googleData.status === 'OK' && googleData.results && googleData.results.length > 0) {
          const primaryComponents = googleData.results[0].address_components;
          
          const getComponent = (components: AddressComponent[], type: string) => 
            components.find((c: AddressComponent) => c.types.includes(type))?.long_name;
          
          const locality = getComponent(primaryComponents, 'locality');
          const sublocality = getComponent(primaryComponents, 'sublocality');
          const sublocalityLevel1 = getComponent(primaryComponents, 'sublocality_level_1');
          const sublocalityLevel2 = getComponent(primaryComponents, 'sublocality_level_2');
          const administrativeAreaLevel2 = getComponent(primaryComponents, 'administrative_area_level_2');
          const administrativeAreaLevel3 = getComponent(primaryComponents, 'administrative_area_level_3');
          const neighborhood = getComponent(primaryComponents, 'neighborhood');
          const route = getComponent(primaryComponents, 'route');
          const streetNumber = getComponent(primaryComponents, 'street_number');
          
          let postalCode = '';
          console.log('Searching for postal code in Google Maps results...');
          for (let i = 0; i < googleData.results.length; i++) {
            const result = googleData.results[i];
            const pc = getComponent(result.address_components, 'postal_code');
            if (pc) {
              postalCode = pc;
              console.log(`Found postal code in result ${i}: ${postalCode}`);
              break;
            }
          }
          
          if (!postalCode) {
            console.warn('No postal code found in any Google Maps result');
            console.log('Total results searched:', googleData.results.length);
          }
          
          const candidates = [
            locality,
            sublocality,
            sublocalityLevel1,
            sublocalityLevel2,
            neighborhood,
            administrativeAreaLevel3,
            administrativeAreaLevel2
          ];
          
          details.city = candidates.find(c => isValidCity(c)) || '';
          
          if (!details.city && googleData.results[0].formatted_address) {
            const addressParts = googleData.results[0].formatted_address.split(',');
            for (const part of addressParts) {
              const trimmed = part.trim();
              if (trimmed && 
                  isValidCity(trimmed) && 
                  !trimmed.match(/^\d/) && 
                  trimmed !== route) {
                details.city = trimmed;
                break;
              }
            }
          }
          
          details.postalCode = postalCode;
          
          if (route) {
            details.address = streetNumber ? `${streetNumber}, ${route}` : route;
          }

          console.log('Google Maps address data retrieved:', {
            city: details.city,
            postalCode: details.postalCode,
            address: details.address
          });

          if (!details.postalCode) {
            console.log('Attempting fallback postal code lookup...');
            
            if (details.city && details.district) {
              const fallbackPostalCode = await LocationService.getPostalCodeByAddress(details.city, details.district);
              if (fallbackPostalCode) {
                details.postalCode = fallbackPostalCode;
                console.log(`Found postal code via fallback (city+district): ${fallbackPostalCode}`);
              }
            }
            
            if (!details.postalCode && details.city) {
              const fallbackPostalCode = await LocationService.getPostalCodeByAddress(details.city);
              if (fallbackPostalCode) {
                details.postalCode = fallbackPostalCode;
                console.log(`Found postal code via fallback (city only): ${fallbackPostalCode}`);
              }
            }
            
            if (!details.postalCode && details.dsDivision && details.district) {
              const fallbackPostalCode = await LocationService.getPostalCodeByAddress(details.dsDivision, details.district);
              if (fallbackPostalCode) {
                details.postalCode = fallbackPostalCode;
                console.log(`Found postal code via fallback (DS division): ${fallbackPostalCode}`);
              }
            }
            
            if (!details.postalCode && details.city && details.district) {
              try {
                const specificAddress = `${details.city}, ${details.district}, Sri Lanka`;
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(specificAddress)}&key=${googleApiKey}`;
                const geocodeResponse = await fetchWithTimeout(geocodeUrl);
                
                if (geocodeResponse.ok) {
                  const geocodeData = await geocodeResponse.json();
                  if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
                    for (const result of geocodeData.results) {
                      const pc = getComponent(result.address_components, 'postal_code');
                      if (pc) {
                        details.postalCode = pc;
                        console.log(`Found postal code via Google geocoding fallback: ${pc}`);
                        break;
                      }
                    }
                  }
                }
              } catch (error) {
                console.error('Error in Google Maps geocoding fallback:', error);
              }
            }
            
            if (!details.postalCode) {
              console.warn('Unable to determine postal code from any source');
            }
          }

          if (!details.province || !details.district) {
            const provinceFromGoogle = getComponent(primaryComponents, 'administrative_area_level_1');
            const districtFromGoogle = getComponent(primaryComponents, 'administrative_area_level_2');
            
            if (!details.province && provinceFromGoogle && isValidCity(provinceFromGoogle)) {
              details.province = toTitleCase(provinceFromGoogle);
              console.log(`Using province from Google Maps: ${details.province}`);
            }
            
            if (!details.district && districtFromGoogle && isValidCity(districtFromGoogle)) {
              details.district = toTitleCase(districtFromGoogle);
              console.log(`Using district from Google Maps: ${details.district}`);
            }
          }
        } else {
          console.warn('Google Maps geocoding returned no results or error:', googleData.status);
        }
      } catch (error) {
        console.error('Error fetching Google Maps data:', error);
      }
    } else {
      console.warn('Google Maps API key not configured');
    }
    
    if (details.city && details.city.toLowerCase() === 'colombo' && details.postalCode) {
      const postalCode = details.postalCode;
      if (postalCode.length === 5 && postalCode.startsWith('00')) {
        const remainingDigits = postalCode.substring(2);
        const districtNum = Math.floor(parseInt(remainingDigits, 10) / 100);
        if (districtNum > 0 && districtNum <= 15) {
          details.city = `Colombo ${districtNum.toString().padStart(2, '0')}`;
          console.log(`Updated Colombo district number: ${details.city}`);
        }
      }
    }
    
    if (!isValidCity(details.city)) {
      if (details.dsDivision) {
        details.city = details.dsDivision;
        console.log(`Using DS division as city fallback: ${details.city}`);
      }
    }

    const finalDetails: LocationDetails = {};
    if (details.province && details.province.trim() !== '') finalDetails.province = details.province.trim();
    if (details.district && details.district.trim() !== '') finalDetails.district = details.district.trim();
    if (details.dsDivision && details.dsDivision.trim() !== '') finalDetails.dsDivision = details.dsDivision.trim();
    if (details.gnDivision && details.gnDivision.trim() !== '') finalDetails.gnDivision = details.gnDivision.trim();
    if (details.gnNumber && details.gnNumber.trim() !== '') finalDetails.gnNumber = details.gnNumber.trim();
    if (details.city && details.city.trim() !== '') finalDetails.city = details.city.trim();
    if (details.address && details.address.trim() !== '') finalDetails.address = details.address.trim();
    if (details.postalCode && details.postalCode.trim() !== '') finalDetails.postalCode = details.postalCode.trim();

    console.log('Final location details:', finalDetails);
    return finalDetails;
  },

  getPostalCodeByAddress: async (city: string, district?: string): Promise<string> => {
    try {
      if (!city || city.trim() === '') {
        console.warn('getPostalCodeByAddress: Empty city name provided');
        return '';
      }
      
      const queries = [];
      if (district) {
        queries.push(`${city}, ${district}, Sri Lanka`);
        queries.push(`${district}, ${city}, Sri Lanka`);
      }
      queries.push(`${city}, Sri Lanka`);
      
      console.log('Trying Nominatim postal code lookup with queries:', queries);
      
      for (const query of queries) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=3`;
          
          const response = await fetchWithTimeout(url, {
            headers: {
              'User-Agent': 'Aswenna-Portal-App'
            }
          }, 5000);

          if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data)) {
              for (const result of data) {
                if (result.address && result.address.postcode) {
                  console.log(`Postal code found via Nominatim: ${result.address.postcode} for query: ${query}`);
                  return result.address.postcode;
                }
              }
            }
          }
        } catch (queryError) {
          console.warn(`Nominatim query failed for: ${query}`, queryError);
        }
      }
      
      console.warn('No postal code found in Nominatim for any query');
      return '';
    } catch (error) {
      console.error('Error in getPostalCodeByAddress:', error);
      return '';
    }
  },

  geocodeAddress: async (street: string, city: string, district?: string, province?: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!googleApiKey) {
        console.error('Google Maps API key not found for geocoding');
        return null;
      }

      const addressParts = [street, city, district, province, 'Sri Lanka'].filter(part => part && part.trim() !== '');
      const address = addressParts.join(', ');
      
      if (!address || address === 'Sri Lanka') {
        console.warn('Insufficient address information for geocoding');
        return null;
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`;
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        console.log(`Geocoded address to: ${location.lat}, ${location.lng}`);
        return {
          lat: location.lat,
          lng: location.lng
        };
      }
      
      console.warn(`Geocoding returned no results for: ${address}`, data.status);
      return null;
    } catch (error) {
      console.error('Error in geocodeAddress:', error);
      return null;
    }
  }
};

export default LocationService;
