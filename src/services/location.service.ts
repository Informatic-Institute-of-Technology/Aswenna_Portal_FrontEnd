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
    } catch {
      return "";
    }
  },

  getDSDivisionsByDistrict: async (districtName: string): Promise<string[]> => {
    if (!districtName || districtName.trim() === "") {
      return [];
    }
    try {
      const dsMap = await loadDsMap();

      let list = dsMap[districtName];
      if (!list) {
        const lc = districtName.toLowerCase();
        const key = Object.keys(dsMap).find((k) => k.toLowerCase() === lc);
        list = key ? dsMap[key] : [];
      }
      if (!list || list.length === 0) {
        return [];
      }

      return list;
    } catch {
      return [];
    }
  },

  getGNDivisionsByDSDivision: async (
    dsDivisionName: string,
  ): Promise<{ name: string; number: string }[]> => {
    if (!dsDivisionName || dsDivisionName.trim() === "") {
      return [];
    }
    try {
      const gnMap = await loadGnMap();

      let list = gnMap[dsDivisionName];
      if (!list) {
        const lc = dsDivisionName.toLowerCase();
        const key = Object.keys(gnMap).find((k) => k.toLowerCase() === lc);
        list = key ? gnMap[key] : [];
      }
      if (!list || list.length === 0) {
        return [];
      }

      return list;
    } catch {
      return [];
    }
  },

  getLocationDetails: async (
    lat: number,
    lon: number,
  ): Promise<LocationDetails> => {
    const details: LocationDetails = {};

    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      return details;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return details;
    }

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

          const allLevel3Candidates: string[] = [];
          const allLevel4Candidates: string[] = [];
          for (const result of googleData.results) {
            for (const comp of result.address_components as AddressComponent[]) {
              if (
                comp.types.includes("administrative_area_level_3") &&
                comp.long_name
              ) {
                const val = toTitleCase(comp.long_name.trim());
                if (!allLevel3Candidates.includes(val))
                  allLevel3Candidates.push(val);
              }
              if (
                comp.types.includes("administrative_area_level_4") &&
                comp.long_name
              ) {
                const val = toTitleCase(comp.long_name.trim());
                if (!allLevel4Candidates.includes(val))
                  allLevel4Candidates.push(val);
              }
            }
          }

          let postalCode = "";

          for (let i = 0; i < googleData.results.length; i++) {
            const result = googleData.results[i];
            const pc = getComponent(result.address_components, "postal_code");
            if (pc) {
              postalCode = pc;

              break;
            }
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

          if (!details.postalCode) {
            if (details.city && details.district) {
              const fallbackPostalCode =
                await LocationService.getPostalCodeByAddress(
                  details.city,
                  details.district,
                );
              if (fallbackPostalCode) {
                details.postalCode = fallbackPostalCode;
              }
            }

            if (!details.postalCode && details.city) {
              const fallbackPostalCode =
                await LocationService.getPostalCodeByAddress(details.city);
              if (fallbackPostalCode) {
                details.postalCode = fallbackPostalCode;
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

                        break;
                      }
                    }
                  }
                }
              } catch {
                void 0;
              }
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
            }

            if (
              !details.district &&
              districtFromGoogle &&
              isValidCity(districtFromGoogle)
            ) {
              details.district = toTitleCase(
                districtFromGoogle.replace(/\s*District$/i, "").trim(),
              );
            }

            if (
              !details.dsDivision &&
              administrativeAreaLevel3 &&
              isValidCity(administrativeAreaLevel3)
            ) {
              details.dsDivision = toTitleCase(administrativeAreaLevel3.trim());
            }
          }

          const district4Match =
            details.district ||
            toTitleCase(
              (
                getComponent(
                  primaryComponents,
                  "administrative_area_level_2",
                ) ?? ""
              )
                .replace(/\s*District$/i, "")
                .trim(),
            );

          if (district4Match) {
            try {
              const dsMap = await loadDsMap();
              const dsKey = Object.keys(dsMap).find(
                (k) => k.toLowerCase() === district4Match.toLowerCase(),
              );
              const dsListForDistrict = dsKey ? dsMap[dsKey] : [];

              if (dsListForDistrict.length > 0) {
                if (!details.dsDivision) {
                  const normalise = (s: string) =>
                    s.toLowerCase().replace(/[^a-z0-9]/g, "");
                  for (const candidate of allLevel3Candidates) {
                    const match = dsListForDistrict.find(
                      (ds) => normalise(ds) === normalise(candidate),
                    );
                    if (match) {
                      details.dsDivision = match;

                      break;
                    }
                  }
                }

                if (!details.dsDivision) {
                  const normalise = (s: string) =>
                    s.toLowerCase().replace(/[^a-z0-9]/g, "");
                  for (const candidate of allLevel3Candidates) {
                    const match = dsListForDistrict.find(
                      (ds) =>
                        normalise(ds).includes(normalise(candidate)) ||
                        normalise(candidate).includes(normalise(ds)),
                    );
                    if (match) {
                      details.dsDivision = match;

                      break;
                    }
                  }
                }

                if (details.dsDivision && !details.gnDivision) {
                  try {
                    const gnMap = await loadGnMap();
                    const gnKey = Object.keys(gnMap).find(
                      (k) =>
                        k.toLowerCase() === details.dsDivision!.toLowerCase(),
                    );
                    const gnList = gnKey ? gnMap[gnKey] : [];

                    if (gnList.length > 0) {
                      const normalise = (s: string) =>
                        s.toLowerCase().replace(/[^a-z0-9]/g, "");

                      for (const candidate of allLevel4Candidates) {
                        const match = gnList.find(
                          (gn) => normalise(gn.name) === normalise(candidate),
                        );
                        if (match) {
                          details.gnDivision = match.name;
                          details.gnNumber = match.number;

                          break;
                        }
                      }

                      if (!details.gnDivision) {
                        for (const candidate of allLevel4Candidates) {
                          const match = gnList.find(
                            (gn) =>
                              normalise(gn.name).includes(
                                normalise(candidate),
                              ) ||
                              normalise(candidate).includes(normalise(gn.name)),
                          );
                          if (match) {
                            details.gnDivision = match.name;
                            details.gnNumber = match.number;

                            break;
                          }
                        }
                      }
                    }
                  } catch {
                    void 0;
                  }
                }
              }
            } catch {
              void 0;
            }
          }
        }
      } catch {
        void 0;
      }
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
        }
      }
    }

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
          }
          if (!details.district && addr.state_district) {
            details.district = toTitleCase(
              String(addr.state_district)
                .replace(/\s*District$/i, "")
                .trim(),
            );
          }

          const nomDs =
            addr.county ||
            addr.municipality ||
            addr.administrative ||
            addr.quarter;
          if (!details.dsDivision && nomDs) {
            const rawDs = toTitleCase(
              String(nomDs)
                .replace(/\s*Divisional Secretariat.*$/i, "")
                .trim(),
            );

            const districtKey = details.district || "";
            if (districtKey) {
              try {
                const dsMap = await loadDsMap();
                const dsKey = Object.keys(dsMap).find(
                  (k) => k.toLowerCase() === districtKey.toLowerCase(),
                );
                const dsList = dsKey ? dsMap[dsKey] : [];
                const normalise = (s: string) =>
                  s.toLowerCase().replace(/[^a-z0-9]/g, "");
                const matched = dsList.find(
                  (ds) =>
                    normalise(ds) === normalise(rawDs) ||
                    normalise(ds).includes(normalise(rawDs)) ||
                    normalise(rawDs).includes(normalise(ds)),
                );
                details.dsDivision = matched ?? rawDs;
              } catch {
                details.dsDivision = rawDs;
              }
            } else {
              details.dsDivision = rawDs;
            }
          }

          if (!details.gnDivision && details.dsDivision) {
            const gnCandidateRaw =
              addr.suburb ||
              addr.village ||
              addr.hamlet ||
              addr.neighbourhood ||
              addr.quarter;
            if (gnCandidateRaw) {
              const gnCandidate = toTitleCase(String(gnCandidateRaw).trim());
              try {
                const gnMap = await loadGnMap();
                const gnKey = Object.keys(gnMap).find(
                  (k) => k.toLowerCase() === details.dsDivision!.toLowerCase(),
                );
                const gnList = gnKey ? gnMap[gnKey] : [];
                const normalise = (s: string) =>
                  s.toLowerCase().replace(/[^a-z0-9]/g, "");
                const matched =
                  gnList.find(
                    (gn) => normalise(gn.name) === normalise(gnCandidate),
                  ) ||
                  gnList.find(
                    (gn) =>
                      normalise(gn.name).includes(normalise(gnCandidate)) ||
                      normalise(gnCandidate).includes(normalise(gn.name)),
                  );
                if (matched) {
                  details.gnDivision = matched.name;
                  details.gnNumber = matched.number;
                }
              } catch {
                void 0;
              }
            }
          }
        }
      } catch {
        void 0;
      }
    }

    if (!isValidCity(details.city)) {
      if (details.dsDivision) {
        details.city = details.dsDivision;
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

    return finalDetails;
  },

  getPostalCodeByAddress: async (
    city: string,
    district?: string,
  ): Promise<string> => {
    try {
      if (!city || city.trim() === "") {
        return "";
      }

      const queries = [];
      if (district) {
        queries.push(`${city}, ${district}, Sri Lanka`);
        queries.push(`${district}, ${city}, Sri Lanka`);
      }
      queries.push(`${city}, Sri Lanka`);

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
                  return result.address.postcode;
                }
              }
            }
          }
        } catch {
          void 0;
        }
      }

      return "";
    } catch {
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

        return {
          lat: location.lat,
          lng: location.lng,
        };
      }

      return null;
    } catch {
      return null;
    }
  },
};

export default LocationService;
