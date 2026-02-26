import { Add, Edit, Landscape, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CreateAdPopup from "../../components/landowner/CreateAdPopup";

interface LandAd {
  id: number;
  location: string;
  landArea: string;
  soilType: string;
  rentalAmount: string;
  availablePeriod: string;
  image: string;
  status: "open" | "allocated" | "expired";
  projectName?: string;
}

const StatusLabel = ({ status }: { status: LandAd["status"] }) => {
  const statusConfig: Record<
    LandAd["status"],
    { label: string; color: "success" | "warning" | "default" }
  > = {
    allocated: {
      label: "Allocated to Active Project",
      color: "default",
    },
    open: {
      label: "Open for New Projects",
      color: "success",
    },
    expired: {
      label: "Project Completed (Expired)",
      color: "warning",
    },
  };

  const config = statusConfig[status];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
};

const MyLandAdsPage = () => {
  const [open, setOpen] = useState(false);
  const [landAds] = useState<LandAd[]>([
    {
      id: 1,
      location: "North Valley Farm",
      landArea: "25 acres",
      soilType: "Loamy",
      rentalAmount: "LKR 50,000",
      availablePeriod: "Mar 2026 - Dec 2026",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",
      status: "open",
    },
    {
      id: 2,
      location: "Sunrise Fields",
      landArea: "15 acres",
      soilType: "Clay",
      rentalAmount: "LKR 35,000",
      availablePeriod: "Apr 2026 - Nov 2026",
      image:
        "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=500",
      status: "allocated",
      projectName: "Organic Wheat Cultivation",
    },
    {
      id: 3,
      location: "Green Meadows",
      landArea: "30 acres",
      soilType: "Sandy",
      rentalAmount: "LKR 45,000",
      availablePeriod: "Jan 2026 - Aug 2026",
      image:
        "https://images.unsplash.com/photo-1464226180484-05a7a0c82715?w=500",
      status: "expired",
      projectName: "Rice Cultivation",
    },
  ]);

  const handleEdit = (adId: number) => {
    console.log("Edit ad:", adId);
  };

  const handleCreateNewSeason = (adId: number) => {
    console.log("Start new season from expired ad:", adId);
  };

  const handleViewDetails = (adId: number) => {
    console.log("View details:", adId);
  };

  return (
    <>
      <Box className="container-fluid" sx={{ mb: 4 }}>
        <div className="row align-items-start">
          <div className="col-12 col-lg-8">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              My Land Ads
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage land advertisements with location, soil type,
              and availability details.
            </Typography>
          </div>
          <div className="col-12 col-lg-4 d-flex justify-content-lg-end align-items-center mt-3 mt-lg-0">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{ px: 2.5, py: 1.2, borderRadius: 2, fontWeight: 600 }}
            >
              Create New Land Ad
            </Button>
          </div>
        </div>
      </Box>

      <section>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&::before": {
              content: '""',
              width: 4,
              height: 24,
              background: "linear-gradient(180deg, #6B8E23 0%, #8FA887 100%)",
              borderRadius: 1,
            },
          }}
        >
          Land Advertisement Cards
        </Typography>

        {landAds.length > 0 ? (
          <div className="row g-4">
            {landAds.map((ad) => {
              const isAllocated = ad.status === "allocated";
              const isOpen = ad.status === "open";
              const isExpired = ad.status === "expired";

              return (
                <div key={ad.id} className="col-12 col-md-6 col-lg-4">
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      background:
                        "linear-gradient(145deg, #2a2a2a 0%, #1f1f1f 100%)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      opacity: isAllocated ? 0.72 : 1,
                      "&:hover": isAllocated
                        ? undefined
                        : {
                            transform: "translateY(-8px)",
                            boxShadow:
                              "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(107, 142, 35, 0.1)",
                          },
                    }}
                  >
                    <Box sx={{ position: "relative", height: 160 }}>
                      <CardMedia
                        component="img"
                        image={ad.image}
                        alt={ad.location}
                        sx={{ height: "100%", opacity: 0.7 }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.75) 100%)",
                        }}
                      />
                      <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                        <StatusLabel status={ad.status} />
                      </Box>
                      <Box sx={{ position: "absolute", right: 12, bottom: 12 }}>
                        <Chip
                          label={`${ad.rentalAmount} / season`}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: "rgba(0,0,0,0.65)",
                            color: "#fff",
                          }}
                        />
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ mb: 1.5 }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {ad.location}
                        </Typography>
                        <Chip
                          label={ad.landArea}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.75 }}
                      >
                        Soil Type: {ad.soilType}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        Available Period: {ad.availablePeriod}
                      </Typography>

                      {(isAllocated || isExpired) && ad.projectName && (
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Linked Project
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {ad.projectName}
                          </Typography>
                        </Box>
                      )}

                      {isExpired && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1.5, display: "block" }}
                        >
                          This ad is enabled for viewing and reuse, but editing
                          is not allowed.
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                      {isOpen && (
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Edit />}
                          onClick={() => handleEdit(ad.id)}
                        >
                          Edit Details
                        </Button>
                      )}

                      {isExpired && (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleCreateNewSeason(ad.id)}
                        >
                          Create New Season
                        </Button>
                      )}

                      {isAllocated && (
                        <Button fullWidth variant="outlined" disabled>
                          Allocated (Card Locked)
                        </Button>
                      )}

                      {!isAllocated && (
                        <Button
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(ad.id)}
                        >
                          View
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: 2,
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, opacity: 0.5 }}>
              <Landscape sx={{ fontSize: 40, opacity: 0.5 }} />
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Land Ads Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first land ad to start connecting with investors.
            </Typography>
          </Box>
        )}
      </section>

      <CreateAdPopup open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default MyLandAdsPage;
