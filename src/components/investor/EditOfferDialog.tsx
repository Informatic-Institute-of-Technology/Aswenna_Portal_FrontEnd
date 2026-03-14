import {
    updateDirectHarvestOffer,
    updateSponsorshipOffer,
} from "@/services/offer.service";
import type {
    DirectHarvestOffer,
    DirectHarvestOfferAPI,
    InvestorOfferAPI,
    SponsorshipOffer,
    SponsorshipOfferAPI,
} from "@/types/investor.types";
import { Dialog } from "@mui/material";
import { useState } from "react";
import {
    DirectHarvestDetails,
    type DirectHarvestFormData,
} from "./DirectHarvestDetails";
import {
    SponsorshipDetails,
    type SponsorshipFormData,
} from "./SponsorshipDetails";

interface EditOfferDialogProps {
    open: boolean;
    offer: InvestorOfferAPI | null;
    onClose: () => void;
    onSuccess: () => void;
}


const toHarvestFormData = (offer: DirectHarvestOfferAPI): Partial<DirectHarvestFormData> => {
    const hd = offer.harvestBaseDetails;
    return {
        projectTitle: hd.projectTitle,
        description: offer.description,
        companyName: hd.companyName ?? "",
        preferredRegions: hd.preferredRegion ?? [],
        cropType: offer.cropIcon,
        coverImage: offer.backgroundImage,
        cropName: hd.cropType,
        variety: hd.cropVariety ?? "",
        quantity: hd.requiredQuantity,
        unit: (hd.quantityUnit?.charAt(0).toUpperCase() +
            hd.quantityUnit?.slice(1)) as "Tons" | "Kilograms" | "Bushels",
        deliveryDetails: hd.deliveryLocation,
        expiryDate: offer.expiredDate?.split("T")[0] ?? "",
    };
};

const toSponsorshipFormData = (offer: SponsorshipOfferAPI): Partial<SponsorshipFormData> => {
    const cd = offer.commissionDetails;
    const farmingMethodMap: Record<string, "hydroponic" | "traditional" | "aquaponics"> = {
        organic: "hydroponic",
        conventional: "traditional",
        mixed: "aquaponics",
    };
    return {
        projectTitle: cd.sponsorshipTitle,
        description: offer.description,
        preferredRegions: cd.preferredRegions ?? [],
        cropName: (cd.cropTypes ?? [])[0] ?? "",
        cropIcon: offer.cropIcon,
        coverImage: offer.backgroundImage,
        expectedROI: offer.expectedROI,
        expiryDate: offer.expiredDate?.split("T")[0] ?? "",
        minBudget: String(cd.minimumInvestment ?? 0),
        maxBudget: String(cd.maximumInvestment ?? 0),
        farmingMethod: farmingMethodMap[cd.preferredFarmingMethod ?? "conventional"] ?? "traditional",
        commissionRate: cd.commissionRate,
        supportType:
            (cd.supportType?.[0] === "capital"
                ? "financial"
                : cd.supportType?.[0] === "expertise"
                    ? "technical"
                    : "supply") as "financial" | "technical" | "supply",
    };
};

const EditOfferDialog = ({ open, offer, onClose, onSuccess }: EditOfferDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    if (!offer) return null;

    const isHarvest = offer.offerType === "direct-harvest";

    const handleHarvestSubmit = async (data: DirectHarvestFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        const payload: Partial<DirectHarvestOffer> = {
            offerType: "direct-harvest",
            projectTitle: data.projectTitle,
            description: data.description,
            cropIcon: data.cropType,
            backgroundImage: data.coverImage,
            cropType: data.cropName,
            cropVariety: data.variety,
            requiredQuantity: data.quantity,
            quantityUnit: data.unit.toLowerCase() as "kg" | "tons",
            deliveryLocation: data.deliveryDetails,
            companyName: data.companyName,
            preferredRegion: data.preferredRegions.length > 0 ? data.preferredRegions : undefined,
            expiredDate: data.expiryDate,
            status: offer.status,
        };
        try {
            await updateDirectHarvestOffer(offer._id, payload);
            onSuccess();
            onClose();
        } catch {
            setIsSubmitting(false);
            setSubmitError("Failed to update offer. Please try again.");
        }
    };

    const handleSponsorshipSubmit = async (data: SponsorshipFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        const payload: Partial<SponsorshipOffer> = {
            offerType: "sponsorship",
            sponsorshipTitle: data.projectTitle,
            description: data.description,
            cropTypes: [data.cropName].filter(Boolean),
            cropIcon: data.cropIcon,
            backgroundImage: data.coverImage,
            expectedROI: data.expectedROI,
            currency: "LKR",
            preferredFarmingMethod:
                data.farmingMethod === "hydroponic"
                    ? "organic"
                    : data.farmingMethod === "traditional"
                        ? "conventional"
                        : "mixed",
            minimumInvestment: parseFloat(data.minBudget.replace(/,/g, "")) || 0,
            maximumInvestment: parseFloat(data.maxBudget.replace(/,/g, "")) || 0,
            commissionRate: data.commissionRate,
            supportType: [
                data.supportType === "financial"
                    ? "capital"
                    : data.supportType === "technical"
                        ? "expertise"
                        : "marketing",
            ] as ("capital" | "equipment" | "expertise" | "marketing")[],
            preferredRegions: data.preferredRegions.length > 0 ? data.preferredRegions : undefined,
            expiredDate: data.expiryDate,
            status: offer.status,
        };
        try {
            await updateSponsorshipOffer(offer._id, payload);
            onSuccess();
            onClose();
        } catch {
            setIsSubmitting(false);
            setSubmitError("Failed to update offer. Please try again.");
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={() => !isSubmitting && onClose()}
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
                {isHarvest ? (
                    <DirectHarvestDetails
                        onBack={onClose}
                        onSubmit={handleHarvestSubmit}
                        onSaveDraft={() => { }}
                        initialData={toHarvestFormData(offer as DirectHarvestOfferAPI)}
                        submitLabel={isSubmitting ? "Saving…" : "Save Changes"}
                        headerLabel="Edit Offer"
                    />
                ) : (
                    <SponsorshipDetails
                        onBack={onClose}
                        onSubmit={handleSponsorshipSubmit}
                        onSaveDraft={() => { }}
                        initialData={toSponsorshipFormData(offer as SponsorshipOfferAPI)}
                        submitLabel={isSubmitting ? "Saving…" : "Save Changes"}
                        headerLabel="Edit Offer"
                    />
                )}
            </Dialog>

            {submitError && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 24,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#b71c1c",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        zIndex: 9999,
                        boxShadow: "0 4px 16px rgba(183,28,28,0.4)",
                    }}
                >
                    {submitError}
                </div>
            )}
        </>
    );
};

export default EditOfferDialog;
