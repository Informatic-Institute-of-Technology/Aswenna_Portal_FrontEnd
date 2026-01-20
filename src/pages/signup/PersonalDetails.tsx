import "@/styles/PersonalDetails.css";
import { ArrowLeft } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

export interface PersonalDetailsData {
  fullName: string;
  nationalId: string;
  address: string;
  contactNumber: string;
  experienceLevel: string;
  cropFocus: string;
  preferredRegions: string;
  specificNeeds: string;
}

interface PersonalDetailsProps {
  onNext: (data: PersonalDetailsData) => void;
  onBack: () => void;
  initialData?: PersonalDetailsData;
}

const PersonalDetails = ({
  onNext,
  onBack,
  initialData,
}: PersonalDetailsProps) => {
  const [formData, setFormData] = useState<PersonalDetailsData>(
    initialData || {
      fullName: "",
      nationalId: "",
      address: "",
      contactNumber: "",
      experienceLevel: "",
      cropFocus: "",
      preferredRegions: "",
      specificNeeds: "",
    },
  );
  const [error, setError] = useState("");

  const handleChange = (field: keyof PersonalDetailsData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.fullName || !formData.nationalId || !formData.contactNumber) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.nationalId.length < 9) {
      setError("Please enter a valid National ID");
      return;
    }

    if (formData.contactNumber.length < 10) {
      setError("Please enter a valid contact number");
      return;
    }

    onNext(formData);
  };

  return (
    <div className="personal-details-container">
      {/* Header with Back Button and Progress */}
      <div className="personal-details-header">
        <button onClick={onBack} className="personal-back-button">
          <ArrowLeft size={80} />
        </button>

        {/* Progress Indicator */}
        <div className="role-progress-container">
          <div className="role-progress-step">
            <span className="role-progress-label">Step 1</span>
            <div className="role-progress-circle completed"></div>
          </div>
          <div className="role-progress-line completed"></div>
          <div className="role-progress-step">
            <span className="role-progress-label">Step 2</span>
            <div className="role-progress-circle completed"></div>
          </div>
          <div className="role-progress-line"></div>
          <div className="role-progress-step">
            <span className="role-progress-label">Step 3</span>
            <div className="role-progress-circle active"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="personal-details-content">
        {/* Title */}
        <h1 className="personal-title">
          <span className="personal-title-normal">Personal </span>
          <span className="personal-title-bold">Information</span>
        </h1>

        {error && <div className="personal-error-message">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="personal-form">
          {/* Left Column - Account Details */}
          <div className="personal-form-column">
            <p className="personal-form-subtitle">Enter your account details</p>

            <div className="personal-form-group">
              <label className="personal-form-label">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="personal-form-input"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="personal-form-group">
              <label className="personal-form-label">National ID Number</label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={(e) => handleChange("nationalId", e.target.value)}
                className="personal-form-input"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="personal-form-group">
              <label className="personal-form-label">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="personal-form-input"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="personal-form-group">
              <label className="personal-form-label">Phone Number</label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                className="personal-form-input"
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          {/* Right Column - Professional Details */}
          <div className="personal-form-column">
            <p className="personal-form-subtitle">
              Enter your professional details
            </p>

            <div className="personal-form-group">
              <label className="personal-form-label">Experience Level</label>
              <input
                type="text"
                value={formData.experienceLevel}
                onChange={(e) =>
                  handleChange("experienceLevel", e.target.value)
                }
                className="personal-form-input"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="personal-form-group">
              <label className="personal-form-label">Crop Focus</label>
              <input
                type="text"
                value={formData.cropFocus}
                onChange={(e) => handleChange("cropFocus", e.target.value)}
                className="personal-form-input"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="personal-form-group">
              <label className="personal-form-label">Preffered Regions</label>
              <input
                type="text"
                value={formData.preferredRegions}
                onChange={(e) =>
                  handleChange("preferredRegions", e.target.value)
                }
                className="personal-form-input"
                placeholder="Enter Last Name"
              />
            </div>

            <div className="personal-form-group">
              <label className="personal-form-label">Specific Needs</label>
              <input
                type="text"
                value={formData.specificNeeds}
                onChange={(e) => handleChange("specificNeeds", e.target.value)}
                className="personal-form-input"
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          {/* Enter Button */}
          <div style={{ gridColumn: "1 / 2", marginTop: "1rem" }}>
            <button type="submit" className="personal-enter-button">
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetails;
