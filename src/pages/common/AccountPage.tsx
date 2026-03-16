import { useAuth } from "@/Context/useAuth";
import {
  LocationService,
  userService,
  type UpdateUserProfileDTO,
} from "@/services";
import { FormField, ProfileAvatar } from "@/shared/components";
import {
  BusinessCenter,
  FavoriteBorder,
  LocationOn,
  MyLocation,
  PersonOutline,
  VerifiedUser,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  personalInfo: {
    address: string;
    nicNumber: string;
    gender: string;
    birthday: string;
    age: string | number;
    city: string;
    district: string;
    province: string;
    postalCode: string;
  };
  investor: {
    organizationName: string;
    registrationNo: string;
    companyAddress: string;
    organizationPhoneNumber: string;
    dsDivision: string;
    gnDivision: string;
    cropFocus: string[];
  };
}

const cardStyle = {
  bgcolor: "transparent",
  borderRadius: 2,
  border: "none",
  boxShadow: "none !important",
  backgroundImage: "none",
  filter: "none",
  backdropFilter: "none",
  transition: "none",
  "&:hover": {
    bgcolor: "transparent",
    boxShadow: "none !important",
    filter: "none",
    transform: "none",
  },
  "&:focus-within": {
    bgcolor: "transparent",
    boxShadow: "none !important",
    filter: "none",
  },
  mb: { xs: 1.25, sm: 1.5, md: 1.75 },
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#111213",
    borderRadius: "8px",
    "& fieldset": { borderColor: "#333" },
    "&:hover fieldset": { borderColor: "#555" },
    "&.Mui-focused fieldset": { borderColor: "#4ade80" },
  },
  "& .MuiInputLabel-root": { color: "#888" },
  "& .MuiInputBase-input": { color: "#fff" },
};

const DEFAULT_CROP_FOCUS = [
  "Coconut",
  "Rubber",
  "Vegetables",
  "Maize",
  "Cocoa",
  "Coffee",
  "Sugar Cane",
];

const normalizeCropFocus = (
  value: unknown,
  fallback: string[] = DEFAULT_CROP_FOCUS,
): string[] => {
  if (Array.isArray(value)) {
    const normalized = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    return normalized.length > 0 ? normalized : fallback;
  }

  if (typeof value === "string") {
    const normalized = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return normalized.length > 0 ? normalized : fallback;
  }

  return fallback;
};

const buildFormDataFromUser = (
  user: NonNullable<ReturnType<typeof useAuth>["user"]>,
): ProfileFormData => {
  const investor = user.investor || {};
  const derivedAddress = user.personalInfo?.address || user.address || "";

  return {
    fullName: user.fullName || "",
    phoneNumber: user.phoneNumber || "",
    personalInfo: {
      address: derivedAddress,
      nicNumber: user.personalInfo?.nicNumber || "",
      gender: user.personalInfo?.gender || "",
      birthday: user.personalInfo?.birthday
        ? new Date(user.personalInfo.birthday).toISOString().split("T")[0]
        : "",
      age: user.personalInfo?.age || "",
      city: user.personalInfo?.city || "",
      district: user.personalInfo?.district || "",
      province: user.personalInfo?.province || "",
      postalCode: user.personalInfo?.postalCode || "",
    },
    investor: {
      organizationName: investor.organizationName || "",
      registrationNo: investor.registrationNo || "",
      companyAddress: investor.companyAddress || "",
      organizationPhoneNumber: investor.organizationPhoneNumber || "",
      dsDivision: investor.dsDivision || "",
      gnDivision: investor.gnDivision || "",
      cropFocus: normalizeCropFocus(investor.cropFocus, DEFAULT_CROP_FOCUS),
    },
  };
};

const createComparableFormData = (data: ProfileFormData) => ({
  ...data,
  fullName: data.fullName.trim(),
  phoneNumber: data.phoneNumber.trim(),
  personalInfo: {
    ...data.personalInfo,
    address: data.personalInfo.address.trim(),
    nicNumber: data.personalInfo.nicNumber.trim(),
    gender: data.personalInfo.gender.trim(),
    birthday: data.personalInfo.birthday,
    age: data.personalInfo.age === "" ? "" : Number(data.personalInfo.age),
    city: data.personalInfo.city.trim(),
    district: data.personalInfo.district.trim(),
    province: data.personalInfo.province.trim(),
    postalCode: data.personalInfo.postalCode.trim(),
  },
  investor: {
    ...data.investor,
    organizationName: data.investor.organizationName.trim(),
    registrationNo: data.investor.registrationNo.trim(),
    companyAddress: data.investor.companyAddress.trim(),
    organizationPhoneNumber: data.investor.organizationPhoneNumber.trim(),
    dsDivision: data.investor.dsDivision.trim(),
    gnDivision: data.investor.gnDivision.trim(),
    cropFocus: [...normalizeCropFocus(data.investor.cropFocus, [])],
  },
});

