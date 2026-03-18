import {
  CreateAdPopup,
  type LandOfferDraft,
  type LandownerOfferPrefill,
} from "@/components/landowner";
import { useAuth } from "@/Context/useAuth";
import { Add, BarChart, Folder, Landscape } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import type { OfferCardProps } from "../../components/investor";
import { OfferCard, ProjectDetailsDialog } from "../../components/investor";
import {
  comprehensiveProjectsData,
  pendingProjectsData,
} from "../../data/json";

const MyLandAdsPage = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [createdLandAds, setCreatedLandAds] = useState<OfferCardProps[]>([]);
  const [selectedProject, setSelectedProject] = useState<OfferCardProps | null>(
    null,
  );

  const scopedLandownerId = (user?._id || "").toLowerCase();

  const allRelatedProjects = useMemo(() => {
    const projects = comprehensiveProjectsData as (OfferCardProps & {
      landownerId?: string;
    })[];

    return projects.filter((project) => {
      const normalizedLandownerId = (project.landownerId || "").toLowerCase();
      return normalizedLandownerId === scopedLandownerId;
    });
  }, [scopedLandownerId]);

  const pendingLandAds = useMemo(() => {
    const projects = pendingProjectsData as (OfferCardProps & {
      landownerId?: string;
    })[];

    const filteredServerPending = projects.filter((project) => {
      const normalizedLandownerId = (project.landownerId || "").toLowerCase();

      return normalizedLandownerId === scopedLandownerId;
    });

    return [...createdLandAds, ...filteredServerPending];
  }, [createdLandAds, scopedLandownerId]);

  const allProjects = useMemo(() => {
    return allRelatedProjects;
  }, [allRelatedProjects]);

  const landownerPrefillData = useMemo<
    LandownerOfferPrefill | undefined
  >(() => {
    if (!scopedLandownerId) return undefined;

    const projects = allRelatedProjects;
    const referenceProject = projects[0];

    const landownerPartyMember =
      projects
        .flatMap((project) => project.partyMembers || [])
        .find((member) => member.role === "landowner") || null;

    const landImages = Array.from(
      new Set(
        projects
          .map((project) => project.backgroundImage)
          .filter((image): image is string => Boolean(image)),
      ),
    );

    const rentalAmounts = projects.flatMap((project) =>
      (project.landRentals || []).map((rental) => rental.amount),
    );
    const suggestedMonthlyRental =
      rentalAmounts.length > 0
        ? Math.round(
            rentalAmounts.reduce((sum, amount) => sum + amount, 0) /
              rentalAmounts.length,
          )
        : undefined;

    const suggestedLandArea =
      projects.flatMap((project) => project.landRentals || [])[0]?.landArea ||
      "";

    return {
      landownerId: scopedLandownerId,
      landownerName:
        landownerPartyMember?.name ||
        referenceProject?.landownerName ||
        user?.fullName ||
        "Landowner",
      landownerImage: landownerPartyMember?.image,
      location:
        landownerPartyMember?.location?.split(",")[0] ||
        referenceProject?.location,
      district: referenceProject?.district,
      province: referenceProject?.province,
      coordinates:
        landownerPartyMember?.coordinates || referenceProject?.coordinates,
      specialization: landownerPartyMember?.specialization,
      rating: landownerPartyMember?.rating,
      suggestedMonthlyRental,
      suggestedLandArea,
      landImages,
    };
  }, [allRelatedProjects, scopedLandownerId, user?.fullName]);

  const activeProjects = useMemo(
    () => allProjects.filter((project) => project.status === "active"),
    [allProjects],
  );

  const pastProjects = useMemo(
    () => allProjects.filter((project) => project.status === "completed"),
    [allProjects],
  );

  const handleViewDetails = (id: string) => {
    const project = [
      ...pendingLandAds,
      ...activeProjects,
      ...pastProjects,
    ].find((item) => item.id === id);

    if (project) {
      setSelectedProject(project);
      setDetailsDialogOpen(true);
    }
  };

  const handleCreateLandOffer = (offer: LandOfferDraft) => {
    const uniqueId = `land-ad-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];
    const startDate = offer.availableFrom || today;

    const newPendingProject: OfferCardProps = {
      id: uniqueId,
      projectId: `LAND-${Date.now().toString().slice(-6)}`,
      projectName: offer.title,
      cropType: "Land Rental",
      cropIcon: offer.landIcon || "🏞️",
      farmerName: "Awaiting Match",
      farmerImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      location: offer.location || `${offer.district}, ${offer.province}`,
      district: offer.district,
      province: offer.province,
      coordinates: offer.coordinates,
      expectedROI: 0,
      status: "pending",
      startDate,
      endDate: offer.availableTo || undefined,
      backgroundImage: offer.coverImage,
      landownerName: offer.landownerName,
      landownerId: offer.landownerId,
      investmentType: "harvest",
      riskLevel: "LOW",
      riskStatus: "Awaiting investor applications",
      milestones: [
        {
          id: `${uniqueId}-M1`,
          title: "Land Offer Published",
          description:
            "Land offer is published and awaiting investor or farmer interest.",
          progress: 0,
          status: "pending",
          startDate,
          endDate: offer.availableTo || startDate,
          payment: offer.monthlyRental,
          tasks: {
            total: 1,
            completed: 0,
          },
        },
      ],
      payments: [
        {
          id: `${uniqueId}-P1`,
          milestoneId: `${uniqueId}-M1`,
          amount: offer.monthlyRental,
          dueDate: startDate,
          status: "pending",
          description: "Monthly land rental",
        },
      ],
      landRentals: [
        {
          id: `${uniqueId}-R1`,
          landArea: offer.landArea || "N/A",
          month: new Date(startDate).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          dueDate: startDate,
          amount: offer.monthlyRental,
          status: "pending",
        },
      ],
      financialBreakdown: [
        {
          category: "Monthly Land Rental",
          amount: offer.monthlyRental,
          type: "expense",
        },
      ],
      partyMembers: [
        {
          id: offer.landownerId || scopedLandownerId,
          name: offer.landownerName || user?.fullName || "Landowner",
          role: "landowner",
          email: user?.email || "not-provided@aswenna.lk",
          phone: user?.phoneNumber || "N/A",
          image: offer.landownerImage || "",
          location:
            offer.location ||
            `${offer.district || ""}, ${offer.province || ""}`,
          coordinates: offer.coordinates,
          specialization: offer.landownerSpecialization,
          rating: offer.landownerRating,
        },
      ],
    };

    setCreatedLandAds((prev) => [newPendingProject, ...prev]);
    setOpen(false);
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
              Create New Land Offer
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
              background:
                "linear-gradient(180deg, var(--color-olive) 0%, var(--color-olive-light) 100%)",
              borderRadius: 1,
            },
          }}
        >
          Pending Land Ads
        </Typography>

        {pendingLandAds.length > 0 ? (
          <div className="row g-4">
            {pendingLandAds.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <OfferCard
                  {...project}
                  viewMode="landowner"
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              background: "var(--surface-tint)",
              borderRadius: 2,
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, opacity: 0.5 }}>
              <Landscape sx={{ fontSize: 40, opacity: 0.5 }} />
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Pending Land Ads
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first land ad to start connecting with investors.
            </Typography>
          </Box>
        )}
      </section>

      <hr
        style={{
          margin: "3rem 0",
          border: "none",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--border-medium), transparent)",
        }}
      />

      <section className="mb-5">
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
              background:
                "linear-gradient(180deg, var(--color-olive) 0%, var(--color-olive-light) 100%)",
              borderRadius: 1,
            },
          }}
        >
          Active Projects
        </Typography>

        {activeProjects.length > 0 ? (
          <div className="row g-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <OfferCard
                  {...project}
                  viewMode="landowner"
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              background: "var(--surface-tint)",
              borderRadius: 2,
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, opacity: 0.5 }}>
              <BarChart sx={{ fontSize: 40, opacity: 0.5 }} />
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Active Projects
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active projects linked to your land ads will appear here.
            </Typography>
          </Box>
        )}
      </section>

      <hr
        style={{
          margin: "3rem 0",
          border: "none",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--border-medium), transparent)",
        }}
      />

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
              background:
                "linear-gradient(180deg, var(--color-olive) 0%, var(--color-olive-light) 100%)",
              borderRadius: 1,
            },
          }}
        >
          Past Projects
        </Typography>

        {pastProjects.length > 0 ? (
          <div className="row g-4">
            {pastProjects.map((project) => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <OfferCard
                  {...project}
                  viewMode="landowner"
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              p: 6,
              background: "var(--surface-tint)",
              borderRadius: 2,
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, opacity: 0.5 }}>
              <Folder sx={{ fontSize: 40, opacity: 0.5 }} />
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Past Projects
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your completed projects will appear here.
            </Typography>
          </Box>
        )}
      </section>

      <ProjectDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        project={selectedProject}
        viewMode="landowner"
      />

      <CreateAdPopup
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateLandOffer}
        prefillData={landownerPrefillData}
      />
    </>
  );
};

export default MyLandAdsPage;
