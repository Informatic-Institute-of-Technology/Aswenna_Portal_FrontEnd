export type { DSBoundary, GNDivision } from "../utils/geoUtils";

export const PROVINCE_DISTRICT_MAP: Record<string, string[]> = {
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Eastern: ["Ampara", "Batticaloa", "Trincomalee"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "North Western": ["Kurunegala", "Puttalam"],
  Sabaragamuwa: ["Kegalle", "Ratnapura"],
  Southern: ["Galle", "Hambantota", "Matara"],
  Uva: ["Badulla", "Moneragala"],
  Western: ["Colombo", "Gampaha", "Kalutara"],
};

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

// ---------------------------------------------------------------------------
// HTTP helper — defined first so all ADM loaders below can reference it
// ---------------------------------------------------------------------------
const REQUEST_TIMEOUT = 10000;

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT,
): Promise<Response> => {
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

// ---------------------------------------------------------------------------
// ADM data — pre-built JSON served from /public/data/ (same origin, no CORS)
//   ds-divisions.json  →  { [districtName]: string[] }
//   gn-divisions.json  →  { [dsDivisionName]: { name: string; number: string }[] }
// ---------------------------------------------------------------------------
let _dsMap: Record<string, string[]> | null = null;
let _gnMap: Record<string, { name: string; number: string }[]> | null = null;

const loadDsMap = async (): Promise<Record<string, string[]>> => {
  if (_dsMap) return _dsMap;
  const res = await fetchWithTimeout("/data/ds-divisions.json");
  if (!res.ok) throw new Error(`Failed to load DS divisions: ${res.status}`);
  _dsMap = (await res.json()) as Record<string, string[]>;
  return _dsMap;
};

const loadGnMap = async (): Promise<
  Record<string, { name: string; number: string }[]>
> => {
  if (_gnMap) return _gnMap;
  const res = await fetchWithTimeout("/data/gn-divisions.json", {}, 20000);
  if (!res.ok) throw new Error(`Failed to load GN divisions: ${res.status}`);
  _gnMap = (await res.json()) as Record<
    string,
    { name: string; number: string }[]
  >;
  return _gnMap;
};

// ---------------------------------------------------------------------------
// General helpers
// ---------------------------------------------------------------------------
const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
};

const isValidCity = (cityName: string | undefined): boolean => {
  if (!cityName) return false;
  const invalid = ["Sri Lanka", "SRI LANKA", "Sri lanka", "sri lanka"];
  return !invalid.includes(cityName);
};

