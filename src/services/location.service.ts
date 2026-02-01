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

const NSDI_DS_URL = '/nsdi-api/server/rest/services/Srilanka/Archeology/MapServer/25/query';
const NSDI_GN_URL = '/nsdi-api/server/rest/services/Srilanka/Boundaries/MapServer/1/query';

export const LocationService = {
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
  }
};
