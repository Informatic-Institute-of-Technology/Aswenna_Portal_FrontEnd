import {
  AdministrativeFields,
  FileUploader,
  FormSection,
  ProfileStepper,
} from "@/components";
import { LocationService } from "@/services";
import { validateNIC } from "@/utils";
import {
  AccountBalance,
  ArrowBack,
  Business,
  CameraAlt,
  Description,
  MyLocation,
  Person,
  Phone,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const InvestorProfileSetup = () => {
  const navigate = useNavigate();
  const steps = ["Step 1", "Step 2", "Step 3"];

  // Personal Information
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [nicError, setNicError] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [age, setAge] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Address Fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Administrative Divisions
  const [dsDivision, setDsDivision] = useState("");
  const [gnDivision, setGnDivision] = useState("");
  const [dsDivisionsList, setDsDivisionsList] = useState<string[]>([]);
  const [gnDivisionsList, setGnDivisionsList] = useState<
    { name: string; number: string }[]
  >([]);
  const pendingLocationUpdate = useRef<{
    ds?: string;
    gn?: string;
    gnNumber?: string;
  } | null>(null);

  // Location Loading State
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Organization Information
  const [organizationName, setOrganizationName] = useState("");
  const [headOfficeLocation, setHeadOfficeLocation] = useState("");
  const [organizationContactNo, setOrganizationContactNo] = useState("");
  const [businessRegistrationNo, setBusinessRegistrationNo] = useState("");
  const [cropFocus, setCropFocus] = useState<string[]>([]);

  // Documents
  const [nicFiles, setNicFiles] = useState<File[]>([]);

  // Sri Lanka locations data
  const sriLankaLocations: Record<string, string[]> = {
    Central: ["Kandy", "Matale", "Nuwara Eliya"],
    Eastern: ["Ampara", "Batticaloa", "Trincomalee"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "North Western": ["Kurunegala", "Puttalam"],
    Sabaragamuwa: ["Kegalle", "Ratnapura"],
    Southern: ["Galle", "Hambantota", "Matara"],
    Uva: ["Badulla", "Monaragala"],
    Western: ["Colombo", "Gampaha", "Kalutara"],
  };

  // Available crop types
  const cropTypes = [
    "Rice",
    "Tea",
    "Coconut",
    "Rubber",
    "Vegetables",
    "Fruits",
    "Spices",
    "Sugar Cane",
    "Coffee",
    "Cocoa",
    "Cashew",
    "Maize",
  ];

  // Fetch DS Divisions when district changes
  useEffect(() => {
    const fetchDSDivisions = async () => {
      if (district) {
        try {
          const divisions =
            await LocationService.getDSDivisionsByDistrict(district);
          setDsDivisionsList(divisions);

          if (pendingLocationUpdate.current?.ds) {
            const match = divisions.find(
              (d) =>
                d.toLowerCase() ===
                pendingLocationUpdate.current?.ds?.toLowerCase(),
            );
            if (match) {
              setDsDivision(match);
            } else {
              console.warn(
                "Pending DS Division not found in list:",
                pendingLocationUpdate.current?.ds,
              );
              setDsDivision("");
            }
          } else {
            setDsDivision("");
          }
        } catch (error) {
          console.error("Failed to load DS Divisions", error);
          setDsDivisionsList([]);
          setDsDivision("");
        }
      } else {
        setDsDivisionsList([]);
        setDsDivision("");
      }
    };

    fetchDSDivisions();
  }, [district]);

  // Fetch GN Divisions when DS Division changes
  useEffect(() => {
    const fetchGNDivisions = async () => {
      if (dsDivision) {
        try {
          const gns =
            await LocationService.getGNDivisionsByDSDivision(dsDivision);
          setGnDivisionsList(gns);

          if (pendingLocationUpdate.current?.gn) {
            const match = gns.find(
              (g) =>
                g.name.toLowerCase() ===
                pendingLocationUpdate.current?.gn?.toLowerCase(),
            );
            if (match) {
              setGnDivision(match.name);
            } else {
              console.warn(
                "Pending GN Division not found in list:",
                pendingLocationUpdate.current?.gn,
              );
              setGnDivision("");
            }
            pendingLocationUpdate.current = null;
          } else {
            setGnDivision("");
          }
        } catch (error) {
          console.error("Failed to load GN Divisions", error);
          setGnDivisionsList([]);
          setGnDivision("");
        }
      } else {
        setGnDivisionsList([]);
        setGnDivision("");
      }
    };

    fetchGNDivisions();
  }, [dsDivision]);

  // Auto-fetch postal code
  useEffect(() => {
    const fetchPostalCode = async () => {
      if (city && district && !postalCode) {
        try {
          const code = await LocationService.getPostalCodeByAddress(
            city,
            district,
          );
          if (code) setPostalCode(code);
        } catch (e) {
          console.error("Failed to auto-fetch postal code", e);
        }
      }
    };

    const timeoutId = setTimeout(fetchPostalCode, 1000);
    return () => clearTimeout(timeoutId);
  }, [city, district, postalCode]);

  const handleBack = () => {
    navigate("/role-selection");
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseMyLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current location:", { latitude, longitude });

          try {
            // Get location details from coordinates
            const details = await LocationService.getLocationDetails(
              latitude,
              longitude,
            );
            console.log("Location details:", details);

            // Set pending update for DS/GN divisions BEFORE updating state
            // This ensures the useEffect can pick up the pending values
            if (details.dsDivision || details.gnDivision) {
              pendingLocationUpdate.current = {
                ds: details.dsDivision,
                gn: details.gnDivision,
                gnNumber: details.gnNumber,
              };
            }

            // Update address fields
            // Keep the full street address as returned by the API
            if (details.address) {
              setStreet(details.address);
            }
            if (details.city) setCity(details.city);
            if (details.postalCode) setPostalCode(details.postalCode);

            // Update province and district last to trigger DS/GN division fetch with pending values already set
            if (details.province) setProvince(details.province);
            if (details.district) setDistrict(details.district);
          } catch (error) {
            console.error("Failed to get location details:", error);
            alert("Failed to fetch location details. Please try again.");
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Failed to get your location. Please enable location services.",
          );
          setIsLoadingLocation(false);
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
    }
  };

  const handleNICChange = (value: string) => {
    setNicNumber(value);
    setNicError("");

    if (value.trim() === "") {
      setBirthday("");
      setGender("");
      setAge(null);
      return;
    }

    if (value.length === 10 || value.length === 12) {
      const result = validateNIC(value);

      if (result.isValid) {
        setBirthday(result.birthday || "");
        setGender(result.gender || "");
        setAge(result.age || null);
        setNicError("");
      } else {
        setBirthday("");
        setGender("");
        setAge(null);
        setNicError(result.error || "Invalid NIC");
      }
    }
  };

  const handleProvinceChange = (event: SelectChangeEvent<string>) => {
    setProvince(event.target.value);
    setDistrict("");
  };

  const handleDistrictChange = (event: SelectChangeEvent<string>) => {
    setDistrict(event.target.value);
  };

  const handleDsDivisionChange = (event: SelectChangeEvent<string>) => {
    setDsDivision(event.target.value);
  };

  const handleGnDivisionChange = (event: SelectChangeEvent<string>) => {
    setGnDivision(event.target.value);
  };

  const handleCropFocusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setCropFocus(typeof value === "string" ? value.split(",") : value);
  };

  const handleNicFilesSelected = (newFiles: File[]) => {
    setNicFiles((prev) => [...prev, ...newFiles]);
  };

  const handleNicFileDelete = (index: number) => {
    setNicFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompleteRegistration = () => {
    console.log({
      fullName,
      nicNumber,
      phoneNumber,
      street,
      city,
      province,
      district,
      postalCode,
      dsDivision,
      gnDivision,
      organizationName,
      headOfficeLocation,
      organizationContactNo,
      businessRegistrationNo,
      cropFocus,
      nicFiles,
    });

    alert("Investor Registration Complete!");
    navigate("/investor/dashboard");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: 2, px: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              cursor: "pointer",
            }}
            onClick={handleBack}
          >
            <ArrowBack
              sx={{ color: "text.secondary", mr: 1, fontSize: "1rem" }}
            />
            <Typography variant="body2" color="text.secondary">
              Back to Role Selection
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Investor <span style={{ color: "#6B8E23" }}>Profile</span>
              </Typography>
            </Box>

            <ProfileStepper activeStep={2} steps={steps} />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <FormSection
              icon={<Person sx={{ color: "primary.main", mr: 1.5 }} />}
              title="Personal Information"
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 3 }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        src={profilePicture || undefined}
                        sx={{
                          width: 120,
                          height: 120,
                          border: "4px solid",
                          borderColor: "primary.main",
                          fontSize: "3rem",
                        }}
                      >
                        {!profilePicture && (
                          <Person sx={{ fontSize: "4rem" }} />
                        )}
                      </Avatar>
                      <IconButton
                        component="label"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          backgroundColor: "primary.main",
                          "&:hover": { backgroundColor: "primary.dark" },
                          width: 40,
                          height: 40,
                        }}
                      >
                        <CameraAlt
                          sx={{ color: "white", fontSize: "1.25rem" }}
                        />
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    placeholder="John Doe"
                    variant="outlined"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="NIC Number"
                    placeholder="123456789V or 199912345678"
                    variant="outlined"
                    value={nicNumber}
                    onChange={(e) => handleNICChange(e.target.value)}
                    error={!!nicError}
                    helperText={nicError}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Gender"
                    variant="outlined"
                    value={gender}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: gender
                          ? "rgba(255, 255, 255, 0.87)"
                          : "rgba(255, 255, 255, 0.38)",
                        fontWeight: gender ? 600 : 400,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    variant="outlined"
                    value={
                      birthday
                        ? new Date(birthday).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""
                    }
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: birthday
                          ? "rgba(255, 255, 255, 0.87)"
                          : "rgba(255, 255, 255, 0.38)",
                        fontWeight: birthday ? 600 : 400,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Age"
                    variant="outlined"
                    value={age !== null ? `${age} years` : ""}
                    disabled
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor:
                          age !== null
                            ? "rgba(255, 255, 255, 0.87)"
                            : "rgba(255, 255, 255, 0.38)",
                        fontWeight: age !== null ? 600 : 400,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="+94 XX XXX XXXX"
                    variant="outlined"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mt: 2,
                      mb: 1,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Address
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Street Address (No / Lane)"
                    placeholder="Ramakrishna Road, Colombo 07"
                    variant="outlined"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleUseMyLocation}
                              disabled={isLoadingLocation}
                              title="Use My Location"
                              color="primary"
                            >
                              {isLoadingLocation ? (
                                <CircularProgress size={24} />
                              ) : (
                                <MyLocation />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="City / Town"
                    placeholder="Colombo"
                    variant="outlined"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel shrink>Province</InputLabel>
                    <Select
                      value={province}
                      onChange={handleProvinceChange}
                      displayEmpty
                      label="Province"
                      notched
                    >
                      <MenuItem value="" disabled>
                        Select Province
                      </MenuItem>
                      {Object.keys(sriLankaLocations).map((prov) => (
                        <MenuItem key={prov} value={prov}>
                          {prov}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth disabled={!province}>
                    <InputLabel shrink>District</InputLabel>
                    <Select
                      value={district}
                      onChange={handleDistrictChange}
                      displayEmpty
                      label="District"
                      notched
                    >
                      <MenuItem value="" disabled>
                        Select District
                      </MenuItem>
                      {province &&
                        sriLankaLocations[province]?.map((dist) => (
                          <MenuItem key={dist} value={dist}>
                            {dist}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    placeholder="00100"
                    variant="outlined"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              icon={<AccountBalance sx={{ color: "primary.main", mr: 1.5 }} />}
              title="Administrative Details"
            >
              <AdministrativeFields
                district={district}
                dsDivision={dsDivision}
                gnDivision={gnDivision}
                dsDivisionsList={dsDivisionsList}
                gnDivisionsList={gnDivisionsList}
                onDsDivisionChange={handleDsDivisionChange}
                onGnDivisionChange={handleGnDivisionChange}
              />
            </FormSection>
          </Grid>

          {/* Right Section - Organization Info, NIC Upload, Expert Tip & Actions */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <FormSection
              icon={<Business sx={{ color: "primary.main", mr: 1.5 }} />}
              title="Organization Information (Optional)"
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    placeholder="Enter your organization name"
                    variant="outlined"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Company Location"
                    placeholder="Enter Company address"
                    variant="outlined"
                    value={headOfficeLocation}
                    onChange={(e) => setHeadOfficeLocation(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Organization Contact No"
                    placeholder="+94 XX XXX XXXX"
                    variant="outlined"
                    value={organizationContactNo}
                    onChange={(e) => setOrganizationContactNo(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Business Registration No"
                    placeholder="BR/XXXX/XXXX"
                    variant="outlined"
                    value={businessRegistrationNo}
                    onChange={(e) => setBusinessRegistrationNo(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel shrink>Crop Focus</InputLabel>
                    <Select
                      multiple
                      value={cropFocus}
                      onChange={handleCropFocusChange}
                      displayEmpty
                      label="Crop Focus"
                      notched
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {cropTypes.map((crop) => (
                        <MenuItem key={crop} value={crop}>
                          {crop}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              icon={<Description sx={{ color: "primary.main", mr: 1.5 }} />}
              title="National ID Copy"
            >
              <FileUploader
                files={nicFiles}
                onFilesSelected={handleNicFilesSelected}
                onFileDelete={handleNicFileDelete}
                accept="image/*,application/pdf"
                label="Upload NIC Copy (Front & Back)"
                helperText="Upload clear copies of both sides of your National ID"
              />
            </FormSection>

            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCompleteRegistration}
                disabled={
                  !fullName ||
                  !nicNumber ||
                  nicError !== "" ||
                  !phoneNumber ||
                  !street ||
                  !city
                }
                sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
              >
                Complete Registration
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestorProfileSetup;
