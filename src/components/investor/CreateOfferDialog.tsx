import { useAuth } from "@/Context/useAuth";
import {
  createDirectHarvestOffer,
  createSponsorshipOffer,
} from "@/services/offer.service";
import type {
  DirectHarvestOffer,
  SponsorshipOffer,
} from "@/types/investor.types";
import { Dialog } from "@mui/material";
import { useMemo, useState } from "react";
import {
  DirectHarvestDetails,
  type DirectHarvestFormData,
} from "./DirectHarvestDetails";
import { OfferTypeSelection } from "./OfferTypeSelection";
import {
  SponsorshipDetails,
  type SponsorshipFormData,
} from "./SponsorshipDetails";

interface CreateOfferDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    offer: Partial<DirectHarvestOffer> | Partial<SponsorshipOffer>,
  ) => void;
}

type OfferType = "DIRECT_HARVEST" | "SPONSORSHIP" | null;

const CreateOfferDialog = ({
  open,
  onClose,
  onSubmit,
}: CreateOfferDialogProps) => {
  const { user } = useAuth();
  const [selectedOfferType, setSelectedOfferType] = useState<OfferType>(null);
  const [pendingOffer, setPendingOffer] = useState<{
    type: "DIRECT_HARVEST" | "SPONSORSHIP";
    payload: Partial<DirectHarvestOffer> | Partial<SponsorshipOffer>;
    title: string;
    offerTypeName: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const investorName = useMemo(() => {
    if (!user) return "";
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return fullName || user.email || "Investor";
  }, [user]);

  const handleSelectOfferType = (type: "DIRECT_HARVEST" | "SPONSORSHIP") => {
    setSelectedOfferType(type);
  };

  const handleBack = () => {
    setSelectedOfferType(null);
  };

  const handleClose = () => {
    setSelectedOfferType(null);
    onClose();
  };

  const handleDirectHarvestSubmit = (data: DirectHarvestFormData) => {
    const offer: Partial<DirectHarvestOffer> = {
      offerType: "direct-harvest",
      investorName,
      projectTitle: data.projectTitle,
      cropType: data.cropName,
      cropIcon: data.cropType || "🌱",
      backgroundImage: data.coverImage,
      cropVariety: data.variety,
      requiredQuantity: data.quantity,
      quantityUnit: data.unit.toLowerCase() as "kg" | "tons",
      pricePerUnit: 0,
      qualityStandards: undefined,
      deliveryDeadline: "",
      deliveryLocation: data.deliveryDetails,
      totalBudget: 0,
      expectedROI: 0,
      startDate: "",
      endDate: "",
      offerDeadline: "",
      currency: "LKR",
      preferredRegion:
        data.preferredRegions.length > 0 ? data.preferredRegions : undefined,
      companyName: data.companyName,
      description: data.description,
      status: "pending",
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPendingOffer({
      type: "DIRECT_HARVEST",
      payload: offer,
      title: data.projectTitle,
      offerTypeName: "Direct Harvest Offer",
    });
  };

  const handleSponsorshipSubmit = (data: SponsorshipFormData) => {
    const offer: Partial<SponsorshipOffer> = {
      offerType: "sponsorship",
      investorName,
      sponsorshipTitle: data.projectTitle,
      cropTypes: [data.cropType].filter(Boolean),
      cropIcon: data.cropType || "🌱",
      backgroundImage: data.coverImage,
      expectedROI: data.expectedROI,
      startDate: data.startDate,
      endDate: data.endDate,
      offerDeadline: "",
      preferredFarmingMethod:
        data.farmingMethod === "hydroponic"
          ? "organic"
          : data.farmingMethod === "traditional"
            ? "conventional"
            : "mixed",
      minimumInvestment: parseFloat(data.minBudget.replace(/,/g, "")) || 0,
      maximumInvestment: parseFloat(data.maxBudget.replace(/,/g, "")) || 0,
      commissionRate: data.commissionRate,
      currency: "LKR",
      supportType: [
        data.supportType === "financial"
          ? "capital"
          : data.supportType === "technical"
            ? "expertise"
            : "marketing",
      ] as ("capital" | "equipment" | "expertise" | "marketing")[],
      minimumProjectDuration: undefined,
      maximumProjectDuration: undefined,
      preferredRegions:
        data.preferredRegions.length > 0 ? data.preferredRegions : undefined,
      description: data.description,
      status: "pending",
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPendingOffer({
      type: "SPONSORSHIP",
      payload: offer,
      title: data.projectTitle,
      offerTypeName: "Investment Offer",
    });
  };

  const handleConfirmSubmit = async () => {
    if (!pendingOffer) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (pendingOffer.type === "DIRECT_HARVEST") {
        await createDirectHarvestOffer(
          pendingOffer.payload as Partial<DirectHarvestOffer>,
        );
      } else {
        await createSponsorshipOffer(
          pendingOffer.payload as Partial<SponsorshipOffer>,
        );
      }
      onSubmit(pendingOffer.payload);
      setPendingOffer(null);
      handleClose();
    } catch {
      setSubmitError("Failed to create offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (data: DirectHarvestFormData) => {
    console.log("Draft saved:", data);
  };

  const handleSponsorshipSaveDraft = (data: SponsorshipFormData) => {
    console.log("Sponsorship draft saved:", data);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "visible",
            borderRadius: "16px",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          },
        }}
      >
        {!selectedOfferType && (
          <OfferTypeSelection
            onSelectType={handleSelectOfferType}
            onBack={handleClose}
          />
        )}

        {selectedOfferType === "DIRECT_HARVEST" && (
          <DirectHarvestDetails
            onBack={handleBack}
            onSubmit={handleDirectHarvestSubmit}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {selectedOfferType === "SPONSORSHIP" && (
          <SponsorshipDetails
            onBack={handleBack}
            onSubmit={handleSponsorshipSubmit}
            onSaveDraft={handleSponsorshipSaveDraft}
          />
        )}
      </Dialog>

      <Dialog
        open={!!pendingOffer}
        onClose={() =>
          !isSubmitting && (setPendingOffer(null), setSubmitError(null))
        }
        maxWidth={false}
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.65)",
            },
          },
        }}
      >
        <div
          className="font-['Manrope'] rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "#0d0d0d",
            width: 420,
            border: "1px solid rgba(133,164,70,0.15)",
          }}
        >
          <div
            className="px-6 pt-6 pb-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-[10px] text-[#85a446] font-bold uppercase tracking-widest mb-1">
              Ready to Post
            </p>
            <h3 className="text-white text-lg font-bold">Confirm your offer</h3>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#85a446]/15 text-2xl">
                {pendingOffer?.type === "DIRECT_HARVEST" ? "🌾" : "💰"}
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {pendingOffer?.title}
                </p>
                <p className="text-[#85a446] text-[11px] font-semibold mt-0.5">
                  {pendingOffer?.offerTypeName}
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              This offer will be visible to all farmers on the Aswenna platform.
              Make sure all details are correct before posting.
            </p>

            {submitError && (
              <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
                {submitError}
              </p>
            )}
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={() => {
                setPendingOffer(null);
                setSubmitError(null);
              }}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-white/[0.05] hover:bg-white/[0.09] hover:text-slate-200 transition-all disabled:opacity-50"
            >
              Review Again
            </button>
            <button
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-[#85a446] hover:bg-[#93b34e] transition-all shadow-lg shadow-[#85a446]/20 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                "Confirm & Post"
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CreateOfferDialog;
