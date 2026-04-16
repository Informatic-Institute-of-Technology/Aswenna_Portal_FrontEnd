import {
  generateCultivationEscrowAgreementPDF,
  generateLandLeaseAgreementPDF,
  type AgreementDetails,
} from "../../../utils/agreementGenerator";

interface Step {
  title: string;
  description: string;
  timestamp?: string;
  status: "completed" | "active" | "pending";
  icon?: string;
  uploadArea?: {
    text: string;
    onUpload: () => void;
  };
}

interface ConnectionJourneyProps {
  requestId: string;
  farmerName: string;
  steps: Step[];
  agreementType?: "Investor-Farmer" | "Investor-Landowner";
  agreementDetails?: Partial<AgreementDetails>;
}

const ConnectionJourney = ({
  farmerName,
  steps,
  agreementType,
  agreementDetails,
}: ConnectionJourneyProps) => {

  const handleGeneratePDF = () => {
    const base: AgreementDetails = {
      agreementType: agreementType ?? "Investor-Farmer",
      investorName: agreementDetails?.investorName ?? "[Investor Name]",
      investorNIC: agreementDetails?.investorNIC,
      investorContact: agreementDetails?.investorContact,
      counterpartyName: agreementDetails?.counterpartyName ?? farmerName,
      counterpartyNIC: agreementDetails?.counterpartyNIC,
      counterpartyContact: agreementDetails?.counterpartyContact,
      projectRefId: agreementDetails?.projectRefId,
      targetCrop: agreementDetails?.targetCrop,
      propertyLocation: agreementDetails?.propertyLocation,
      acreage: agreementDetails?.acreage,
      designatedCultivator: agreementDetails?.designatedCultivator,
      leaseDurationMonths: agreementDetails?.leaseDurationMonths,
      leaseStartDate: agreementDetails?.leaseStartDate,
      leaseEndDate: agreementDetails?.leaseEndDate,
      grossMonthlyRental: agreementDetails?.grossMonthlyRental,
      estimatedStartDate: agreementDetails?.estimatedStartDate,
      estimatedEndDate: agreementDetails?.estimatedEndDate,
      totalGrossInvestment: agreementDetails?.totalGrossInvestment,
      milestones: agreementDetails?.milestones,
    };
    if (base.agreementType === "Investor-Landowner") {
      generateLandLeaseAgreementPDF(base);
    } else {
      generateCultivationEscrowAgreementPDF(base);
    }
  };

  return (
    <div style={{ background: "transparent" }} className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Connection Journey
        </h3>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <span className="material-icons-outlined">info</span>
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Tracking connection with{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {farmerName}
        </span>
      </p>
      <div className="relative pl-2">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div
              key={index}
              className={`step-item relative flex gap-4 ${!isLast ? "pb-8" : ""}`}
            >
              {!isLast && (
                <div className="absolute left-4 top-8 bottom-0 w-[2px] -ml-[1px] bg-white/10"></div>
              )}

              <div
                style={
                  step.status === "completed" && step.icon === "close"
                    ? {
                        background: "#f87171",
                        border: "2px solid rgba(248,113,113,0.3)",
                      }
                    : step.status === "completed"
                      ? {
                          background: "#85a446",
                          border: "2px solid rgba(74,222,128,0.3)",
                        }
                      : step.status === "active"
                        ? {
                            background: "#fbbf24",
                            border: "2px solid rgba(251,191,36,0.3)",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border: "2px solid rgba(255,255,255,0.1)",
                          }
                }
                className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow ${
                  step.status === "active" ? "animate-pulse" : ""
                }`}
              >
                {step.status === "completed" &&
                  (!step.icon || step.icon === "check") && (
                    <span className="material-icons text-white text-sm">
                      check
                    </span>
                  )}
                {step.status === "completed" && step.icon === "visibility" && (
                  <span className="material-icons text-white text-sm">
                    visibility
                  </span>
                )}
                {step.status === "completed" && step.icon === "close" && (
                  <span className="material-icons text-white text-sm">
                    close
                  </span>
                )}
                {step.status === "active" && step.icon && (
                  <span className="material-icons text-black text-sm">
                    {step.icon}
                  </span>
                )}
                {step.status === "pending" && step.icon && (
                  <span className="text-gray-500 text-xs font-bold">
                    {step.icon}
                  </span>
                )}
              </div>

              <div className={step.uploadArea ? "flex-1" : ""}>
                <h4
                  className={`text-sm font-semibold ${
                    step.status === "pending"
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-xs mt-0.5 ${
                    step.status === "pending"
                      ? "text-gray-400 dark:text-gray-600"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
                {step.timestamp && (
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {step.timestamp}
                  </span>
                )}
                {step.status === "active" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 mt-1">
                    In Progress
                  </span>
                )}

                
                {step.status === "active" && agreementType && (
                  <button
                    onClick={handleGeneratePDF}
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "7px 14px",
                      borderRadius: "8px",
                      border: "1.5px solid rgba(174,217,92,0.6)",
                      background: "linear-gradient(135deg, rgba(133,164,70,0.18) 0%, rgba(174,217,92,0.1) 100%)",
                      color: "#aed95c",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      letterSpacing: "0.3px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, rgba(133,164,70,0.35) 0%, rgba(174,217,92,0.22) 100%)";
                      e.currentTarget.style.borderColor = "#aed95c";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, rgba(133,164,70,0.18) 0%, rgba(174,217,92,0.1) 100%)";
                      e.currentTarget.style.borderColor = "rgba(174,217,92,0.6)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: 14 }}>
                      description
                    </span>
                    Generate Agreement PDF
                  </button>
                )}

                {step.uploadArea && (
                  <div
                    style={{
                      background: "var(--bg-subtle)",
                      border: "2px dashed var(--color-olive-glow)",
                      transition: "all 0.3s ease",
                      marginTop: step.status === "active" && agreementType ? "8px" : "12px",
                    }}
                    className="p-3 rounded-lg text-center cursor-pointer"
                    onClick={step.uploadArea.onUpload}
                  >
                    <span className="material-icons text-gray-400 text-2xl mb-1">
                      cloud_upload
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {step.uploadArea.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionJourney;
