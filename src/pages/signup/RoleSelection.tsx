import AswendLogo from "@/assets/Aswenna Logo.png";
import "@/styles/RoleSelection.css";
import type { UserRole } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface RoleSelectionProps {
  onNext: (role: UserRole) => void;
  onBack: () => void;
  initialRole?: UserRole;
}

const RoleSelection = ({ onNext, onBack, initialRole }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    initialRole || null,
  );

  const roles = [
    {
      id: "farmer" as UserRole,
      title: "Farmer",
      description:
        "Access the resources you need to grow. Connect with investors and landowners in one place. Lease and manage your agricultural projects effortlessly.",
    },
    {
      id: "investor" as UserRole,
      title: "Investor",
      description:
        "Diversify your portfolio with direct agricultural investments. Browse vetted opportunities from capable farmers, and track project performance transparently.",
    },
    {
      id: "land_owner" as UserRole,
      title: "Land Owner",
      description:
        "Turn your idle assets into income. List your available land and match with verified farmers looking to lease or partner on cultivation projects.",
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      onNext(selectedRole);
    }
  };

  return (
    <div className="role-selection-container">
      {/* Header */}
      <div className="role-selection-header">
        <button onClick={onBack} className="role-back-button">
          <ArrowLeft size={100} />
        </button>
      </div>

      <div className="role-selection-content">
        {/* Title and Progress */}
        <div className="role-title-section">
          <div className="role-title-left">
            <img src={AswendLogo} alt="Aswenna Logo" className="role-logo" />
            <h1 className="role-title">Which one are you?</h1>
          </div>

          {/* Progress Indicator */}
          <div className="role-progress-container">
            <div className="role-progress-step">
              <span className="role-progress-label">Step 1</span>
              <div className="role-progress-circle completed"></div>
            </div>
            <div className="role-progress-line completed"></div>
            <div className="role-progress-step">
              <span className="role-progress-label">Step 2</span>
              <div className="role-progress-circle active"></div>
            </div>
            <div className="role-progress-line"></div>
            <div className="role-progress-step">
              <span className="role-progress-label">Step 3</span>
              <div className="role-progress-circle"></div>
            </div>
          </div>
        </div>

        {/* Role Cards with Shared Background */}
        <div className="role-cards-wrapper">
          <div className="role-overlay"></div>

          <div className="role-cards-container">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`role-card ${
                  selectedRole === role.id ? "selected" : ""
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="role-card-content">
                  <p className="role-card-description">{role.description}</p>
                  <button className="role-card-button">{role.title}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="role-continue-section">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="role-continue-button"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
