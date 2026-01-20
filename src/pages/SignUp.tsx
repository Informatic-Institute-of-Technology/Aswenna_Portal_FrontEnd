import { useState } from "react";
import type { UserRole } from "@/types/index";
import SignUpInitial from "./signup/SignUpInitial";
import RoleSelection from "./signup/RoleSelection";
import PersonalDetails, {
  type PersonalDetailsData,
} from "./signup/PersonalDetails";
import TermsAndConditions from "./signup/TermsAndConditions";
import RegistrationComplete from "./signup/RegistrationComplete";
import { useAuth } from "@/Context/useAuth";

type SignUpStep = "initial" | "role" | "details" | "terms" | "complete";

interface SignUpData {
  email: string;
  password: string;
  role?: UserRole;
  personalDetails?: PersonalDetailsData;
}

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>("initial");
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleInitialNext = (data: { email: string; password: string }) => {
    setSignUpData((prev) => ({ ...prev, ...data }));
    setCurrentStep("role");
  };

  const handleRoleNext = (role: UserRole) => {
    setSignUpData((prev) => ({ ...prev, role }));
    setCurrentStep("details");
  };

  const handleDetailsNext = (personalDetails: PersonalDetailsData) => {
    setSignUpData((prev) => ({ ...prev, personalDetails }));
    setCurrentStep("terms");
  };

  const handleTermsNext = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Uncomment this to call the signup API
      // Call the signup function from AuthContext
      // if (signup && signUpData.role && signUpData.personalDetails) {
      //   await signup({
      //     email: signUpData.email,
      //     password: signUpData.password,
      //     role: signUpData.role,
      //     name: signUpData.personalDetails.fullName,
      //     ...signUpData.personalDetails,
      //   });
      // }

      // For now, just navigate to complete page
      setCurrentStep("complete");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const steps: SignUpStep[] = [
      "initial",
      "role",
      "details",
      "terms",
      "complete",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  if (isSubmitting) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f0f0f",
        }}
      >
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p>Creating your account...</p>
        </div>
      </div>
    );
  }

  switch (currentStep) {
    case "initial":
      return (
        <SignUpInitial
          onNext={handleInitialNext}
          initialData={{
            email: signUpData.email,
            password: signUpData.password,
          }}
        />
      );
    case "role":
      return (
        <RoleSelection
          onNext={handleRoleNext}
          onBack={handleBack}
          initialRole={signUpData.role}
        />
      );
    case "details":
      return (
        <PersonalDetails
          onNext={handleDetailsNext}
          onBack={handleBack}
          initialData={signUpData.personalDetails}
        />
      );
    case "terms":
      return (
        <TermsAndConditions onNext={handleTermsNext} onBack={handleBack} />
      );
    case "complete":
      return <RegistrationComplete />;
    default:
      return null;
  }
};

export default SignUp;
