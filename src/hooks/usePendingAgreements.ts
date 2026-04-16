import { useEffect, useState } from "react";
import type { AgreementCardData } from "../components/investor/requests/AgreementCard";
import { getInvestorOffers } from "../services/offer.service";
import type { InvestorOfferAPI } from "../types/investor.types";

export type { AgreementCardData };

const getProgress = (partyType: "farmer" | "landowner") => {
  if (partyType === "farmer") {
    return { percent: 75, label: "Agreement Stage: Awaiting Farmer Signature" };
  }
  return { percent: 85, label: "Agreement Stage: Under Legal Review" };
};

const getAgreementStatus = (
  offer: InvestorOfferAPI,
  partyType: "farmer" | "landowner",
): AgreementCardData["agreementStatus"] => {
  if (partyType === "landowner") return "under-review";

  if (!offer.farmer && !offer.farmerId) return "awaiting-signature";
  return "awaiting-signature";
};

const formatDate = (iso: string, prefix?: string): string => {
  const date = new Date(iso);
  const label = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return prefix ? `${prefix}: ${label}` : label;
};

const computeMilestoneSnapshot = (progressPercent: number) => {
  const totalMilestones = 8;
  const completedMilestones = Math.min(
    totalMilestones,
    Math.max(0, Math.round((progressPercent / 100) * totalMilestones)),
  );
  const pendingMilestones = Math.max(totalMilestones - completedMilestones, 0);
  return { totalMilestones, completedMilestones, pendingMilestones };
};