export const LocationService = {
  getProvinceDistrictMap: (): Record<string, string[]> => PROVINCE_DISTRICT_MAP,

  getGoogleMapsApiKey: (): string => {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  },

  getDefaultMapCenter: () => {
    return { lat: 7.239511, lng: 80.358374 };
  },

  reverseGeocode: async (lat: number, lng: number): Promise<string> => {
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!googleApiKey) {
      console.error("Google Maps API key not found");
      return "";
    }

    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`;
      const response = await fetch(googleUrl);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "";
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return "";
    }
  },

  getDSDivisionsByDistrict: async (districtName: string): Promise<string[]> => {
    if (!districtName || districtName.trim() === "") {
      console.warn("getDSDivisionsByDistrict: Empty district name provided");
      return [];
    }
    try {
      const dsMap = await loadDsMap();
      // Try exact match first, then case-insensitive
      let list = dsMap[districtName];
      if (!list) {
        const lc = districtName.toLowerCase();
        const key = Object.keys(dsMap).find((k) => k.toLowerCase() === lc);
        list = key ? dsMap[key] : [];
      }
      if (!list || list.length === 0) {
        console.warn(
          `ADM: No DS divisions found for district: "${districtName}"`,
        );
        return [];
      }
      console.log(`ADM: ${list.length} DS divisions for "${districtName}"`);
      return list;
    } catch (error) {
      console.error("Error in getDSDivisionsByDistrict:", error);
      return [];
    }
  },

  getGNDivisionsByDSDivision: async (
    dsDivisionName: string,
  ): Promise<{ name: string; number: string }[]> => {
    if (!dsDivisionName || dsDivisionName.trim() === "") {
      console.warn(
        "getGNDivisionsByDSDivision: Empty DS division name provided",
      );
      return [];
    }
    try {
      const gnMap = await loadGnMap();
      // Try exact match first, then case-insensitive
      let list = gnMap[dsDivisionName];
      if (!list) {
        const lc = dsDivisionName.toLowerCase();
        const key = Object.keys(gnMap).find((k) => k.toLowerCase() === lc);
        list = key ? gnMap[key] : [];
      }
      if (!list || list.length === 0) {
        console.warn(
          `ADM: No GN divisions found for DS division: "${dsDivisionName}"`,
        );
        return [];
      }
      console.log(`ADM: ${list.length} GN divisions for "${dsDivisionName}"`);
      return list;
    } catch (error) {
      console.error("Error in getGNDivisionsByDSDivision:", error);
      return [];
    }
  },

  getLocationDetails: async (
    lat: number,
    lon: number,
  ): Promise<LocationDetails> => {
    const details: LocationDetails = {};

    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      console.error("Invalid coordinates provided:", { lat, lon });
      return details;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      console.error("Coordinates out of valid range:", { lat, lon });
      return details;
    }

    console.log(`Fetching location details for coordinates: ${lat}, ${lon}`);

    // NSDI spatial API is unavailable; province/district populated from Google Maps below.
    // DS and GN division require manual selection from local JSON data.

    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (googleApiKey) {
      try {
        const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`;
        const googleResponse = await fetchWithTimeout(googleUrl);

        if (!googleResponse.ok) {
          throw new Error(
            `Google Maps API error: ${googleResponse.status} ${googleResponse.statusText}`,
          );
        }

        const googleData = await googleResponse.json();

        if (
          googleData.status === "OK" &&
          googleData.results &&
          googleData.results.length > 0
        ) {
          const primaryComponents = googleData.results[0].address_components;

          const getComponent = (components: AddressComponent[], type: string) =>
            components.find((c: AddressComponent) => c.types.includes(type))
              ?.long_name;

          const locality = getComponent(primaryComponents, "locality");
          const sublocality = getComponent(primaryComponents, "sublocality");
          const sublocalityLevel1 = getComponent(
            primaryComponents,
            "sublocality_level_1",
          );
          const sublocalityLevel2 = getComponent(
            primaryComponents,
            "sublocality_level_2",
          );
          const administrativeAreaLevel2 = getComponent(
            primaryComponents,
            "administrative_area_level_2",
          );
          const administrativeAreaLevel3 = getComponent(
            primaryComponents,
            "administrative_area_level_3",
          );
          const neighborhood = getComponent(primaryComponents, "neighborhood");
          const route = getComponent(primaryComponents, "route");
          const streetNumber = getComponent(primaryComponents, "street_number");

          let postalCode = "";
          console.log("Searching for postal code in Google Maps results...");
          for (let i = 0; i < googleData.results.length; i++) {
            const result = googleData.results[i];
            const pc = getComponent(result.address_components, "postal_code");
            if (pc) {
              postalCode = pc;
              console.log(`Found postal code in result ${i}: ${postalCode}`);
              break;
            }
          }

          if (!postalCode) {
            console.warn("No postal code found in any Google Maps result");
            console.log("Total results searched:", googleData.results.length);
          }

          const candidates = [
            locality,
            sublocality,
            sublocalityLevel1,
            sublocalityLevel2,
            neighborhood,
            administrativeAreaLevel3,
            administrativeAreaLevel2,
          ];

          details.city = candidates.find((c) => isValidCity(c)) || "";

          if (!details.city && googleData.results[0].formatted_address) {
            const addressParts =
              googleData.results[0].formatted_address.split(",");
            for (const part of addressParts) {
              const trimmed = part.trim();
              if (
                trimmed &&
                isValidCity(trimmed) &&
                !trimmed.match(/^\d/) &&
                trimmed !== route
              ) {
                details.city = trimmed;
                break;
              }
            }
          }

          details.postalCode = postalCode;

          if (route) {
            details.address = streetNumber
              ? `${streetNumber}, ${route}`
              : route;
          }

          console.log("Google Maps address data retrieved:", {
            city: details.city,
            postalCode: details.postalCode,
            address: details.address,
          });

          if (!details.postalCode) {
            console.log("Attempting fallback postal code lookup...");

            if (details.city && details.district) {
              const fallbackPostalCode =
                await LocationService.getPostalCodeByAddress(
                  details.city,
                  details.district,
                );
              if (fallbackPostalCode) {
                details.postalCode = fallbackPostalCode;
                console.log(
                  `Found postal code via fallback (city+district): ${fallbackPostalCode}`,
                );
              }
            }

            if (!details.postalCode && details.city) {
              const fallbackPostalCode =
                await LocationService.getPostalCodeByAddress(details.city);
              if (fallbackPostalCode) {
                details.postalCode = fallbackPostalCode;
                console.log(
                  `Found postal code via fallback (city only): ${fallbackPostalCode}`,
                );
              }
            }

            if (!details.postalCode && details.dsDivision && details.district) {
              const fallbackPostalCode =
                await LocationService.getPostalCodeByAddress(
                  details.dsDivision,
                  details.district,
                );
              if (fallbackPostalCode) {
                details.postalCode = fallbackPostalCode;
                console.log(
                  `Found postal code via fallback (DS division): ${fallbackPostalCode}`,
                );
              }
            }

            if (!details.postalCode && details.city && details.district) {
              try {
                const specificAddress = `${details.city}, ${details.district}, Sri Lanka`;
                const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(specificAddress)}&key=${googleApiKey}`;
                const geocodeResponse = await fetchWithTimeout(geocodeUrl);

                if (geocodeResponse.ok) {
                  const geocodeData = await geocodeResponse.json();
                  if (
                    geocodeData.status === "OK" &&
                    geocodeData.results &&
                    geocodeData.results.length > 0
                  ) {
                    for (const result of geocodeData.results) {
                      const pc = getComponent(
                        result.address_components,
                        "postal_code",
                      );
                      if (pc) {
                        details.postalCode = pc;
                        console.log(
                          `Found postal code via Google geocoding fallback: ${pc}`,
                        );
                        break;
                      }
                    }
                  }
                }
              } catch (error) {
                console.error(
                  "Error in Google Maps geocoding fallback:",
                  error,
                );
              }
            }

            if (!details.postalCode) {
              console.warn("Unable to determine postal code from any source");
            }
          }

          if (!details.province || !details.district) {
            const provinceFromGoogle = getComponent(
              primaryComponents,
              "administrative_area_level_1",
            );
            const districtFromGoogle = getComponent(
              primaryComponents,
              "administrative_area_level_2",
            );

            if (
              !details.province &&
              provinceFromGoogle &&
              isValidCity(provinceFromGoogle)
            ) {
              details.province = toTitleCase(
                provinceFromGoogle.replace(/\s*Province$/i, "").trim(),
              );
              console.log(
                `Using province from Google Maps: ${details.province}`,
              );
            }

            if (
              !details.district &&
              districtFromGoogle &&
              isValidCity(districtFromGoogle)
            ) {
              details.district = toTitleCase(
                districtFromGoogle.replace(/\s*District$/i, "").trim(),
              );
              console.log(
                `Using district from Google Maps: ${details.district}`,
              );
            }

            // In Sri Lanka, administrative_area_level_3 = DS (Divisional Secretariat) Division
            if (
              !details.dsDivision &&
              administrativeAreaLevel3 &&
              isValidCity(administrativeAreaLevel3)
            ) {
              details.dsDivision = toTitleCase(administrativeAreaLevel3.trim());
              console.log(`Google Maps → DS Division: ${details.dsDivision}`);
            }
          }
        } else {
          console.warn(
            "Google Maps geocoding returned no results or error:",
            googleData.status,
          );
        }
      } catch (error) {
        console.error("Error fetching Google Maps data:", error);
      }
    } else {
      console.warn("Google Maps API key not configured");
    }

    if (
      details.city &&
      details.city.toLowerCase() === "colombo" &&
      details.postalCode
    ) {
      const postalCode = details.postalCode;
      if (postalCode.length === 5 && postalCode.startsWith("00")) {
        const remainingDigits = postalCode.substring(2);
        const districtNum = Math.floor(parseInt(remainingDigits, 10) / 100);
        if (districtNum > 0 && districtNum <= 15) {
          details.city = `Colombo ${districtNum.toString().padStart(2, "0")}`;
          console.log(`Updated Colombo district number: ${details.city}`);
        }
      }
    }

    // Auto-detect DS division (and province/district fallback) via Nominatim reverse geocode.
    // In Sri Lanka's OSM data: state = Province, state_district = District, county = DS Division.
    if (!details.dsDivision || !details.province || !details.district) {
      try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=14`;
        const nomRes = await fetchWithTimeout(
          nominatimUrl,
          { headers: { "User-Agent": "Aswenna-Portal" } },
          8000,
        );
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          const addr = nomData?.address ?? {};
          if (!details.province && addr.state) {
            details.province = toTitleCase(
              String(addr.state)
                .replace(/\s*Province$/i, "")
                .trim(),
            );
            console.log(`Nominatim → Province: ${details.province}`);
          }
          if (!details.district && addr.state_district) {
            details.district = toTitleCase(
              String(addr.state_district)
                .replace(/\s*District$/i, "")
                .trim(),
            );
            console.log(`Nominatim → District: ${details.district}`);
          }
          // Try multiple OSM fields — Sri Lanka usage varies by area
          const nomDs =
            addr.county ||
            addr.municipality ||
            addr.administrative ||
            addr.quarter;
          if (!details.dsDivision && nomDs) {
            details.dsDivision = toTitleCase(
              String(nomDs)
                .replace(/\s*Divisional Secretariat.*$/i, "")
                .trim(),
            );
            console.log(`Nominatim → DS Division: ${details.dsDivision}`);
          }
        } else {
          console.warn(`Nominatim reverse geocode failed: ${nomRes.status}`);
        }
      } catch (e) {
        console.warn("Nominatim reverse geocode error:", e);
      }
    }

    if (!isValidCity(details.city)) {
      if (details.dsDivision) {
        details.city = details.dsDivision;
        console.log(`Using DS division as city fallback: ${details.city}`);
      }
    }

    const finalDetails: LocationDetails = {};
    if (details.province && details.province.trim() !== "")
      finalDetails.province = details.province.trim();
    if (details.district && details.district.trim() !== "")
      finalDetails.district = details.district.trim();
    if (details.dsDivision && details.dsDivision.trim() !== "")
      finalDetails.dsDivision = details.dsDivision.trim();
    if (details.gnDivision && details.gnDivision.trim() !== "")
      finalDetails.gnDivision = details.gnDivision.trim();
    if (details.gnNumber && details.gnNumber.trim() !== "")
      finalDetails.gnNumber = details.gnNumber.trim();
    if (details.city && details.city.trim() !== "")
      finalDetails.city = details.city.trim();
    if (details.address && details.address.trim() !== "")
      finalDetails.address = details.address.trim();
    if (details.postalCode && details.postalCode.trim() !== "")
      finalDetails.postalCode = details.postalCode.trim();

    console.log("Final location details:", finalDetails);
    return finalDetails;
  },

  getPostalCodeByAddress: async (
    city: string,
    district?: string,
  ): Promise<string> => {
    try {
      if (!city || city.trim() === "") {
        console.warn("getPostalCodeByAddress: Empty city name provided");
        return "";
      }

      const queries = [];
      if (district) {
        queries.push(`${city}, ${district}, Sri Lanka`);
        queries.push(`${district}, ${city}, Sri Lanka`);
      }
      queries.push(`${city}, Sri Lanka`);

      console.log("Trying Nominatim postal code lookup with queries:", queries);

      for (const query of queries) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=3`;

          const response = await fetchWithTimeout(
            url,
            {
              headers: {
                "User-Agent": "Aswenna-Portal-App",
              },
            },
            5000,
          );

          if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data)) {
              for (const result of data) {
                if (result.address && result.address.postcode) {
                  console.log(
                    `Postal code found via Nominatim: ${result.address.postcode} for query: ${query}`,
                  );
                  return result.address.postcode;
                }
              }
            }
          }
        } catch (queryError) {
          console.warn(`Nominatim query failed for: ${query}`, queryError);
        }
      }

      console.warn("No postal code found in Nominatim for any query");
      return "";
    } catch (error) {
      console.error("Error in getPostalCodeByAddress:", error);
      return "";
    }
  },

  geocodeAddress: async (
    street: string,
    city: string,
    district?: string,
    province?: string,
  ): Promise<{ lat: number; lng: number } | null> => {
    try {
      const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!googleApiKey) {
        console.error("Google Maps API key not found for geocoding");
        return null;
      }

      const addressParts = [
        street,
        city,
        district,
        province,
        "Sri Lanka",
      ].filter((part) => part && part.trim() !== "");
      const address = addressParts.join(", ");

      if (!address || address === "Sri Lanka") {
        console.warn("Insufficient address information for geocoding");
        return null;
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`;
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(
          `Geocoding failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        console.log(`Geocoded address to: ${location.lat}, ${location.lng}`);
        return {
          lat: location.lat,
          lng: location.lng,
        };
      }

      console.warn(
        `Geocoding returned no results for: ${address}`,
        data.status,
      );
      return null;
    } catch (error) {
      console.error("Error in geocodeAddress:", error);
      return null;
    }
  },
};

export default LocationService;
