import {
  AdministrativeFields,
  FormSection,
  NicUploader,
  ProfileStepper,
} from "@/components";
import {
  LocationService,
  registrationStore,
  type InvestorRegistrationRequest,
} from "@/services";
import { getStoredCredentials, validateNIC } from "@/utils";
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
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../../shared/components/Notification";
import { useFormPersistence } from "../../shared/hooks/useFormPersistence";
import { useNotification } from "../../shared/hooks/useNotification";

const InvestorProfileSetup = () => {
  const navigate = useNavigate();
  const { notification, showSuccess, hideNotification } = useNotification();
  const steps = ["Step 1", "Step 2", "Step 3"];

  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const [fullName, setFullName] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [nicError, setNicError] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [age, setAge] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");

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

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [organizationName, setOrganizationName] = useState("");
  const [headOfficeLocation, setHeadOfficeLocation] = useState("");
  const [organizationContactNo, setOrganizationContactNo] = useState("");
  const [businessRegistrationNo, setBusinessRegistrationNo] = useState("");
  const [cropFocus, setCropFocus] = useState<string[]>([]);

  const [nicFrontFile, setNicFrontFile] = useState<File | null>(null);
  const [nicBackFile, setNicBackFile] = useState<File | null>(null);

  const sriLankaLocations = LocationService.getProvinceDistrictMap();

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
      setProfilePictureFile(file);
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

            const details = await LocationService.getLocationDetails(
              latitude,
              longitude,
            );
            console.log("Location details:", details);

            if (details.dsDivision || details.gnDivision) {
              pendingLocationUpdate.current = {
                ds: details.dsDivision,
                gn: details.gnDivision,
                gnNumber: details.gnNumber,
              };
            }

            if (details.address) {
              setStreet(details.address);
            }
            if (details.city) setCity(details.city);
            if (details.postalCode) setPostalCode(details.postalCode);

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

  const handleCompleteRegistration = () => {
    const { email, password, emailVerified } = getStoredCredentials();
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : phoneNumber.startsWith("0")
        ? `+94${phoneNumber.substring(1)}`
        : `+94${phoneNumber}`;

    const payload: InvestorRegistrationRequest = {
      fullName,
      email,
      emailVerified,
      phoneNumber: formattedPhone,
      phoneNumberVerified: false,
      password,
      role: "investor",
      personalInfo: {
        nicNumber,
        birthday,
        gender: gender as "Male" | "Female",
        age: age || 0,
        address: street,
        city,
        postalCode,
        district,
        province,
      },
      investorDetails: {
        dsDivision,
        gnDivision,
        organizationName,
        companyAddress: headOfficeLocation,
        organizationPhoneNumber: organizationContactNo,
        registrationNo: businessRegistrationNo,
        cropFocus: cropFocus.join(", "),
      },
    };

    localStorage.setItem("pendingRegistrationPayload", JSON.stringify(payload));
    registrationStore.setFiles({
      profilePicture: profilePictureFile,
      nicFrontImage: nicFrontFile,
      nicBackImage: nicBackFile,
    });
    navigate("/terms-and-conditions");
  };

  const formData = {
    profilePicture,
    fullName,
    nicNumber,
    birthday,
    gender,
    age,
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
  };

  const { loadFormData } = useFormPersistence("investor", formData);

  useEffect(() => {
    const loadSavedData = async () => {
      const savedData = await loadFormData();
      if (savedData) {
        console.log("Loading saved investor form data...");

        if (savedData.fullName) setFullName(savedData.fullName as string);
        if (savedData.nicNumber) setNicNumber(savedData.nicNumber as string);
        if (savedData.birthday) setBirthday(savedData.birthday as string);
        if (savedData.gender) setGender(savedData.gender as "Male" | "Female");
        if (savedData.age) setAge(savedData.age as number);
        if (savedData.phoneNumber)
          setPhoneNumber(savedData.phoneNumber as string);
        if (savedData.street) setStreet(savedData.street as string);
        if (savedData.city) setCity(savedData.city as string);
        if (savedData.province) setProvince(savedData.province as string);

        if (savedData.dsDivision) {
          pendingLocationUpdate.current = {
            ds: savedData.dsDivision as string,
            gn: (savedData.gnDivision as string) || undefined,
          };
        }
        if (savedData.district) setDistrict(savedData.district as string);
        if (savedData.postalCode) setPostalCode(savedData.postalCode as string);
        if (savedData.organizationName)
          setOrganizationName(savedData.organizationName as string);
        if (savedData.headOfficeLocation)
          setHeadOfficeLocation(savedData.headOfficeLocation as string);
        if (savedData.organizationContactNo)
          setOrganizationContactNo(savedData.organizationContactNo as string);
        if (savedData.businessRegistrationNo)
          setBusinessRegistrationNo(savedData.businessRegistrationNo as string);
        if (savedData.cropFocus) setCropFocus(savedData.cropFocus as string[]);
        if (savedData.profilePicture)
          setProfilePicture(savedData.profilePicture as string);

        showSuccess("Your previous form data has been restored!");
      }
    };

    loadSavedData();

  }, []);

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
                Investor{" "}
                <span style={{ color: "var(--color-olive)" }}>Profile</span>
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
                          ? "var(--text-primary)"
                          : "var(--text-on-dark)",
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
                          ? "var(--text-primary)"
                          : "var(--text-on-dark)",
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
                            ? "var(--text-primary)"
                            : "var(--text-on-dark)",
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
              <NicUploader
                frontFile={nicFrontFile}
                backFile={nicBackFile}
                onFrontChange={setNicFrontFile}
                onBackChange={setNicBackFile}
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

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        duration={5000}
        onClose={hideNotification}
      />
    </Box>
  );
};

export default InvestorProfileSetup;