const transformOfferToAgreementCards = (
  offer: InvestorOfferAPI,
  onUploadAgreement: (card?: AgreementCardData) => void,
  onViewDetails: (id: string) => void,
): AgreementCardData[] => {
  const rows: AgreementCardData[] = [];
  const projectId = offer._id;

  const cropType =
    offer.offerType === "direct-harvest"
      ? offer.harvestBaseDetails?.cropType || "Crop"
      : offer.commissionDetails?.cropTypes?.[0] || "Crop";

  const projectTitle =
    offer.offerType === "direct-harvest"
      ? offer.harvestBaseDetails?.projectTitle || "Harvest Project"
      : offer.commissionDetails?.sponsorshipTitle || "Sponsorship Project";

  const totalBudget =
    offer.offerType === "direct-harvest"
      ? offer.harvestBaseDetails?.totalBudget
      : offer.commissionDetails?.maximumInvestment;

  const location =
    offer.offerType === "direct-harvest"
      ? offer.harvestBaseDetails?.preferredRegion?.[0] ||
        offer.harvestBaseDetails?.deliveryLocation ||
        "Sri Lanka"
      : offer.commissionDetails?.preferredRegions?.[0] || "Sri Lanka";

  const submittedAt = formatDate(offer.createdAt, "Submitted");
  const expiresAt = formatDate(offer.expiredDate);
  const startDate = formatDate(offer.createdAt, "Started");
  const expectedCompletionDate = formatDate(offer.expiredDate);
  const investorName = offer.investor?.fullName || "Current Investor";
  const farmerPartyName =
    offer.farmer?.fullName || offer.farmerName || "Not Assigned";
  const landownerPartyName =
    offer.landowner?.fullName || offer.landOwnerName || "Not Assigned";

  if (offer.farmer || offer.farmerName || offer.farmerId) {
    const farmerName = offer.farmer?.fullName || offer.farmerName || "Farmer";
    const farmerInitials = farmerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const progress = getProgress("farmer");
    const milestone = computeMilestoneSnapshot(progress.percent);
    const disbursedAmount = totalBudget
      ? Math.round(totalBudget * (progress.percent / 100))
      : 0;
    const remainingBalance = totalBudget
      ? Math.max(totalBudget - disbursedAmount, 0)
      : 0;

    rows.push({
      id: `${projectId}-FARMER`,
      projectId,
      investorId: offer.investor?._id,
      counterpartyId: offer.farmer?._id || offer.farmerId,
      investorEmail: offer.investor?.email,
      counterpartyEmail: offer.farmer?.email,
      partyType: "farmer",
      investorName,
      farmerPartyName,
      landownerPartyName,
      partyName: farmerName,
      partyAvatar: null,
      partyInitials: farmerInitials,
      partyRole: "Cultivation Farmer",
      isVerified: false,
      projectTitle,
      cropType,
      location,
      offerType: offer.offerType,
      totalBudget,
      currency: offer.currency || "LKR",
      expectedROI: offer.expectedROI,
      expiresAt,
      submittedAt,
      startDate,
      expectedCompletionDate,
      milestoneBreakdown: offer.milestoneBreakdown,
      agreementStatus: getAgreementStatus(offer, "farmer"),
      progressPercent: progress.percent,
      progressLabel: progress.label,
      totalMilestones: milestone.totalMilestones,
      completedMilestones: milestone.completedMilestones,
      pendingMilestones: milestone.pendingMilestones,
      disbursedAmount,
      remainingBalance,
      highlighted: true,
      onUploadAgreement: () => onUploadAgreement(rows[rows.length - 1]),
      onViewDetails: () => onViewDetails(`${projectId}-FARMER`),
    });
  }

  if (offer.landOwnerName || offer.landOwnerId || offer.landownerProject) {
    const landownerName =
      offer.landowner?.fullName || offer.landOwnerName || "Landowner";
    const landownerInitials = landownerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const landLocation =
      offer.landownerProject?.name || offer.landownerProject?.title || location;

    const progress = getProgress("landowner");
    const milestone = computeMilestoneSnapshot(progress.percent);
    const disbursedAmount = totalBudget
      ? Math.round(totalBudget * (progress.percent / 100))
      : 0;
    const remainingBalance = totalBudget
      ? Math.max(totalBudget - disbursedAmount, 0)
      : 0;

    rows.push({
      id: `${projectId}-LANDOWNER`,
      projectId,
      investorId: offer.investor?._id,
      counterpartyId:
        offer.landowner && typeof offer.landowner !== "string"
          ? offer.landowner._id
          : offer.landOwnerId,
      landownerProjectId: offer.landownerProject?._id,
      investorEmail: offer.investor?.email,
      counterpartyEmail:
        offer.landowner && typeof offer.landowner !== "string"
          ? offer.landowner.email
          : undefined,
      counterpartyPhone:
        offer.landowner && typeof offer.landowner !== "string"
          ? offer.landowner.phoneNumber
          : undefined,
      partyType: "landowner",
      investorName,
      farmerPartyName,
      landownerPartyName,
      partyName: landownerName,
      partyAvatar: null,
      partyInitials: landownerInitials,
      partyRole: "Land Owner",
      isVerified: true,
      projectTitle,
      cropType,
      location: landLocation,
      offerType: offer.offerType,
      totalBudget,
      currency: offer.currency || "LKR",
      expectedROI: offer.expectedROI,
      expiresAt,
      submittedAt,
      startDate,
      expectedCompletionDate,
      milestoneBreakdown: offer.milestoneBreakdown,
      agreementStatus: getAgreementStatus(offer, "landowner"),
      progressPercent: progress.percent,
      progressLabel: progress.label,
      totalMilestones: milestone.totalMilestones,
      completedMilestones: milestone.completedMilestones,
      pendingMilestones: milestone.pendingMilestones,
      disbursedAmount,
      remainingBalance,
      highlighted: true,
      onUploadAgreement: () => onUploadAgreement(rows[rows.length - 1]),
      onViewDetails: () => onViewDetails(`${projectId}-LANDOWNER`),
    });
  }

  return rows;
};

export const usePendingAgreements = (
  onUploadAgreement: (card?: AgreementCardData) => void,
  onSelectAgreement: (id: string) => void,
) => {
  const [agreements, setAgreements] = useState<AgreementCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingOffers = async () => {
      try {
        setIsLoading(true);
        const response = await getInvestorOffers({ status: "pending" });

        if (response && response.data) {
          const transformed = response.data.flatMap((offer) =>
            transformOfferToAgreementCards(
              offer,
              onUploadAgreement,
              onSelectAgreement,
            ),
          );
          setAgreements(transformed);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching pending offers:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch pending offers",
        );
        setAgreements([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingOffers();

  }, []);

  return { agreements, isLoading, error };
};
