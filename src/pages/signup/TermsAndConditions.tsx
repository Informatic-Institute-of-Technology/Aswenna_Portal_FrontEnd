import "@/styles/TermsAndConditions.css";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface TermsAndConditionsProps {
  onNext: () => void;
  onBack: () => void;
}

const TermsAndConditions = ({ onNext, onBack }: TermsAndConditionsProps) => {
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (accepted) {
      onNext();
    }
  };

  return (
    <div className="personal-details-header">
      <button onClick={onBack} className="personal-back-button">
        <ArrowLeft size={80} />
      </button>
      <div className="terms-container">
        <div className="terms-content-wrapper">
          {/* Left Column */}
          <div className="terms-left-column">
            {/* Title */}
            <h1 className="terms-title">
              <span className="terms-title-normal">Terms and </span>
              <span className="terms-title-bold">Conditions</span>
            </h1>

            {/* Intro */}
            <p className="terms-intro">
              By using Aswenna, you agree to comply with and be bound by the
              following terms and conditions. These terms govern the
              relationship between Farmers, Investors, and Landowners within our
              ecosystem. Please read them carefully before proceeding..
            </p>

            {/* Terms Sections */}
            <div className="terms-section">
              <p className="terms-section-title">
                <span className="terms-bold">Acceptance of Terms:</span> By
                creating an account, posting projects, or transferring funds on
                Aswenna, you acknowledge that you have read, understood, and
                agree to be bound by these terms. If you do not agree, you may
                not access the platform
              </p>
            </div>

            <div className="terms-section">
              <p className="terms-section-title">
                <span className="terms-bold">Platform Scope:</span> We provide a
                matchmaking and management platform connecting agricultural
                producers with capital investors and land providers. Aswenna
                acts as a facilitator for these agreements but is not a direct
                party to the cultivation contracts unless explicitly stated.
              </p>
            </div>

            {/* Checkbox */}
            <div className="terms-checkbox-container">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="terms-checkbox"
              />
              <label htmlFor="acceptTerms" className="terms-checkbox-label">
                I agree to the terms and conditions.
              </label>
            </div>

            {/* Enter Button */}
            <button
              onClick={handleContinue}
              disabled={!accepted}
              className="terms-enter-button"
            >
              Enter
            </button>
          </div>

          {/* Right Column */}
          <div className="terms-right-column">
            {/* Progress Indicator */}
            <div className="terms-progress-container">
              <div className="terms-progress-step">
                <span className="terms-progress-label">Step 1</span>
                <div className="terms-progress-circle completed"></div>
              </div>
              <div className="terms-progress-line"></div>
              <div className="terms-progress-step">
                <span className="terms-progress-label">Step 2</span>
                <div className="terms-progress-circle completed"></div>
              </div>
              <div className="terms-progress-line"></div>
              <div className="terms-progress-step">
                <span className="terms-progress-label">Step 3</span>
                <div className="terms-progress-circle "></div>
              </div>
            </div>

            {/* Right Column Content */}
            <div className="terms-right-content">
              <div className="terms-section">
                <p className="terms-right-section-title">User Obligations</p>
                <p className="terms-right-section-content">
                  <span className="terms-bold">
                    Account Creation & Verification
                  </span>{" "}
                  Users must create an account to list projects or view
                  investment offers. You agree to provide accurate, complete,
                  and current information during registration. Verification
                  (KYC) documents may be required for Investors and Landowners
                  before financial transactions can be enabled on the Aswenna
                  platform
                </p>
              </div>

              <div className="terms-section">
                <p className="terms-right-section-content">
                  <span className="terms-bold">Prohibited Activities</span>{" "}
                  Users may not use our site to post fraudulent farming
                  opportunities, non-existent land listings, or misappropriate
                  funds. Transmission of defamatory material, manipulation of
                  matchmaking algorithms, or attempting to bypass the Aswenna
                  escrow system is strictly prohibited.
                </p>
              </div>

              <div className="terms-section">
                <p className="terms-right-section-content">
                  <span className="terms-bold">
                    Payment, Pricing, and Escrow
                  </span>{" "}
                  All investments and lease payments are processed through
                  Aswenna's secure Escrow system. Funds are released to Farmers
                  based on agreed milestones (e.g., Sowing, Harvest). The
                  Platform reserves the right to deduct a service fee from
                  successfully funded projects. Prices and ROI estimates are
                  projections, not guarantees.
                </p>
              </div>

              <div className="terms-section">
                <p className="terms-right-section-content">
                  <span className="terms-bold">Cancellations and Disputes</span>{" "}
                  Due to the nature of agriculture, "Returns" are not
                  applicable. In the event of crop failure or contract disputes,
                  parties agree to first seek resolution through the Aswenna
                  Mediation Center. Refund policies for cancelled funding rounds
                  are governed by the specific Smart Contract associated with
                  that project..
                </p>
              </div>

              <div className="terms-section">
                <p className="terms-right-section-content">
                  <span className="terms-bold">Limitation of Liability</span>{" "}
                  Aswenna is a facilitator. We are not liable for crop failure
                  due to "Force Majeure" events (weather, pests, natural
                  disasters) or financial loss resulting from investment risks.
                  Users enter agreements at their own risk, and due diligence is
                  the responsibility of the Investor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