const areFormDataEqual = (left: ProfileFormData, right: ProfileFormData) =>
  JSON.stringify(createComparableFormData(left)) ===
  JSON.stringify(createComparableFormData(right));

const AccountPage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [initialFormData, setInitialFormData] =
    useState<ProfileFormData | null>(null);
  const [documentAspectRatios, setDocumentAspectRatios] = useState({
    front: 1.586,
    back: 1.586,
  });
  const [dsDivisionsList, setDsDivisionsList] = useState<string[]>([]);
  const [gnDivisionsList, setGnDivisionsList] = useState<
    { name: string; number: string }[]
  >([]);
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [newCropValue, setNewCropValue] = useState("");

  const sriLankaLocations = useMemo(
    () => LocationService.getProvinceDistrictMap(),
    [],
  );

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    phoneNumber: "",
    personalInfo: {
      address: "",
      nicNumber: "",
      gender: "",
      birthday: "",
      age: "",
      city: "",
      district: "",
      province: "",
      postalCode: "",
    },
    investor: {
      organizationName: "",
      registrationNo: "",
      companyAddress: "",
      organizationPhoneNumber: "",
      dsDivision: "",
      gnDivision: "",
      cropFocus: DEFAULT_CROP_FOCUS,
    },
  });

  const isDirty = useMemo(() => {
    if (!initialFormData) return false;

    return (
      JSON.stringify(createComparableFormData(formData)) !==
      JSON.stringify(createComparableFormData(initialFormData))
    );
  }, [formData, initialFormData]);

  useEffect(() => {
    if (!user || isDirty) return;

    const mappedFormData = buildFormDataFromUser(user);

    setFormData((prev) =>
      areFormDataEqual(prev, mappedFormData) ? prev : mappedFormData,
    );

    setInitialFormData((prev) =>
      prev && areFormDataEqual(prev, mappedFormData) ? prev : mappedFormData,
    );
  }, [isDirty, user]);

  useEffect(() => {
    const district = formData.personalInfo.district;
    const currentDs = formData.investor.dsDivision;

    if (!district) {
      setDsDivisionsList([]);
      setGnDivisionsList([]);
      return;
    }

    let cancelled = false;

    const fetchDSDivisions = async () => {
      const divisions =
        await LocationService.getDSDivisionsByDistrict(district);
      if (cancelled) return;

      setDsDivisionsList(divisions);

      if (!currentDs) {
        setGnDivisionsList([]);
        return;
      }

      const matchedDs = divisions.find(
        (item) => item.toLowerCase() === currentDs.toLowerCase(),
      );

      if (!matchedDs) {
        setFormData((prev) => ({
          ...prev,
          investor: {
            ...prev.investor,
            dsDivision: "",
            gnDivision: "",
          },
        }));
        setGnDivisionsList([]);
      }
    };

    fetchDSDivisions();

    return () => {
      cancelled = true;
    };
  }, [formData.investor.dsDivision, formData.personalInfo.district]);

  useEffect(() => {
    const currentDs = formData.investor.dsDivision;
    const currentGn = formData.investor.gnDivision;

    if (!currentDs) {
      setGnDivisionsList([]);
      return;
    }

    let cancelled = false;

    const fetchGNDivisions = async () => {
      const gns = await LocationService.getGNDivisionsByDSDivision(currentDs);
      if (cancelled) return;

      setGnDivisionsList(gns);

      if (!currentGn) return;

      const matchedGn = gns.find(
        (item) => item.name.toLowerCase() === currentGn.toLowerCase(),
      );

      if (!matchedGn) {
        setFormData((prev) => ({
          ...prev,
          investor: {
            ...prev.investor,
            gnDivision: "",
          },
        }));
      }
    };

    fetchGNDivisions();

    return () => {
      cancelled = true;
    };
  }, [formData.investor.dsDivision, formData.investor.gnDivision]);

  useEffect(() => {
    const fetchFreshProfile = async () => {
      if (!user?._id) return;
      setFetchingProfile(true);
      setError("");
      try {
        const latest = await userService.getUserProfile(user._id);
        await updateUser(latest);
      } catch (err) {
        console.error("Failed to refresh profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to refresh profile",
        );
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchFreshProfile();
  }, [updateUser, user?._id]);

  useEffect(() => {
    const fetchPostalCode = async () => {
      const city = formData.personalInfo.city.trim();
      const district = formData.personalInfo.district.trim();
      const postalCode = formData.personalInfo.postalCode.trim();

      if (!city || !district || postalCode) return;

      const code = await LocationService.getPostalCodeByAddress(city, district);
      if (!code) return;

      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          postalCode: code,
        },
      }));
    };

    const timeoutId = setTimeout(fetchPostalCode, 800);
    return () => clearTimeout(timeoutId);
  }, [
    formData.personalInfo.city,
    formData.personalInfo.district,
    formData.personalInfo.postalCode,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("personalInfo.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [fieldName]: value,
        },
      }));
    } else if (name.startsWith("investor.")) {
      const fieldName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        investor: {
          ...prev.investor,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProvinceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        province: value,
        district: "",
      },
      investor: {
        ...prev.investor,
        dsDivision: "",
        gnDivision: "",
      },
    }));
    setDsDivisionsList([]);
    setGnDivisionsList([]);
  };

  const handleDistrictChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        district: value,
      },
      investor: {
        ...prev.investor,
        dsDivision: "",
        gnDivision: "",
      },
    }));
    setGnDivisionsList([]);
  };

  const handleDsDivisionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      investor: {
        ...prev.investor,
        dsDivision: value,
        gnDivision: "",
      },
    }));
  };

  const handleGnDivisionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      investor: {
        ...prev.investor,
        gnDivision: value,
      },
    }));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoadingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const details = await LocationService.getLocationDetails(
            position.coords.latitude,
            position.coords.longitude,
          );

          setFormData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              address: details.address || prev.personalInfo.address,
              city: details.city || prev.personalInfo.city,
              province: details.province || prev.personalInfo.province,
              district: details.district || prev.personalInfo.district,
              postalCode: details.postalCode || prev.personalInfo.postalCode,
            },
            investor: {
              ...prev.investor,
              dsDivision: details.dsDivision || prev.investor.dsDivision,
              gnDivision: details.gnDivision || prev.investor.gnDivision,
            },
          }));
        } catch {
          setError("Failed to fetch location details. Please try again.");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      () => {
        setError(
          "Failed to get your location. Please enable location services.",
        );
        setIsLoadingLocation(false);
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!user?._id) throw new Error("User ID not found");

      const processedAge = formData.personalInfo.age
        ? typeof formData.personalInfo.age === "string"
          ? parseInt(formData.personalInfo.age, 10)
          : formData.personalInfo.age
        : undefined;

      const currentRole = (user.role || "").toLowerCase();
      const isInvestor = currentRole === "investor" || !!user.investor;

      const updatePayload: UpdateUserProfileDTO = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber,
        personalInfo: {
          ...(user.personalInfo || {}),
          address: formData.personalInfo.address,
          nicNumber: formData.personalInfo.nicNumber,
          gender: formData.personalInfo.gender,
          birthday: formData.personalInfo.birthday
            ? new Date(formData.personalInfo.birthday).toISOString()
            : undefined,
          age: processedAge,
          city: formData.personalInfo.city,
          district: formData.personalInfo.district,
          province: formData.personalInfo.province,
          postalCode: formData.personalInfo.postalCode,
        },
      };

      if (isInvestor) {
        updatePayload.investor = {
          ...(user.investor || {}),
          ...formData.investor,
          cropFocus: normalizeCropFocus(formData.investor.cropFocus, []),
        };
      }

      await userService.updateUserProfile(user._id, updatePayload);

      const latestUser = await userService.getUserProfile(user._id);
      const syncedFormData = buildFormDataFromUser(latestUser);

      await updateUser(latestUser);

      setFormData(syncedFormData);
      setInitialFormData(syncedFormData);

      setLoading(false);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (!initialFormData) return;
    setFormData(initialFormData);
    setIsAddingCrop(false);
    setNewCropValue("");
    setError("");
    setSuccess(false);
  };

  const handleRemoveCropFocus = (cropToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      investor: {
        ...prev.investor,
        cropFocus: prev.investor.cropFocus.filter(
          (crop) => crop !== cropToRemove,
        ),
      },
    }));
  };

  const handleAddCropFocus = () => {
    const normalizedCrop = newCropValue.trim();
    if (!normalizedCrop) return;

    setFormData((prev) => {
      const alreadyExists = prev.investor.cropFocus.some(
        (crop) => crop.toLowerCase() === normalizedCrop.toLowerCase(),
      );

      if (alreadyExists) return prev;

      return {
        ...prev,
        investor: {
          ...prev.investor,
          cropFocus: [...prev.investor.cropFocus, normalizedCrop],
        },
      };
    });

    setNewCropValue("");
    setIsAddingCrop(false);
  };

  const handleNewCropKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddCropFocus();
    }

    if (event.key === "Escape") {
      setIsAddingCrop(false);
      setNewCropValue("");
    }
  };

  const handleDocumentImageLoad = (
    side: "front" | "back",
    event: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (!naturalWidth || !naturalHeight) return;

    setDocumentAspectRatios((prev) => ({
      ...prev,
      [side]: naturalWidth / naturalHeight,
    }));
  };

  const cropFocusItems = normalizeCropFocus(formData.investor.cropFocus, []);
  const statusLabel = user?.status || "Active";
  const nicFrontUrl = user?.personalInfo?.nicFrontImage?.url;
  const nicBackUrl = user?.personalInfo?.nicBackImage?.url;

  return (
    <Box
      sx={{
        p: { xs: 0, sm: 0, md: 0 },
        width: "100%",
        maxWidth: "100%",
        mx: 0,
        color: "#fff",
      }}
    >
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 1.5 }}
          onClose={() => setSuccess(false)}
        >
          Profile updated successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card elevation={0} sx={cardStyle}>
          <CardContent
            sx={{
              p: { xs: 1.5, sm: 2, md: 2.5 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1.25, sm: 2 },
            }}
          >
            <Box position="relative">
              <ProfileAvatar
                fullName={user?.fullName || "User"}
                avatarUrl={
                  typeof user?.personalInfo?.profilePicture === "string"
                    ? user?.personalInfo?.profilePicture
                    : user?.personalInfo?.profilePicture?.url
                }
                size={80}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "#4ade80",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "2px solid #1A1D1A",
                }}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" gap={1.25} mb={0.75}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {formData.fullName || "User"}
                </Typography>
                <Chip
                  label={`• ${statusLabel}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(74, 222, 128, 0.1)",
                    color: "#4ade80",
                    fontWeight: 600,
                    border: "1px solid rgba(74, 222, 128, 0.2)",
                  }}
                />
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 0.5,
                  wordBreak: "break-word",
                }}
              >
                {user?.email || ""}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                gap={{ xs: 0.5, sm: 2 }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ACCOUNT ID
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {user?._id?.substring(0, 12).toUpperCase() ||
                      "INV-93BC6510"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    JOIN DATE
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Oct 12, 2023"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.25 } }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <PersonOutline sx={{ mr: 1, color: "#4ade80" }} /> Personal
              Information
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 1.75, md: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="Email Address"
                  name="email"
                  value={user?.email || ""}
                  onChange={() => {}}
                  disabled
                  sx={inputStyle}
                  InputProps={{
                    endAdornment: (
                      <Typography
                        variant="caption"
                        sx={{ color: "#4ade80", fontWeight: "bold" }}
                      >
                        VERIFIED
                      </Typography>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="NIC Number"
                  name="personalInfo.nicNumber"
                  value={formData.personalInfo.nicNumber}
                  onChange={() => {}}
                  disabled
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField
                  label="Gender"
                  name="personalInfo.gender"
                  value={formData.personalInfo.gender}
                  onChange={() => {}}
                  disabled
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField
                  type="date"
                  label="Birthday"
                  name="personalInfo.birthday"
                  value={formData.personalInfo.birthday}
                  onChange={() => {}}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormField
                  label="Age"
                  name="personalInfo.age"
                  value={
                    formData.personalInfo.age !== "" &&
                    formData.personalInfo.age !== undefined
                      ? `${formData.personalInfo.age} years`
                      : ""
                  }
                  onChange={() => {}}
                  disabled
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.25 } }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <LocationOn sx={{ mr: 1, color: "#4ade80" }} /> Residential
              Address
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 1.75, md: 2 }}>
              <Grid size={{ xs: 12 }}>
                <FormField
                  label="Address Line"
                  name="personalInfo.address"
                  value={formData.personalInfo.address}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleUseMyLocation}
                          disabled={isLoadingLocation}
                          title="Use My Location"
                          sx={{ color: "#4ade80" }}
                        >
                          {isLoadingLocation ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "#4ade80" }}
                            />
                          ) : (
                            <MyLocation />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel shrink sx={{ color: "#888" }}>
                    Province
                  </InputLabel>
                  <Select
                    value={formData.personalInfo.province}
                    onChange={(event) =>
                      handleProvinceChange(event.target.value)
                    }
                    displayEmpty
                    label="Province"
                    notched
                    sx={inputStyle}
                  >
                    <MenuItem value="" disabled>
                      Select Province
                    </MenuItem>
                    {Object.keys(sriLankaLocations).map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl
                  fullWidth
                  disabled={!formData.personalInfo.province}
                >
                  <InputLabel shrink sx={{ color: "#888" }}>
                    District
                  </InputLabel>
                  <Select
                    value={formData.personalInfo.district}
                    onChange={(event) =>
                      handleDistrictChange(event.target.value)
                    }
                    displayEmpty
                    label="District"
                    notched
                    sx={inputStyle}
                  >
                    <MenuItem value="" disabled>
                      Select District
                    </MenuItem>
                    {(
                      sriLankaLocations[formData.personalInfo.province] || []
                    ).map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl
                  fullWidth
                  disabled={!formData.personalInfo.district}
                >
                  <InputLabel shrink sx={{ color: "#888" }}>
                    DS Division
                  </InputLabel>
                  <Select
                    value={formData.investor.dsDivision}
                    onChange={(event) =>
                      handleDsDivisionChange(event.target.value)
                    }
                    displayEmpty
                    label="DS Division"
                    notched
                    sx={inputStyle}
                  >
                    <MenuItem value="" disabled>
                      Select DS Division
                    </MenuItem>
                    {dsDivisionsList.map((division) => (
                      <MenuItem key={division} value={division}>
                        {division}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth disabled={!formData.investor.dsDivision}>
                  <InputLabel shrink sx={{ color: "#888" }}>
                    GN Division
                  </InputLabel>
                  <Select
                    value={formData.investor.gnDivision}
                    onChange={(event) =>
                      handleGnDivisionChange(event.target.value)
                    }
                    displayEmpty
                    label="GN Division"
                    notched
                    sx={inputStyle}
                  >
                    <MenuItem value="" disabled>
                      Select GN Division
                    </MenuItem>
                    {gnDivisionsList.map((division) => (
                      <MenuItem key={division.number} value={division.name}>
                        {division.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="City"
                  name="personalInfo.city"
                  value={formData.personalInfo.city}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="Postal Code"
                  name="personalInfo.postalCode"
                  value={formData.personalInfo.postalCode}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.25 } }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <BusinessCenter sx={{ mr: 1, color: "#4ade80" }} /> Professional
              Details
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 1.75, md: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="Organization Name"
                  name="investor.organizationName"
                  value={formData.investor.organizationName}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="Registration No"
                  name="investor.registrationNo"
                  value={formData.investor.registrationNo}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="Organization Phone"
                  name="investor.organizationPhoneNumber"
                  value={formData.investor.organizationPhoneNumber}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="Company Address"
                  name="investor.companyAddress"
                  value={formData.investor.companyAddress}
                  onChange={handleChange}
                  sx={inputStyle}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.25 } }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FavoriteBorder sx={{ mr: 1, color: "#4ade80" }} /> Investment
              Preferences
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1.5, display: "block" }}
            >
              Crop Focus (Multi-select)
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {cropFocusItems.map((crop) => (
                <Chip
                  key={crop}
                  label={crop}
                  sx={{
                    bgcolor: "rgba(74, 222, 128, 0.1)",
                    color: "#4ade80",
                    border: "1px solid rgba(74, 222, 128, 0.3)",
                    borderRadius: "4px",
                    "&:hover": { bgcolor: "rgba(74, 222, 128, 0.2)" },
                    "& .MuiChip-deleteIcon": {
                      color: "#4ade80",
                      "&:hover": { color: "#86efac" },
                    },
                  }}
                  onDelete={() => handleRemoveCropFocus(crop)}
                />
              ))}
              {isAddingCrop ? (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  <TextField
                    size="small"
                    placeholder="Add crop focus"
                    value={newCropValue}
                    onChange={(event) => setNewCropValue(event.target.value)}
                    onKeyDown={handleNewCropKeyDown}
                    autoFocus
                    sx={{
                      minWidth: { xs: "100%", sm: 180 },
                      ...inputStyle,
                      "& .MuiInputBase-input::placeholder": {
                        color: "#777",
                        opacity: 1,
                      },
                    }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      onClick={handleAddCropFocus}
                      sx={{
                        bgcolor: "#4ade80",
                        color: "#000",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#22c55e" },
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsAddingCrop(false);
                        setNewCropValue("");
                      }}
                      sx={{
                        borderColor: "#333",
                        color: "#fff",
                        "&:hover": {
                          borderColor: "#555",
                          bgcolor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Chip
                  label="+ Add More"
                  sx={{
                    bgcolor: "#2A2D2A",
                    color: "#fff",
                    borderRadius: "4px",
                    "&:hover": { bgcolor: "#333" },
                  }}
                  onClick={() => setIsAddingCrop(true)}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={cardStyle}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 2.25 } }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                display: "flex",
                alignItems: "center",
              }}
            >
              <VerifiedUser sx={{ mr: 1, color: "#4ade80" }} /> Document
              Verification (KYC)
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 1.5, sm: 2 },
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 auto" } }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  NIC Front
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Box
                    sx={{
                      width: "auto",
                      aspectRatio: documentAspectRatios.front,
                      height: { xs: 150, sm: 180, md: 200 },
                      maxWidth: "100%",
                      border: "2px dashed #333",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#111213",
                      overflow: "hidden",
                      p: nicFrontUrl ? 1 : 0,
                    }}
                  >
                    {nicFrontUrl ? (
                      <Box
                        component="img"
                        src={nicFrontUrl}
                        alt="NIC Front"
                        onLoad={(
                          event: React.SyntheticEvent<HTMLImageElement>,
                        ) => handleDocumentImageLoad("front", event)}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "center",
                          borderRadius: 1,
                          bgcolor: "#fff",
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Upload Front
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 auto" } }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  NIC Back
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Box
                    sx={{
                      width: "auto",
                      aspectRatio: documentAspectRatios.back,
                      height: { xs: 150, sm: 180, md: 200 },
                      maxWidth: "100%",
                      border: "2px dashed #333",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#111213",
                      overflow: "hidden",
                      p: nicBackUrl ? 1 : 0,
                    }}
                  >
                    {nicBackUrl ? (
                      <Box
                        component="img"
                        src={nicBackUrl}
                        alt="NIC Back"
                        onLoad={(
                          event: React.SyntheticEvent<HTMLImageElement>,
                        ) => handleDocumentImageLoad("back", event)}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          objectPosition: "center",
                          borderRadius: 1,
                          bgcolor: "#fff",
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Upload Back
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {isDirty && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: { xs: 1, sm: 0 },
              p: { xs: 1.5, sm: 2 },
              bgcolor: "transparent",
              borderRadius: 2,
              border: "none",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ pr: { sm: 2 } }}
            >
              Unsaved changes will be lost if you leave without saving.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{ justifyContent: { xs: "flex-end", sm: "flex-start" } }}
            >
              <Button
                variant="outlined"
                onClick={handleDiscard}
                fullWidth
                sx={{
                  borderColor: "#333",
                  color: "#fff",
                  "&:hover": {
                    borderColor: "#555",
                    bgcolor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Discard Changes
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || fetchingProfile || !isDirty}
                fullWidth
                sx={{
                  bgcolor: "#4ade80",
                  color: "#000",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#22c55e" },
                }}
              >
                {loading
                  ? "Saving..."
                  : fetchingProfile
                    ? "Refreshing..."
                    : "Save Changes"}
              </Button>
            </Stack>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default AccountPage;
