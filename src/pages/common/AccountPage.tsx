import { useAuth } from "@/Context/useAuth";
import { userService } from "@/services";
import { FormField, InfoChip, ProfileAvatar } from "@/shared/components";
import {
  CalendarToday,
  Cancel,
  Edit,
  Email,
  Home,
  Person,
  Phone,
  Save,
  Shield,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
}

const AccountPage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      if (!user?._id) {
        throw new Error("User ID not found");
      }

      const updatedUser = await userService.updateUserProfile(
        user._id,
        formData,
      );

      console.log("Profile updated successfully:", updatedUser);

      const completeUserData = {
        ...updatedUser,
        role: user.role,
      };

      await updateUser(completeUserData);

      setLoading(false);
      setSuccess(true);
      setIsEditing(false);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Account Settings
        </Typography>

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              animation: "slideIn 0.3s ease-out",
              "@keyframes slideIn": {
                from: {
                  opacity: 0,
                  transform: "translateY(-20px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
            onClose={() => setSuccess(false)}
          >
            Profile updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <ProfileAvatar
                    fullName={user?.fullName || null}
                    avatarUrl={
                      user?.role === "farmer"
                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJP8vN8tGwjdGdBoNRb3S7qP1VA0Q1F-SfWg&s"
                        : user?.role === "investor"
                          ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWHUQslqLEawVVIzUcGFkYYRm30cguWYwuhg&s"
                          : user?.role === "landowner"
                            ? "https://businesstoday.lk/wp-content/uploads/2024/11/Ishara-Nanayakkara-Executive-Chairman-1.png"
                            : undefined
                    }
                    size={140}
                    editable={true}
                  />
                  <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                    {user?.fullName || "User"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {user?.email || ""}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    sx={{ mb: 2 }}
                  >
                    <InfoChip label={user?.role || "User"} type="role" />
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Email fontSize="small" color="action" />
                      <InfoChip
                        label={
                          user?.emailVerified
                            ? "Email Verified"
                            : "Email Not Verified"
                        }
                        verified={user?.emailVerified}
                        type="verified"
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone fontSize="small" color="action" />
                      <InfoChip
                        label={
                          user?.phoneNumberVerified
                            ? "Phone Verified"
                            : "Phone Not Verified"
                        }
                        verified={user?.phoneNumberVerified}
                        type="verified"
                      />
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            <Card elevation={3} sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  <Shield sx={{ mr: 1, verticalAlign: "middle" }} />
                  Account Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                    >
                      {user?._id || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      <CalendarToday
                        sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                      />
                      Member Since
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(user?.createdAt || null)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(user?.updatedAt || null)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card elevation={3}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                    Personal Information
                  </Typography>
                  {!isEditing && (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormField
                        label="Email Address"
                        name="email"
                        value={user?.email || ""}
                        onChange={() => {}}
                        disabled
                        InputProps={{
                          endAdornment: <Email color="action" />,
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormField
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        type="tel"
                        InputProps={{
                          endAdornment: <Phone color="action" />,
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <FormField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        multiline
                        rows={3}
                        InputProps={{
                          endAdornment: <Home color="action" />,
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormField
                        label="Role"
                        name="role"
                        value={user?.role || ""}
                        onChange={() => {}}
                        disabled
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormField
                        label="Created By"
                        name="createdBy"
                        value={user?.createdBy || ""}
                        onChange={() => {}}
                        disabled
                      />
                    </Grid>
                    {isEditing && (
                      <Grid size={{ xs: 12 }}>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="flex-end"
                        >
                          <Button
                            variant="outlined"
                            startIcon={<Cancel />}
                            onClick={handleCancel}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                              loading ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Save />
                              )
                            }
                            disabled={loading}
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </Button>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AccountPage;
