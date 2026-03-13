import { useAuth } from "@/Context/useAuth";
import type {
  DirectHarvestOffer,
  InvestorOfferAPI,
  SponsorshipOffer,
} from "@/types/investor.types";
import {
  BarChart,
  Folder,
  HourglassEmpty,
  Settings,
  WarningAmber,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { OfferCardProps } from "../../components/investor";
import {
  CreateOfferButton,
  CreateOfferDialog,
  EditOfferDialog,
  InvestorCreatedOfferCard,
  OfferCard,
  ProjectDetailsDialog,
} from "../../components/investor";
import {
  comprehensiveProjectsData,
  pendingProjectsData,
} from "../../data/json";
import {
  deleteInvestorOffer,
  getInvestorOffers,
} from "../../services/offer.service";
import Notification from "../../shared/components/Notification";
import { useNotification } from "../../shared/hooks/useNotification";

const MyOffersPage = () => {
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<OfferCardProps | null>(null);
  const { notification, showError, showSuccess, hideNotification } = useNotification();
  const [createdOffers, setCreatedOffers] = useState<InvestorOfferAPI[]>([]);
  const [createdOffersLoading, setCreatedOffersLoading] = useState(true);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState<InvestorOfferAPI | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<InvestorOfferAPI | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOffers = () => {
    setCreatedOffersLoading(true);
    getInvestorOffers()
      .then((res) => setCreatedOffers(res.data ?? []))
      .catch(() => setCreatedOffers([]))
      .finally(() => setCreatedOffersLoading(false));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const allProjects = useMemo(() => {
    const projects = comprehensiveProjectsData as (OfferCardProps & {
      investorId?: string;
    })[];
    return projects.filter((p) => p.investorId === user?._id);
  }, [user?._id]);

  const activeProjects = useMemo(
    () => allProjects.filter((p) => p.status === "active"),
    [allProjects],
  );

  const pastProjects = useMemo(
    () => allProjects.filter((p) => p.status === "completed"),
    [allProjects],
  );

  const pendingProjects = useMemo(() => {
    const projects = pendingProjectsData as (OfferCardProps & {
      investorId?: string;
    })[];
    return projects.filter((p) => p.investorId === user?._id);
  }, [user?._id]);

  const handleCreateOffer = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleOfferSubmit = (
    offerData: Partial<DirectHarvestOffer> | Partial<SponsorshipOffer>,
  ) => {
    try {
      console.log("New offer created:", offerData);
      showSuccess("Offer created successfully! Farmers will be notified.");
      setCreateDialogOpen(false);
      fetchOffers();
    } catch {
      showError("Failed to create offer. Please try again.");
    }
  };

  const handleViewDetails = (id: string) => {
    const project = [
      ...activeProjects,
      ...pendingProjects,
      ...pastProjects,
    ].find((p) => p.id === id);
    if (project) {
      setSelectedProject(project);
      setDetailsDialogOpen(true);
    }
  };
  const handleEditOffer = (id: string) => {
    const offer = createdOffers.find((o) => o._id === id);
    if (offer) {
      setOfferToEdit(offer);
      setEditDialogOpen(true);
    }
  };

  const handleEditSuccess = () => {
    showSuccess("Offer updated successfully!");
    fetchOffers();
  };
  const handleDeleteOffer = (id: string) => {
    const offer = createdOffers.find((o) => o._id === id);
    if (offer) {
      setOfferToDelete(offer);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!offerToDelete) return;
    setIsDeleting(true);
    try {
      await deleteInvestorOffer(offerToDelete._id);
      showSuccess("Offer deleted successfully.");
      setDeleteDialogOpen(false);
      setOfferToDelete(null);
      fetchOffers();
    } catch {
      showError("Failed to delete offer. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setOfferToDelete(null);
    }
  };

  return (
    <>
      <Box className="container-fluid" sx={{ mb: 4 }}>
        <div className="row align-items-start">
          <div className="col-12 col-lg-8">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              My Offers
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create Investment Offers including crop interest, budget, and
              profit-sharing models.
            </Typography>
          </div>
          <div className="col-12 col-lg-4 d-flex justify-content-lg-end align-items-center gap-2 mt-3 mt-lg-0">
            <CreateOfferButton onClick={handleCreateOffer} />
            <Tooltip title="Settings">
              <IconButton
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Box>

      {/* Active Projects Section */}
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
                <OfferCard {...project} onViewDetails={handleViewDetails} />
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
              Create your first investment offer to get started!
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
              background: "linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)",
              borderRadius: 1,
            },
          }}
        >
          My Created Offers
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 400, ml: 1 }}
          >
            (Awaiting Farmer Responses)
          </Typography>
        </Typography>

        {createdOffersLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={36} />
          </Box>
        ) : createdOffers.length > 0 ? (
          <div className="row g-4">
            {createdOffers.map((offer) => (
              <div key={offer._id} className="col-12 col-md-6 col-lg-4">
                <InvestorCreatedOfferCard
                  offer={offer}
                  onEdit={handleEditOffer}
                  onDelete={handleDeleteOffer}
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
            <HourglassEmpty sx={{ fontSize: 40, opacity: 0.4, mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Pending Offers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Offers you create will appear here until a farmer accepts them.
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
                <OfferCard {...project} onViewDetails={handleViewDetails} />
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

      <CreateOfferDialog
        open={createDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleOfferSubmit}
      />

      <EditOfferDialog
        open={editDialogOpen}
        offer={offerToEdit}
        onClose={() => {
          setEditDialogOpen(false);
          setOfferToEdit(null);
        }}
        onSuccess={handleEditSuccess}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "var(--surface-card, #1a1a1a)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
          <WarningAmber sx={{ color: "error.main", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Delete Offer
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this offer? This action{" "}
            <strong>cannot be undone</strong> and the offer will be permanently
            removed from the platform.
          </Typography>
          {offerToDelete && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                background: "rgba(211,47,47,0.08)",
                border: "1px solid rgba(211,47,47,0.25)",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {offerToDelete.offerType === "direct-harvest"
                  ? (offerToDelete as { harvestBaseDetails?: { projectTitle?: string } })
                    .harvestBaseDetails?.projectTitle ?? "Harvest Offer"
                  : (offerToDelete as { commissionDetails?: { sponsorshipTitle?: string } })
                    .commissionDetails?.sponsorshipTitle ?? "Sponsorship Offer"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "error.main", fontWeight: 600, textTransform: "capitalize" }}
              >
                {offerToDelete.offerType}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            disabled={isDeleting}
            variant="outlined"
            sx={{ flex: 1, borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            variant="contained"
            color="error"
            sx={{ flex: 1, borderRadius: 2, fontWeight: 700 }}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        duration={5000}
        onClose={hideNotification}
      />

      <ProjectDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        project={selectedProject}
      />
    </>
  );
};

export default MyOffersPage;
